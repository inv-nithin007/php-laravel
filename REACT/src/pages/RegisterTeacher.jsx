// Professional Teacher Registration Component
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  Paper,
  MenuItem
} from '@mui/material';

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
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    subjectSpecialization: '',
    employeeId: '',
    dateOfJoining: ''
  });

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

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const validateForm = () => {
    if (!formData.username) return 'Username is required';
    if (!formData.email) return 'Email is required';
    if (!formData.password) return 'Password is required';
    if (!formData.firstName) return 'First name is required';
    if (!formData.lastName) return 'Last name is required';
    if (!formData.phoneNumber) return 'Phone number is required';
    if (!formData.subjectSpecialization) return 'Subject specialization is required';
    if (!formData.employeeId) return 'Employee ID is required';
    if (!formData.dateOfJoining) return 'Date of joining is required';
    
    if (!formData.email.includes('@')) {
      return 'Please enter a valid email';
    }
    
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    const error = validateForm();
    if (error) {
      setMessage(error);
      return;
    }
    
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

      // Get admin token for authentication
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (!token) {
        setMessage('Authentication required. Please login as admin.');
        return;
      }

      // Check if user is admin
      if (!userData) {
        setMessage('User data not found. Please login again.');
        return;
      }

      const user = JSON.parse(userData);
      if (user.role !== 'admin') {
        setMessage('Access denied. Only administrators can create teachers.');
        return;
      }

      // API call to register teacher
      const response = await fetch('http://127.0.0.1:8000/api/teachers', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(teacherData)
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage('Teacher registered successfully!');
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setMessage(result.message || 'Error registering teacher');
      }
      
    } catch (error) {
      console.error('Teacher registration error:', error);
      setMessage('Registration failed. Please try again.');
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
          <form onSubmit={onSubmit}>
            <Typography variant="h6" sx={{ marginBottom: 3 }}>Teacher Details</Typography>
        <Box display="flex"  alignItems="center" mb={4}>
            <TextField
             
              label="First Name"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              placeholder="Enter first name"
              sx={{ marginBottom: 3 ,mr:2}}
              required
            />
            
            <TextField
              
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              placeholder="Enter last name"
              sx={{ marginBottom: 3,mr:2 }}
              required
            />

            <TextField
              
              label="Username"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              placeholder="Enter username"
              sx={{ marginBottom: 3 ,mr:2}}
              required
            />
            </Box>
            <Box display="flex"  alignItems="center" mb={4}>
            
            <TextField
              
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Enter email"
              sx={{ marginBottom: 3 ,mr:2}}
              required
            />

            <TextField
              
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="Enter password"
              sx={{ marginBottom: 3 ,mr:2}}
              required
            />
            
            <TextField
              
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              placeholder="Enter phone number"
              sx={{ marginBottom: 3 ,mr:2}}
              required
            />
            </Box>
        <Box display="flex"  alignItems="center" mb={4}>
            <TextField

              select
              label="Subject Specialization"
              value={formData.subjectSpecialization}
              onChange={(e) => handleChange('subjectSpecialization', e.target.value)}
              sx={{ marginBottom: 3,mr:2 ,maxWidth:'230px',width:'100%'}}
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
              value={formData.employeeId}
              onChange={(e) => handleChange('employeeId', e.target.value)}
              placeholder="Enter employee ID"
              sx={{ marginBottom: 3,mr:2 }}
              required
            />

            <TextField
              
              label="Date of Joining"
              type="date"
              value={formData.dateOfJoining}
              onChange={(e) => handleChange('dateOfJoining', e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ marginBottom: 3,mr:2 }}
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
                disabled={loading}
              >
                {loading ? "Registering..." : "Register Teacher"}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}