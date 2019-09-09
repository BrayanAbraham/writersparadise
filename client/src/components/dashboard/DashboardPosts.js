import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import isEmpty from "../../validation/is-empty";
import {
  getBooksByUser,
  likebook,
  dislikebook,
  deleteBook
} from "../../actions/bookActions";
import DBook from "../books/DBook";

class DashboardPosts extends Component {
  componentWillMount() {
    const { user } = this.props;
    this.props.getBooksByUser(user.id);
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
    this.props.likebook(id, "user", this.props.auth.user.id);
  }

  dislike(id) {
    this.props.dislikebook(id, "user", this.props.auth.user.id);
  }

  deleteBook(id) {
    this.props.deleteBook(id, "user", this.props.auth.user.id);
  }

  stripTags = input => {
    input = input.replace(/<(?:.|\n)*?>/gm, " ");
    return input.replace(/&nbsp;/gm, " ");
  };

  render() {
    const { books } = this.props.book;
    let userbooks = null;
    if (books)
      userbooks = books.map((book, index) => (
        <DBook book={book} key={index}></DBook>
      ));
    return <div className="row">{userbooks}</div>;
  }
}

DashboardPosts.propTypes = {
  book: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  getBooksByUser: PropTypes.func.isRequired,
  likebook: PropTypes.func.isRequired,
  dislikebook: PropTypes.func.isRequired,
  deleteBook: PropTypes.func.isRequired
};

const MapStateToProps = state => ({
  book: state.book,
  auth: state.auth
});

export default connect(
  MapStateToProps,
  { getBooksByUser, likebook, dislikebook, deleteBook }
)(DashboardPosts);
