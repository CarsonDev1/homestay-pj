import React, { useEffect, useState } from "react";
import { themeColors } from "../../../../../themes/schemes/PureLightThem";
import { Box, Button, Modal, Typography } from "@mui/material";
import secureLocalStorage from "react-secure-storage";
import { reportReview } from "../../../Partner.Api";
import ToastComponent from "../../../../../components/Toast/Toast.Component";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 650,
  bgcolor: themeColors.white,
  borderRadius: "8px",
  p: "15px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const reasonReport = [
  "Misinformation or inaccuracies",
  "Inappropriate or offensive language",
  "Spam or advertising",
  "Fake review",
  "Unsubstantiated review",
  "Dishonest review about auxiliary services",
  "Contains pornographic, violent, or otherwise offensive images or content",
];

const ReportFeedbackModal = ({ children, data, handleCloseParnentModal }) => {
  const id = data?.id;

  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  const [disableButton, setDisableButton] = useState(false);

  const [displayForce, setDisplayForce] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [displayServerError, setDisplayServerError] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    handleCloseParnentModal();
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleReport = async () => {
    setDisableButton(true);
    if (reason === "") {
      setDisplayForce(true);
      setDisableButton(false);
    } else {
      let formData = new FormData();

      formData.append("feedbackId", id);
      formData.append("ReporterEmail", secureLocalStorage.getItem("email"));
      formData.append("ReasonReport", reason);

      try {
        const response = await reportReview(formData);

        if (response.status === 200) {
          handleClose();
        } else {
          setDisplayError(true);
          setDisableButton(false);
        }
      } catch (error) {
        setDisplayServerError(true);
        setDisableButton(false);
      }
    }
  };

  useEffect(() => {
    let timeOut;
    if (displayForce) {
      timeOut = setTimeout(() => {
        setDisplayForce(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayForce]);

  useEffect(() => {
    let timeOut;
    if (displayError) {
      timeOut = setTimeout(() => {
        setDisplayError(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayError]);

  useEffect(() => {
    let timeOut;
    if (displayServerError) {
      timeOut = setTimeout(() => {
        setDisplayServerError(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayServerError]);

  return (
    <>
      {React.cloneElement(children, {
        onClick: handleOpen,
      })}
      <Modal open={open} onClose={handleClose}>
        <>
          <ToastComponent
            open={displayForce}
            close={() => setDisplayForce(false)}
            title="Error"
            message={`You must choose 1 of ${reasonReport.length} reasons below!`}
            type="error"
          />

          <ToastComponent
            open={displayError}
            close={() => setDisplayError(false)}
            title="Error"
            message="Report fail!"
            type="error"
          />

          <ToastComponent
            open={displayServerError}
            close={() => setDisplayServerError(false)}
            title="Error"
            message="Server maintenance is underway. Please try again later!"
            type="error"
          />

          <Box sx={style}>
            <Box display="flex" justifyContent="center">
              <Typography
                sx={{
                  width: "fit-content",
                  fontSize: 24,
                  fontWeight: 700,
                  color: themeColors.title,
                }}
              >
                Attention
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Typography sx={{ fontSize: 18 }}>
                Why do you want to report this feedback ?
              </Typography>
            </Box>

            {reasonReport.map((reasons, index) => (
              <Box key={index} display="flex" alignItems="center" gap=".7rem">
                <input
                  type="radio"
                  name="reason-report"
                  id={reasons}
                  onChange={handleReasonChange}
                  value={reasons}
                  checked={reasons === reason}
                  style={{
                    minWidth: 16,
                    maxWidth: 16,
                    minHeight: 16,
                    maxHeight: 16,
                  }}
                />
                <label htmlFor={reasons}>{reasons}</label>
              </Box>
            ))}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Button
                onClick={handleCancel}
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
                Cancel
              </Button>

              <Button
                onClick={handleReport}
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
                  "&:disabled": {
                    bgcolor: themeColors.bg_Disabled,
                    color: themeColors.text_Link,
                  },
                }}
                disabled={disableButton}
              >
                Report
              </Button>
            </Box>
          </Box>
        </>
      </Modal>
    </>
  );
};

export default ReportFeedbackModal;
