import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { routes } from ".";

const HomePage = lazy(() => import("../modules/Home/Home.Container"));

const HotelsListPage = lazy(() =>
  import("../modules/Home/HotelsList/HotelsList.Container")
);

const ListMomentPage = lazy(() =>
  import("../modules/Home/MomentList/MomentList.Container")
);

const ListVoucherPage = lazy(() =>
  import("../modules/Home/VoucherList/VoucherList.Container")
);

const FilterMomentPage = lazy(() =>
  import("../modules/Home/FilterMomentByCity/FilterMoment.Container")
);

const MomentDetailsPage = lazy(() =>
  import("../modules/Home/MomentDetails/MomentDetails.Container")
);

const HotelDetailsPage = lazy(() =>
  import("../modules/Home/HotelDetails/HotelDetails.Container")
);
const AboutUsPage = lazy(() =>
  import("../modules/Home/AboutUs/AboutUs.Container")
);

const LoginPage = lazy(() => import("../modules/Auth/Login/SignIn.Container"));

const RegisterPage = lazy(() =>
  import("../modules/Auth/Register/Register.Container")
);

const ForgotPasswordPage = lazy(() =>
  import("../modules/Auth/ForgotPassword/ForgotPassword.Container")
);

const VerifyEmailPage = lazy(() =>
  import("../modules/Auth/VerifyEmailPage/VerifyEmail.Container")
);

const ResetPasswordPage = lazy(() =>
  import("../modules/Auth/ResetPassword/ResetPassword.Container")
);

const PartnerRegistrationPage = lazy(() =>
  import("../modules/Auth/PartnerRegistration/PartnerRegistration.Container")
);

const VerifyOTPPage = lazy(() =>
  import("../modules/Auth/VerifyOTP/VerifyOTP.Container")
);

const HotelRegistrationPage = lazy(() =>
  import("../modules/Partner/RegistrationHotel/RegistrationHotel.Container")
);

const NotFoundPage = lazy(() => import("../modules/Error/NotFound.Container"));

export default function NotSignInRoutes() {
  return (
    <Suspense
      fallback={
        <Box
          width="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <LoadingButton
            loading
            variant="outlined"
            sx={{ border: "0 !important" }}
          />
        </Box>
      }
    >
      <Routes>
        <Route path={routes.home.root} element={<HomePage />} />
        <Route path={routes.home.listMoments} element={<ListMomentPage />} />
        <Route path={routes.home.listVouchers} element={<ListVoucherPage />} />
        <Route path={routes.home.filterMoment} element={<FilterMomentPage />} />
        <Route
          path={routes.home.momentDetails}
          element={<MomentDetailsPage />}
        />
        <Route path={routes.home.listHotels} element={<HotelsListPage />} />
        <Route path={routes.home.hotelDetails} element={<HotelDetailsPage />} />
        <Route path={routes.home.aboutUs} element={<AboutUsPage />} />

        <Route path={routes.auth.login} element={<LoginPage />} />
        <Route path={routes.auth.register} element={<RegisterPage />} />
        <Route
          path={routes.auth.forgotPassword}
          element={<ForgotPasswordPage />}
        />
        <Route path={routes.auth.verifyEmail} element={<VerifyEmailPage />} />
        <Route
          path={routes.auth.resetPassword}
          element={<ResetPasswordPage />}
        />
        <Route
          path={routes.auth.partnerRegistration}
          element={<PartnerRegistrationPage />}
        />
        <Route path={routes.auth.verifyOTP} element={<VerifyOTPPage />} />

        <Route
          path={routes.partner.registration}
          element={<HotelRegistrationPage />}
        />

        <Route path={"*"} element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
