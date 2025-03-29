import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Paper, Typography, CircularProgress, Tooltip } from '@mui/material';
import Swal from 'sweetalert2';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CSSTransition } from 'react-transition-group';
import { motion } from 'framer-motion';

const UserLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (username.trim() === '' || password.trim() === '') {
      Swal.fire({
        text: 'Please fill in all fields.',
        icon: 'warning',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/token', {
        username,
        password,
      });
      console.log('User logged in:', response.data);
      setUsername('');
      setPassword('');
      Swal.fire({
        text: 'User logged in successfully!',
        icon: 'success',
      });
    } catch (error) {
      console.error('Error logging in user:', error);
      Swal.fire({
        text: 'Error logging in user',
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper variant="outlined" sx={{ my: 3, p: 3 }}>
        <CSSTransition in={!loading} timeout={300} classNames="fade">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography component="h1" variant="h5">
              User Login
            </Typography>
            <form onSubmit={handleSubmit}>
              <Tooltip title="Enter your username">
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Tooltip>
              <Tooltip title="Enter your password">
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="password"
                  label="Password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Tooltip>
              <Button type="submit" fullWidth variant="contained" color="primary">
                Login
              </Button>
            </form>
            {loading && <CircularProgress />}
          </motion.div>
        </CSSTransition>
      </Paper>
    </Container>
  );
};

export default UserLogin;
