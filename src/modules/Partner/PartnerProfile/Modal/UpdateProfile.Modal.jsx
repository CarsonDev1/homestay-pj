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
import { themeColors } from "../../../../themes/schemes/PureLightThem";
import { AddPhotoAlternateOutlined, Close } from "@mui/icons-material";
import "./UpdateProfile.Style.scss";
import { URL_IMAGE } from "../../../../services/ApiUrl";
import ToastComponent from "../../../../components/Toast/Toast.Component";
import { updateProfile } from "../../../Auth/Auth.Api";
import { formatDateInput } from "../../../../utils/helper";

const UpdateProfileModal = ({ children, data }) => {
  const id = data?.id;
  const oldImg = `${data?.avt}`;
  const currentImg = data?.avt?.startsWith("/")
    ? `${URL_IMAGE}${oldImg}`
    : `${oldImg}`;

  const fileInputRef = useRef(null);

  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(currentImg || "");
  const [images, setImages] = useState(null);
  const [fullname, setFullname] = useState(data?.name || "");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState(data?.address || "");

  const [disabledButton, setDisabledButton] = useState(false);

  const [displayEmpty, setDisplayEmpty] = useState(false);
  const [displayFullnameMaxLength, setDisplayFullnameMaxLength] =
    useState(false);
  const [displayAddressMaxLength, setDisplayAddressMaxLength] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [displayServerError, setDisplayServerError] = useState(false);

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

  const handleSubmit = async () => {
    setDisabledButton(true);

    if (fullname === "") {
      setDisplayEmpty(true);
      setDisabledButton(false);
    } else {
      try {
        if (fullname.length < 1 || fullname.length > 51) {
          setDisplayFullnameMaxLength(true);
          setDisabledButton(false);
        } else if (address.length < 1 || address.length > 256) {
          setDisplayAddressMaxLength(true);
          setDisabledButton(false);
        } else {
          const dataUpdate = {
            id: id,
            email: data?.email || null,
            images: images || oldImg,
            fullname: fullname,
            phone: data?.phone,
            birthday: birthday,
            gender: gender,
            address: address,
          };

          let formData = new FormData();

          formData.append("accountID", dataUpdate.id);
          formData.append("fullName", dataUpdate.fullname);
          formData.append("email", dataUpdate.email);
          formData.append("phone", dataUpdate.phone);
          formData.append("BirthDay", dataUpdate.birthday);
          formData.append("Gender", dataUpdate.gender);
          formData.append("Address", dataUpdate.address);
          formData.append("Avatar", dataUpdate.images);

          const res = await updateProfile(formData);

          if (res) {
            setDisplaySuccess(true);
            setTimeout(() => {
              setDisabledButton(false);
              handleClose();
            }, 3000);
          } else {
            setDisplayError(true);
            setDisabledButton(false);
          }
        }
      } catch (error) {
        setDisplayServerError(true);
        setDisabledButton(false);
      }
    }
  };

  useEffect(() => {
    if (data?.avt) {
      setImage(currentImg);
    }

    if (data?.name) {
      setFullname(data?.name);
    }

    if (data?.birthday) {
      setBirthday(formatDateInput(data?.birthday));
    }

    if (data?.gender) {
      setGender(data?.gender);
    }

    if (data?.address) {
      setAddress(data?.address);
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
    if (displayFullnameMaxLength) {
      timeOut = setTimeout(() => {
        setDisplayFullnameMaxLength(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayFullnameMaxLength]);

  useEffect(() => {
    let timeOut;
    if (displayAddressMaxLength) {
      timeOut = setTimeout(() => {
        setDisplayAddressMaxLength(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayAddressMaxLength]);

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

  useEffect(() => {}, [data, handleSubmit]);

  return (
    <>
      {React.cloneElement(children, {
        onClick: handleOpen,
      })}
      <ToastComponent
        open={displayEmpty}
        close={() => setDisplayEmpty(false)}
        title="Error"
        message="Field fullname & phone are required!"
        type="error"
      />

      <ToastComponent
        open={displayFullnameMaxLength}
        close={() => setDisplayFullnameMaxLength(false)}
        title="Error"
        message="Fullname must be between 1 and 50 characters!"
        type="error"
      />

      <ToastComponent
        open={displayAddressMaxLength}
        close={() => setDisplayAddressMaxLength(false)}
        title="Error"
        message="Address must be between 1 and 255 characters!"
        type="error"
      />

      <ToastComponent
        open={displayError}
        close={() => setDisplayError(false)}
        title="Error"
        message="Update profile fail!"
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
        message="Update profile successfully!"
        type="success"
      />

      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        fullWidth
        maxWidth="sm"
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
            Update Profile
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box className="form__container--modal">
            <Typography>Avatar</Typography>
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
                  loading="lazy"
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

            <Box className="form__control--modal">
              <Typography className="form__label--modal">Fullname</Typography>
              <input
                type="text"
                className="form__input--modal"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
            </Box>

            <Box className="form__control--modal">
              <Typography className="form__label--modal">Birthday</Typography>
              <input
                type="date"
                className="form__input--modal"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
            </Box>

            <Box className="form__control--modal">
              <Typography className="form__label--modal">Gender</Typography>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "2rem",
                }}
              >
                <Box className="form__input-radio--modal">
                  <input
                    type="radio"
                    name="gender"
                    id="male"
                    value="Male"
                    checked={gender === "Male"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  <label htmlFor="male">Male</label>
                </Box>

                <Box className="form__input-radio--modal">
                  <input
                    type="radio"
                    name="gender"
                    id="female"
                    value="Female"
                    checked={gender === "Female"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  <label htmlFor="female">Female</label>
                </Box>

                <Box className="form__input-radio--modal">
                  <input
                    type="radio"
                    name="gender"
                    id="other"
                    value="Other"
                    checked={gender === "Other"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  <label htmlFor="other">Other</label>
                </Box>
              </Box>
            </Box>

            <Box className="form__control--modal">
              <Typography className="form__label--modal">Address</Typography>
              <input
                type="text"
                className="form__input--modal"
                value={address}
                placeholder="Please enter your address"
                onChange={(e) => setAddress(e.target.value)}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "flex-end", gap: "2rem" }}>
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
            disabled={disabledButton}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateProfileModal;
