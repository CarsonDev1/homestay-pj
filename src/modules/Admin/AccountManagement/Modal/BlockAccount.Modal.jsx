import React, { useState } from "react";
import { themeColors } from "../../../../themes/schemes/PureLightThem";
import { Box, Button, Modal, Typography } from "@mui/material";
import { blockAccount } from "../../Admin.Api";
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

const reasonBlock = [
  "Violation of terms of service",
  "Harassment or abuse",
  "Spam",
  "Inappropriate content distribution",
  "Copyright infringement",
  "Discriminatory or hateful behavior",
  "Organizing illegal activities",
  "System manipulation or abuse",
  "Use of inappropriate language",
];

const BlockAccountModal = ({ children, data }) => {
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
        `You must choose 1 of ${reasonBlock.length} reasons below to block!`,
        {
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
        }
      );
    } else {
      let formData = new FormData();

      formData.append("accountId", id);
      formData.append("reasonBlock", reason);

      const res = await blockAccount(formData);

      if (res) {
        toast.success("Block account successfully!", {
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
        toast.error("Block account fail!", {
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
    }
  };

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
              Are you sure to block this account with email is "
              <span style={{ color: themeColors.primary_Default }}>
                {data?.email}
              </span>
              " ? Why ?
            </Typography>
          </Box>

          {reasonBlock.map((reasons, index) => (
            <Box key={index} display="flex" alignItems="center" gap=".5rem">
              <input
                type="radio"
                name="reason-block"
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

export default BlockAccountModal;
