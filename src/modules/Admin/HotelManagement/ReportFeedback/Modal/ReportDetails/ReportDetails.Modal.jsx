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
import React, { useEffect, useState } from "react";
import { themeColors } from "../../../../../../themes/schemes/PureLightThem";
import { Close } from "@mui/icons-material";
import RejectReportModal from "../RejectReport/RejectReport.Modal";
import { URL_IMAGE } from "../../../../../../services/ApiUrl";
import { confirmReport } from "../../../../Admin.Api";
import { Bounce, toast } from "react-toastify";

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

const ReportDetailsModal = ({ children, data }) => {
  const id = data?.id;

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleApprove = async () => {
    const res = await confirmReport(id);

    if (res.status === 200) {
      toast.success("Approve post success!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        pauseOnFocusLoss: false,
      });
      handleClose();
    } else {
      toast.error("Approve post error!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        pauseOnFocusLoss: false,
      });
    }
  };

  useEffect(() => {}, [data, handleApprove]);

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
            Report Feedback Details
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{ bgcolor: themeColors.bgTitle, p: "30px" }}
        >
          <Box display="flex" flexDirection="column" gap="30px">
            <Box
              sx={{
                bgcolor: themeColors.white,
                border: `1px solid ${themeColors.black}`,
                borderRadius: "8px",
                p: "15px",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                boxShadow: themeColors.boxShadow,
              }}
            >
              <Typography sx={styles.label}>Reviewer's Information</Typography>

              {data?.reviewerImg && (
                <Box display="flex" flexDirection="column" gap="1rem">
                  <Typography sx={styles.subLabel}>Image</Typography>
                  <img
                    loading="lazy"
                    src={`${URL_IMAGE}${data?.reviewerImg}`}
                    alt=""
                    style={{
                      borderRadius: "8px",
                      boxShadow: themeColors.boxShadow,
                    }}
                  />
                </Box>
              )}

              <Box display="flex" alignItems="center" gap="2rem">
                <Box flex={2} display="flex" flexDirection="column" gap="1rem">
                  <Typography sx={styles.subLabel}>Name</Typography>
                  <Box sx={styles.data}>{data?.reviewerName}</Box>
                </Box>

                <Box flex={1} display="flex" flexDirection="column" gap="1rem">
                  <Typography sx={styles.subLabel}>Rating</Typography>
                  <Box sx={styles.data}>
                    {data?.reviewerRating <= 1
                      ? `${data?.reviewerRating} star`
                      : `${data?.reviewerRating} stars`}
                  </Box>
                </Box>
              </Box>

              <Box display="flex" flexDirection="column" gap="1rem">
                <Typography sx={styles.subLabel}>Description</Typography>
                <Box sx={styles.data}>{data?.reviewerDesc}</Box>
              </Box>
            </Box>

            <Box
              sx={{
                bgcolor: themeColors.white,
                border: `1px solid ${themeColors.black}`,
                borderRadius: "8px",
                p: "15px",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                boxShadow: themeColors.boxShadow,
              }}
            >
              <Typography sx={styles.label}>Reporter's Information</Typography>
              <Box display="flex" alignItems="center" gap="2rem">
                <Typography flex={0.6} sx={styles.subLabel}>
                  Email
                </Typography>
                <Box flex={2} sx={styles.data}>
                  {data?.reporterEmail}
                </Box>
              </Box>

              <Box display="flex" flexDirection="column" gap="1rem">
                <Typography sx={styles.subLabel}>Reason Report</Typography>
                <Box sx={styles.data}>{data?.reasonReport}</Box>
              </Box>
            </Box>
          </Box>
        </DialogContent>

        {data?.status === "Awaiting Approval" ? (
          <DialogActions sx={{ justifyContent: "space-around" }}>
            <RejectReportModal
              data={{ id: id }}
              handleCloseParnentModal={handleClose}
            >
              <Button
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
                Reject
              </Button>
            </RejectReportModal>

            <Button
              onClick={handleApprove}
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
              Approve
            </Button>
          </DialogActions>
        ) : (
          <DialogActions sx={{ justifyContent: "center" }}>
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
        )}
      </Dialog>
    </>
  );
};

export default ReportDetailsModal;
