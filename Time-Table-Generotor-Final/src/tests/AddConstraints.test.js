import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddConstraints from '../components/AddConstraints';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Swal from 'sweetalert2';

const mock = new MockAdapter(axios);

describe('AddConstraints Component', () => {
  beforeEach(() => {
    mock.reset();
  });

  test('renders AddConstraints component', () => {
    render(<AddConstraints />);
    expect(screen.getByText('Time Table Details')).toBeInTheDocument();
  });

  test('adds constraints successfully', async () => {
    mock.onPost('/api/add-constraints').reply(200);

    render(<AddConstraints />);

    fireEvent.click(screen.getByText('Monday'));
    fireEvent.click(screen.getByText('Tuesday'));

    fireEvent.change(screen.getByLabelText('Natural Language Time'), { target: { value: '9 AM to 5 PM' } });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => expect(Swal.fire).toHaveBeenCalledWith({
      text: 'Constraints added successfully!',
      icon: 'success',
    }));
  });

  test('handles API error', async () => {
    mock.onPost('/api/add-constraints').reply(500);

    render(<AddConstraints />);

    fireEvent.click(screen.getByText('Monday'));
    fireEvent.click(screen.getByText('Tuesday'));

    fireEvent.change(screen.getByLabelText('Natural Language Time'), { target: { value: '9 AM to 5 PM' } });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => expect(Swal.fire).toHaveBeenCalledWith({
      text: 'Error adding constraints',
      icon: 'error',
    }));
  });

  test('renders calendar view', () => {
    render(<AddConstraints />);
    expect(screen.getByText('Time Table Details')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Tue')).toBeInTheDocument();
    expect(screen.getByText('Wed')).toBeInTheDocument();
    expect(screen.getByText('Thu')).toBeInTheDocument();
    expect(screen.getByText('Fri')).toBeInTheDocument();
    expect(screen.getByText('Sat')).toBeInTheDocument();
    expect(screen.getByText('Sun')).toBeInTheDocument();
  });

  test('highlights selected days in calendar', () => {
    render(<AddConstraints />);
    const day = screen.getByText('15');
    fireEvent.click(day);
    expect(day).toHaveClass('selected-day');
  });

  test('renders time range slider', () => {
    render(<AddConstraints />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  test('changes time range slider value', () => {
    render(<AddConstraints />);
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: [10, 18] } });
    expect(slider.value).toBe('10,18');
  });

  test('renders natural language time input', () => {
    render(<AddConstraints />);
    expect(screen.getByLabelText('Natural Language Time')).toBeInTheDocument();
  });

  test('changes natural language time input value', () => {
    render(<AddConstraints />);
    const input = screen.getByLabelText('Natural Language Time');
    fireEvent.change(input, { target: { value: '9 AM to 5 PM' } });
    expect(input.value).toBe('9 AM to 5 PM');
  });

  test('handles edge cases for adding constraints', async () => {
    mock.onPost('/api/add-constraints').reply(200);

    render(<AddConstraints />);

    fireEvent.click(screen.getByText('Monday'));
    fireEvent.click(screen.getByText('Tuesday'));

    fireEvent.change(screen.getByLabelText('Natural Language Time'), { target: { value: '00:00 to 23:59' } });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => expect(Swal.fire).toHaveBeenCalledWith({
      text: 'Constraints added successfully!',
      icon: 'success',
    }));
  });

  test('handles edge cases for API error', async () => {
    mock.onPost('/api/add-constraints').reply(500);

    render(<AddConstraints />);

    fireEvent.click(screen.getByText('Monday'));
    fireEvent.click(screen.getByText('Tuesday'));

    fireEvent.change(screen.getByLabelText('Natural Language Time'), { target: { value: '00:00 to 23:59' } });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => expect(Swal.fire).toHaveBeenCalledWith({
      text: 'Error adding constraints',
      icon: 'error',
    }));
  });

  test('renders integration options', () => {
    render(<AddConstraints />);
    expect(screen.getByText('Integration Options')).toBeInTheDocument();
  });

  test('handles Trello integration form submission', async () => {
    mock.onPost('/trello/create-task').reply(200);

    render(<AddConstraints />);

    fireEvent.change(screen.getByLabelText('Integration Type'), { target: { value: 'trello' } });
    fireEvent.change(screen.getByLabelText('Task Name'), { target: { value: 'Test Task' } });
    fireEvent.change(screen.getByLabelText('Task Description'), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: '2023-12-31' } });
    fireEvent.change(screen.getByLabelText('List ID'), { target: { value: '12345' } });

    fireEvent.click(screen.getByText('Submit Integration Task'));

    await waitFor(() => expect(Swal.fire).toHaveBeenCalledWith({
      text: 'Task created successfully in Trello!',
      icon: 'success',
    }));
  });

  test('handles Asana integration form submission', async () => {
    mock.onPost('/asana/create-task').reply(200);

    render(<AddConstraints />);

    fireEvent.change(screen.getByLabelText('Integration Type'), { target: { value: 'asana' } });
    fireEvent.change(screen.getByLabelText('Task Name'), { target: { value: 'Test Task' } });
    fireEvent.change(screen.getByLabelText('Task Description'), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: '2023-12-31' } });
    fireEvent.change(screen.getByLabelText('Project ID'), { target: { value: '67890' } });

    fireEvent.click(screen.getByText('Submit Integration Task'));

    await waitFor(() => expect(Swal.fire).toHaveBeenCalledWith({
      text: 'Task created successfully in Asana!',
      icon: 'success',
    }));
  });

  test('handles Trello integration form submission error', async () => {
    mock.onPost('/trello/create-task').reply(500);

    render(<AddConstraints />);

    fireEvent.change(screen.getByLabelText('Integration Type'), { target: { value: 'trello' } });
    fireEvent.change(screen.getByLabelText('Task Name'), { target: { value: 'Test Task' } });
    fireEvent.change(screen.getByLabelText('Task Description'), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: '2023-12-31' } });
    fireEvent.change(screen.getByLabelText('List ID'), { target: { value: '12345' } });

    fireEvent.click(screen.getByText('Submit Integration Task'));

    await waitFor(() => expect(Swal.fire).toHaveBeenCalledWith({
      text: 'Error creating task in Trello',
      icon: 'error',
    }));
  });

  test('handles Asana integration form submission error', async () => {
    mock.onPost('/asana/create-task').reply(500);

    render(<AddConstraints />);

    fireEvent.change(screen.getByLabelText('Integration Type'), { target: { value: 'asana' } });
    fireEvent.change(screen.getByLabelText('Task Name'), { target: { value: 'Test Task' } });
    fireEvent.change(screen.getByLabelText('Task Description'), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: '2023-12-31' } });
    fireEvent.change(screen.getByLabelText('Project ID'), { target: { value: '67890' } });

    fireEvent.click(screen.getByText('Submit Integration Task'));

    await waitFor(() => expect(Swal.fire).toHaveBeenCalledWith({
      text: 'Error creating task in Asana',
      icon: 'error',
    }));
  });
});
