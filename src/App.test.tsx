import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders loading state', () => {
  render(<App />);
  const loading = screen.getByText(/Carregando pets.../i);
  expect(loading).toBeInTheDocument();
});
