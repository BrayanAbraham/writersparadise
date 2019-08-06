import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import AddPlotline from "../create/AddPlotline";
import { deletePlotline } from "../../actions/bookActions";

class Storyline extends Component {
  onDeleteClick(id) {
    this.props.deletePlotline(this.props.book.book._id, id);
  }
  render() {
    const { book } = this.props.book;
    let content = book.storyline
      .splice(0)
      .reverse()
      .map((plotline, index) => (
        <div className="card mb-3" key={index}>
          <div className="card-header">
            <div
              className="btn btn-danger float-right"
              onClick={this.onDeleteClick.bind(this, plotline._id)}
            >
              <i className="fa fa-times" />
            </div>
          </div>
          <div className="card-body">
            <div dangerouslySetInnerHTML={{ __html: plotline.plotline }} />
          </div>
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
  book: PropTypes.object.isRequired,
  deletePlotline: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  book: state.book
});

export default connect(
  mapStateToProps,
  { deletePlotline }
)(Storyline);
