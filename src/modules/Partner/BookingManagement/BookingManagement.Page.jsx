import React, { useState } from "react";
import "./BookingManagement.Style.scss";
import HeaderPartner from "../../../layouts/Header/Partner/HeaderPartner";
import FooterPartner from "../../../layouts/Footer/Partner/FooterPartner";
import BoxContainer from "../../../components/Box/Box.Container";
import { Box, Typography } from "@mui/material";
import { themeColors } from "../../../themes/schemes/PureLightThem";
import AllBookingPage from "./AllBooking/AllBooking.Page";
import AwaitingCheckInBookingPage from "./AwaitingCheckInBooking/AwaitingCheckInBooking.Page";
import AwaitingPaymentBookingPage from "./AwaitingPaymentBooking/AwaitingPaymentBooking.Page";
import CanceledBookingPage from "./CanceledBooking/CanceledBooking.Page";
import CompletedBookingPage from "./CompletedBooking/CompletedBooking.Page";

const navItems = [
  "All",
  "Awaiting Check-in",
  "Awaiting Payment",
  "Completed",
  "Canceled",
];

const BookingManagementPage = () => {
  const [isSelected, setIsSelected] = useState(0);

  const handleSelected = (index) => {
    setIsSelected(index);
  };

  return (
    <>
      <HeaderPartner />

      <BoxContainer property="partner-booking__container">
        <Box className="partner-booking__nav">
          {navItems.map((item, index) => (
            <Typography
              key={index}
              onClick={() => handleSelected(index)}
              sx={{
                color:
                  index === isSelected
                    ? themeColors.primary_Default
                    : themeColors.black,
                fontWeight: index === isSelected ? 700 : "normal",
                borderBottom:
                  index === isSelected
                    ? `3px solid ${themeColors.primary_Default}`
                    : "none",
                fontSize: 18,
                cursor: "pointer",
                "&:hover": {
                  color:
                    index !== isSelected
                      ? themeColors.text_Disabled
                      : themeColors.primary_Default,
                },
              }}
            >
              {item}
            </Typography>
          ))}
        </Box>

        <Box className="partner-booking__table">
          {isSelected === 0 ? <AllBookingPage /> : null}
          {isSelected === 1 ? <AwaitingCheckInBookingPage /> : null}
          {isSelected === 2 ? <AwaitingPaymentBookingPage /> : null}
          {isSelected === 3 ? <CompletedBookingPage /> : null}
          {isSelected === 4 ? <CanceledBookingPage /> : null}
        </Box>
      </BoxContainer>

      <FooterPartner />
    </>
  );
};

export default BookingManagementPage;
