import {
  Avatar,
  Box,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { themeColors } from "../../../../themes/schemes/PureLightThem";
import { AssetImages } from "../../../../utils/images";
import { formatDateMonthAndDay, renderStars } from "../../../../utils/helper";
import { getFeedbackByHotelId } from "../../Home.Api";
import secureLocalStorage from "react-secure-storage";
import { URL_IMAGE } from "../../../../services/ApiUrl";
import { LoadingButton } from "@mui/lab";
import { getAllRoom } from "../../../Partner/Partner.Api";

const valueRating = [1, 2, 3, 4, 5];

const GuestReviewsPage = () => {
  const onTopRef = useRef(null);

  const [data, setData] = useState({});
  const [fetchData, setFetchData] = useState(false);
  const [valueType, setValueType] = useState([]);

  const [typeRoom, setTypeRoom] = useState("");
  const [rating, setRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const dataReviews = data?.listReview;

  const filteredReview = dataReviews?.filter((review) => {
    return (
      (typeRoom === "" || review?.room?.typeOfRoom === typeRoom) &&
      (rating === 0 || review?.rating === rating)
    );
  });

  const reviewsPerPage = 5;
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReview = filteredReview?.slice(
    indexOfFirstReview,
    indexOfLastReview
  );
  const totalPageReview = Math.ceil(filteredReview?.length / reviewsPerPage);

  const paginate = (event, value) => {
    event.preventDefault();
    setCurrentPage(value);
    if (onTopRef.current) {
      onTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleTypeRoomChange = (e) => {
    setTypeRoom(e.target.value);
    setCurrentPage(1);
  };

  const handleRatingChange = (e) => {
    setRating(e.target.value);
    setCurrentPage(1);
  };

  const init = async () => {
    const res = await getFeedbackByHotelId(
      secureLocalStorage.getItem("hotelId")
    );
    const resRoom = await getAllRoom(secureLocalStorage.getItem("hotelId"));

    if (res) {
      setData(res);
    }
    if (resRoom) {
      setValueType(resRoom);
    }
  };

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

  return (
    <>
      {dataReviews?.length > 0 ? (
        <Box
          ref={onTopRef}
          sx={{
            bgcolor: themeColors.white,
            p: "10px 20px",
            borderRadius: "8px",
            boxShadow: themeColors.boxShadow,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <Typography
              sx={{
                color: themeColors.title,
                fontSize: 24,
                fontWeight: 700,
                mb: "20px",
              }}
            >
              Total Rating
            </Typography>
            <Typography
              sx={{
                color: themeColors.title,
                fontSize: 22,
                fontWeight: 700,
                mb: "20px",
              }}
            >
              {data?.avgRating ? data?.avgRating?.toFixed(1) : 0}/5 -{" "}
              {data?.countFeedback
                ? data?.countFeedback <= 1
                  ? `${data?.countFeedback} review`
                  : `${data?.countFeedback} reviews`
                : `0 reviews`}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: themeColors.bgTitle,
              borderRadius: "4px",
              p: "30px",
              gap: "2rem",
            }}
          >
            <Typography sx={{ flex: 0.4 }}>Filter by:</Typography>

            <FormControl
              size="small"
              sx={{ flex: 2, bgcolor: themeColors.white }}
            >
              <Select
                value={typeRoom}
                onChange={handleTypeRoomChange}
                displayEmpty
                sx={{ borderRadius: "8px" }}
              >
                <MenuItem value="">
                  <em style={{ color: themeColors.gray }}>All rooms</em>
                </MenuItem>
                {valueType?.map((value) => (
                  <MenuItem key={value?.roomID} value={value?.typeOfRoom}>
                    {value?.typeOfRoom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              size="small"
              sx={{ flex: 1, bgcolor: themeColors.white }}
            >
              <Select
                value={rating}
                onChange={handleRatingChange}
                displayEmpty
                sx={{ borderRadius: "8px" }}
              >
                <MenuItem value={0}>
                  <em style={{ color: themeColors.gray }}>All rating</em>
                </MenuItem>
                {valueRating?.map((value, index) => (
                  <MenuItem key={index} value={value}>
                    {value > 1 ? `${value} stars` : `${value} star`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box
            sx={{
              mt: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            {currentReview?.map((item, index) => (
              <>
                <Box sx={{ display: "flex" }} key={item?.feedbackID}>
                  <Box
                    sx={{
                      flex: 2,
                      display: "flex",
                      flexDirection: "column",
                      gap: "2rem",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2rem",
                      }}
                    >
                      <Avatar
                        src={
                          item?.profile?.avatar
                            ? item?.profile?.avatar?.startsWith("/", 0)
                              ? `${URL_IMAGE}${item?.profile?.avatar}`
                              : `${item?.profile?.avatar}`
                            : AssetImages.LOGO
                        }
                        sx={{ width: 100, height: 100 }}
                      />
                      <Typography
                        sx={{
                          color: themeColors.title,
                          fontSize: 20,
                          fontWeight: 700,
                        }}
                      >
                        {item?.profile?.fullName}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: ".5rem",
                          alignItems: "center",
                        }}
                      >
                        <img src={AssetImages.ICONS.BED_2} alt="" />
                        <Typography
                          sx={{ color: themeColors.gray, fontSize: 16 }}
                        >
                          {item?.room?.typeOfRoom}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          gap: ".5rem",
                          alignItems: "center",
                        }}
                      >
                        <img src={AssetImages.ICONS.CALENDAR} alt="" />
                        <Typography
                          sx={{ color: themeColors.gray, fontSize: 16 }}
                        >
                          Stayed In{" "}
                          {formatDateMonthAndDay(item?.booking?.checkInDate)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      flex: 4,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        height: "100%",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        rowGap: "1rem",
                      }}
                    >
                      <Box
                        display="flex"
                        alignItems="flex-start"
                        gap=".5rem"
                        fontSize={17}
                      >
                        Rating: {item?.rating}
                        <Box display="flex" alignItems="center" gap=".5rem">
                          {renderStars(item?.rating)}
                        </Box>
                      </Box>
                      <Typography sx={{ textAlign: "justify" }}>
                        {item?.description}
                      </Typography>

                      {item?.image && (
                        <Box
                          width="40%"
                          minHeight="234.225px"
                          maxHeight="234.225px"
                        >
                          <Avatar
                            src={`${URL_IMAGE}${item?.image}`}
                            alt=""
                            sx={{
                              width: "100%",
                              height: "100%",
                              borderRadius: "6px",
                              boxShadow: themeColors.boxShadow,
                              transition: "all .2s linear",
                              "&:hover": {
                                transform: "scale(1.1)",
                              },
                            }}
                          />
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
                {index !== filteredReview?.length - 1 && (
                  <Divider
                    orientation="horizontal"
                    sx={{
                      width: "100%",
                      height: "1px",
                      bgcolor: themeColors.gray,
                    }}
                  />
                )}
              </>
            ))}
            <Box
              sx={{
                pb: "20px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {filteredReview?.length > 0 && (
                  <Grid item xs={6} sx={{ alignItems: "center" }}>
                    <label>
                      <b>
                        Showing {currentPage} of {totalPageReview}{" "}
                        {totalPageReview > 1 ? "pages" : "page"}
                      </b>
                    </label>
                  </Grid>
                )}
                <Stack sx={{ alignItems: "center" }}>
                  {filteredReview?.length > 0 && (
                    <Pagination
                      color="standard"
                      variant="outlined"
                      defaultPage={1}
                      count={totalPageReview}
                      page={currentPage}
                      onChange={paginate}
                      size="medium"
                      showFirstButton
                      showLastButton
                    />
                  )}
                </Stack>

                {filteredReview?.length === 0 && (
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
                      No reviews found!
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <>
          {fetchData ? (
            <Box
              width="100%"
              p="20px 60px"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Typography
                sx={{
                  fontSize: 20,
                  fontWeight: 400,
                }}
              >
                No reviews found!
              </Typography>
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
      )}
    </>
  );
};

export default GuestReviewsPage;
