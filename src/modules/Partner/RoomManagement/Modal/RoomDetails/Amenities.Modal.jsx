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
import { AssetImages } from "../../../../../utils/images";
import SpecialPriceModal from "./SpecialPrice.Modal";

const AmenitiesModal = ({ children, data, handleInformationClose }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    handleInformationClose();
  };

  const handleBack = () => {
    setOpen(false);
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
            Room Details - Amenities of Room
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Stack direction="column" gap="2rem">
            <Box display="flex" flexDirection="column" gap="2rem">
              {data?.amenities?.map((service) => (
                <Box
                  key={service?.roomServiceID}
                  display="flex"
                  flexDirection="column"
                  gap="1.5rem"
                >
                  <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
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
                        width="31%"
                        key={subService?.subServiceID}
                        display="flex"
                        alignItems="center"
                        gap=".7rem"
                      >
                        <img
                          src={AssetImages.ICONS.CHECKED}
                          alt=""
                          style={{ width: 26, height: 26 }}
                        />
                        <Typography sx={{ fontSize: 18 }}>
                          {subService?.subName}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </Stack>
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

          <SpecialPriceModal
            data={{
              specialPrice: data?.specialPrice,
            }}
            handleInformationClose={handleInformationClose}
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
          </SpecialPriceModal>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AmenitiesModal;
