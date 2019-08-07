import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import isEmpty from "../../validation/is-empty";
import { Link } from "react-router-dom";
import classnames from "classnames";
import {
  deleteBook,
  likebook,
  dislikebook,
  uploadimage
} from "../../actions/bookActions";
import { withRouter } from "react-router-dom";

class BookHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      errors: {}
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.errors) {
      this.setState({ errors: newProps.errors });
    }
  }

  onFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("myImage", this.state.file);
    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };
    this.props.uploadimage(formData, config, this.props.book.book._id);
  }
  onChange(e) {
    this.setState({ file: e.target.files[0] });
  }
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
    const { errors } = this.props;
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
          <div
            className="row point"
            data-toggle="modal"
            data-target="#imageuploadmodal"
          >
            {bookimage}
          </div>
          <div
            className="modal fade"
            id="imageuploadmodal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Upload Book Image
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <form onSubmit={this.onFormSubmit}>
                  <div className="modal-body">
                    <small className="form-text text-muted">
                      Max Size: 1MB, Files : jpg,jpeg,png
                    </small>
                    <input
                      type="file"
                      name="myImage"
                      className={classnames("form-control", {
                        "is-invalid": errors.file
                      })}
                      onChange={this.onChange}
                    />
                    {errors.file && (
                      <div className="invalid-feedback">{errors.file}</div>
                    )}
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-dismiss="modal"
                    >
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Upload
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
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
            <small>
              <i className="fa fa-thumbs-up" /> Like
            </small>
          </button>
          <button
            className="btn btn-danger"
            onClick={this.dislike.bind(this, book._id)}
          >
            <small>
              <i className="fa fa-thumbs-down" /> Disike
            </small>
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
                    <div dangerouslySetInnerHTML={{ __html: book.bookdesc }} />
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
                  <div className="col-md-6 col-6">{likebuttons}</div>
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
  dislikebook: PropTypes.func.isRequired,
  uploadimage: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  book: state.book,
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { deleteBook, likebook, dislikebook, uploadimage }
)(withRouter(BookHeader));
