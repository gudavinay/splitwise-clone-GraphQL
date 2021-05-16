import { render, screen } from '@testing-library/react';
import Login from './Login';
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from 'react-redux';
import Store from '../../store';

test('renders Login', () => {
  render(
    <Provider store={Store}>
      <Router login={Login}>
        <Login />
      </Router>
  </Provider>);
  const linkElement = screen.getByText(/WELCOME TO SPLITWISE/);
  expect(linkElement).toBeInTheDocument();
});