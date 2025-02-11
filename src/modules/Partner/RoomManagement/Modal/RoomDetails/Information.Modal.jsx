import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { themeColors } from "../../../../../themes/schemes/PureLightThem";
import { Close } from "@mui/icons-material";
import { formatPrice } from "../../../../../utils/helper";
import AmenitiesModal from "./Amenities.Modal";
import { URL_IMAGE } from "../../../../../services/ApiUrl";

const styles = {
  label: {
    fontSize: 20,
    fontWeight: 700,
  },
  data: {
    p: "8px 14px",
    bgcolor: "transparent",
    color: themeColors.black,
    fontSize: 16,
    border: `1px solid ${themeColors.gray}`,
    borderRadius: "6px",
    textAlign: "justify",
  },
  subLabel: {
    fontSize: 16,
    fontWeight: 700,
  },
};

const InformationModal = ({ children, data }) => {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState(data?.listImages[0]?.image);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeImage = (img) => {
    setImages(img);
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
            sx={{ color: themeColors.title, fontSize: 24, fontWeight: 700 }}
          >
            Room Details - Basic Information
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Stack direction="column" gap="2rem">
            <Box display="flex" flexDirection="column" gap="1rem">
              <Typography sx={styles.label}>Room Images</Typography>
              <img
                loading="lazy"
                src={`${URL_IMAGE}${images}`}
                alt=""
                style={{
                  width: "100%",
                  minHeight: "450px",
                  maxHeight: "450px",
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
              />

              {data?.listImages?.length > 1 && (
                <Box display="flex" gap="1rem" width="100%">
                  {data?.listImages?.map((img) => (
                    <Box
                      key={img?.imageID}
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
              <Box flex={2} display="flex" flexDirection="column" gap="1rem">
                <Typography sx={styles.label}>Type of Room</Typography>
                <Box sx={styles.data}>{data?.typeRoom}</Box>
              </Box>

              <Box flex={1.5} display="flex" flexDirection="column" gap="1rem">
                <Typography sx={styles.label}>Bed</Typography>
                <Box sx={styles.data}>
                  {data?.numberBed <= 1
                    ? `${data?.numberBed} x ${data?.typeOfBed} Bed`
                    : `${data?.numberBed} x ${data?.typeOfBed} Beds`}
                </Box>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap="2rem">
              <Box flex={2} display="flex" flexDirection="column" gap="1rem">
                <Typography sx={styles.label}>Room Quantity</Typography>
                <Box sx={styles.data}>
                  {data?.quantity <= 1
                    ? `${data?.quantity} room`
                    : `${data?.quantity} rooms`}
                </Box>
              </Box>

              <Box flex={1.5} display="flex" flexDirection="column" gap="1rem">
                <Typography sx={styles.label}>Number Capacity</Typography>
                <Box sx={styles.data}>
                  {data?.numberCapacity <= 1
                    ? `${data?.numberCapacity} person`
                    : `${data?.numberCapacity} people`}
                </Box>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap="2rem">
              <Box flex={2} display="flex" flexDirection="column" gap="1rem">
                <Typography sx={styles.label}>Price</Typography>
                <Box sx={styles.data} height="45px" lineHeight={1.8}>
                  {formatPrice(Math.ceil(data?.price))} VND
                </Box>
              </Box>

              <Box flex={1.5} display="flex" flexDirection="column" gap="1rem">
                <Typography sx={styles.label}>Size of Room</Typography>
                <Box sx={styles.data} height="45px">
                  {data?.size} m<sup>2</sup>
                </Box>
              </Box>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-around" }}>
          <Button
            onClick={handleClose}
            sx={{
              bgcolor: "transparent",
              color: themeColors.primary_600,
              p: "5px 40px",
              border: `1px solid ${themeColors.primary_600}`,
              borderRadius: "8px",
              textTransform: "none",
              fontSize: 16,
              "&:hover": {
                bgcolor: themeColors.bgTitle,
              },
            }}
          >
            Close
          </Button>

          <AmenitiesModal
            data={{
              amenities: data?.amenities,
              specialPrice: data?.specialPrice,
            }}
            handleInformationClose={handleClose}
          >
            <Button
              sx={{
                bgcolor: themeColors.primary_Default,
                color: themeColors.white,
                p: "5px 40px",
                borderRadius: "8px",
                textTransform: "none",
                fontSize: 16,
                "&:hover": {
                  bgcolor: themeColors.primary_600,
                },
              }}
            >
              Next
            </Button>
          </AmenitiesModal>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InformationModal;
