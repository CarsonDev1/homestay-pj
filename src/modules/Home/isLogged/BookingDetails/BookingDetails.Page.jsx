import React, { useEffect, useRef, useState } from "react";
import "./BookingDetails.Style.scss";
import HeaderUser from "../../../../layouts/Header/User/HeaderUser";
import FooterCustomer from "../../../../layouts/Footer/Customer/FooterCustomer";
import BoxContainer from "../../../../components/Box/Box.Container";
import {
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { themeColors } from "../../../../themes/schemes/PureLightThem";
import {
  calculateNights,
  compareDates,
  formatDateWithWeekDay,
  formatPhoneNumber,
  formatPrice,
} from "../../../../utils/helper";
import {
  AddPhotoAlternateOutlined,
  ChevronLeft,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import CancelBookingModal from "../Modal/CancelBooking/CancelBooking.Modal";
import { createFeedback, getBookingDetails } from "../../Home.Api";
import secureLocalStorage from "react-secure-storage";
import { URL_IMAGE } from "../../../../services/ApiUrl";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../../routes";
import ToastComponent from "../../../../components/Toast/Toast.Component";
import { LoadingButton } from "@mui/lab";

const BookingDetailsPage = () => {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const [data, setData] = useState({});
  const [fetchData, setFetchData] = useState(false);

  const [image, setImage] = useState("");
  const [images, setImages] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState("");

  const [isRoomExpanded, setIsRoomExpanded] = useState(false);
  const [isRoomOpened, setIsRoomOpened] = useState(false);

  const [disabledButton, setDisabledButton] = useState(false);

  const [displayEmptyRating, setDisplayEmptyRating] = useState(false);
  const [displayMaxLength, setDisplayMaxLength] = useState(false);
  const [displayServerError, setDisplayServerError] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);

  const handleRoomPriceClicked = () => {
    setIsRoomExpanded(!isRoomExpanded);
    setIsRoomOpened(!isRoomOpened);
  };

  const handleUploadImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setImages(file);

      const reader = new FileReader();

      reader.onloadend = () => {
        setImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleRatingChange = (e) => {
    setRating(Number(e.target.value));
  };

  const handleReviewsChange = (e) => {
    setReviews(e.target.value);
  };

  const init = async () => {
    const res = await getBookingDetails(
      secureLocalStorage.getItem("bookingId")
    );

    if (res) {
      setData(res);
    }
  };

  const handleReviewHotel = async () => {
    setDisabledButton(true);
    if (rating === 0) {
      setDisplayEmptyRating(true);
      setDisabledButton(false);
    } else if (reviews.trim().length < 1 || reviews.trim().length > 300) {
      setDisplayMaxLength(true);
      setDisabledButton(false);
    } else {
      try {
        let formData = new FormData();

        if (images !== null) {
          formData.append("Image", images);
        }
        formData.append("BookingID", secureLocalStorage.getItem("bookingId"));
        formData.append("Rating", rating);
        formData.append("Description", reviews);

        const response = await createFeedback(formData);

        if (response.status === 200) {
          setDisplaySuccess(true);
          setTimeout(() => {
            setDisabledButton(false);
            navigate(routes.home.myBooking);
            document.documentElement.scrollTop = 0;
          }, 3000);
        } else {
          setDisplayError(true);
          setDisabledButton(false);
        }
      } catch (error) {
        setDisplayServerError(true);
        setDisabledButton(false);
      }
    }
  };

  const nights = calculateNights(data?.checkInDate, data?.checkOutDate);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setFetchData(true);
    }, 5000);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

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

  useEffect(() => {
    let timeOut;
    if (displayEmptyRating) {
      timeOut = setTimeout(() => {
        setDisplayEmptyRating(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayEmptyRating]);

  useEffect(() => {
    let timeOut;
    if (displayMaxLength) {
      timeOut = setTimeout(() => {
        setDisplayMaxLength(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayMaxLength]);

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

  return (
    <>
      <HeaderUser />

      <ToastComponent
        open={displayEmptyRating}
        close={() => setDisplayEmptyRating(false)}
        title="Error"
        message="You must rate how many stars for your experience in this hotel before send!"
        type="error"
      />

      <ToastComponent
        open={displayMaxLength}
        close={() => setDisplayMaxLength(false)}
        title="Error"
        message="Your review must be between 1 to 300 characters!"
        type="error"
      />

      <ToastComponent
        open={displayError}
        close={() => setDisplayError(false)}
        title="Error"
        message="Review fail!"
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
        message="Review successfully!"
        type="success"
      />

      {fetchData ? (
        <>
          <Box
            sx={{
              bgcolor: themeColors.bkgPage,
              p: "20px 60px 0",
            }}
          >
            <Button
              onClick={() => navigate(routes.home.myAccount)}
              sx={{
                color: themeColors.primary_Default,
                textTransform: "none",
                borderRadius: "4px",
                fontSize: 16,
                "&:hover": {
                  bgcolor: "transparent",
                  textDecoration: "underline",
                },
              }}
              startIcon={
                <ChevronLeft
                  sx={{
                    color: themeColors.primary_Default,
                  }}
                />
              }
            >
              Back
            </Button>
          </Box>

          <BoxContainer property="booking-details__container">
            <Box className="booking-details__left">
              <Box className="detailed__booking-info">
                <Typography
                  className="booking-info__status"
                  sx={{
                    color:
                      data?.status === "Awaiting Payment"
                        ? themeColors.status_Secondary
                        : data?.status === "Awaiting Check-in"
                        ? themeColors.text_Link
                        : data?.status === "Completed"
                        ? themeColors.status_Primary
                        : themeColors.button_Secondary,
                  }}
                >
                  {data?.status}
                </Typography>

                {data?.status === "Canceled" && (
                  <Typography
                    sx={{
                      color: themeColors.gray,
                      fontSize: 17,
                    }}
                  >
                    Reason canceled:{" "}
                    <span style={{ fontWeight: 400, color: themeColors.black }}>
                      {data?.resaonCacle}
                    </span>
                  </Typography>
                )}

                {data?.room?.typeOfRoom && (
                  <Typography className="detailed__title">
                    {data?.room?.typeOfRoom}
                  </Typography>
                )}

                {data?.checkInDate && data?.checkOutDate && (
                  <Box className="booking-info__date">
                    {data?.checkInDate ? (
                      <Box className="date__date">
                        <Typography className="date__label">
                          Check-in
                        </Typography>
                        <Typography className="date__data">
                          {formatDateWithWeekDay(data?.checkInDate)}
                        </Typography>
                      </Box>
                    ) : null}

                    {calculateNights(data?.checkInDate, data?.checkOutDate) ? (
                      <Box>
                        <Typography>
                          {calculateNights(
                            data?.checkInDate,
                            data?.checkOutDate
                          ) === 1
                            ? `${calculateNights(
                                data?.checkInDate,
                                data?.checkOutDate
                              )} night`
                            : `${calculateNights(
                                data?.checkInDate,
                                data?.checkOutDate
                              )} nights`}
                        </Typography>
                      </Box>
                    ) : null}

                    {data?.checkOutDate ? (
                      <Box className="date__date">
                        <Typography className="date__label">
                          Check-out
                        </Typography>
                        <Typography className="date__data">
                          {formatDateWithWeekDay(data?.checkOutDate)}
                        </Typography>
                      </Box>
                    ) : null}
                  </Box>
                )}

                <Divider sx={{ bgcolor: themeColors.gray }} />

                <Box className="detailed__information">
                  <Typography className="information__label">
                    {data?.numberOfRoom <= 1 ? "Room" : "Rooms"}
                  </Typography>
                  <Typography className="information__data">
                    {data?.numberOfRoom}
                  </Typography>
                </Box>

                <Divider sx={{ bgcolor: themeColors.gray }} />

                <Box className="detailed__information">
                  <Typography className="information__label">
                    Guests Name
                  </Typography>
                  <Typography className="information__data">
                    {data?.bookingAccount?.profile?.fullName}
                  </Typography>
                </Box>

                {data?.status === "Awaiting Check-in" &&
                  compareDates(data?.checkInDate) && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: "1rem",
                      }}
                    >
                      <CancelBookingModal>
                        <Button
                          sx={{
                            bgcolor: themeColors.button_Secondary,
                            color: themeColors.white,
                            p: "10px 35px",
                            textTransform: "none",
                            borderRadius: "12px",
                            "&:hover": {
                              bgcolor: themeColors.button_SecondaryHover,
                            },
                          }}
                        >
                          Cancel Booking
                        </Button>
                      </CancelBookingModal>
                    </Box>
                  )}
              </Box>

              <Box className="detailed__contact-info">
                <Typography className="detailed__title">
                  Contact Info
                </Typography>

                <Box className="detailed__information">
                  <Typography className="information__label">Email</Typography>
                  <Typography className="information__data">
                    {data?.bookingAccount?.email}
                  </Typography>
                </Box>

                <Box className="detailed__information">
                  <Typography className="information__label">
                    Contact Number
                  </Typography>
                  <Typography className="information__data">
                    {formatPhoneNumber(data?.bookingAccount?.phone)}
                  </Typography>
                </Box>
              </Box>

              {data?.status === "Completed" &&
                data?.feedbacks?.length === 0 && (
                  <Box className="detailed__form-review">
                    <Typography className="detailed__title">
                      Your Review
                    </Typography>
                    <Box
                      onClick={handleUploadImage}
                      sx={{
                        width: "100%",
                        height: "auto",
                        border: "1px dashed #bbbbbf",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "5px",
                        p: "5px",
                        borderRadius: "4px",
                        "&:hover": {
                          cursor: "pointer",
                        },
                      }}
                    >
                      {image ? (
                        <img
                          loading="lazy"
                          src={image}
                          alt="Uploaded"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "8px",
                            boxShadow: themeColors.boxShadow,
                          }}
                        />
                      ) : (
                        <>
                          <AddPhotoAlternateOutlined />
                          <Typography sx={{ fontSize: "16px" }}>
                            Add Image
                          </Typography>
                        </>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        style={{ display: "none" }}
                        onChange={handleFileInputChange}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <Typography>Rating:</Typography>
                      <Rating
                        value={rating}
                        onChange={handleRatingChange}
                        size="medium"
                      />
                    </Box>
                    <textarea
                      onChange={handleReviewsChange}
                      rows={10}
                      value={reviews}
                      style={{
                        padding: "8px 14px",
                        fontSize: 16,
                        resize: "none",
                        borderRadius: "6px",
                      }}
                    ></textarea>

                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      position="relative"
                    >
                      <Button
                        onClick={handleReviewHotel}
                        sx={{
                          color: themeColors.white,
                          bgcolor: themeColors.primary_Default,
                          p: "8px 40px",
                          textTransform: "none",
                          fontSize: 16,
                          borderRadius: "8px",
                          "&:hover": {
                            bgcolor: themeColors.primary_600,
                          },
                          "&:disabled": {
                            bgcolor: themeColors.bg_Disabled,
                            color: themeColors.text_Link,
                          },
                        }}
                        disabled={disabledButton}
                      >
                        Send
                      </Button>
                    </Box>
                  </Box>
                )}
              {data?.feedbacks?.length !== 0 && (
                <Box
                  sx={{
                    bgcolor: themeColors.white,
                    p: "20px",
                    display: "flex",
                    borderRadius: "8px",
                    boxShadow: themeColors.boxShadow,
                  }}
                >
                  <Typography
                    sx={{
                      color: themeColors.black,
                      m: "auto",
                      fontSize: 16,
                    }}
                  >
                    You have already rated this hotel.
                  </Typography>
                </Box>
              )}
            </Box>

            {data?.room?.hotel &&
            data?.room?.hotel?.parnerAccount &&
            data?.room ? (
              <Box className="booking-details__right">
                <Box className="detailed__hotel">
                  <img
                    loading="lazy"
                    src={`${URL_IMAGE}${data?.room?.hotel?.mainImage}`}
                    alt=""
                    style={{
                      width: "162px",
                      minHeight: "150px",
                      maxHeight: "150px",
                      borderRadius: "6px",
                    }}
                  />
                  <Box
                    sx={{
                      minHeight: "150px",
                      maxHeight: "150px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <Typography className="detailed__sub-title">
                      {data?.room?.hotel?.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 16,
                        display: "-webkit-box",
                        overflow: "hidden",
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: "vertical",
                        transition: "-webkit-line-clamp 0.1s",
                        userSelect: "none",
                      }}
                    >
                      {data?.room?.hotel?.hotelAddress?.address}
                    </Typography>
                  </Box>
                </Box>

                <Box className="detailed__contact--room">
                  {data?.room?.hotel?.parnerAccount?.phone ? (
                    <Box className="contact--room__information">
                      <Typography className="detailed__sub-title">
                        Call Hotel
                      </Typography>
                      <Typography>
                        {formatPhoneNumber(
                          data?.room?.hotel?.parnerAccount?.phone
                        )}
                      </Typography>
                    </Box>
                  ) : null}

                  <Divider sx={{ bgcolor: themeColors.gray }} />

                  {data?.room?.hotel?.parnerAccount?.email ? (
                    <Box className="contact--room__information">
                      <Typography className="detailed__sub-title">
                        Email Hotel
                      </Typography>
                      <Typography>
                        {data?.room?.hotel?.parnerAccount?.email}
                      </Typography>
                    </Box>
                  ) : null}

                  <Divider sx={{ bgcolor: themeColors.gray }} />

                  <Box className="contact--room__information">
                    {data?.room?.typeOfRoom ? (
                      <Typography className="detailed__sub-title">
                        {data?.room?.typeOfRoom}
                      </Typography>
                    ) : null}

                    {data?.numberOfGuest ? (
                      <Box className="detailed__sub-information">
                        <Typography>Price For:</Typography>
                        <Typography>
                          {data?.numberOfGuest <= 1
                            ? `${data?.numberOfGuest} person`
                            : `${data?.numberOfGuest} people`}
                        </Typography>
                      </Box>
                    ) : null}

                    {data?.room?.numberOfBed && data?.room?.typeOfBed ? (
                      <Box className="detailed__sub-information">
                        <Typography>Bed:</Typography>
                        <Typography>
                          {data?.room?.numberOfBed <= 1
                            ? `${data?.room?.numberOfBed} ${data?.room?.typeOfBed} Bed`
                            : `${data?.room?.numberOfBed} ${data?.room?.typeOfBed} Beds`}
                        </Typography>
                      </Box>
                    ) : null}
                  </Box>
                </Box>

                <Box className="detailed__price">
                  <Typography className="detailed__sub-title">
                    Price Details
                  </Typography>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                    onClick={handleRoomPriceClicked}
                  >
                    <Typography onClick={handleRoomPriceClicked}>
                      Room
                    </Typography>
                    <IconButton
                      onClick={handleRoomPriceClicked}
                      sx={{
                        width: 24,
                        height: 24,
                        p: 0,
                        m: 0,
                        "&:hover": { bgcolor: "transparent" },
                      }}
                    >
                      {isRoomExpanded ? (
                        isRoomOpened ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )
                      ) : !isRoomOpened ? (
                        <ExpandMore />
                      ) : (
                        <ExpandLess />
                      )}
                    </IconButton>
                  </Box>

                  <Divider sx={{ bgcolor: themeColors.gray }} />

                  <Collapse in={isRoomOpened} timeout="auto" unmountOnExit>
                    <Stack direction="column" gap="1rem" ml="15%">
                      <Box className="detailed__sub-information">
                        <Typography>Each Room</Typography>
                        <Typography>
                          {data?.unitPrice
                            ? formatPrice(Math.ceil(data?.unitPrice))
                            : 0}{" "}
                          VND
                        </Typography>
                      </Box>

                      <Divider sx={{ bgcolor: themeColors.gray }} />

                      <Box className="detailed__sub-information">
                        <Typography>
                          Total {nights > 1 ? `Nights` : `Night`} ({nights})
                        </Typography>
                        <Typography>
                          {data?.unitPrice && nights
                            ? formatPrice(Math.ceil(data?.unitPrice * nights))
                            : 0}{" "}
                          VND
                        </Typography>
                      </Box>

                      <Divider sx={{ bgcolor: themeColors.gray }} />

                      <Box className="detailed__sub-information">
                        <Typography>
                          Booked Rooms ({data?.numberOfRoom})
                        </Typography>
                        <Typography>
                          {data?.unitPrice && data?.numberOfRoom
                            ? formatPrice(
                                Math.ceil(data?.unitPrice * data?.numberOfRoom)
                              )
                            : 0}{" "}
                          VND
                        </Typography>
                      </Box>

                      <Divider sx={{ bgcolor: themeColors.gray }} />

                      <Box className="detailed__sub-information">
                        <Typography>Total Price Room</Typography>
                        <Typography>
                          {data?.unitPrice && data?.numberOfRoom && nights
                            ? formatPrice(
                                Math.ceil(
                                  data?.unitPrice * data?.numberOfRoom * nights
                                )
                              )
                            : 0}{" "}
                          VND
                        </Typography>
                      </Box>

                      <Divider sx={{ bgcolor: themeColors.gray }} />
                    </Stack>
                  </Collapse>

                  <Box className="detailed__sub-information">
                    <Typography>Service Fee</Typography>
                    <Typography>
                      {data?.taxesPrice
                        ? formatPrice(
                            Math.ceil(
                              data?.unitPrice *
                                data?.numberOfRoom *
                                nights *
                                0.1
                            )
                          )
                        : 0}{" "}
                      VND
                    </Typography>
                  </Box>

                  <Divider sx={{ bgcolor: themeColors.gray }} />

                  <Box className="detailed__sub-information">
                    <Typography>Taxes</Typography>
                    <Typography>
                      {data?.taxesPrice
                        ? formatPrice(Math.ceil(data?.taxesPrice))
                        : 0}{" "}
                      VND
                    </Typography>
                  </Box>

                  {data?.voucher ? (
                    <>
                      <Divider sx={{ bgcolor: themeColors.gray }} />

                      <Box className="detailed__sub-information">
                        <Typography>Voucher</Typography>
                        <Typography
                          sx={{ color: themeColors.button_Secondary }}
                        >
                          -{" "}
                          {data?.unitPrice &&
                          data?.numberOfRoom &&
                          nights &&
                          data?.taxesPrice &&
                          data?.voucher?.discount
                            ? formatPrice(
                                Math.ceil(
                                  (data?.unitPrice *
                                    data?.numberOfRoom *
                                    nights +
                                    data?.taxesPrice +
                                    data?.unitPrice *
                                      data?.numberOfRoom *
                                      nights *
                                      0.1) *
                                    (data?.voucher?.discount / 100)
                                )
                              )
                            : 0}{" "}
                          VND
                        </Typography>
                      </Box>
                    </>
                  ) : null}

                  <Divider sx={{ bgcolor: themeColors.gray }} />

                  <Box className="detailed__sub-information">
                    <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
                      Total Price
                    </Typography>
                    <Typography
                      sx={{
                        color: themeColors.title,
                        fontSize: 24,
                        fontWeight: 700,
                      }}
                    >
                      {data?.totalPrice
                        ? formatPrice(Math.ceil(data?.totalPrice))
                        : 0}{" "}
                      VND
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ) : null}
          </BoxContainer>
        </>
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

      <FooterCustomer />
    </>
  );
};

export default BookingDetailsPage;
