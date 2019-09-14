import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPoemByUser } from "../../actions/poemActions";
import DPoem from "../poem/DPoem";

class DashboardPoems extends Component {
  componentWillMount() {
    const { user } = this.props;
    this.props.getPoemByUser(user.id);
  }

  render() {
    const { poems } = this.props.poem;
    let userpoems = poems.map((poem, index) => (
      <DPoem poem={poem} key={index}></DPoem>
    ));
    return <div className="row">{userpoems}</div>;
  }
}

DashboardPoems.propTypes = {
  poem: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  getPoemByUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  poem: state.poem,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getPoemByUser }
)(DashboardPoems);
