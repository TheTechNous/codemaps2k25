import React, { useState, useEffect } from 'react';
import { getNotifications } from '../api/notifications';
import { motion } from 'framer-motion';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { Button, List, ListItem, ListItemText, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newNotification, setNewNotification] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await getNotifications();
      setNotifications(data);
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1];
      setMessage(`${latestNotification.title}: ${latestNotification.message}`);
      setOpen(true);
    }
  }, [notifications]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleNewNotificationChange = (event) => {
    setNewNotification(event.target.value);
  };

  const handleNewNotificationSubmit = () => {
    // Placeholder for new notification submission logic
    console.log('New notification submitted:', newNotification);
    setNewNotification('');
    setDialogOpen(false);
  };

  return (
    <div className="notification-system">
      <Typography variant="h6" gutterBottom>
        Notifications
      </Typography>
      <List>
        {notifications.map((notification) => (
          <motion.li
            key={notification.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ListItem>
              <ListItemText
                primary={notification.title}
                secondary={notification.message}
              />
            </ListItem>
          </motion.li>
        ))}
      </List>
      <Button variant="contained" color="primary" onClick={handleDialogOpen}>
        Add Notification
      </Button>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add New Notification</DialogTitle>
        <DialogContent>
          <TextField
            label="Notification"
            value={newNotification}
            onChange={handleNewNotificationChange}
            fullWidth
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleNewNotificationSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="info">
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default NotificationSystem;
