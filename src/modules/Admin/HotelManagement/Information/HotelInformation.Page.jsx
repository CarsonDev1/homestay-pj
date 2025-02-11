/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import "./HotelInformation.Style.scss";
import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { themeColors } from "../../../../themes/schemes/PureLightThem";
import { SearchOutlined } from "@mui/icons-material";
import { AssetImages } from "../../../../utils/images";
import { formatPrice } from "../../../../utils/helper";
import BlockHotelModal from "./Modal/BlockHotel/BlockHotel.Modal";
import InformationDetailsModal from "./Modal/HotelDetails/InformationDetails.Modal";
import { getAllHotelInformation, searchHotel } from "../../Admin.Api";
import { URL_IMAGE } from "../../../../services/ApiUrl";
import { LoadingButton } from "@mui/lab";

const hotelStandardValue = [1, 2, 3, 4, 5];
const statusValue = [true, false];

const styles = {
  titleTable: {
    color: themeColors.title,
    fontSize: 18,
    fontWeight: 700,
    p: "10px 0",
  },
  cellTable: {
    color: themeColors.black,
    p: "15px 10px",
    fontSize: 16,
  },
};

const HotelInformationPage = () => {
  const onTopRef = useRef(null);

  const [data, setData] = useState([]);
  const [dataSearch, setDataSearch] = useState([]);
  const [fetchData, setFetchData] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [hotelStandard, setHotelStandard] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);

  const init = async () => {
    const res = await getAllHotelInformation();
    if (res) {
      setData(res);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = async () => {
    if (search.trim() === "") {
      setDataSearch([]);
    } else {
      const searchRes = await searchHotel(search.toLowerCase().trim());
      setCurrentPage(1);
      if (searchRes) {
        setDataSearch(searchRes);
      } else {
        setDataSearch([]);
      }
    }
  };

  const filterHotel = (dataHotels) => {
    return dataHotels?.filter((hotel) => {
      return (
        (status === "" || hotel?.status === status) &&
        (hotelStandard === 0 || hotel?.hotelStandar === hotelStandard)
      );
    });
  };

  const filteredHotel = filterHotel(data);
  const filteredSearchHotels = filterHotel(dataSearch);

  const hotelsPerPage = 6;
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotel =
    dataSearch?.length > 0
      ? filteredSearchHotels?.slice(indexOfFirstHotel, indexOfLastHotel)
      : filteredHotel?.slice(indexOfFirstHotel, indexOfLastHotel);
  const totalPageHotel = Math.ceil(
    dataSearch?.length > 0
      ? filteredSearchHotels?.length / hotelsPerPage
      : filteredHotel?.length / hotelsPerPage
  );

  const paginate = (event, value) => {
    event.preventDefault();
    setCurrentPage(value);
    if (onTopRef.current) {
      onTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleHotelStandardChange = (e) => {
    setHotelStandard(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    init();
  }, [data]);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setFetchData(true);
    }, 3000);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  useEffect(() => {}, [status, hotelStandard, search]);

  return (
    <Box className="admin-hotel-infor__container" ref={onTopRef}>
      <Box className="admin-hotel-infor__content">
        <Box display="flex" flexDirection="column" gap="1rem">
          <Typography
            sx={{ color: themeColors.title, fontSize: 24, fontWeight: 700 }}
          >
            Hotel Information
          </Typography>
          <Typography
            sx={{ color: themeColors.title, fontSize: 20, fontWeight: 700 }}
          >
            {fetchData
              ? dataSearch?.length > 0
                ? `Total Hotels: ${filteredSearchHotels?.length}`
                : filteredHotel?.length > 0
                ? `Total Hotels: ${filteredHotel?.length}`
                : `Total Hotel: ${filteredHotel?.length}`
              : `Total Hotel: 0`}
          </Typography>
        </Box>

        {fetchData ? (
          <>
            <Divider sx={{ bgcolor: themeColors.gray }} />

            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <TextField
                label="Search"
                placeholder="Search here..."
                value={search}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchOutlined />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: "30%",
                }}
                size="small"
              />

              <FormControl sx={{ minWidth: "30%" }}>
                <Select
                  value={status}
                  onChange={handleStatusChange}
                  displayEmpty
                  size="small"
                  sx={{ borderRadius: "4px" }}
                >
                  <MenuItem value="">
                    <em style={{ color: "#B2B2B2" }}>
                      -- Choose status to filter --
                    </em>
                  </MenuItem>
                  {statusValue?.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item ? `Active` : `Inactive`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: "30%" }}>
                <Select
                  value={hotelStandard}
                  onChange={handleHotelStandardChange}
                  displayEmpty
                  size="small"
                  sx={{ borderRadius: "4px" }}
                >
                  <MenuItem value={0}>
                    <em style={{ color: "#B2B2B2" }}>
                      -- Choose hotel standard to filter --
                    </em>
                  </MenuItem>
                  {hotelStandardValue?.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item <= 1 ? `${item} star` : `${item} stars`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box>
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
                    <TableRow>
                      <TableCell sx={styles.titleTable}>Hotel's Name</TableCell>
                      <TableCell sx={styles.titleTable} align="center">
                        Hotel Standard
                      </TableCell>
                      <TableCell sx={styles.titleTable} align="center">
                        Total Bookings
                      </TableCell>
                      <TableCell sx={styles.titleTable} align="center">
                        Total Revenues
                      </TableCell>
                      <TableCell sx={styles.titleTable} align="center">
                        Status
                      </TableCell>
                      <TableCell sx={styles.titleTable} align="center">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentHotel?.map((hotel) => (
                      <TableRow
                        key={hotel?.hotelID}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell sx={styles.cellTable}>
                          <Box display="flex" alignItems="center" gap="1rem">
                            <Avatar
                              src={`${URL_IMAGE}${hotel?.mainImage}`}
                              sx={{
                                width: "130px",
                                height: "80px",
                                borderRadius: "8px",
                                boxShadow: themeColors.boxShadow,
                                transition: "all .2s linear",
                                "&:hover": {
                                  transform: "scale(1.1)",
                                },
                              }}
                            />
                            <Typography
                              sx={{
                                display: "-webkit-box",
                                overflow: "hidden",
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                                transition: "-webkit-line-clamp 0.1s",
                              }}
                            >
                              {hotel?.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={styles.cellTable}>
                          <Box
                            width="100%"
                            display="flex"
                            alignItems="flex-start"
                            justifyContent="center"
                            gap=".5rem"
                          >
                            <Typography>{hotel?.hotelStandar}</Typography>
                            <img
                              src={AssetImages.ICONS.STAR}
                              alt=""
                              style={{ width: 20, height: 20 }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell align="center" sx={styles.cellTable}>
                          {formatPrice(hotel?.totalBooking)}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: themeColors.black,
                            p: "10px",
                            fontSize: 16,
                            textAlign: "center",
                          }}
                        >
                          {formatPrice(Math.ceil(hotel?.totalRevenue))} VND
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color:
                              hotel?.status === true
                                ? themeColors.status_Primary
                                : themeColors.button_Secondary,
                            fontSize: 16,
                            fontWeight: 700,
                          }}
                        >
                          {hotel?.status === true ? "Active" : "Inactive"}
                        </TableCell>
                        <TableCell sx={styles.cellTable}>
                          <Box
                            display="flex"
                            alignItems="flex-start"
                            gap="1rem"
                          >
                            <InformationDetailsModal
                              data={{
                                img: hotel?.mainImage,
                                name: hotel?.name,
                                totalRevenue: hotel?.totalRevenue,
                                totalBooking: hotel?.totalBooking,
                                averageRating: hotel?.avgRating,
                                numberReviews: hotel?.feedBack?.length,
                                opened: hotel?.openedIn,
                                address: hotel?.hotelAddress?.address,
                                city: hotel?.hotelAddress?.city,
                                standard: hotel?.hotelStandar,
                                amenities: hotel.hotelService,
                                owner: hotel?.account,
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
                            </InformationDetailsModal>

                            <BlockHotelModal
                              data={{
                                id: hotel?.hotelID,
                                name: hotel?.name,
                              }}
                            >
                              <Button
                                sx={{
                                  bgcolor: themeColors.button_Secondary,
                                  color: themeColors.white,
                                  textTransform: "none",
                                  fontSize: 16,
                                  borderRadius: "10px",
                                  p: "6px 20px",
                                  "&:hover": {
                                    bgcolor: themeColors.button_SecondaryHover,
                                  },
                                  "&:disabled": {
                                    color: themeColors.white,
                                    bgcolor: "rgba(241, 69, 66, .7)",
                                  },
                                }}
                                disabled={!hotel?.status}
                              >
                                {!hotel?.status ? "Blocked" : "Block"}
                              </Button>
                            </BlockHotelModal>
                          </Box>
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
              }}
            >
              {dataSearch?.length > 0
                ? filteredSearchHotels?.length > 0 && (
                    <Grid item xs={6} sx={{ alignItems: "center" }}>
                      <label>
                        <b>
                          Showing {currentPage} of {totalPageHotel}{" "}
                          {totalPageHotel > 1 ? "pages" : "page"}
                        </b>
                      </label>
                    </Grid>
                  )
                : filteredHotel?.length > 0 && (
                    <Grid item xs={6} sx={{ alignItems: "center" }}>
                      <label>
                        <b>
                          Showing {currentPage} of {totalPageHotel}{" "}
                          {totalPageHotel > 1 ? "pages" : "page"}
                        </b>
                      </label>
                    </Grid>
                  )}
              <Stack sx={{ alignItems: "center" }}>
                {dataSearch?.length > 0
                  ? filteredSearchHotels?.length > 0 && (
                      <Pagination
                        color="standard"
                        variant="outlined"
                        defaultPage={1}
                        count={totalPageHotel}
                        page={currentPage}
                        onChange={paginate}
                        size="medium"
                        showFirstButton
                        showLastButton
                      />
                    )
                  : filteredHotel?.length > 0 && (
                      <Pagination
                        color="standard"
                        variant="outlined"
                        defaultPage={1}
                        count={totalPageHotel}
                        page={currentPage}
                        onChange={paginate}
                        size="medium"
                        showFirstButton
                        showLastButton
                      />
                    )}
              </Stack>

              {dataSearch?.length > 0
                ? filteredSearchHotels?.length === 0 && (
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
                        No hotel found!
                      </Typography>
                    </Box>
                  )
                : filteredHotel?.length === 0 && (
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
                        No hotel found!
                      </Typography>
                    </Box>
                  )}
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
    </Box>
  );
};

export default HotelInformationPage;
