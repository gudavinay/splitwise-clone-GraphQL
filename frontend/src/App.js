import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Main from './components/Main.js'
import { Component } from 'react';
import ApolloClient from 'apollo-boost';
import backendServer from './webConfig';
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient({
  uri: `${backendServer}/graphql`,
});
class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
      <Provider store={store}>
        <div>
          <BrowserRouter>
            <Main />
          </BrowserRouter>
        </div>
      </Provider>
    </ApolloProvider>
    );
  }
}

export default App;
