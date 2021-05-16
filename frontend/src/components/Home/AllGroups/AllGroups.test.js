import AllGroups from "./AllGroups";
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from 'react-redux';
import Store from '../../../store';
import React from 'react';

test("All Groups", () => {
  render(
    <Provider store={Store}>
      <Router AllGroups={AllGroups}>
        <AllGroups />
      </Router>
  </Provider>
  );
  const linkElement = screen.getByText(/All Groups/);
  expect(linkElement).toBeInTheDocument();
});