import {
  THOUGHT_LOADING,
  GET_THOUGHTS,
  GET_THOUGHT,
  ADD_THOUGHT,
  DELETE_THOUGHT,
  THOUGHT_NOT_FOUND
} from "../actions/types";

const initialState = {
  quotes: [],
  quote: {},
  loading: false
};
export default function(state = initialState, action) {
  switch (action.type) {
    case THOUGHT_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_THOUGHTS:
      return {
        ...state,
        quotes: action.payload,
        loading: false
      };
    case GET_THOUGHT:
      return {
        ...state,
        quote: action.payload,
        loading: false
      };
    case ADD_THOUGHT:
      return {
        ...state,
        quotes: [action.payload, ...state.quotes],
        quote: action.payload
      };
    case DELETE_THOUGHT:
      return {
        ...state,
        quotes: state.quotes.filter(quote => quote._id !== action.payload)
      };
    case THOUGHT_NOT_FOUND:
      return {
        ...state,
        loading: false,
        quote: action.payload
      };
    default:
      return state;
  }
}
