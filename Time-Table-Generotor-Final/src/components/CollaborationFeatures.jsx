import React, { useState, useEffect } from 'react';
import { getCollaborationData, saveCollaborationData, getTasks, assignTask, getProgress } from '../api/collaboration';
import { WebSocket } from 'ws';
import { Button, TextField, List, ListItem, ListItemText, Typography, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const CollaborationFeatures = () => {
  const [collaborationData, setCollaborationData] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [socket, setSocket] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [progressData, setProgressData] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  useEffect(() => {
    fetchCollaborationData();
    fetchTasks();
    fetchProgressData();
    const ws = new WebSocket('ws://localhost:8000/ws/collaboration');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setCollaborationData((prevData) => [...prevData, data]);
    };
    setSocket(ws);
    return () => {
      ws.close();
    };
  }, []);

  const fetchCollaborationData = async () => {
    try {
      const data = await getCollaborationData();
      setCollaborationData(data);
    } catch (error) {
      setNotification({ open: true, message: 'Failed to fetch collaboration data', severity: 'error' });
    }
  };

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      setNotification({ open: true, message: 'Failed to fetch tasks', severity: 'error' });
    }
  };

  const fetchProgressData = async () => {
    try {
      const data = await getProgress();
      setProgressData(data);
    } catch (error) {
      setNotification({ open: true, message: 'Failed to fetch progress data', severity: 'error' });
    }
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async () => {
    try {
      const updatedData = await saveCollaborationData(newComment);
      setCollaborationData(updatedData);
      setNewComment('');
      if (socket) {
        socket.send(JSON.stringify({ comment: newComment }));
      }
    } catch (error) {
      setNotification({ open: true, message: 'Failed to save comment', severity: 'error' });
    }
  };

  const handleTaskChange = (e) => {
    setNewTask(e.target.value);
  };

  const handleAssignedToChange = (e) => {
    setAssignedTo(e.target.value);
  };

  const handleDueDateChange = (e) => {
    setDueDate(e.target.value);
  };

  const handleTaskSubmit = async () => {
    const task = { task: newTask, assigned_to: assignedTo, due_date: dueDate, status: 'Pending' };
    try {
      const updatedTasks = await assignTask(task);
      setTasks(updatedTasks);
      setNewTask('');
      setAssignedTo('');
      setDueDate('');
      setTaskDialogOpen(false);
      setNotification({ open: true, message: 'Task assigned successfully', severity: 'success' });
    } catch (error) {
      setNotification({ open: true, message: 'Failed to assign task', severity: 'error' });
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTasks(items);
  };

  const handleTaskDialogOpen = () => {
    setTaskDialogOpen(true);
  };

  const handleTaskDialogClose = () => {
    setTaskDialogOpen(false);
  };

  return (
    <div>
      <h2>Collaboration Features</h2>
      <div>
        <h3>Comments</h3>
        <ul>
          {collaborationData.map((item, index) => (
            <li key={index}>{item.comment}</li>
          ))}
        </ul>
        <TextField
          type="text"
          value={newComment}
          onChange={handleCommentChange}
          placeholder="Add a comment"
          fullWidth
        />
        <Button onClick={handleCommentSubmit}>Submit</Button>
      </div>
      <div>
        <h3>Tasks</h3>
        <Button variant="contained" color="primary" onClick={handleTaskDialogOpen}>
          Assign Task
        </Button>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <List {...provided.droppableProps} ref={provided.innerRef}>
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided) => (
                      <ListItem ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <ListItemText
                          primary={task.task}
                          secondary={`Assigned to: ${task.assigned_to}, Due date: ${task.due_date}, Status: ${task.status}`}
                        />
                      </ListItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <div>
        <h3>Progress Tracking</h3>
        {progressData ? (
          <Bar
            data={{
              labels: Object.keys(progressData),
              datasets: [
                {
                  label: 'Progress',
                  data: Object.values(progressData),
                  backgroundColor: 'rgba(75, 192, 192, 0.6)',
                },
              ],
            }}
          />
        ) : (
          <Typography>Loading progress data...</Typography>
        )}
      </div>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
      <Dialog open={taskDialogOpen} onClose={handleTaskDialogClose}>
        <DialogTitle>Assign Task</DialogTitle>
        <DialogContent>
          <TextField
            label="Task"
            value={newTask}
            onChange={handleTaskChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Assigned To"
            value={assignedTo}
            onChange={handleAssignedToChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={handleDueDateChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTaskDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleTaskSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CollaborationFeatures;
