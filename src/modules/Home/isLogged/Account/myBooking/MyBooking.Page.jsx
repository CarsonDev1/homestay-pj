import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import "./MyBooking.Style.scss";
import UserAllBooking from "./AllBooking/User.AllBooking";
import UserAwaitingPayment from "./AwaitingPayment/User.AwaitingPayment";
import UserAwatingCheckin from "./AwaitingCheck-in/User.AwatingCheckin";
import UserCanceled from "./Canceled/User.Canceled";
import UserBookingCompleted from "./AwaitingReviews/User.Booking.Completed";
import secureLocalStorage from "react-secure-storage";
import { API_BASE_URL, ApiUrl } from "../../../../../services/ApiUrl";
import { themeColors } from "../../../../../themes/schemes/PureLightThem";

const navItems = [
  "All",
  "Awaiting Check-in",
  "Awaiting Payment",
  "Completed",
  "Canceled",
];

const MyBookingPage = () => {
  const [isSelectNavItem, setSelectNavItem] = useState(0);

  const handleSelectedNav = (index) => {
    setSelectNavItem(index);
  };

  useEffect(() => {}, [isSelectNavItem]);

  useEffect(() => {
    secureLocalStorage.removeItem("bookingId");
    secureLocalStorage.removeItem("blogId");
    secureLocalStorage.removeItem("blogLocation");
  }, []);

  return (
    <Box className="myBooking_Container">
      <Box className="myBooking_Content-Container">
        <Box className="myBooking_Content-btn">
          <Button
            href={`${API_BASE_URL}${
              ApiUrl.CUSTOMER.BOOKING.EXPORT
            }?accountID=${secureLocalStorage.getItem("accountId")}`}
            className="myBooking_btn-export"
          >
            Export
          </Button>
        </Box>
        <Box className="myBooking_Content-navItem">
          {navItems.map((item, index) => (
            <Typography
              onClick={() => handleSelectedNav(index)}
              sx={{
                color:
                  index === isSelectNavItem
                    ? themeColors.primary_Default
                    : themeColors.black,
                fontWeight: index === isSelectNavItem ? 700 : "normal",
                borderBottom:
                  index === isSelectNavItem
                    ? `3px solid ${themeColors.primary_Default}`
                    : "none",
                fontSize: 18,
                cursor: "pointer",
                "&:hover": {
                  color:
                    index !== isSelectNavItem
                      ? themeColors.text_Disabled
                      : themeColors.primary_Default,
                },
              }}
              key={index}
            >
              {item}
            </Typography>
          ))}
        </Box>
        {isSelectNavItem === 0 ? <UserAllBooking /> : null}
        {isSelectNavItem === 1 ? <UserAwatingCheckin /> : null}
        {isSelectNavItem === 2 ? <UserAwaitingPayment /> : null}
        {isSelectNavItem === 3 ? <UserBookingCompleted /> : null}
        {isSelectNavItem === 4 ? <UserCanceled /> : null}
      </Box>
    </Box>
  );
};

export default MyBookingPage;
