import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  Alert
} from '@mui/material';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Box maxWidth="800px" margin="0 auto" padding={3}>
      <Typography variant="h4" align="center" gutterBottom>
        Admin Dashboard
      </Typography>
      
      <Typography variant="h6" align="center" gutterBottom>
        Welcome, {user.username}
      </Typography>


      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Manage Teachers</Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button 
            variant="contained" 
            onClick={() => navigate("/register-teacher")}
          >
            Add Teacher
          </Button>
          <Button 
            variant="outlined"
            onClick={() => navigate("/teachers-list")}
          >
            View All Teachers
          </Button>
        </Box>
      </Paper>

      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Manage Students</Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button 
            variant="contained" 
            onClick={() => navigate("/register-student")}
          >
            Add Student
          </Button>
          <Button 
            variant="outlined"
            onClick={() => navigate("/students-list")}
          >
            View All Students
          </Button>
        </Box>
      </Paper>

      <Box textAlign="center">
        <Button 
          onClick={handleLogout}
          variant="contained"
          color="error"
          size="large"
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
}