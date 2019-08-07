import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import AddCharacter from "../create/AddCharacter";
import isEmpty from "../../validation/is-empty";
import { deleteCharacter } from "../../actions/bookActions";

class Characters extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onDeleteClick(id) {
    this.props.deleteCharacter(this.props.book.book._id, id);
  }

  render() {
    const { book } = this.props.book;
    let content = book.characters
      .slice(0)
      .reverse()
      .map((character, index) => (
        <div className="card mb-3" key={index}>
          <div className="card-header text-center">
            <strong>{character.name}</strong>
            <div
              className="btn btn-danger float-right mr-2"
              onClick={this.onDeleteClick.bind(this, character._id)}
            >
              <i className="fa fa-times" />
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              {!isEmpty(character.profession) && (
                <div className="col-12">
                  <strong>Profession:</strong> {character.profession}
                </div>
              )}
              {!isEmpty(character.height) && (
                <div className="col-6">
                  <strong>Height:</strong> {character.height}
                </div>
              )}
              {!isEmpty(character.weight) && (
                <div className="col-6">
                  <strong>Weight:</strong> {character.weight}
                </div>
              )}
              {!isEmpty(character.look) && (
                <div className="col-12">
                  <strong>Look:</strong>
                  <br />
                  <div
                    className="text-justified"
                    dangerouslySetInnerHTML={{ __html: character.look }}
                  />
                </div>
              )}
              {!isEmpty(character.behaviour) && (
                <div className="col-12">
                  <strong>Behaviour:</strong>
                  <br />
                  <div
                    className="text-justified"
                    dangerouslySetInnerHTML={{ __html: character.behaviour }}
                  />
                </div>
              )}
              {!isEmpty(character.about) && (
                <div className="col-12">
                  <strong>About:</strong>
                  <br />
                  <div
                    className="text-justified"
                    dangerouslySetInnerHTML={{ __html: character.about }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ));
    return (
      <div>
        {content}
        <AddCharacter book={book} />
      </div>
    );
  }
}

Characters.propTypes = {
  book: PropTypes.object.isRequired,
  deleteCharacter: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  book: state.book
});

export default connect(
  mapStateToProps,
  { deleteCharacter }
)(Characters);
