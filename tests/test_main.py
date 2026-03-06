import pytest
from src import auth
from datetime import timedelta

# UNIT TESTS
def test_password_hashing():
    password = "secretpassword"
    hashed = auth.get_password_hash(password)
    assert hashed != password
    assert auth.verify_password(password, hashed) is True

def test_verify_wrong_password():
    password = "secretpassword"
    hashed = auth.get_password_hash(password)
    assert auth.verify_password("wrongpassword", hashed) is False

def test_create_access_token():
    data = {"sub": "1", "role": "user"}
    token = auth.create_access_token(data, timedelta(minutes=10))
    assert isinstance(token, str)
    assert len(token) > 20

# API TESTS
def test_register_user(client):
    response = client.post(
        "/auth/register",
        json={"email": "test@example.com", "password": "password123", "role": "user"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["role"] == "user"
    assert "id" in data

def test_login_and_create_task(client):
    response = client.post(
        "/auth/register",
        json={"email": "taskuser@example.com", "password": "password123"}
    )
    assert response.status_code == 201

    login_response = client.post(
        "/auth/login",
        json={"email": "taskuser@example.com", "password": "password123"}
    )
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    task_response = client.post(
        "/tasks/",
        json={"title": "My first task", "description": "This is a test task"},
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert task_response.status_code == 201
    data = task_response.json()
    assert data["title"] == "My first task"
    assert data["status"] == "pending"

def test_unauthorized_access(client):
    response = client.get("/tasks/")
    assert response.status_code == 403

def test_get_tasks(client):
    # Register and login
    client.post("/auth/register", json={"email": "gettask@example.com", "password": "password123", "role": "user"})
    token = client.post("/auth/login", json={"email": "gettask@example.com", "password": "password123"}).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create task
    client.post("/tasks/", json={"title": "Task 1", "description": "Desc"}, headers=headers)
    
    # Get tasks
    response = client.get("/tasks/", headers=headers)
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) >= 1
    assert tasks[-1]["title"] == "Task 1"

def test_update_task(client):
    client.post("/auth/register", json={"email": "updatetask@example.com", "password": "password123", "role": "user"})
    token = client.post("/auth/login", json={"email": "updatetask@example.com", "password": "password123"}).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create
    task_response = client.post("/tasks/", json={"title": "Old Title", "description": "Old", "status": "pending"}, headers=headers)
    task_id = task_response.json()["id"]
    
    # Update
    update_response = client.put(f"/tasks/{task_id}", json={"title": "New Title", "description": "New", "status": "completed"}, headers=headers)
    assert update_response.status_code == 200
    data = update_response.json()
    assert data["title"] == "New Title"
    assert data["status"] == "completed"

def test_delete_task(client):
    client.post("/auth/register", json={"email": "deletetask@example.com", "password": "password123", "role": "user"})
    token = client.post("/auth/login", json={"email": "deletetask@example.com", "password": "password123"}).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create
    task_response = client.post("/tasks/", json={"title": "Delete me", "description": ""}, headers=headers)
    task_id = task_response.json()["id"]
    
    # Delete
    delete_response = client.delete(f"/tasks/{task_id}", headers=headers)
    assert delete_response.status_code == 200
    
    # Verify deleted
    get_response = client.get("/tasks/", headers=headers)
    assert get_response.status_code == 200
    tasks = get_response.json()
    assert not any(t["id"] == task_id for t in tasks)

def test_admin_get_all_tasks(client):
    client.post("/auth/register", json={"email": "admin@example.com", "password": "password123", "role": "admin"})
    token = client.post("/auth/login", json={"email": "admin@example.com", "password": "password123"}).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    client.post("/auth/register", json={"email": "userforadmin@example.com", "password": "password123", "role": "user"})
    user_token = client.post("/auth/login", json={"email": "userforadmin@example.com", "password": "password123"}).json()["access_token"]
    user_headers = {"Authorization": f"Bearer {user_token}"}
    client.post("/tasks/", json={"title": "User task", "description": ""}, headers=user_headers)
    
    response = client.get("/tasks/", headers=headers)
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) >= 1
    assert any(t["title"] == "User task" for t in tasks)

def test_admin_delete_user(client):
    # Admin
    client.post("/auth/register", json={"email": "admin2@example.com", "password": "password123", "role": "admin"})
    admin_token = client.post("/auth/login", json={"email": "admin2@example.com", "password": "password123"}).json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    
    # User to delete
    user_response = client.post("/auth/register", json={"email": "deluser@example.com", "password": "password123", "role": "user"})
    user_id = user_response.json()["id"]
    
    delete_response = client.delete(f"/users/{user_id}", headers=admin_headers)
    assert delete_response.status_code == 200
