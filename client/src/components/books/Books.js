import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import { getAllBooks } from "../../actions/bookActions";
import CBook from "./CBook";

class Books extends Component {
  componentDidMount() {
    this.props.getAllBooks();
  }

  render() {
    const { books, loading } = this.props.book;
    const { nobookfound } = this.props.errors;

    let allbooks = books.map((book, index) => (
      <CBook book={book} key={index}></CBook>
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

Books.propTypes = {
  getAllBooks: PropTypes.func.isRequired,
  book: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  book: state.book,
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getAllBooks }
)(Books);
