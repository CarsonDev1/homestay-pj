import { Close } from "@mui/icons-material";
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
import React, { useEffect, useState } from "react";
import { themeColors } from "../../../../../../themes/schemes/PureLightThem";
import { formatPrice } from "../../../../../../utils/helper";
import AmenitiesDetailsModal from "./AmenitiesDetails.Modal";
import { URL_IMAGE } from "../../../../../../services/ApiUrl";

const styles = {
  label: {
    fontSize: 18,
    fontWeight: 700,
  },
  data: {
    p: "8px 14px",
    bgcolor: themeColors.bg_Disabled,
    color: themeColors.text_Link,
    fontSize: 16,
    borderRadius: "6px",
  },
};

const InformationDetailsModal = ({ children, data }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {}, [data]);

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
            Hotel Information Details
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap="2rem">
            <Box display="flex" flexDirection="column" gap="1rem">
              <Typography sx={styles.label}>Hotel image</Typography>
              <img
                loading="lazy"
                src={`${URL_IMAGE}${data?.img}`}
                alt=""
                style={{
                  borderRadius: "8px",
                  boxShadow: themeColors.boxShadow,
                }}
              />
            </Box>

            <Box display="flex" flexDirection="column" gap="1rem">
              <Typography sx={styles.label}>Hotel Name</Typography>
              <Box sx={styles.data}>{data?.name}</Box>
            </Box>

            <Box display="flex" alignItems="center" gap="2rem">
              <Box flex={2} display="flex" flexDirection="column" gap="1rem">
                <Typography sx={styles.label}>Total Revenues</Typography>
                <Box sx={styles.data}>
                  {formatPrice(Math.ceil(data?.totalRevenue))} VND
                </Box>
              </Box>

              <Box flex={1.3} display="flex" flexDirection="column" gap="1rem">
                <Typography sx={styles.label}>Total Bookings</Typography>
                <Box sx={styles.data}>{data?.totalBooking}</Box>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap="2rem">
              <Box flex={2} display="flex" flexDirection="column" gap="1rem">
                <Typography sx={styles.label}>Rating</Typography>
                <Box sx={styles.data}>
                  {`${data?.averageRating}/5 - ${
                    data?.numberReviews <= 1
                      ? `${data?.numberReviews} review`
                      : `${data?.numberReviews} reviews`
                  }`}
                </Box>
              </Box>

              <Box flex={1.3} display="flex" flexDirection="column" gap="1rem">
                <Typography sx={styles.label}>Opened In</Typography>
                <Box sx={styles.data}>{data?.opened}</Box>
              </Box>
            </Box>

            <Box display="flex" flexDirection="column" gap="1rem">
              <Typography sx={styles.label}>Address</Typography>
              <Box sx={styles.data}>{data?.address}</Box>
            </Box>
          </Box>
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

          <AmenitiesDetailsModal
            data={{
              standard: data?.standard,
              amenities: data?.amenities,
              owner: data?.owner,
            }}
            handleInforClose={handleClose}
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
          </AmenitiesDetailsModal>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InformationDetailsModal;
