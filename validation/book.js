const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateBookInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.genre = !isEmpty(data.genre) ? data.genre : "";
  data.bookdesc = !isEmpty(data.bookdesc) ? data.bookdesc : "";

  if (Validator.isEmpty(data.title)) {
    errors.title = "Title field is required";
  }

  if (Validator.isEmpty(data.status)) {
    errors.status = "Status field is required";
  }

  if (Validator.isEmpty(data.genre)) {
    errors.genre = "genre field is required";
  }

  if (Validator.isEmpty(data.bookdesc)) {
    errors.bookdesc = "Book Description field is required";
  }

  if (!Validator.isLength(data.bookdesc, { min: 20 })) {
    errors.bookdesc = "Book description must be alteast 20 characters long";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
