import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

class Navbar extends Component {
  onLogoutClick(e) {
    e.preventDefault();
    this.props.logoutUser();
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authlinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item dropdown custom-caret">
          <div
            className="nav-link point"
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <i className="fa fa-plus" /> Write
          </div>
          <div
            className="dropdown-menu bd-drop "
            aria-labelledby="navbarDropdown"
          >
            <Link className="dropdown-item point item-hover" to="/create-book">
              New Book
            </Link>
          </div>
        </li>
        <li className="nav-item dropdown">
          <div
            className="nav-link dropdown-toggle point"
            href="#"
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {user.name}
          </div>
          <div
            className="dropdown-menu bd-drop "
            aria-labelledby="navbarDropdown"
          >
            <Link className="dropdown-item point item-hover" to="/dashboard">
              Dashboard
            </Link>
            <Link className="dropdown-item point item-hover" to="/edit-profile">
              Edit Profile
            </Link>
            <div
              className="dropdown-item point item-hover"
              onClick={this.onLogoutClick.bind(this)}
            >
              Logout
            </div>
          </div>
        </li>
      </ul>
    );

    const guestlinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/register">
            Sign Up
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </li>
      </ul>
    );
    return (
      <nav className="navbar navbar-expand-sm navbar-dark bd-navbar mb-4 fixed-top">
        <div className="container">
          <div className="navbar-header">
            <Link className="navbar-brand" to="/">
              Project
            </Link>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="mobile-nav">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/books">
                  Books
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link className="nav-link" to="/poems">
                  Poems
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/short-stories">
                  Short Stories
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/thoughts">
                  Quotes
                </Link>
              </li> */}
            </ul>
            {isAuthenticated ? authlinks : guestlinks}
          </div>
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({ auth: state.auth });

export default connect(
  mapStateToProps,
  { logoutUser }
)(Navbar);
