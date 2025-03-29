import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Paper, Typography, CircularProgress, Tooltip, Grid, Stack } from '@mui/material';
import Swal from 'sweetalert2';

const AsanaIntegration = () => {
  const [taskName, setTaskName] = useState('');
  const [taskNotes, setTaskNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [projectId, setProjectId] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Form validation
    if (taskName.trim() === '' || taskNotes.trim() === '' || projectId.trim() === '') {
      Swal.fire({
        text: 'Please fill in all fields.',
        icon: 'warning',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/asana/create-task', {
        name: taskName,
        notes: taskNotes,
        due_on: dueDate,
        projects: [projectId],
      });
      console.log('Task created:', response.data);
      setTaskName('');
      setTaskNotes('');
      setDueDate('');
      setProjectId('');
      Swal.fire({
        text: 'Task created successfully!',
        icon: 'success',
      });
    } catch (error) {
      console.error('Error creating task:', error);
      Swal.fire({
        text: 'Error creating task',
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper variant="outlined" sx={{ my: 3, p: 3 }}>
        <Typography component="h1" variant="h5">
          Create Asana Task
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Tooltip title="Enter the name of the task">
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="taskName"
                  label="Task Name"
                  name="taskName"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <Tooltip title="Enter the notes for the task">
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="taskNotes"
                  label="Task Notes"
                  name="taskNotes"
                  value={taskNotes}
                  onChange={(e) => setTaskNotes(e.target.value)}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <Tooltip title="Enter the due date of the task">
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="dueDate"
                  label="Due Date"
                  name="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <Tooltip title="Enter the project ID for the task">
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="projectId"
                  label="Project ID"
                  name="projectId"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                />
              </Tooltip>
            </Grid>
          </Grid>
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
            <Button type="submit" fullWidth variant="contained" color="primary">
              {loading ? <CircularProgress size={24} /> : 'Create Task'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default AsanaIntegration;
