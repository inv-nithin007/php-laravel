# School Management System - Laravel Backend

A simple Laravel 12 backend API for managing students and teachers with JWT authentication.

## Requirements

- PHP >= 8.2
- Composer
- MySQL/PostgreSQL/SQLite
- Node.js & NPM (for frontend)

## Installation Steps

### 1. Install Dependencies

```bash
composer install
```

### 2. Install JWT Package

```bash
composer require tymon/jwt-auth
```

### 3. Environment Setup

Copy the example environment file:
```bash
cp .env.example .env
```

### 4. Generate Application Key

```bash
php artisan key:generate
```

### 5. Generate JWT Secret

```bash
php artisan jwt:secret
```

### 6. Database Configuration

Update your `.env` file with database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=school_management
DB_USERNAME=your_username
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret_key
JWT_TTL=60
```

### 7. Run Migrations

```bash
php artisan migrate
```

### 8. Start the Server

```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user
- `POST /api/auth/logout` - Logout user (requires token)
- `GET /api/auth/me` - Get current user (requires token)

### Teachers (requires authentication)

- `GET /api/teachers` - Get all teachers
- `POST /api/teachers` - Create new teacher
- `GET /api/teachers/{id}` - Get specific teacher
- `PUT /api/teachers/{id}` - Update teacher
- `DELETE /api/teachers/{id}` - Delete teacher

### Students (requires authentication)

- `GET /api/students` - Get all students
- `POST /api/students` - Create new student
- `GET /api/students/{id}` - Get specific student
- `PUT /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Delete student

## Sample API Requests

### Login
```json
POST /api/auth/login
{
    "username": "teacher1",
    "password": "password123"
}
```

### Create Teacher
```json
POST /api/teachers
Authorization: Bearer {your_jwt_token}
{
    "username": "teacher1",
    "email": "teacher1@school.com",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "1234567890",
    "subject_specialization": "Mathematics",
    "employee_id": "EMP001",
    "date_of_joining": "2024-01-15"
}
```

### Create Student
```json
POST /api/students
Authorization: Bearer {your_jwt_token}
{
    "username": "student1",
    "email": "student1@school.com",
    "password": "password123",
    "first_name": "Jane",
    "last_name": "Smith",
    "phone_number": "0987654321",
    "roll_number": "ROLL001",
    "class_grade": "10th Grade",
    "date_of_birth": "2008-05-20",
    "admission_date": "2024-01-20",
    "assigned_teacher_id": 1
}
```

## Database Schema

### Users Table
- id, username, email, password, role (teacher/student), status, timestamps

### Teachers Table
- id, user_id, first_name, last_name, email, phone_number, subject_specialization, employee_id, date_of_joining, status, timestamps

### Students Table
- id, user_id, first_name, last_name, email, phone_number, roll_number, class_grade, date_of_birth, admission_date, assigned_teacher_id, status, timestamps

## Features

- JWT Token-based authentication
- Role-based access (Teacher/Student)
- Complete CRUD operations for Teachers and Students
- Proper validation and error handling
- Database relationships (Teacher-Student assignment)
- Simple and clean code structure

## Testing

You can test the APIs using Postman, Thunder Client, or any API testing tool.

1. First, login to get the JWT token
2. Use the token in Authorization header: `Bearer {token}`
3. Make requests to the protected endpoints

## Frontend Integration

This backend is ready to be integrated with React, Vue.js, or any frontend framework. The API returns JSON responses with consistent structure:

```json
{
    "success": true/false,
    "message": "Response message",
    "data": {}, // Response data
    "errors": {} // Validation errors (if any)
}
```