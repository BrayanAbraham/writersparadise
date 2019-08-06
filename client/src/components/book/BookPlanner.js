import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import Characters from "./Characters";
import Storyline from "./Storyline";
import ChapterPlanner from "./ChapterPlanner";

class BookPlanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      option: "character"
    };
    this.onCharacterClick = this.onCharacterClick.bind(this);
    this.onStorylineClick = this.onStorylineClick.bind(this);
    this.onChapterPlannerClick = this.onChapterPlannerClick.bind(this);
  }

  onCharacterClick(e) {
    this.setState({ option: "character" });
  }

  onStorylineClick(e) {
    this.setState({ option: "storyline" });
  }

  onChapterPlannerClick(e) {
    this.setState({ option: "chapter" });
  }

  render() {
    const { option } = this.state;
    const { book } = this.props.book;
    let content;
    if (option === "character") {
      content = <Characters book={book} />;
    } else if (option === "storyline") {
      content = <Storyline book={book} />;
    } else {
      content = <ChapterPlanner book={book} />;
    }
    return (
      <div className="book-planner">
        <div className="container">
          <div className="row">
            <div className="col-md-4 col-sm-4 text-center">
              <button
                onClick={this.onCharacterClick}
                className={classnames("point btn mb-3", {
                  "btn-primary": option === "character",
                  "btn-success": option !== "character"
                })}
              >
                Characters
              </button>
            </div>
            <div className="col-md-4 col-sm-4 text-center ">
              <button
                onClick={this.onStorylineClick}
                className={classnames("point btn mb-3", {
                  "btn-primary": option === "storyline",
                  "btn-success": option !== "storyline"
                })}
              >
                Storyline
              </button>
            </div>
            <div className="col-md-4 col-sm-4 text-center ">
              <button
                onClick={this.onChapterPlannerClick}
                className={classnames("point btn mb-3", {
                  "btn-primary": option === "chapter",
                  "btn-success": option !== "chapter"
                })}
              >
                Chapter Planner
              </button>
            </div>
          </div>
          <hr />
          {content}
        </div>
      </div>
    );
  }
}

BookPlanner.propTypes = {
  book: PropTypes.object.isRequired
};

export default BookPlanner;
