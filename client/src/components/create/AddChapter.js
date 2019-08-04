import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addChapter } from "../../actions/bookActions";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { withRouter } from "react-router-dom";

class AddChapter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      body: "",
      id: "",
      errors: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const { bookid } = this.props.match.params;
    this.setState({ id: bookid });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.errors) {
      this.setState({ errors: newProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const newChapter = {
      title: this.state.title,
      body: this.state.body
    };
    this.props.addChapter(newChapter, this.state.id, this.props.history);
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
      <div className="addchapter">
        <div className="container">
          <div className="row">
            <div className="col-md-10 m-auto">
              <h1 className="display-4 text-center">AddChapter</h1>
              <form noValidate onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="Title"
                  name="title"
                  value={this.state.title}
                  onChange={this.onChange}
                  error={errors.title}
                />
                <TextAreaFieldGroup
                  placeholder="Chapter"
                  name="body"
                  value={this.state.body}
                  onChange={this.onChange}
                  error={errors.body}
                  rows="20"
                />
                <input
                  type="submit"
                  value="Submit"
                  className="btn btn-info btn-block mt-4"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AddChapter.propTypes = {
  addChapter: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  book: state.book,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addChapter }
)(withRouter(AddChapter));
