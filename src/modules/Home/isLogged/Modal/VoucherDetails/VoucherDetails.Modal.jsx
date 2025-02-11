import { Close } from "@mui/icons-material";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { themeColors } from "../../../../../themes/schemes/PureLightThem";
import { URL_IMAGE } from "../../../../../services/ApiUrl";

const styles = {
  p: "8px 14px",
  bgcolor: "transparent",
  color: themeColors.black,
  fontSize: 16,
  border: `1px solid ${themeColors.gray}`,
  borderRadius: "6px",
  textAlign: "justify",
};

const VoucherDetailsModal = ({ children, data }) => {
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
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        fullWidth
        maxWidth="sm"
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
            Voucher Details
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap="2rem">
            <Box display="flex" flexDirection="column" gap="1rem">
              <Typography sx={{ fontSize: 18, color: themeColors.black }}>
                Image
              </Typography>
              <img
                loading="lazy"
                src={`${URL_IMAGE}${data?.img}`}
                alt="Voucher"
                style={{
                  width: "100%",
                  border: `1px solid ${themeColors.gray}`,
                  borderRadius: "4px",
                }}
              />
            </Box>

            <Box display="flex" flexDirection="column" gap="1rem">
              <Typography sx={{ fontSize: 18, color: themeColors.black }}>
                Voucher Name
              </Typography>
              <Box sx={styles}>{data?.name}</Box>
            </Box>

            <Box display="flex" alignItems="center" gap="3rem">
              <Box flex={1} display="flex" flexDirection="column" gap="1rem">
                <Typography sx={{ fontSize: 18, color: themeColors.black }}>
                  Voucher Code
                </Typography>
                <Box sx={styles}>{data?.code}</Box>
              </Box>

              <Box flex={1} display="flex" flexDirection="column" gap="1rem">
                <Typography sx={{ fontSize: 18, color: themeColors.black }}>
                  Discount
                </Typography>
                <Box sx={styles}>{data?.discount}%</Box>
              </Box>
            </Box>

            <Box display="flex" flexDirection="column" gap="1rem">
              <Typography sx={{ fontSize: 18, color: themeColors.black }}>
                Description
              </Typography>
              <Box sx={styles}>{data?.desc}</Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VoucherDetailsModal;
