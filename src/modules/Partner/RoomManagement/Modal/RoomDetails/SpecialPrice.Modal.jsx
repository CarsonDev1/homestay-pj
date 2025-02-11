import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { themeColors } from "../../../../../themes/schemes/PureLightThem";
import { Close } from "@mui/icons-material";
import { formatDate, formatPrice } from "../../../../../utils/helper";

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
    fontSize: 18,
    fontWeight: 700,
  },
};

const SpecialPriceModal = ({
  children,
  data,
  handleInformationClose,
  handleAmenitiesClose,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    handleAmenitiesClose();
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
            Room Details - Special Price Information
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {data?.specialPrice?.length === 0 ? (
            <Stack direction="column" gap="2rem">
              <Box display="flex" p="30px 0">
                <Typography
                  sx={{
                    m: "auto",
                    fontSize: 20,
                    fontWeight: 700,
                    color: themeColors.title,
                  }}
                >
                  This room haven't any special price!
                </Typography>
              </Box>
            </Stack>
          ) : (
            <Stack direction="column" gap="2rem">
              {data?.specialPrice?.map((item, index) => (
                <Box
                  key={index}
                  display="flex"
                  flexDirection="column"
                  gap="2rem"
                >
                  <Box display="flex" flexDirection="column" gap="2rem">
                    <Typography sx={styles.label}>
                      Special Price {index + 1}
                    </Typography>
                    <Box display="flex" alignItems="center" gap="2rem">
                      <Box
                        flex={1}
                        display="flex"
                        flexDirection="column"
                        gap="1rem"
                      >
                        <Typography sx={styles.subLabel}>Start Date</Typography>
                        <Box sx={styles.data}>
                          {formatDate(item?.startDate)}
                        </Box>
                      </Box>

                      <Box
                        flex={1}
                        display="flex"
                        flexDirection="column"
                        gap="1rem"
                      >
                        <Typography sx={styles.subLabel}>End Date</Typography>
                        <Box sx={styles.data}>{formatDate(item?.endDate)}</Box>
                      </Box>
                    </Box>

                    <Box display="flex" flexDirection="column" gap="1rem">
                      <Typography sx={styles.subLabel}>Price</Typography>
                      <Box sx={styles.data}>
                        {formatPrice(Math.ceil(item?.price))} VND
                      </Box>
                    </Box>
                  </Box>

                  {index !== data?.specialPrice?.length - 1 && (
                    <Divider sx={{ bgcolor: themeColors.gray }} />
                  )}
                </Box>
              ))}
            </Stack>
          )}
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

          <Button
            onClick={handleClose}
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
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SpecialPriceModal;
