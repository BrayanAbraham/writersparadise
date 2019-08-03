import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class BookHeader extends Component {
  render() {
    const { book } = this.props.book;
    return (
      <div className="bookheader">
        <div className="row">
          <div className="col-md-3 col-sm-3 col-6 m-auto">
            <img
              src={require("../../img/noimage.png")}
              alt="not found"
              className="img-thumbnail img-fluid rounded mx-auto d-block"
            />
          </div>
          <div className="col-md-9 col-sm-9">
            <div className="row">
              <div className="col-md-12">
                <h3 className="text-center">{book.title}</h3>
                <h1>Hi</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

BookHeader.propTypes = {
  book: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  book: state.book
});

export default connect(
  mapStateToProps,
  {}
)(BookHeader);
