import React, { useEffect, useState } from "react";
import { dataHotelAmenities } from "../../../../../utils/dataSet";
import { themeColors } from "../../../../../themes/schemes/PureLightThem";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { updateAmenities } from "../../../Partner.Api";
import secureLocalStorage from "react-secure-storage";
import ToastComponent from "../../../../../components/Toast/Toast.Component";

const styles = {
  label: {
    fontSize: 20,
    fontWeight: 700,
  },
};

const UpdateAmenitiesModal = ({ children, data }) => {
  const [open, setOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);

  const [disabledButton, setDisabledButton] = useState(false);

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

  const handleCheckboxChange = (subServiceName) => {
    setCheckedItems((prev) => {
      if (prev.includes(subServiceName)) {
        return prev.filter((item) => item !== subServiceName);
      } else {
        return [...prev, subServiceName];
      }
    });
  };

  const handleSubmit = async () => {
    setDisabledButton(true);
    const updatedRoomAmenities = dataHotelAmenities
      .map((service) => {
        const subServiceNames = service.subServices
          .filter((subService) =>
            checkedItems.includes(subService.subServiceName)
          )
          .map((subService) => subService.subServiceName);

        return {
          serviceType: service.serviceType,
          subServiceName: subServiceNames,
        };
      })
      .filter((service) => service.subServiceName.length > 0);

    if (updatedRoomAmenities.length <= 3) {
      setDisplayForce(true);
      setDisabledButton(false);
    } else {
      try {
        const data = {
          hotelID: secureLocalStorage.getItem("hotelId"),
          services: updatedRoomAmenities,
        };

        const response = await updateAmenities(data);

        if (response.status === 200) {
          setDisplaySuccess(true);
          setTimeout(() => {
            setDisabledButton(false);
            handleClose();
          }, 2000);
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
    const initialCheckedItems = [];
    for (const service of data?.amenities) {
      for (const subService of service.subServices) {
        initialCheckedItems.push(subService.subServiceName);
      }
    }
    setCheckedItems(initialCheckedItems);
  }, [data?.amenities]);

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
      <ToastComponent
        open={displayForce}
        close={() => setDisplayForce(false)}
        title="Error"
        message="You should choose at least 3 types for each check box!"
        type="error"
      />

      <ToastComponent
        open={displayError}
        close={() => setDisplayError(false)}
        title="Error"
        message="Update hotel's amenities fail!"
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
        message="Update hotel's amenities successfully!"
        type="success"
      />

      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{ color: themeColors.title, fontSize: 24, fontWeight: 700 }}
          >
            Update Amenities
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Stack direction="column" gap="2rem">
            {dataHotelAmenities.map((service, index) => (
              <Box key={index} display="flex" flexDirection="column" gap="1rem">
                <Typography sx={styles.label}>{service.serviceType}</Typography>
                <Box
                  display="flex"
                  alignItems="center"
                  flexWrap="wrap"
                  gap="2rem"
                >
                  {service.subServices.map((subService, index) => (
                    <Box
                      width="31%"
                      key={index}
                      display="flex"
                      alignItems="center"
                      gap=".8rem"
                    >
                      <input
                        type="checkbox"
                        name={subService.subServiceName}
                        id={subService.subServiceName}
                        style={{
                          minWidth: 18,
                          maxWidth: 18,
                          minHeight: 18,
                          maxHeight: 18,
                        }}
                        checked={checkedItems.includes(
                          subService.subServiceName
                        )}
                        onChange={() =>
                          handleCheckboxChange(subService.subServiceName)
                        }
                      />
                      <label
                        htmlFor={subService.subServiceName}
                        style={{
                          fontSize: 18,
                        }}
                      >
                        {subService.subServiceName}
                      </label>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Stack>
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

export default UpdateAmenitiesModal;
