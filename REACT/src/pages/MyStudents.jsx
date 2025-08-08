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

export default function MyStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchMyStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/my-students');
      setStudents(response.data.data || []);
      setMessage(''); 
    } catch (error) {
      console.error('Error fetching students:', error);
      setMessage('Error loading students');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/teacher-dashboard');
  };

  useEffect(() => {
    fetchMyStudents();
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
        My Students
      </Typography>
      
      {message && (
        <Alert 
          severity="error"
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      )}

      {students.length === 0 ? (
        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" align="center">
            No students assigned to you
          </Typography>
        </Paper>
      ) : (
        students.map((student, index) => (
          <Paper key={student.id || index} elevation={1} sx={{ p: 3, mb: 2 }}>
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
              <Typography variant="body2" color="textSecondary">
                Status: {student.status}
              </Typography>
            </Box>
          </Paper>
        ))
      )}

      <Box textAlign="center" sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button 
          onClick={fetchMyStudents}
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