import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import {
  getAllShortStories,
  likeshort,
  dislikeshort,
  deleteShortStory
} from "../../actions/shortStoryActions";
import CShort from "./CShort";

class Shorts extends Component {
  componentDidMount() {
    this.props.getAllShortStories();
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
    this.props.likeshort(id, null, null);
  }

  dislike(id) {
    this.props.dislikeshort(id, null, null);
  }

  deletepoem(id) {
    this.props.deleteShortStory(id);
  }

  stripTags = input => {
    input = input.replace(/<(?:.|\n)*?>/gm, " ");
    return input.replace(/&nbsp;/gm, " ");
  };

  render() {
    const { shorts, loading } = this.props.short;
    const { noshortstoryfound } = this.props.errors;

    let allpoems = shorts.map((poem, index) => (
      <CShort poem={poem} key={index}></CShort>
    ));

    let content;
    if (noshortstoryfound !== undefined) {
      content = <h1>SHORT STORY NOT FOUND</h1>;
    } else if (loading) {
      content = <Spinner></Spinner>;
    } else {
      if (Object.keys(shorts).length > 0) {
        content = <div className="row">{allpoems}</div>;
      } else {
        content = <h1>SHORT STORY NOT FOUND</h1>;
      }
    }

    return (
      <div className="poems">
        <div className="container">
          <div className="row">
            <div className="col-md-12 m-auto">
              <h1 className="display-4 text-center">Short Stories</h1>
              {content}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Shorts.propTypes = {
  getAllShortStories: PropTypes.func.isRequired,
  likeshort: PropTypes.func.isRequired,
  dislikeshort: PropTypes.func.isRequired,
  deleteShortStory: PropTypes.func.isRequired,
  poem: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  short: state.short,
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getAllShortStories, likeshort, dislikeshort, deleteShortStory }
)(Shorts);
