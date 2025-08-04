# Dashboard Testing Guide

## How to Test Different Dashboards

### Method 1: Manual URL Testing
After logging in, you can directly visit these URLs to see different dashboards:

- **Admin Dashboard**: `http://localhost:5173/admin-dashboard`
- **Teacher Dashboard**: `http://localhost:5173/teacher-dashboard`  
- **Student Dashboard**: `http://localhost:5173/student-dashboard`

### Method 2: Modify Dashboard.jsx for Testing
In `src/pages/Dashboard.jsx`, line 47, change the navigation destination:

```javascript
// For Admin Dashboard
navigate("/admin-dashboard");

// For Teacher Dashboard  
navigate("/teacher-dashboard");

// For Student Dashboard
navigate("/student-dashboard");
```

### Method 3: Test Login Flow
1. Go to `http://localhost:5173/login`
2. Enter any username/password (will fail but that's ok for UI testing)
3. The system will redirect to admin dashboard by default

## What Each Dashboard Shows

### Admin Dashboard
- Total stats (Students: 156, Teachers: 24, etc.)
- Quick action buttons for managing students, teachers, exams
- Clean card-based layout

### Teacher Dashboard  
- Teacher-specific info (Subject: Mathematics)
- My Classes section showing assigned classes
- Actions for creating exams, viewing students, grading

### Student Dashboard
- Student info (Roll Number, Class, etc.)  
- Academic stats (Completed exams, Average score, Rank)
- Available exams to take
- Personal action buttons

## Features Included
- ✅ Material UI consistent styling
- ✅ Responsive grid layout
- ✅ Logout functionality
- ✅ Loading states
- ✅ Role-based content
- ✅ Demo data for visualization
- ✅ Simple, readable code structure

## Note
All buttons are UI-only (no backend functionality yet). This matches your requirement for "just viewing" dashboards that look complete but are non-functional.