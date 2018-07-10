import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import { connect } from 'react-redux'; //Connect Redux from to Component
import { registerUser } from '../../actions/authActions';

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      password2: '',
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidUpdate(prevProps) {
    if(prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };

    //Props for any action bring in 
    this.props.registerUser(newUser, this.props.history); //this props is permit a redirect in this action.
  }

  render() {
    const { errors } = this.state;


    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">
                Create your DevPortfolio account
              </p>
              <form noValidate onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    className={ classnames('form-control form-control-lg', {
                      'is-invalid': errors.name
                    }) }
                    placeholder="Name"
                    name="name"
                    value={ this.state.name }
                    onChange={ this.onChange }
                  />
                  { errors.name ? (
                    <div className="invalid-feedback">{ errors.name }</div>
                  ) : null }
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    className={ classnames('form-control form-control-lg', {
                      'is-invalid': errors.email
                    }) }
                    placeholder="Email Address"
                    name="email"
                    value={ this.state.email }
                    onChange={ this.onChange }
                  />
                  { errors.email ? (
                    <div className="invalid-feedback">{ errors.email }</div>
                  ): null }
                  <small className="form-text text-muted">
                    This site uses Gravatar so if you want a profile image, use
                    a Gravatar email
                  </small>
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className={ classnames('form-control form-control-lg', {
                      'is-invalid': errors.password
                    }) }
                    placeholder="Password"
                    name="password"
                    value={ this.state.password }
                    onChange={ this.onChange }
                  />
                  { errors.password ? (
                    <div className="invalid-feedback">{errors.password}</div>
                  ): null }
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className={ classnames('form-control form-control-lg', {
                      'is-invalid': errors.password2
                    }) }
                    placeholder="Confirm Password"
                    name="password2"
                    value={ this.state.password2 }
                    onChange={ this.onChange }
                  />
                  { errors.password2 ? (
                    <div className="invalid-feedback">{ errors.password2 }</div>
                  ): null }
                </div>
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

//Mapping all propTypes
Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

//This 'auth', after 'state' comming from root Reducer 
const mapStateProps = (state) => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateProps, { registerUser })(withRouter(Register));
