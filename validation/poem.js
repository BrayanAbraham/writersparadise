const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePoemInput(data) {
  let errors = {};
  data.title = !isEmpty(data.title) ? data.title : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.body = !isEmpty(data.body) ? data.body : "";
  if (Validator.isEmpty(data.title)) {
    errors.title = "Title field is required";
  }

  if (Validator.isEmpty(data.status)) {
    errors.status = "Status field is required";
  }

  if (Validator.isEmpty(data.body)) {
    errors.body = "Body field is required";
  }

  if (!Validator.isLength(data.body, { min: 20 })) {
    errors.body = "Body must be alteast 20 characters long";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
