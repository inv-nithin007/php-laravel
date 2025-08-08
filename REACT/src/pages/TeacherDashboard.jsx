import { Box, Typography, Card, CardContent, Button, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios"; 

export default function TeacherDashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      navigate("/login");
      return;
    }
    
    // Fetch fresh profile data from API
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/profile');
        const profileData = response.data.data;
        
        setUser({
          name: profileData.first_name + ' ' + profileData.last_name,
          role: "teacher",
          email: profileData.email
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        navigate("/login");
      }
    };
    
    fetchProfile();
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
            onClick={() => navigate('/my-students')}
          >
            My Students
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
