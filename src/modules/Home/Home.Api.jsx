import { ApiUrl } from "../../services/ApiUrl";
import axiosFromBody from "../../utils/axiosClient/formBody";
import axiosFromData from "../../utils/axiosClient/formData";
import {
  saveHotelDetails,
  saveListHotels,
  saveListVouchers,
  saveRoomDetails,
} from "./Home.Actions";

export const getAllHotelNameToSearch = async () => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.GENERAL.SEARCH.GET_ALL_HOTEL}`
    );
    if (response.status === 200) {
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAllHotel = async () => {
  try {
    const response = await axiosFromBody.get(`${ApiUrl.GENERAL.HOTEL.GET_ALL}`);
    if (response.status === 200) {
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const searchHotelByCity = async (data, dispatch) => {
  try {
    const response = await axiosFromData.post(
      `${ApiUrl.GENERAL.SEARCH.SEARCH_HOTEL_BY_CITY}`,
      data
    );
    if (response.status === 200) {
      dispatch(saveListHotels(response.data.data));
      return response.data.data;
    } else {
      dispatch(saveListHotels([]));
      return false;
    }
  } catch (error) {
    dispatch(saveListHotels([]));
    return false;
  }
};

export const getHotelDetails = async (id, dispatch) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.GENERAL.HOTEL.GET_DETAILS}?id=${id}`
    );
    if (response.status === 200) {
      dispatch(saveHotelDetails(response.data.data));
      return response.data.data;
    } else {
      return {};
    }
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const getRoomDetails = async (id, dispatch) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.GENERAL.ROOM.GET_DETAILS}?roomID=${id}`
    );
    if (response.status === 200) {
      dispatch(saveRoomDetails(response.data.data));
      return response.data.data;
    } else {
      return {};
    }
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const getFeedbackByHotelId = async (id) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.GENERAL.HOTEL.GET_FEEDBACK}?hotelID=${id}`
    );
    if (response.status === 200) {
      return response.data.data;
    } else {
      return {};
    }
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const getAllPost = async () => {
  try {
    const response = await axiosFromBody.get(`${ApiUrl.GENERAL.POST.GET_ALL}`);
    if (response.status === 200) {
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getBookingByAccountId = async (id) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.CUSTOMER.BOOKING.GET_BY_ACCOUNT_ID}?accountID=${id}`
    );
    if (response.status === 200) {
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getBookingDetails = async (id) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.CUSTOMER.BOOKING.GET_DETAILS}?bookingID=${id}`
    );
    if (response.status === 200) {
      return response.data.data;
    } else {
      return {};
    }
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const cancelBooking = async (data) => {
  try {
    const response = await axiosFromData.put(
      `${ApiUrl.CUSTOMER.BOOKING.CANCEL_BOOKING}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const createFeedback = async (data) => {
  try {
    const response = await axiosFromData.post(
      `${ApiUrl.CUSTOMER.BOOKING.CREATE_FEEDBACK}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllPostByAccountId = async (id) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.CUSTOMER.POST.GET_BY_ACCOUNT_ID}?accountId=${id}`
    );
    if (response.status === 200) {
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getPostDetails = async (id) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.GENERAL.POST.GET_DETAILS}?blogId=${id}`
    );
    if (response.status === 200) {
      return response.data.data;
    } else {
      return {};
    }
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const createPost = async (data) => {
  try {
    const response = await axiosFromData.post(
      `${ApiUrl.CUSTOMER.POST.CREATE_POST}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const deletePost = async (id) => {
  try {
    const response = await axiosFromBody.delete(
      `${ApiUrl.CUSTOMER.POST.DELETE_POST}?blogId=${id}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const commentPost = async (data) => {
  try {
    const response = await axiosFromData.post(
      `${ApiUrl.CUSTOMER.POST.COMMENT_POST}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllVoucher = async () => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.GENERAL.VOUCHER.GET_ALL}`
    );
    if (response.status === 200) {
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    throw error;
  }
};

export const receiveVoucher = async (data) => {
  try {
    const response = await axiosFromData.post(
      `${ApiUrl.CUSTOMER.VOUCHER.RECEIVE_VOUCHER}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllVoucherByAccountId = async (accountId, dispatch) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.CUSTOMER.VOUCHER.GET_BY_ACCOUNT_ID}?accountId=${accountId}`
    );

    if (response.status === 200) {
      dispatch(saveListVouchers(response.data.data));
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const checkRoomPrice = async (data) => {
  try {
    const response = await axiosFromData.post(
      `${ApiUrl.CUSTOMER.BOOKING.CHECK_ROOM_PRICE}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getVoucherDetails = async (id) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.CUSTOMER.BOOKING.GET_VOUCHER_DETAILS}?voucherId=${id}`
    );
    if (response.status === 200) {
      return response.data.data;
    } else {
      return {};
    }
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const createBooking = async (data) => {
  try {
    const response = await axiosFromData.post(
      `${ApiUrl.CUSTOMER.BOOKING.CREATE_BOOKING}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateMail = async (data) => {
  try {
    const response = await axiosFromData.put(
      `${ApiUrl.CUSTOMER.PROFILE.UPDATE_EMAIL}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const updatePhone = async (data) => {
  try {
    const response = await axiosFromData.put(
      `${ApiUrl.CUSTOMER.PROFILE.UPDATE_PHONE}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};
