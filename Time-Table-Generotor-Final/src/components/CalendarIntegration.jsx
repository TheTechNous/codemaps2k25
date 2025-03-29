import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Swal from 'sweetalert2';
import axios from 'axios';

const CalendarIntegration = () => {
  const [showModal, setShowModal] = useState(false);
  const [calendarType, setCalendarType] = useState('');
  const [calendarLink, setCalendarLink] = useState('');
  const [events, setEvents] = useState([]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleCalendarTypeChange = (e) => setCalendarType(e.target.value);
  const handleCalendarLinkChange = (e) => setCalendarLink(e.target.value);

  const handleSync = async () => {
    if (calendarType.trim() === '' || calendarLink.trim() === '') {
      Swal.fire({
        text: 'Please fill in all fields.',
        icon: 'warning',
      });
      return;
    }

    try {
      const response = await axios.post('/calendar/sync', {
        type: calendarType,
        link: calendarLink,
      });
      console.log('Calendar synced:', response.data);
      Swal.fire({
        text: 'Calendar synced successfully!',
        icon: 'success',
      });
      setEvents(response.data.events);
    } catch (error) {
      console.error('Error syncing calendar:', error);
      Swal.fire({
        text: 'Error syncing calendar',
        icon: 'error',
      });
    }

    handleCloseModal();
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/calendar/events');
        setEvents(response.data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <Button variant="primary" onClick={handleShowModal}>
        Sync with Calendar
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Sync with Calendar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCalendarType">
              <Form.Label>Calendar Type</Form.Label>
              <Form.Control as="select" value={calendarType} onChange={handleCalendarTypeChange}>
                <option value="">Select Calendar Type</option>
                <option value="google">Google Calendar</option>
                <option value="outlook">Microsoft Outlook</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formCalendarLink">
              <Form.Label>Calendar Link</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter calendar link"
                value={calendarLink}
                onChange={handleCalendarLinkChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSync}>
            Sync
          </Button>
        </Modal.Footer>
      </Modal>

      <Calendar
        tileContent={({ date, view }) => {
          const event = events.find(event => new Date(event.date).toDateString() === date.toDateString());
          return event ? <p>{event.title}</p> : null;
        }}
      />
    </div>
  );
};

export default CalendarIntegration;
