/* eslint-disable react-hooks/exhaustive-deps */
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
import ImagesHotelView from "./HotelView/Images.HotelView";
import ImagesDining from "./Dining/Images.Dining";
import ImagesRooms from "./Rooms/Images.Rooms";
import ImagesSpa from "./Spa/Images.Spa";
import ImagesWedding from "./Wedding/Images.Wedding";

const navItems = ["Hotel View", "Rooms", "Dining", "Spa", "Wedding"];

const GalleryDetailsModal = ({ children, data }) => {
  const [open, setOpen] = useState(false);
  const [isSelected, setIsSelected] = useState(0);

  const handleOpen = () => {
    setOpen(true);
    if (isSelected !== 0) {
      setIsSelected(0);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelected = (index) => {
    setIsSelected(index);
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
          <Box display="flex" alignItems="center" gap="5rem">
            {navItems.map((item, index) => (
              <Typography
                key={index}
                onClick={() => handleSelected(index)}
                sx={{
                  color:
                    index === isSelected
                      ? themeColors.primary_Default
                      : themeColors.black,
                  fontWeight: index === isSelected ? 700 : "normal",
                  fontSize: 18,
                  borderBottom:
                    index === isSelected
                      ? `3px solid ${themeColors.primary_Default}`
                      : "none",
                  cursor: "pointer",
                  "&:hover": {
                    color:
                      index !== isSelected
                        ? themeColors.text_Disabled
                        : themeColors.primary_Default,
                  },
                }}
              >
                {item}
              </Typography>
            ))}
          </Box>

          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {isSelected === 0 ? <ImagesHotelView data={data} /> : null}
          {isSelected === 1 ? <ImagesRooms data={data} /> : null}
          {isSelected === 2 ? <ImagesDining data={data} /> : null}
          {isSelected === 3 ? <ImagesSpa data={data} /> : null}
          {isSelected === 4 ? <ImagesWedding data={data} /> : null}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "flex-end" }}>
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
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GalleryDetailsModal;
