import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { themeColors } from "../../../../themes/schemes/PureLightThem";
import { Close } from "@mui/icons-material";
import { URL_IMAGE } from "../../../../services/ApiUrl";
import { AssetImages } from "../../../../utils/images";
import { useNavigate } from "react-router-dom";
import { checkLogin } from "../../../../utils/helper";
import { routes } from "../../../../routes";
import secureLocalStorage from "react-secure-storage";

const styles = {
  label: {
    fontSize: 20,
    fontWeight: 700,
  },
};

const RoomDetailsModal = ({ children, data }) => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(data?.imgs[0]?.image);

  const handleNavigate = () => {
    if (checkLogin()) {
      secureLocalStorage.setItem("roomId", data?.id);
      if (data?.valueStorage) {
        secureLocalStorage.setItem("checkInDate", data?.valueStorage?.checkIn);
        secureLocalStorage.setItem(
          "checkOutDate",
          data?.valueStorage?.checkOut
        );
        secureLocalStorage.setItem(
          "numberGuest",
          data?.valueStorage?.numberGuest
        );
        secureLocalStorage.setItem(
          "numberRoom",
          data?.valueStorage?.numberRoom
        );
      }
      navigate(routes.home.createBooking);
      document.documentElement.scrollTop = 0;
    } else {
      navigate(routes.auth.login);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeImage = (img) => {
    setImage(img);
  };

  return (
    <>
      {React.cloneElement(children, {
        onClick: handleOpen,
      })}
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{ fontSize: 24, fontWeight: 700, color: themeColors.title }}
          >
            {data?.typeRoom}
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap="2rem">
            <Box display="flex" flexDirection="column" gap="1rem">
              <Typography sx={styles.label}>Images</Typography>
              <img
                loading="lazy"
                src={`${URL_IMAGE}${image}`}
                alt=""
                style={{
                  width: "100%",
                  minHeight: "450px",
                  maxHeight: "450px",
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
              />

              {data?.imgs?.length > 1 && (
                <Box display="flex" gap="1rem" width="100%">
                  {data?.imgs?.map((img) => (
                    <Box
                      key={img?.image}
                      width="20%"
                      height="100px"
                      onClick={() => handleChangeImage(img?.image)}
                      sx={{
                        borderRadius: "8px",
                        transition: "all .2s linear",
                        "&:hover": {
                          cursor: "pointer",
                          boxShadow: themeColors.boxShadow,
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      <img
                        loading="lazy"
                        src={`${URL_IMAGE}${img?.image}`}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            <Box display="flex" alignItems="center" gap="2rem">
              <Box
                flex={2}
                display="flex"
                flexDirection="column"
                gap="1rem"
                height="84px"
              >
                <Typography sx={styles.label}>Bed</Typography>
                <Box
                  sx={{
                    width: "100%",
                    border: `1px solid ${themeColors.gray}`,
                    p: "8px 14px",
                    borderRadius: "6px",
                    height: "45px",
                    fontSize: 16,
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  {data?.numberBed <= 1
                    ? `${data?.numberBed} ${data?.typeBed} Bed`
                    : `${data?.numberBed} ${data?.typeBed} Beds`}
                </Box>
              </Box>
              <Box
                flex={1}
                display="flex"
                flexDirection="column"
                gap="1rem"
                height="84px"
              >
                <Typography sx={styles.label}>Size</Typography>
                <Box
                  sx={{
                    width: "100%",
                    border: `1px solid ${themeColors.gray}`,
                    p: "8px 14px",
                    borderRadius: "6px",
                    height: "45px",
                    fontSize: 16,
                  }}
                >
                  {data?.sizeRoom} m<sup>2</sup>
                </Box>
              </Box>
            </Box>

            <Box display="flex" flexDirection="column" gap="1rem">
              <Typography sx={styles.label}>Amenities</Typography>
              {data?.amenities?.map((service) => (
                <Box
                  key={service?.roomServiceID}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 18,
                      color: themeColors.title,
                      fontWeight: 700,
                    }}
                  >
                    {service?.type}
                  </Typography>
                  <Box
                    display="flex"
                    alignItems="center"
                    flexWrap="wrap"
                    gap="1.5rem"
                  >
                    {service?.roomSubServices?.map((subService) => (
                      <Box
                        key={subService?.subServiceID}
                        sx={{
                          width: "31%",
                          display: "flex",
                          alignItems: "center",
                          gap: ".5rem",
                        }}
                      >
                        <img
                          src={AssetImages.ICONS.CHECKED}
                          alt=""
                          style={{
                            minWidth: 24,
                            maxWidth: 24,
                            minHeight: 24,
                            maxHeight: 24,
                          }}
                        />
                        <Typography>{subService?.subName}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "flex-end" }}>
          <Button
            onClick={handleNavigate}
            sx={{
              bgcolor: themeColors.primary_Default,
              color: themeColors.white,
              p: "5px 40px",
              borderRadius: "8px",
              textTransform: "none",
              fontSize: 18,
              fontWeight: 700,
              "&:hover": {
                bgcolor: themeColors.primary_600,
              },
            }}
          >
            Select Room
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RoomDetailsModal;
