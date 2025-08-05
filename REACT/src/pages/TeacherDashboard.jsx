import { Box, Typography, Card, CardContent, Button, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios"; 

export default function TeacherDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token || !userData) {
      navigate("/login");
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser({
      name: parsedUser.first_name || parsedUser.username,
      role: "teacher",
      email: parsedUser.email
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };




  if (!user) {
    return (
      <Box sx={{ 
        maxWidth: '400px', 
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
      maxWidth: '1000px', 
      margin: '0 auto', 
      padding: 2,
      
    }}>
      
      <Box mt={5}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h3">Teacher Dashboard</Typography>

        </Box>
        
        <Box mb={4}>
          <Typography variant="h5" mb={2}>Welcome back, {user.name}!</Typography>
          <Typography color="textSecondary" mb={1}>
            Email: {user.email}
          </Typography>
        </Box>

        <Box>
          <Typography variant="h5" mb={3}>Actions</Typography>
          <Box display="flex" alignItems="center" mb={4}>
          <Button
            variant="contained"
            sx={{py:2, mb: 2,mr:2 }}
            onClick={() => navigate('/students')}
          >
            View All Students
          </Button>
          
          <Button
            variant="contained"
            sx={{ py: 2, mb: 2 ,mr:2}}
            onClick={() => navigate('/teachers')}
          >
            View All Teachers
          </Button>
          
          <Button
            variant="contained"
            sx={{ py: 2, mb: 2 ,mr:2}}
            onClick={() => navigate('/teacher-profile')}
          >
            Update Profile
          </Button>

          <Button
            variant="contained"
            onClick={()=>navigate('/change')}
            sx={{ py: 2,mb:2 ,mr:2}}
          >
            Change Password
          </Button>

          </Box>
                               <Button variant="contained" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Box>
      
    </Box>
  );
}
