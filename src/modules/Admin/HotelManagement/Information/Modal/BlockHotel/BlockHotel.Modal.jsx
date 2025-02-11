/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { themeColors } from "../../../../../../themes/schemes/PureLightThem";
import { Box, Button, Modal, Typography } from "@mui/material";
import { Bounce, toast } from "react-toastify";
import { blockHotel } from "../../../../Admin.Api";

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

const reasonBlock = [
  "Violation of service terms",
  "Negative customer feedback",
  "Violation of legal regulations",
  "Payment issues",
  "Non-transparent operations",
  "Failure to ensure food safety",
  "Failure to ensure customer security",
  "Dishonest advertising",
];

const BlockHotelModal = ({ children, data }) => {
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

  const handleSubmit = async () => {
    if (reason === "") {
      toast.error(
        `You must choose 1 of ${
          reasonBlock.length <= 1
            ? `${reasonBlock.length} reason`
            : `${reasonBlock.length} reasons`
        } below to block!`,
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

      formData.append("hotelId", id);
      formData.append("reaseonBlock", reason);

      const res = await blockHotel(formData);

      if (res.status === 200) {
        toast.success("Block hotel successfully!", {
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
        toast.error("Block hotel fail!", {
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

  useEffect(() => {}, [data, handleSubmit]);

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

          <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
            <Typography sx={{ fontSize: 18 }}>
              Why do you want to block this hotel with name is "
              <span style={{ color: themeColors.primary_Default }}>
                {data?.name}
              </span>
              " ?
            </Typography>
          </Box>

          {reasonBlock.map((reasons, index) => (
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
              onClick={handleSubmit}
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
              Block
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default BlockHotelModal;
