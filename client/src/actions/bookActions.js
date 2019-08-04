import axios from "axios";
import {
  ADD_BOOK,
  GET_ERRORS,
  CLEAR_ERRORS,
  GET_BOOK,
  BOOK_LOADING,
  BOOK_NOT_FOUND
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
      if (err.response !== undefined)
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
      if (res.data === null) {
        dispatch({ type: BOOK_NOT_FOUND, payload: {} });
      } else {
        dispatch({
          type: GET_BOOK,
          payload: res.data
        });
      }
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: BOOK_NOT_FOUND, payload: {} });
    });
};

export const editBook = (bookData, id, history) => dispatch => {
  dispatch(clearErrors());
  axios
    .post(`/api/books/edit/${id}`, bookData)
    .then(res => {
      dispatch({
        type: ADD_BOOK,
        payload: res.data
      });
      history.push(`/book/${id}`);
    })
    .catch(err => {
      if (err.response !== undefined)
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        });
    });
};

export const addChapter = (chapterData, id, history) => dispatch => {
  dispatch(clearErrors());
  axios
    .post(`/api/books/chapter/${id}`, chapterData)
    .then(res => {
      history.push(`/book/${res.data._id}`);
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
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
