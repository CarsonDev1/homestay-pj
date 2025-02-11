import secureLocalStorage from "react-secure-storage";
import { checkLogin } from "../utils/helper";
import { routes } from "../routes";
import { partnerContext } from "./PartnerContext";
import { homeContext } from "./HomeContext";

export const authContext = (navigate) => {
  if (checkLogin()) {
    switch (secureLocalStorage.getItem("role")) {
      case "Admin":
        navigate(routes.admin.dashboard);
        break;
      case "Partner":
        partnerContext(navigate);
        break;
      case "Customer":
        homeContext(navigate);
        break;
      default:
        navigate(routes.home.root);
        break;
    }
  } else {
    switch (window.location.pathname) {
      case "/admin":
        navigate(routes.auth.login);
        break;
      case "/partner/registration-hotel":
        navigate(routes.partner.registration);
        break;
      case "/partner/dashboard":
        navigate(routes.auth.login);
        break;
      case "/partner/hotel-information":
        navigate(routes.auth.login);
        break;
      case "/partner/room-management":
        navigate(routes.auth.login);
        break;
      case "/partner/booking-management":
        navigate(routes.auth.login);
        break;
      case "/partner/profile":
        navigate(routes.auth.login);
        break;
      case "/partner/reviews-management":
        navigate(routes.auth.login);
        break;
      case "/login":
        navigate(routes.auth.login);
        break;
      case "/register":
        navigate(routes.auth.register);
        break;
      case "/forgotPassword":
        navigate(routes.auth.forgotPassword);
        break;
      case "/verify-email":
        navigate(routes.auth.verifyEmail);
        break;
      case "/reset-password":
        navigate(routes.auth.resetPassword);
        break;
      case "/register/partner":
        navigate(routes.auth.partnerRegistration);
        break;
      case "/verify-otp":
        navigate(routes.auth.verifyOTP);
        break;
      case "/":
        navigate(routes.home.root);
        break;
      case "/hotels":
        navigate(routes.home.listHotels);
        break;
      case "/hotels/details":
        navigate(routes.home.hotelDetails);
        break;
      case "/moments":
        navigate(routes.home.listMoments);
        break;
      case "/moment/city":
        navigate(routes.home.filterMoment);
        break;
      case "/moment/details":
        navigate(routes.home.momentDetails);
        break;
      case "/vouchers":
        navigate(routes.home.listVouchers);
        break;
      case "/about-us":
        navigate(routes.home.aboutUs);
        break;
      case "/moment/create":
        navigate(routes.auth.login);
        break;
      case "/your-account":
        navigate(routes.auth.login);
        break;
      case "/booking/details":
        navigate(routes.auth.login);
        break;
      case "/create-booking":
        navigate(routes.auth.login);
        break;
      default:
        navigate(routes.home.notFound);
        break;
    }
  }
};
