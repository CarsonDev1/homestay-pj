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
import React, { useEffect, useRef, useState } from "react";
import { themeColors } from "../../../../../themes/schemes/PureLightThem";
import { AddPhotoAlternateOutlined, Close } from "@mui/icons-material";
import { URL_IMAGE } from "../../../../../services/ApiUrl";
import secureLocalStorage from "react-secure-storage";
import { updateBasicInformation } from "../../../Partner.Api";
import ToastComponent from "../../../../../components/Toast/Toast.Component";

const styles = {
  box: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  label: {
    fontSize: 19,
    fontWeight: 700,
  },
  inputForm: {
    fontSize: 16,
    borderRadius: "6px",
    padding: "9px 15px",
    border: `1px solid ${themeColors.gray}`,
  },
};

const UpdateInformationModal = ({ children, data }) => {
  const oldImg = `${data?.img}`;
  const currentImg = `${URL_IMAGE}${oldImg}`;

  const fileInputRef = useRef(null);

  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(currentImg || "");
  const [images, setImages] = useState(null);
  const [hotelName, setHotelName] = useState(data?.name || "");
  const [hotelOpened, setHotelOpened] = useState(data?.opened || 0);
  const [hotelDesc, setHotelDesc] = useState(data?.desc || "");

  const [disableButton, setDisableButton] = useState(false);

  const [displayError, setDisplayError] = useState(false);
  const [displayServerError, setDisplayServerError] = useState(false);
  const [displayEmpty, setDisplayEmpty] = useState(false);
  const [displayInvalidYear, setDisplayInvalidYear] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);

  const handleOpen = () => {
    setCount((count) => (count += 1));
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

  const generateYearRegexp = () => {
    const currentYear = new Date().getFullYear();
    return new RegExp(
      `^(19[0-9]{2}|20[0-${
        Math.floor(currentYear / 100) % 10
      }][0-9]|20${Math.floor((currentYear % 100) / 10)}[0-${
        currentYear % 10
      }])$`
    );
  };

  const handleSubmit = async () => {
    setDisableButton(true);
    if (hotelName === "" || hotelOpened === "" || hotelDesc === "") {
      setDisplayEmpty(true);
      setDisableButton(false);
    } else {
      const regexYear = generateYearRegexp();

      if (!regexYear.test(hotelOpened)) {
        setDisplayInvalidYear(true);
        setDisableButton(false);
      } else {
        const data = {
          img: images || oldImg,
          name: hotelName,
          opened: hotelOpened,
          hotelDesc: hotelDesc,
        };

        try {
          let formData = new FormData();

          formData.append("hotelID", secureLocalStorage.getItem("hotelId"));
          formData.append("mainImage", data.img);
          formData.append("hotelName", data.name);
          formData.append("openedIn", data.opened);
          formData.append("description", data.hotelDesc);

          const response = await updateBasicInformation(formData);

          if (response.status === 200) {
            setDisplaySuccess(true);
            setTimeout(() => {
              setDisableButton(false);
              handleClose();
            }, 3000);
          } else {
            setDisplayError(true);
            setDisableButton(false);
          }
        } catch (error) {
          setDisplayServerError(true);
          setDisableButton(false);
        }
      }
    }
  };

  useEffect(() => {
    if (data?.img) {
      setImage(currentImg);
    }

    if (data?.name) {
      setHotelName(data?.name);
    }

    if (data?.opened) {
      setHotelOpened(data?.opened);
    }

    if (data?.desc) {
      setHotelDesc(data?.desc);
    }
  }, [count]);

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
    if (displayInvalidYear) {
      timeOut = setTimeout(() => {
        setDisplayInvalidYear(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayInvalidYear]);

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
        open={displayInvalidYear}
        close={() => setDisplayInvalidYear(false)}
        title="Error"
        message={`Opened in must be between 1900 to ${new Date().getFullYear()}!`}
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
        open={displayError}
        close={() => setDisplayError(false)}
        title="Error"
        message="Update hotel's information fail!"
        type="error"
      />

      <ToastComponent
        open={displaySuccess}
        close={() => setDisplaySuccess(false)}
        title="Success"
        message="Update hotel's information successfully!"
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
            Update Hotel Information
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap="20px">
            <Box display="flex" flexDirection="column" gap="1rem">
              <Typography sx={styles.label}>Main Image</Typography>
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

            <Box display="flex" alignItems="center" gap="3rem">
              <Box flex={1} sx={styles.box}>
                <Typography sx={styles.label}>Hotel Name</Typography>
                <input
                  type="text"
                  value={hotelName}
                  style={styles.inputForm}
                  onChange={(e) => setHotelName(e.target.value)}
                />
              </Box>

              <Box flex={0.5} sx={styles.box}>
                <Typography sx={styles.label}>Opened In</Typography>
                <input
                  type="text"
                  value={hotelOpened}
                  style={styles.inputForm}
                  onChange={(e) => setHotelOpened(e.target.value)}
                />
              </Box>
            </Box>

            <Box sx={styles.box}>
              <Typography sx={styles.label}>Description</Typography>
              <textarea
                value={hotelDesc}
                onChange={(e) => setHotelDesc(e.target.value)}
                style={{
                  fontSize: 16,
                  borderRadius: "6px",
                  padding: "9px 15px",
                  border: `1px solid ${themeColors.gray}`,
                  resize: "none",
                }}
                rows={10}
              ></textarea>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-evenly" }}>
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
              "&:disabled": {
                bgcolor: themeColors.bg_Disabled,
                color: themeColors.text_Link,
              },
            }}
            disabled={disableButton}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateInformationModal;
