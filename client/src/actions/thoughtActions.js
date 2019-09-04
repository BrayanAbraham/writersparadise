import axios from "axios";
import {
  ADD_THOUGHT,
  GET_ERRORS,
  GET_THOUGHT,
  GET_THOUGHTS,
  THOUGHT_NOT_FOUND,
  THOUGHT_LOADING,
  DELETE_THOUGHT,
  CLEAR_ERRORS
} from "./types";

export const addThought = (postData, history) => dispatch => {
  dispatch(clearErrors());
  axios
    .post("/api/quotes", postData)
    .then(res => {
      dispatch({
        type: ADD_THOUGHT,
        payload: res.data
      });
      history.push(`/quote/${res.data._id}`);
    })
    .catch(err => {
      if (err.response !== undefined)
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        });
    });
};

export const getAllThoughts = () => dispatch => {
  dispatch(setThoughtLoading());
  axios
    .get("/api/quotes")
    .then(res => {
      dispatch({
        type: GET_THOUGHTS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: THOUGHT_NOT_FOUND,
        payload: {}
      });
    });
};

export const getThought = id => dispatch => {
  dispatch(setThoughtLoading());
  axios
    .get(`/api/quotes/${id}`)
    .then(res => {
      if (res.data === null) {
        dispatch({
          type: THOUGHT_NOT_FOUND,
          payload: {}
        });
      } else {
        dispatch({
          type: GET_THOUGHT,
          payload: res.data
        });
      }
    })
    .catch(err => {
      dispatch({
        type: THOUGHT_NOT_FOUND,
        payload: {}
      });
    });
};

export const editThought = (quoteDAta, id, history) => dispatch => {
  dispatch(clearErrors());
  axios
    .post(`/api/quotes/edit/${id}`, quoteDAta)
    .then(res => {
      dispatch({
        type: ADD_THOUGHT,
        payload: res.data
      });
      history.push(`/quote/${id}`);
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
    .post(`/api/quotes/comment/${id}`, comment)
    .then(res => {
      dispatch({
        type: GET_THOUGHT,
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

export const deleteComment = (quoteid, commentid) => dispatch => {
  axios
    .delete(`/api/quotes/comment/${quoteid}/${commentid}`)
    .then(res =>
      dispatch({
        type: GET_THOUGHT,
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

export const getThoughtByUser = user => dispatch => {
  dispatch(setThoughtLoading());
  axios
    .get(`/api/quotes/user/${user}`)
    .then(res => {
      dispatch({
        type: GET_THOUGHTS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_THOUGHTS,
        payload: null
      });
    });
};

export const likethought = (id, option, user) => dispatch => {
  axios
    .post(`/api/quotes/like/${id}`)
    .then(res => {
      if (option === "user") dispatch(getThoughtByUser(user));
      else if (option === "id") dispatch(getThought(id));
      else dispatch(getAllThoughts());
    })
    .catch(err => {
      console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const dislikethought = (id, option, user) => dispatch => {
  axios
    .post(`/api/quotes/dislike/${id}`)
    .then(res => {
      if (option === "user") dispatch(getThoughtByUser(user));
      else if (option === "id") dispatch(getThought(id));
      else dispatch(getAllThoughts());
    })
    .catch(err => {
      console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const deleteThought = id => dispatch => {
  if (window.confirm("Are you sure? This can NOT be undone!")) {
    axios
      .delete(`/api/quotes/${id}`)
      .then(res =>
        dispatch({
          type: DELETE_THOUGHT,
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

export const uploadimage = (formData, config, quoteid, history) => dispatch => {
  dispatch(clearErrors());
  axios
    .post(`/api/quotes/upload/${quoteid}`, formData, config)
    .then(res => {
      dispatch({
        type: GET_THOUGHTS,
        payload: res.data
      });
      history.push(`/quote/${res.data._id}`);
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

export const setThoughtLoading = () => {
  return {
    type: THOUGHT_LOADING
  };
};
