import React, { useEffect, useState } from "react";
import { themeColors } from "../../../../themes/schemes/PureLightThem";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1200,
  bgcolor: themeColors.white,
  borderRadius: "8px",
  p: "15px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const MapModal = ({ children, data }) => {
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
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              sx={{
                mb: "10px",
                fontSize: 24,
                fontWeight: 700,
                color: themeColors.title,
              }}
            >
              Location
            </Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>
          <iframe
            width="100%"
            height="550"
            style={{ border: "none" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${data?.lat},${
              data?.lng
            }&z=${19}&output=embed`}
            title="google map"
          ></iframe>
        </Box>
      </Modal>
    </>
  );
};

export default MapModal;
