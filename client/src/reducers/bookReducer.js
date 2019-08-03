import {
  BOOK_LOADING,
  GET_BOOKS,
  GET_BOOK,
  ADD_BOOK,
  DELETE_BOOK
} from "../actions/types";

const initialState = {
  books: [],
  book: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case BOOK_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_BOOKS:
      return {
        ...state,
        book: action.payload,
        loading: false
      };
    case GET_BOOK:
      return {
        ...state,
        book: action.payload,
        loading: false
      };
    case ADD_BOOK:
      return {
        ...state,
        books: [action.payload, ...state.books],
        book: action.payload
      };
    case DELETE_BOOK:
      return {
        ...state,
        books: state.books.filter(book => book._id !== action.payload)
      };
    default:
      return state;
  }
}
