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

export default function StudentsList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

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
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/students');
        console.log('Students response:', response.data);
        setStudents(response.data.data || response.data || []);
      } catch (error) {
        console.error('Error fetching students:', error);
        setMessage('Error loading students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <Box maxWidth="800px" margin="0 auto" padding={3}>
        <Typography variant="h5" align="center">Loading students...</Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth="1000px" margin="0 auto" padding={3}>
      <Typography variant="h4" align="center" gutterBottom>
        All Students
      </Typography>
      
      {message && (
        <Alert sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {students.length === 0 ? (
        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" align="center">
            No students found
          </Typography>
        </Paper>
      ) : (
        students.map((student, index) => (
          <Paper key={student.id || index} elevation={1} sx={{ p: 3, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6">
                  {student.first_name} {student.last_name}
                </Typography>
                <Typography variant="body2">
                  Email: {student.email}
                </Typography>
                <Typography variant="body2">
                  Roll Number: {student.roll_number}
                </Typography>
                <Typography variant="body2">
                  Class: {student.class_grade}
                </Typography>
                <Typography variant="body2">
                  Phone: {student.phone_number}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Status: {student.status}
                </Typography>
              </Box>
            </Box>
          </Paper>
        ))
      )}

      <Box textAlign="center">
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