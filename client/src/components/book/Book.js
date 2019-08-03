import React, { Component } from "react";
import { connect } from "react-redux";
import { getBook } from "../../actions/bookActions";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";
import BookHeader from "./BookHeader";

class Book extends Component {
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getBook(id);
  }
  render() {
    const { book, loading } = this.props.book;
    const { nobookfound } = this.props.errors;
    let content;
    if (nobookfound !== undefined) {
      content = <h1>BOOK NOT FOUND</h1>;
    } else if (book === null || loading) {
      content = <Spinner />;
    } else {
      if (Object.keys(book).length > 0) {
        content = (
          <div>
            <BookHeader book={book} />
          </div>
        );
      } else {
        content = <h1>BOOK NOT FOUND</h1>;
      }
    }
    return <div className="book">{content}</div>;
  }
}

Book.propTypes = {
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
)(Book);
