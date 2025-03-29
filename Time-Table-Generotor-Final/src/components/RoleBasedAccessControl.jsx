import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Paper, Typography, CircularProgress, Tooltip, Button } from '@mui/material';
import Swal from 'sweetalert2';

const RoleBasedAccessControl = () => {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get('/api/user-role', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUserRole(response.data.role);
      } catch (error) {
        console.error('Error fetching user role:', error);
        Swal.fire({
          text: 'Error fetching user role',
          icon: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  const handleRestrictedAction = () => {
    Swal.fire({
      text: 'You do not have permission to perform this action.',
      icon: 'warning',
    });
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper variant="outlined" sx={{ my: 3, p: 3 }}>
        <Typography component="h1" variant="h5">
          Role-Based Access Control
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography variant="body1">
              Your role: {userRole}
            </Typography>
            {userRole === 'admin' ? (
              <Tooltip title="Perform an admin action">
                <Button variant="contained" color="primary">
                  Admin Action
                </Button>
              </Tooltip>
            ) : (
              <Tooltip title="You do not have permission to perform this action">
                <Button variant="contained" color="secondary" onClick={handleRestrictedAction}>
                  Restricted Action
                </Button>
              </Tooltip>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default RoleBasedAccessControl;
