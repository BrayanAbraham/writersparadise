import {
  SHORT_STORY_LOADING,
  GET_SHORT_STORIES,
  GET_SHORT_STORY,
  ADD_SHORT_STORY,
  DELETE_SHORT_STORY,
  SHORT_STORY_NOT_FOUND
} from "../actions/types";

const initialState = {
  shorts: [],
  short: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SHORT_STORY_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_SHORT_STORIES:
      return {
        ...state,
        shorts: action.payload,
        loading: false
      };
    case GET_SHORT_STORY:
      return {
        ...state,
        short: action.payload,
        loading: false
      };
    case ADD_SHORT_STORY:
      return {
        ...state,
        shorts: [action.payload, ...state.shorts],
        short: action.payload
      };
    case DELETE_SHORT_STORY:
      return {
        ...state,
        shorts: state.shorts.filter(short => short._id !== action.payload)
      };
    case SHORT_STORY_NOT_FOUND:
      return {
        ...state,
        loading: false,
        short: action.payload
      };
    default:
      return state;
  }
}
