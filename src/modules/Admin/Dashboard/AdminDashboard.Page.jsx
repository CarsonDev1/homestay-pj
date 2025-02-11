import React, { useEffect, useState } from "react";
import "./AdminDashboard.Style.scss";
import { Box, Button, Typography } from "@mui/material";
import {
  calculateTotalBookings,
  calculateTotalRevenuesAdmin,
  formatPrice,
} from "../../../utils/helper";
import { themeColors } from "../../../themes/schemes/PureLightThem";
import PieChartChart from "./PieChart/PieChart.Chart";
import LineChartChart from "./LineChart/LineChart.Chart";
import BarChartChart from "./BarChart/BarChart.Chart";
import TopUsers from "./TopUsers/TopUsers";
import { API_BASE_URL, ApiUrl } from "../../../services/ApiUrl";
import { useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";

const AdminDashboardPage = () => {
  const duration = 5000;
  const intervalTime = 50;

  const dataBookings = useSelector((state) => state.admin.listBookings);
  const dataRevenues = useSelector((state) => state.admin.listRevenues);
  const dataAccounts = useSelector((state) => state.admin.listAccounts);
  const dataTopUsers = useSelector((state) => state.admin.listUsers);
  const dataPost = useSelector((state) => state.admin.listPosts);

  const [fetchData, setFetchData] = useState(false);

  const [countBooking, setCountBooking] = useState(0);
  const [countRevenue, setCountRevenue] = useState(0);
  const [countAccount, setCountAccount] = useState(0);
  const [countPost, setCountPost] = useState(0);

  const listPostsApproved = dataPost?.filter(
    (post) => post?.status === "Approved"
  );
  const listAccountsActive = dataAccounts?.filter(
    (account) => account?.isActive
  );

  const totalBooking = calculateTotalBookings(dataBookings);
  const totalRevenue = calculateTotalRevenuesAdmin(dataRevenues);
  const totalAccount = listAccountsActive?.length;
  const totalPosts = listPostsApproved?.length;

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setFetchData(true);
    }, 3000);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  useEffect(() => {
    const incrementBooking = totalBooking / (duration / intervalTime);
    const intervalBooking = setInterval(() => {
      setCountBooking((prevCount) => {
        if (prevCount + incrementBooking >= totalBooking) {
          clearInterval(intervalBooking);
          return totalBooking;
        }
        return prevCount + incrementBooking;
      });
    }, intervalTime);

    const incrementRevenue = totalRevenue / (duration / intervalTime);
    const intervalRevenue = setInterval(() => {
      setCountRevenue((prevCount) => {
        if (prevCount + incrementRevenue >= totalRevenue) {
          clearInterval(intervalRevenue);
          return totalRevenue;
        }
        return prevCount + incrementRevenue;
      });
    }, intervalTime);

    const incrementAccount = totalAccount / (duration / intervalTime);
    const intervalAccount = setInterval(() => {
      setCountAccount((prevCount) => {
        if (prevCount + incrementAccount >= totalAccount) {
          clearInterval(intervalAccount);
          return totalAccount;
        }
        return prevCount + incrementAccount;
      });
    }, intervalTime);

    const incrementPost = totalPosts / (duration / intervalTime);
    const intervalPost = setInterval(() => {
      setCountPost((prevCount) => {
        if (prevCount + incrementPost >= totalPosts) {
          clearInterval(intervalAccount);
          return totalPosts;
        }
        return prevCount + incrementPost;
      });
    }, intervalTime);

    return () => {
      clearInterval(intervalBooking);
      clearInterval(intervalRevenue);
      clearInterval(intervalAccount);
      clearInterval(intervalPost);
    };
  }, [totalBooking, totalRevenue, totalAccount, totalPosts]);

  useEffect(() => {}, [dataBookings, dataRevenues, totalAccount, dataTopUsers]);

  return (
    <Box className="admin-dashboard__container">
      <Box className="admin-dashboard__analysis">
        <Typography className="analysis--title">Total</Typography>

        <Box className="analysis--box">
          <Box className="box--item">
            <Typography className="item--title">Bookings</Typography>
            <Typography className="item--data">
              {formatPrice(Math.ceil(countBooking))}
            </Typography>
          </Box>

          <Box className="box--item">
            <Typography className="item--title">Posts</Typography>
            <Typography className="item--data">
              {formatPrice(Math.ceil(countPost))}
            </Typography>
          </Box>

          <Box className="box--item">
            <Typography className="item--title">Registered Accounts</Typography>
            <Typography className="item--data">
              {formatPrice(Math.ceil(countAccount))}
            </Typography>
          </Box>

          <Box className="box--item">
            <Typography className="item--title">Revenues</Typography>
            <Typography className="item--data">
              {formatPrice(Math.ceil(countRevenue))} VND
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box className="admin-dashboard__chart">
        <Box className="line-chart">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              sx={{ color: themeColors.title, fontSize: 20, fontWeight: 700 }}
            >
              Total Revenues
            </Typography>
            <Button
              href={`${API_BASE_URL}${ApiUrl.ADMIN.EXPROT_DATA.EXPORT_TOTAL_REVENUE}`}
              sx={{
                bgcolor: "transparent",
                border: `1px solid ${themeColors.primary_600}`,
                color: themeColors.primary_600,
                p: "6px 20px",
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
            {fetchData ? (
              <LineChartChart data={dataRevenues} />
            ) : (
              <Box
                width="100%"
                p="20px 0"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <LoadingButton
                  loading
                  variant="outlined"
                  sx={{ border: "0 !important" }}
                />
                <Typography
                  sx={{
                    fontSize: 20,
                    fontWeight: 400,
                  }}
                >
                  Loading...
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Box className="pie-chart">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              sx={{ color: themeColors.title, fontSize: 20, fontWeight: 700 }}
            >
              Total Hotel Standard
            </Typography>
          </Box>

          <Box>
            {fetchData ? (
              <PieChartChart />
            ) : (
              <Box
                width="100%"
                p="20px 0"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <LoadingButton
                  loading
                  variant="outlined"
                  sx={{ border: "0 !important" }}
                />
                <Typography
                  sx={{
                    fontSize: 20,
                    fontWeight: 400,
                  }}
                >
                  Loading...
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Box className="admin-dashboard__chart">
        <Box className="top-users">
          <Typography
            sx={{ color: themeColors.title, fontSize: 20, fontWeight: 700 }}
          >
            Top 5 Users
          </Typography>
          <Box>
            {fetchData ? (
              <TopUsers data={dataTopUsers} />
            ) : (
              <Box
                width="100%"
                p="20px 0"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <LoadingButton
                  loading
                  variant="outlined"
                  sx={{ border: "0 !important" }}
                />
                <Typography
                  sx={{
                    fontSize: 20,
                    fontWeight: 400,
                  }}
                >
                  Loading...
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Box className="bar-chart">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              sx={{ color: themeColors.title, fontSize: 20, fontWeight: 700 }}
            >
              Total Bookings
            </Typography>
            <Button
              href={`${API_BASE_URL}${ApiUrl.ADMIN.EXPROT_DATA.EXPORT_TOTAL_BOOKING}`}
              sx={{
                bgcolor: "transparent",
                border: `1px solid ${themeColors.primary_600}`,
                color: themeColors.primary_600,
                p: "6px 20px",
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
            {fetchData ? (
              <BarChartChart data={dataBookings} />
            ) : (
              <Box
                width="100%"
                p="20px 0"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <LoadingButton
                  loading
                  variant="outlined"
                  sx={{ border: "0 !important" }}
                />
                <Typography
                  sx={{
                    fontSize: 20,
                    fontWeight: 400,
                  }}
                >
                  Loading...
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboardPage;
