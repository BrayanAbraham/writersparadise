import axios from "axios";
import {
  ADD_SHORT_STORY,
  GET_ERRORS,
  GET_SHORT_STORIES,
  SHORT_STORY_NOT_FOUND,
  GET_SHORT_STORY,
  DELETE_SHORT_STORY,
  SHORT_STORY_LOADING,
  CLEAR_ERRORS
} from "./types";

export const addShortStory = (postData, history) => dispatch => {
  dispatch(clearErrors());
  axios
    .post("/api/shorts", postData)
    .then(res => {
      dispatch({
        type: ADD_SHORT_STORY,
        payload: res.data
      });
      history.push(`/shorts/${res.data._id}`);
    })
    .catch(err => {
      if (err.response !== undefined)
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        });
    });
};

export const getAllShortStories = () => dispatch => {
  dispatch(setShortStoryLoading());
  axios
    .get("/api/shorts")
    .then(res => {
      dispatch({
        type: GET_SHORT_STORIES,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: SHORT_STORY_NOT_FOUND,
        payload: {}
      });
    });
};

export const getShortStory = id => dispatch => {
  dispatch(setShortStoryLoading());
  axios
    .get(`/api/shorts/${id}`)
    .then(res => {
      if (res.data === null) {
        dispatch({
          type: SHORT_STORY_NOT_FOUND,
          payload: {}
        });
      } else {
        dispatch({
          type: GET_SHORT_STORY,
          payload: res.data
        });
      }
    })
    .catch(err => {
      dispatch({
        type: SHORT_STORY_NOT_FOUND,
        payload: {}
      });
    });
};

export const editShortStory = (shortDAta, id, history) => dispatch => {
  dispatch(clearErrors());
  axios
    .post(`/api/shorts/edit/${id}`, shortDAta)
    .then(res => {
      dispatch({
        type: ADD_SHORT_STORY,
        payload: res.data
      });
      history.push(`/short/${id}`);
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
    .post(`/api/shorts/comment/${id}`, comment)
    .then(res => {
      dispatch({
        type: GET_SHORT_STORY,
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

export const deleteComment = (shortid, commentid) => dispatch => {
  axios
    .delete(`/api/shorts/comment/${shortid}/${commentid}`)
    .then(res =>
      dispatch({
        type: GET_SHORT_STORY,
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

export const getShortStoryByUser = user => dispatch => {
  dispatch(setShortStoryLoading());
  axios
    .get(`/api/shorts/user/${user}`)
    .then(res => {
      dispatch({
        type: GET_SHORT_STORIES,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_SHORT_STORIES,
        payload: null
      });
    });
};

export const likeshort = (id, option, user) => dispatch => {
  axios
    .post(`/api/shorts/like/${id}`)
    .then(res => {
      if (option === "user") dispatch(getShortStoryByUser(user));
      else if (option === "id") dispatch(getShortStory(id));
      else dispatch(getAllShortStories());
    })
    .catch(err => {
      console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const dislikeshort = (id, option, user) => dispatch => {
  axios
    .post(`/api/shorts/dislike/${id}`)
    .then(res => {
      if (option === "user") dispatch(getShortStoryByUser(user));
      else if (option === "id") dispatch(getShortStory(id));
      else dispatch(getAllShortStories());
    })
    .catch(err => {
      console.log(err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const deleteShortStory = id => dispatch => {
  if (window.confirm("Are you sure? This can NOT be undone!")) {
    axios
      .delete(`/api/shorts/${id}`)
      .then(res =>
        dispatch({
          type: DELETE_SHORT_STORY,
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

export const uploadimage = (formData, config, shortid, history) => dispatch => {
  dispatch(clearErrors());
  axios
    .post(`/api/shorts/upload/${shortid}`, formData, config)
    .then(res => {
      dispatch({
        type: GET_SHORT_STORIES,
        payload: res.data
      });
      history.push(`/short/${res.data._id}`);
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

export const setShortStoryLoading = () => {
  return {
    type: SHORT_STORY_LOADING
  };
};
