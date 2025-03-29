import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Paper, Typography, CircularProgress, Tooltip, Grid, Stack } from '@mui/material';
import Swal from 'sweetalert2';

const TrelloIntegration = () => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [listId, setListId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (taskName.trim() === '' || taskDescription.trim() === '' || listId.trim() === '') {
      Swal.fire({
        text: 'Please fill in all fields.',
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
          Create Trello Task
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
              <Tooltip title="Enter the description of the task">
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="taskDescription"
                  label="Task Description"
                  name="taskDescription"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
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
              <Tooltip title="Enter the list ID for the task">
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="listId"
                  label="List ID"
                  name="listId"
                  value={listId}
                  onChange={(e) => setListId(e.target.value)}
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

export default TrelloIntegration;
