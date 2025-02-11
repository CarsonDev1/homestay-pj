import { ApiUrl } from "../../services/ApiUrl";
import axiosFromBody from "../../utils/axiosClient/formBody";
import axiosFromData from "../../utils/axiosClient/formData";
import {
  topUsers,
  totalAccount,
  totalBookings,
  totalPosts,
  totalRevenues,
} from "./Admin.Actions";

export const getDataLineChart = async (dispatch) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.ADMIN.ANALYSIS.LINE_CHART_DATA}`
    );
    if (response.status === 200) {
      dispatch(totalRevenues(response.data.data));
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getDataPieChart = async () => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.ADMIN.ANALYSIS.PIE_CHART_DATA}`
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

export const getDataBarChart = async (dispatch) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.ADMIN.ANALYSIS.BAR_CHART_DATA}`
    );
    if (response.status === 200) {
      dispatch(totalBookings(response.data.data));
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getTopUser = async (dispatch) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.ADMIN.ANALYSIS.TOP_USERS}`
    );
    if (response.status === 200) {
      dispatch(topUsers(response.data.data));
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAllHotelInformation = async () => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.ADMIN.HOTEL.INFORMATION.GET_ALL}`
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

export const searchHotel = async (searchValue) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.ADMIN.HOTEL.INFORMATION.SEARCH_HOTEL}?hotelName=${searchValue}`
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

export const blockHotel = async (data) => {
  try {
    const response = await axiosFromData.put(
      `${ApiUrl.ADMIN.HOTEL.INFORMATION.BLOCK_HOTEL}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllReportFeedback = async () => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.ADMIN.HOTEL.REPORT_FEEDBACK.GET_ALL}`
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

export const confirmReport = async (id) => {
  try {
    const response = await axiosFromBody.put(
      `${ApiUrl.ADMIN.HOTEL.REPORT_FEEDBACK.CONFIRM_REPORT}?reportID=${id}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const rejectReport = async (data) => {
  try {
    const response = await axiosFromData.put(
      `${ApiUrl.ADMIN.HOTEL.REPORT_FEEDBACK.REJECT_REPORT}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllRegisteringHotel = async () => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.ADMIN.HOTEL.REGISTRATION.GET_ALL}`
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

export const approveRegisteringHotel = async (id) => {
  try {
    const response = await axiosFromData.put(
      `${ApiUrl.ADMIN.HOTEL.REGISTRATION.APPROVE_HOTEL}`,
      id
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const rejectRegisteringHotel = async (data) => {
  try {
    const response = await axiosFromData.put(
      `${ApiUrl.ADMIN.HOTEL.REGISTRATION.REJECT_HOTEL}`,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getAllAccount = async (dispatch) => {
  try {
    const response = await axiosFromBody.get(`${ApiUrl.ADMIN.ACCOUNT.GET_ALL}`);
    if (response.status === 200) {
      dispatch(totalAccount(response.data.data));
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const searchAccount = async (searchValue) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.ADMIN.ACCOUNT.SEARCH_ACCOUNT}?name=${searchValue}`
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

export const blockAccount = async (formData) => {
  try {
    const response = await axiosFromData.put(
      `${ApiUrl.ADMIN.ACCOUNT.BLOCK_ACCOUNT}`,
      formData
    );

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
};

export const getAllPost = async (dispatch) => {
  try {
    const response = await axiosFromBody.get(`${ApiUrl.GENERAL.POST.GET_ALL}`);
    if (response.status === 200) {
      dispatch(totalPosts(response.data.data));
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const approvePost = async (id) => {
  try {
    const response = await axiosFromBody.put(
      `${ApiUrl.ADMIN.POST.APPROVE_POST}?blogId=${id}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const rejectPost = async (formData) => {
  try {
    const response = await axiosFromData.put(
      `${ApiUrl.ADMIN.POST.REJECT_POST}`,
      formData
    );
    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
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
    console.log(error);
    return [];
  }
};

export const searchVoucher = async (searchValue) => {
  try {
    const response = await axiosFromBody.get(
      `${ApiUrl.ADMIN.VOUCHER.SEARCH_VOUCHER}?voucherName=${searchValue}`
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

export const addVoucher = async (
  file,
  name,
  code,
  quantity,
  discount,
  desc
) => {
  try {
    let formData = new FormData();

    formData.append("image", file);
    formData.append("voucherName", name);
    formData.append("Code", code);
    formData.append("QuantityUse", quantity);
    formData.append("Discount", discount);
    formData.append("Description", desc);

    const response = await axiosFromData.post(
      `${ApiUrl.ADMIN.VOUCHER.ADD_VOUCHER}`,
      formData
    );

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
};

export const updateVoucher = async (
  id,
  file,
  name,
  code,
  quantity,
  discount,
  desc
) => {
  try {
    let formData = new FormData();

    formData.append("voucherID", id);
    formData.append("image", file);
    formData.append("voucherName", name);
    formData.append("Code", code);
    formData.append("QuantityUse", quantity);
    formData.append("Discount", discount);
    formData.append("Description", desc);

    const response = await axiosFromData.put(
      `${ApiUrl.ADMIN.VOUCHER.UPDATE_VOUCHER}`,
      formData
    );

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
};

export const deleteVoucher = async (voucherId) => {
  try {
    const response = await axiosFromBody.delete(
      `${ApiUrl.ADMIN.VOUCHER.DELETE_VOUCHER}?voucherID=${voucherId}`
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
