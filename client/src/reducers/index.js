import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import bookReducer from "./bookReducer";
import poemReducer from "./poemReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  book: bookReducer,
  poem: poemReducer
});
