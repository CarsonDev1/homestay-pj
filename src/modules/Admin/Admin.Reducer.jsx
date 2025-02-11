import { AdminActions } from "../../redux/actions";

export const AdminState = {
  listRevenues: [],
  listBookings: [],
  listAccounts: [],
  listUsers: [],
  listPosts: [],
};

const initialState = {
  listRevenues: [],
  listBookings: [],
  listAccounts: [],
  listUsers: [],
  listPosts: [],
};

function adminReducer(state = initialState, action) {
  switch (action.type) {
    case AdminActions.TOTAL_BOOKINGS: {
      return {
        ...state,
        listBookings: action.payload,
      };
    }
    case AdminActions.TOTAL_POST: {
      return {
        ...state,
        listPosts: action.payload,
      };
    }
    case AdminActions.TOTAL_ACCOUNT: {
      return {
        ...state,
        listAccounts: action.payload,
      };
    }
    case AdminActions.TOTAL_REVENUES: {
      return {
        ...state,
        listRevenues: action.payload,
      };
    }
    case AdminActions.TOP_USERS: {
      return {
        ...state,
        listUsers: action.payload,
      };
    }
    default:
      return state;
  }
}

export default adminReducer;
