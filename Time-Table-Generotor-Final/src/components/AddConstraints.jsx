import React, { useState, useEffect } from "react";
import {
  Typography,
  Stack,
  Chip,
  Paper,
  Grid,
  Container,
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Autocomplete,
  CircularProgress,
  Button,
  Slider,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
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
import "./AddConstraints.css";

const AddConstraints = () => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [timeRange, setTimeRange] = useState([9, 17]);
  const [naturalLanguageTime, setNaturalLanguageTime] = useState("");
  const [checkedA, setCheckedA] = useState(false);
  const [checkedB, setCheckedB] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [sub1, setSub1] = useState("");
  const [sub2, setSub2] = useState("");
  const [nsub1, setnSub1] = useState("");
  const [nsub2, setnSub2] = useState("");
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

  // Handle day click event
  const handleDayClick = (day) => {
    const newSelectedDays = [...selectedDays];
    const index = newSelectedDays.findIndex(
      (selectedDay) => selectedDay.getTime() === day.getTime()
    );
    if (index > -1) {
      newSelectedDays.splice(index, 1);
    } else {
      newSelectedDays.push(day);
    }
    setSelectedDays(newSelectedDays);
  };

  // Handle time range change event
  const handleTimeRangeChange = (event, newValue) => {
    setTimeRange(newValue);
  };

  // Handle natural language time change event
  const handleNaturalLanguageTimeChange = (event) => {
    setNaturalLanguageTime(event.target.value);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (selectedDays.length === 0) {
      Swal.fire({
        text: "Please select at least one day.",
        icon: "warning",
      });
      return;
    }

    if (timeRange[0] >= timeRange[1]) {
      Swal.fire({
        text: "End time must be after start time.",
        icon: "warning",
      });
      return;
    }

    const working_days = selectedDays.map((day) => ({
      day: day.toLocaleDateString("en-US", { weekday: "long" }),
      start_hr: timeRange[0],
      end_hr: timeRange[1],
      total_hours: timeRange[1] - timeRange[0],
    }));

    const consecutive_subjects = [sub1, sub2];
    const non_consecutive_subjects = [nsub1, nsub2];
    const body = {
      working_days: working_days,
      consecutive_subjects: consecutive_subjects,
      non_consecutive_subjects: non_consecutive_subjects,
    };
    console.log(body);
    setLoading(true);
    axios
      .post("/api/add-constraints", body)
      .then(() => {
        Swal.fire({
          text: "Constraints added successfully!",
          icon: "success",
        });
        setSelectedDays([]);
        setTimeRange([9, 17]);
        setNaturalLanguageTime("");
        setCheckedA(false);
        setCheckedB(false);
        setSub1("");
        setSub2("");
        setnSub1("");
        setnSub2("");
      })
      .catch((e) => {
        Swal.fire({
          text: "Error adding constraints",
          icon: "error",
        });
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
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

  // Fetch subjects from the backend
  useEffect(() => {
    axios.get("http://localhost:8000/get-courses").then((res) => {
      setLoading(false);
      const temp_subjects = [];
      res.data.forEach((item) => {
        temp_subjects.push({ label: item.name, value: item.name });
      });
      setSubjects(temp_subjects);
    });
  }, []);

  // Handle drag end event
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(events);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setEvents(items);
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
                      Time Table Details
                    </Typography>
                  </center>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={3}>
                      <Tooltip title="Select the days for the timetable">
                        <Calendar
                          onClickDay={handleDayClick}
                          tileClassName={({ date }) =>
                            selectedDays.find((selectedDay) => selectedDay.getTime() === date.getTime())
                              ? "selected-day"
                              : ""
                          }
                        />
                      </Tooltip>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Select the time range for the timetable">
                          <Slider
                            value={timeRange}
                            onChange={handleTimeRangeChange}
                            valueLabelDisplay="auto"
                            min={0}
                            max={24}
                            step={1}
                            marks
                          />
                        </Tooltip>
                        <Tooltip title="Enter the time range in natural language">
                          <TextField
                            label="Natural Language Time"
                            value={naturalLanguageTime}
                            onChange={handleNaturalLanguageTimeChange}
                            fullWidth
                          />
                        </Tooltip>
                      </Stack>
                    </Grid>
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Tooltip title="Select the first consecutive subject">
                        <Autocomplete
                          options={subjects}
                          getOptionLabel={(option) => option.label}
                          value={sub1}
                          onChange={(event, newValue) => setSub1(newValue)}
                          renderInput={(params) => <TextField {...params} label="Consecutive Subject 1" />}
                        />
                      </Tooltip>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Tooltip title="Select the second consecutive subject">
                        <Autocomplete
                          options={subjects}
                          getOptionLabel={(option) => option.label}
                          value={sub2}
                          onChange={(event, newValue) => setSub2(newValue)}
                          renderInput={(params) => <TextField {...params} label="Consecutive Subject 2" />}
                        />
                      </Tooltip>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Tooltip title="Select the first non-consecutive subject">
                        <Autocomplete
                          options={subjects}
                          getOptionLabel={(option) => option.label}
                          value={nsub1}
                          onChange={(event, newValue) => setnSub1(newValue)}
                          renderInput={(params) => <TextField {...params} label="Non-Consecutive Subject 1" />}
                        />
                      </Tooltip>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Tooltip title="Select the second non-consecutive subject">
                        <Autocomplete
                          options={subjects}
                          getOptionLabel={(option) => option.label}
                          value={nsub2}
                          onChange={(event, newValue) => setnSub2(newValue)}
                          renderInput={(params) => <TextField {...params} label="Non-Consecutive Subject 2" />}
                        />
                      </Tooltip>
                    </Grid>
                  </Grid>
                  <FormGroup>
                    <Tooltip title="Check this option if applicable">
                      <FormControlLabel
                        control={<Checkbox checked={checkedA} onChange={(e) => setCheckedA(e.target.checked)} />}
                        label="Checked A"
                      />
                    </Tooltip>
                    <Tooltip title="Check this option if applicable">
                      <FormControlLabel
                        control={<Checkbox checked={checkedB} onChange={(e) => setCheckedB(e.target.checked)} />}
                        label="Checked B"
                      />
                    </Tooltip>
                  </FormGroup>
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
                                  whileTap={{ scale: 0.95 }}
                                  transition={{ duration: 0.3 }}
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
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddCircleOutlined />}
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  </motion.div>
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
                            <TextField
                              label="Task Name"
                              value={taskName}
                              onChange={(e) => setTaskName(e.target.value)}
                              fullWidth
                            />
                          </Tooltip>
                        </Grid>
                        <Grid item xs={12}>
                          <Tooltip title="Enter the description of the task">
                            <TextField
                              label="Task Description"
                              value={taskDescription}
                              onChange={(e) => setTaskDescription(e.target.value)}
                              fullWidth
                            />
                          </Tooltip>
                        </Grid>
                        <Grid item xs={12}>
                          <Tooltip title="Enter the due date of the task">
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
                          </Tooltip>
                        </Grid>
                        <Grid item xs={12}>
                          <Tooltip title="Enter the list ID for the task">
                            <TextField
                              label="List ID"
                              value={listId}
                              onChange={(e) => setListId(e.target.value)}
                              fullWidth
                            />
                          </Tooltip>
                        </Grid>
                      </>
                    )}
                    {integrationType === "asana" && (
                      <>
                        <Grid item xs={12}>
                          <Tooltip title="Enter the name of the task">
                            <TextField
                              label="Task Name"
                              value={taskName}
                              onChange={(e) => setTaskName(e.target.value)}
                              fullWidth
                            />
                          </Tooltip>
                        </Grid>
                        <Grid item xs={12}>
                          <Tooltip title="Enter the description of the task">
                            <TextField
                              label="Task Description"
                              value={taskDescription}
                              onChange={(e) => setTaskDescription(e.target.value)}
                              fullWidth
                            />
                          </Tooltip>
                        </Grid>
                        <Grid item xs={12}>
                          <Tooltip title="Enter the due date of the task">
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
                          </Tooltip>
                        </Grid>
                        <Grid item xs={12}>
                          <Tooltip title="Enter the project ID for the task">
                            <TextField
                              label="Project ID"
                              value={projectId}
                              onChange={(e) => setProjectId(e.target.value)}
                              fullWidth
                            />
                          </Tooltip>
                        </Grid>
                      </>
                    )}
                  </Grid>
                  <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
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
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={fetchAnalyticsData}
                    >
                      Fetch Analytics Data
                    </Button>
                  </motion.div>
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
                        <TextField
                          label="Calendar Link"
                          value={calendarLink}
                          onChange={(e) => setCalendarLink(e.target.value)}
                          fullWidth
                        />
                      </Tooltip>
                    </Grid>
                  </Grid>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleCalendarSync}
                    >
                      Sync Calendar
                    </Button>
                  </motion.div>
                  <center>
                    <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                      Notifications
                    </Typography>
                  </center>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={fetchNotifications}
                    >
                      Fetch Notifications
                    </Button>
                  </motion.div>
                  <ul>
                    {notifications.map((notification, index) => (
                      <motion.li
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                      >
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

export default AddConstraints;
