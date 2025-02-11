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
import React, { useEffect, useState } from "react";
import { themeColors } from "../../../../../themes/schemes/PureLightThem";
import { Close } from "@mui/icons-material";
import { dataRoomAmenities } from "../../../../../utils/dataSet";
import { updateRoom } from "../../../Partner.Api";
import ToastComponent from "../../../../../components/Toast/Toast.Component";

const styles = {
  label: {
    fontSize: 20,
    fontWeight: 700,
  },
};

const AmenitiesModalUpdate = ({
  children,
  data,
  handleInformationClose,
  handleSpecialPriceClose,
}) => {
  let dataUpdateAmenities = [];

  const [open, setOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [disableButton, setDisableButton] = useState(false);

  const [displayForce, setDisplayForce] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [displayServerError, setDisplayServerError] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    handleInformationClose();
    handleSpecialPriceClose();
    setOpen(false);
  };

  const handleBack = () => {
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
    setDisableButton(true);
    dataUpdateAmenities = dataRoomAmenities
      .map((service) => ({
        serviceType: service.serviceType,
        subServices: service.subServices.filter((subService) =>
          checkedItems.includes(subService.subServiceName)
        ),
      }))
      .filter((service) => service.subServices.length > 0);

    if (dataUpdateAmenities.length < 3) {
      setDisplayForce(true);
      setDisableButton(false);
    } else {
      const dataUpdate = {
        basicInfor: data?.dataUpdateBasic,
        specialPrices: data?.dataUpdateSpecialPrice,
        roomAmenities: dataUpdateAmenities,
      };

      try {
        let formData = new FormData();

        formData.append("roomID", dataUpdate?.basicInfor?.id);
        formData.append("Room.TypeOfBed", dataUpdate?.basicInfor?.typeBed);
        formData.append(
          "Room.NumberCapacity",
          dataUpdate?.basicInfor?.numberCapacity
        );
        formData.append("Room.Price", dataUpdate?.basicInfor?.price);
        formData.append("Room.Quantity", dataUpdate?.basicInfor?.quantity);
        formData.append("Room.SizeOfRoom", dataUpdate?.basicInfor?.sizeRoom);

        const specialPrices = data?.dataUpdateSpecialPrice?.map(
          (specialPrice) => ({
            StartDate: specialPrice?.startDate,
            EndDate: specialPrice?.endDate,
            Price: specialPrice?.price,
          })
        );
        formData.append("specialPrice", JSON.stringify(specialPrices));

        formData.append("Room.TypeOfRoom", dataUpdate?.basicInfor?.typeRoom);

        dataUpdate?.basicInfor?.imagesFile?.forEach((file) => {
          formData.append("Images", file);
        });

        const services = dataUpdate?.roomAmenities?.map((service) => ({
          serviceType: service?.serviceType,
          subServiceName: service?.subServices?.map((subService) => {
            return subService?.subServiceName;
          }),
        }));
        formData.append("Services", JSON.stringify(services));

        formData.append("Room.NumberOfBed", dataUpdate?.basicInfor?.numberBed);

        const imageUrl = dataUpdate?.basicInfor?.imagesURL?.map((url) => {
          return url;
        });
        formData.append("urlImage", JSON.stringify(imageUrl));

        const response = await updateRoom(formData);

        if (response.status === 200) {
          setDisplaySuccess(true);
          setTimeout(() => {
            setDisableButton(false);
            window.location.reload();
          }, 2000);
        } else {
          setDisplayError(true);
          setDisableButton(false);
        }
      } catch (error) {
        setDisplayServerError(true);
        setDisableButton(false);
      }
    }
  };

  useEffect(() => {
    const initialCheckedItems = [];
    for (const service of data?.amenities) {
      for (const subService of service?.roomSubServices) {
        initialCheckedItems.push(subService?.subName);
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
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        fullWidth
        maxWidth="md"
      >
        <ToastComponent
          open={displayForce}
          close={() => setDisplayForce(false)}
          title="Error"
          message="You must choose at least 3 types of service for each check box!"
          type="error"
        />

        <ToastComponent
          open={displayError}
          close={() => setDisplayError(false)}
          title="Error"
          message="Update room fail!"
          type="error"
        />

        <ToastComponent
          open={displaySuccess}
          close={() => setDisplaySuccess(false)}
          title="Success"
          message="Update room successfully!"
          type="success"
        />

        <ToastComponent
          open={displayServerError}
          close={() => setDisplayServerError(false)}
          title="Error"
          message="Server maintenance is underway. Please try again later!"
          type="error"
        />

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
            Update Room - Amenities
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Stack direction="column" gap="2rem">
            {dataRoomAmenities.map((service, index) => (
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
                      width="30%"
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
            onClick={handleBack}
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
            Back
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

export default AmenitiesModalUpdate;
