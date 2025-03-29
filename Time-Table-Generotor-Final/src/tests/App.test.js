import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';

test('renders main application without crashing', () => {
  const { getByText } = render(<App />);
  expect(getByText(/Time Table Generator/i)).toBeInTheDocument();
});
