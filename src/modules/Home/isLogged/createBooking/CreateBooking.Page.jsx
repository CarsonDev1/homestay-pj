/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import "./CreateBooking.Style.scss";
import BoxContainer from "../../../../components/Box/Box.Container";
import HeaderUser from "../../../../layouts/Header/User/HeaderUser";
import {
  Box,
  Button,
  Divider,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import FooterCustomer from "../../../../layouts/Footer/Customer/FooterCustomer";
import { AssetImages } from "../../../../utils/images";
import { themeColors } from "../../../../themes/schemes/PureLightThem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faPerson } from "@fortawesome/free-solid-svg-icons";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  calculateNights,
  formatPhoneNumber,
  formatPrice,
  renderStars,
} from "../../../../utils/helper";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../../routes";
import secureLocalStorage from "react-secure-storage";
import {
  checkRoomPrice,
  createBooking,
  getVoucherDetails,
  searchHotelByCity,
} from "../../Home.Api";
import { URL_IMAGE } from "../../../../services/ApiUrl";
import { useDispatch, useSelector } from "react-redux";
import {
  filterListHotelsHaveRoom,
  filterVoucherUnused,
} from "../../../../utils/filter";
import { saveListHotels } from "../../Home.Actions";
import { formatDate } from "date-fns";
import ToastComponent from "../../../../components/Toast/Toast.Component";

const CreateBookingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dateRangeRef = useRef(null);
  const roomGuestRef = useRef(null);

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const checkoutDate = currentDate.setDate(currentDate.getDate() + 1);

  const dataHotel = useSelector((state) => state.home.hotelDetails);
  const dataRoom = useSelector((state) => state.home.roomDetails);
  const dataAccount = useSelector((state) => state.home.profile);
  const dataVoucher = useSelector((state) => state.home.listVouchers);

  const [openDate, setOpenDate] = useState(false);
  const [priceRoom, setPriceRoom] = useState(null);
  const [openOptions, setOpenOptions] = useState(false);

  const [voucher, setVoucher] = useState("");
  const [voucherDiscount, setVoucherDiscount] = useState({});
  const [useVoucher, setUseVoucher] = useState(false);
  const [checkAcceptBooking, setCheckAcceptBooking] = useState(false);

  const [displayProfileEmpty, setDisplayProfileEmpty] = useState(false);

  const [displaySuccess, setDisplaySuccess] = useState(false);
  const [displayDuplicateDate, setDisplayDuplicateDate] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [displayServerError, setDisplayServerError] = useState(false);

  const [dates, setDates] = useState([
    {
      startDate: secureLocalStorage.getItem("checkInDate") || new Date(),
      endDate: secureLocalStorage.getItem("checkOutDate") || checkoutDate,
      key: "selection",
    },
  ]);

  const [options, setOptions] = useState({
    person: secureLocalStorage.getItem("numberGuest") || 1,
    room: secureLocalStorage.getItem("numberRoom") || 1,
  });

  const checkDisabledIncreasePerson = () => {
    if (options.room === 1 && options.person === dataRoom?.numberCapacity) {
      return true;
    } else if (
      options.room !== 1 &&
      options.person === dataRoom?.numberCapacity * options.room
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleOption = (option, operation) => {
    setOptions((prevOptions) => {
      let newOptions = { ...prevOptions };

      if (option === "room") {
        if (operation === "i") {
          newOptions.room += 1;
        } else if (operation === "d" && newOptions.room > 1) {
          newOptions.room -= 1;
        }
        // Update person count based on the new room count
        newOptions.person = Math.min(
          newOptions.person,
          dataRoom?.numberCapacity * newOptions.room
        );
      } else if (option === "person") {
        if (
          operation === "i" &&
          newOptions.person < dataRoom?.numberCapacity * newOptions.room
        ) {
          newOptions.person += 1;
        } else if (operation === "d" && newOptions.person > 1) {
          newOptions.person -= 1;
        }
      }

      // Save the new values to secureLocalStorage
      secureLocalStorage.setItem("numberGuest", newOptions.person);
      secureLocalStorage.setItem("numberRoom", newOptions.room);

      return newOptions;
    });
  };

  const dayNights = calculateNights(dates[0]?.startDate, dates[0]?.endDate);
  const serviceFee = priceRoom * dayNights * options.room * 0.1;
  const taxesPrice = priceRoom * dayNights * options.room * 0.05;
  const voucherPrice =
    (priceRoom * dayNights * options.room + taxesPrice + serviceFee) *
    (voucherDiscount?.discount / 100);
  const totalPrice = () => {
    if (voucherPrice) {
      return (
        priceRoom * dayNights * options.room +
        taxesPrice +
        serviceFee -
        voucherPrice
      );
    } else {
      return priceRoom * dayNights * options.room + taxesPrice + serviceFee;
    }
  };

  const handleDateChange = (ranges) => {
    setDates([ranges.selection]);
  };

  const handleCheckAcceptBookingChange = (e) => {
    setCheckAcceptBooking(e.target.checked);
  };

  const handleUseVoucher = () => {
    setUseVoucher(true);
    getVoucher();
  };

  const getVoucher = async () => {
    const result = await getVoucherDetails(voucher);

    if (result) {
      setVoucherDiscount(result);
    }
  };

  const handleBack = async () => {
    let formData = new FormData();

    formData.append("city", secureLocalStorage.getItem("hotelLocation"));

    const res = await searchHotelByCity(formData, dispatch);

    if (
      filterListHotelsHaveRoom(res).length !== 0 &&
      filterListHotelsHaveRoom(res)
    ) {
      saveListHotels(filterListHotelsHaveRoom(res));
      navigate(routes.home.listHotels);
      document.documentElement.scrollTop = 0;
    }
  };

  const init = async () => {
    let formData = new FormData();

    formData.append("roomID", secureLocalStorage.getItem("roomId"));
    formData.append(
      "CheckInDate",
      formatDate(dates[0]?.startDate, "yyyy-MM-dd")
    );
    formData.append(
      "CheckOutDate",
      formatDate(dates[0]?.endDate, "yyyy-MM-dd")
    );

    const result = await checkRoomPrice(formData);

    if (result.status === 200) {
      setPriceRoom(result.data.price);
    }
  };

  const handleUpdatePhone = async () => {
    if (
      !dataAccount?.profile?.fullName ||
      !dataAccount?.email ||
      !dataAccount?.phone
    ) {
      setCheckAcceptBooking(!checkAcceptBooking);
      setDisplayProfileEmpty(true);
      setTimeout(() => {
        navigate(routes.home.myAccount);
        document.documentElement.scrollTop = 0;
      }, 3000);
    }
  };

  const handleCreateBooking = async () => {
    setCheckAcceptBooking(!checkAcceptBooking);
    try {
      let formData = new FormData();

      formData.append("AccountID", secureLocalStorage.getItem("accountId"));
      if (voucherDiscount?.voucherID) {
        formData.append("VoucherID", voucherDiscount?.voucherID);
      }
      formData.append("RoomID", secureLocalStorage.getItem("roomId"));
      if (
        formatDate(dates[0]?.startDate, "yyyy-MM-dd") ===
        formatDate(dates[0]?.endDate, "yyyy-MM-dd")
      ) {
        setDisplayDuplicateDate(true);
      } else {
        formData.append(
          "CheckInDate",
          formatDate(dates[0]?.startDate, "yyyy-MM-dd")
        );
        formData.append(
          "CheckOutDate",
          formatDate(dates[0]?.endDate, "yyyy-MM-dd")
        );
        formData.append("TotalPrice", totalPrice());
        formData.append("TaxesPrice", taxesPrice);
        formData.append("NumberOfGuest", options.person);
        formData.append("NumberOfRoom", options.room);

        const result = await createBooking(formData);

        if (result.status === 200) {
          setDisplaySuccess(true);
          setTimeout(() => {
            navigate(routes.home.root);
            document.documentElement.scrollTop = 0;
          }, 2000);
        } else {
          setDisplayError(true);
        }
      }
    } catch (error) {
      setDisplayServerError(true);
    }
  };

  useEffect(() => {
    init();
  }, [dates]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dateRangeRef.current &&
        !dateRangeRef.current.contains(event.target)
      ) {
        setOpenDate(false);
      }
    };

    const handleClickOptionOutside = (event) => {
      if (
        roomGuestRef.current &&
        !roomGuestRef.current.contains(event.target)
      ) {
        setOpenOptions(false);
      }
    };

    if (openDate) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    if (openOptions) {
      document.addEventListener("mousedown", handleClickOptionOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOptionOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDate, openOptions]);

  useEffect(() => {}, [dataHotel, dataRoom, dataAccount, dataVoucher]);

  useEffect(() => {
    let timeOut;
    if (displayProfileEmpty) {
      timeOut = setTimeout(() => {
        setDisplayProfileEmpty(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayProfileEmpty]);

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
    if (displayDuplicateDate) {
      timeOut = setTimeout(() => {
        setDisplayDuplicateDate(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayDuplicateDate]);

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

  return (
    <BoxContainer>
      <HeaderUser />

      <ToastComponent
        open={displayProfileEmpty}
        close={() => setDisplayProfileEmpty(false)}
        title="Warning"
        message="You must update your profile before booking!"
        type="warning"
      />

      <ToastComponent
        open={displayDuplicateDate}
        close={() => setDisplayDuplicateDate(false)}
        title="Error"
        message="Check-in date cannot equal to Check-out date!"
        type="error"
      />

      <ToastComponent
        open={displayError}
        close={() => setDisplayError(false)}
        title="Error"
        message="Booking fail!"
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
        message="Booking successfully!"
        type="success"
      />

      <Box
        display="flex"
        alignItems="center"
        gap=".5rem"
        bgcolor={themeColors.bkgPage}
        p="20px 60px 0"
      >
        <Typography
          onClick={() => {
            navigate(routes.home.root);
            document.documentElement.scrollTop = 0;
          }}
          sx={{
            color: themeColors.text_Link,
            "&:hover": {
              color: themeColors.primary_600,
              textDecoration: "underline",
              cursor: "pointer",
            },
          }}
        >
          Home
        </Typography>
        <Typography sx={{ color: themeColors.text_Link }}>&gt;</Typography>
        <Typography
          onClick={handleBack}
          sx={{
            color: themeColors.text_Link,
            "&:hover": {
              color: themeColors.primary_600,
              textDecoration: "underline",
              cursor: "pointer",
            },
          }}
        >
          {secureLocalStorage.getItem("hotelLocation")}
        </Typography>
        <Typography sx={{ color: themeColors.text_Link }}>&gt;</Typography>
        <Typography
          onClick={() => {
            navigate(routes.home.hotelDetails);
            document.documentElement.scrollTop = 0;
          }}
          sx={{
            color: themeColors.text_Link,
            "&:hover": {
              color: themeColors.primary_600,
              textDecoration: "underline",
              cursor: "pointer",
            },
          }}
        >
          {dataHotel?.hotel?.name}
        </Typography>
        <Typography sx={{ color: themeColors.text_Link }}>&gt;</Typography>
        <Typography sx={{ color: themeColors.black, fontWeight: 700 }}>
          Checkout
        </Typography>
      </Box>
      <Box className="createBooking_Container">
        <Box className="createBooking_Content--Hotel-Booker-Voucher">
          <Box className="createBooking_Content--Hotel">
            <Box className="createBooking_Content--Hotel-Items">
              <img
                loading="lazy"
                style={{
                  width: "300px",
                  maxWidth: "400px",
                  height: "200px",
                  maxHeight: "250px",
                  borderRadius: "8px",
                }}
                src={`${URL_IMAGE}${dataHotel?.hotel?.mainImage}`}
                alt=""
              />
              <Box className="createBooking_Content--Hotel-Items--information">
                <Typography
                  sx={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: themeColors.title,
                    lineHeight: "24px",
                    mb: "10px",
                  }}
                >
                  {dataHotel?.hotel?.name}
                </Typography>
                <Box sx={{ display: "flex", gap: ".5rem", mb: "10px" }}>
                  {renderStars(dataHotel?.hotel?.hotelStandar)}
                </Box>
                <Typography
                  sx={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    lineHeight: "20px",
                    color: themeColors.title,
                    mb: "10px",
                  }}
                >
                  {dataRoom?.typeOfRoom}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: "10px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                    }}
                  >
                    <img
                      style={{ width: "28px", height: "28px" }}
                      src={AssetImages.ICONS.PEOPLE}
                      alt=""
                    />
                    <Typography
                      sx={{
                        fontSize: "18px",
                        fontWeight: 400,
                        lineHeight: "28px",
                        color: themeColors.black,
                      }}
                    >
                      {dataRoom?.numberCapacity
                        ? dataRoom?.numberCapacity <= 1
                          ? `${dataRoom?.numberCapacity} person`
                          : `${dataRoom?.numberCapacity} people`
                        : `0 person`}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                    }}
                  >
                    <img
                      style={{ width: "28px", height: "28px" }}
                      src={AssetImages.ICONS.BED}
                      alt=""
                    />
                    <Typography
                      sx={{
                        fontSize: "18px",
                        fontWeight: 400,
                        lineHeight: "28px",
                        color: themeColors.black,
                      }}
                    >
                      {dataRoom?.typeOfBed}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                    }}
                  >
                    <img
                      style={{ width: "32px", height: "32px" }}
                      src={AssetImages.ICONS.SIZEROOM2}
                      alt=""
                    />
                    <Typography
                      sx={{
                        fontSize: "18px",
                        fontWeight: 400,
                        lineHeight: "28px",
                        color: themeColors.black,
                      }}
                    >
                      {dataRoom?.sizeOfRoom} m<sup>2</sup>
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 400,
                    color: themeColors.black,
                  }}
                >
                  Reservations{" "}
                  <span
                    style={{ color: themeColors.text_Link, fontWeight: "bold" }}
                  >
                    can be canceled
                  </span>{" "}
                  before 24 hours from check-in date
                </Typography>
              </Box>
            </Box>
            <Divider
              sx={{ margin: "15px 0", backgroundColor: themeColors.gray }}
            />

            <Box className="createBooking_Content--Hotel-chooseDateandRoom">
              <Box className="createBooking_Content--Hotel-chooseDate">
                <FontAwesomeIcon
                  onClick={() => setOpenDate(!openDate)}
                  icon={faCalendarDays}
                  className="chooseDate_Item-icon"
                />
                <span
                  onClick={() => setOpenDate(!openDate)}
                  className="chooseDate_Item-textDate"
                >
                  {format(dates[0].startDate, "dd/MM/yyyy")} to {""}
                  {format(dates[0].endDate, "dd/MM/yyyy")}
                  {calculateNights(dates[0].startDate, dates[0].endDate) <=
                  1 ? (
                    <span className="nightText"> {dayNights} night</span>
                  ) : (
                    <span className="nightText"> {dayNights} nights</span>
                  )}
                </span>
                {openDate && (
                  <div ref={dateRangeRef} className="chooseDate_Item-date">
                    <DateRange
                      ref={dateRangeRef}
                      editableDateInputs={true}
                      onChange={handleDateChange}
                      moveRangeOnFirstSelection={false}
                      ranges={dates}
                      minDate={new Date()}
                    />
                  </div>
                )}
              </Box>
              <Box>
                <Divider
                  orientation="vertical"
                  sx={{
                    backgroundColor: themeColors.gray,
                    height: "40px",
                  }}
                />
              </Box>
              <Box className="createBooking_Content--Hotel-chooseRoom">
                <FontAwesomeIcon
                  onClick={() => setOpenOptions(!openOptions)}
                  icon={faPerson}
                  className="search_Item--icon"
                />
                <span
                  onClick={() => setOpenOptions(!openOptions)}
                  className="search_Item--text"
                >
                  {`${
                    options.person <= 1
                      ? `${options.person} person`
                      : `${options.person} people`
                  } and ${
                    options.room <= 1
                      ? `${options.room} room`
                      : `${options.room} rooms`
                  }`}
                </span>
                {openOptions && (
                  <Box ref={roomGuestRef} className="search_Item--options">
                    <Box className="search_Item--optionItem">
                      <span className="search_Item--optionItem-text">
                        Person
                      </span>
                      <Box className="search_Item--optionItem-optionCounter">
                        <button
                          className="optionCounterButton"
                          onClick={() => handleOption("person", "d")}
                          disabled={options.person <= 1}
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.person}
                        </span>
                        <button
                          className="optionCounterButton"
                          onClick={() => handleOption("person", "i")}
                          disabled={checkDisabledIncreasePerson()}
                        >
                          +
                        </button>
                      </Box>
                    </Box>

                    <Box className="search_Item--optionItem">
                      <span className="search_Item--optionItem-text">Room</span>
                      <Box className="search_Item--optionItem-optionCounter">
                        <button
                          className="optionCounterButton"
                          onClick={() => handleOption("room", "d")}
                          disabled={options.room <= 1}
                        >
                          -
                        </button>
                        <span className="optionCounterNumber">
                          {options.room}
                        </span>
                        <button
                          className="optionCounterButton"
                          onClick={() => handleOption("room", "i")}
                          disabled={options.room >= dataRoom?.quantity}
                        >
                          +
                        </button>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
          <Box className="createBooking_Content--Booker">
            <Typography
              sx={{
                fontSize: "24px",
                lineHeight: "24px",
                fontWeight: "bold",
                color: themeColors.title,
                marginBottom: "10px",
              }}
            >
              Booker's Information
            </Typography>
            <Typography
              sx={{
                fontSize: "16px",
                lineHeight: "16px",
                fontWeight: 400,
                color: themeColors.gray,
              }}
            >
              The guest's name must match the valid identification used to check
              in.
            </Typography>
            <Box sx={{ margin: "20px 0 10px 0" }}>
              <Box sx={{ marginBottom: "30px" }}>
                <Typography
                  sx={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    fontWeight: "bold",
                    color: themeColors.title,
                    marginBottom: "10px",
                  }}
                >
                  Fullname
                </Typography>
                <Box
                  sx={{
                    width: "100%",
                    padding: "10px 14px",
                    color: themeColors.text_Link,
                    backgroundColor: themeColors.bg_Disabled,
                    border: 0,
                    borderRadius: "6px",
                    fontSize: 16,
                  }}
                >
                  {dataAccount?.profile?.fullName
                    ? dataAccount?.profile?.fullName
                    : "-"}
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ width: "45%" }}>
                  <Typography
                    sx={{
                      fontSize: "20px",
                      lineHeight: "20px",
                      fontWeight: "bold",
                      color: themeColors.title,
                      marginBottom: "10px",
                    }}
                  >
                    Email
                  </Typography>
                  <Box
                    sx={{
                      width: "100%",
                      padding: "10px 14px",
                      color: themeColors.text_Link,
                      backgroundColor: themeColors.bg_Disabled,
                      border: 0,
                      borderRadius: "6px",
                      fontSize: 16,
                    }}
                  >
                    {dataAccount?.email ? dataAccount?.email : "-"}
                  </Box>
                </Box>
                <Box sx={{ width: "45%" }}>
                  <Typography
                    sx={{
                      fontSize: "20px",
                      lineHeight: "20px",
                      fontWeight: "bold",
                      color: themeColors.title,
                      marginBottom: "10px",
                    }}
                  >
                    Phone
                  </Typography>
                  <Box
                    sx={{
                      width: "100%",
                      padding: "10px 14px",
                      color: themeColors.text_Link,
                      backgroundColor: themeColors.bg_Disabled,
                      border: 0,
                      borderRadius: "6px",
                      fontSize: 16,
                    }}
                  >
                    {dataAccount?.phone
                      ? formatPhoneNumber(dataAccount?.phone)
                      : "-"}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box className="createBooking_Content--Voucher">
            <Typography
              sx={{
                fontSize: "24px",
                lineHeight: "24px",
                fontWeight: "bold",
                color: themeColors.title,
                marginBottom: "20px",
              }}
            >
              Can Be Used For This Reservation
            </Typography>
            <Typography
              sx={{
                fontSize: "20px",
                lineHeight: "20px",
                fontWeight: "bold",
                color: themeColors.title,
                marginBottom: "20px",
              }}
            >
              Voucher Code
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <FormControl
                  size="small"
                  sx={{ bgcolor: themeColors.white, width: "90%" }}
                >
                  <Select
                    value={voucher}
                    onChange={(e) => setVoucher(e.target.value)}
                    displayEmpty
                    sx={{ borderRadius: "8px" }}
                  >
                    <MenuItem value="">
                      <em style={{ color: themeColors.gray }}>All Voucher</em>
                    </MenuItem>
                    {filterVoucherUnused(dataVoucher)?.map((vouchers) => (
                      <MenuItem
                        key={vouchers?.voucher?.voucherID}
                        value={vouchers?.voucher?.voucherID}
                      >
                        {`${vouchers?.voucher?.code} - ${vouchers?.voucher?.discount}%`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Button
                disabled={!voucher}
                onClick={handleUseVoucher}
                className={
                  voucher
                    ? "createBooking_Content--Voucher--btn-useVoucher"
                    : "createBooking_Content--Voucher--btn-disable"
                }
              >
                Use
              </Button>
            </Box>
          </Box>
        </Box>
        <Box className="createBooking_Content--totalPrice-Note">
          <Box className="createBooking_Content--totalPrice">
            <Box sx={{ width: "100%", marginBottom: "20px" }}>
              <Typography
                sx={{
                  fontSize: "24px",
                  lineHeight: "24px",
                  fontWeight: "bold",
                  color: themeColors.title,
                  marginBottom: "10px",
                }}
              >
                Price Detail
              </Typography>
              <Divider sx={{ backgroundColor: themeColors.gray }} />
            </Box>
            <Box
              sx={{
                width: "100%",
                marginBottom: "10px",
                flexDirection: "column",
              }}
            >
              <Box sx={{ width: "100%", marginBottom: "20px" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "16px",
                      lineHeight: "16px",
                      color: themeColors.black,
                    }}
                  >
                    Room
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "20px",
                      lineHeight: "20px",
                      color: themeColors.black,
                    }}
                  >
                    {formatPrice(
                      Math.ceil(priceRoom * dayNights * options.room)
                    )}{" "}
                    VND
                  </Typography>
                </Box>
                <Divider sx={{ backgroundColor: themeColors.gray }} />
              </Box>
              <Box sx={{ width: "100%", marginBottom: "20px" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "16px",
                      lineHeight: "16px",
                      color: themeColors.black,
                    }}
                  >
                    Service Fee
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "20px",
                      lineHeight: "20px",
                      color: themeColors.black,
                    }}
                  >
                    {formatPrice(Math.ceil(serviceFee))} VND
                  </Typography>
                </Box>
                <Divider sx={{ backgroundColor: themeColors.gray }} />
              </Box>
              <Box sx={{ width: "100%", marginBottom: "20px" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "16px",
                      lineHeight: "16px",
                      color: themeColors.black,
                    }}
                  >
                    Taxes
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "20px",
                      lineHeight: "20px",
                      color: themeColors.black,
                    }}
                  >
                    {formatPrice(Math.ceil(taxesPrice))} VND
                  </Typography>
                </Box>
                <Divider sx={{ backgroundColor: themeColors.gray }} />
              </Box>

              {useVoucher && (
                <Box sx={{ width: "100%", marginBottom: "20px" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "20px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "16px",
                        lineHeight: "16px",
                        color: themeColors.black,
                      }}
                    >
                      Voucher
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "20px",
                        lineHeight: "20px",
                        color: themeColors.button_SecondaryHover,
                      }}
                    >
                      {voucherPrice > 0
                        ? `- ${formatPrice(Math.ceil(voucherPrice))} VND`
                        : `- 0 VND`}
                    </Typography>
                  </Box>
                  <Divider sx={{ backgroundColor: themeColors.gray }} />
                </Box>
              )}
              <Box sx={{ width: "100%", marginBottom: "20px" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "18px",
                      lineHeight: "18px",
                      color: themeColors.title,
                      fontWeight: "bold",
                    }}
                  >
                    Total
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "24px",
                      lineHeight: "24px",
                      color: themeColors.title,
                      fontWeight: "bold",
                    }}
                  >
                    {voucherPrice
                      ? `${formatPrice(
                          Math.ceil(
                            priceRoom * dayNights * options.room +
                              serviceFee +
                              taxesPrice -
                              voucherPrice
                          )
                        )}`
                      : `${formatPrice(
                          Math.ceil(
                            priceRoom * dayNights * options.room +
                              serviceFee +
                              taxesPrice
                          )
                        )}`}{" "}
                    VND
                  </Typography>
                </Box>
                <Divider sx={{ backgroundColor: themeColors.gray }} />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: "10px",
                alignItems: "flex-start",
                marginBottom: "20px",
              }}
            >
              <input
                checked={checkAcceptBooking}
                onChange={handleCheckAcceptBookingChange}
                style={{
                  minWidth: 20,
                  maxWidth: 20,
                  minHeight: 20,
                  maxHeight: 20,
                  marginTop: "3px",
                }}
                type="checkbox"
              />
              <Typography
                sx={{
                  fontSize: "16px",
                  color: themeColors.black,
                }}
              >
                I agree to the{" "}
                <span className="createBooking_Content--totalPrice-textLink">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="createBooking_Content--totalPrice-textLink">
                  Privacy Policy
                </span>
              </Typography>
            </Box>
            <Box sx={{ marginBottom: "10px" }}>
              <Button
                disabled={!checkAcceptBooking}
                className={
                  checkAcceptBooking
                    ? "createBooking_Content--totalPrice-btn-booking"
                    : "createBooking_Content--totalPrice-btn-booking--disable"
                }
                onClick={
                  !dataAccount?.profile?.fullName ||
                  !dataAccount?.email ||
                  !dataAccount?.phone
                    ? handleUpdatePhone
                    : handleCreateBooking
                }
              >
                Booking
              </Button>
            </Box>
          </Box>
          <Box className="createBooking_Content--Note">
            <Typography
              sx={{
                fontSize: "24px",
                lineHeight: "24px",
                fontWeight: "bold",
                color: themeColors.title,
                marginBottom: "10px",
              }}
            >
              Note
            </Typography>
            <Typography
              sx={{
                fontSize: "18px",
                lineHeight: "30px",
                color: themeColors.black,
              }}
            >
              For the room type you selected, check-in is from 12:00 to 24:00
              and check-out is before 12:00.
            </Typography>
          </Box>
        </Box>
      </Box>
      <FooterCustomer />
    </BoxContainer>
  );
};

export default CreateBookingPage;
