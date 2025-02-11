import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/material";
import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { routes } from ".";

const HotelRegistrationPage = lazy(() =>
  import("../modules/Partner/RegistrationHotel/RegistrationHotel.Container")
);

const PartnerDashboardPage = lazy(() =>
  import("../modules/Partner/Dashboard/PartnerDashboard.Container")
);

const PartnerHotelPage = lazy(() =>
  import("../modules/Partner/HotelInformation/HotelInformation.Container")
);

const PartnerRoomPage = lazy(() =>
  import("../modules/Partner/RoomManagement/RoomManagement.Container")
);

const PartnerBookingPage = lazy(() =>
  import("../modules/Partner/BookingManagement/BookingManagement.Container")
);

const PartnerProfilePage = lazy(() =>
  import("../modules/Partner/PartnerProfile/PartnerProfile.Container")
);

const PartnerFeedbackPage = lazy(() =>
  import("../modules/Partner/FeedbackManagement/FeedbackManagement.Container")
);

const NotFoundPage = lazy(() => import("../modules/Error/NotFound.Container"));

const PartnerRoutes = () => {
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
        <Route
          path={routes.partner.registration}
          element={<HotelRegistrationPage />}
        />
        <Route
          path={routes.partner.dashboard}
          element={<PartnerDashboardPage />}
        />
        <Route
          path={routes.partner.hotelInfor}
          element={<PartnerHotelPage />}
        />
        <Route
          path={routes.partner.roomManagement}
          element={<PartnerRoomPage />}
        />
        <Route
          path={routes.partner.bookingManagement}
          element={<PartnerBookingPage />}
        />
        <Route
          path={routes.partner.feedbackManagement}
          element={<PartnerFeedbackPage />}
        />
        <Route path={routes.partner.profile} element={<PartnerProfilePage />} />

        <Route path={"*"} element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default PartnerRoutes;
