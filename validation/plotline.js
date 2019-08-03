const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePlotlineInput(data) {
  let errors = {};

  data.plotline = !isEmpty(data.plotline) ? data.plotline : "";

  if (Validator.isEmpty(data.plotline)) {
    errors.plotline = "plotline field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
