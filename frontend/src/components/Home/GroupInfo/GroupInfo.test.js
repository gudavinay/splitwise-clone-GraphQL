import GroupInfo from "./GroupInfo";
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from 'react-redux';
import Store from '../../../store';
import React from 'react';
test("Group Info", () => {
  render(
    <Provider store={Store}>
      <Router GroupInfo={GroupInfo}>
        <GroupInfo />
      </Router>
  </Provider>
  );
  const linkElement = screen.getByText(/GROUP BALANCES/);
  expect(linkElement).toBeInTheDocument();
});