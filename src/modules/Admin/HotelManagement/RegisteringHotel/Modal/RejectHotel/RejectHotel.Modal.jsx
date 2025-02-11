/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { themeColors } from "../../../../../../themes/schemes/PureLightThem";
import { Box, Button, Modal, Typography } from "@mui/material";
import { rejectRegisteringHotel } from "../../../../Admin.Api";
import { Bounce, toast } from "react-toastify";

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

const reasonReject = [
  "Inaccurate or incomplete information",
  "Hotel does not meet quality standards",
  "Unreasonable or uncompetitive pricing",
  "Unfavorable location or conditions",
  "Lack of basic amenities",
];

const RejectHotelModal = ({ children, data }) => {
  const id = data?.id;

  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleReject = async () => {
    if (reason === "") {
      toast.error(
        `You must choose 1 of ${
          reasonReject.length <= 1
            ? `${reasonReject.length} reason`
            : `${reasonReject.length} reasons`
        } below to reject!`,
        {
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
        }
      );
    } else {
      let formData = new FormData();

      formData.append("hotelID", id);
      formData.append("reasonReject", reason);

      const res = await rejectRegisteringHotel(formData);

      if (res.status === 200) {
        toast.success("Reject hotel successfully!", {
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
        toast.error("Reject hotel fail!", {
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
      }
    }
  };

  useEffect(() => {}, [data, handleReject]);

  return (
    <>
      {React.cloneElement(children, {
        onClick: handleOpen,
      })}

      <Modal open={open} onClose={handleClose}>
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
              Why do you want to reject this hotel ?
            </Typography>
          </Box>

          {reasonReject.map((reasons, index) => (
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
              Cancel
            </Button>

            <Button
              onClick={handleReject}
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
              Reject
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default RejectHotelModal;
