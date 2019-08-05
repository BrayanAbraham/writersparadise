import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import AddPlotline from "../create/AddPlotline";

class Storyline extends Component {
  render() {
    const { book } = this.props.book;
    let content = book.storyline
      .splice(0)
      .reverse()
      .map((plotline, index) => (
        <div className="card card-body mb-3" key={index}>
          <div dangerouslySetInnerHTML={{ __html: plotline.plotline }} />
        </div>
      ));
    return (
      <div>
        {content}
        <AddPlotline book={book} />
      </div>
    );
  }
}

Storyline.propTypes = {
  book: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  book: state.book
});

export default connect(
  mapStateToProps,
  {}
)(Storyline);
