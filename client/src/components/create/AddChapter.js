import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addChapter } from "../../actions/bookActions";
import TextFieldGroup from "../common/TextFieldGroup";
import { withRouter } from "react-router-dom";
import CKEditor from "react-ckeditor-component";
import classnames from "classnames";

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
    this.updateContent = this.updateContent.bind(this);
    this.onChangeck = this.onChangeck.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.afterPaste = this.afterPaste.bind(this);
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
        <div className="row">
          <div className="col-md-12 m-auto">
            <h1 className="display-4 text-center">Add Chapter</h1>
            <form noValidate onSubmit={this.onSubmit}>
              <TextFieldGroup
                placeholder="Title"
                name="title"
                value={this.state.title}
                onChange={this.onChange}
                error={errors.title}
              />
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
