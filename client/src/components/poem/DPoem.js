import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import isEmpty from "../../validation/is-empty";
import { likepoem, dislikepoem, deletePoem } from "../../actions/poemActions";

class DPoem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
  componentDidMount() {
    this.setState({ count: this.props.poem.likes.length });
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

  like(id) {
    this.props.likepoem(id, "try", null);
    if (
      this.props.poem.likes.filter(
        like => like.user.toString() === this.props.auth.user.id
      ).length === 0
    ) {
      this.setState({ count: this.state.count + 1 });
      this.props.poem.likes.unshift({ user: this.props.auth.user.id });
    }
  }

  dislike(id) {
    this.props.dislikepoem(id, "try", null);
    if (
      this.props.poem.likes.filter(
        like => like.user.toString() === this.props.auth.user.id
      ).length > 0
    ) {
      const removeIndex = this.props.poem.likes
        .map(item => item.user.toString())
        .indexOf(this.props.auth.user.id);
      this.props.poem.likes.splice(removeIndex, 1);
      this.setState({ count: this.state.count - 1 });
    }
  }

  deletePoem(id) {
    this.props.deletePoem(id);
  }

  stripTags = input => {
    input = input.replace(/<(?:.|\n)*?>/gm, " ");
    return input.replace(/&nbsp;/gm, " ");
  };
  render() {
    const { poem } = this.props;
    return (
      <div className="poem col-md-3 col-sm-6">
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
            <p className="card-text">
              {this.snip(this.stripTags(poem.body), 20)}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

DPoem.propTypes = {
  likepoem: PropTypes.func.isRequired,
  dislikepoem: PropTypes.func.isRequired,
  deletePoem: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  poem: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { likepoem, deletePoem, dislikepoem }
)(DPoem);
