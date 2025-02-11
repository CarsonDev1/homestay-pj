import React, { useEffect, useState } from "react";
import { themeColors } from "../../../../../../themes/schemes/PureLightThem";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { AssetImages } from "../../../../../../utils/images";
import OwnerDetailsModal from "./OwnerDetails.Modal";

const styles = {
  data: {
    p: "8px 14px",
    bgcolor: themeColors.bg_Disabled,
    color: themeColors.text_Link,
    fontSize: 16,
    borderRadius: "6px",
  },
  subLabel: {
    fontSize: 18,
    fontWeight: 700,
  },
};

const AmenitiesDetailsModal = ({ children, data, handleInformationClose }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    handleInformationClose();
    setOpen(false);
  };

  const handleBack = () => {
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
            Hotel Amenities Details
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap="2rem">
            {data?.amenities?.map((service) => (
              <Box
                key={service?.serviceID}
                display="flex"
                flexDirection="column"
                gap="1rem"
              >
                <Typography sx={styles.subLabel}>{service?.type}</Typography>

                <Box
                  display="flex"
                  alignItems="center"
                  flexWrap="wrap"
                  gap="1.7rem"
                >
                  {service?.hotelSubServices?.map((subService) => (
                    <Box key={subService?.subServiceID} width="31%">
                      <Box display="flex" alignItems="center" gap=".5rem">
                        <Avatar
                          src={AssetImages.ICONS.CHECKED}
                          sx={{ width: 24, height: 24 }}
                        />
                        <Typography sx={{ fontSize: 16 }}>
                          {subService?.subServiceName}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-around" }}>
          <Button
            onClick={handleBack}
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
            Back
          </Button>

          <OwnerDetailsModal
            data={{
              id: data?.id,
              subscriberAvt: data?.subscriberAvt,
              subscriberName: data?.subscriberName,
              subscriberEmail: data?.subscriberEmail,
              subscriberPhone: data?.subscriberPhone,
            }}
            handleInforClose={handleInformationClose}
            handleAmenitiesClose={handleClose}
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
          </OwnerDetailsModal>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AmenitiesDetailsModal;
