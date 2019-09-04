import React, { Component } from "react";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import InputGroup from "../common/InputGroup";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { createProfile } from "../../actions/profileActions";

class CreateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      website: "",
      bio: "",
      twitter: "",
      facebook: "",
      linkedin: "",
      youtube: "",
      instagram: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const profileData = {
      website: this.state.website,
      bio: this.state.bio,
      twitter: this.state.twitter,
      facebook: this.state.facebook,
      linkedin: this.state.linkedin,
      youtube: this.state.youtube,
      instagram: this.state.instagram
    };

    this.props.createProfile(profileData, this.props.history);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  render() {
    const { errors } = this.state;
    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Create Your Profile</h1>
              <p className="lead text-center">Let's get some info on you</p>
              <form noValidate onSubmit={this.onSubmit}>
                <TextAreaFieldGroup
                  placeholder="About"
                  name="bio"
                  value={this.state.bio}
                  onChange={this.onChange}
                  error={errors.bio}
                  info="Tell us a little about yourself"
                />
                <InputGroup
                  placeholder="Website URL (starting with http:// or https://)"
                  name="website"
                  value={this.state.website}
                  onChange={this.onChange}
                  error={errors.website}
                  icon="fa fa-globe"
                />
                <InputGroup
                  placeholder="Twitter Profile URL (starting with http:// or https://)"
                  name="twitter"
                  icon="fa fa-twitter"
                  value={this.state.twitter}
                  onChange={this.onChange}
                  error={errors.twitter}
                />

                <InputGroup
                  placeholder="Facebook Page URL (starting with http:// or https://)"
                  name="facebook"
                  icon="fa fa-facebook"
                  value={this.state.facebook}
                  onChange={this.onChange}
                  error={errors.facebook}
                />

                <InputGroup
                  placeholder="Linkedin Profile URL (starting with http:// or https://)"
                  name="linkedin"
                  icon="fa fa-linkedin"
                  value={this.state.linkedin}
                  onChange={this.onChange}
                  error={errors.linkedin}
                />

                <InputGroup
                  placeholder="YouTube Channel URL (starting with http:// or https://)"
                  name="youtube"
                  icon="fa fa-youtube"
                  value={this.state.youtube}
                  onChange={this.onChange}
                  error={errors.youtube}
                />

                <InputGroup
                  placeholder="Instagram Page URL (starting with http:// or https://)"
                  name="instagram"
                  icon="fa fa-instagram"
                  value={this.state.instagram}
                  onChange={this.onChange}
                  error={errors.instagram}
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

CreateProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  createProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { createProfile }
)(withRouter(CreateProfile));
