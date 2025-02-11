import React, { useState } from "react";
import { themeColors } from "../../../../../themes/schemes/PureLightThem";
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
import { Close } from "@mui/icons-material";
import ReportFeedbackModal from "../ReportFeedback/ReportFeedback.Modal";
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
};

const FeedbackDetailsModal = ({ children, data }) => {
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
            Review Details
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap="2rem">
            {data?.img && (
              <Box display="flex" flexDirection="column" gap="1rem">
                <Typography sx={styles.label}>Image</Typography>
                <img loading="lazy" src={`${URL_IMAGE}${data?.img}`} alt="" />
              </Box>
            )}

            <Box display="flex" alignItems="center" gap="2rem">
              <Box flex={1} display="flex" flexDirection="column" gap="1rem">
                <Typography sx={styles.label}>Reviewer's Name</Typography>
                <Box sx={styles.data}>{data?.name}</Box>
              </Box>

              <Box flex={0.7} display="flex" flexDirection="column" gap="1rem">
                <Typography sx={styles.label}>Rating</Typography>
                <Box sx={styles.data}>
                  {data?.rating <= 1
                    ? `${data?.rating} star`
                    : `${data?.rating} stars`}
                </Box>
              </Box>
            </Box>

            <Box display="flex" flexDirection="column" gap="1rem">
              <Typography sx={styles.label}>Description</Typography>
              <Box sx={styles.data}>{data?.desc}</Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent:
              data?.status !== "Reported" ? "space-around" : "center",
          }}
        >
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

          {data?.status !== "Reported" && (
            <ReportFeedbackModal
              data={{
                id: data?.id,
              }}
              handleCloseParnentModal={handleClose}
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
                Report
              </Button>
            </ReportFeedbackModal>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FeedbackDetailsModal;
