import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { deleteChapterDesc } from "../../actions/bookActions";
import AddChapterDescription from "../create/AddChapterDescription";

class ChapterPlanner extends Component {
  onDeleteClick(id) {
    this.props.deleteChapterDesc(this.props.book.book._id, id);
  }
  render() {
    const { book } = this.props.book;
    let content = book.chapterdescription
      .splice(0)
      .reverse()
      .map((chapter, index) => (
        <div className="card mb-3" key={index}>
          <div className="card-header">
            <div className="card-title text-center">
              {chapter.title}
              <span
                className="btn btn-danger float-right"
                onClick={this.onDeleteClick.bind(this, chapter._id)}
              >
                <i className="fa fa-times" />
              </span>
            </div>
          </div>
          <div className="card-body">
            <div dangerouslySetInnerHTML={{ __html: chapter.description }} />
          </div>
        </div>
      ));
    return (
      <div>
        {content}
        <AddChapterDescription book={book} />
      </div>
    );
  }
}

ChapterPlanner.propTypes = {
  book: PropTypes.object.isRequired,
  deleteChapterDesc: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  book: state.book
});

export default connect(
  mapStateToProps,
  { deleteChapterDesc }
)(ChapterPlanner);
