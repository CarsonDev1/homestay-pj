import { routes } from "../routes";

export const partnerContext = (navigate) => {
  switch (window.location.pathname) {
    case "/partner/registration-hotel":
      navigate(routes.partner.registration);
      break;
    case "/partner/dashboard":
      navigate(routes.partner.dashboard);
      break;
    case "/partner/hotel-information":
      navigate(routes.partner.hotelInfor);
      break;
    case "/partner/room-management":
      navigate(routes.partner.roomManagement);
      break;
    case "/partner/booking-management":
      navigate(routes.partner.bookingManagement);
      break;
    case "/partner/profile":
      navigate(routes.partner.profile);
      break;
    case "/partner/reviews-management":
      navigate(routes.partner.feedbackManagement);
      break;
    default:
      navigate(routes.home.notFound);
      break;
  }
};
