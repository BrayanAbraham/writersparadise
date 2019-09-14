import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getShortStoryByUser,
  likeshort,
  dislikeshort,
  deleteShortStory
} from "../../actions/shortStoryActions";
import DShort from "../short/DShort";

class DashboardShorts extends Component {
  componentWillMount() {
    const { user } = this.props;
    this.props.getShortStoryByUser(user.id);
  }

  snip(str, len) {
    if (str.length > len && str.length > 0) {
      var new_str = str + " ";
      new_str = str.substr(0, len);
      new_str = str.substr(0, new_str.lastIndexOf(" "));
      new_str = new_str.length > 0 ? new_str : str.substr(0, len);
      return new_str + "...";
    }
    return str;
  }

  getImage(name) {
    if (name === "noimage") {
      return (
        <img
          src={require("../../img/nobookimage.png")}
          alt=""
          className="card-img-top"
        />
      );
    } else {
      return (
        <img
          src={require(`../../../../public/uploads/${name}`)}
          alt=""
          className="card-img-top"
        />
      );
    }
  }

  like(id) {
    this.props.likeshort(id, "user", this.props.auth.user.id);
  }

  dislike(id) {
    this.props.dislikeshort(id, "user", this.props.auth.user.id);
  }

  deletePoem(id) {
    this.props.deleteShortStory(id, "user", this.props.auth.user.id);
  }

  stripTags = input => {
    input = input.replace(/<(?:.|\n)*?>/gm, " ");
    return input.replace(/&nbsp;/gm, " ");
  };

  render() {
    const { shorts } = this.props.short;
    let usershorts = shorts.map((short, index) => (
      <DShort short={short} key={index}></DShort>
    ));
    return <div className="row">{usershorts}</div>;
  }
}

DashboardShorts.propTypes = {
  short: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  getShortStoryByUser: PropTypes.func.isRequired,
  likeshort: PropTypes.func.isRequired,
  dislikeshort: PropTypes.func.isRequired,
  deleteShortStory: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  short: state.short,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getShortStoryByUser, likeshort, dislikeshort, deleteShortStory }
)(DashboardShorts);
