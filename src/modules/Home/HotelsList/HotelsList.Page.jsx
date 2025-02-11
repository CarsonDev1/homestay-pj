/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import HeaderGuest from "../../../layouts/Header/Guest/HeaderGuest";
import FooterCustomer from "../../../layouts/Footer/Customer/FooterCustomer";
import BoxContainer from "../../../components/Box/Box.Container";
import {
  Autocomplete,
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import "./HotelsList.Style.scss";
import { themeColors } from "../../../themes/schemes/PureLightThem";
import { AssetImages } from "../../../utils/images";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../routes";
import { dataHotelAmenities } from "../../../utils/dataSet";
import { checkLogin, formatPrice, renderStars } from "../../../utils/helper";
import HeaderUser from "../../../layouts/Header/User/HeaderUser";
import {
  getAllHotel,
  getAllHotelNameToSearch,
  searchHotelByCity,
} from "../Home.Api";
import { URL_IMAGE } from "../../../services/ApiUrl";
import secureLocalStorage from "react-secure-storage";
import { filterListHotelsHaveRoom } from "../../../utils/filter";
import { useDispatch, useSelector } from "react-redux";
import { format, formatDate } from "date-fns";
import { saveListHotels } from "../Home.Actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faPerson } from "@fortawesome/free-solid-svg-icons";
import { DateRange } from "react-date-range";
import ToastComponent from "../../../components/Toast/Toast.Component";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { LoadingButton } from "@mui/lab";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const valueHotelStandard = [5, 4, 3, 2, 1];

const styles = {
  serviceType: {
    fontSize: 16,
    color: themeColors.black,
    fontWeight: "bold",
  },
  iconButton: {
    width: 24,
    height: 24,
    p: 0,
    m: 0,
    "&:hover": { bgcolor: "transparent" },
  },
  collapses: {
    ml: "10%",
  },
  amenitiesWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  amenitiesCheckbox: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  inputCheckbox: {
    minWidth: "20px",
    maxWidth: "20px",
    minHeight: "20px",
    maxHeight: "20px",
  },
};

const HotelsListPage = () => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const checkoutDate = currentDate.setDate(currentDate.getDate() + 1);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dateRangeRef = useRef(null);
  const roomGuestRef = useRef(null);
  const onTopRef = useRef(null);

  const [data, setData] = useState([]);
  const [fetchData, setFetchData] = useState(false);

  const [isStandardExpanded, setIsStandardExpanded] = useState(false);
  const [isStandardOpened, setIsStandardOpened] = useState(false);
  const [isEntranceExpanded, setIsEntranceExpanded] = useState(false);
  const [isEntranceOpened, setIsEntranceOpened] = useState(false);
  const [isKitchenExpanded, setIsKitchenExpanded] = useState(false);
  const [isKitchenOpened, setIsKitchenOpened] = useState(false);
  const [isBathroomExpanded, setIsBathroomExpanded] = useState(false);
  const [isBathroomOpened, setIsBathroomOpened] = useState(false);
  const [isOutsideExpanded, setIsOutsideExpanded] = useState(false);
  const [isOutsideOpened, setIsOutsideOpened] = useState(false);
  const [isEntertainmentExpanded, setIsEntertainmentExpanded] = useState(false);
  const [isEntertainmentOpened, setIsEntertainmentOpened] = useState(false);
  const [isFamilyExpanded, setIsFamilyExpanded] = useState(false);
  const [isFamilyOpened, setIsFamilyOpened] = useState(false);
  const [isSafetyExpanded, setIsSafetyExpanded] = useState(false);
  const [isSafetyOpened, setIsSafetyOpened] = useState(false);
  const [isOthersExpanded, setIsOthersExpanded] = useState(false);
  const [isOthersOpened, setIsOthersOpened] = useState(false);

  const listHotels = filterListHotelsHaveRoom(data);
  const listHotelsBySearch = useSelector((state) => state.home.listHotels);
  const filterListHotelBySearch = filterListHotelsHaveRoom(listHotelsBySearch);

  const [selectedSubServices, setSelectedSubServices] = useState([]);
  const [selectedStandards, setSelectedStandards] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(99999999);

  const [hotelPage, setHotelPage] = useState(4);

  const [openDate, setOpenDate] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);

  const [optionsHotel, setOptionsHotel] = useState([]);
  const [city, setCity] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const [displayEmpty, setDisplayEmpty] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);
  const [displayServerError, setDisplayServerError] = useState(false);

  const handleServiceClicked = (index) => {
    switch (index) {
      case 0:
        setIsStandardExpanded(!isStandardExpanded);
        setIsStandardOpened(!isStandardOpened);

        setIsEntranceExpanded(false);
        setIsEntranceOpened(false);

        setIsKitchenExpanded(false);
        setIsKitchenOpened(false);

        setIsBathroomExpanded(false);
        setIsBathroomOpened(false);

        setIsOutsideExpanded(false);
        setIsOutsideOpened(false);

        setIsEntertainmentExpanded(false);
        setIsEntertainmentOpened(false);

        setIsFamilyExpanded(false);
        setIsFamilyOpened(false);

        setIsSafetyExpanded(false);
        setIsSafetyOpened(false);

        setIsOthersExpanded(false);
        setIsOthersOpened(false);
        break;
      case 1:
        setIsEntranceExpanded(!isEntranceExpanded);
        setIsEntranceOpened(!isEntranceOpened);

        setIsStandardExpanded(false);
        setIsStandardOpened(false);

        setIsKitchenExpanded(false);
        setIsKitchenOpened(false);

        setIsBathroomExpanded(false);
        setIsBathroomOpened(false);

        setIsOutsideExpanded(false);
        setIsOutsideOpened(false);

        setIsEntertainmentExpanded(false);
        setIsEntertainmentOpened(false);

        setIsFamilyExpanded(false);
        setIsFamilyOpened(false);

        setIsSafetyExpanded(false);
        setIsSafetyOpened(false);

        setIsOthersExpanded(false);
        setIsOthersOpened(false);
        break;
      case 2:
        setIsKitchenExpanded(!isKitchenExpanded);
        setIsKitchenOpened(!isKitchenOpened);

        setIsStandardExpanded(false);
        setIsStandardOpened(false);

        setIsEntranceExpanded(false);
        setIsEntranceOpened(false);

        setIsBathroomExpanded(false);
        setIsBathroomOpened(false);

        setIsOutsideExpanded(false);
        setIsOutsideOpened(false);

        setIsEntertainmentExpanded(false);
        setIsEntertainmentOpened(false);

        setIsFamilyExpanded(false);
        setIsFamilyOpened(false);

        setIsSafetyExpanded(false);
        setIsSafetyOpened(false);

        setIsOthersExpanded(false);
        setIsOthersOpened(false);
        break;
      case 3:
        setIsBathroomExpanded(!isBathroomExpanded);
        setIsBathroomOpened(!isBathroomOpened);

        setIsStandardExpanded(false);
        setIsStandardOpened(false);

        setIsEntranceExpanded(false);
        setIsEntranceOpened(false);

        setIsKitchenExpanded(false);
        setIsKitchenOpened(false);

        setIsOutsideExpanded(false);
        setIsOutsideOpened(false);

        setIsEntertainmentExpanded(false);
        setIsEntertainmentOpened(false);

        setIsFamilyExpanded(false);
        setIsFamilyOpened(false);

        setIsSafetyExpanded(false);
        setIsSafetyOpened(false);

        setIsOthersExpanded(false);
        setIsOthersOpened(false);
        break;
      case 4:
        setIsOutsideExpanded(!isOutsideExpanded);
        setIsOutsideOpened(!isOutsideOpened);

        setIsStandardExpanded(false);
        setIsStandardOpened(false);

        setIsEntranceExpanded(false);
        setIsEntranceOpened(false);

        setIsKitchenExpanded(false);
        setIsKitchenOpened(false);

        setIsBathroomExpanded(false);
        setIsBathroomOpened(false);

        setIsEntertainmentExpanded(false);
        setIsEntertainmentOpened(false);

        setIsFamilyExpanded(false);
        setIsFamilyOpened(false);

        setIsSafetyExpanded(false);
        setIsSafetyOpened(false);

        setIsOthersExpanded(false);
        setIsOthersOpened(false);
        break;
      case 5:
        setIsEntertainmentExpanded(!isEntertainmentExpanded);
        setIsEntertainmentOpened(!isEntertainmentOpened);

        setIsStandardExpanded(false);
        setIsStandardOpened(false);

        setIsEntranceExpanded(false);
        setIsEntranceOpened(false);

        setIsKitchenExpanded(false);
        setIsKitchenOpened(false);

        setIsBathroomExpanded(false);
        setIsBathroomOpened(false);

        setIsOutsideExpanded(false);
        setIsOutsideOpened(false);

        setIsFamilyExpanded(false);
        setIsFamilyOpened(false);

        setIsSafetyExpanded(false);
        setIsSafetyOpened(false);

        setIsOthersExpanded(false);
        setIsOthersOpened(false);
        break;
      case 6:
        setIsFamilyExpanded(!isFamilyExpanded);
        setIsFamilyOpened(!isFamilyOpened);

        setIsStandardExpanded(false);
        setIsStandardOpened(false);

        setIsEntranceExpanded(false);
        setIsEntranceOpened(false);

        setIsKitchenExpanded(false);
        setIsKitchenOpened(false);

        setIsBathroomExpanded(false);
        setIsBathroomOpened(false);

        setIsOutsideExpanded(false);
        setIsOutsideOpened(false);

        setIsEntertainmentExpanded(false);
        setIsEntertainmentOpened(false);

        setIsSafetyExpanded(false);
        setIsSafetyOpened(false);

        setIsOthersExpanded(false);
        setIsOthersOpened(false);
        break;
      case 7:
        setIsSafetyExpanded(!isSafetyExpanded);
        setIsSafetyOpened(!isSafetyOpened);

        setIsStandardExpanded(false);
        setIsStandardOpened(false);

        setIsEntranceExpanded(false);
        setIsEntranceOpened(false);

        setIsKitchenExpanded(false);
        setIsKitchenOpened(false);

        setIsBathroomExpanded(false);
        setIsBathroomOpened(false);

        setIsOutsideExpanded(false);
        setIsOutsideOpened(false);

        setIsEntertainmentExpanded(false);
        setIsEntertainmentOpened(false);

        setIsFamilyExpanded(false);
        setIsFamilyOpened(false);

        setIsOthersExpanded(false);
        setIsOthersOpened(false);
        break;
      case 8:
        setIsOthersExpanded(!isOthersExpanded);
        setIsOthersOpened(!isOthersOpened);

        setIsStandardExpanded(false);
        setIsStandardOpened(false);

        setIsEntranceExpanded(false);
        setIsEntranceOpened(false);

        setIsKitchenExpanded(false);
        setIsKitchenOpened(false);

        setIsBathroomExpanded(false);
        setIsBathroomOpened(false);

        setIsOutsideExpanded(false);
        setIsOutsideOpened(false);

        setIsEntertainmentExpanded(false);
        setIsEntertainmentOpened(false);

        setIsFamilyExpanded(false);
        setIsFamilyOpened(false);

        setIsSafetyExpanded(false);
        setIsSafetyOpened(false);
        break;
      default:
        setIsStandardExpanded(false);
        setIsStandardOpened(false);

        setIsEntranceExpanded(false);
        setIsEntranceOpened(false);

        setIsKitchenExpanded(false);
        setIsKitchenOpened(false);

        setIsBathroomExpanded(false);
        setIsBathroomOpened(false);

        setIsOutsideExpanded(false);
        setIsOutsideOpened(false);

        setIsEntertainmentExpanded(false);
        setIsEntertainmentOpened(false);

        setIsFamilyExpanded(false);
        setIsFamilyOpened(false);

        setIsSafetyExpanded(false);
        setIsSafetyOpened(false);

        setIsOthersExpanded(false);
        setIsOthersOpened(false);
        break;
    }
  };

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

  const handleSubServiceChange = (subService) => {
    setSelectedSubServices((prevSelected) =>
      prevSelected.includes(subService)
        ? prevSelected.filter((item) => item !== subService)
        : [...prevSelected, subService]
    );
    if (onTopRef.current) {
      onTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleStandardChange = (standard) => {
    setSelectedStandards((prevSelected) =>
      prevSelected.includes(standard)
        ? prevSelected.filter((item) => item !== standard)
        : [...prevSelected, standard]
    );
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
  };

  const filterHotels = (hotels) => {
    return hotels?.filter((hotel) => {
      const subServiceMatch =
        selectedSubServices?.length === 0 ||
        hotel?.hotelService?.some((service) =>
          service?.hotelSubService?.some((subService) =>
            selectedSubServices?.includes(subService?.name)
          )
        );

      const standardMatch =
        selectedStandards?.length === 0 ||
        selectedStandards?.includes(hotel?.hotelStandar);

      const priceMatch =
        (minPrice === "" ||
          (hotel?.rooms && hotel?.rooms[0]?.price >= Number(minPrice))) &&
        (maxPrice === "" ||
          (hotel?.rooms && hotel?.rooms[0]?.price <= Number(maxPrice)));

      return subServiceMatch && standardMatch && priceMatch;
    });
  };

  const filteredHotels = filterHotels(listHotels);
  const filteredSearchHotels = filterHotels(filterListHotelBySearch);

  const handleSeeMore = () => {
    setHotelPage((prev) => prev + 4);
  };

  const init = async () => {
    const res = await getAllHotel();
    const resSuggestion = await getAllHotelNameToSearch();

    if (resSuggestion) {
      setOptionsHotel(resSuggestion);
    }

    if (res) {
      setData(res);
    }
  };

  const normalizeString = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  const filteredOptions = optionsHotel?.filter((option) =>
    normalizeString(option?.city?.toLowerCase()).includes(
      normalizeString(inputValue?.toLowerCase())
    )
  );

  const handleOption = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
      };
    });
  };

  const handleSearch = async () => {
    try {
      if (city !== null) {
        let formData = new FormData();

        formData.append("city", city?.city);

        const res = await searchHotelByCity(formData, dispatch);

        if (
          filterListHotelsHaveRoom(res).length !== 0 &&
          filterListHotelsHaveRoom(res)
        ) {
          secureLocalStorage.setItem("city", city?.city);
          secureLocalStorage.setItem(
            "checkInDate",
            formatDate(dates[0].startDate, "yyyy-MM-dd")
          );
          secureLocalStorage.setItem(
            "checkOutDate",
            formatDate(dates[0].endDate, "yyyy-MM-dd")
          );
          secureLocalStorage.setItem("numberGuest", options.person);
          secureLocalStorage.setItem("numberRoom", options.room);
          setDisplaySuccess(true);
          switch (window.location.pathname) {
            case "/":
              saveListHotels(filterListHotelsHaveRoom(res));
              setTimeout(() => {
                navigate(routes.home.listHotels);
                document.documentElement.scrollTop = 0;
              }, 2000);
              break;
            case "/hotels":
              saveListHotels(filterListHotelsHaveRoom(res));
              break;
            default:
              saveListHotels([]);
              break;
          }
        } else {
          saveListHotels([]);
        }
      } else {
        saveListHotels([]);
        setDisplayEmpty(true);
      }
    } catch (error) {
      saveListHotels([]);
      setDisplayServerError(true);
    }
  };

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

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setFetchData(true);
    }, 3000);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  useEffect(() => {
    const storedCity = secureLocalStorage.getItem("city");
    if (storedCity) {
      setCity(storedCity);
    }
  }, []);

  useEffect(() => {
    if (city) {
      secureLocalStorage.setItem("city", city?.city);
    }
  }, [city]);

  useEffect(() => {
    let timeOut;
    if (displayEmpty) {
      timeOut = setTimeout(() => {
        setDisplayEmpty(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayEmpty]);

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

  useEffect(() => {
    secureLocalStorage.removeItem("hotelId");
    secureLocalStorage.removeItem("hotelLocation");
    secureLocalStorage.removeItem("roomId");
  });

  useEffect(() => {}, [listHotelsBySearch]);

  return (
    <>
      {checkLogin() ? <HeaderUser /> : <HeaderGuest />}

      <ToastComponent
        open={displayEmpty}
        close={() => setDisplayEmpty(false)}
        title="Error"
        message="Please provide a location!"
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
        message="Search hotel successfully!"
        type="success"
      />

      <BoxContainer property="hotels-list__container">
        <BoxContainer>
          <Box className="search_Item--content">
            <Typography
              sx={{
                fontSize: "24px",
                lineHeight: "24px",
                fontWeight: "bold",
                color: themeColors.title,
                marginBottom: "20px",
              }}
            >
              Find where you want to stop
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box className="search_content">
                <Typography
                  sx={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    color: themeColors.black,
                    marginBottom: "15px",
                  }}
                >
                  Destination
                </Typography>
                <Box>
                  <Autocomplete
                    size="small"
                    value={city}
                    onChange={(event, newHotelName) => {
                      setCity(newHotelName);
                    }}
                    onInputChange={(event, newInputValue) => {
                      setInputValue(newInputValue);
                    }}
                    selectOnFocus
                    autoComplete
                    clearOnBlur
                    handleHomeEndKeys
                    freeSolo
                    options={filteredOptions}
                    getOptionLabel={(option) => {
                      if (secureLocalStorage.getItem("city")) {
                        return secureLocalStorage.getItem("city");
                      } else {
                        return option?.city;
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="City"
                        InputProps={{
                          ...params.InputProps,
                        }}
                      />
                    )}
                    renderOption={(props, option) => {
                      const { key, ...optionProps } = props;
                      return (
                        <li key={key} {...optionProps}>
                          {option?.city}
                        </li>
                      );
                    }}
                    sx={{
                      width: "100%",
                      bgcolor: themeColors.white,
                      borderRadius: "4px",
                    }}
                  />
                </Box>
              </Box>
              <Box className="search_content">
                <Typography
                  sx={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    color: themeColors.black,
                    marginBottom: "15px",
                  }}
                >
                  Check-in & Check-out
                </Typography>
                <Box className="search_content-Item">
                  <FontAwesomeIcon
                    onClick={() => setOpenDate(!openDate)}
                    icon={faCalendarDays}
                    className="search_Item--icon"
                  />
                  <span
                    onClick={() => setOpenDate(!openDate)}
                    className="search_Item--text"
                  >{`${format(dates[0].startDate, "dd/MM/yyyy")} - ${format(
                    dates[0].endDate,
                    "dd/MM/yyyy"
                  )}`}</span>
                  {openDate && (
                    <div ref={dateRangeRef} className="search_Item-date">
                      <DateRange
                        editableDateInputs={true}
                        onChange={(item) => setDates([item.selection])}
                        moveRangeOnFirstSelection={false}
                        ranges={dates}
                        minDate={new Date()}
                      />
                    </div>
                  )}
                </Box>
              </Box>
              <Box className="search_content">
                <Typography
                  sx={{
                    fontSize: "20px",
                    lineHeight: "20px",
                    color: themeColors.black,
                    marginBottom: "15px",
                  }}
                >
                  Rooms & Guests
                </Typography>

                <Box className="search_content-Item">
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
                            disabled={options.person >= 20}
                          >
                            +
                          </button>
                        </Box>
                      </Box>

                      <Box className="search_Item--optionItem">
                        <span className="search_Item--optionItem-text">
                          Room
                        </span>
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
                            disabled={options.room >= 10}
                          >
                            +
                          </button>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
              <Box sx={{ marginTop: "42px" }}>
                <Button
                  className="search_Item--btn-search"
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </Box>
            </Box>
          </Box>
        </BoxContainer>

        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mt: "20px",
          }}
          ref={onTopRef}
        >
          {data?.length > 0 ? (
            <>
              <Box className="filter__container">
                <Typography className="filter__title">Filter</Typography>

                <Divider
                  sx={{ width: "100%", height: 0.5, bgcolor: themeColors.gray }}
                />

                <Box className="filter__rating">
                  <Typography className="rating__title">Star Rating</Typography>
                  {valueHotelStandard.map((standard, index) => (
                    <Box key={index} className="rating__checkbox">
                      <input
                        type="checkbox"
                        className="input__checkbox"
                        checked={selectedStandards.includes(standard)}
                        onChange={() => handleStandardChange(standard)}
                      />
                      <Box className="star">{renderStars(standard)}</Box>
                    </Box>
                  ))}
                </Box>

                <Divider
                  sx={{ width: "100%", height: 0.5, bgcolor: themeColors.gray }}
                />

                <Box className="filter__price">
                  <Typography className="price__title">Price Range</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1.5rem",
                    }}
                  >
                    <Box className="price__input">
                      <label htmlFor="min">Min Price</label>
                      <TextField
                        type="number"
                        size="small"
                        placeholder="VND 0"
                        onChange={handleMinPriceChange}
                      />
                    </Box>

                    <Box className="price__input">
                      <label htmlFor="max">Max Price</label>
                      <TextField
                        type="number"
                        size="small"
                        placeholder="VND 99.999.999"
                        onChange={handleMaxPriceChange}
                      />
                    </Box>
                  </Box>
                </Box>

                <Divider
                  sx={{ width: "100%", height: 0.5, bgcolor: themeColors.gray }}
                />

                <Box className="filter__amenities">
                  <Typography className="amenities__title">
                    Amenities
                  </Typography>

                  {dataHotelAmenities.map((service, index) => (
                    <Box key={index} sx={styles.amenitiesWrapper}>
                      <Box
                        onClick={() => handleServiceClicked(index)}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{
                          "&:hover": {
                            cursor: "pointer",
                          },
                        }}
                      >
                        <Typography sx={styles.serviceType}>
                          {service?.serviceType}
                        </Typography>

                        {index === 0 && (
                          <IconButton sx={styles.iconButton}>
                            {isStandardExpanded ? (
                              isStandardOpened ? (
                                <ExpandLess />
                              ) : (
                                <ExpandMore />
                              )
                            ) : !isStandardOpened ? (
                              <ExpandMore />
                            ) : (
                              <ExpandLess />
                            )}
                          </IconButton>
                        )}

                        {index === 1 && (
                          <IconButton sx={styles.iconButton}>
                            {isEntranceExpanded ? (
                              isEntranceOpened ? (
                                <ExpandLess />
                              ) : (
                                <ExpandMore />
                              )
                            ) : !isEntranceOpened ? (
                              <ExpandMore />
                            ) : (
                              <ExpandLess />
                            )}
                          </IconButton>
                        )}

                        {index === 2 && (
                          <IconButton sx={styles.iconButton}>
                            {isKitchenExpanded ? (
                              isKitchenOpened ? (
                                <ExpandLess />
                              ) : (
                                <ExpandMore />
                              )
                            ) : !isKitchenOpened ? (
                              <ExpandMore />
                            ) : (
                              <ExpandLess />
                            )}
                          </IconButton>
                        )}

                        {index === 3 && (
                          <IconButton sx={styles.iconButton}>
                            {isBathroomExpanded ? (
                              isBathroomOpened ? (
                                <ExpandLess />
                              ) : (
                                <ExpandMore />
                              )
                            ) : !isBathroomOpened ? (
                              <ExpandMore />
                            ) : (
                              <ExpandLess />
                            )}
                          </IconButton>
                        )}

                        {index === 4 && (
                          <IconButton sx={styles.iconButton}>
                            {isOutsideExpanded ? (
                              isOutsideOpened ? (
                                <ExpandLess />
                              ) : (
                                <ExpandMore />
                              )
                            ) : !isOutsideOpened ? (
                              <ExpandMore />
                            ) : (
                              <ExpandLess />
                            )}
                          </IconButton>
                        )}

                        {index === 5 && (
                          <IconButton sx={styles.iconButton}>
                            {isEntertainmentExpanded ? (
                              isEntertainmentOpened ? (
                                <ExpandLess />
                              ) : (
                                <ExpandMore />
                              )
                            ) : !isEntertainmentOpened ? (
                              <ExpandMore />
                            ) : (
                              <ExpandLess />
                            )}
                          </IconButton>
                        )}

                        {index === 6 && (
                          <IconButton sx={styles.iconButton}>
                            {isFamilyExpanded ? (
                              isFamilyOpened ? (
                                <ExpandLess />
                              ) : (
                                <ExpandMore />
                              )
                            ) : !isFamilyOpened ? (
                              <ExpandMore />
                            ) : (
                              <ExpandLess />
                            )}
                          </IconButton>
                        )}

                        {index === 7 && (
                          <IconButton sx={styles.iconButton}>
                            {isSafetyExpanded ? (
                              isSafetyOpened ? (
                                <ExpandLess />
                              ) : (
                                <ExpandMore />
                              )
                            ) : !isSafetyOpened ? (
                              <ExpandMore />
                            ) : (
                              <ExpandLess />
                            )}
                          </IconButton>
                        )}

                        {index === 8 && (
                          <IconButton sx={styles.iconButton}>
                            {isOthersExpanded ? (
                              isOthersOpened ? (
                                <ExpandLess />
                              ) : (
                                <ExpandMore />
                              )
                            ) : !isOthersOpened ? (
                              <ExpandMore />
                            ) : (
                              <ExpandLess />
                            )}
                          </IconButton>
                        )}
                      </Box>

                      {index === 0 && (
                        <Collapse
                          in={isStandardOpened}
                          timeout="auto"
                          unmountOnExit
                          sx={styles.collapses}
                        >
                          <Box sx={styles.amenitiesWrapper}>
                            {service.subServices.map((subService, index) => (
                              <Box key={index} sx={styles.amenitiesCheckbox}>
                                <input
                                  type="checkbox"
                                  name={subService.subServiceName}
                                  id={subService.subServiceName}
                                  value={subService.subServiceName}
                                  style={styles.inputCheckbox}
                                  checked={selectedSubServices.includes(
                                    subService.subServiceName
                                  )}
                                  onChange={() =>
                                    handleSubServiceChange(
                                      subService.subServiceName
                                    )
                                  }
                                />
                                <label
                                  htmlFor={subService.subServiceName}
                                  className="checkbox__name"
                                >
                                  {subService.subServiceName}
                                </label>
                              </Box>
                            ))}
                          </Box>
                        </Collapse>
                      )}

                      {index === 1 && (
                        <Collapse
                          in={isEntranceOpened}
                          timeout="auto"
                          unmountOnExit
                          sx={styles.collapses}
                        >
                          <Box sx={styles.amenitiesWrapper}>
                            {service.subServices.map((subService, index) => (
                              <Box key={index} sx={styles.amenitiesCheckbox}>
                                <input
                                  type="checkbox"
                                  name={subService.subServiceName}
                                  id={subService.subServiceName}
                                  value={subService.subServiceName}
                                  style={styles.inputCheckbox}
                                  checked={selectedSubServices.includes(
                                    subService.subServiceName
                                  )}
                                  onChange={() =>
                                    handleSubServiceChange(
                                      subService.subServiceName
                                    )
                                  }
                                />
                                <label
                                  htmlFor={subService.subServiceName}
                                  className="checkbox__name"
                                >
                                  {subService.subServiceName}
                                </label>
                              </Box>
                            ))}
                          </Box>
                        </Collapse>
                      )}

                      {index === 2 && (
                        <Collapse
                          in={isKitchenOpened}
                          timeout="auto"
                          unmountOnExit
                          sx={styles.collapses}
                        >
                          <Box sx={styles.amenitiesWrapper}>
                            {service.subServices.map((subService, index) => (
                              <Box key={index} sx={styles.amenitiesCheckbox}>
                                <input
                                  type="checkbox"
                                  name={subService.subServiceName}
                                  id={subService.subServiceName}
                                  value={subService.subServiceName}
                                  style={styles.inputCheckbox}
                                  checked={selectedSubServices.includes(
                                    subService.subServiceName
                                  )}
                                  onChange={() =>
                                    handleSubServiceChange(
                                      subService.subServiceName
                                    )
                                  }
                                />
                                <label
                                  htmlFor={subService.subServiceName}
                                  className="checkbox__name"
                                >
                                  {subService.subServiceName}
                                </label>
                              </Box>
                            ))}
                          </Box>
                        </Collapse>
                      )}

                      {index === 3 && (
                        <Collapse
                          in={isBathroomOpened}
                          timeout="auto"
                          unmountOnExit
                          sx={styles.collapses}
                        >
                          <Box sx={styles.amenitiesWrapper}>
                            {service.subServices.map((subService, index) => (
                              <Box key={index} sx={styles.amenitiesCheckbox}>
                                <input
                                  type="checkbox"
                                  name={subService.subServiceName}
                                  id={subService.subServiceName}
                                  value={subService.subServiceName}
                                  style={styles.inputCheckbox}
                                  checked={selectedSubServices.includes(
                                    subService.subServiceName
                                  )}
                                  onChange={() =>
                                    handleSubServiceChange(
                                      subService.subServiceName
                                    )
                                  }
                                />
                                <label
                                  htmlFor={subService.subServiceName}
                                  className="checkbox__name"
                                >
                                  {subService.subServiceName}
                                </label>
                              </Box>
                            ))}
                          </Box>
                        </Collapse>
                      )}

                      {index === 4 && (
                        <Collapse
                          in={isOutsideOpened}
                          timeout="auto"
                          unmountOnExit
                          sx={styles.collapses}
                        >
                          <Box sx={styles.amenitiesWrapper}>
                            {service.subServices.map((subService, index) => (
                              <Box key={index} sx={styles.amenitiesCheckbox}>
                                <input
                                  type="checkbox"
                                  name={subService.subServiceName}
                                  id={subService.subServiceName}
                                  value={subService.subServiceName}
                                  style={styles.inputCheckbox}
                                  checked={selectedSubServices.includes(
                                    subService.subServiceName
                                  )}
                                  onChange={() =>
                                    handleSubServiceChange(
                                      subService.subServiceName
                                    )
                                  }
                                />
                                <label
                                  htmlFor={subService.subServiceName}
                                  className="checkbox__name"
                                >
                                  {subService.subServiceName}
                                </label>
                              </Box>
                            ))}
                          </Box>
                        </Collapse>
                      )}

                      {index === 5 && (
                        <Collapse
                          in={isEntertainmentOpened}
                          timeout="auto"
                          unmountOnExit
                          sx={styles.collapses}
                        >
                          <Box sx={styles.amenitiesWrapper}>
                            {service.subServices.map((subService, index) => (
                              <Box key={index} sx={styles.amenitiesCheckbox}>
                                <input
                                  type="checkbox"
                                  name={subService.subServiceName}
                                  id={subService.subServiceName}
                                  value={subService.subServiceName}
                                  style={styles.inputCheckbox}
                                  checked={selectedSubServices.includes(
                                    subService.subServiceName
                                  )}
                                  onChange={() =>
                                    handleSubServiceChange(
                                      subService.subServiceName
                                    )
                                  }
                                />
                                <label
                                  htmlFor={subService.subServiceName}
                                  className="checkbox__name"
                                >
                                  {subService.subServiceName}
                                </label>
                              </Box>
                            ))}
                          </Box>
                        </Collapse>
                      )}

                      {index === 6 && (
                        <Collapse
                          in={isFamilyOpened}
                          timeout="auto"
                          unmountOnExit
                          sx={styles.collapses}
                        >
                          <Box sx={styles.amenitiesWrapper}>
                            {service.subServices.map((subService, index) => (
                              <Box key={index} sx={styles.amenitiesCheckbox}>
                                <input
                                  type="checkbox"
                                  name={subService.subServiceName}
                                  id={subService.subServiceName}
                                  value={subService.subServiceName}
                                  style={styles.inputCheckbox}
                                  checked={selectedSubServices.includes(
                                    subService.subServiceName
                                  )}
                                  onChange={() =>
                                    handleSubServiceChange(
                                      subService.subServiceName
                                    )
                                  }
                                />
                                <label
                                  htmlFor={subService.subServiceName}
                                  className="checkbox__name"
                                >
                                  {subService.subServiceName}
                                </label>
                              </Box>
                            ))}
                          </Box>
                        </Collapse>
                      )}

                      {index === 7 && (
                        <Collapse
                          in={isSafetyOpened}
                          timeout="auto"
                          unmountOnExit
                          sx={styles.collapses}
                        >
                          <Box sx={styles.amenitiesWrapper}>
                            {service.subServices.map((subService, index) => (
                              <Box key={index} sx={styles.amenitiesCheckbox}>
                                <input
                                  type="checkbox"
                                  name={subService.subServiceName}
                                  id={subService.subServiceName}
                                  value={subService.subServiceName}
                                  style={styles.inputCheckbox}
                                  checked={selectedSubServices.includes(
                                    subService.subServiceName
                                  )}
                                  onChange={() =>
                                    handleSubServiceChange(
                                      subService.subServiceName
                                    )
                                  }
                                />
                                <label
                                  htmlFor={subService.subServiceName}
                                  className="checkbox__name"
                                >
                                  {subService.subServiceName}
                                </label>
                              </Box>
                            ))}
                          </Box>
                        </Collapse>
                      )}

                      {index === 8 && (
                        <Collapse
                          in={isOthersOpened}
                          timeout="auto"
                          unmountOnExit
                          sx={styles.collapses}
                        >
                          <Box sx={styles.amenitiesWrapper}>
                            {service.subServices.map((subService, index) => (
                              <Box key={index} sx={styles.amenitiesCheckbox}>
                                <input
                                  type="checkbox"
                                  name={subService.subServiceName}
                                  id={subService.subServiceName}
                                  value={subService.subServiceName}
                                  style={styles.inputCheckbox}
                                  checked={selectedSubServices.includes(
                                    subService.subServiceName
                                  )}
                                  onChange={() =>
                                    handleSubServiceChange(
                                      subService.subServiceName
                                    )
                                  }
                                />
                                <label
                                  htmlFor={subService.subServiceName}
                                  className="checkbox__name"
                                >
                                  {subService.subServiceName}
                                </label>
                              </Box>
                            ))}
                          </Box>
                        </Collapse>
                      )}

                      {index < dataHotelAmenities.length - 1 && (
                        <Divider sx={{ bgcolor: themeColors.gray }} />
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box className="list__container">
                {(listHotelsBySearch?.length === 0
                  ? filteredHotels
                  : filteredSearchHotels
                )?.map((hotel, index) => {
                  if (index > hotelPage) {
                    return null;
                  } else {
                    return (
                      <Box className="list__item" key={hotel?.hotelID}>
                        <Box
                          sx={{
                            m: 0,
                            p: 0,
                            lineHeight: 0,
                            minHeight: "292.475px",
                            maxHeight: "292.475px",
                          }}
                        >
                          <img
                            loading="lazy"
                            src={`${URL_IMAGE}${hotel?.mainImage}`}
                            alt=""
                            style={{
                              width: "320px",
                              display: "block",
                              minHeight: "292.475px",
                              maxHeight: "292.475px",
                              borderRadius: "8px",
                              border: "1px solid black",
                              objectFit: "cover",
                              pointerEvents: "none",
                            }}
                          />
                        </Box>

                        <Box className="item__infor">
                          <Stack direction="column" gap="1rem">
                            <Typography className="hotel__name">
                              {hotel?.name}
                            </Typography>
                            <Box sx={{ display: "flex", gap: ".5rem" }}>
                              {renderStars(hotel?.hotelStandar)}
                            </Box>
                            <Typography className="hotel__reviews">
                              {hotel?.avgRating?.toFixed(1)}/5
                              <span
                                style={{
                                  fontSize: "16px",
                                  color: themeColors.black,
                                  fontWeight: "normal",
                                  marginLeft: "5px",
                                }}
                              >
                                -{" "}
                                {hotel?.feedBack?.length > 1
                                  ? `${hotel?.feedBack?.length} reviews`
                                  : `${hotel?.feedBack?.length} review`}
                              </span>
                            </Typography>
                            <Box className="hotel__location">
                              <img
                                src={AssetImages.ICONS.LOCATION_2}
                                alt=""
                                style={{ width: 24, height: 24 }}
                              />
                              <Typography className="location__address">
                                {hotel?.hotelAddress?.city}
                              </Typography>
                            </Box>
                          </Stack>
                          <Box className="infor__room">
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1rem",
                                alignItems: "flex-start",
                              }}
                            >
                              <Typography className="room__type">
                                {hotel?.rooms[0]?.typeOfRoom}
                              </Typography>
                              {hotel?.rooms[0]?.quantity <= 5 && (
                                <Typography className="room__quantity">
                                  Only {hotel?.rooms[0]?.quantity} rooms
                                </Typography>
                              )}
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1rem",
                                alignItems: "flex-end",
                              }}
                            >
                              <Typography className="room__special-price">
                                {formatPrice(hotel?.rooms[0]?.price)} VND
                              </Typography>
                              <Button
                                className="btn--detail"
                                onClick={() => {
                                  secureLocalStorage.setItem(
                                    "hotelId",
                                    hotel?.hotelID
                                  );
                                  secureLocalStorage.setItem(
                                    "city",
                                    hotel?.hotelAddress?.city
                                  );
                                  secureLocalStorage.setItem(
                                    "hotelLocation",
                                    hotel?.hotelAddress?.city
                                  );
                                  secureLocalStorage.setItem(
                                    "checkInDate",
                                    formatDate(dates[0].startDate, "yyyy-MM-dd")
                                  );
                                  secureLocalStorage.setItem(
                                    "checkOutDate",
                                    formatDate(dates[0].endDate, "yyyy-MM-dd")
                                  );
                                  secureLocalStorage.setItem(
                                    "numberGuest",
                                    options.person
                                  );
                                  secureLocalStorage.setItem(
                                    "numberRoom",
                                    options.room
                                  );
                                  navigate(routes.home.hotelDetails);
                                  document.documentElement.scrollTop = 0;
                                }}
                              >
                                Check Availability
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    );
                  }
                })}

                <Box display="flex">
                  {hotelPage <
                  (listHotelsBySearch?.length === 0
                    ? filteredHotels
                    : filteredSearchHotels
                  )?.length -
                    1 ? (
                    <Box
                      onClick={handleSeeMore}
                      sx={{
                        m: "auto",
                      }}
                    >
                      <Typography
                        sx={{
                          color: themeColors.white,
                          fontSize: 18,
                          textAlign: "center",
                          bgcolor: themeColors.secondary_Default,
                          p: "10px 30px",
                          borderRadius: "8px",
                          transition: "all .2s linear",
                          "&:hover": {
                            cursor: "pointer",
                            bgcolor: themeColors.thirdary_Default,
                          },
                        }}
                      >
                        See more
                      </Typography>
                    </Box>
                  ) : null}
                  {listHotelsBySearch?.length === 0
                    ? filteredHotels?.length === 0 && (
                        <Typography
                          sx={{
                            m: "auto",
                            fontSize: 20,
                            p: "15px 0 0",
                          }}
                        >
                          No hotel found!
                        </Typography>
                      )
                    : filteredSearchHotels?.length === 0 && (
                        <Typography
                          sx={{
                            m: "auto",
                            fontSize: 20,
                            p: "15px 0 0",
                          }}
                        >
                          No hotel found!
                        </Typography>
                      )}
                </Box>
              </Box>
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
        </Box>
      </BoxContainer>

      <FooterCustomer />
    </>
  );
};

export default HotelsListPage;
