import { PartnerActions } from "../../redux/actions";

export const PartnerState = {
  dataChart: [],
  listBooking: [],
  listReview: [],
};

const initialState = {
  dataChart: [],
  listBooking: [],
  listReview: [],
};

function partnerReducer(state = initialState, action) {
  switch (action.type) {
    case PartnerActions.DATA_CHART: {
      return {
        ...state,
        dataChart: action.payload,
      };
    }
    case PartnerActions.TOTAL_BOOKINGS: {
      return {
        ...state,
        listBooking: action.payload,
      };
    }
    case PartnerActions.TOTAL_REVIEWS: {
      return {
        ...state,
        listReview: action.payload,
      };
    }
    default:
      return state;
  }
}

export default partnerReducer;
