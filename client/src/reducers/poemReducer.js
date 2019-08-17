import {
  POEM_LOADING,
  GET_POEM,
  ADD_POEM,
  DELETE_POEM,
  POEM_NOT_FOUND,
  GET_POEMS
} from "../actions/types";

const initialState = {
  poems: [],
  poem: {},
  loading: false
};
export default function(state = initialState, action) {
  switch (action.type) {
    case POEM_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_POEMS:
      return {
        ...state,
        poems: action.payload,
        loading: false
      };
    case GET_POEM:
      return {
        ...state,
        poem: action.payload,
        loading: false
      };
    case ADD_POEM:
      return {
        ...state,
        poems: [action.payload, ...state.poems],
        poem: action.payload
      };
    case DELETE_POEM:
      return {
        ...state,
        poems: state.poems.filter(poem => poem._id !== action.payload)
      };
    case POEM_NOT_FOUND:
      return {
        ...state,
        loading: false,
        poem: action.payload
      };
    default:
      return state;
  }
}
