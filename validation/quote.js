const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateQuoteInput(data) {
  let errors = {};

  data.quote = !isEmpty(data.quote) ? data.quote : "";

  if (!Validator.isLength(data.quote, { min: 1, max: 300 })) {
    errors.quote = "Quote must be between 1 and 300 characters";
  }

  if (Validator.isEmpty(data.quote)) {
    errors.quote = "Quote field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
