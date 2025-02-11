import React, { useState, useEffect } from "react";
import "./PartnerDashboard.Style.scss";
import HeaderPartner from "../../../layouts/Header/Partner/HeaderPartner";
import FooterPartner from "../../../layouts/Footer/Partner/FooterPartner";
import BoxContainer from "../../../components/Box/Box.Container";
import { Box, Button, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { themeColors } from "../../../themes/schemes/PureLightThem";
import CustomTooltip from "../../../components/Tooltip/CustomTooltip";
import { useSelector } from "react-redux";
import {
  filterBookingCanceled,
  filterBookingCheckIn,
  filterBookingPayment,
} from "../../../utils/filter";
import {
  calculateTotalRevenuesPartner,
  formatPrice,
} from "../../../utils/helper";
import { API_BASE_URL, ApiUrl } from "../../../services/ApiUrl";
import secureLocalStorage from "react-secure-storage";

const PartnerDashboardPage = () => {
  let listBookingAwaitingCheckIn = [];
  let listBookingAwaitingPayment = [];
  let listBookingCanceled = [];

  const duration = 2000;
  const intervalTime = 20;

  const dataChart = useSelector((state) => state.partner.dataChart);
  const dataBooking = useSelector((state) => state.partner.listBooking);
  const dataReview = useSelector((state) => state.partner.listReview);

  const [countTotalBooking, setCountTotalBooking] = useState(0);
  const [
    countTotalBookingAwaitingCheckIn,
    setCountTotalBookingAwaitingCheckIn,
  ] = useState(0);
  const [
    countTotalBookingAwaitingPayment,
    setCountTotalBookingAwaitingPayment,
  ] = useState(0);
  const [countTotalBookingCanceled, setCountTotalBookingCanceled] = useState(0);
  const [countTotalRevenues, setCountTotalRevenues] = useState(0);
  const [countTotalReviews, setCountTotalReviews] = useState(0);

  const totalBooking = dataBooking?.length;

  listBookingAwaitingCheckIn = filterBookingCheckIn(dataBooking);
  const totalBookingAwaitingCheckIn = listBookingAwaitingCheckIn?.length;

  listBookingAwaitingPayment = filterBookingPayment(dataBooking);
  const totalBookingAwaitingPayment = listBookingAwaitingPayment?.length;

  listBookingCanceled = filterBookingCanceled(dataBooking);
  const totalBookingCanceled = listBookingCanceled?.length;

  const totalRevenue = calculateTotalRevenuesPartner(dataChart);

  const totalReviews = dataReview?.length;

  const formatYAxis = (tickItem) => {
    if (tickItem >= 1000000) {
      return `${(tickItem / 1000000).toFixed(0)}tr`;
    }
    return tickItem;
  };

  useEffect(() => {
    const incrementTotalBooking = totalBooking / (duration / intervalTime);
    const intervalTotalBooking = setInterval(() => {
      setCountTotalBooking((prevCount) => {
        if (prevCount + incrementTotalBooking >= totalBooking) {
          clearInterval(intervalTotalBooking);
          return totalBooking;
        }
        return prevCount + incrementTotalBooking;
      });
    }, intervalTime);

    const incrementTotalBookingAwaitingCheckIn =
      totalBookingAwaitingCheckIn / (duration / intervalTime);
    const intervalTotalBookingAwaitingCheckIn = setInterval(() => {
      setCountTotalBookingAwaitingCheckIn((prevCount) => {
        if (
          prevCount + incrementTotalBookingAwaitingCheckIn >=
          totalBookingAwaitingCheckIn
        ) {
          clearInterval(intervalTotalBookingAwaitingCheckIn);
          return totalBookingAwaitingCheckIn;
        }
        return prevCount + incrementTotalBookingAwaitingCheckIn;
      });
    }, intervalTime);

    const incrementTotalBookingAwaitingPayment =
      totalBookingAwaitingPayment / (duration / intervalTime);
    const intervalTotalBookingAwaitingPayment = setInterval(() => {
      setCountTotalBookingAwaitingPayment((prevCount) => {
        if (
          prevCount + incrementTotalBookingAwaitingPayment >=
          totalBookingAwaitingPayment
        ) {
          clearInterval(intervalTotalBookingAwaitingPayment);
          return totalBookingAwaitingPayment;
        }
        return prevCount + incrementTotalBookingAwaitingPayment;
      });
    }, intervalTime);

    const incrementTotalBookingCanceled =
      totalBookingCanceled / (duration / intervalTime);
    const intervalTotalBookingCanceled = setInterval(() => {
      setCountTotalBookingCanceled((prevCount) => {
        if (prevCount + incrementTotalBookingCanceled >= totalBookingCanceled) {
          clearInterval(intervalTotalBookingCanceled);
          return totalBookingCanceled;
        }
        return prevCount + incrementTotalBookingCanceled;
      });
    }, intervalTime);

    const incrementTotalRevenue = totalRevenue / (duration / intervalTime);
    const intervalTotalRevenue = setInterval(() => {
      setCountTotalRevenues((prevCount) => {
        if (prevCount + incrementTotalRevenue >= totalRevenue) {
          clearInterval(intervalTotalRevenue);
          return totalRevenue;
        }
        return prevCount + incrementTotalRevenue;
      });
    }, intervalTime);

    const incrementTotalReview = totalReviews / (duration / intervalTime);
    const intervalTotalReview = setInterval(() => {
      setCountTotalReviews((prevCount) => {
        if (prevCount + incrementTotalReview >= totalReviews) {
          clearInterval(intervalTotalReview);
          return totalReviews;
        }
        return prevCount + incrementTotalReview;
      });
    }, intervalTime);

    return () => {
      clearInterval(incrementTotalBooking);
      clearInterval(intervalTotalBookingAwaitingCheckIn);
      clearInterval(intervalTotalBookingAwaitingPayment);
      clearInterval(intervalTotalBookingCanceled);
      clearInterval(intervalTotalRevenue);
      clearInterval(intervalTotalReview);
    };
  }, [
    totalBooking,
    totalBookingAwaitingCheckIn,
    totalBookingAwaitingPayment,
    totalBookingCanceled,
    totalRevenue,
    totalReviews,
  ]);

  return (
    <>
      <HeaderPartner />

      <BoxContainer property="partner-dashboard__container">
        <Box className="dashboard__analysis">
          <Box className="analysis__box">
            <Box className="box__content">
              <Typography className="box__number">
                {Math.ceil(countTotalBooking)}
              </Typography>
              <Typography className="box__title">Booking</Typography>
            </Box>

            <Box className="box__content">
              <Typography className="box__number">
                {Math.ceil(countTotalBookingCanceled)}
              </Typography>
              <Typography className="box__title">Canceled Booking</Typography>
            </Box>

            <Box className="box__content">
              <Typography className="box__number">
                {Math.ceil(countTotalBookingAwaitingCheckIn)}
              </Typography>
              <Typography className="box__title">
                Booking Awaiting Check-in
              </Typography>
            </Box>

            <Box className="box__content">
              <Typography className="box__number">
                {Math.ceil(countTotalBookingAwaitingPayment)}
              </Typography>
              <Typography className="box__title">
                Booking Awaiting Payment
              </Typography>
            </Box>

            <Box className="box__content">
              <Typography className="box__number">
                {Math.ceil(countTotalReviews)}
              </Typography>
              <Typography className="box__title">Total Review</Typography>
            </Box>

            <Box className="box__content">
              <Typography className="box__number">
                {formatPrice(Math.ceil(countTotalRevenues))} VND
              </Typography>
              <Typography className="box__title">Total Revenue</Typography>
            </Box>
          </Box>
        </Box>

        <Box className="dashboard__chart">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              sx={{ color: themeColors.title, fontSize: 24, fontWeight: 700 }}
            >
              Booking & Revenue Chart with Month
            </Typography>
            <Button
              href={`${API_BASE_URL}${
                ApiUrl.PARTNER.ANALYSIS.EXPORT_DATA
              }?hotelID=${secureLocalStorage.getItem("hotelId")}`}
              sx={{
                bgcolor: "transparent",
                border: `1px solid ${themeColors.primary_600}`,
                color: themeColors.primary_600,
                p: "10px 40px",
                textTransform: "none",
                fontSize: 16,
                borderRadius: "8px",
                "&:hover": {
                  bgcolor: themeColors.bg_Disabled,
                },
              }}
            >
              Export
            </Button>
          </Box>

          <Box>
            <BarChart
              width={1350}
              height={500}
              data={dataChart}
              margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#82ca9d"
                width={70}
                tickFormatter={formatYAxis}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar yAxisId="left" dataKey="booking" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" />
            </BarChart>
          </Box>
        </Box>
      </BoxContainer>

      <FooterPartner />
    </>
  );
};

export default PartnerDashboardPage;
