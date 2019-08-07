import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import isEmpty from "../../validation/is-empty";
import Spinner from "../common/Spinner";
import {
  getAllBooks,
  likebook,
  dislikebook,
  deleteBook
} from "../../actions/bookActions";

class Books extends Component {
  componentDidMount() {
    this.props.getAllBooks();
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
    this.props.likebook(id, null, null);
  }

  dislike(id) {
    this.props.dislikebook(id, null, null);
  }

  deleteBook(id) {
    this.props.deleteBook(id);
  }

  stripTags = input => {
    input = input.replace(/<(?:.|\n)*?>/gm, "");
    return input.replace(/&nbsp;/gm, "");
  };

  render() {
    const { books, loading } = this.props.book;
    const { nobookfound } = this.props.errors;

    let allbooks = books.map((book, index) => (
      <div className="book col-md-4 col-sm-6" key={index}>
        <div className="card h-100">
          <Link to={`/book/${book._id}`}>{this.getImage(book.image)}</Link>
          <div className="card-body text-center">
            <Link to={`/book/${book._id}`} style={{ textDecoration: "none" }}>
              <h5 className="card-title">{book.title}</h5>
            </Link>
            <div>By {book.user.handle}</div>
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
              {this.snip(this.stripTags(book.bookdesc), 150)}
            </p>
          </div>
        </div>
      </div>
    ));

    let content;
    if (nobookfound !== undefined) {
      content = <h1>BOOK NOT FOUND</h1>;
    } else if (loading) {
      content = <Spinner />;
    } else {
      if (Object.keys(books).length > 0) {
        content = <div className="row">{allbooks}</div>;
      } else {
        content = <h1>BOOK NOT FOUND</h1>;
      }
    }

    return (
      <div className="books">
        <div className="container">
          <div className="row">
            <div className="col-md-12 m-auto">
              <h1 className="display-4 text-center">Books</h1>
              {content}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Books.porpTypes = {
  getAllBooks: PropTypes.func.isRequired,
  book: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  likebook: PropTypes.func.isRequired,
  dislikebook: PropTypes.func.isRequired,
  deleteBook: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  book: state.book,
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getAllBooks, likebook, dislikebook, deleteBook }
)(Books);
