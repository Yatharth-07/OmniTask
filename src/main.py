from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.database import engine, Base
from src.routers import auth_router, tasks_router, users_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="OmniTask Backend",
    description="Backend API with JWT Auth, Role-based Task CRUD operations",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(tasks_router.router)
app.include_router(users_router.router)

@app.get("/")
def root():
    return {"message": "Welcome to OmniTask Backend API"}
