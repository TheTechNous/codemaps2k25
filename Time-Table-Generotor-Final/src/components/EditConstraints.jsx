import React, { useState, useEffect, lazy, Suspense } from 'react';
import axios from 'axios';
import { CircularProgress, TextField, Button, Tooltip, Paper, Typography, Container, Grid, Stack } from '@mui/material';
import Swal from 'sweetalert2';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CSSTransition } from 'react-transition-group';
import { motion } from 'framer-motion';

const EditConstraints = ({ match, history }) => {
  const [constraint, setConstraint] = useState({
    name: '',
    description: '',
    type: '',
    value: '',
  });
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchConstraint = async () => {
      try {
        const response = await axios.get(`/api/get-constraint/${match.params.id}`);
        setConstraint(response.data);
      } catch (error) {
        console.error('Error fetching constraint:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConstraint();
  }, [match.params.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConstraint((prevConstraint) => ({
      ...prevConstraint,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (constraint.name.trim() === '' || constraint.description.trim() === '' || constraint.type.trim() === '' || constraint.value.trim() === '') {
      Swal.fire({
        text: 'Please fill in all fields.',
        icon: 'warning',
      });
      return;
    }

    setLoading(true);
    try {
      await axios.put(`/api/update-constraint/${match.params.id}`, constraint);
      history.push('/constraints');
    } catch (error) {
      console.error('Error updating constraint:', error);
      Swal.fire({
        text: 'Error updating constraint',
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(events);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setEvents(items);
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
      <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
        <CSSTransition in={!loading} timeout={300} classNames="fade">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <center>
              <Typography variant="h6" gutterBottom>
                Edit Constraint
              </Typography>
            </center>
            {loading ? (
              <CircularProgress />
            ) : (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Tooltip title="Enter the name of the constraint">
                      <TextField
                        label="Name"
                        id="name"
                        name="name"
                        value={constraint.name}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12}>
                    <Tooltip title="Enter the description of the constraint">
                      <TextField
                        label="Description"
                        id="description"
                        name="description"
                        value={constraint.description}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12}>
                    <Tooltip title="Enter the type of the constraint">
                      <TextField
                        label="Type"
                        id="type"
                        name="type"
                        value={constraint.type}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12}>
                    <Tooltip title="Enter the value of the constraint">
                      <TextField
                        label="Value"
                        id="value"
                        name="value"
                        value={constraint.value}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Tooltip>
                  </Grid>
                </Grid>
                <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                  <Button type="submit" variant="contained" color="primary">
                    Save
                  </Button>
                </Stack>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="events">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {events.map((event, index) => (
                          <Draggable key={event.id} draggableId={event.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <Paper variant="outlined" sx={{ my: 1, p: 2 }}>
                                  <Typography variant="body1">{event.name}</Typography>
                                </Paper>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </form>
            )}
          </motion.div>
        </CSSTransition>
      </Paper>
    </Container>
  );
};

export default EditConstraints;
