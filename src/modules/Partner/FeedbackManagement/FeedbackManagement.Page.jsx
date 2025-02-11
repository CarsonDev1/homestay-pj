/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import "./FeedbackManagement.Style.scss";
import HeaderPartner from "../../../layouts/Header/Partner/HeaderPartner";
import BoxContainer from "../../../components/Box/Box.Container";
import FooterPartner from "../../../layouts/Footer/Partner/FooterPartner";
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
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
  Typography,
} from "@mui/material";
import { themeColors } from "../../../themes/schemes/PureLightThem";
import { calculateAverageRating } from "../../../utils/helper";
import FeedbackDetailsModal from "./Modal/FeedbackDetails/FeedbackDetails.Modal";
import { LoadingButton } from "@mui/lab";
import { getAllReviews } from "../Partner.Api";
import secureLocalStorage from "react-secure-storage";
import { useDispatch } from "react-redux";
import { AssetImages } from "../../../utils/images";

const filterRating = [1, 2, 3, 4, 5];

const styles = {
  titleTabel: {
    color: themeColors.title,
    fontSize: 18,
    fontWeight: 700,
  },
  cellTable: {
    color: themeColors.black,
    fontSize: 16,
  },
};

const FeedbackManagementPage = () => {
  const dispatch = useDispatch();
  const onTopRef = useRef(null);

  const [data, setData] = useState([]);
  const [fetchData, setFetchData] = useState(false);

  const [rating, setRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredFeedback = data?.filter(
    (feedback) => rating === 0 || feedback?.rating === rating
  );

  const reviewsPerPage = 6;
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReview = filteredFeedback?.slice(
    indexOfFirstReview,
    indexOfLastReview
  );
  const totalPageReview = Math.ceil(filteredFeedback?.length / reviewsPerPage);

  const paginate = (event, value) => {
    event.preventDefault();
    setCurrentPage(value);
    if (onTopRef.current) {
      onTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleRatingChange = (e) => {
    setRating(e.target.value);
    setCurrentPage(1);
  };

  const init = async () => {
    const res = await getAllReviews(
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
      <HeaderPartner />

      <BoxContainer property="partner-feedback__container">
        <Box className="partner-feedback__content" ref={onTopRef}>
          <Box display="flex" flexDirection="column" gap="1rem">
            <Typography
              sx={{ color: themeColors.title, fontSize: 24, fontWeight: 700 }}
            >
              Customer's Reviews
            </Typography>

            <Typography
              sx={{ color: themeColors.title, fontSize: 18, fontWeight: 700 }}
            >
              {filteredFeedback?.length
                ? filteredFeedback?.length <= 1
                  ? `Total Review: ${filteredFeedback?.length}`
                  : `Total Reviews: ${filteredFeedback?.length}`
                : `Total Review: 0`}
            </Typography>

            <Typography
              sx={{ color: themeColors.title, fontSize: 18, fontWeight: 700 }}
            >
              Average rating:{" "}
              <span>
                {calculateAverageRating(data)
                  ? calculateAverageRating(data)?.toFixed(1)
                  : 0}
                /5
              </span>
            </Typography>
          </Box>

          <Divider sx={{ bgcolor: themeColors.gray }} />

          <FormControl sx={{ maxWidth: "25%" }}>
            <Select
              value={rating}
              onChange={handleRatingChange}
              displayEmpty
              size="small"
              sx={{ borderRadius: "8px" }}
            >
              <MenuItem value={0}>
                <em style={{ color: "#B2B2B2" }}>
                  -- Choose star rating to filter --
                </em>
              </MenuItem>
              {filterRating.map((item) => (
                <MenuItem key={item} value={item}>
                  {item <= 1 ? `${item} star` : `${item} stars`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
                  <TableRow
                    sx={{
                      background: themeColors.white,
                    }}
                  >
                    <TableCell sx={styles.titleTabel}>
                      Reviewer's Name
                    </TableCell>
                    <TableCell sx={styles.titleTabel}>
                      Reviewer's Description
                    </TableCell>
                    <TableCell align="center" sx={styles.titleTabel}>
                      Star Rating
                    </TableCell>
                    <TableCell align="center" sx={styles.titleTabel}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentReview?.map((review) => (
                    <TableRow
                      key={review?.feedBackID}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell sx={styles.cellTable}>
                        {review?.account?.profile?.fullName}
                      </TableCell>
                      <TableCell sx={{ width: "50%" }}>
                        <Typography
                          sx={{
                            width: "90%",
                            fontSize: 16,
                            display: "-webkit-box",
                            overflow: "hidden",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            transition: "-webkit-line-clamp 0.1s",
                            userSelect: "none",
                          }}
                        >
                          {review?.description}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={styles.cellTable}>
                        <Box
                          display="flex"
                          alignItems="flex-start"
                          gap=".5rem"
                          justifyContent="center"
                        >
                          {review?.rating}
                          <img
                            src={AssetImages.ICONS.STAR}
                            alt=""
                            style={{ width: 21, height: 21 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={styles.cellTable}>
                        <FeedbackDetailsModal
                          data={{
                            id: review?.feedBackID,
                            img: review?.image,
                            name: review?.account?.profile?.fullName,
                            rating: review?.rating,
                            desc: review?.description,
                            status: review?.status,
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
                        </FeedbackDetailsModal>
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
            {filteredFeedback?.length > 0 && (
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
              {filteredFeedback?.length > 0 && (
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

            {filteredFeedback?.length === 0 && (
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
                    No review found!
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </BoxContainer>

      <FooterPartner />
    </>
  );
};

export default FeedbackManagementPage;
