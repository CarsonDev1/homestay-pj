import React, { useEffect, useRef, useState } from "react";
import "./RegisteringHotel.Style.scss";
import {
  Box,
  Button,
  Divider,
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
import { themeColors } from "../../../../themes/schemes/PureLightThem";
import { formatPhoneNumber } from "../../../../utils/helper";
import InformationDetailsModal from "./Modal/HotelDetails/InformationDetails.Modal";
import {
  approveRegisteringHotel,
  getAllRegisteringHotel,
} from "../../Admin.Api";
import { LoadingButton } from "@mui/lab";
import RejectHotelModal from "./Modal/RejectHotel/RejectHotel.Modal";
import { Bounce, toast } from "react-toastify";

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

const RegisteringHotelPage = () => {
  const onTopRef = useRef(null);

  const [data, setData] = useState([]);

  const [fetchData, setFetchData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const hotelsPerPage = 8;
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotel = data?.slice(indexOfFirstHotel, indexOfLastHotel);
  const totalPageHotel = Math.ceil(data?.length / hotelsPerPage);

  const paginate = (event, value) => {
    event.preventDefault();
    setCurrentPage(value);
    if (onTopRef.current) {
      onTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const init = async () => {
    const res = await getAllRegisteringHotel();
    if (res) {
      setData(res);
    }
  };

  const handleApprove = async (hotelId) => {
    let formData = new FormData();

    formData.append("hotelID", hotelId);

    const res = await approveRegisteringHotel(formData);

    if (res.status === 200) {
      toast.success("Approve hotel success!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        pauseOnFocusLoss: false,
      });
    } else {
      toast.error("Approve hotel error!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        pauseOnFocusLoss: false,
      });
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
    <Box className="admin-hotel-register__container" ref={onTopRef}>
      <Box className="admin-hotel-register__content">
        <Box display="flex" flexDirection="column" gap="1rem">
          <Typography
            sx={{ color: themeColors.title, fontSize: 24, fontWeight: 700 }}
          >
            Hotel Registration
          </Typography>
          <Typography
            sx={{ color: themeColors.title, fontSize: 20, fontWeight: 700 }}
          >
            {fetchData
              ? data?.length <= 1
                ? `Total Hotel: ${data?.length}`
                : `Total Hotels: ${data?.length}`
              : `Total Hotel: 0`}
          </Typography>
        </Box>

        {fetchData ? (
          <>
            <Divider sx={{ bgcolor: themeColors.gray }} />

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
                        Subcriber Name
                      </TableCell>
                      <TableCell sx={styles.titleTable}>
                        Subcriber Email
                      </TableCell>
                      <TableCell sx={styles.titleTable}>
                        Subcriber Phone
                      </TableCell>
                      <TableCell sx={styles.titleTable}>Hotel Name</TableCell>
                      <TableCell align="center" sx={styles.titleTable}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {currentHotel?.map((item) => (
                      <TableRow
                        key={item?.hotelID}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell
                          sx={{
                            width: "16%",
                            color: themeColors.black,
                            fontSize: 16,
                          }}
                        >
                          <Typography
                            sx={{
                              display: "-webkit-box",
                              overflow: "hidden",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                              transition: "-webkit-line-clamp 0.1s",
                            }}
                          >
                            {item?.account?.profile?.fullName}
                          </Typography>
                        </TableCell>
                        <TableCell sx={styles.cellTable}>
                          {item?.account?.email}
                        </TableCell>
                        <TableCell sx={styles.cellTable}>
                          {formatPhoneNumber(item?.account?.phone)}
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "16%",
                            color: themeColors.black,
                            fontSize: 16,
                          }}
                        >
                          <Typography
                            sx={{
                              display: "-webkit-box",
                              overflow: "hidden",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                              transition: "-webkit-line-clamp 0.1s",
                            }}
                          >
                            {item?.name}
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            color: themeColors.black,
                            fontSize: 16,
                            p: "16px 10px",
                          }}
                        >
                          <Box
                            width="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            gap="1rem"
                          >
                            <InformationDetailsModal
                              data={{
                                id: item?.hotelID,
                                img: item?.mainImage,
                                name: item?.name,
                                opened: item?.openedIn,
                                address: item?.hotelAddress?.address,
                                desc: item?.description,
                                amenities: item?.hotelServices,
                                subscriberAvt: item?.account?.profile?.avatar,
                                subscriberName:
                                  item?.account?.profile?.fullName,
                                subscriberEmail: item?.account?.email,
                                subscriberPhone: item?.account?.phone,
                              }}
                            >
                              <Button
                                sx={{
                                  bgcolor: themeColors.white,
                                  color: themeColors.text_Link,
                                  textTransform: "none",
                                  fontSize: 16,
                                  border: `1px solid ${themeColors.thirdary_Default}`,
                                  borderRadius: "10px",
                                  p: "6px 20px",
                                  "&:hover": {
                                    bgcolor: themeColors.bg_Disabled,
                                  },
                                }}
                              >
                                View
                              </Button>
                            </InformationDetailsModal>

                            <Button
                              onClick={() => handleApprove(item?.hotelID)}
                              sx={{
                                bgcolor: themeColors.primary_Default,
                                color: themeColors.white,
                                textTransform: "none",
                                fontSize: 16,
                                border: `1px solid ${themeColors.primary_Default}`,
                                borderRadius: "10px",
                                p: "6px 20px",
                                "&:hover": {
                                  bgcolor: themeColors.primary_600,
                                },
                              }}
                            >
                              Approve
                            </Button>

                            <RejectHotelModal data={{ id: item?.hotelID }}>
                              <Button
                                sx={{
                                  bgcolor: themeColors.button_Secondary,
                                  color: themeColors.white,
                                  textTransform: "none",
                                  fontSize: 16,
                                  border: `1px solid ${themeColors.button_Secondary}`,
                                  borderRadius: "10px",
                                  p: "6px 20px",
                                  "&:hover": {
                                    bgcolor: themeColors.button_SecondaryHover,
                                  },
                                }}
                              >
                                Reject
                              </Button>
                            </RejectHotelModal>
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
              {data?.length > 0 && (
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
                {data?.length > 0 && (
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

              {data?.length === 0 && (
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

export default RegisteringHotelPage;
