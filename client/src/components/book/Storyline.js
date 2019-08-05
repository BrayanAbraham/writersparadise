import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import AddPlotline from "../create/AddPlotline";

class Storyline extends Component {
  render() {
    const { book } = this.props.book;
    let content;
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
