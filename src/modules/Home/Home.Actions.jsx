import { HomeActions } from "../../redux/actions";

export const changeSidebar = (index) => {
  return {
    type: HomeActions.CHANGE_SIDE_BAR,
    payload: index,
  };
};

export const saveListHotels = (listHotels) => {
  return {
    type: HomeActions.SAVE_LIST_HOTEL,
    payload: listHotels,
  };
};

export const saveHotelDetails = (hotelDetails) => {
  return {
    type: HomeActions.SAVE_DATA_HOTEL_DETAILS,
    payload: hotelDetails,
  };
};

export const saveRoomDetails = (roomDetails) => {
  return {
    type: HomeActions.SAVE_DATA_ROOM_DETAILS,
    payload: roomDetails,
  };
};

export const saveProfile = (profile) => {
  return {
    type: HomeActions.SAVE_DATA_PROFILE,
    payload: profile,
  };
};

export const saveListVouchers = (listVouchers) => {
  return {
    type: HomeActions.SAVE_LIST_VOUCHER_BY_ACCOUNT_ID,
    payload: listVouchers,
  };
};
