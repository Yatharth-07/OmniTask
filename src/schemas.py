from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)
    role: Optional[str] = "user"

class UserLogin(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    role: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Task Schemas
class TaskBase(BaseModel):
    title: str = Field(..., min_length=1)
    description: Optional[str] = None
    status: Optional[str] = "pending"

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1)
    description: Optional[str] = None
    status: Optional[str] = None

class TaskResponse(TaskBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[int] = None
    role: Optional[str] = None
