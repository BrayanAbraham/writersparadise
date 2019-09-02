import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getBook, editBook } from "../../actions/bookActions";
import TextFieldGroup from "../common/TextFieldGroup";
import SelectListGroup from "../common/SelectListGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { withRouter } from "react-router-dom";
import isEmpty from "../../validation/is-empty";
import Autosuggest from "react-autosuggest";
import filters from "../../utils/filters";

const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0
    ? []
    : filters.filter(
        filter => filter.name.toLowerCase().slice(0, inputLength) === inputValue
      );
};

const searchfilter = value => {
  for (let i = 0; i < filters.length; i++) {
    if (filters[i].name === value) {
      return true;
    }
  }
  return false;
};

const getSuggestionValue = suggestion => suggestion.name;

const renderSuggestion = suggestion => <small>{suggestion.name}</small>;

class EditBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      status: "",
      allowComments: true,
      fiction: true,
      genre: "",
      value: "",
      genres: [],
      suggestions: [],
      bookdesc: "",
      errors: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onChangeRadio = this.onChangeRadio.bind(this);
    this.onChangeGenre = this.onChangeGenre.bind(this);
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
        const genre = book.genre;
        const bookdesc = book.bookdesc.replace(/<br\s*[\/]?>/gi, "\n");
        this.setState({
          title: book.title,
          status: book.status,
          allowComments: book.allowComments,
          genres: genre,
          bookdesc: bookdesc,
          fiction: genre.includes("Fiction")
        });
      }
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const bookdesc = this.state.bookdesc.replace(/\n/g, "<br />");
    const genres = this.state.genres;
    if (this.state.fiction) {
      if (genres.includes("Fiction")) {
      } else {
        if (genres.includes("Non-Fiction")) {
          const index = genres.indexOf("Non-Fiction");
          genres.splice(index, 1);
        }
        genres.push("Fiction");
      }
    } else {
      if (genres.includes("Non-Fiction")) {
      } else {
        if (genres.includes("Fiction")) {
          const index = genres.indexOf("Fiction");
          genres.splice(index, 1);
        }
        genres.push("Non-Fiction");
      }
    }
    const genre = genres.join(",");
    const newBook = {
      title: this.state.title,
      status: this.state.status,
      allowComments: this.state.allowComments,
      genre: genre,
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

  addgenre(e) {
    e.preventDefault();
    const genres = this.state.genres;
    if (searchfilter(this.state.value) && !genres.includes(this.state.value)) {
      genres.push(this.state.value);
    }
    this.setState({
      genres: genres,
      value: ""
    });
  }

  onChangeRadio(event) {
    const target = event.target;
    const value = target.checked;
    const name = target.name;
    const id = target.id;
    if (id === "fiction") {
      this.setState({
        [name]: value
      });
    } else {
      this.setState({
        [name]: !value
      });
    }
  }

  onChangeGenre(event, { newValue }) {
    this.setState({
      value: newValue
    });
  }

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onRemoveGenre(item) {
    const genres = this.state.genres;
    genres.splice(item, 1);
    this.setState({ genres: genres });
  }

  render() {
    const { errors, value, suggestions } = this.state;
    const options = [
      { label: "*Select Status", value: "" },
      { label: "Public", value: "Public" },
      { label: "Private", value: "Private" }
    ];
    const inputProps = {
      placeholder: "Select a genre and click add or press enter",
      value,
      className: "form-control col-12",
      onChange: this.onChangeGenre
    };
    let genres;
    let indigenres = this.state.genres.map((item, index) => (
      <div
        className="btn btn-light mr-1"
        key={index}
        onClick={this.onRemoveGenre.bind(this, index)}
      >
        {item} | <i className="fa fa-times" />
      </div>
    ));
    if (this.state.genres.length > 0) {
      genres = <div className="border border-1 mb-2 p-1">{indigenres}</div>;
    } else {
      genres = null;
    }
    return (
      <div className="create-book">
        <div className="container">
          <div className="row">
            <div className="col-md-10 m-auto">
              <h1 className="display-4 text-center">Edit Book</h1>
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
                <div className="form-check form-group mb-3 mr-3 float-left">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="fiction"
                    id="fiction"
                    checked={this.state.fiction}
                    onChange={this.onChangeRadio}
                  />
                  <label htmlFor="fiction">Fiction</label>
                </div>
                <div className="form-check form-group mb-3 float-left">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="fiction"
                    id="non-fiction"
                    checked={!this.state.fiction}
                    onChange={this.onChangeRadio}
                  />
                  <label htmlFor="non-fiction">Non-Fiction</label>
                </div>
                {/* <TextFieldGroup
                  placeholder="Genre"
                  name="genre"
                  value={this.state.genre}
                  onChange={this.onChange}
                  error={errors.genre}
                  info="Please use comma separated values (eg.
                    Horror, Thriller, Action)"
                /> */}
                <div className="clearfix" />
                {genres}
                <Autosuggest
                  suggestions={suggestions}
                  onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                  getSuggestionValue={getSuggestionValue}
                  renderSuggestion={renderSuggestion}
                  inputProps={inputProps}
                  theme={{
                    suggestionsList: "list-group mylist",
                    suggestionHighlighted: "text-primary point",
                    suggestion: "list-group-item col-md-4 float-left d-block"
                  }}
                />
                <button
                  className="btn btn-primary col-2 mt-1 float-right"
                  onClick={this.addgenre.bind(this)}
                >
                  Add
                </button>
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
