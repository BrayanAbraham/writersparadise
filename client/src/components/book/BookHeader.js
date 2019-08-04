import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import isEmpty from "../../validation/is-empty";
import { Link } from "react-router-dom";
import { deleteBook, likebook, dislikebook } from "../../actions/bookActions";
import { withRouter } from "react-router-dom";

class BookHeader extends Component {
  deleteBook(id) {
    this.props.deleteBook(id, "user", this.props.auth.user.id);
    this.props.history.push("/dashboard");
  }

  like(id) {
    this.props.likebook(id, "id", null);
  }

  dislike(id) {
    this.props.dislikebook(id, "id", null);
  }

  render() {
    const { book } = this.props.book;
    const { user } = this.props.auth;
    let writeroptions = {};
    let bookimage;
    let genrelist;
    if (book.image === "noimage") {
      bookimage = (
        <img
          src={require("../../img/nobookimage.png")}
          alt="not found"
          className="img-thumbnail img-fluid rounded mx-auto d-block"
        />
      );
    } else {
      bookimage = (
        <img
          src={require(`../../../../public/uploads/${book.image}`)}
          alt="not found"
          className="img-thumbnail img-fluid rounded mx-auto d-block"
        />
      );
    }
    if (!isEmpty(user) && book.user.handle === user.handle) {
      const to = "/edit-book/" + book._id;
      writeroptions.editheader = (
        <div className="float-right">
          <Link className=" btn btn-light mr-2" to={to}>
            <i className="fa fa-pencil fa-lg" />
          </Link>
          <button
            className=" btn btn-danger text-white"
            onClick={this.deleteBook.bind(this, book._id)}
          >
            <i className="fa fa-times fa-lg" />
          </button>
        </div>
      );
      writeroptions.image = (
        <div className="col-md-3 col-sm-3 col-6 m-auto">
          <div className="row">{bookimage}</div>
          <div className="row">
            <div className="col-md-12">
              <div className="col-md-12 text-center">
                <small>Click on the Image to change</small>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      writeroptions.image = (
        <div className="col-md-3 col-sm-3 col-6 m-auto">
          <div className="row">{bookimage}</div>
        </div>
      );
    }

    genrelist = book.genre.map((genre, index) => (
      <div className="btn btn-light text-primary ml-1 mr-1" key={index}>
        {genre}
      </div>
    ));

    let likebuttons;
    if (!isEmpty(this.props.auth.user)) {
      likebuttons = (
        <span>
          <button
            className="btn btn-primary mr-2"
            onClick={this.like.bind(this, book._id)}
          >
            <i className="fa fa-thumbs-up" /> Like
          </button>
          <button
            className="btn btn-danger"
            onClick={this.dislike.bind(this, book._id)}
          >
            <i className="fa fa-thumbs-down" /> Disike
          </button>
        </span>
      );
    }

    return (
      <div className="bookheader">
        <div className="row">
          {writeroptions.image}
          <div className="col-md-9 col-sm-9">
            <div className="row">
              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-12 col-12 text-center">
                    <span className="display-4">{book.title}</span>
                    {writeroptions.editheader}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 col-12">
                    <p>{book.bookdesc}</p>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-12 col-12">Genre:{genrelist}</div>
                </div>
                <div className="row">
                  <div className="col-md-6 col-6">
                    Chapters: {book.chapters.length}
                  </div>
                  <div className="col-md-6 col-6">
                    Likes: {book.likes.length}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 col-6" />
                  <div className="col-md-6 col-6 m-auto">{likebuttons}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

BookHeader.propTypes = {
  book: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteBook: PropTypes.func.isRequired,
  likebook: PropTypes.func.isRequired,
  dislikebook: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  book: state.book,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { deleteBook, likebook, dislikebook }
)(withRouter(BookHeader));
