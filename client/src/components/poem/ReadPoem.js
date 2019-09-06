import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getPoem,
  uploadimage,
  likepoem,
  deletePoem,
  dislikepoem
} from "../../actions/poemActions";
import isEmpty from "../../validation/is-empty";
import Spinner from "../common/Spinner";
import { Link, withRouter } from "react-router-dom";
import PoemComment from "./PoemComment";

class ReadPoem extends Component {
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getPoem(id);
  }

  componentWillReceiveProps(nextProps) {
    const { poem } = nextProps.poem;
    const { user } = nextProps.auth;
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (
      !isEmpty(poem) &&
      poem.status !== "Public" &&
      (user.handle === undefined || user.handle !== poem.user.handle)
    ) {
      this.props.history.push("/poems");
    }
  }

  deletePoem(id) {
    this.props.deletePoem(id);
    this.props.history.push("/dashboard");
  }

  like(id) {
    this.props.likepoem(id, "id", null);
  }

  dislike(id) {
    this.props.dislikepoem(id, "id", null);
  }

  render() {
    const { poem, loading } = this.props.poem;
    const { nopoemfound } = this.props.errors;
    const { user } = this.props.auth;
    let content;
    let writeroptions = {};
    if (nopoemfound !== undefined) {
      content = <h1>POEM NOT FOUND</h1>;
    } else if (poem === null || loading) {
      content = <Spinner />;
    } else {
      if (Object.keys(poem).length > 0) {
        if (!isEmpty(user) && poem.user.handle === user.handle) {
          writeroptions.edit = (
            <Link className="btn btn-light mr-2" to={`/edit-poem/${poem._id}`}>
              <i className="fa fa-pencil" /> Edit
            </Link>
          );
          writeroptions.delete = (
            <button
              className="btn-danger btn text-white"
              onClick={this.deletePoem.bind(this, poem._id)}
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
                onClick={this.like.bind(this, poem._id)}
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
                onClick={this.dislike.bind(this, poem._id)}
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
                  {poem.title}
                </h1>
                <div className="text-center">
                  {writeroptions.edit}
                  {writeroptions.delete}
                  {writeroptions.likebuttons}
                  <i className="fa fa-heart text-danger"></i>{" "}
                  {poem.likes.length}
                  {writeroptions.dislikebuttons}
                </div>
                <div className="text-justify text-center">
                  <div dangerouslySetInnerHTML={{ __html: poem.body }} />
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        content = <h1>POEM NOT FOUND</h1>;
      }
    }
    return (
      <div>
        {content}
        {poem.allowComments && <PoemComment poem={poem}></PoemComment>}
      </div>
    );
  }
}

ReadPoem.propTypes = {
  auth: PropTypes.object.isRequired,
  getPoem: PropTypes.func.isRequired,
  uploadimage: PropTypes.func.isRequired,
  likepoem: PropTypes.func.isRequired,
  deletePoem: PropTypes.func.isRequired,
  dislikepoem: PropTypes.func.isRequired,
  poem: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  poem: state.poem,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getPoem, uploadimage, likepoem, deletePoem, dislikepoem }
)(withRouter(ReadPoem));
