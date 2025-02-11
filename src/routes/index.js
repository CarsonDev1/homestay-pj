export const routes = {
  home: {
    root: "/",
    listHotels: "/hotels",
    hotelDetails: "/hotels/details",
    listMoments: "/moments",
    filterMoment: "/moment/city",
    momentDetails: "/moment/details",
    listVouchers: "/vouchers",
    aboutUs: "/about-us",

    createMoment: "/moment/create",
    bookingDetails: "/booking/details",
    myAccount: "/your-account",
    createBooking: "/create-booking",

    notFound: "/not-found",
  },
  auth: {
    login: "/login",
    register: "/register",
    forgotPassword: "/forgot-password",
    verifyEmail: "/verify-email",
    resetPassword: "/reset-password",
    partnerRegistration: "/register/partner",
    verifyOTP: "/verify-otp",
  },
  admin: {
    dashboard: "/admin",
  },
  partner: {
    registration: "/partner/registration-hotel",
    dashboard: "/partner/dashboard",
    hotelInfor: "/partner/hotel-information",
    roomManagement: "/partner/room-management",
    bookingManagement: "/partner/booking-management",
    profile: "/partner/profile",
    feedbackManagement: "/partner/reviews-management",
  },
};
