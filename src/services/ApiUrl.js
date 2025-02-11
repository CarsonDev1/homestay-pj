export const API_BASE_URL = 'https://homestaybooking-001-site1.ntempurl.com/api/v1/';
export const URL_IMAGE = 'https://homestaybooking-001-site1.ntempurl.com';

export const ApiUrl = {
	GENERAL: {
		HOTEL: {
			GET_ALL: '/guest/home-stay/get-all',
			GET_DETAILS: '/guest/home-stay/get-detail',
			GET_FEEDBACK: '/hotel/get-guest-review',
		},
		HOTEL_AMENITIES: {
			GET_ALL: '/hotel/get-service-by-hotelID',
		},
		ROOM: {
			GET_ALL: '/room/get-hotel-room',
			GET_DETAILS: '/room/get-room-by-id',
		},
		POST: {
			GET_ALL: '/guest/blog/get-all-blog',
			GET_DETAILS: '/blog/get-blog-details',
		},
		VOUCHER: {
			GET_ALL: '/voucher/get-all-voucher',
		},
		ACCOUNT: {
			GET_PROFILE: '/auth/get-profile-by-account',
			UPDATE_PROFILE: '/account/update-profile',
			CHANGE_PASSWORD: '/account/change-password',
		},
		SEARCH: {
			GET_ALL_HOTEL: '/hotel/get-city',
			SEARCH_HOTEL_BY_CITY: '/hotel/search-hotel-city',
		},
	},
	AUTH: {
		REGISTER: {
			CUSTOMER: '/auth/register-customer',
			PARTNER: '/auth/partner-register',
		},
		VERIFY_EMAIL: '/auth/active-account',
		SEND_MAIL: '/auth/send-mail',
		LOGIN: '/auth/login',
		GOOGLE_LOGIN: '/auth/google-login',
		RESET_PASSWORD: '/auth/update-new-password',
	},
	CUSTOMER: {
		BOOKING: {
			GET_BY_ACCOUNT_ID: '/customer/booking/get-by-accountID',
			GET_DETAILS: '/customer/booking/get-booking-details',
			EXPORT: '/customer/booking/export-bookings-by-accountID',
			CANCEL_BOOKING: '/customer/booking/cancle-booking',
			CREATE_FEEDBACK: '/customer/feedback/create-feedback',
			CHECK_ROOM_PRICE: '/customer/booking/check-room-price',
			GET_VOUCHER_DETAILS: '/voucher/get-voucher-id',
			CREATE_BOOKING: '/customer/booking/create-booking',
		},
		POST: {
			GET_BY_ACCOUNT_ID: '/customer/blog/get-blog-by-account',
			CREATE_POST: '/customer/blog/create-blog',
			DELETE_POST: '/customer/blog/delete-blog',
			COMMENT_POST: '/customer/blog/comment-blog',
		},
		VOUCHER: {
			GET_BY_ACCOUNT_ID: '/customer/voucher/get-voucher-by-account',
			RECEIVE_VOUCHER: '/customer/voucher/receive-voucher',
		},
		PROFILE: {
			UPDATE_EMAIL: '/account/update-email',
			UPDATE_PHONE: '/account/update-phone',
		},
	},
	PARTNER: {
		REGISTRATION_HOTEL: '/partner/hotel/hotel-registration',
		ANALYSIS: {
			BAR_CHART_DATA: '/partner/booking/analysis-revenue-hotel',
			EXPORT_DATA: '/partner/booking/export-bookings-and-total-revenue-by-hotelID',
		},
		HOTEL_INFORMATION: {
			GET_INFORMATION: '/partner/hotel/get-basic-information',
			UPDATE_INFORMATION: '/partner/hotel/update-basic-information',
		},
		LOCATION: {
			GET_ADDRESS: '/partner/hotel/get-address',
			UPDATE_ADDRESS: '/partner/hotel/update-address',
		},
		AMENITIES: {
			UPDATE_AMENITIES: '/partner/hotel/update-service',
		},
		GALLERY: {
			GET_ALL: '/partner/hotel/get-galleries-by-hotelID',
			ADD_IMAGE: '/partner/hotel/add-hotel-image',
			DELETE_IMAGE: '/partner/hotel/delete-hotel-images',
		},
		ROOM: {
			ADD_ROOM: '/partner/room/add-room',
			UPDATE_ROOM: '/partner/room/update-room',
			DELETE_ROOM: '/partner/room/delete-room',
		},
		BOOKING: {
			GET_ALL: '/partner/booking/get-booking-hotel',
			CONFIRM_TO_AWAITING_PAYMENT: '/partner/booking/change-wait-for-payment',
			CONFIRM_TO_COMPLETE: '/partner/booking/change-complete',
		},
		REPORT_FEEDBACK: {
			GET_ALL: '/partner/reportFeedback/get-hotel-feedback',
			REPORT: '/partner/reportFeedback/create-report',
		},
	},
	ADMIN: {
		ANALYSIS: {
			LINE_CHART_DATA: '/admin/booking/analysis-revenue',
			PIE_CHART_DATA: '/admin/hotel/analyze-hotelStander',
			BAR_CHART_DATA: '/admin/booking/count-booking-system',
			TOP_USERS: '/admin/booking/get-top-booking',
		},
		EXPROT_DATA: {
			EXPORT_TOTAL_BOOKING: '/admin/booking/export-all-bookings-total-revenue',
			EXPORT_TOTAL_REVENUE: '/admin/booking/export-revenues',
		},
		HOTEL: {
			INFORMATION: {
				GET_ALL: '/admin/hotel/get-all-hotel-infomation',
				SEARCH_HOTEL: '/admin/hotel/searchByName',
				BLOCK_HOTEL: '/admin/hotel/blocked-hotel',
			},
			REPORT_FEEDBACK: {
				GET_ALL: '/admin/reportFeedback/get-all-report',
				CONFIRM_REPORT: '/admin/reportFeedback/confirm-report',
				REJECT_REPORT: '/admin/reportFeedback/reject-report',
			},
			REGISTRATION: {
				GET_ALL: '/admin/hotel/get-all-registration-form',
				REJECT_HOTEL: '/admin/hotel/reject-registration',
				APPROVE_HOTEL: '/admin/hotel/confirm-registration',
			},
		},
		ACCOUNT: {
			GET_ALL: '/admin/account/get-all',
			SEARCH_ACCOUNT: '/admin/account/searchByName',
			BLOCK_ACCOUNT: '/admin/account/blocked-account',
		},
		POST: {
			APPROVE_POST: '/admin/blog/confirm-blog',
			REJECT_POST: '/admin/blog/reject-blog',
		},
		VOUCHER: {
			SEARCH_VOUCHER: '/admin/voucher/search-name',
			ADD_VOUCHER: '/admin/voucher/create-voucher',
			UPDATE_VOUCHER: '/admin/voucher/update-voucher',
			DELETE_VOUCHER: '/admin/voucher/delete-voucher',
		},
	},
};
