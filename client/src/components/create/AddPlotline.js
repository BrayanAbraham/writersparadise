import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addPlotline } from "../../actions/bookActions";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { withRouter } from "react-router-dom";

class AddPlotline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plotline: "",
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

  componentDidMount() {
    this.setState({ plotline: "" });
  }

  onSubmit(e) {
    e.preventDefault();

    const plotline = this.state.plotline.replace(/\n/g, "<br />");

    const newplotline = {
      plotline: plotline
    };
    this.props.addPlotline(
      newplotline,
      this.props.book.book._id,
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

  render() {
    const { errors } = this.state;
    return (
      <div className="addplotline">
        <div className="card">
          <div className="card-header text-center">Add Plotline</div>
          <div className="card-body">
            <form noValidate onSubmit={this.onSubmit}>
              <TextAreaFieldGroup
                placeholder="Plotline"
                name="plotline"
                value={this.state.plotline}
                onChange={this.onChange}
                error={errors.plotline}
              />
              <input
                type="submit"
                value="Add Plotline"
                className="btn btn-info btn-block mt-4"
              />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

AddPlotline.porpTypes = {
  errors: PropTypes.object.isRequired,
  book: PropTypes.object.isRequired,
  addPlotline: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  book: state.book,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addPlotline }
)(withRouter(AddPlotline));
