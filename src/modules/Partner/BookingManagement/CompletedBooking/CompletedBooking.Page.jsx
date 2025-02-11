/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { themeColors } from "../../../../themes/schemes/PureLightThem";
import { formatDate, formatPrice } from "../../../../utils/helper";
import {
  Box,
  Button,
  Grid,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import BookingDetailsModal from "../Modal/BookingDetails.Modal";
import { filterBookingCompleted } from "../../../../utils/filter";
import { useDispatch } from "react-redux";
import { getAllBooking } from "../../Partner.Api";
import secureLocalStorage from "react-secure-storage";
import { LoadingButton } from "@mui/lab";

const styles = {
  titleTabel: {
    color: themeColors.title,
    fontSize: 18,
    fontWeight: 700,
    textAlign: "center",
  },
  cellTable: {
    color: themeColors.black,
    fontSize: 16,
  },
};

const CompletedBookingPage = () => {
  const dispatch = useDispatch();
  const onTopRef = useRef(null);

  const [data, setData] = useState([]);
  const [fetchData, setFetchData] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const listCompleted = filterBookingCompleted(data);

  const bookingsPerPage = 10;
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBooking = listCompleted?.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );
  const totalPageBooking = Math.ceil(listCompleted?.length / bookingsPerPage);

  const paginate = (event, value) => {
    event.preventDefault();
    setCurrentPage(value);
    if (onTopRef.current) {
      onTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const init = async () => {
    const res = await getAllBooking(
      secureLocalStorage.getItem("hotelId"),
      dispatch
    );

    if (res) {
      setData(res);
    }
  };

  useEffect(() => {
    init();
  }, [data]);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setFetchData(true);
    }, 5000);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  return (
    <>
      <Typography
        sx={{ color: themeColors.title, fontSize: 20, fontWeight: 700 }}
      >
        {listCompleted?.length <= 1
          ? `Total Booking: ${listCompleted?.length}`
          : `Total Bookings: ${listCompleted?.length}`}
      </Typography>

      <Box ref={onTopRef}>
        <TableContainer
          component={Paper}
          sx={{
            width: "auto",
            boxShadow: "none",
            border: "none",
            borderRadius: 0,
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background: themeColors.white,
                }}
              >
                <TableCell
                  sx={{
                    color: themeColors.title,
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  Type Room
                </TableCell>
                <TableCell
                  sx={{
                    color: themeColors.title,
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  Booker's Name
                </TableCell>
                <TableCell sx={styles.titleTabel}>
                  Booked Room Quantity
                </TableCell>
                <TableCell sx={styles.titleTabel}>Date Check-in</TableCell>
                <TableCell sx={styles.titleTabel}>Date Check-out</TableCell>
                <TableCell align="center" sx={styles.titleTabel}>
                  Total Price
                </TableCell>
                <TableCell align="center" sx={styles.titleTabel}>
                  Status
                </TableCell>
                <TableCell align="center" sx={styles.titleTabel}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {currentBooking?.map((booking) => (
                <TableRow
                  key={booking?.bookingID}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    sx={{
                      width: "20%",
                      color: themeColors.black,
                      fontSize: 16,
                    }}
                  >
                    <Typography
                      sx={{
                        width: "90%",
                        fontSize: 16,
                        display: "-webkit-box",
                        overflow: "hidden",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        transition: "-webkit-line-clamp 0.1s",
                        userSelect: "none",
                      }}
                    >
                      {booking?.room?.typeOfRoom}
                    </Typography>
                  </TableCell>
                  <TableCell sx={styles.cellTable}>
                    {booking?.profile?.fullName}
                  </TableCell>
                  <TableCell align="center" sx={styles.cellTable}>
                    {booking?.nubmerOfRoom}
                  </TableCell>
                  <TableCell align="center" sx={styles.cellTable}>
                    {formatDate(booking?.checkInDate)}
                  </TableCell>
                  <TableCell align="center" sx={styles.cellTable}>
                    {formatDate(booking?.checkOutDate)}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: themeColors.black,
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    {formatPrice(Math.ceil(booking?.totalPrice))} VND
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: themeColors.status_Primary,
                      fontSize: 16,
                      fontWeight: 700,
                    }}
                  >
                    {booking?.status}
                  </TableCell>
                  <TableCell sx={styles.cellTable}>
                    <BookingDetailsModal
                      data={{
                        id: booking?.bookingID,
                        status: booking?.status,
                        images: booking?.room?.roomImage,
                        typeRoom: booking?.room?.typeOfRoom,
                        numberCapacity: booking?.room?.numberCapacity,
                        numberBed: booking?.room?.numberBed,
                        typeOfBed: booking?.room?.typeOfBed,
                        amenities: booking?.room?.roomService,
                        bookerName: booking?.profile?.fullName,
                        phone: booking?.account?.phone,
                        bookedRoomNumber: booking?.nubmerOfRoom,
                        checkInDate: booking?.checkInDate,
                        checkOutDate: booking?.checkOutDate,
                        numberOfGuest: booking?.numberOfGuest,
                        unitPrice: booking?.unitPrice,
                        taxesPrice: booking?.taxesPrice,
                        totalPrice: booking?.totalPrice,
                        voucher: booking?.voucher,
                        reasonCancel: booking?.reasonCancle,
                      }}
                    >
                      <Button
                        sx={{
                          bgcolor: themeColors.primary_Default,
                          color: themeColors.white,
                          textTransform: "none",
                          fontSize: 16,
                          borderRadius: "10px",
                          p: "6px 20px",
                          "&:hover": {
                            bgcolor: themeColors.primary_600,
                          },
                        }}
                      >
                        View
                      </Button>
                    </BookingDetailsModal>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: "20px",
        }}
      >
        {listCompleted?.length > 0 && (
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
          {listCompleted?.length > 0 && (
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
        {listCompleted?.length === 0 && (
          <Box
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            p="5px 0"
          >
            {!fetchData ? (
              <>
                <LoadingButton
                  loading
                  variant="outlined"
                  sx={{ border: "0 !important" }}
                />
                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: 400,
                  }}
                >
                  Fetching data...
                </Typography>
              </>
            ) : (
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 400,
                }}
              >
                No booking found!
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </>
  );
};

export default CompletedBookingPage;
