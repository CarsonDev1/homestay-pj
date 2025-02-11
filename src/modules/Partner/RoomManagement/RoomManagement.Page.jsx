/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import "./RoomManagement.Style.scss";
import HeaderPartner from "../../../layouts/Header/Partner/HeaderPartner";
import FooterPartner from "../../../layouts/Footer/Partner/FooterPartner";
import BoxContainer from "../../../components/Box/Box.Container";
import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
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
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { calculateTotalRoom, formatPrice } from "../../../utils/helper";
import DeleteRoomModal from "./Modal/DeleteRoom/DeleteRoom.Modal";
import InformationModal from "./Modal/RoomDetails/Information.Modal";
import InformationModalAdd from "./Modal/AddRoom/Information.ModalAdd";
import InformationModalUpdate from "./Modal/UpdateRoom/Information.ModalUpdate";
import { LoadingButton } from "@mui/lab";
import { getAllRoom } from "../Partner.Api";
import secureLocalStorage from "react-secure-storage";
import { URL_IMAGE } from "../../../services/ApiUrl";

const valueStatusRoom = ["Available", "Unavailable"];

const styles = {
  titleTabel: {
    color: themeColors.title,
    fontSize: 17,
    fontWeight: 700,
  },
  cellTable: {
    color: themeColors.black,
    fontSize: 15,
  },
  iconTable: {
    width: "24px",
    height: "24px",
  },
};

const RoomManagementPage = () => {
  const onTopRef = useRef(null);

  const [data, setData] = useState([]);
  const [fetchData, setFetchData] = useState(false);

  const [statusRoom, setStatusRoom] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filterRooms = (room, status) => {
    if (status === "") {
      return room;
    }

    if (status === "Available") {
      return room?.filter((item) => item?.quantity > 0);
    }

    if (status === "Unavailable") {
      return room?.filter((item) => item?.quantity === 0);
    }
  };

  const filteredRoom = filterRooms(data, statusRoom);

  const roomsPerPage = 5;
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRoom = filteredRoom?.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPageRoom = Math.ceil(filteredRoom?.length / roomsPerPage);

  const paginate = (event, value) => {
    event.preventDefault();
    setCurrentPage(value);
    if (onTopRef.current) {
      onTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleStatusRoomChange = (e) => {
    setStatusRoom(e.target.value);
    setCurrentPage(1);
  };

  const init = async () => {
    const res = await getAllRoom(secureLocalStorage.getItem("hotelId"));

    if (res) {
      setData(res);
    }
  };

  useEffect(() => {
    init();
  }, [statusRoom]);

  const checkGetSpecialPrice = (specialPrices) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const specialPrice of specialPrices) {
      const startDate = new Date(specialPrice?.startDate);
      const endDate = new Date(specialPrice?.endDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      if (currentDate >= startDate && currentDate <= endDate) {
        return specialPrice?.price;
      }
    }

    return null;
  };

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

      <BoxContainer property="partner-room__container">
        <Box className="partner-room__content" ref={onTopRef}>
          <Box display="flex" flexDirection="column" gap="1rem">
            <Typography
              sx={{ color: themeColors.title, fontSize: 24, fontWeight: 700 }}
            >
              Room Management
            </Typography>

            <Typography
              sx={{ color: themeColors.title, fontSize: 18, fontWeight: 700 }}
            >
              {calculateTotalRoom(data) <= 1
                ? `Total room: ${calculateTotalRoom(data)}`
                : `Total rooms: ${calculateTotalRoom(data)}`}
            </Typography>
          </Box>

          <Divider sx={{ bgcolor: themeColors.gray }} />

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <FormControl sx={{ minWidth: "30%" }}>
              <Select
                value={statusRoom}
                onChange={handleStatusRoomChange}
                displayEmpty
                size="small"
                sx={{ borderRadius: "8px" }}
              >
                <MenuItem value="">
                  <em style={{ color: "#B2B2B2" }}>
                    -- Choose status of room to filter --
                  </em>
                </MenuItem>
                {valueStatusRoom?.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <InformationModalAdd>
              <Button
                sx={{
                  bgcolor: themeColors.primary_Default,
                  color: themeColors.white,
                  textTransform: "none",
                  fontSize: 16,
                  fontWeight: 700,
                  borderRadius: "10px",
                  p: "6px 20px",
                  "&:hover": {
                    bgcolor: themeColors.primary_600,
                  },
                }}
              >
                Add Room
              </Button>
            </InformationModalAdd>
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
                  <TableRow
                    sx={{
                      background: themeColors.white,
                    }}
                  >
                    <TableCell sx={styles.titleTabel}>Image</TableCell>
                    <TableCell sx={styles.titleTabel}>Type Room</TableCell>
                    <TableCell align="center" sx={styles.titleTabel}>
                      Quantity
                    </TableCell>
                    <TableCell align="center" sx={styles.titleTabel}>
                      Size of Room
                    </TableCell>
                    <TableCell align="center" sx={styles.titleTabel}>
                      Price
                    </TableCell>
                    <TableCell align="center" sx={styles.titleTabel}>
                      Status
                    </TableCell>
                    <TableCell align="center" sx={styles.titleTabel}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentRoom?.map((room) => (
                    <TableRow
                      key={room?.roomID}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>
                        <Avatar
                          src={`${URL_IMAGE}${room?.roomImages[0]?.image}`}
                          alt="Image"
                          sx={{
                            width: "250px",
                            height: "150px",
                            borderRadius: "8px",
                            boxShadow: themeColors.boxShadow,
                            transition: "all .2s linear",
                            "&:hover": {
                              transform: "scale(1.1)",
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={styles.cellTable}>
                        {room?.typeOfRoom}
                      </TableCell>
                      <TableCell align="center" sx={styles.cellTable}>
                        {room?.quantity}
                      </TableCell>
                      <TableCell align="center" sx={styles.cellTable}>
                        {room?.sizeOfRoom} m<sup>2</sup>
                      </TableCell>
                      <TableCell sx={styles.cellTable}>
                        {!checkGetSpecialPrice(room?.specialPrice) ? (
                          <Typography
                            sx={{
                              color: themeColors.black,
                              fontSize: 16,
                              textAlign: "center",
                            }}
                          >
                            {formatPrice(room?.price)} VND
                          </Typography>
                        ) : (
                          <Box
                            display="flex"
                            flexDirection="column"
                            gap="1rem"
                            alignItems="center"
                          >
                            <Typography
                              sx={{
                                textDecoration: "line-through",
                                color: themeColors.gray,
                                fontSize: 15,
                              }}
                            >
                              {formatPrice(room?.price)} VND
                            </Typography>
                            <Typography
                              sx={{
                                color: themeColors.black,
                                fontSize: 16,
                              }}
                            >
                              {formatPrice(
                                checkGetSpecialPrice(room?.specialPrice)
                              )}{" "}
                              VND
                            </Typography>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell align="center" sx={styles.cellTable}>
                        {room?.quantity === 0 ? (
                          <Typography
                            sx={{
                              fontSize: 15,
                              fontWeight: 700,
                              color: themeColors.button_Secondary,
                            }}
                          >
                            Unavailable
                          </Typography>
                        ) : (
                          <Typography
                            sx={{
                              fontSize: 15,
                              fontWeight: 700,
                              color: themeColors.status_Primary,
                            }}
                          >
                            Available
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: ".5rem",
                          }}
                        >
                          <InformationModal
                            data={{
                              listImages: room?.roomImages,
                              typeRoom: room?.typeOfRoom,
                              numberBed: room?.numberOfBed,
                              typeOfBed: room?.typeOfBed,
                              quantity: room?.quantity,
                              numberCapacity: room?.numberCapacity,
                              price: room?.price,
                              size: room?.sizeOfRoom,
                              amenities: room?.roomServices,
                              specialPrice: room?.specialPrice,
                            }}
                          >
                            <IconButton
                              sx={{
                                width: "40px",
                                height: "40px",
                                color: "rgba(0, 0, 0, 0.6)",
                                transition: "all .2s linear",
                                "&:hover": {
                                  color: themeColors.black,
                                },
                              }}
                            >
                              <Visibility sx={styles.iconTable} />
                            </IconButton>
                          </InformationModal>

                          <InformationModalUpdate
                            data={{
                              id: room?.roomID,
                              listImages: room?.roomImages,
                              typeRoom: room?.typeOfRoom,
                              numberBed: room?.numberOfBed,
                              typeOfBed: room?.typeOfBed,
                              quantity: room?.quantity,
                              numberCapacity: room?.numberCapacity,
                              price: room?.price,
                              size: room?.sizeOfRoom,
                              amenities: room?.roomServices,
                              specialPrice: room?.specialPrice,
                            }}
                          >
                            <IconButton
                              sx={{
                                width: "40px",
                                height: "40px",
                                color: themeColors.text_Disabled,
                                transition: "all .2s linear",
                                "&:hover": {
                                  color: themeColors.thirdary_Default,
                                },
                              }}
                            >
                              <Edit sx={styles.iconTable} />
                            </IconButton>
                          </InformationModalUpdate>

                          <DeleteRoomModal
                            data={{
                              id: room?.roomID,
                              typeRoom: room?.typeOfRoom,
                            }}
                          >
                            <IconButton
                              sx={{
                                width: "40px",
                                height: "40px",
                                color: themeColors.button_Secondary,
                                transition: "all .2s linear",
                                opacity: 0.8,
                                "&:hover": {
                                  color: themeColors.button_SecondaryHover,
                                  opacity: 1,
                                },
                              }}
                            >
                              <Delete sx={styles.iconTable} />
                            </IconButton>
                          </DeleteRoomModal>
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
              mt: "20px",
            }}
          >
            {filteredRoom?.length > 0 && (
              <Grid item xs={6} sx={{ alignItems: "center" }}>
                <label>
                  <b>
                    Showing {currentPage} of {totalPageRoom}{" "}
                    {totalPageRoom > 1 ? "pages" : "page"}
                  </b>
                </label>
              </Grid>
            )}
            <Stack sx={{ alignItems: "center" }}>
              {filteredRoom?.length > 0 && (
                <Pagination
                  color="standard"
                  variant="outlined"
                  defaultPage={1}
                  count={totalPageRoom}
                  page={currentPage}
                  onChange={paginate}
                  size="medium"
                  showFirstButton
                  showLastButton
                />
              )}
            </Stack>

            {filteredRoom?.length === 0 && (
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
                    No rooms found!
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

export default RoomManagementPage;
