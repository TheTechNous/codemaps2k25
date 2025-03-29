import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Pagination, CircularProgress, Paper, Typography, Tooltip, MenuItem, Select, InputLabel, FormControl, Grid, Button } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Swal from 'sweetalert2';
import { CSSTransition } from 'react-transition-group';
import { motion } from 'framer-motion';
import './ConstraintList.css';

const ConstraintList = () => {
  const [constraints, setConstraints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [constraintsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [filterType, setFilterType] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchConstraints();
  }, []);

  const fetchConstraints = async () => {
    try {
      const response = await axios.get('/api/get-constraints');
      setConstraints(response.data);
    } catch (error) {
      console.error('Error fetching constraints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (constraintId) => {
    // Implement edit functionality
  };

  const handleDelete = async (constraintId) => {
    try {
      await axios.delete(`/api/constraints/${constraintId}`);
      fetchConstraints();
      Swal.fire({
        text: 'Constraint deleted successfully!',
        icon: 'success',
      });
    } catch (error) {
      console.error('Error deleting constraint:', error);
      Swal.fire({
        text: 'Error deleting constraint',
        icon: 'error',
      });
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
  };

  const filteredConstraints = constraints.filter((constraint) =>
    constraint.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === '' || constraint.type === filterType)
  );

  const indexOfLastConstraint = currentPage * constraintsPerPage;
  const indexOfFirstConstraint = indexOfLastConstraint - constraintsPerPage;
  const currentConstraints = filteredConstraints.slice(indexOfFirstConstraint, indexOfLastConstraint);

  const paginate = (event, value) => {
    setCurrentPage(value);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(events);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setEvents(items);
  };

  return (
    <div>
      <h2>Constraint List</h2>
      {loading ? (
        <CircularProgress />
      ) : (
        <CSSTransition in={!loading} timeout={300} classNames="fade">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Tooltip title="Search for constraints">
              <TextField
                label="Search Constraints"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearch}
                fullWidth
                margin="normal"
              />
            </Tooltip>
            <FormControl fullWidth margin="normal">
              <InputLabel>Filter by Type</InputLabel>
              <Select
                value={filterType}
                onChange={handleFilterChange}
                label="Filter by Type"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="type1">Type 1</MenuItem>
                <MenuItem value="type2">Type 2</MenuItem>
                <MenuItem value="type3">Type 3</MenuItem>
              </Select>
            </FormControl>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="constraints">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    <Grid container spacing={2}>
                      {currentConstraints.map((constraint, index) => (
                        <Grid item xs={12} sm={6} md={4} key={constraint.id}>
                          <Draggable key={constraint.id} draggableId={constraint.id} index={index}>
                            {(provided) => (
                              <motion.div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                whileHover={{ scale: 1.05 }}
                              >
                                <Paper variant="outlined" sx={{ my: 1, p: 2 }}>
                                  <Typography variant="body1">{constraint.name}</Typography>
                                  <Button variant="contained" color="primary" onClick={() => handleEdit(constraint.id)}>Edit</Button>
                                  <Button variant="contained" color="secondary" onClick={() => handleDelete(constraint.id)}>Delete</Button>
                                </Paper>
                              </motion.div>
                            )}
                          </Draggable>
                        </Grid>
                      ))}
                    </Grid>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <Pagination
              count={Math.ceil(filteredConstraints.length / constraintsPerPage)}
              page={currentPage}
              onChange={paginate}
              color="primary"
            />
          </motion.div>
        </CSSTransition>
      )}
    </div>
  );
};

export default ConstraintList;
