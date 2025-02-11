import {
  Box,
  Button,
  Divider,
  Grid,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { LoadingButton } from "@mui/lab";
import { getBookingByAccountId } from "../../../../Home.Api";
import { themeColors } from "../../../../../../themes/schemes/PureLightThem";
import {
  calculateNights,
  formatDateMonthAndDay,
  formatDateWithWeekDay,
  formatPrice,
} from "../../../../../../utils/helper";
import { routes } from "../../../../../../routes";
import { URL_IMAGE } from "../../../../../../services/ApiUrl";
import { filterBookingCanceled } from "../../../../../../utils/filter";

const UserCanceled = () => {
  const navigate = useNavigate();
  const onTopRef = useRef(null);

  const [data, setData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const listbookingCanceled = filterBookingCanceled(data);

  const bookingsPerPage = 4;
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBooking = listbookingCanceled?.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );
  const totalPageBooking = Math.ceil(
    listbookingCanceled?.length / bookingsPerPage
  );

  const paginate = (event, value) => {
    event.preventDefault();
    setCurrentPage(value);
    if (onTopRef.current) {
      onTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const init = async () => {
    const res = await getBookingByAccountId(
      secureLocalStorage.getItem("accountId")
    );

    if (res) {
      setData(res);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      {data?.length > 0 ? (
        <Box
          sx={{ display: "flex", flexDirection: "column", gap: "20px" }}
          ref={onTopRef}
        >
          {currentBooking?.map((item) => (
            <Box
              key={item?.bookingID}
              sx={{
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "2opx",
                backgroundColor: themeColors.white,
                borderRadius: "8px",
                WebkitBoxShadow: themeColors.boxShadow,
                boxShadow: themeColors.boxShadow,
                "&:hover": {
                  boxShadow: themeColors.boxShadowHover,
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: "20px" }}
                >
                  <Typography
                    sx={{
                      fontSize: "20px",
                      fontWeight: 400,
                      color: themeColors.gray,
                      lineHeight: "20px",

                      "&:hover": {
                        cursor: "default",
                      },
                    }}
                  >
                    Booking No. 78945{item?.bookingID}
                  </Typography>
                  <span style={{ color: themeColors.gray }}>|</span>
                  <Typography
                    sx={{
                      fontSize: "16px",
                      color: themeColors.gray,
                      lineHeight: "20px",

                      "&:hover": {
                        cursor: "default",
                      },
                    }}
                  >
                    Booking Date: {formatDateWithWeekDay(item?.checkInDate)}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    color: themeColors.gray,
                    fontWeight: "bold",
                  }}
                >
                  {item?.status}
                </Typography>
              </Box>
              <Divider sx={{ margin: "15px 0", color: themeColors.gray }} />
              <Box
                onClick={() => {
                  secureLocalStorage.setItem("bookingId", item?.bookingID);
                  navigate(routes.home.bookingDetails);
                  document.documentElement.scrollTop = 0;
                }}
                sx={{
                  display: "flex",
                  gap: "20px",
                  cursor: "pointer",
                }}
              >
                <img
                  loading="lazy"
                  style={{
                    maxWidth: "230px",
                    minWidth: "230px",
                    maxHeight: "180px",
                    minHeight: "180px",
                    borderRadius: "8px",
                    opacity: 0.6,
                    objectFit: "cover",
                  }}
                  src={`${URL_IMAGE}${item?.hotel?.mainImage}`}
                  alt=""
                />
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flex: 1,
                      opacity: 0.6,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "20px",
                        lineHeight: "20px",
                        fontWeight: "bold",
                        color: themeColors.title,
                      }}
                    >
                      {item?.hotel?.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "24px",
                        lineHeight: "24px",
                        fontWeight: "bold",
                        color: themeColors.title,
                      }}
                    >
                      {formatPrice(Math.ceil(item?.totalPrice))} VND
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      flex: 1.2,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: themeColors.bkgPage,
                      padding: "30px 20px",
                      height: "100%",
                      borderRadius: "8px",
                      opacity: 0.6,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "18px",
                          lineHeight: "18px",
                          fontWeight: "bold",
                          color: themeColors.black,
                        }}
                      >
                        {formatDateMonthAndDay(item?.checkInDate)}{" "}
                        <span style={{ textAlign: "center" }}>- </span>
                        {formatDateMonthAndDay(item?.checkOutDate)}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "16px",
                          lineHeight: "16px",
                          color: themeColors.gray,
                        }}
                      >
                        {calculateNights(
                          item?.checkInDate,
                          item?.checkOutDate
                        ) <= 1
                          ? `${calculateNights(
                              item?.checkInDate,
                              item?.checkOutDate
                            )} night`
                          : `${calculateNights(
                              item?.checkInDate,
                              item?.checkOutDate
                            )} nights`}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "18px",
                          lineHeight: "18px",
                          fontWeight: "bold",
                          color: themeColors.black,
                        }}
                      >
                        {item?.room?.typeOfRoom}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "18px",
                          lineHeight: "18px",
                          fontWeight: "bold",
                          color: themeColors.black,
                        }}
                      >
                        {item?.account?.profile?.fullName}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "16px",
                          lineHeight: "16px",
                          color: themeColors.gray,
                        }}
                      >
                        {item?.numberOfGuest <= 1
                          ? `${item?.numberOfGuest} guest`
                          : `${item?.numberOfGuest} guests`}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  mt: "20px",
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                }}
              >
                <Button
                  onClick={() => {
                    secureLocalStorage.setItem("hotelId", item?.hotel?.hotelID);
                    secureLocalStorage.setItem("roomId", item?.room?.roomID);
                    secureLocalStorage.setItem(
                      "hotelLocation",
                      item?.hotelAddress?.city
                    );
                    navigate(routes.home.createBooking);
                    document.documentElement.scrollTop = 0;
                  }}
                  sx={{
                    textTransform: "none",
                    padding: "10px 30px",
                    backgroundColor: themeColors.primary_Default,
                    color: themeColors.white,
                    borderRadius: "8px",
                    "&:hover": {
                      cursor: "pointer",
                      backgroundColor: themeColors.primary_600,
                    },
                  }}
                >
                  Book Again
                </Button>
              </Box>
            </Box>
          ))}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: "20px",
            }}
          >
            {listbookingCanceled?.length > 0 && (
              <Grid item xs={6} sx={{ alignItems: "center" }}>
                <label>
                  <b>
                    Showing {currentPage} of {totalPageBooking}{" "}
                    {totalPageBooking > 1 ? "pages" : "page"}
                  </b>
                </label>
              </Grid>
            )}
            <Stack sx={{ alignItems: "center" }}>
              {listbookingCanceled?.length > 0 && (
                <Pagination
                  color="standard"
                  variant="outlined"
                  defaultPage={1}
                  count={totalPageBooking}
                  page={currentPage}
                  onChange={paginate}
                  size="medium"
                  showFirstButton
                  showLastButton
                />
              )}
            </Stack>

            {listbookingCanceled?.length === 0 && (
              <Box
                width="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                p="5px 0"
              >
                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: 400,
                  }}
                >
                  No booking found!
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      ) : (
        <Box
          width="100%"
          p="20px 60px"
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
    </>
  );
};

export default UserCanceled;
