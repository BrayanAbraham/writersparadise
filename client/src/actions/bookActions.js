import axios from "axios";
import {
  ADD_BOOK,
  GET_ERRORS,
  CLEAR_ERRORS,
  GET_BOOK,
  BOOK_LOADING
} from "./types";

export const addBook = (postData, history) => dispatch => {
  dispatch(clearErrors());
  axios
    .post("/api/books", postData)
    .then(res => {
      dispatch({
        type: ADD_BOOK,
        payload: res.data
      });
      history.push(`/book/${res.data._id}`);
    })
    .catch(err => {
      console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const getBook = id => dispatch => {
  dispatch(setBookLoading());
  axios
    .get(`/api/books/${id}`)
    .then(res => {
      dispatch({
        type: GET_BOOK,
        payload: res.data
      });
    })
    .catch(err => {
      if (err.response !== undefined) {
        dispatch({ type: GET_ERRORS, payload: err.response.data });
      }
      dispatch({ type: GET_BOOK, payload: null });
    });
};

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};

export const setBookLoading = () => {
  return {
    type: BOOK_LOADING
  };
};
