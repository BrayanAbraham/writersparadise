import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../common/Spinner";
import { getAllPoems } from "../../actions/poemActions";
import CPoem from "./CPoem";

class Poems extends Component {
  componentDidMount() {
    this.props.getAllPoems();
  }

  snip(str, len) {
    if (str.length > len && str.length > 0) {
      var new_str = str + " ";
      new_str = str.substr(0, len);
      new_str = str.substr(0, new_str.lastIndexOf(" "));
      new_str = new_str.length > 0 ? new_str : str.substr(0, len);
      return new_str + "...";
    }
    return str;
  }

  getImage(name) {
    if (name === "noimage") {
      return (
        <img
          src={require("../../img/nobookimage.png")}
          alt=""
          className="card-img-top"
        />
      );
    } else {
      return (
        <img
          src={require(`../../../../public/uploads/${name}`)}
          alt=""
          className="card-img-top"
        />
      );
    }
  }

  like(id) {
    this.props.likepoem(id, null, null);
  }

  dislike(id) {
    this.props.dislikepoem(id, null, null);
  }

  deletepoem(id) {
    this.props.deletePoem(id);
  }

  stripTags = input => {
    input = input.replace(/<(?:.|\n)*?>/gm, " ");
    return input.replace(/&nbsp;/gm, " ");
  };

  render() {
    const { poems, loading } = this.props.poem;
    const { nopoemfound } = this.props.errors;
    let allpoems = poems.map((poem, index) => (
      <CPoem poem={poem} key={index}></CPoem>
    ));

    let content;
    if (nopoemfound !== undefined) {
      content = <h1>POEM NOT FOUND</h1>;
    } else if (loading) {
      content = <Spinner></Spinner>;
    } else {
      if (Object.keys(poems).length > 0) {
        content = <div className="row">{allpoems}</div>;
      } else {
        content = <h1>POEM NOT FOUND</h1>;
      }
    }

    return (
      <div className="poems">
        <div className="container">
          <div className="row">
            <div className="col-md-12 m-auto">
              <h1 className="display-4 text-center">Poems</h1>
              {content}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Poems.propTypes = {
  getAllPoems: PropTypes.func.isRequired,
  poem: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  poem: state.poem,
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getAllPoems }
)(Poems);
