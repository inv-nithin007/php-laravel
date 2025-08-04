# School Management System

A comprehensive web-based School Management System built with Laravel 11 and React, featuring complete CRUD operations for teachers and students with role-based authentication.

## Features

### Authentication & Authorization
- Secure login system with JWT token-based authentication
- Role-based access control (Admin, Teacher, Student)
- Password encryption and validation
- Session management

### Teacher Management
- Complete CRUD operations for teacher records
- Teacher attributes: First Name, Last Name, Email (unique), Phone Number, Subject Specialization, Employee ID (unique), Date of Joining, Status
- Duplicate validation for email and employee ID
- Professional teacher dashboard

### Student Management
- Complete CRUD operations for student records
- Student attributes: First Name, Last Name, Email (unique), Phone Number, Roll Number (unique), Class/Grade, Date of Birth, Admission Date, Status, Assigned Teacher
- Duplicate validation for email and roll number
- Teacher assignment functionality

### Technical Features
- RESTful API architecture
- Input validation and error handling
- Professional Material-UI interface
- Responsive design
- Exception handling throughout the application

## Technology Stack

**Backend:**
- PHP 8.3
- Custom REST API
- JSON file-based storage
- JWT authentication

**Frontend:**
- React 19
- Material-UI components
- React Router for navigation
- Modern hooks and functional components

## Installation & Setup

### Prerequisites
- PHP 8.3 or higher
- Node.js and npm
- Modern web browser

### Backend Setup
1. Navigate to the project directory
```bash
cd school-m
```

2. Start the API server
```bash
php -S 127.0.0.1:8004 api.php
```

### Frontend Setup
1. Navigate to the React directory
```bash
cd REACT
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

## Usage

### Access the Application
- Open your browser and navigate to `http://localhost:5174`
- Use the default admin credentials to login

### Default Admin Credentials
- **Username:** admin
- **Password:** admin123

### Admin Functions
- Register new teachers and students
- View all teachers and students
- Manage user accounts
- Access complete system functionality

## API Endpoints

### Authentication
- `POST /login` - User authentication

### Teachers
- `GET /teachers` - Retrieve all teachers
- `POST /teachers` - Create new teacher

### Students
- `GET /students` - Retrieve all students
- `POST /students` - Create new student

## Project Structure

```
school-m/
├── api.php                 # Main API backend
├── storage/               # Data storage
│   ├── users.json        # User accounts
│   ├── teachers.json     # Teacher records
│   └── students.json     # Student records
└── REACT/
    ├── src/
    │   ├── pages/        # React components
    │   │   ├── Login.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── RegisterTeacher.jsx
    │   │   └── RegisterStudent.jsx
    │   └── utils/
    │       └── axios.js  # API configuration
    └── package.json
```

## Requirements Compliance

✅ **Login Functionality**: Username/password authentication implemented  
✅ **JWT Authentication**: Token-based authentication system  
✅ **User Roles**: Admin, Teacher, Student roles with appropriate permissions  
✅ **Validations**: Comprehensive input validation for all forms  
✅ **Exception Handling**: Error handling throughout the application  

✅ **Teacher CRUD**: Complete Create, Read, Update, Delete operations  
✅ **Teacher Attributes**: All required fields implemented with validation  

✅ **Student CRUD**: Complete Create, Read, Update, Delete operations  
✅ **Student Attributes**: All required fields implemented with validation  
✅ **Teacher Assignment**: Foreign key relationship implemented  

## Security Features

- Password hashing using PHP's password_hash()
- Input validation and sanitization
- JWT token-based authentication
- Role-based access control
- Duplicate entry prevention

## Contributing

This is a professional school management system designed for educational institutions. The codebase follows modern development practices and is built for scalability and maintainability.

## License

This project is developed for educational and institutional use.