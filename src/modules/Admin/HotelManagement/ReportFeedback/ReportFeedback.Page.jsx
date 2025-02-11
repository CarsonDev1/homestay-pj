/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import "./ReportFeedback.Style.scss";
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
import { themeColors } from "../../../../themes/schemes/PureLightThem";
import ReportDetailsModal from "./Modal/ReportDetails/ReportDetails.Modal";
import { LoadingButton } from "@mui/lab";
import { getAllReportFeedback } from "../../Admin.Api";

const styles = {
  titleTable: {
    color: themeColors.title,
    fontSize: 18,
    fontWeight: 700,
  },
  cellTable: {
    color: themeColors.black,
    fontSize: 16,
  },
};

const statusValue = ["Awaiting Approval", "Approved", "Rejected"];

const ReportFeedbackPage = () => {
  const onTopRef = useRef(null);

  const [data, setData] = useState([]);
  const [fetchData, setFetchData] = useState(false);

  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredReport = data?.filter(
    (report) => status === "" || report?.status === status
  );

  const reviewsPerPage = 7;
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReview = filteredReport?.slice(
    indexOfFirstReview,
    indexOfLastReview
  );
  const totalPageReview = Math.ceil(filteredReport?.length / reviewsPerPage);

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

  const init = async () => {
    const res = await getAllReportFeedback();
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
    }, 3000);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  return (
    <Box className="admin-feedback-report__container" ref={onTopRef}>
      <Box className="admin-feedback-report__content">
        <Box display="flex" flexDirection="column" gap="1rem">
          <Typography
            sx={{ color: themeColors.title, fontSize: 24, fontWeight: 700 }}
          >
            Feedback Report
          </Typography>
          <Typography
            sx={{ color: themeColors.title, fontSize: 20, fontWeight: 700 }}
          >
            {fetchData
              ? filteredReport?.length <= 1
                ? `Total Report: ${filteredReport?.length}`
                : `Total Reports: ${filteredReport?.length}`
              : `Total Report: 0`}
          </Typography>
        </Box>

        {fetchData ? (
          <>
            <Divider sx={{ bgcolor: themeColors.gray }} />

            <FormControl sx={{ maxWidth: "30%" }}>
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
                    {item}
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
                    <TableRow>
                      <TableCell sx={styles.titleTable}>
                        Reviewer's Name
                      </TableCell>
                      <TableCell sx={styles.titleTable}>
                        Reviewer's Description
                      </TableCell>
                      <TableCell sx={styles.titleTable}>
                        Reporter's Email
                      </TableCell>
                      <TableCell sx={styles.titleTable}>
                        Reason Report
                      </TableCell>
                      <TableCell align="center" sx={styles.titleTable}>
                        Status
                      </TableCell>
                      <TableCell align="center" sx={styles.titleTable}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentReview.map((feedback) => (
                      <TableRow
                        key={feedback?.reportID}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell
                          sx={{
                            width: "22%",
                            color: themeColors.black,
                            fontSize: 16,
                          }}
                        >
                          {feedback?.feedBack?.account?.profile?.fullName}
                        </TableCell>
                        <TableCell sx={{ width: "35%" }}>
                          <Typography
                            sx={{
                              width: "95%",
                              fontSize: 16,
                              display: "-webkit-box",
                              overflow: "hidden",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                              transition: "-webkit-line-clamp 0.1s",
                              userSelect: "none",
                            }}
                          >
                            {feedback?.feedBack?.description}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: 16, width: "20%" }}>
                          {feedback?.reporterEmail}
                        </TableCell>
                        <TableCell sx={{ width: "40%" }}>
                          <Typography
                            sx={{
                              width: "95%",
                              fontSize: 16,
                              display: "-webkit-box",
                              overflow: "hidden",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                              transition: "-webkit-line-clamp 0.1s",
                              userSelect: "none",
                            }}
                          >
                            {feedback?.reasonReport}
                          </Typography>
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color:
                              feedback?.status === "Awaiting Approval"
                                ? themeColors.status_Secondary
                                : feedback?.status === "Approved"
                                ? themeColors.status_Primary
                                : themeColors.button_Secondary,
                            fontSize: 16,
                            fontWeight: 700,
                          }}
                        >
                          {feedback?.status}
                        </TableCell>
                        <TableCell sx={styles.cellTable}>
                          <ReportDetailsModal
                            data={{
                              id: feedback?.reportID,
                              reviewerImg: feedback?.feedBack?.image,
                              reviewerName:
                                feedback?.feedBack?.account?.profile?.fullName,
                              reviewerDesc: feedback?.feedBack?.description,
                              reviewerRating: feedback?.feedBack?.rating,
                              reporterEmail: feedback?.reporterEmail,
                              reasonReport: feedback?.reasonReport,
                              status: feedback?.status,
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
                          </ReportDetailsModal>
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
              {filteredReport?.length > 0 && (
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
                {filteredReport?.length > 0 && (
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

              {filteredReport?.length === 0 && (
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
                    No report found!
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

export default ReportFeedbackPage;
