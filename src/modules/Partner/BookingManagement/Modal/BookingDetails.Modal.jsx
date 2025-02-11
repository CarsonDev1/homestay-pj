import React, { useEffect, useState } from "react";
import { themeColors } from "../../../../themes/schemes/PureLightThem";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { AssetImages } from "../../../../utils/images";
import {
  calculateNights,
  formatDate,
  formatPhoneNumber,
  formatPrice,
} from "../../../../utils/helper";
import { URL_IMAGE } from "../../../../services/ApiUrl";
import {
  confirmBookingToAwaitingPayment,
  confirmBookingToComplete,
} from "../../Partner.Api";
import ToastComponent from "../../../../components/Toast/Toast.Component";

const styles = {
  title: {
    color: themeColors.title,
    fontSize: 22,
    fontWeight: 700,
  },
  label: {
    color: themeColors.title,
    fontSize: 20,
    fontWeight: 700,
  },
  box: {
    width: "calc(100% / 3)",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  data: {
    p: "3px 14px",
    bgcolor: "transparent",
    color: themeColors.black,
    fontSize: 16,
    border: `1px solid ${themeColors.gray}`,
    borderRadius: "6px",
    textAlign: "justify",
    display: "-webkit-box",
    overflow: "hidden",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",
    transition: "-webkit-line-clamp 0.1s",
  },
  subLabel: {
    fontSize: 17,
    fontWeight: 700,
  },
};

const BookingDetailsModal = ({ children, data }) => {
  const id = data?.id;
  const statusBooking = data?.status;
  const nights = calculateNights(data?.checkInDate, data?.checkOutDate);

  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(data?.images[0]?.image);

  const [displaySuccess, setDisplaySuccess] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [displayServerError, setDisplayServerError] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeImage = (img) => {
    setImage(img);
  };

  const handleConfirmBookingToAwaitingPayment = async () => {
    try {
      let formData = new FormData();

      formData.append("bookingID", id);

      const res = await confirmBookingToAwaitingPayment(formData);

      if (res.status === 200) {
        setDisplaySuccess(true);
      } else {
        setDisplayError(true);
      }
    } catch (error) {
      setDisplayServerError(true);
    }
  };

  const handleConfirmBookingToComplete = async () => {
    try {
      let formData = new FormData();

      formData.append("bookingID", id);

      const res = await confirmBookingToComplete(formData);

      if (res.status === 200) {
        setDisplaySuccess(true);
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        setDisplayError(true);
      }
    } catch (error) {
      setDisplayServerError(true);
    }
  };

  useEffect(() => {
    let timeOut;
    if (displayError) {
      timeOut = setTimeout(() => {
        setDisplayError(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayError]);

  useEffect(() => {
    let timeOut;
    if (displayServerError) {
      timeOut = setTimeout(() => {
        setDisplayServerError(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayServerError]);

  useEffect(() => {
    let timeOut;
    if (displaySuccess) {
      timeOut = setTimeout(() => {
        setDisplaySuccess(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displaySuccess]);

  useEffect(() => {}, [open, data]);

  return (
    <>
      {React.cloneElement(children, {
        onClick: handleOpen,
      })}
      <ToastComponent
        open={displayError}
        close={() => setDisplayError(false)}
        title="Error"
        message="Confirm booking fail!"
        type="error"
      />

      <ToastComponent
        open={displayServerError}
        close={() => setDisplayServerError(false)}
        title="Error"
        message="Server maintenance is underway. Please try again later!"
        type="error"
      />

      <ToastComponent
        open={displaySuccess}
        close={() => setDisplaySuccess(false)}
        title="Success"
        message="Confirm booking successfully!"
        type="success"
      />

      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{ color: themeColors.title, fontSize: 24, fontWeight: 700 }}
          >
            Booking Details -{" "}
            <span
              style={{
                color:
                  statusBooking === "Awaiting Check-in"
                    ? themeColors.text_Link
                    : statusBooking === "Awaiting Payment"
                    ? themeColors.status_Secondary
                    : statusBooking === "Completed"
                    ? themeColors.status_Primary
                    : themeColors.button_Secondary,
              }}
            >
              {statusBooking}
            </span>
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{ bgcolor: themeColors.bgTitle, p: "20px" }}
        >
          <Stack direction="column" gap="2rem">
            <Box
              sx={{
                bgcolor: themeColors.white,
                border: `1px solid ${themeColors.black}`,
                borderRadius: "8px",
                p: "15px",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                boxShadow: themeColors.boxShadow,
              }}
            >
              <Box display="flex" flexDirection="column" gap="1.5rem">
                <Typography sx={styles.title}>Room Information</Typography>
                <Box display="flex" flexDirection="column" gap="1rem">
                  <Typography sx={styles.label}>Images</Typography>
                  <img
                    src={`${URL_IMAGE}${image}`}
                    alt=""
                    style={{
                      width: "100%",
                      minHeight: "500px",
                      maxHeight: "500px",
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                  />

                  {data?.images?.length > 1 && (
                    <Box display="flex" gap="1rem" width="100%">
                      {data?.images?.map((img, index) => (
                        <Box
                          key={index}
                          width="20%"
                          height="100px"
                          onClick={() => handleChangeImage(img?.image)}
                          sx={{
                            borderRadius: "8px",
                            transition: "all .2s linear",
                            "&:hover": {
                              cursor: "pointer",
                              boxShadow: themeColors.boxShadow,
                              transform: "scale(1.1)",
                            },
                          }}
                        >
                          <img
                            src={`${URL_IMAGE}${img?.image}`}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: "8px",
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>

                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  gap="2rem"
                >
                  <Box sx={styles.box}>
                    <Typography sx={styles.label}>Type of Room</Typography>
                    <Box sx={styles.data}>{data?.typeRoom}</Box>
                  </Box>

                  <Box sx={styles.box}>
                    <Typography sx={styles.label}>Number Capacity</Typography>
                    <Box sx={styles.data}>
                      {data?.numberCapacity <= 1
                        ? `${data?.numberCapacity} person`
                        : `${data?.numberCapacity} people`}
                    </Box>
                  </Box>

                  <Box sx={styles.box}>
                    <Typography sx={styles.label}>Bed</Typography>
                    <Box sx={styles.data}>
                      {data?.numberBed <= 1
                        ? `${data?.numberBed} x ${data?.typeOfBed} Bed`
                        : `${data?.numberBed} x ${data?.typeOfBed} Beds`}
                    </Box>
                  </Box>
                </Box>

                <Box display="flex" flexDirection="column" gap="1rem">
                  <Typography sx={styles.label}>Amenities</Typography>
                  {data?.amenities?.map((service, index) => (
                    <Box
                      key={index}
                      display="flex"
                      flexDirection="column"
                      gap="1rem"
                    >
                      <Typography sx={styles.subLabel}>
                        {service?.serviceName}
                      </Typography>

                      <Box
                        display="flex"
                        alignItems="center"
                        flexWrap="wrap"
                        gap="1.5rem"
                      >
                        {service?.roomSubServices?.map((subService, index) => (
                          <Box
                            key={index}
                            width="31%"
                            display="flex"
                            alignItems="center"
                            gap=".5rem"
                          >
                            <img
                              src={AssetImages.ICONS.CHECKED}
                              alt=""
                              style={{ width: 26, height: 26 }}
                            />
                            <Typography sx={{ fontSize: 16 }}>
                              {subService?.subServiceName}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                bgcolor: themeColors.white,
                border: `1px solid ${themeColors.black}`,
                borderRadius: "8px",
                p: "15px",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                boxShadow: themeColors.boxShadow,
              }}
            >
              <Box display="flex" flexDirection="column" gap="1.5rem">
                <Typography sx={styles.title}>Booker's Information</Typography>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  gap="2rem"
                >
                  <Box sx={styles.box}>
                    <Typography sx={styles.label}>Booker's Name</Typography>
                    <Box sx={styles.data}>{data?.bookerName}</Box>
                  </Box>

                  <Box sx={styles.box}>
                    <Typography sx={styles.label}>Booker's Phone</Typography>
                    <Box sx={styles.data}>{formatPhoneNumber(data?.phone)}</Box>
                  </Box>

                  <Box sx={styles.box}>
                    <Typography sx={styles.label}>
                      Booked Room Quantity
                    </Typography>
                    <Box sx={styles.data}>
                      {data?.bookedRoomNumber <= 1
                        ? `${data?.bookedRoomNumber} room`
                        : `${data?.bookedRoomNumber} rooms`}
                    </Box>
                  </Box>
                </Box>

                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  gap="2rem"
                >
                  <Box sx={styles.box}>
                    <Typography sx={styles.label}>Check-in Date</Typography>
                    <Box sx={styles.data}>{formatDate(data?.checkInDate)}</Box>
                  </Box>
                  <Box sx={styles.box}>
                    <Typography sx={styles.label}>Check-out Date</Typography>
                    <Box sx={styles.data}>{formatDate(data?.checkOutDate)}</Box>
                  </Box>
                  <Box sx={styles.box}>
                    <Typography sx={styles.label}>Number of Guest</Typography>
                    <Box sx={styles.data}>
                      {data?.numberOfGuest <= 1
                        ? `${data?.numberOfGuest} person`
                        : `${data?.numberOfGuest} people`}
                    </Box>
                  </Box>
                </Box>

                {data?.reasonCancel && (
                  <Box display="flex" flexDirection="column" gap="1rem">
                    <Typography sx={styles.label}>Reason Canceled</Typography>
                    <Box sx={styles.data}>{data?.reasonCancel}</Box>
                  </Box>
                )}
              </Box>
            </Box>

            <Box
              sx={{
                bgcolor: themeColors.white,
                border: `1px solid ${themeColors.black}`,
                borderRadius: "8px",
                p: "15px",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                boxShadow: themeColors.boxShadow,
              }}
            >
              <Box display="flex" flexDirection="column" gap="1.5rem">
                <Typography sx={styles.title}>Price Details</Typography>
                <Box display="flex" alignItems="flex-start" gap="2rem">
                  <Box
                    flex={1}
                    display="flex"
                    flexDirection="column"
                    gap="1rem"
                  >
                    <Typography sx={styles.label}>Each Room</Typography>
                    <Box sx={styles.data}>
                      {formatPrice(Math.ceil(data?.unitPrice))} VND
                    </Box>
                  </Box>

                  <Box
                    flex={1}
                    display="flex"
                    flexDirection="column"
                    gap="1rem"
                  >
                    <Typography sx={styles.label}>
                      Total {nights > 1 ? `Nights` : `Night`} ({nights})
                    </Typography>
                    <Box sx={styles.data}>
                      {formatPrice(Math.ceil(data?.unitPrice * nights))} VND
                    </Box>
                  </Box>

                  <Box
                    flex={1}
                    display="flex"
                    flexDirection="column"
                    gap="1rem"
                  >
                    <Typography sx={styles.label}>
                      Booked {data?.bookedRoomNumber > 1 ? `Rooms` : `Room`} (
                      {data?.bookedRoomNumber})
                    </Typography>
                    <Box sx={styles.data}>
                      {formatPrice(
                        Math.ceil(data?.unitPrice * data?.bookedRoomNumber)
                      )}{" "}
                      VND
                    </Box>
                  </Box>
                </Box>

                <Box display="flex" flexDirection="column" gap="1rem">
                  <Typography sx={styles.label}>Total Price Room</Typography>
                  <Box sx={styles.data}>
                    {formatPrice(
                      Math.ceil(
                        data?.unitPrice * data?.bookedRoomNumber * nights
                      )
                    )}{" "}
                    VND
                  </Box>
                </Box>

                <Box display="flex" alignItems="flex-start" gap="2rem">
                  <Box
                    flex={1}
                    display="flex"
                    flexDirection="column"
                    gap="1rem"
                  >
                    <Typography sx={styles.label}>Service Fee</Typography>
                    <Box sx={styles.data}>
                      {formatPrice(
                        Math.ceil(
                          data?.unitPrice *
                            data?.bookedRoomNumber *
                            nights *
                            0.1
                        )
                      )}{" "}
                      VND
                    </Box>
                  </Box>

                  <Box
                    flex={1}
                    display="flex"
                    flexDirection="column"
                    gap="1rem"
                  >
                    <Typography sx={styles.label}>Taxes Price</Typography>
                    <Box sx={styles.data}>
                      {formatPrice(Math.ceil(data?.taxesPrice))} VND
                    </Box>
                  </Box>

                  {data?.voucher && (
                    <Box
                      flex={1}
                      display="flex"
                      flexDirection="column"
                      gap="1rem"
                    >
                      <Typography sx={styles.label}>Voucher Price</Typography>
                      <Box
                        sx={{
                          p: "8px 14px",
                          bgcolor: "transparent",
                          color: themeColors.button_Secondary,
                          fontSize: 16,
                          border: `1px solid ${themeColors.gray}`,
                          borderRadius: "6px",
                          textAlign: "justify",
                        }}
                      >
                        -{" "}
                        {formatPrice(
                          Math.ceil(
                            (data?.unitPrice * data?.bookedRoomNumber * nights +
                              data?.taxesPrice) *
                              (data?.voucher?.discount / 100)
                          )
                        )}{" "}
                        VND
                      </Box>
                    </Box>
                  )}
                </Box>

                <Box display="flex" flexDirection="column" gap="1rem">
                  <Typography sx={styles.label}>Total Price</Typography>
                  <Box sx={styles.data}>
                    {formatPrice(Math.ceil(data?.totalPrice))} VND
                  </Box>
                </Box>
              </Box>
            </Box>
          </Stack>
        </DialogContent>

        {statusBooking === "Awaiting Check-in" ||
        statusBooking === "Awaiting Payment" ? (
          <DialogActions sx={{ justifyContent: "space-around" }}>
            <Button
              onClick={handleClose}
              sx={{
                bgcolor: "transparent",
                color: themeColors.primary_600,
                p: "5px 40px",
                border: `1px solid ${themeColors.primary_600}`,
                borderRadius: "8px",
                textTransform: "none",
                fontSize: 16,
                "&:hover": {
                  bgcolor: themeColors.bgTitle,
                },
              }}
            >
              Close
            </Button>

            <Button
              onClick={
                statusBooking === "Awaiting Check-in"
                  ? handleConfirmBookingToAwaitingPayment
                  : handleConfirmBookingToComplete
              }
              sx={{
                bgcolor: themeColors.primary_Default,
                color: themeColors.white,
                p: "5px 40px",
                borderRadius: "8px",
                textTransform: "none",
                fontSize: 16,
                "&:hover": {
                  bgcolor: themeColors.primary_600,
                },
              }}
            >
              Confirm
            </Button>
          </DialogActions>
        ) : (
          <DialogActions sx={{ justifyContent: "center" }}>
            <Button
              onClick={handleClose}
              sx={{
                bgcolor: "transparent",
                color: themeColors.primary_600,
                p: "5px 40px",
                border: `1px solid ${themeColors.primary_600}`,
                borderRadius: "8px",
                textTransform: "none",
                fontSize: 16,
                "&:hover": {
                  bgcolor: themeColors.bgTitle,
                },
              }}
            >
              Close
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};

export default BookingDetailsModal;
