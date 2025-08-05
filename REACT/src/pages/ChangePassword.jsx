import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  Paper
} from '@mui/material';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  
  // React Hook Form
  const { register, handleSubmit, reset, formState: { errors, isSubmitting }, watch } = useForm();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
  }, [navigate]);

  const onSubmit = async (formData) => {
    setMessage('');
    setLoading(true);

    try {
      const updateData = {
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
        new_password_confirmation: formData.confirmPassword
      };

      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/change-password', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage('Password changed successfully!');
        reset(); // Clear the form
      } else {
        setMessage(result.message || 'Error changing password');
      }
      
    } catch (error) {
      console.error('Password change error:', error);
      setMessage('Password change failed. Please try again.');
    }
    
    setLoading(false);
  };

  const handleBack = () => {
    if (user?.role === 'admin') {
      navigate('/admin-dashboard');
    } else if (user?.role === 'teacher') {
      navigate('/teacher-dashboard');
    } else if (user?.role === 'student') {
      navigate('/student-dashboard');
    } else {
      navigate('/login');
    }
  };

  // Watch password fields for validation
  const newPassword = watch('newPassword');

  if (!user) {
    return (
      <Box sx={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        padding: 2,
        
        display: 'flex',
        alignItems: 'center',
        
      }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: 2,
      
    }}>
      <Box sx={{ marginTop: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Change Password
        </Typography>
        
        {message && (
          <Alert>
            {message}
          </Alert>
        )}

        <Paper sx={{ padding: 4, margin: '0 auto' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h6" sx={{ marginBottom: 3 }}>Password Details</Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Current Password"
                type="password"
                placeholder="Enter current password"
                fullWidth
                {...register("currentPassword", { 
                  required: "Current password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
                
                helperText={errors.currentPassword?.message}
                required
              />
              
              <TextField
                label="New Password"
                type="password"
                placeholder="Enter new password"
                fullWidth
                {...register("newPassword", { 
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message}
                required
              />

              <TextField
                label="Confirm New Password"
                type="password"
                placeholder="Confirm new password"
                fullWidth
                {...register("confirmPassword", { 
                  required: "Please confirm your new password",
                  validate: value => value === newPassword || "Passwords do not match"
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                required
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
              <Button
                variant="outlined"
                size="large"
                onClick={handleBack}
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
                {loading || isSubmitting ? "Changing..." : "Change Password"}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}