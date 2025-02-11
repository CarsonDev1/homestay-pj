import React, { useEffect, useState } from "react";
import { themeColors } from "../../../../../themes/schemes/PureLightThem";
import { Box, Button, Modal, Typography } from "@mui/material";
import { deleteRoom } from "../../../Partner.Api";
import ToastComponent from "../../../../../components/Toast/Toast.Component";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 750,
  bgcolor: themeColors.white,
  borderRadius: "8px",
  p: "15px",
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
};

const DeleteRoomModal = ({ children, data }) => {
  const id = data?.id;

  const [open, setOpen] = useState(false);

  const [displaySuccess, setDisplaySuccess] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [displayServerError, setDisplayServerError] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    try {
      const response = await deleteRoom(id);

      if (response.status === 200) {
        setDisplaySuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setDisplayError(true);
      }
    } catch (error) {
      setDisplayServerError(true);
    }
  };

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
    if (displaySuccess) {
      timeOut = setTimeout(() => {
        setDisplaySuccess(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displaySuccess]);

  return (
    <>
      {React.cloneElement(children, {
        onClick: handleOpen,
      })}

      <Modal open={open} onClose={handleClose}>
        <>
          <ToastComponent
            open={displayError}
            close={() => setDisplayError(false)}
            title="Error"
            message="Canceled the room business fail!"
            type="error"
          />

          <ToastComponent
            open={displaySuccess}
            close={() => setDisplaySuccess(false)}
            title="Success"
            message="Canceled the room business successfully!"
            type="success"
          />

          <ToastComponent
            open={displayServerError}
            close={() => setDisplayServerError(false)}
            title="Error"
            message="Server maintenance is underway. Please try again later!"
            type="error"
          />

          <Box sx={style}>
            <Box display="flex">
              <Typography
                sx={{
                  width: "fit-content",
                  fontSize: 24,
                  fontWeight: 700,
                  color: themeColors.title,
                  m: "auto",
                }}
              >
                Attention
              </Typography>
            </Box>

            <Box>
              <Typography>
                Are you sure to delete this room with type is "
                <span
                  style={{
                    color: themeColors.primary_Default,
                    fontWeight: 700,
                  }}
                >
                  {data?.typeRoom}
                </span>
                " ?
              </Typography>
            </Box>

            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-around"
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
                No
              </Button>

              <Button
                onClick={handleDelete}
                sx={{
                  bgcolor: themeColors.button_Secondary,
                  color: themeColors.white,
                  p: "5px 40px",
                  borderRadius: "8px",
                  textTransform: "none",
                  fontSize: 16,
                  "&:hover": {
                    bgcolor: themeColors.button_SecondaryHover,
                  },
                }}
              >
                Yes
              </Button>
            </Box>
          </Box>
        </>
      </Modal>
    </>
  );
};

export default DeleteRoomModal;
