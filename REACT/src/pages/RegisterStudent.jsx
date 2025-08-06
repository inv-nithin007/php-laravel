// Professional Student Registration Component
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  Paper,
  MenuItem
} from '@mui/material';
import axios from '../utils/axios';

const GRADE_CLASSES = [
  "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
  "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10",
  "Grade 11", "Grade 12"
];

export default function RegisterStudent({ onClose }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  // React Hook Form
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/admin-dashboard");
    }
  };

  // Check authorization and load teachers when component starts
  useEffect(() => {
    const initializeComponent = async () => {
      await checkAuthorization();
      // Only load teachers if authorized
      if (isAuthorized) {
        loadTeachers();
      }
    };
    
    initializeComponent();
  }, []);

  // Load teachers when authorization is confirmed
  useEffect(() => {
    if (isAuthorized) {
      loadTeachers();
    }
  }, [isAuthorized]);

  const checkAuthorization = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      setMessage('Authentication required. Please login as admin.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== 'admin') {
      setMessage('Access denied. Only administrators can access this page.');
      setTimeout(() => navigate('/admin-dashboard'), 2000);
      return;
    }

    setIsAuthorized(true);
  };

  const loadTeachers = async () => {
    try {
      const response = await axios.get('/api/teachers');
      setTeachers(response.data.data || []);
    } catch (error) {
      console.error('Error loading teachers:', error);
      setMessage('Failed to load teachers list');
    }
  };

  const onSubmit = async (formData) => {
    setMessage('');
    setLoading(true);

    try {
      const studentData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber,
        roll_number: formData.rollNumber,
        class_grade: formData.classGrade,
        date_of_birth: formData.dateOfBirth,
        admission_date: formData.admissionDate,
        assigned_teacher_id: formData.assignedTeacher || null
      };

      // API call to create student using axios (with automatic token handling)
      const response = await axios.post('/api/students', studentData);
      
      if (response.data.success) {
        setMessage('Student registered successfully!');
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setMessage(response.data.message || 'Error registering student');
      }
      
    } catch (error) {
      console.error('Student registration error:', error);
      
      // Handle axios errors properly
      if (error.response) {
        // Server responded with error status (422, 500, etc.)
        const errorMessage = error.response.data?.message || 
                            error.response.data?.errors?.username?.[0] ||
                            error.response.data?.errors?.email?.[0] ||
                            error.response.data?.errors?.roll_number?.[0] ||
                            'Registration failed';
        setMessage(errorMessage);
      } else if (error.request) {
        // Network error
        setMessage('Network error. Please check your connection.');
      } else {
        // Other error
        setMessage('Registration failed. Please try again.');
      }
    }
    
    setLoading(false);
  };



  return (
    <Box sx={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: 2,
      minHeight: '100vh'
    }}>
      <Box sx={{ marginTop: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Register New Student
        </Typography>
        
        {message && (
          <Alert severity={message.includes('successfully') ? 'success' : 'error'} sx={{ marginBottom: 2 }}>
            {message}
          </Alert>
        )}

        <Paper sx={{ padding: 4, margin: '0 auto' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h6" sx={{ marginBottom: 3 }}>Student Details</Typography>
            
            <Box display="flex" alignItems="center" mb={4}>
              <TextField
                label="First Name"
                placeholder="Enter first name"
                sx={{ marginBottom: 3, mr: 2 }}
                {...register("firstName", { required: "First name is required" })}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                required
              />
              
              <TextField
                label="Last Name"
                placeholder="Enter last name"
                sx={{ marginBottom: 3, mr: 2 }}
                {...register("lastName", { required: "Last name is required" })}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                required
              />

              <TextField
                label="Username"
                placeholder="Enter username"
                sx={{ marginBottom: 3, mr: 2 }}
                {...register("username", { required: "Username is required" })}
                error={!!errors.username}
                helperText={errors.username?.message}
                required
              />
            </Box>

            <Box display="flex" alignItems="center" mb={4}>
              <TextField
                label="Email"
                type="email"
                placeholder="Enter email"
                sx={{ marginBottom: 3, mr: 2 }}
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address"
                  }
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                required
              />

              <TextField
                label="Password"
                type="password"
                placeholder="Enter password"
                sx={{ marginBottom: 3, mr: 2 }}
                {...register("password", { 
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                required
              />
              
              <TextField
                label="Confirm Password"
                type="password"
                placeholder="Confirm password"
                sx={{ marginBottom: 3, mr: 2 }}
                {...register("confirmPassword", { 
                  required: "Please confirm your password",
                  validate: (value) => {
                    return value === watch('password') || "Passwords do not match";
                  }
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                required
              />
            </Box>

            

            <Box display="flex" alignItems="center" mb={4}>
              <TextField
                label="Roll Number"
                placeholder="Enter roll number"
                sx={{ marginBottom: 3, mr: 2 }}
                {...register("rollNumber", { required: "Roll number is required" })}
                error={!!errors.rollNumber}
                helperText={errors.rollNumber?.message}
                required
              />
              
              <TextField
                select
                label="Class/Grade"
                sx={{ marginBottom: 3, mr: 2, maxWidth:'230px', width:'100%' }}
                {...register("classGrade", { required: "Class grade is required" })}
                error={!!errors.classGrade}
                helperText={errors.classGrade?.message}
                required
              >
                {GRADE_CLASSES.map((grade) => (
                  <MenuItem key={grade} value={grade}>
                    {grade}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Date of Birth"
                type="date"
                InputLabelProps={{ shrink: true }}
                sx={{ marginBottom: 3, mr: 2 ,maxWidth:'230px', width:'100%'}}
                {...register("dateOfBirth", { required: "Date of birth is required" })}
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth?.message}
                required
              />
            </Box>

            <Box display="flex" alignItems="center" mb={4}>
              <TextField
                label="Phone Number"
                placeholder="Enter phone number"
                sx={{ marginBottom: 3, mr: 2 }}
                {...register("phoneNumber", { required: "Phone number is required" })}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
                required
              />
              <TextField
                label="Admission Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                sx={{ marginBottom: 3, mr: 2 ,maxWidth:'230px', width:'100%'}}
                {...register("admissionDate", { required: "Admission date is required" })}
                error={!!errors.admissionDate}
                helperText={errors.admissionDate?.message}
                required
              />

              <TextField
                select
                label="Assigned Teacher"
                sx={{ marginBottom: 0, mr: 2, maxWidth:'230px', width:'100%' }}
                {...register("assignedTeacher")}
                helperText={`${teachers.length} teachers available`}
              >
                <MenuItem value="">None</MenuItem>
                {teachers.map((teacher) => (
                  <MenuItem key={teacher.id} value={teacher.id}>
                    {teacher.first_name} {teacher.last_name} - {teacher.subject_specialization}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
              <Button
                variant="contained"
                color='error'
                size="large"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
              
              <Button 
                type="submit" 
                variant="contained" 
                size="large"
                disabled={loading}
              >
            Register Student
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}