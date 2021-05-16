import NewGroup from "./NewGroup";
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from 'react-redux';
import Store from '../../../store';
import React from 'react';
test("New Group", () => {
  render(
    <Provider store={Store}>
      <Router NewGroup={NewGroup}>
        <NewGroup />
      </Router>
  </Provider>
  );
  const linkElement = screen.getByText(/START A NEW GROUP/);
  expect(linkElement).toBeInTheDocument();
});