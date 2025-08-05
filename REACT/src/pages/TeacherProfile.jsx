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

const SUBJECTS = [
  "Mathematics", "Science", "English", "History", "Geography",
  "Physics", "Chemistry", "Biology", "Computer Science", "Art",
  "Physical Education", "Music", "Economics", "Psychology", "Sociology"
];

export default function TeacherProfile() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  
  // React Hook Form
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/api/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (result.success) {
        setProfileData(result.data);
        // Pre-fill form with existing data
        reset({
          firstName: result.data.first_name,
          lastName: result.data.last_name,
          email: result.data.email,
          phoneNumber: result.data.phone_number
          // subjectSpecialization removed - only admin can update this
        });
      } else {
        setMessage('Error loading profile data');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setMessage('Error loading profile data');
    }
  };

  const onSubmit = async (formData) => {
    setMessage('');
    setLoading(true);

    try {
      const updateData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phoneNumber
        // subject_specialization removed - only admin can update this
      };

      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage('Profile updated successfully!');
        // Update localStorage user data if email changed
        if (formData.email !== profileData.email) {
          const userData = JSON.parse(localStorage.getItem('user'));
          userData.email = formData.email;
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } else {
        setMessage(result.message || 'Error updating profile');
      }
      
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage('Update failed. Please try again.');
    }
    
    setLoading(false);
  };

  if (!profileData) {
    return (
      <Box sx={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        padding: 2,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography variant="h6">Loading profile...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: 2,
      minHeight: '100vh'
    }}>
      <Box sx={{ marginTop: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Update Profile
        </Typography>
        
        {message && (
          <Alert severity={message.includes('successfully') ? 'success' : 'error'} sx={{ marginBottom: 2 }}>
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
              
              <Box sx={{ marginBottom: 3, mr: 2, maxWidth:'300px', width:'100%' }}>
                <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                  Subject: {profileData?.subject_specialization || 'Not specified'}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/teacher-dashboard')}
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
                {loading || isSubmitting ? "Updating..." : "Update Profile"}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}