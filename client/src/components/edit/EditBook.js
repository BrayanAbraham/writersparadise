import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getBook, editBook } from "../../actions/bookActions";
import TextFieldGroup from "../common/TextFieldGroup";
import SelectListGroup from "../common/SelectListGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { withRouter } from "react-router-dom";
import isEmpty from "../../validation/is-empty";

class EditBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      status: "",
      allowComments: true,
      genre: "",
      bookdesc: "",
      errors: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getBook(id);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.errors) {
      this.setState({ errors: newProps.errors });
    }
    if (newProps.book.book) {
      const { book } = newProps.book;
      if (!isEmpty(book.genre)) {
        const genre = book.genre.join(",");
        const bookdesc = book.bookdesc.replace(/<br\s*[\/]?>/gi, "\n");
        this.setState({
          title: book.title,
          status: book.status,
          allowComments: book.allowComments,
          genre: genre,
          bookdesc: bookdesc
        });
      }
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const bookdesc = this.state.bookdesc.replace(/\n/g, "<br />");
    const newBook = {
      title: this.state.title,
      status: this.state.status,
      allowComments: this.state.allowComments,
      genre: this.state.genre,
      bookdesc: bookdesc,
      user: this.props.auth.user._id
    };
    this.props.editBook(newBook, this.props.book.book._id, this.props.history);
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
    const options = [
      { label: "*Select Status", value: "" },
      { label: "Public", value: "Public" },
      { label: "Private", value: "Private" }
    ];
    return (
      <div className="create-book">
        <div className="container">
          <div className="row">
            <div className="col-md-10 m-auto">
              <h1 className="display-4 text-center">Create A New Book</h1>
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
                <TextFieldGroup
                  placeholder="Genre"
                  name="genre"
                  value={this.state.genre}
                  onChange={this.onChange}
                  error={errors.genre}
                  info="Please use comma separated values (eg.
                    Horror, Thriller, Action)"
                />
                <TextAreaFieldGroup
                  placeholder="Short Description"
                  name="bookdesc"
                  value={this.state.bookdesc}
                  onChange={this.onChange}
                  error={errors.bookdesc}
                  rows="10"
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

EditBook.propTypes = {
  getBook: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  book: PropTypes.object.isRequired,
  editBook: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  book: state.book
});

export default connect(
  mapStateToProps,
  { getBook, editBook }
)(withRouter(EditBook));
