import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Paper, Typography, CircularProgress, Tooltip, Grid, Stack, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import Swal from 'sweetalert2';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CSSTransition } from 'react-transition-group';
import { motion } from 'framer-motion';
import './AddTemplate.css';

const AddTemplate = () => {
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [integrationType, setIntegrationType] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (templateName.trim() === '' || templateDescription.trim() === '' || integrationType.trim() === '') {
      Swal.fire({
        text: 'Please fill in all fields.',
        icon: 'warning',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/add-template', {
        name: templateName,
        description: templateDescription,
        integrationType: integrationType,
      });
      console.log('Template added:', response.data);
      setTemplateName('');
      setTemplateDescription('');
      setIntegrationType('');
      Swal.fire({
        text: 'Template added successfully!',
        icon: 'success',
      });
    } catch (error) {
      console.error('Error adding template:', error);
      Swal.fire({
        text: 'Error adding template',
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle drag end event
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(events);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setEvents(items);
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
              Add New Template
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Tooltip title="Enter the name of the template">
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="templateName"
                      label="Template Name"
                      name="templateName"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                    />
                  </Tooltip>
                </Grid>
                <Grid item xs={12}>
                  <Tooltip title="Enter the description of the template">
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="templateDescription"
                      label="Template Description"
                      name="templateDescription"
                      value={templateDescription}
                      onChange={(e) => setTemplateDescription(e.target.value)}
                    />
                  </Tooltip>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined" margin="normal" required>
                    <InputLabel id="integrationType-label">Integration Type</InputLabel>
                    <Select
                      labelId="integrationType-label"
                      id="integrationType"
                      value={integrationType}
                      onChange={(e) => setIntegrationType(e.target.value)}
                      label="Integration Type"
                    >
                      <MenuItem value="trello">Trello</MenuItem>
                      <MenuItem value="asana">Asana</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
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
              <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                <Button type="submit" fullWidth variant="contained" color="primary">
                  {loading ? <CircularProgress size={24} /> : 'Add Template'}
                </Button>
              </Stack>
            </form>
          </motion.div>
        </CSSTransition>
      </Paper>
    </Container>
  );
};

export default AddTemplate;
