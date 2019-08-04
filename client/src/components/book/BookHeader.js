import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import isEmpty from "../../validation/is-empty";
import { Link } from "react-router-dom";

class BookHeader extends Component {
  render() {
    const { book } = this.props.book;
    const { user } = this.props.auth;
    let writeroptions = {};
    let bookimage;
    let genrelist;
    if (book.image === "noimage") {
      bookimage = (
        <img
          src={require("../../img/noimage.png")}
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
        <Link className="float-right btn btn-light" to={to}>
          <i className="fa fa-pencil fa-lg" />
        </Link>
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
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  book: state.book,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {}
)(BookHeader);
