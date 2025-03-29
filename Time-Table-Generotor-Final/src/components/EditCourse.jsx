import React, { useState, useEffect, lazy, Suspense } from "react";
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
} from "@mui/material";
import { EditOutlined } from "@mui/icons-material";
import Swal from "sweetalert2";
import axios from "axios";
import { useParams } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const EditCourse = () => {
  const { courseId } = useParams();
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchCourseDetails();
  }, []);

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(`/api/get-course/${courseId}`);
      setCourseName(response.data.name);
      setCourseCode(response.data.code);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching course details:", error);
      setLoading(false);
    }
  };

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
      .put(`/api/update-course/${courseId}`, body)
      .then(() => {
        Swal.fire({
          text: "Course updated successfully!",
          icon: "success",
        });
      })
      .catch((e) => {
        Swal.fire({
          text: "Error updating course",
          icon: "error",
        });
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(events);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setEvents(items);
  };

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
              <center>
                <Typography variant="h6" gutterBottom>
                  Edit Course
                </Typography>
              </center>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Tooltip title="Enter the name of the course">
                    <TextField
                      label="Course Name"
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                      fullWidth
                      error={courseName.trim() === ""}
                      helperText={courseName.trim() === "" ? "Course Name is required" : ""}
                    />
                  </Tooltip>
                </Grid>
                <Grid item xs={12}>
                  <Tooltip title="Enter the code of the course">
                    <TextField
                      label="Course Code"
                      value={courseCode}
                      onChange={(e) => setCourseCode(e.target.value)}
                      fullWidth
                      error={courseCode.trim() === ""}
                      helperText={courseCode.trim() === "" ? "Course Code is required" : ""}
                    />
                  </Tooltip>
                </Grid>
              </Grid>
              <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditOutlined />}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Submit"}
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
            </Paper>
          </Container>
        </>
      )}
    </>
  );
};

export default EditCourse;
