import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import { clearCurrentProfile } from './actions/profileActions';

import { Provider } from 'react-redux';
import store from './store';

import PrivateRoute from './components/common/PrivateRoute';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/create-profile/CreateProfile';
import EditProfile from './components/edit-profile/EditProfile';
import AddExperience from "./components/add-credentials/AddExperience";
import AddEducation from "./components/add-credentials/AddEducation";

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
        store.dispatch(logoutUser());
        //Clear Current Profile
        store.dispatch(clearCurrentProfile());
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
              <Switch>
                <Route exact path="/register" component={ Register } />
                <Route exact path="/login" component={ Login } />
                <PrivateRoute exact path="/dashboard" component={ Dashboard } />
                <PrivateRoute exact path="/create-profile" component={ CreateProfile } />
                <PrivateRoute exact path="/edit-profile" component={ EditProfile } />
                <PrivateRoute exact path="/add-experience" component={ AddExperience } />
                <PrivateRoute exact path="/add-education" component={ AddEducation } />
              </Switch>
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
