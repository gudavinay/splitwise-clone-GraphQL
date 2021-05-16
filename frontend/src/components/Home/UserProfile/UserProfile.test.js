import UserProfile from "./UserProfile";
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from 'react-redux';
import Store from '../../../store';
import React from 'react';
test("User Profile", () => {
  render(
    <Provider store={Store}>
      <Router UserProfile={UserProfile}>
        <UserProfile />
      </Router>
  </Provider>);
  const linkElement = screen.getByText(/Your account/);
  expect(linkElement).toBeInTheDocument();
});