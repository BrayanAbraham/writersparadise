import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addChapterDesc } from "../../actions/bookActions";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import TextFieldGroup from "../common/TextFieldGroup";
import { withRouter } from "react-router-dom";

class AddChapterDescription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      errors: {}
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

    const description = this.state.description.replace(/\n/g, "<br />");

    const newChapterDesc = {
      title: this.state.title,
      description: description
    };
    this.props.addChapterDesc(
      newChapterDesc,
      this.props.book.book._id,
      this.props.history
    );
    this.setState({
      title: "",
      description: "",
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
    const { errors } = this.state;
    return (
      <div className="addplotline">
        <div className="card">
          <div className="card-header text-center">Add Chapter</div>
          <div className="card-body">
            <form noValidate onSubmit={this.onSubmit}>
              <TextFieldGroup
                placeholder="Title"
                name="title"
                value={this.state.title}
                onChange={this.onChange}
                error={errors.title}
              />
              <TextAreaFieldGroup
                placeholder="Description"
                name="description"
                value={this.state.description}
                onChange={this.onChange}
                error={errors.description}
                rows="10"
              />
              <input
                type="submit"
                value="Add Chapter"
                className="btn btn-info btn-block mt-4"
              />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

AddChapterDescription.porpTypes = {
  errors: PropTypes.object.isRequired,
  book: PropTypes.object.isRequired,
  addChapterDesc: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  book: state.book,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addChapterDesc }
)(withRouter(AddChapterDescription));
