import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { deleteChapter } from "../../actions/bookActions";

class BookChapters extends Component {
  getEditButton(chapterid) {
    if (this.props.book.book.user.handle === this.props.auth.user.handle) {
      const to = `/chapter-edit/${this.props.book.book._id}/${chapterid}`;
      return (
        <Link className="btn btn-light float-right text-success mr-2" to={to}>
          <i className="fa fa-pencil" />
        </Link>
      );
    } else {
      return <span> </span>;
    }
  }

  onDeleteClick(chapterid) {
    this.props.deleteChapter(this.props.book.book._id, chapterid);
  }

  getDeleteButton(chapterid) {
    if (this.props.book.book.user.handle === this.props.auth.user.handle) {
      return (
        <button
          className="btn btn-danger float-right text-light mr-2"
          onClick={this.onDeleteClick.bind(this, chapterid)}
        >
          <i className="fa fa-times" />
        </button>
      );
    } else {
      return <span> </span>;
    }
  }

  render() {
    const { book } = this.props.book;
    const { user } = this.props.auth;

    let userButtons;

    if (book.user.handle === user.handle) {
      const to = `/add-chapter/${book._id}`;
      userButtons = (
        <div className="col-md-12 col-12 m-auto text-center">
          <Link className="btn btn-success mr-5" to={to}>
            <i className="fa fa-plus" /> Add Chapter
          </Link>
          <Link className="btn btn-success ml-5" to={`/readbook/${book._id}`}>
            Read Book
          </Link>
        </div>
      );
    } else {
      userButtons = (
        <div className="col-md-12 col-12 m-auto text-center">
          <hr />
          <Link className="btn btn-success ml-5" to={`/readbook/${book._id}`}>
            Read Book
          </Link>
        </div>
      );
    }

    let chapters = book.chapters
      .slice(0)
      .reverse()
      .map((chapter, index) => (
        <tr key={index}>
          <th scope="col-2">{index + 1}</th>
          <td>
            <Link to={`/readbook/${book._id}#${index}`}>{chapter.title}</Link>
          </td>
          <td>
            {this.getDeleteButton(chapter._id)}
            {this.getEditButton(chapter._id)}
          </td>
        </tr>
      ));
    return (
      <div className="bookchapters">
        <div className="row mb-3">{userButtons}</div>

        <div className="chapters">
          <table className="table">
            <thead>
              <tr>
                <th scope="col-2">#</th>
                <th scope="col-8">Chapter</th>
                <th scope="col" />
              </tr>
            </thead>
            <tbody>{chapters}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

BookChapters.propTypes = {
  book: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteChapter: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  book: state.book,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { deleteChapter }
)(BookChapters);
