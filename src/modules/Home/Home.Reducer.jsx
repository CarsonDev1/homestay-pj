import { HomeActions } from "../../redux/actions";

export const HomeState = {
  indexSidebar: 0,
  listHotels: [],
  hotelDetails: {},
  roomDetails: {},
  profile: {},
  listVouchers: [],
};

const initialState = {
  indexSidebar: 0,
  listHotels: [],
  hotelDetails: {},
  roomDetails: {},
  profile: {},
  listVouchers: [],
};

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case HomeActions.CHANGE_SIDE_BAR:
      return {
        ...state,
        indexSidebar: action.payload,
      };
    case HomeActions.SAVE_LIST_HOTEL:
      return {
        ...state,
        listHotels: action.payload,
      };
    case HomeActions.SAVE_DATA_HOTEL_DETAILS:
      return {
        ...state,
        hotelDetails: action.payload,
      };
    case HomeActions.SAVE_DATA_ROOM_DETAILS:
      return {
        ...state,
        roomDetails: action.payload,
      };
    case HomeActions.SAVE_DATA_PROFILE:
      return {
        ...state,
        profile: action.payload,
      };
    case HomeActions.SAVE_LIST_VOUCHER_BY_ACCOUNT_ID:
      return {
        ...state,
        listVouchers: action.payload,
      };
    default:
      return state;
  }
}

export default homeReducer;
