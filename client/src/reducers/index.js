import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import bookReducer from "./bookReducer";
import poemReducer from "./poemReducer";
import profileReducer from "./profileReducer";
import shortstoryReducer from "./shortstoryReducer";
import thoughtReducer from "./thoughtReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  book: bookReducer,
  poem: poemReducer,
  short: shortstoryReducer,
  profile: profileReducer,
  quote: thoughtReducer
});
