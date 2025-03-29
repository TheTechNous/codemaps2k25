import React, { useState, useEffect } from "react";
import {
  Typography,
  Container,
  Paper,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
} from "@mui/material";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Swal from "sweetalert2";

const TaskManagementDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [newTask, setNewTask] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const trelloResponse = await axios.get("/trello/get-tasks");
        const asanaResponse = await axios.get("/asana/get-tasks");
        setTasks([...trelloResponse.data, ...asanaResponse.data]);
      } catch (error) {
        setError("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTasks(items);
  };

  const handleTaskDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleTaskDialogClose = () => {
    setDialogOpen(false);
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
    const task = { task: newTask, assigned_to: assignedTo, due_date: dueDate, status: "Pending" };
    try {
      const response = await axios.post("/assign-task", task);
      setTasks([...tasks, response.data]);
      setNewTask("");
      setAssignedTo("");
      setDueDate("");
      setDialogOpen(false);
      Swal.fire({
        text: "Task assigned successfully!",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        text: "Error assigning task",
        icon: "error",
      });
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
      <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
        <Typography variant="h6" gutterBottom>
          Task Management Dashboard
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Snackbar open={true} autoHideDuration={6000}>
            <Alert severity="error">{error}</Alert>
          </Snackbar>
        ) : (
          <>
            <Button variant="contained" color="primary" onClick={handleTaskDialogOpen}>
              Assign Task
            </Button>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="tasks">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    <Grid container spacing={3}>
                      {tasks.map((task, index) => (
                        <Draggable key={index} draggableId={index.toString()} index={index}>
                          {(provided) => (
                            <Grid item xs={12} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <Paper variant="outlined" sx={{ p: 2 }}>
                                <Typography variant="body1">{task.name}</Typography>
                                <Typography variant="body2">{task.description}</Typography>
                                <Typography variant="body2">
                                  Due Date: {task.due_date ? new Date(task.due_date).toLocaleDateString() : "N/A"}
                                </Typography>
                              </Paper>
                            </Grid>
                          )}
                        </Draggable>
                      ))}
                    </Grid>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </>
        )}
      </Paper>
      <Dialog open={dialogOpen} onClose={handleTaskDialogClose}>
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
    </Container>
  );
};

export default TaskManagementDashboard;
