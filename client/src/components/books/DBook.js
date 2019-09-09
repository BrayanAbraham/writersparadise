import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import isEmpty from "../../validation/is-empty";
import { likebook, dislikebook, deleteBook } from "../../actions/bookActions";

class DBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
  componentDidMount() {
    this.setState({ count: this.props.book.likes.length });
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
    this.props.likebook(id, "try", null);
    if (
      this.props.book.likes.filter(
        like => like.user.toString() === this.props.auth.user.id
      ).length === 0
    ) {
      this.setState({ count: this.state.count + 1 });
      this.props.book.likes.unshift({ user: this.props.auth.user.id });
    }
  }

  dislike(id) {
    this.props.dislikebook(id, "try", null);
    if (
      this.props.book.likes.filter(
        like => like.user.toString() === this.props.auth.user.id
      ).length > 0
    ) {
      const removeIndex = this.props.book.likes
        .map(item => item.user.toString())
        .indexOf(this.props.auth.user.id);
      this.props.book.likes.splice(removeIndex, 1);
      this.setState({ count: this.state.count - 1 });
    }
  }

  deleteBook(id) {
    this.props.deleteBook(id);
  }

  stripTags = input => {
    input = input.replace(/<(?:.|\n)*?>/gm, " ");
    return input.replace(/&nbsp;/gm, " ");
  };
  render() {
    const { book } = this.props;
    return (
      <div className="book col-md-3 col-sm-6">
        <div className="card h-100">
          <Link to={`/book/${book._id}`}>{this.getImage(book.image)}</Link>
          <div className="card-body text-center">
            <Link to={`/book/${book._id}`} style={{ textDecoration: "none" }}>
              <h5 className="card-title">{book.title}</h5>
            </Link>
            <div className="text-white">
              <small className="bg-primary pr-2 pl-2 pt-1 pb-1">
                {book.status}
              </small>
            </div>
            <small>
              {book.user.handle !== this.props.auth.user.handle && (
                <span>
                  <i className="fa fa-align-justify ml-3" />{" "}
                  {book.chapters.length}
                </span>
              )}
              {book.user.handle === this.props.auth.user.handle && (
                <span>
                  <span className="point">
                    <Link
                      to={`/edit-book/${book._id}`}
                      className="likebutton"
                      style={{ textDecoration: "none" }}
                    >
                      <i className="fa fa-pencil" /> Edit
                    </Link>
                  </span>
                  <i className="fa fa-align-justify ml-3" />{" "}
                  {book.chapters.length}
                  <span
                    className="point dislikebutton"
                    onClick={this.deleteBook.bind(this, book._id)}
                  >
                    <i className="fa fa-times ml-3" /> Delete
                  </span>
                </span>
              )}
              {isEmpty(this.props.auth.user) && (
                <span>
                  <i className="fa fa-heart text-danger ml-2" />{" "}
                  {book.likes.length}
                </span>
              )}
            </small>
            <br />
            {!isEmpty(this.props.auth.user) && (
              <small>
                <button
                  className="btn btn-light likebutton"
                  onClick={this.like.bind(this, book._id)}
                >
                  <i className="fa fa-thumbs-up" /> Like
                </button>
                <i className="fa fa-heart text-danger ml-2" />{" "}
                {book.likes.length}
                <button
                  className="btn btn-light dislikebutton"
                  onClick={this.dislike.bind(this, book._id)}
                >
                  <i className="fa fa-thumbs-down" /> Disike
                </button>
              </small>
            )}
            <p className="card-text">
              {this.snip(this.stripTags(book.bookdesc), 20)}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

DBook.propTypes = {
  likebook: PropTypes.func.isRequired,
  dislikebook: PropTypes.func.isRequired,
  deleteBook: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  book: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { likebook, deleteBook, dislikebook }
)(DBook);
