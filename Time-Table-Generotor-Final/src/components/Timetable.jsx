import React, { useState, Suspense, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Swal from 'sweetalert2';
import { Paper, Typography, Tooltip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Grid, Snackbar, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';

const Timetable = ({ timetable }) => {
  const [events, setEvents] = useState(timetable);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [collaborationOpen, setCollaborationOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [calendarType, setCalendarType] = useState('');
  const [calendarLink, setCalendarLink] = useState('');
  const [integrationType, setIntegrationType] = useState('');
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [listId, setListId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(events);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setEvents(items);
  };

  const handleEventClick = (event) => {
    Swal.fire({
      title: 'Event Details',
      text: `Event: ${event.name}\nTime: ${event.time}`,
      icon: 'info',
    });
  };

  const handleAnalyticsOpen = () => {
    setAnalyticsOpen(true);
  };

  const handleAnalyticsClose = () => {
    setAnalyticsOpen(false);
  };

  const handleCollaborationOpen = () => {
    setCollaborationOpen(true);
  };

  const handleCollaborationClose = () => {
    setCollaborationOpen(false);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleCommentSubmit = () => {
    // Placeholder for comment submission logic
    console.log('Comment submitted:', comment);
    setComment('');
    setCollaborationOpen(false);
  };

  const handleCalendarTypeChange = (e) => setCalendarType(e.target.value);
  const handleCalendarLinkChange = (e) => setCalendarLink(e.target.value);

  const handleSync = async () => {
    if (calendarType.trim() === '' || calendarLink.trim() === '') {
      Swal.fire({
        text: 'Please fill in all fields.',
        icon: 'warning',
      });
      return;
    }

    try {
      const response = await axios.post('/calendar/sync', {
        type: calendarType,
        link: calendarLink,
      });
      console.log('Calendar synced:', response.data);
      Swal.fire({
        text: 'Calendar synced successfully!',
        icon: 'success',
      });
      setEvents(response.data.events);
    } catch (error) {
      console.error('Error syncing calendar:', error);
      Swal.fire({
        text: 'Error syncing calendar',
        icon: 'error',
      });
    }
  };

  const handleIntegrationTypeChange = (e) => setIntegrationType(e.target.value);
  const handleTaskNameChange = (e) => setTaskName(e.target.value);
  const handleTaskDescriptionChange = (e) => setTaskDescription(e.target.value);
  const handleDueDateChange = (e) => setDueDate(e.target.value);
  const handleListIdChange = (e) => setListId(e.target.value);
  const handleProjectIdChange = (e) => setProjectId(e.target.value);

  const handleIntegrationSubmit = async (event) => {
    event.preventDefault();

    if (integrationType === 'trello') {
      if (taskName.trim() === '' || taskDescription.trim() === '' || listId.trim() === '') {
        Swal.fire({
          text: 'Please fill in all fields for Trello.',
          icon: 'warning',
        });
        return;
      }

      setLoading(true);
      try {
        const response = await axios.post('/trello/create-task', {
          name: taskName,
          description: taskDescription,
          due_date: dueDate,
          list_id: listId,
        });
        console.log('Task created:', response.data);
        setTaskName('');
        setTaskDescription('');
        setDueDate('');
        setListId('');
        Swal.fire({
          text: 'Task created successfully in Trello!',
          icon: 'success',
        });
      } catch (error) {
        console.error('Error creating task in Trello:', error);
        Swal.fire({
          text: 'Error creating task in Trello',
          icon: 'error',
        });
      } finally {
        setLoading(false);
      }
    } else if (integrationType === 'asana') {
      if (taskName.trim() === '' || taskDescription.trim() === '' || projectId.trim() === '') {
        Swal.fire({
          text: 'Please fill in all fields for Asana.',
          icon: 'warning',
        });
        return;
      }

      setLoading(true);
      try {
        const response = await axios.post('/asana/create-task', {
          name: taskName,
          description: taskDescription,
          due_date: dueDate,
          project_id: projectId,
        });
        console.log('Task created:', response.data);
        setTaskName('');
        setTaskDescription('');
        setDueDate('');
        setProjectId('');
        Swal.fire({
          text: 'Task created successfully in Asana!',
          icon: 'success',
        });
      } catch (error) {
        console.error('Error creating task in Asana:', error);
        Swal.fire({
          text: 'Error creating task in Asana',
          icon: 'error',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h4" gutterBottom>
        Generated Timetable
      </Typography>
      <Calendar />
      <Button variant="contained" color="primary" onClick={handleAnalyticsOpen}>
        View Analytics
      </Button>
      <Button variant="contained" color="secondary" onClick={handleCollaborationOpen}>
        Collaborate
      </Button>
      <Dialog
        open={analyticsOpen}
        onClose={handleAnalyticsClose}
        TransitionComponent={motion.div}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.5 }}
      >
        <DialogTitle>Analytics and Reporting</DialogTitle>
        <DialogContent>
          {/* Placeholder for analytics and reporting content */}
          <Typography variant="body1">Analytics data goes here...</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAnalyticsClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={collaborationOpen}
        onClose={handleCollaborationClose}
        TransitionComponent={motion.div}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.5 }}
      >
        <DialogTitle>Collaboration Features</DialogTitle>
        <DialogContent>
          <TextField
            label="Comment"
            value={comment}
            onChange={handleCommentChange}
            fullWidth
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCollaborationClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCommentSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      {loading ? (
        <CircularProgress />
      ) : (
        <Suspense fallback={<div>Loading...</div>}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="events">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <table>
                        <thead>
                          <tr>
                            <th>Time</th>
                            <th>Monday</th>
                            <th>Tuesday</th>
                            <th>Wednesday</th>
                            <th>Thursday</th>
                            <th>Friday</th>
                          </tr>
                        </thead>
                        <tbody>
                          {events.map((row, index) => (
                            <Draggable key={index} draggableId={index.toString()} index={index}>
                              {(provided) => (
                                <tr
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  onClick={() => handleEventClick(row)}
                                >
                                  <Tooltip title={`Event: ${row.name}\nTime: ${row.time}`}>
                                    <motion.td whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>{row.time}</motion.td>
                                  </Tooltip>
                                  <Tooltip title={`Event: ${row.monday}`}>
                                    <motion.td whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>{row.monday}</motion.td>
                                  </Tooltip>
                                  <Tooltip title={`Event: ${row.tuesday}`}>
                                    <motion.td whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>{row.tuesday}</motion.td>
                                  </Tooltip>
                                  <Tooltip title={`Event: ${row.wednesday}`}>
                                    <motion.td whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>{row.wednesday}</motion.td>
                                  </Tooltip>
                                  <Tooltip title={`Event: ${row.thursday}`}>
                                    <motion.td whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>{row.thursday}</motion.td>
                                  </Tooltip>
                                  <Tooltip title={`Event: ${row.friday}`}>
                                    <motion.td whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>{row.friday}</motion.td>
                                  </Tooltip>
                                </tr>
                              )}
                            </Draggable>
                          ))}
                        </tbody>
                      </table>
                    </Grid>
                  </Grid>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Suspense>
      )}
      <Dialog open={notificationOpen} onClose={handleNotificationClose}>
        <DialogTitle>Notifications</DialogTitle>
        <DialogContent>
          <List>
            {notifications.map((notification, index) => (
              <ListItem key={index}>
                <ListItemText primary={notification.message} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNotificationClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <FormControl fullWidth>
        <InputLabel id="calendar-type-label">Calendar Type</InputLabel>
        <Select
          labelId="calendar-type-label"
          id="calendar-type"
          value={calendarType}
          label="Calendar Type"
          onChange={handleCalendarTypeChange}
        >
          <MenuItem value="google">Google Calendar</MenuItem>
          <MenuItem value="outlook">Microsoft Outlook</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Calendar Link"
        value={calendarLink}
        onChange={handleCalendarLinkChange}
        fullWidth
      />
      <Button variant="contained" color="primary" onClick={handleSync}>
        Sync Calendar
      </Button>
      <FormControl fullWidth>
        <InputLabel id="integration-type-label">Integration Type</InputLabel>
        <Select
          labelId="integration-type-label"
          id="integration-type"
          value={integrationType}
          label="Integration Type"
          onChange={handleIntegrationTypeChange}
        >
          <MenuItem value="trello">Trello</MenuItem>
          <MenuItem value="asana">Asana</MenuItem>
        </Select>
      </FormControl>
      {integrationType === 'trello' && (
        <>
          <TextField
            label="Task Name"
            value={taskName}
            onChange={handleTaskNameChange}
            fullWidth
          />
          <TextField
            label="Task Description"
            value={taskDescription}
            onChange={handleTaskDescriptionChange}
            fullWidth
          />
          <TextField
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={handleDueDateChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="List ID"
            value={listId}
            onChange={handleListIdChange}
            fullWidth
          />
        </>
      )}
      {integrationType === 'asana' && (
        <>
          <TextField
            label="Task Name"
            value={taskName}
            onChange={handleTaskNameChange}
            fullWidth
          />
          <TextField
            label="Task Description"
            value={taskDescription}
            onChange={handleTaskDescriptionChange}
            fullWidth
          />
          <TextField
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={handleDueDateChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Project ID"
            value={projectId}
            onChange={handleProjectIdChange}
            fullWidth
          />
        </>
      )}
      <Button variant="contained" color="primary" onClick={handleIntegrationSubmit}>
        Submit Integration Task
      </Button>
      <Snackbar
        open={notificationOpen}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
      >
        <Alert onClose={handleNotificationClose} severity="info">
          {notificationMessage}
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

export default Timetable;
