import axios from "axios";
import {
  ADD_BOOK,
  GET_ERRORS,
  CLEAR_ERRORS,
  GET_BOOK,
  BOOK_LOADING,
  BOOK_NOT_FOUND,
  GET_BOOKS,
  DELETE_BOOK
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

export const getAllBooks = () => dispatch => {
  dispatch(setBookLoading());
  axios
    .get("api/books")
    .then(res =>
      dispatch({
        type: GET_BOOKS,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch({
        type: BOOK_NOT_FOUND,
        payload: {}
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
      dispatch(getBook(id));
    });
};

export const addCharacter = (characterData, id, history) => dispatch => {
  dispatch(clearErrors());
  axios
    .post(`/api/books/character/${id}`, characterData)
    .then(res => {
      dispatch({
        type: GET_BOOK,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const addPlotline = (plotline, id, history) => dispatch => {
  dispatch(clearErrors());
  axios
    .post(`/api/books/storyline/${id}`, plotline)
    .then(res => {
      dispatch({
        type: GET_BOOK,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const editChapter = (chapterData, bookid, id, history) => dispatch => {
  dispatch(clearErrors());
  axios
    .post(`/api/books/chapter/edit/${bookid}/${id}`, chapterData)
    .then(res => history.push(`/book/${bookid}`))
    .catch(err => {
      console.log(err.response);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const deleteChapter = (bookid, chapterid) => dispatch => {
  axios
    .delete(`/api/books/chapter/${bookid}/${chapterid}`)
    .then(res =>
      dispatch({
        type: GET_BOOK,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const deleteCharacter = (bookid, characterid) => dispatch => {
  axios
    .delete(`/api/books/character/${bookid}/${characterid}`)
    .then(res =>
      dispatch({
        type: GET_BOOK,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const deletePlotline = (bookid, plotlineid) => dispatch => {
  axios
    .delete(`/api/books/storyline/${bookid}/${plotlineid}`)
    .then(res =>
      dispatch({
        type: GET_BOOK,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const getBooksByUser = user => dispatch => {
  dispatch(setBookLoading);
  axios
    .get(`/api/books/user/${user}`)
    .then(res => {
      dispatch({
        type: GET_BOOKS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_BOOKS,
        payload: null
      });
    });
};

export const likebook = (id, option, user) => dispatch => {
  axios
    .post(`/api/books/like/${id}`)
    .then(res => {
      if (option === "user") dispatch(getBooksByUser(user));
      else if (option === "id") dispatch(getBook(id));
      else dispatch(getAllBooks());
    })
    .catch(err => {
      console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const dislikebook = (id, option, user) => dispatch => {
  axios
    .post(`/api/books/dislike/${id}`)
    .then(res => {
      if (option === "user") dispatch(getBooksByUser(user));
      else if (option === "id") dispatch(getBook(id));
      else dispatch(getAllBooks());
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const deleteBook = id => dispatch => {
  if (window.confirm("Are you sure? This can NOT be undone!")) {
    axios
      .delete(`/api/books/${id}`)
      .then(res =>
        dispatch({
          type: DELETE_BOOK,
          payload: id
        })
      )
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  }
};

export const uploadimage = (formData, config, bookid) => dispatch => {
  dispatch(clearErrors());
  axios
    .post(`/api/books/upload/${bookid}`, formData, config)
    .then(res => {
      dispatch({
        type: GET_BOOK,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
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
