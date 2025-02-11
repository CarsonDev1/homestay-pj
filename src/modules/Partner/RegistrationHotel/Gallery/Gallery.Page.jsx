import { Box, Button, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { themeColors } from "../../../../themes/schemes/PureLightThem";
import { AddPhotoAlternateOutlined, Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../../routes";
import ToastComponent from "../../../../components/Toast/Toast.Component";
import secureLocalStorage from "react-secure-storage";
import { registrationHotel } from "../../Partner.Api";

const GalleryPage = ({ prevStep, data }) => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [disableButton, setDisableButton] = useState(false);

  const [displayWaiting, setDisplayWaiting] = useState(false);
  const [displayForce, setDisplayForce] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [displayServerError, setDisplayServerError] = useState(false);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files].slice(0, 20));
  };

  const handleRemoveImage = (indexToRemove) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0 || selectedFiles.length < 6) {
      setDisplayForce(true);
    } else {
      try {
        setDisplayWaiting(true);

        const dataHotel = {
          data: {
            ...data,
            selectedFiles,
          },
        };

        let formData = new FormData();

        formData.append("MainImage", dataHotel.data.MainImage);
        formData.append("accountID", secureLocalStorage.getItem("accountId"));
        formData.append("city", dataHotel.data.city);
        formData.append("hotelName", dataHotel.data.hotelName);
        formData.append("hotelAddress", dataHotel.data.address);
        formData.append("openedIn", dataHotel.data.openedIn);
        formData.append("description", dataHotel.data.description);
        formData.append("latitude", dataHotel.data.lat);
        formData.append("longitude", dataHotel.data.lng);
        selectedFiles.forEach((file) => {
          formData.append(`Images`, file);
        });

        const services = dataHotel.data.services.map((service) => ({
          serviceType: service.serviceType,
          subServiceName: service.subServices.map((subService) => {
            return subService.subServiceName;
          }),
        }));

        formData.append("Services", JSON.stringify(services));

        setDisableButton(true);

        const response = await registrationHotel(formData);

        if (response.status === 200) {
          setDisplayWaiting(false);
          setDisplaySuccess(true);
          setTimeout(() => {
            setDisableButton(false);
            secureLocalStorage.removeItem("accountId");
            navigate(routes.home.root);
          }, 2000);
        } else {
          setDisplayWaiting(false);
          setDisplayError(true);
          setDisableButton(false);
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
    <Box display="flex" flexDirection="column" gap="2rem">
      <ToastComponent
        open={displayWaiting}
        close={() => setDisplayWaiting(false)}
        title="Loading..."
        message="Please waiting..."
        type="loading"
      />

      <ToastComponent
        open={displayForce}
        close={() => setDisplayForce(false)}
        title="Error"
        message="You must upload at least 6 photos to completed registration hotel!"
        type="error"
      />

      <ToastComponent
        open={displayError}
        close={() => setDisplayError(false)}
        title="Error"
        message="Registration hotel fail!"
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
        message="Registration hotel successfully. Please wait an admin approve!"
        type="success"
      />

      <Typography
        sx={{ fontSize: 24, fontWeight: 700, color: themeColors.title }}
      >
        Show customers what they're missing out on.
      </Typography>

      <Typography
        sx={{ fontSize: 20, color: themeColors.gray, textAlign: "justify" }}
      >
        Image is very important to visitors. Post as many photos as possible, up
        to 20 photos. You can also add photos later.
      </Typography>

      <Typography
        sx={{ fontSize: 18, color: themeColors.gray, textAlign: "justify" }}
      >
        Remember all images in here has title is Hotel View.
      </Typography>

      <Box
        width="100%"
        display="flex"
        flexWrap="wrap"
        gap="2rem"
        alignItems="center"
      >
        {selectedFiles.length >= 0 && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "29px",
              borderRadius: "8px",
            }}
          >
            {selectedFiles.map((file, index) => (
              <Box
                key={index}
                position="relative"
                sx={{
                  display: "inline-block",
                  width: "240px",
                  height: "200px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`preview ${index}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                {!disableButton && (
                  <IconButton
                    sx={{
                      width: 30,
                      height: 30,
                      position: "absolute",
                      color: themeColors.white,
                      top: 5,
                      right: 5,
                    }}
                    onClick={() => handleRemoveImage(index)}
                  >
                    <Close />
                  </IconButton>
                )}
              </Box>
            ))}
            {selectedFiles.length < 20 && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  width: "240px",
                  height: "200px",
                  border: "1px dashed #A9A9A9",
                  position: "relative",
                  cursor: "pointer",
                }}
                onClick={() => document.getElementById("fileInput").click()}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "240px",
                    height: "100%",
                  }}
                >
                  <AddPhotoAlternateOutlined sx={{ width: 80, height: 80 }} />
                  <input
                    type="file"
                    id="fileInput"
                    multiple
                    onChange={handleFileChange}
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "200px",
                      opacity: 0,
                      display: "none",
                    }}
                  />
                </Box>
                <span
                  style={{
                    margin: "10px 0",
                    fontSize: "1rem",
                    color: themeColors.gray,
                  }}
                >
                  {selectedFiles.length}/20 Pictures
                </span>
              </Box>
            )}
          </Box>
        )}
      </Box>

      <Box width="100%" display="flex" justifyContent="space-between">
        <Button
          onClick={() => prevStep()}
          sx={{
            width: "15%",
            textTransform: "none",
            color: themeColors.primary_600,
            fontSize: 18,
            border: `1px solid ${themeColors.primary_600}`,
            borderRadius: "8px",
            "&:hover": {
              bgcolor: themeColors.bg_Disabled,
            },
          }}
        >
          Back
        </Button>

        <Button
          sx={{
            width: "15%",
            textTransform: "none",
            color: themeColors.white,
            fontSize: 18,
            fontWeight: 700,
            bgcolor: themeColors.primary_Default,
            borderRadius: "8px",
            "&:hover": {
              bgcolor: themeColors.primary_600,
            },
            "&:disabled": {
              bgcolor: themeColors.bg_Disabled,
              color: themeColors.text_Disabled,
            },
          }}
          onClick={handleSubmit}
          disabled={disableButton}
        >
          Register
        </Button>
      </Box>
    </Box>
  );
};

export default GalleryPage;
