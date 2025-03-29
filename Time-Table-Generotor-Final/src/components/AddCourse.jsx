import React, { useState, useEffect } from "react";
import {
  Typography,
  Stack,
  Paper,
  Grid,
  Container,
  TextField,
  Button,
  CircularProgress,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { AddCircleOutlined } from "@mui/icons-material";
import Swal from "sweetalert2";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { CSSTransition } from "react-transition-group";
import { motion } from "framer-motion";
import "./AddCourse.css";

const AddCourse = () => {
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [integrationType, setIntegrationType] = useState("");
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [listId, setListId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [calendarType, setCalendarType] = useState("");
  const [calendarLink, setCalendarLink] = useState("");
  const [notifications, setNotifications] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Handle form submission
  const handleSubmit = () => {
    if (courseName.trim() === "" || courseCode.trim() === "") {
      Swal.fire({
        text: "Please fill in all fields.",
        icon: "warning",
      });
      return;
    }

    const body = {
      name: courseName,
      code: courseCode,
    };
    console.log(body);
    setLoading(true);
    axios
      .post("/api/add-course", body)
      .then(() => {
        Swal.fire({
          text: "Course added successfully!",
          icon: "success",
        });
        setCourseName("");
        setCourseCode("");
      })
      .catch((e) => {
        Swal.fire({
          text: "Error adding course",
          icon: "error",
        });
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Handle drag end event
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(events);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setEvents(items);
  };

  // Handle integration form submission
  const handleIntegrationSubmit = async (event) => {
    event.preventDefault();

    if (integrationType === "trello") {
      if (taskName.trim() === "" || taskDescription.trim() === "" || listId.trim() === "") {
        Swal.fire({
          text: "Please fill in all fields for Trello.",
          icon: "warning",
        });
        return;
      }

      setLoading(true);
      try {
        const response = await axios.post("/trello/create-task", {
          name: taskName,
          description: taskDescription,
          due_date: dueDate,
          list_id: listId,
        });
        console.log("Task created:", response.data);
        setTaskName("");
        setTaskDescription("");
        setDueDate("");
        setListId("");
        Swal.fire({
          text: "Task created successfully in Trello!",
          icon: "success",
        });
      } catch (error) {
        console.error("Error creating task in Trello:", error);
        Swal.fire({
          text: "Error creating task in Trello",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    } else if (integrationType === "asana") {
      if (taskName.trim() === "" || taskDescription.trim() === "" || projectId.trim() === "") {
        Swal.fire({
          text: "Please fill in all fields for Asana.",
          icon: "warning",
        });
        return;
      }

      setLoading(true);
      try {
        const response = await axios.post("/asana/create-task", {
          name: taskName,
          description: taskDescription,
          due_date: dueDate,
          project_id: projectId,
        });
        console.log("Task created:", response.data);
        setTaskName("");
        setTaskDescription("");
        setDueDate("");
        setProjectId("");
        Swal.fire({
          text: "Task created successfully in Asana!",
          icon: "success",
        });
      } catch (error) {
        console.error("Error creating task in Asana:", error);
        Swal.fire({
          text: "Error creating task in Asana",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      const response = await axios.get("/analytics");
      setAnalyticsData(response.data);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    }
  };

  // Handle calendar sync
  const handleCalendarSync = async () => {
    if (calendarType.trim() === "" || calendarLink.trim() === "") {
      Swal.fire({
        text: "Please fill in all fields.",
        icon: "warning",
      });
      return;
    }

    try {
      const response = await axios.post("/calendar/sync", {
        type: calendarType,
        link: calendarLink,
      });
      console.log("Calendar synced:", response.data);
      Swal.fire({
        text: "Calendar synced successfully!",
        icon: "success",
      });
    } catch (error) {
      console.error("Error syncing calendar:", error);
      Swal.fire({
        text: "Error syncing calendar",
        icon: "error",
      });
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/notifications");
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
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
                      Add New Course
                    </Typography>
                  </center>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Tooltip title="Enter the name of the course">
                        <motion.div whileHover={{ scale: 1.05 }}>
                          <TextField
                            label="Course Name"
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                            fullWidth
                          />
                        </motion.div>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={12}>
                      <Tooltip title="Enter the code of the course">
                        <motion.div whileHover={{ scale: 1.05 }}>
                          <TextField
                            label="Course Code"
                            value={courseCode}
                            onChange={(e) => setCourseCode(e.target.value)}
                            fullWidth
                          />
                        </motion.div>
                      </Tooltip>
                    </Grid>
                  </Grid>
                  <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                    <motion.div whileHover={{ scale: 1.1 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddCircleOutlined />}
                        onClick={handleSubmit}
                      >
                        Submit
                      </Button>
                    </motion.div>
                  </Stack>
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="events">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                          {events.map((event, index) => (
                            <Draggable key={event.id} draggableId={event.id} index={index}>
                              {(provided) => (
                                <motion.div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  whileHover={{ scale: 1.05 }}
                                >
                                  <Paper variant="outlined" sx={{ my: 1, p: 2 }}>
                                    <Typography variant="body1">{event.name}</Typography>
                                  </Paper>
                                </motion.div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                  <center>
                    <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                      Integration Options
                    </Typography>
                  </center>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel id="integration-type-label">Integration Type</InputLabel>
                        <Select
                          labelId="integration-type-label"
                          id="integration-type"
                          value={integrationType}
                          label="Integration Type"
                          onChange={(e) => setIntegrationType(e.target.value)}
                        >
                          <MenuItem value="trello">Trello</MenuItem>
                          <MenuItem value="asana">Asana</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    {integrationType === "trello" && (
                      <>
                        <Grid item xs={12}>
                          <Tooltip title="Enter the name of the task">
                            <motion.div whileHover={{ scale: 1.05 }}>
                              <TextField
                                label="Task Name"
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                                fullWidth
                              />
                            </motion.div>
                          </Tooltip>
                        </Grid>
                        <Grid item xs={12}>
                          <Tooltip title="Enter the description of the task">
                            <motion.div whileHover={{ scale: 1.05 }}>
                              <TextField
                                label="Task Description"
                                value={taskDescription}
                                onChange={(e) => setTaskDescription(e.target.value)}
                                fullWidth
                              />
                            </motion.div>
                          </Tooltip>
                        </Grid>
                        <Grid item xs={12}>
                          <Tooltip title="Enter the due date of the task">
                            <motion.div whileHover={{ scale: 1.05 }}>
                              <TextField
                                label="Due Date"
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                fullWidth
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                            </motion.div>
                          </Tooltip>
                        </Grid>
                        <Grid item xs={12}>
                          <Tooltip title="Enter the list ID for the task">
                            <motion.div whileHover={{ scale: 1.05 }}>
                              <TextField
                                label="List ID"
                                value={listId}
                                onChange={(e) => setListId(e.target.value)}
                                fullWidth
                              />
                            </motion.div>
                          </Tooltip>
                        </Grid>
                      </>
                    )}
                    {integrationType === "asana" && (
                      <>
                        <Grid item xs={12}>
                          <Tooltip title="Enter the name of the task">
                            <motion.div whileHover={{ scale: 1.05 }}>
                              <TextField
                                label="Task Name"
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                                fullWidth
                              />
                            </motion.div>
                          </Tooltip>
                        </Grid>
                        <Grid item xs={12}>
                          <Tooltip title="Enter the description of the task">
                            <motion.div whileHover={{ scale: 1.05 }}>
                              <TextField
                                label="Task Description"
                                value={taskDescription}
                                onChange={(e) => setTaskDescription(e.target.value)}
                                fullWidth
                              />
                            </motion.div>
                          </Tooltip>
                        </Grid>
                        <Grid item xs={12}>
                          <Tooltip title="Enter the due date of the task">
                            <motion.div whileHover={{ scale: 1.05 }}>
                              <TextField
                                label="Due Date"
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                fullWidth
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                            </motion.div>
                          </Tooltip>
                        </Grid>
                        <Grid item xs={12}>
                          <Tooltip title="Enter the project ID for the task">
                            <motion.div whileHover={{ scale: 1.05 }}>
                              <TextField
                                label="Project ID"
                                value={projectId}
                                onChange={(e) => setProjectId(e.target.value)}
                                fullWidth
                              />
                            </motion.div>
                          </Tooltip>
                        </Grid>
                      </>
                    )}
                  </Grid>
                  <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                    <motion.div whileHover={{ scale: 1.1 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleIntegrationSubmit}
                      >
                        Submit Integration Task
                      </Button>
                    </motion.div>
                  </Stack>
                  <center>
                    <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                      Analytics and Reporting
                    </Typography>
                  </center>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={fetchAnalyticsData}
                  >
                    Fetch Analytics Data
                  </Button>
                  {analyticsData && (
                    <div>
                      <Typography variant="body1">Course Distribution: {JSON.stringify(analyticsData.courseDistribution)}</Typography>
                      <Typography variant="body1">Instructor Workload: {JSON.stringify(analyticsData.instructorWorkload)}</Typography>
                      <Typography variant="body1">Constraint Satisfaction: {JSON.stringify(analyticsData.constraintSatisfaction)}</Typography>
                    </div>
                  )}
                  <center>
                    <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                      Calendar Integration
                    </Typography>
                  </center>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel id="calendar-type-label">Calendar Type</InputLabel>
                        <Select
                          labelId="calendar-type-label"
                          id="calendar-type"
                          value={calendarType}
                          label="Calendar Type"
                          onChange={(e) => setCalendarType(e.target.value)}
                        >
                          <MenuItem value="google">Google Calendar</MenuItem>
                          <MenuItem value="outlook">Microsoft Outlook</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Tooltip title="Enter the calendar link">
                        <motion.div whileHover={{ scale: 1.05 }}>
                          <TextField
                            label="Calendar Link"
                            value={calendarLink}
                            onChange={(e) => setCalendarLink(e.target.value)}
                            fullWidth
                          />
                        </motion.div>
                      </Tooltip>
                    </Grid>
                  </Grid>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCalendarSync}
                  >
                    Sync Calendar
                  </Button>
                  <center>
                    <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                      Notifications
                    </Typography>
                  </center>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={fetchNotifications}
                  >
                    Fetch Notifications
                  </Button>
                  <ul>
                    {notifications.map((notification, index) => (
                      <motion.li key={index} whileHover={{ scale: 1.05 }}>
                        {notification.message}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </CSSTransition>
            </Paper>
          </Container>
        </>
      )}
    </>
  );
};

export default AddCourse;
