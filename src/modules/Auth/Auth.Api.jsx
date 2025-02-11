import { ApiUrl } from '../../services/ApiUrl';
import axiosFromBody from '../../utils/axiosClient/formBody';
import axiosFromData from '../../utils/axiosClient/formData';
import { saveProfile } from '../Home/Home.Actions';

export const login = async (data) => {
	try {
		const response = await axiosFromBody.post(`${ApiUrl.AUTH.LOGIN}`, data);
		return response;
	} catch (error) {
		throw error;
	}
};

export const googleLogin = async (data) => {
	try {
		const response = await axiosFromData.post(`${ApiUrl.AUTH.GOOGLE_LOGIN}`, data);
		return response;
	} catch (error) {
		throw error;
	}
};

export const registerCustomer = async (data) => {
	try {
		const response = await axiosFromBody.post(`${ApiUrl.AUTH.REGISTER.CUSTOMER}`, data);
		return response;
	} catch (error) {
		throw error;
	}
};

export const registerPartner = async (data) => {
	try {
		const response = await axiosFromData.post(`${ApiUrl.AUTH.REGISTER.PARTNER}`, data);
		return response;
	} catch (error) {
		throw error;
	}
};

export const sendMail = async (email) => {
	try {
		const response = await axiosFromBody.post(`${ApiUrl.AUTH.SEND_MAIL}`, email);
		return response;
	} catch (error) {
		console.log(error);
	}
};

export const verifyEmail = async (email) => {
	try {
		const response = await axiosFromData.put(`${ApiUrl.AUTH.VERIFY_EMAIL}`, email);
		return response;
	} catch (error) {
		throw error;
	}
};

export const resetPassword = async (data) => {
	try {
		const response = await axiosFromData.put(`${ApiUrl.AUTH.RESET_PASSWORD}`, data);
		return response;
	} catch (error) {
		throw error;
	}
};

export const getProfile = async (id, dispatch) => {
	const token = localStorage.getItem('token');

	try {
		const response = await axiosFromBody.get(`${ApiUrl.GENERAL.ACCOUNT.GET_PROFILE}?accountId=${id}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (response.status === 200) {
			dispatch(saveProfile(response.data.data));
			return response.data.data;
		} else {
			return {};
		}
	} catch (error) {
		console.log(error);
		return {};
	}
};

export const updateProfile = async (data) => {
	try {
		const response = await axiosFromData.put(`${ApiUrl.GENERAL.ACCOUNT.UPDATE_PROFILE}`, data);
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

export const changePassword = async (data) => {
	try {
		const response = await axiosFromBody.put(`${ApiUrl.GENERAL.ACCOUNT.CHANGE_PASSWORD}`, data);
		return response;
	} catch (error) {
		console.log(error);
		return false;
	}
};
