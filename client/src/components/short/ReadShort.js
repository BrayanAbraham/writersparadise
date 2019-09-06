import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getShortStory,
  likeshort,
  deleteShortStory,
  dislikeshort
} from "../../actions/shortStoryActions";
import isEmpty from "../../validation/is-empty";
import Spinner from "../common/Spinner";
import { Link, withRouter } from "react-router-dom";
import ShortComments from "./ShortComments";

class ReadShort extends Component {
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getShortStory(id);
  }

  componentWillReceiveProps(nextProps) {
    const { short } = nextProps.short;
    const { user } = nextProps.auth;
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (
      !isEmpty(short) &&
      short.status !== "Public" &&
      (user.handle === undefined || user.handle !== short.user.handle)
    ) {
      this.props.history.push("/shorts");
    }
  }

  deleteShort(id) {
    this.props.deleteShortStory(id);
    this.props.history.push("/dashboard");
  }

  like(id) {
    this.props.likeshort(id, "id", null);
  }

  dislike(id) {
    this.props.dislikeshort(id, "id", null);
  }

  render() {
    const { short, loading } = this.props.short;
    const { noshortstoryfound } = this.props.errors;
    const { user } = this.props.auth;
    let content;
    let writeroptions = {};
    if (noshortstoryfound !== undefined) {
      content = <h1>SHORT STORY NOT FOUND</h1>;
    } else if (short === null || loading) {
      content = <Spinner />;
    } else {
      if (Object.keys(short).length > 0) {
        if (!isEmpty(user) && short.user.handle === user.handle) {
          writeroptions.edit = (
            <Link
              className="btn btn-light mr-2"
              to={`/edit-short/${short._id}`}
            >
              <i className="fa fa-pencil" /> Edit
            </Link>
          );
          writeroptions.delete = (
            <button
              className="btn-danger btn text-white"
              onClick={this.deleteShort.bind(this, short._id)}
            >
              <i className="fa fa-times"></i> Delete
            </button>
          );
        }
        if (!isEmpty(this.props.auth.user)) {
          writeroptions.likebuttons = (
            <span>
              <button
                className="btn btn-primary mr-2 ml-2"
                onClick={this.like.bind(this, short._id)}
              >
                <small>
                  <i className="fa fa-thumbs-up"></i> Like
                </small>
              </button>
            </span>
          );
          writeroptions.dislikebuttons = (
            <span>
              <button
                className="btn btn-danger ml-2"
                onClick={this.dislike.bind(this, short._id)}
              >
                <small>
                  <i className="fa fa-thumbs-down"></i> Dislike
                </small>
              </button>
            </span>
          );
        }
        content = (
          <div className="container">
            <div className="row">
              <div className="col-1" />
              <div className="col-10">
                <h1
                  className="text-center display-1"
                  style={{ fontFamily: "Times" }}
                >
                  {short.title}
                </h1>
                <div className="text-center">
                  {writeroptions.edit}
                  {writeroptions.delete}
                  {writeroptions.likebuttons}
                  <i className="fa fa-heart text-danger"></i>{" "}
                  {short.likes.length}
                  {writeroptions.dislikebuttons}
                </div>
                <div className="text-justify text-center">
                  <div dangerouslySetInnerHTML={{ __html: short.body }} />
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        content = <h1>SHORT STORY NOT FOUND</h1>;
      }
    }
    return (
      <div>
        {content}
        {short.allowComments && <ShortComments short={short}></ShortComments>}
      </div>
    );
  }
}

ReadShort.propTypes = {
  auth: PropTypes.object.isRequired,
  getShortStory: PropTypes.func.isRequired,
  likeshort: PropTypes.func.isRequired,
  deleteShortStory: PropTypes.func.isRequired,
  dislikeshort: PropTypes.func.isRequired,
  short: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  short: state.short,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getShortStory, likeshort, deleteShortStory, dislikeshort }
)(withRouter(ReadShort));
