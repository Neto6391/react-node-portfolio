import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';

import { Provider } from 'react-redux';
import store from './store';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';

class App extends Component {

  componentDidMount() {
    //Check Token exists in ls
    if(localStorage.jwtToken) {
      //Set auth Token header auth
      setAuthToken(localStorage.jwtToken);
      //Decode Token and get user info and exp.
      const decodedToken = jwt_decode(localStorage.jwtToken);
      //Set user is Authenticated
      store.dispatch(setCurrentUser(decodedToken));
      
      //Check for expired token
      const currentTime = Date.now() / 1000;
      if(decodedToken.exp < currentTime) {
        //logout user
        store.dispatch(logoutUser);
        //TODO: Clear Current Profile

        //Redirect to Login
        window.location.href="/login";
      }
    }
  }

  render() {
    return (
      <Provider store={ store }>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={ Landing } />
            <div className="container">
              <Route exact path="/register" component={ Register } />
              <Route exact path="/login" component={ Login } />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
