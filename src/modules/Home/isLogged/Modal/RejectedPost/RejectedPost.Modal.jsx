import React, { useState } from "react";
import { themeColors } from "../../../../../themes/schemes/PureLightThem";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: themeColors.white,
  borderRadius: "8px",
  p: "15px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const RejectedPostModal = ({ children, data }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {React.cloneElement(children, {
        onClick: handleOpen,
      })}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Box display="flex" justifyContent="space-between">
            <Typography
              sx={{
                width: "fit-content",
                fontSize: 24,
                fontWeight: 700,
                color: themeColors.title,
              }}
            >
              Reason Rejected
            </Typography>

            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
            <Typography sx={{ fontSize: 18 }}>
              Your post was rejected because
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: themeColors.bg_Disabled,
              color: themeColors.black,
              p: "10px",
              borderRadius: "8px",
            }}
          >
            <Typography sx={{ textAlign: "justify", textWrap: "pretty" }}>
              {data?.reason}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
            }}
          >
            <Button
              onClick={handleClose}
              sx={{
                m: "auto",
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
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default RejectedPostModal;
