import { Box, Typography, TextField, Button, Paper, Alert } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "../utils/axios";

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    clearErrors,
    setError
  } = useForm();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/profile');
      if (response.data.success) {
        setProfile(response.data.data);
        const profileData = response.data.data;
        setValue('first_name', profileData.first_name || '');
        setValue('last_name', profileData.last_name || '');
        setValue('email', profileData.email || '');
        setValue('phone_number', profileData.phone_number || '');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setMessage({ type: '', text: '' });
    clearErrors();

    try {
      const response = await axios.put('/api/profile', data);
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setProfile(response.data.data);
        
        // Update localStorage with the new user data
        const updatedUserData = response.data.user;
        localStorage.setItem('user', JSON.stringify(updatedUserData));
      }
    } catch (error) {
      if (error.response?.status === 422) {
        // Handle validation errors
        const backendErrors = error.response.data.errors;
        if (backendErrors) {
          Object.keys(backendErrors).forEach(field => {
            setError(field, {
              type: 'server',
              message: backendErrors[field][0]
            });
          });
        }
        const errorMessage = error.response.data.message || 'Please check the form for errors';
        setMessage({ type: 'error', text: errorMessage });
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to update profile';
        setMessage({ type: 'error', text: errorMessage });
      }
    }
  };

  const handleBack = () => {
    navigate('/student-dashboard');
  };

  if (loading) {
    return (
      <Box sx={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        padding: 2,
        textAlign: 'center',
        mt: 10
      }}>
        <Typography variant="h5">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: 2,
      mt: 4
    }}>
      <Button 
        variant="outlined" 
        onClick={handleBack}
        sx={{ mb: 3 }}
      >
        ← Back to Dashboard
      </Button>

      <Paper sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Update Student Profile
        </Typography>

        {message.text && (
          <Alert severity={message.type} sx={{ mb: 3 }}>
            {message.text}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="First Name"
            margin="normal"
            required
            error={!!errors.first_name}
            helperText={errors.first_name?.message}
            {...register('first_name', {
              required: 'First name is required',
              minLength: {
                value: 2,
                message: 'Minimum 2 characters required'
              }
            })}
          />

          <TextField
            fullWidth
            label="Last Name"
            margin="normal"
            required
            error={!!errors.last_name}
            helperText={errors.last_name?.message}
            {...register('last_name', {
              required: 'Last name is required',
              minLength: {
                value: 2,
                message: 'Minimum 2 characters required'
              }
            })}
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            required
            error={!!errors.email}
            helperText={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email'
              }
            })}
          />

          <TextField
            fullWidth
            label="Phone Number"
            margin="normal"
            required
            error={!!errors.phone_number}
            helperText={errors.phone_number?.message || '10 digits only'}
            inputProps={{
              maxLength: 10,
              pattern: '[0-9]*',
              inputMode: 'numeric'
            }}
            {...register('phone_number', {
              required: 'Phone number is required',
              pattern: {
                value: /^\d{10}$/,
                message: 'Must be exactly 10 digits'
              },
              setValueAs: (value) => value.replace(/\D/g, '').slice(0, 10)
            })}
          />


          {profile && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography color="textSecondary" variant="body2">
                Roll Number: {profile.roll_number} (Read Only)
              </Typography>
              <Typography color="textSecondary" variant="body2">
                Class Grade: {profile.class_grade} (Read Only)
              </Typography>
              <Typography color="textSecondary" variant="body2">
                Date of Birth: {profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : 'Not set'} (Read Only)
              </Typography>
              {profile.assigned_teacher && (
                <Typography color="textSecondary" variant="body2">
                  Assigned Teacher: {profile.assigned_teacher.first_name} {profile.assigned_teacher.last_name}
                </Typography>
              )}
            </Box>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}