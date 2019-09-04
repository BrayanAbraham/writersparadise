import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TextFieldGroup from "../common/TextFieldGroup";
import SelectListGroup from "../common/SelectListGroup";
import CKEditor from "react-ckeditor-component";
import { withRouter } from "react-router-dom";
import classnames from "classnames";
import { getShortStory, editShortStory } from "../../actions/shortStoryActions";

class EditShort extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      status: "",
      allowComments: true,
      body: "",
      errors: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.updateContent = this.updateContent.bind(this);
    this.onChangeck = this.onChangeck.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.afterPaste = this.afterPaste.bind(this);
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getShortStory(id);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.errors) {
      this.setState({ errors: newProps.errors });
    }
    if (newProps.short.short) {
      const { short } = newProps.short;
      this.setState({
        title: short.title,
        status: short.status,
        allowComments: short.allowComments,
        body: short.body
      });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const newShort = {
      title: this.state.title,
      status: this.state.status,
      allowComments: this.state.allowComments,
      body: this.state.body,
      user: this.props.auth.user._id
    };
    this.props.editShortStory(
      newShort,
      this.props.short.short._id,
      this.props.history
    );
  }

  onChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  updateContent(newContent) {
    this.setState({
      body: newContent
    });
  }

  onChangeck(evt) {
    var newContent = evt.editor.getData();
    this.setState({
      body: newContent
    });
  }

  onBlur(evt) {
    console.log("onBlur event called with event info: ", evt);
  }

  afterPaste(evt) {
    console.log("afterPaste event called with event info: ", evt);
  }

  render() {
    const { errors } = this.state;
    const options = [
      { label: "*Select Status", value: "" },
      { label: "Public", value: "Public" },
      { label: "Private", value: "Private" }
    ];
    return (
      <div className="create-short">
        <div className="container">
          <div className="row">
            <div className="col-md-10 m-auto">
              <h1 className="display-4 text-center">Create Short Story</h1>
              <form noValidate onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="Title"
                  name="title"
                  value={this.state.title}
                  onChange={this.onChange}
                  error={errors.title}
                />
                <SelectListGroup
                  name="status"
                  value={this.state.status}
                  error={errors.status}
                  onChange={this.onChange}
                  options={options}
                />
                <div className="form-check form-group mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="allowComments"
                    checked={this.state.allowComments}
                    onChange={this.onChange}
                  />
                  <label htmlFor="allowComments">Allow Comments</label>
                </div>
                <div className="form-group">
                  <small className="form-text text-muted">
                    Resize the Editor using the arrow on bottom right
                  </small>
                  <CKEditor
                    activeClass={classnames("p10 form-control", {
                      "is-invalid": this.state.errors.body
                    })}
                    content={this.state.body}
                    events={{
                      blur: this.onBlur,
                      afterPaste: this.afterPaste,
                      change: this.onChangeck
                    }}
                    config={{
                      removePlugins: "link,sourcearea,image"
                    }}
                  />
                  {this.state.errors.body && (
                    <div className="invalid-feedback">
                      {this.state.errors.body}
                    </div>
                  )}
                </div>
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

EditShort.propTypes = {
  editShortStory: PropTypes.func.isRequired,
  getShortStory: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  short: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  short: state.short
});

export default connect(
  mapStateToProps,
  { getShortStory, editShortStory }
)(withRouter(EditShort));
