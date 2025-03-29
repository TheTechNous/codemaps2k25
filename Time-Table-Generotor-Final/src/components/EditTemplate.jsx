import React, { useState, useEffect, lazy, Suspense } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Paper, Typography, CircularProgress, Tooltip, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CSSTransition } from 'react-transition-group';
import { motion } from 'framer-motion';

const EditTemplate = () => {
  const { id } = useParams();
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await axios.get(`/api/get-template/${id}`);
        setTemplateName(response.data.name);
        setTemplateDescription(response.data.description);
      } catch (error) {
        console.error('Error fetching template:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (templateName.trim() === '' || templateDescription.trim() === '') {
      Swal.fire({
        text: 'Please fill in all fields.',
        icon: 'warning',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(`/api/update-template/${id}`, {
        name: templateName,
        description: templateDescription,
      });
      console.log('Template updated:', response.data);
      Swal.fire({
        text: 'Template updated successfully!',
        icon: 'success',
      });
    } catch (error) {
      console.error('Error updating template:', error);
      Swal.fire({
        text: 'Error updating template',
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
    <Container component="main" maxWidth="sm">
      <Paper variant="outlined" sx={{ my: 3, p: 3 }}>
        <CSSTransition in={!loading} timeout={300} classNames="fade">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography component="h1" variant="h5">
              Edit Template
            </Typography>
            <form onSubmit={handleSubmit}>
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
              <Button type="submit" fullWidth variant="contained" color="primary">
                {loading ? <CircularProgress size={24} /> : 'Update Template'}
              </Button>
            </form>
          </motion.div>
        </CSSTransition>
      </Paper>
    </Container>
  );
};

export default EditTemplate;
