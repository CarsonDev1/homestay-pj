import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { themeColors } from "../../../../themes/schemes/PureLightThem";
import { AddPhotoAlternateOutlined } from "@mui/icons-material";
import secureLocalStorage from "react-secure-storage";
import ToastComponent from "../../../../components/Toast/Toast.Component";

const style = {
  color: themeColors.title,
  fontSize: 24,
  fontWeight: 700,
};

const BasicInformationPage = ({ nextStep }) => {
  const fileInputRef = useRef(null);

  const [image, setImage] = useState("");
  const [images, setImages] = useState(null);
  const [hotelName, setHotelName] = useState("");
  const [opened, setOpened] = useState("");
  const [desc, setDesc] = useState("");

  const [displayError, setDisplayError] = useState(false);
  const [displayEmpty, setDisplayEmpty] = useState(false);
  const [displayInvalidYear, setDisplayInvalidYear] = useState(false);

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

  const handleHotelNameChange = (e) => {
    setHotelName(e.target.value);
  };

  const handleOpenedChange = (e) => {
    setOpened(e.target.value);
  };

  const handleDescChange = (e) => {
    setDesc(e.target.value);
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

  const handleNextStep = () => {
    if (images === null || hotelName === "" || opened === "" || desc === "") {
      setDisplayEmpty(true);
    } else {
      const regexYear = generateYearRegexp();

      if (!regexYear.test(opened)) {
        setDisplayInvalidYear(true);
      } else {
        const data = {
          accountID: secureLocalStorage.getItem("accountId"),
          MainImage: images,
          hotelName: hotelName,
          openedIn: opened,
          description: desc,
        };

        nextStep(data);
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

  return (
    <Box display="flex" flexDirection="column" gap="2rem">
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
        open={displayError}
        close={() => setDisplayError(false)}
        title="Error"
        message="Server maintenance is underway. Please try again later!"
        type="error"
      />

      <Box display="flex" flexDirection="column" gap="1rem">
        <Typography sx={style}>Main Image</Typography>
        <Typography sx={{ color: themeColors.gray, fontSize: 18 }}>
          This image will be given priority for display
        </Typography>
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

      <Box display="flex" alignItems="center" gap="60px">
        <Box flex={1} display="flex" flexDirection="column" gap="1rem">
          <Typography sx={style}>Hotel Name</Typography>
          <TextField
            value={hotelName}
            size="small"
            sx={{ width: "100%" }}
            placeholder="Please enter name of your hotel"
            onChange={handleHotelNameChange}
          />
        </Box>

        <Box flex={0.6} display="flex" flexDirection="column" gap="1rem">
          <Typography sx={style}>Opened In</Typography>
          <TextField
            value={opened}
            size="small"
            sx={{ width: "100%" }}
            placeholder="Please enter the year of your hotel opened"
            onChange={handleOpenedChange}
          />
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" gap="1rem">
        <Typography sx={style}>Description</Typography>
        <TextField
          value={desc}
          multiline
          rows={10}
          placeholder="Please enter description of your hotel"
          onChange={handleDescChange}
        />
      </Box>

      <Box width="100%" display="flex" justifyContent="flex-end">
        <Button
          onClick={handleNextStep}
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
          }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default BasicInformationPage;
