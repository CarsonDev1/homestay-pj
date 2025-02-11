import { PartnerActions } from "../../redux/actions";

export const dataChart = (data) => {
  return {
    type: PartnerActions.DATA_CHART,
    payload: data,
  };
};

export const totalBooking = (listBooking) => {
  return {
    type: PartnerActions.TOTAL_BOOKINGS,
    payload: listBooking,
  };
};

export const totalReviews = (listReviews) => {
  return {
    type: PartnerActions.TOTAL_REVIEWS,
    payload: listReviews,
  };
};
