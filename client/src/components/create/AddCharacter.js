import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addCharacter } from "../../actions/bookActions";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { withRouter } from "react-router-dom";

class AddCharacter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      profession: "",
      height: "",
      weight: "",
      look: "",
      behaviour: "",
      about: "",
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

    const look = this.state.look.replace(/\n/g, "<br />");
    const behaviour = this.state.behaviour.replace(/\n/g, "<br />");
    const about = this.state.about.replace(/\n/g, "<br />");
    const newChapter = {
      name: this.state.name,
      profession: this.state.profession,
      height: this.state.height,
      weight: this.state.weight,
      look: look,
      behaviour: behaviour,
      about: about
    };
    this.props.addCharacter(
      newChapter,
      this.props.book.book._id,
      this.props.history
    );
    this.setState({
      name: "",
      profession: "",
      height: "",
      weight: "",
      look: "",
      behaviour: "",
      about: "",
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
      <div className="add-character">
        <div className="card">
          <div className="card-header text-center">Add Character</div>
          <div className="card-body">
            <form noValidate onSubmit={this.onSubmit}>
              <TextFieldGroup
                placeholder="Name"
                name="name"
                value={this.state.name}
                onChange={this.onChange}
                error={errors.name}
              />

              <TextFieldGroup
                placeholder="Profession"
                name="profession"
                value={this.state.profession}
                onChange={this.onChange}
                error={errors.profession}
              />

              <div className="row">
                <div className="col-6">
                  <TextFieldGroup
                    placeholder="Height"
                    name="height"
                    value={this.state.height}
                    onChange={this.onChange}
                    error={errors.height}
                  />
                </div>
                <div className="col-6">
                  <TextFieldGroup
                    placeholder="Weight"
                    name="weight"
                    value={this.state.weight}
                    onChange={this.onChange}
                    error={errors.weight}
                  />
                </div>
              </div>
              <TextAreaFieldGroup
                placeholder="Look"
                name="look"
                value={this.state.look}
                onChange={this.onChange}
                error={errors.look}
              />
              <TextAreaFieldGroup
                placeholder="Behaviour"
                name="behaviour"
                value={this.state.behaviour}
                onChange={this.onChange}
                error={errors.behaviour}
              />
              <TextAreaFieldGroup
                placeholder="About"
                name="about"
                value={this.state.about}
                onChange={this.onChange}
                error={errors.about}
              />
              <input
                type="submit"
                value="Add Character"
                className="btn btn-info btn-block mt-4"
              />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

AddCharacter.porpTypes = {
  errors: PropTypes.object.isRequired,
  book: PropTypes.object.isRequired,
  addCharacter: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  book: state.book,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addCharacter }
)(withRouter(AddCharacter));
