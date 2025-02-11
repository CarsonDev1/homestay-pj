/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { themeColors } from "../../../../../../themes/schemes/PureLightThem";
import { AddPhotoAlternateOutlined, Close } from "@mui/icons-material";
import secureLocalStorage from "react-secure-storage";
import { addImage } from "../../../../Partner.Api";
import ToastComponent from "../../../../../../components/Toast/Toast.Component";

const titleFilter = ["Hotel View", "Rooms", "Spa", "Dining", "Weddings"];

const styles = {
  fontSize: 19,
  fontWeight: 700,
};

const AddImageModal = ({ children }) => {
  const fileInputRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [image, setImage] = useState("");
  const [images, setImages] = useState(null);
  const [title, setTitle] = useState("");

  const [disabledButton, setDisabledButton] = useState(false);

  const [displayEmpty, setDisplayEmpty] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [displayServerError, setDisplayServerError] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUploadImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setImages(file);

      const reader = new FileReader();

      reader.onloadend = () => {
        setImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleAdd = async () => {
    setDisabledButton(true);

    if (images === null || title === "") {
      setDisplayEmpty(true);
      setDisabledButton(false);
    } else {
      try {
        let formData = new FormData();

        formData.append("hotelId", secureLocalStorage.getItem("hotelId"));
        formData.append("images", images);
        formData.append("title", title);

        const res = await addImage(formData);

        if (res) {
          setDisplaySuccess(true);
          setDisabledButton(false);
          handleClose();
        } else {
          setDisplayError(true);
          setDisabledButton(false);
        }
      } catch (error) {
        setDisplayServerError(true);
        setDisabledButton(false);
      }
    }
  };

  useEffect(() => {
    let timeOut;
    if (displayEmpty) {
      timeOut = setTimeout(() => {
        setDisplayEmpty(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayEmpty]);

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

  useEffect(() => {}, [handleAdd]);

  return (
    <>
      {React.cloneElement(children, {
        onClick: handleOpen,
      })}
      <ToastComponent
        open={displayEmpty}
        close={() => setDisplayEmpty(false)}
        title="Error"
        message="All field are required!"
        type="error"
      />

      <ToastComponent
        open={displayError}
        close={() => setDisplayError(false)}
        title="Error"
        message="Add image fail!"
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
        message="Add image successfully!"
        type="success"
      />

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
            Add Image Into Gallery
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap="20px">
            <Box display="flex" flexDirection="column" gap="1rem">
              <Typography sx={styles}>Image</Typography>
              <Box
                onClick={handleUploadImage}
                sx={{
                  width: "100%",
                  height: "auto",
                  border: "1px dashed #bbbbbf",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "5px",
                  p: "5px",
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
              >
                {image ? (
                  <img
                    src={image}
                    alt="Uploaded"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "8px",
                      boxShadow: themeColors.boxShadow,
                    }}
                  />
                ) : (
                  <>
                    <AddPhotoAlternateOutlined />
                    <Typography sx={{ fontSize: "16px" }}>Add Image</Typography>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleFileInputChange}
                />
              </Box>
            </Box>

            <Box display="flex" flexDirection="column" gap="1rem">
              <Typography sx={styles}>Title</Typography>
              <FormControl fullWidth>
                <Select
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  displayEmpty
                  size="small"
                  sx={{ borderRadius: "8px" }}
                >
                  <MenuItem value="">
                    <em style={{ color: "#B2B2B2" }}>
                      -- Choose title for image --
                    </em>
                  </MenuItem>
                  {titleFilter?.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-around" }}>
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
            onClick={handleAdd}
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
            disabled={disabledButton}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddImageModal;
