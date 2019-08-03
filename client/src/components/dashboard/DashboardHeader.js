import React, { Component } from "react";
import PropTypes from "prop-types";

class DashboardHeader extends Component {
  render() {
    const { user } = this.props;
    return (
      <div className="dashboardheader">
        <div className="row">
          <div className="col-md-3 col-sm-3 col-6 m-auto">
            <img
              src={require("../../img/noimage.png")}
              alt="not found"
              className="img-thumbnail img-fluid rounded mx-auto d-block"
            />
          </div>
          <div className="col-md-9 col-sm-9">
            <div className="row">
              <div className="col-md-12">
                <h3 className="text-center">{user.handle}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DashboardHeader.propTypes = {
  user: PropTypes.object.isRequired
};

export default DashboardHeader;
