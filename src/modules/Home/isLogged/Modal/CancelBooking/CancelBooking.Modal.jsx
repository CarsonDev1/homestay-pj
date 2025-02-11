import React, { useEffect, useState } from "react";
import { themeColors } from "../../../../../themes/schemes/PureLightThem";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Close } from "@mui/icons-material";
import secureLocalStorage from "react-secure-storage";
import { cancelBooking } from "../../../Home.Api";
import ToastComponent from "../../../../../components/Toast/Toast.Component";
import { routes } from "../../../../../routes";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: themeColors.white,
  borderRadius: "8px",
  p: "15px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const reasonCancel = [
  "Change of travel plans",
  "Health issues",
  "Family emergency",
  "Unable to get time off work",
  "Financial issues",
  "Bad weather forecast",
  "Found better accommodation",
  "Change of destination",
  "Work emergency",
];

const CancelBookingModal = ({ children }) => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  const [displayForce, setDisplayForce] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [displayServerError, setDisplayServerError] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleCancelBooking = async () => {
    if (reason === "") {
      setDisplayForce(true);
    } else {
      try {
        let formData = new FormData();

        formData.append("bookingID", secureLocalStorage.getItem("bookingId"));
        formData.append("Reason", reason);

        const response = await cancelBooking(formData);

        if (response.status === 200) {
          setDisplaySuccess(true);
          setTimeout(() => {
            handleClose();
          }, 3000);
          setTimeout(() => {
            navigate(routes.home.myAccount);
          }, 4000);
        } else {
          setDisplayError(true);
        }
      } catch (error) {
        setDisplayServerError(true);
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
    if (displaySuccess) {
      timeOut = setTimeout(() => {
        setDisplaySuccess(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displaySuccess]);

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
            message={`You must choose 1 of ${reasonCancel.length} reasons below!`}
            type="error"
          />

          <ToastComponent
            open={displayError}
            close={() => setDisplayError(false)}
            title="Error"
            message="Cancel booking fail!"
            type="error"
          />

          <ToastComponent
            open={displayServerError}
            close={() => setDisplayServerError(false)}
            title="Error"
            message="Server maintenance is underway. Please try again later!"
            type="error"
          />

          <ToastComponent
            open={displaySuccess}
            close={() => setDisplaySuccess(false)}
            title="Success"
            message="Cancel booking successfully!"
            type="success"
          />

          <Box sx={style}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
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

              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
              <Typography sx={{ fontSize: 18 }}>
                Why do you want to cancel this booking?
              </Typography>
            </Box>

            {reasonCancel.map((reasons, index) => (
              <Box key={index} display="flex" alignItems="center" gap=".5rem">
                <input
                  type="radio"
                  name="reason-cancel"
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
                justifyContent: "space-between",
                alignItems: "center",
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

              <Button
                onClick={handleCancelBooking}
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
                Cancel Booking
              </Button>
            </Box>
          </Box>
        </>
      </Modal>
    </>
  );
};

export default CancelBookingModal;
