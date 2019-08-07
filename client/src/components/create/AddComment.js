import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { addComment } from "../../actions/bookActions";
import { withRouter } from "react-router-dom";

class AddComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      body: ""
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentWillReceiveProps(newProps) {
    if (newProps.errors) {
      this.setState({ errors: newProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const body = this.state.body.replace(/\n/g, "<br />");

    const newComment = {
      body: body,
      id: this.props.auth.user._id
    };

    this.props.addComment(
      newComment,
      this.props.book.book._id,
      this.props.history
    );

    this.setState({
      body: "",
      errors: {}
    });
  }

  onChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    const { errors } = this.props;
    return (
      <div>
        <form noValidate onSubmit={this.onSubmit}>
          <TextAreaFieldGroup
            placeholder="Comment"
            name="body"
            onChange={this.onChange}
            value={this.state.body}
            error={errors.body}
          />
          <input
            type="submit"
            value="Add Comment"
            className="btn btn-info btn-block mt-4"
          />
        </form>
      </div>
    );
  }
}

AddComment.propTypes = {
  book: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  addComment: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  book: state.book,
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addComment }
)(withRouter(AddComment));
