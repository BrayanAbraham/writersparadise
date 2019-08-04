import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import DashboardHeader from "./DashboardHeader";
import DashboardPosts from "./DashboardPosts";

class Dashboard extends Component {
  render() {
    const { user } = this.props.auth;
    return (
      <div className="dashboard">
        <div className="row">
          <div className="col-md-12">
            <DashboardHeader user={user} />
            <hr />
            <DashboardPosts user={user} />
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
