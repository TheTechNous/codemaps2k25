import React, { useState, useEffect, Suspense, lazy } from 'react';
import axios from 'axios';
import { CircularProgress, Typography, Container, Paper, List, ListItem, ListItemText, Snackbar, Alert } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { motion } from 'framer-motion';

const localizer = momentLocalizer(moment);

const RecommendationSystem = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    fetchRecommendations();
    fetchAnalyticsData();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get('/get-recommendations');
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setNotification({ open: true, message: 'Error fetching recommendations', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      const response = await axios.get('/analytics');
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setNotification({ open: true, message: 'Error fetching analytics data', severity: 'error' });
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(recommendations);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setRecommendations(items);
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
      <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
        <Typography variant="h6" gutterBottom>
          Course Recommendations
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="recommendations">
              {(provided) => (
                <List {...provided.droppableProps} ref={provided.innerRef}>
                  {recommendations.map((recommendation, index) => (
                    <Draggable key={recommendation.id} draggableId={recommendation.id.toString()} index={index}>
                      {(provided) => (
                        <motion.div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <ListItem>
                            <ListItemText
                              primary={recommendation.courseName}
                              secondary={recommendation.reason}
                            />
                          </ListItem>
                        </motion.div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </DragDropContext>
        )}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Calendar
            localizer={localizer}
            events={recommendations.map((rec) => ({
              title: rec.courseName,
              start: new Date(),
              end: new Date(),
            }))}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500, margin: '50px 0' }}
            components={{
              event: ({ event }) => (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {event.title}
                </motion.div>
              ),
            }}
          />
        </motion.div>
        {analyticsData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="body1">Course Distribution: {JSON.stringify(analyticsData.courseDistribution)}</Typography>
            <Typography variant="body1">Instructor Workload: {JSON.stringify(analyticsData.instructorWorkload)}</Typography>
            <Typography variant="body1">Constraint Satisfaction: {JSON.stringify(analyticsData.constraintSatisfaction)}</Typography>
          </motion.div>
        )}
      </Paper>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RecommendationSystem;
