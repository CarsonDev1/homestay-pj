import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { themeColors } from "../../../../themes/schemes/PureLightThem";
import { AssetImages } from "../../../../utils/images";
import { checkLogin, formatPrice } from "../../../../utils/helper";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../../routes";
import RoomDetailsModal from "../../Modal/RoomDetails/RoomDetails.Modal";
import { getAllRoom } from "../../../Partner/Partner.Api";
import secureLocalStorage from "react-secure-storage";
import { URL_IMAGE } from "../../../../services/ApiUrl";
import { LoadingButton } from "@mui/lab";

const RoomsPage = ({ valueStorage }) => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [fetchData, setFetchData] = useState(false);

  const init = async () => {
    const res = await getAllRoom(secureLocalStorage.getItem("hotelId"));

    if (res) {
      setData(res);
    }
  };

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

  const sortRoom = (listRoom) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const newListRoom = listRoom
      ?.map((item) => {
        const newListSpecialPrice = item?.specialPrice?.filter((element) => {
          const startDate = new Date(element?.startDate);
          const endDate = new Date(element?.endDate);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);

          return today >= startDate && today <= endDate;
        });

        if (newListSpecialPrice?.length > 0) {
          return {
            ...item,
            B: [newListSpecialPrice[0], ...item?.specialPrice],
          };
        }
        return item;
      })
      .filter((item) => item?.quantity > 0);

    newListRoom.sort(
      (a, b) => a.specialPrice[0]?.price - b.specialPrice[0]?.price
    );

    return newListRoom;
  };

  const listRoom = sortRoom(data);

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
      {listRoom?.length > 0 ? (
        <>
          {listRoom?.map((room) => (
            <Box key={room?.roomID}>
              {room?.quantity >= 1 && (
                <Box
                  sx={{
                    bgcolor: themeColors.white,
                    borderRadius: "8px",
                    p: "10px 20px",
                    boxShadow: themeColors.boxShadow,
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
                    {room?.typeOfRoom}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "20px",
                    }}
                  >
                    <Box
                      sx={{
                        width: "25%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "2rem",
                      }}
                    >
                      <img
                        loading="lazy"
                        src={
                          room?.roomImages
                            ? `${URL_IMAGE}${room?.roomImages[0]?.image}`
                            : null
                        }
                        alt=""
                        style={{
                          width: "100%",
                          minHeight: "200px",
                          maxHeight: "200px",
                          borderRadius: "6px",
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "1rem",
                          alignItems: "flex-start",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            gap: "1rem",
                            alignItems: "center",
                          }}
                        >
                          <img
                            src={AssetImages.ICONS.BED}
                            alt=""
                            style={{ width: 40, height: 40 }}
                          />
                          <Typography
                            sx={{
                              fontSize: 20,
                              color: themeColors.title,
                              fontWeight: 700,
                            }}
                          >
                            {room?.numberOfBed <= 1
                              ? `${room?.numberOfBed} x ${room?.typeOfBed} Bed`
                              : `${room?.numberOfBed} x ${room?.typeOfBed} Beds`}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            gap: "1rem",
                            alignItems: "center",
                          }}
                        >
                          <img src={AssetImages.ICONS.SIZE_ROOM} alt="" />
                          <Typography
                            sx={{ fontSize: 17, color: themeColors.gray }}
                          >
                            {room?.sizeOfRoom} m<sup>2</sup>
                          </Typography>
                        </Box>

                        {room?.roomServices?.slice(0, 2)?.map((service) =>
                          service?.type === "Toiletries" ? (
                            <Box
                              sx={{
                                display: "flex",
                                gap: "1rem",
                                alignItems: "center",
                              }}
                              key={service?.roomServiceID}
                            >
                              <img
                                src={AssetImages.ICONS.ROOM_SERVICES.TOILET}
                                alt=""
                              />
                              <Typography
                                sx={{ fontSize: 17, color: themeColors.gray }}
                              >
                                {service?.type}
                              </Typography>
                            </Box>
                          ) : service?.type ===
                            "Room Layout and Furnishings" ? (
                            <Box
                              sx={{
                                display: "flex",
                                gap: "1rem",
                                alignItems: "center",
                              }}
                              key={service?.roomServiceID}
                            >
                              <img
                                src={
                                  AssetImages.ICONS.ROOM_SERVICES.ROOM_LAYOUT
                                }
                                alt=""
                              />
                              <Typography
                                sx={{ fontSize: 17, color: themeColors.gray }}
                              >
                                {service?.type}
                              </Typography>
                            </Box>
                          ) : service?.type === "Cleaning Services" ? (
                            <Box
                              sx={{
                                display: "flex",
                                gap: "1rem",
                                alignItems: "center",
                              }}
                              key={service?.roomServiceID}
                            >
                              <img
                                src={AssetImages.ICONS.ROOM_SERVICES.CLEANING}
                                alt=""
                              />
                              <Typography
                                sx={{ fontSize: 17, color: themeColors.gray }}
                              >
                                {service?.type}
                              </Typography>
                            </Box>
                          ) : service?.type === "Bathroom facilities" ||
                            service?.type === "Bathroom Facilities" ? (
                            <Box
                              sx={{
                                display: "flex",
                                gap: "1rem",
                                alignItems: "center",
                              }}
                              key={service?.roomServiceID}
                            >
                              <img
                                src={AssetImages.ICONS.ROOM_SERVICES.BATHROOM}
                                alt=""
                              />
                              <Typography
                                sx={{ fontSize: 17, color: themeColors.gray }}
                              >
                                {service?.type}
                              </Typography>
                            </Box>
                          ) : service?.type === "Outdoor View" ? (
                            <Box
                              sx={{
                                display: "flex",
                                gap: "1rem",
                                alignItems: "center",
                              }}
                              key={service?.roomServiceID}
                            >
                              <img
                                src={AssetImages.ICONS.ROOM_SERVICES.OUTDOOR}
                                alt=""
                              />
                              <Typography
                                sx={{ fontSize: 17, color: themeColors.gray }}
                              >
                                {service?.type}
                              </Typography>
                            </Box>
                          ) : service?.type === "Food & Drinks" ? (
                            <Box
                              sx={{
                                display: "flex",
                                gap: "1rem",
                                alignItems: "center",
                              }}
                              key={service?.roomServiceID}
                            >
                              <img
                                src={AssetImages.ICONS.ROOM_SERVICES.FOOD}
                                alt=""
                              />
                              <Typography
                                sx={{ fontSize: 17, color: themeColors.gray }}
                              >
                                {service?.type}
                              </Typography>
                            </Box>
                          ) : null
                        )}

                        <RoomDetailsModal
                          data={{
                            id: room?.roomID,
                            imgs: room?.roomImages,
                            typeRoom: room?.typeOfRoom,
                            numberBed: room?.numberOfBed,
                            typeBed: room?.typeOfBed,
                            sizeRoom: room?.sizeOfRoom,
                            amenities: room?.roomServices,
                            valueStorage: valueStorage,
                          }}
                        >
                          <Typography
                            sx={{
                              color: themeColors.primary_Default,
                              fontSize: 16,
                              fontWeight: 500,
                              "&:hover": {
                                cursor: "pointer",
                                color: themeColors.primary_600,
                                textDecoration: "underline",
                              },
                            }}
                          >
                            Room Details
                          </Typography>
                        </RoomDetailsModal>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        width: "73%",
                        height: "64.5vh",
                        border: `1px solid ${themeColors.gray}`,
                        borderRadius: "6px",
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            flex: 1.5,
                            borderRight: `1px solid ${themeColors.gray}`,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              width: "100%",
                              textAlign: "center",
                              color: themeColors.title,
                              fontSize: 18,
                              fontWeight: 700,
                              p: "10px",
                              bgcolor: themeColors.bgTitle,
                              borderRadius: "6px 0 0 0",
                            }}
                          >
                            Summary
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "1rem",
                              p: "3rem 10px 10px",
                            }}
                          >
                            <span
                              style={{
                                display: "flex",
                                gap: ".3rem",
                                color: themeColors.text_Link,
                                fontWeight: 700,
                              }}
                            >
                              Free cancellation
                              <Typography sx={{ color: themeColors.black }}>
                                {" "}
                                24 hours in advance
                              </Typography>
                            </span>
                            <Typography sx={{}}>
                              Pay at the
                              <span
                                style={{
                                  color: themeColors.text_Link,
                                  fontWeight: 700,
                                }}
                              >
                                {" "}
                                front desk
                              </span>
                            </Typography>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            width: "100%",
                            flex: 1,
                            borderRight: `1px solid ${themeColors.gray}`,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              width: "100%",
                              textAlign: "center",
                              color: themeColors.title,
                              fontSize: 18,
                              p: "10px",
                              bgcolor: themeColors.bgTitle,
                              fontWeight: 700,
                            }}
                          >
                            Capacity
                          </Typography>
                          <Typography sx={{ p: "3rem 10px 10px" }}>
                            {room.numberCapacity > 1
                              ? `${room.numberCapacity} people`
                              : `${room.numberCapacity} person`}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            width: "100%",
                            flex: 2,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            sx={{
                              width: "100%",
                              textAlign: "center",
                              color: themeColors.title,
                              fontSize: 18,
                              p: "10px",
                              bgcolor: themeColors.bgTitle,
                              fontWeight: 700,
                              borderRadius: "0 6px 0 0",
                            }}
                          >
                            Today's Price
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "1rem",
                              p: "0 15px 15px 0",
                              alignItems: "flex-end",
                            }}
                          >
                            {room?.quantity <= 5 && (
                              <Typography
                                sx={{
                                  color: themeColors.button_Secondary,
                                  fontSize: 17,
                                }}
                              >
                                Only {room?.quantity === 1 ? "have" : "has"}
                                {room?.quantity === 1
                                  ? `${" "}${room?.quantity} room`
                                  : `${" "}${room?.quantity} rooms`}
                              </Typography>
                            )}
                            {!checkGetSpecialPrice(room?.specialPrice) ? (
                              <Typography
                                sx={{
                                  color: themeColors.title,
                                  fontSize: 24,
                                  fontWeight: 700,
                                }}
                              >
                                VND {formatPrice(room?.price)}
                              </Typography>
                            ) : (
                              <>
                                <Typography
                                  sx={{
                                    color: themeColors.gray,
                                    textDecoration: "line-through",
                                    fontSize: 22,
                                  }}
                                >
                                  {formatPrice(room?.price)} VND
                                </Typography>
                                <Typography
                                  sx={{
                                    color: themeColors.title,
                                    fontSize: 24,
                                    fontWeight: 700,
                                  }}
                                >
                                  {formatPrice(
                                    checkGetSpecialPrice(room?.specialPrice)
                                  )}{" "}
                                  VND
                                </Typography>
                              </>
                            )}
                            <Button
                              onClick={() => {
                                if (checkLogin()) {
                                  secureLocalStorage.setItem(
                                    "roomId",
                                    room?.roomID
                                  );
                                  if (valueStorage) {
                                    secureLocalStorage.setItem(
                                      "checkInDate",
                                      valueStorage?.checkIn
                                    );
                                    secureLocalStorage.setItem(
                                      "checkOutDate",
                                      valueStorage?.checkOut
                                    );
                                    secureLocalStorage.setItem(
                                      "numberGuest",
                                      valueStorage?.numberGuest
                                    );
                                    secureLocalStorage.setItem(
                                      "numberRoom",
                                      valueStorage?.numberRoom
                                    );
                                  }
                                  navigate(routes.home.createBooking);
                                  document.documentElement.scrollTop = 0;
                                } else {
                                  navigate(routes.auth.login);
                                }
                              }}
                              sx={{
                                bgcolor: themeColors.primary_Default,
                                textTransform: "none",
                                color: themeColors.white,
                                fontSize: 20,
                                fontWeight: 700,
                                p: "5px 70px",
                                borderRadius: "12px",
                                "&:hover": {
                                  bgcolor: themeColors.primary_600,
                                },
                              }}
                            >
                              Reserve
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          ))}
        </>
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
                No rooms found!
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

export default RoomsPage;
