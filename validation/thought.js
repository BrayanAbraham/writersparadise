const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateQuoteInput(data) {
  let errors = {};
  data.status = !isEmpty(data.status) ? data.status : "";
  data.body = !isEmpty(data.body) ? data.body : "";

  if (Validator.isEmpty(data.status)) {
    errors.status = "Status field is required";
  }

  if (Validator.isEmpty(data.body)) {
    errors.body = "Body field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
