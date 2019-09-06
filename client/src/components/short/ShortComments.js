import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import AddShortComment from "../create/AddShortComment";
import { deleteComment } from "../../actions/shortStoryActions";

class ShortComments extends Component {
  constructor() {
    super();
    this.state = {
      all: false
    };
  }

  onAllClick() {
    this.setState({ all: true });
  }
  onDeleteClick(id) {
    this.props.deleteComment(this.props.short.short._id, id);
  }
  render() {
    const { short, auth } = this.props;
    let comments;
    if (this.state.all) {
      comments = short.short.comments
        .slice(0)
        .reverse()
        .map((comment, index) => (
          <div className="card mb-2" key={index}>
            <div className="card-header">
              <small>
                {comment.commentUserHandle}
                {(comment.commentUser === auth.user.id ||
                  short.short.user._id === auth.user.id) && (
                  <span
                    className="btn btn-danger float-right"
                    onClick={this.onDeleteClick.bind(this, comment._id)}
                  >
                    <i className="fa fa-times fa-xs" />
                  </span>
                )}
              </small>
            </div>
            <div className="card-body">
              <small
                dangerouslySetInnerHTML={{ __html: comment.commentBody }}
              />
            </div>
          </div>
        ));
    } else {
      comments = short.short.comments
        .slice(0)
        .reverse()
        .map((comment, index) => (
          <div key={index}>
            {index < 5 && (
              <div className="card mb-2">
                <div className="card-header">
                  <small>
                    {comment.commentUserHandle}
                    {(comment.commentUser === auth.user.id ||
                      short.short.user._id === auth.user.id) && (
                      <span
                        className="btn btn-danger float-right"
                        onClick={this.onDeleteClick.bind(this, comment._id)}
                      >
                        <i className="fa fa-times fa-xs" />
                      </span>
                    )}
                  </small>
                </div>
                <div className="card-body">
                  <small
                    dangerouslySetInnerHTML={{ __html: comment.commentBody }}
                  />
                </div>
              </div>
            )}
          </div>
        ));
    }
    return (
      <div className="mt-5" id="comments">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Comments</h5>
          </div>
          <div className="card-body">
            {comments}
            {short.short.comments.length > 5 && (
              <div className="row text-center">
                <div className="col-md-3" />
                <div className="col-md-6 text-center">
                  {!this.state.all && (
                    <a
                      className="btn btn-info"
                      onClick={this.onAllClick.bind(this)}
                      href="#comments"
                    >
                      Show All Comments
                    </a>
                  )}
                </div>
              </div>
            )}
            <AddShortComment short={short} />
          </div>
        </div>
      </div>
    );
  }
}

ShortComments.propTypes = {
  short: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  short: state.short,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { deleteComment }
)(ShortComments);
