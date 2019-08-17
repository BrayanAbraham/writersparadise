import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import DashboardHeader from "./DashboardHeader";
import DashboardPosts from "./DashboardPosts";
import DashboardPoems from "./DashboardPoems";

class Dashboard extends Component {
  render() {
    const { user } = this.props.auth;
    return (
      <div className="dashboard">
        <div className="row">
          <div className="col-md-12">
            <DashboardHeader user={user} />
            <hr />
            <div className="row text-center">
              <h1 className="col-md-12 display-4 text-center">Books</h1>
            </div>
            <DashboardPosts user={user} />
            <hr />
            <div className="row text-center">
              <h1 className="col-md-12 display-4 text-center">Poems</h1>
            </div>
            <DashboardPoems user={user} />
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {}
)(Dashboard);
