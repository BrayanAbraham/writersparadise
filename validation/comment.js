const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateCommentInput(data) {
  let errors = {};

  data.body = !isEmpty(data.body) ? data.body : "";

  if (!Validator.isLength(data.body, { min: 1, max: 300 })) {
    errors.body = "Comment must be between 1 and 300 characters";
  }

  if (Validator.isEmpty(data.body)) {
    errors.body = "Comment field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
