import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getBook } from "../../actions/bookActions";
import isEmpty from "../../validation/is-empty";
import Spinner from "../common/Spinner";
import { Link } from "react-router-dom";

class ReadBook extends Component {
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getBook(id);
  }

  componentWillReceiveProps(nextProps) {
    const { book } = nextProps.book;
    const { user } = nextProps.auth;
    if (
      !isEmpty(book) &&
      book.status !== "Public" &&
      (user.handle === undefined || user.handle !== book.user.handle)
    ) {
      this.props.history.push("/books");
    }
  }

  getImage(name) {
    if (name === "noimage") {
      return null;
    } else {
      return (
        <div className="book-image card card-body mb-5">
          <img
            src={require(`../../../../public/uploads/${name}`)}
            alt=""
            className="card-img-top"
          />
        </div>
      );
    }
  }

  render() {
    const { book, loading } = this.props.book;
    const { nobookfound } = this.props.errors;

    let content, chapters;

    if (!isEmpty(book)) {
      chapters = book.chapters
        .slice(0)
        .reverse()
        .map((chapter, index) => (
          <div className="readbookchapter mb-3" key={index}>
            <div className="readbookchaptertitle text-center mb-5">
              <h1 style={{ fontFamily: "Times" }}>{chapter.title}</h1>
            </div>
            <div className="readbookchaptercontent text-justify">
              <div dangerouslySetInnerHTML={{ __html: chapter.body }} />
            </div>
            <hr className="bigHr col-11" />
          </div>
        ));
    }

    if (nobookfound !== undefined) {
      content = <h1>BOOK NOT FOUND</h1>;
    } else if (book === null || loading) {
      content = <Spinner />;
    } else {
      if (Object.keys(book).length > 0) {
        content = (
          <div className="container">
            <Link className="btn btn-light" to={`/book/${book._id}`}>
              <i className="fa fa-arrow-left" /> Book Details
            </Link>
            <div className="row ">
              <div className="col-1" />
              <div className="col-10">
                <h1
                  className="text-center display-1"
                  style={{ fontFamily: "Times" }}
                >
                  {book.title}
                </h1>
                {this.getImage(book.image)}
                {chapters}
              </div>
              <div className="col-1" />
            </div>
          </div>
        );
      } else {
        content = <h1>BOOK NOT FOUND</h1>;
      }
    }

    return <div>{content}</div>;
  }
}

ReadBook.propTypes = {
  auth: PropTypes.object.isRequired,
  getBook: PropTypes.func.isRequired,
  book: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  book: state.book,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getBook }
)(ReadBook);
