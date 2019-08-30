import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import isEmpty from "../../validation/is-empty";
import {
  getPoemByUser,
  likepoem,
  dislikepoem,
  deletePoem
} from "../../actions/poemActions";

class DashboardPoems extends Component {
  componentWillMount() {
    const { user } = this.props;
    this.props.getPoemByUser(user.id);
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
    this.props.likepoem(id, "user", this.props.auth.user.id);
  }

  dislike(id) {
    this.props.dislikepoem(id, "user", this.props.auth.user.id);
  }

  deletePoem(id) {
    this.props.deletePoem(id, "user", this.props.auth.user.id);
  }

  stripTags = input => {
    input = input.replace(/<(?:.|\n)*?>/gm, "");
    return input.replace(/&nbsp;/gm, "");
  };

  render() {
    const { poems } = this.props.poem;
    let userpoems = poems.map((poem, index) => (
      <div className="poem col-md-4 col-sm-6" key={index}>
        <div className="card h-100">
          {/* <Link to={`/poem/${poem._id}`}>{this.getImage(poem.image)}</Link> */}
          <div className="card-body text-center">
            <Link to={`/poem/${poem._id}`} style={{ textDecoration: "none" }}>
              <h5 className="card-title">{poem.title}</h5>
            </Link>
            <div className="text-white">
              <small className="bg-primary pr-2 pl-2 pt-1 pb-1">
                {poem.status}
              </small>
            </div>
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
                    onClick={this.deletePoem.bind(this, poem._id)}
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
                  <i className="fa fa-thumbs-down" /> Dislike
                </button>
              </small>
            )}
            <p className="card-text">{this.snip(this.stripTags(poem.body))}</p>
          </div>
        </div>
      </div>
    ));
    return <div className="row">{userpoems}</div>;
  }
}

DashboardPoems.propTypes = {
  poem: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  getPoemByUser: PropTypes.func.isRequired,
  likepoem: PropTypes.func.isRequired,
  dislikepoem: PropTypes.func.isRequired,
  deletePoem: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  poem: state.poem,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getPoemByUser, likepoem, dislikepoem, deletePoem }
)(DashboardPoems);
