import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Alert, 
  Paper
} from '@mui/material';
import axios from '../utils/axios';

export default function TeachersList() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/teachers');
      console.log('Teachers response:', response.data);
      setTeachers(response.data.data || []);

      setMessage(''); 
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setMessage('Error loading teachers');
    } finally {
      setLoading(false);
    }
  };

  // Get current user to check if admin
  const getCurrentUser = () => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  };

  const handleDeleteTeacher = async (teacherId) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) {
      return;
    }

    try {
      setDeleteLoading(teacherId);
      await axios.delete(`/api/teachers/${teacherId}`);
      setMessage('Teacher deleted successfully');
      // Remove deleted teacher from state
      setTeachers(teachers.filter(teacher => teacher.id !== teacherId));
    } catch (error) {
      console.error('Error deleting teacher:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      setMessage('Error deleting teacher: ' + errorMessage);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleBack = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (user.role === 'teacher') {
        navigate('/teacher-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  if (loading) {
    return (
      <Box maxWidth="800px" margin="0 auto" padding={3}>
        <Typography variant="h5" align="center">Loading teachers...</Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth="1000px" margin="0 auto" padding={3}>
      <Typography variant="h4" align="center" gutterBottom>
        All Teachers
      </Typography>
      
      {message && (
        <Alert 
          severity={message.includes('successfully') ? 'success' : 'error'} 
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      )}

      {teachers.length === 0 ? (
        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" align="center">
            No teachers found
          </Typography>
        </Paper>
      ) : (
        teachers.map((teacher, index) => (
          <Paper key={teacher.id || index} elevation={1} sx={{ p: 3, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6">
                  {teacher.first_name} {teacher.last_name}
                </Typography>
                <Typography variant="body2">
                  Email: {teacher.email}
                </Typography>
                <Typography variant="body2">
                  Subject: {teacher.subject_specialization}
                </Typography>
                <Typography variant="body2">
                  Employee ID: {teacher.employee_id}
                </Typography>
                <Typography variant="body2">
                  Phone: {teacher.phone_number}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  Status: {teacher.status}
                </Typography>
                {getCurrentUser()?.role === 'admin' && (
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleDeleteTeacher(teacher.id)}
                    disabled={deleteLoading === teacher.id}
                    sx={{ alignSelf: 'flex-end' }}
                  >
                    {deleteLoading === teacher.id ? 'Deleting...' : 'Delete'}
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        ))
      )}

      <Box textAlign="center" sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button 
          onClick={fetchTeachers}
          variant="contained"
          size="large"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh'}
        </Button>
        <Button 
          onClick={handleBack}
          variant="outlined"
          size="large"
        >
          Back to Dashboard
        </Button>
      </Box>
    </Box>
  );
}