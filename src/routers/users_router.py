from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from src import models, schemas, auth
from src.database import get_db

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/", response_model=List[schemas.UserResponse])
def get_all_users(db: Session = Depends(get_db), current_admin: models.User = Depends(auth.get_admin_user)):
    users = db.query(models.User).all()
    return users

@router.delete("/{user_id}", status_code=status.HTTP_200_OK)
def delete_user(user_id: int, db: Session = Depends(get_db), current_admin: models.User = Depends(auth.get_admin_user)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    db.delete(user)
    db.commit()
    return {"detail": "User deleted successfully"}
