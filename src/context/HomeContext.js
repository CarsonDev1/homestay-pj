import { routes } from "../routes";

export const homeContext = (navigate) => {
  switch (window.location.pathname) {
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
      navigate(routes.home.createMoment);
      break;
    case "/your-account":
      navigate(routes.home.myAccount);
      break;
    case "/booking/details":
      navigate(routes.home.bookingDetails);
      break;
    case "/create-booking":
      navigate(routes.home.createBooking);
      break;
    default:
      navigate(routes.home.notFound);
      break;
  }
};
