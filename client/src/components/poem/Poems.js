import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import isEmpty from "../../validation/is-empty";
import Spinner from "../common/Spinner";
import {
  getAllPoems,
  likepoem,
  dislikepoem,
  deletePoem
} from "../../actions/poemActions";

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
      <div className="poem col-md-3 col-sm-6" key={index}>
        <div className="card h-100">
          <div className="card-body text-center">
            <Link to={`/poem/${poem._id}`} style={{ textDecoration: "none" }}>
              <h5 className="card-title">{poem.title}</h5>
            </Link>
            <div>By {poem.user.handle}</div>
            <small>
              {poem.user.handle === this.props.auth.user.handle && (
                <span>
                  <span className="point">
                    <Link
                      to={`/edit-poem/${poem._id}`}
                      className="likebutton"
                      style={{ textDecoration: "none" }}
                    >
                      <i className="fa fa-pencil" /> Edit
                    </Link>
                  </span>
                  <span
                    className="point dislikebutton"
                    onClick={this.deletepoem.bind(this, poem._id)}
                  >
                    <i className="fa fa-times ml-3" /> Delete
                  </span>
                </span>
              )}
              {isEmpty(this.props.auth.user) && (
                <span>
                  <i className="fa fa-heart text-danger ml-2" />{" "}
                  {poem.likes.length}
                </span>
              )}
            </small>
            <br />
            {!isEmpty(this.props.auth.user) && (
              <small>
                <button
                  className="btn btn-light likebutton"
                  onClick={this.like.bind(this, poem._id)}
                >
                  <i className="fa fa-thumbs-up" /> Like
                </button>
                <i className="fa fa-heart text-danger ml-2" />{" "}
                {poem.likes.length}
                <button
                  className="btn btn-light dislikebutton"
                  onClick={this.dislike.bind(this, poem._id)}
                >
                  <i className="fa fa-thumbs-down" /> Disike
                </button>
              </small>
            )}
            <p className="card-text">
              {this.snip(this.stripTags(poem.body), 100)}
            </p>
          </div>
        </div>
      </div>
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
  likepoem: PropTypes.func.isRequired,
  dislikepoem: PropTypes.func.isRequired,
  deletePoem: PropTypes.func.isRequired,
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
  { getAllPoems, likepoem, dislikepoem, deletePoem }
)(Poems);
