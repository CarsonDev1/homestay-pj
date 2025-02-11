import { ApiUrl } from "../../services/ApiUrl";
import axiosFromBody from "../../utils/axiosClient/formBody";
import axiosFromData from "../../utils/axiosClient/formData";
import { dataChart, totalBooking, totalReviews } from "./Partner.Actions";

export const registrationHotel = async (data) => {
  try {
    const response = await axiosFromData.post(
      `${ApiUrl.PARTNER.REGISTRATION_HOTEL}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getDataChart = async (id, dispatch) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.PARTNER.ANALYSIS.BAR_CHART_DATA}?hotelID=${id}`
    );
    if (response.status === 200) {
      dispatch(dataChart(response.data.data));
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getBasicInformation = async (id) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.PARTNER.HOTEL_INFORMATION.GET_INFORMATION}?hotelID=${id}`
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

export const updateBasicInformation = async (data) => {
  try {
    const response = await axiosFromData.put(
      `${ApiUrl.PARTNER.HOTEL_INFORMATION.UPDATE_INFORMATION}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAddress = async (id) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.PARTNER.LOCATION.GET_ADDRESS}?hotelID=${id}`
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

export const updateAddress = async (data) => {
  try {
    const response = await axiosFromData.put(
      `${ApiUrl.PARTNER.LOCATION.UPDATE_ADDRESS}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllAmenities = async (id) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.GENERAL.HOTEL_AMENITIES.GET_ALL}?hotelID=${id}`
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

export const updateAmenities = async (data) => {
  try {
    const response = await axiosFromBody.put(
      `${ApiUrl.PARTNER.AMENITIES.UPDATE_AMENITIES}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllGallery = async (id) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.PARTNER.GALLERY.GET_ALL}?hotelID=${id}`
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

export const addImage = async (data) => {
  try {
    const response = await axiosFromData.post(
      `${ApiUrl.PARTNER.GALLERY.ADD_IMAGE}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteImage = async (id) => {
  try {
    const response = await axiosFromBody.delete(
      `${ApiUrl.PARTNER.GALLERY.DELETE_IMAGE}?imageID=${id}`
    );
    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getAllRoom = async (id) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.GENERAL.ROOM.GET_ALL}?hotelID=${id}`
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

export const addRoom = async (data) => {
  try {
    const response = await axiosFromData.post(
      `${ApiUrl.PARTNER.ROOM.ADD_ROOM}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateRoom = async (data) => {
  try {
    const response = await axiosFromData.put(
      `${ApiUrl.PARTNER.ROOM.UPDATE_ROOM}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteRoom = async (id) => {
  try {
    const response = await axiosFromBody.delete(
      `${ApiUrl.PARTNER.ROOM.DELETE_ROOM}?roomID=${id}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllBooking = async (id, dispatch) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.PARTNER.BOOKING.GET_ALL}?hotelID=${id}`
    );

    if (response.status === 200) {
      dispatch(totalBooking(response.data.data));
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const confirmBookingToAwaitingPayment = async (data) => {
  try {
    const response = await axiosFromData.put(
      `${ApiUrl.PARTNER.BOOKING.CONFIRM_TO_AWAITING_PAYMENT}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const confirmBookingToComplete = async (data) => {
  try {
    const response = await axiosFromData.put(
      `${ApiUrl.PARTNER.BOOKING.CONFIRM_TO_COMPLETE}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllReviews = async (id, dispatch) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.PARTNER.REPORT_FEEDBACK.GET_ALL}?hotelID=${id}`
    );
    if (response.status === 200) {
      dispatch(totalReviews(response.data.data));
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const reportReview = async (data) => {
  try {
    const response = await axiosFromData.post(
      `${ApiUrl.PARTNER.REPORT_FEEDBACK.REPORT}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};
