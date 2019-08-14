import axios from "axios";
import {
  ADD_POEM,
  GET_ERRORS,
  GET_POEMS,
  POEM_NOT_FOUND,
  GET_POEM,
  DELETE_POEM,
  POEM_LOADING
} from "./types";

export const addPoem = (postData, history) => dispatch => {
  dispatch(clearErrors());
  axios
    .post("/api/poems", postData)
    .then(res => {
      dispatch({
        type: ADD_POEM,
        payload: res.data
      });
      history.push(`/poem/${res.data._id}`);
    })
    .catch(err => {
      if (err.response !== undefined)
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        });
    });
};

export const getAllPoems = () => dispatch => {
  dispatch(setPoemLoading());
  axios
    .get("/api/poems")
    .then(res => {
      dispatch({
        type: GET_POEMS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: POEM_NOT_FOUND,
        payload: {}
      });
    });
};

export const getPoem = id => dispatch => {
  dispatch(setPoemLoading());
  axios
    .get(`/api/poems/${id}`)
    .then(res => {
      if (res.data === null) {
        dispatch({
          type: POEM_NOT_FOUND,
          payload: {}
        });
      } else {
        dispatch({
          type: GET_POEM,
          payload: res.data
        });
      }
    })
    .catch(err => {
      dispatch({
        type: POEM_NOT_FOUND,
        payload: {}
      });
    });
};

export const editPoem = (poemDAta, id, history) => dispatch => {
  dispatch(clearErrors());
  axios
    .post(`/api/poems/edit/${id}`, poemDAta)
    .then(res => {
      dispatch({
        type: ADD_POEM,
        payload: res.data
      });
      history.push(`/poem/${id}`);
    })
    .catch(err => {
      if (err.response !== undefined) {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        });
      }
    });
};

export const addComment = (comment, id, history) => dispatch => {
  dispatch(clearErrors());
  axios
    .post(`/api/poems/comment/${id}`, comment)
    .then(res => {
      dispatch({
        type: GET_POEM,
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

export const deleteComment = (poemid, commentid) => dispatch => {
  axios
    .delete(`/api/poems/comment/${poemid}/${commentid}`)
    .then(res =>
      dispatch({
        type: GET_POEM,
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

export const getPoemByUser = user => dispatch => {
  dispatch(setPoemLoading());
  axios
    .get(`/api/books/user/${user}`)
    .then(res => {
      dispatch({
        type: GET_POEMS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_POEMS,
        payload: null
      });
    });
};

export const likepoem = (id, option, user) => dispatch => {
  axios
    .post(`/api/poems/like/${id}`)
    .then(res => {
      if (option === "user") dispatch(getPoemByUser(user));
      else if (option === "id") dispatch(getPoem(id));
      else dispatch(getAllPoems());
    })
    .catch(err => {
      console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const dislikepoem = (id, option, user) => dispatch => {
  axios
    .post(`/api/poems/dislike/${id}`)
    .then(res => {
      if (option === "user") dispatch(getPoemByUser(user));
      else if (option === "id") dispatch(getPoem(id));
      else dispatch(getAllPoems());
    })
    .catch(err => {
      console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const deletePoem = id => dispatch => {
  if (window.confirm("Are you sure? This can NOT be undone!")) {
    axios
      .delete(`/api/poems/${id}`)
      .then(res =>
        dispatch({
          type: DELETE_POEM,
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

export const uploadimage = (formData, config, poemid) => dispatch => {
  dispatch(clearErrors());
  axios
    .post(`/api/poems/upload/${poemid}`, formData, config)
    .then(res => {
      dispatch({
        type: GET_POEMS,
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
    type: POEM_LOADING
  };
};
