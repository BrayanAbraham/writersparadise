import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getBook, editChapter } from "../../actions/bookActions";
import isEmpty from "../../validation/is-empty";
import TextFieldGroup from "../common/TextFieldGroup";
import CKEditor from "react-ckeditor-component";
import classnames from "classnames";

class EditChapter extends Component {
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
  }

  componentDidMount() {
    const { bookid } = this.props.match.params;
    this.props.getBook(bookid);
    this.setState({ id: bookid });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.errors) {
      this.setState({ errors: newProps.errors });
    }
    if (!isEmpty(newProps.book.book)) {
      const { id } = newProps.match.params;
      const { book } = newProps.book;
      const index = book.chapters.map(item => item._id.toString()).indexOf(id);
      this.setState({
        title: book.chapters[index].title,
        body: book.chapters[index].body
      });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const { bookid, id } = this.props.match.params;
    const newChapter = {
      title: this.state.title,
      body: this.state.body
    };

    this.props.editChapter(newChapter, bookid, id, this.props.history);
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
        <div className="container">
          <div className="row">
            <div className="col-md-10 m-auto">
              <h1 className="display-4 text-center">Edit Chapter</h1>
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
      </div>
    );
  }
}

EditChapter.propTypes = {
  book: PropTypes.object.isRequired,
  getBook: PropTypes.func.isRequired,
  editChapter: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  book: state.book,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getBook, editChapter }
)(withRouter(EditChapter));
