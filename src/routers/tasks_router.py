from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from src import models, schemas, auth
from src.database import get_db

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.post("/", response_model=schemas.TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_task = models.Task(**task.model_dump(), user_id=current_user.id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.get("/", response_model=List[schemas.TaskResponse])
def read_tasks(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role == "admin":
        tasks = db.query(models.Task).all()
    else:
        tasks = db.query(models.Task).filter(models.Task.user_id == current_user.id).all()
    return tasks

@router.put("/{task_id}", response_model=schemas.TaskResponse)
def update_task(task_id: int, task_update: schemas.TaskUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    if db_task.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to update this task")
        
    update_data = task_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_task, key, value)
        
    db.commit()
    db.refresh(db_task)
    return db_task

@router.delete("/{task_id}", status_code=status.HTTP_200_OK)
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    if db_task.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to delete this task")
        
    db.delete(db_task)
    db.commit()
    return {"detail": "Task deleted successfully"}
