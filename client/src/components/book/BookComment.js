import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import AddComment from "../create/AddComment";
import { deleteComment } from "../../actions/bookActions";

class BookComment extends Component {
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
    this.props.deleteComment(this.props.book.book._id, id);
  }
  render() {
    const { book, auth } = this.props;
    let comments;
    if (this.state.all) {
      comments = book.book.comments
        .slice(0)
        .reverse()
        .map((comment, index) => (
          <div className="card mb-2" key={index}>
            <div className="card-header">
              <small>
                {comment.commentUserHandle}
                {(comment.commentUser === auth.user.id ||
                  book.book.user._id === auth.user.id) && (
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
      comments = book.book.comments
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
                      book.book.user._id === auth.user.id) && (
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
            {book.book.comments.length > 5 && (
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
            <AddComment book={book} />
          </div>
        </div>
      </div>
    );
  }
}

BookComment.propTypes = {
  book: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  book: state.book,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { deleteComment }
)(BookComment);
