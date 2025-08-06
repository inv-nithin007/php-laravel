// Professional Teacher Registration Component
import React, { useState } from 'react';
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

const SUBJECTS = [
  "Mathematics", "Science", "English", "History", "Geography",
  "Physics", "Chemistry", "Biology", "Computer Science", "Art",
  "Physical Education", "Music", "Economics", "Psychology", "Sociology"
];

export default function RegisterTeacher({ onClose }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
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

  // Check authorization when component starts
  React.useEffect(() => {
    checkAuthorization();
  }, []);

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

  const onSubmit = async (formData) => {
    setMessage('');
    setLoading(true);

    try {
      const teacherData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber,
        subject_specialization: formData.subjectSpecialization,
        employee_id: formData.employeeId,
        date_of_joining: formData.dateOfJoining
      };

      // API call to register teacher using axios (with automatic token handling)
      const response = await axios.post('/api/teachers', teacherData);
      
      if (response.data.success) {
        setMessage('Teacher registered successfully!');
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setMessage(response.data.message || 'Error registering teacher');
      }
      
    } catch (error) {
      console.error('Teacher registration error:', error);
      
      // Handle axios errors properly
      if (error.response) {
        // Server responded with error status (422, 500, etc.)
        const errorMessage = error.response.data?.message || 
                            error.response.data?.errors?.username ||
                            error.response.data?.errors?.email?.[0] ||
                            error.response.data?.errors?.employee_id?.[0] ||
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
      
    }}>
      <Box sx={{ marginTop: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Register New Teacher
        </Typography>
        
        {message && (
          <Alert >
            {message}
          </Alert>
        )}

        <Paper sx={{ padding: 4, margin: '0 auto' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h6" sx={{ marginBottom: 3 }}>Teacher Details</Typography>
            
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
              
              <TextField
                label="Phone Number"
                type="number"
                placeholder="Enter phone number"
                sx={{ marginBottom: 3, mr: 2 }}
                {...register("phoneNumber", { required: "Phone number is required" })}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
                required
              />
            </Box>
            
            <Box display="flex" alignItems="center" mb={4}>
              <TextField
                select
                label="Subject Specialization"
                sx={{ marginBottom: 3, mr: 2, maxWidth:'230px', width:'100%' }}
                {...register("subjectSpecialization", { required: "Subject specialization is required" })}
                error={!!errors.subjectSpecialization}
                helperText={errors.subjectSpecialization?.message}
                required
              >
                {SUBJECTS.map((subject) => (
                  <MenuItem key={subject} value={subject}>
                    {subject}
                  </MenuItem>
                ))}
              </TextField>
              
              <TextField
                label="Employee ID"
                placeholder="Enter employee ID"
                sx={{ marginBottom: 3, mr: 2 }}
                {...register("employeeId", { required: "Employee ID is required" })}
                error={!!errors.employeeId}
                helperText={errors.employeeId?.message}
                required
              />

              <TextField
                label="Date of Joining"
                type="date"
                InputLabelProps={{ shrink: true }}
                sx={{ marginBottom: 3, mr: 2 }}
                {...register("dateOfJoining", { required: "Date of joining is required" })}
                error={!!errors.dateOfJoining}
                helperText={errors.dateOfJoining?.message}
                required
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
              <Button
                variant="outlined"
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
                disabled={loading || isSubmitting}
              >
                {loading || isSubmitting ? "Registering..." : "Register Teacher"}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}