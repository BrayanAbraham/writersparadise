import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  getBooksByUser,
  likebook,
  dislikebook,
  deleteBook
} from "../../actions/bookActions";

class DashboardPosts extends Component {
  componentWillMount() {
    const { user } = this.props;
    this.props.getBooksByUser(user.id);
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
    this.props.likebook(id, "user", this.props.auth.user.id);
  }

  dislike(id) {
    this.props.dislikebook(id, "user", this.props.auth.user.id);
  }

  deleteBook(id) {
    this.props.deleteBook(id, "user", this.props.auth.user.id);
  }

  render() {
    const { books } = this.props.book;
    let userbooks = books.map((book, index) => (
      <div className="book col-md-4 col-sm-6" key={index}>
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
              <i className="fa fa-align-justify" /> {book.chapters.length}
              <i className="fa fa-heart text-danger ml-2" /> {book.likes.length}
              <span className="point">
                <Link
                  to={`/edit-book/${book._id}`}
                  className="likebutton"
                  style={{ textDecoration: "none" }}
                >
                  <i className="fa fa-pencil ml-3" /> Edit
                </Link>
              </span>
              <span
                className="point dislikebutton"
                onClick={this.deleteBook.bind(this, book._id)}
              >
                <i className="fa fa-times ml-3" /> Delete
              </span>
            </small>
            <br />
            <small>
              <button
                className="btn btn-light likebutton"
                onClick={this.like.bind(this, book._id)}
              >
                <i className="fa fa-thumbs-up" /> Like
              </button>
              <button
                className="btn btn-light dislikebutton"
                onClick={this.dislike.bind(this, book._id)}
              >
                <i className="fa fa-thumbs-down" /> Disike
              </button>
            </small>
            <p className="card-text">{this.snip(book.bookdesc, 150)}</p>
          </div>
        </div>
      </div>
    ));
    return <div className="row">{userbooks}</div>;
  }
}

DashboardPosts.propTypes = {
  book: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  getBooksByUser: PropTypes.func.isRequired,
  likebook: PropTypes.func.isRequired,
  dislikebook: PropTypes.func.isRequired,
  deleteBook: PropTypes.func.isRequired
};

const MapStateToProps = state => ({
  book: state.book,
  auth: state.auth
});

export default connect(
  MapStateToProps,
  { getBooksByUser, likebook, dislikebook, deleteBook }
)(DashboardPosts);
