import { AdminActions } from "../../redux/actions";

export const totalRevenues = (listRevenues) => {
  return {
    type: AdminActions.TOTAL_REVENUES,
    payload: listRevenues,
  };
};

export const totalBookings = (listBookings) => {
  return {
    type: AdminActions.TOTAL_BOOKINGS,
    payload: listBookings,
  };
};

export const totalAccount = (listAccounts) => {
  return {
    type: AdminActions.TOTAL_ACCOUNT,
    payload: listAccounts,
  };
};

export const topUsers = (listUsers) => {
  return {
    type: AdminActions.TOP_USERS,
    payload: listUsers,
  };
};

export const totalPosts = (listPosts) => {
  return {
    type: AdminActions.TOTAL_POST,
    payload: listPosts,
  };
};
