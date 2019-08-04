import React, { Component } from "react";
import { connect } from "react-redux";
import { getBook } from "../../actions/bookActions";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";
import BookHeader from "./BookHeader";
import isEmpty from "../../validation/is-empty";
import classnames from "classnames";
import BookChapters from "./BookChapters";

class Book extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chapter: true
    };
    this.onChapterClick = this.onChapterClick.bind(this);
    this.onPlannerClick = this.onPlannerClick.bind(this);
  }
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
    if (isEmpty(user)) {
      this.setState({ chapter: true });
    }
  }

  onChapterClick(e) {
    this.setState({ chapter: true });
  }

  onPlannerClick(e) {
    this.setState({ chapter: false });
  }

  render() {
    const { book, loading } = this.props.book;
    const { nobookfound } = this.props.errors;
    const { user } = this.props.auth;
    let content;
    let restcontent;
    let choice;

    if (!isEmpty(book)) {
      if (user.handle === book.user.handle) {
        choice = (
          <div className="choice">
            <hr />
            <div className="row">
              <div className="col-md-6 col-6 text-center border-right">
                <h3
                  onClick={this.onChapterClick}
                  className={classnames("point", {
                    "text-primary": this.state.chapter
                  })}
                >
                  Chapters
                </h3>
              </div>
              <div className="col-md-6 col-6 text-center">
                <h3
                  onClick={this.onPlannerClick}
                  className={classnames("point", {
                    "text-primary": !this.state.chapter
                  })}
                >
                  Book Planner
                </h3>
              </div>
            </div>
            <hr />
          </div>
        );
      }
    }

    if (this.state.chapter) {
      restcontent = <BookChapters book={book} />;
    } else {
      restcontent = "hello";
    }

    if (nobookfound !== undefined) {
      content = <h1>BOOK NOT FOUND</h1>;
    } else if (book === null || loading) {
      content = <Spinner />;
    } else {
      if (Object.keys(book).length > 0) {
        content = (
          <div>
            <BookHeader book={book} />
            {choice}
            {restcontent}
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
