import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile, uploadimage } from "../../actions/profileActions";
import Spinner from "../common/Spinner";
import { Link } from "react-router-dom";
import isEmpty from "../../validation/is-empty";
import classnames from "classnames";

class DashboardHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      errors: {}
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("myImage", this.state.file);
    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };
    this.props.uploadimage(formData, config);
  }
  onChange(e) {
    this.setState({ file: e.target.files[0] });
  }

  componentDidMount() {
    this.props.getCurrentProfile();
  }
  render() {
    const { user } = this.props;
    const { errors } = this.props;
    const { profile, loading } = this.props.profile;
    let image;
    let content;
    if (profile === null || loading) {
      content = <Spinner></Spinner>;
    } else {
      if (Object.keys(profile).length > 0) {
        if (profile.image === "noimage") {
          image = (
            <img
              src={require("../../img/noimage.png")}
              alt="not found"
              className="img-thumbnail img-fluid rounded mx-auto d-block"
            />
          );
        } else {
          image = (
            <img
              src={require(`../../../../public/uploads/${profile.image}`)}
              alt="not found"
              className="img-thumbnail img-fluid rounded mx-auto d-block"
            />
          );
        }

        content = (
          <div className="dashboardheader">
            <div className="row">
              <div className="col-md-3 col-sm-3 col-6 m-auto">
                <div
                  className="row point"
                  data-toggle="modal"
                  data-target="#imageuploadmodal"
                >
                  {image}
                </div>
                <div
                  className="modal fade"
                  id="imageuploadmodal"
                  tabIndex="-1"
                  role="dialog"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                          Upload Book Image
                        </h5>
                        <button
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <form onSubmit={this.onFormSubmit}>
                        <div className="modal-body">
                          <small className="form-text text-muted">
                            Max Size: 1MB, Files : jpg,jpeg,png
                          </small>
                          <input
                            type="file"
                            name="myImage"
                            className={classnames("form-control", {
                              "is-invalid": errors.file
                            })}
                            onChange={this.onChange}
                          />
                          {errors.file && (
                            <div className="invalid-feedback">
                              {errors.file}
                            </div>
                          )}
                        </div>

                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            data-dismiss="modal"
                          >
                            Close
                          </button>
                          <button type="submit" className="btn btn-primary">
                            Upload
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="col-md-12 text-center">
                      <small>Click on the Image to change</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-9 col-sm-9">
                <div className="row">
                  <div className="col-12 text-center">
                    <span className="display-4">{user.handle}</span>
                    <div className="float-right">
                      <Link className=" btn btn-light mr-2" to="/edit-profile">
                        <i className="fa fa-pencil fa-lg" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 text-center">
                    <p>
                      {isEmpty(profile.website) ? null : (
                        <a
                          className="p-2 text-dark"
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fa fa-globe fa-lg" />
                        </a>
                      )}

                      {isEmpty(
                        profile.social && profile.social.twitter
                      ) ? null : (
                        <a
                          className="p-2 text-dark"
                          href={profile.social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fa fa-twitter fa-lg" />
                        </a>
                      )}

                      {isEmpty(
                        profile.social && profile.social.facebook
                      ) ? null : (
                        <a
                          className="p-2 text-dark"
                          href={profile.social.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fa fa-facebook fa-lg" />
                        </a>
                      )}

                      {isEmpty(
                        profile.social && profile.social.linkedin
                      ) ? null : (
                        <a
                          className="p-2 text-dark"
                          href={profile.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fa fa-linkedin fa-lg" />
                        </a>
                      )}

                      {isEmpty(
                        profile.social && profile.social.youtube
                      ) ? null : (
                        <a
                          className="p-2 text-dark"
                          href={profile.social.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fa fa-youtube fa-lg" />
                        </a>
                      )}

                      {isEmpty(
                        profile.social && profile.social.instagram
                      ) ? null : (
                        <a
                          className="p-2 text-dark"
                          href={profile.social.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fa fa-instagram fa-lg" />
                        </a>
                      )}
                    </p>
                  </div>
                </div>
                {/* <hr />
                <div className="row">
                  <div className="col-md-6">Books : {profile.books}</div>
                  <div className="col-md-6">Likes : {profile.like}</div>
                  <div className="col-md-6">Comments : {profile.comments}</div>
                </div> */}
                <hr />
                <div className="row">
                  {!isEmpty(profile.bio) ? (
                    <div className="col-md-12 text-center text-justify">
                      <h3>About</h3>
                      <span>{profile.bio}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        content = (
          <div className="dashboardheader">
            <div className="row">
              <div className="col-md-3 col-sm-3 col-6 m-auto">
                <img
                  src={require("../../img/noimage.png")}
                  alt="not found"
                  className="img-thumbnail img-fluid rounded mx-auto d-block"
                />
              </div>
              <div className="col-md-9 col-sm-9">
                <div className="row">
                  <div className="col-md-12">
                    <h3 className="text-center">{user.handle}</h3>
                  </div>
                  <div className="col-md-12">
                    <p className="lead text-muted">Welcome {user.name}</p>
                    <p>
                      You have Not yet setup a profile, please add some info
                    </p>
                    <Link className="btn btn-lg btn-info" to="/create-profile">
                      Create Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
    return content;
  }
}

DashboardHeader.propTypes = {
  user: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  uploadimage: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, uploadimage }
)(DashboardHeader);
