import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { dataHotelAmenities } from "../../../../utils/dataSet";
import { themeColors } from "../../../../themes/schemes/PureLightThem";
import ToastComponent from "../../../../components/Toast/Toast.Component";

const AmenitiesPage = ({ prevStep, nextStep }) => {
  let dataAmenities = [];
  const [checkedItems, setCheckedItems] = useState([]);

  const [displayForce, setDisplayForce] = useState(false);

  const handleCheckboxChange = (subServiceName) => {
    setCheckedItems((prev) => {
      if (prev.includes(subServiceName)) {
        return prev.filter((item) => item !== subServiceName);
      } else {
        return [...prev, subServiceName];
      }
    });
  };

  const handleSubmit = () => {
    dataAmenities = dataHotelAmenities
      .map((service) => ({
        serviceType: service.serviceType,
        subServices: service.subServices.filter((subService) =>
          checkedItems.includes(subService.subServiceName)
        ),
      }))
      .filter((service) => service.subServices.length > 0);

    if (dataAmenities.length === 0 || dataAmenities.length < 3) {
      setDisplayForce(true);
    } else {
      nextStep({ services: dataAmenities });
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

  return (
    <Box display="flex" flexDirection="column" gap="2rem">
      <ToastComponent
        open={displayForce}
        close={() => setDisplayForce(false)}
        title="Error"
        message="You must choose at least 3 types of service for each check box!"
        type="error"
      />

      <Typography
        sx={{ fontSize: 24, color: themeColors.title, fontWeight: 700 }}
      >
        Show customers what services they will get.
      </Typography>

      <Typography
        sx={{ fontSize: 18, color: themeColors.gray, textAlign: "justify" }}
      >
        You can also update amenities later.
      </Typography>

      {dataHotelAmenities.map((type, index) => (
        <Box key={index} display="flex" flexDirection="column" gap="1rem">
          <Typography
            sx={{ fontSize: 22, fontWeight: 700, color: themeColors.title }}
          >
            {type.serviceType}
          </Typography>
          <Typography sx={{ fontSize: 18, color: themeColors.gray }}>
            {type.guide}
          </Typography>

          <Box
            width="100%"
            display="flex"
            alignItems="center"
            flexWrap="wrap"
            gap="1.5rem"
          >
            {type.subServices.map((subService, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                gap="1rem"
                width="31%"
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
                  onChange={() =>
                    handleCheckboxChange(subService.subServiceName)
                  }
                />
                <label
                  htmlFor={subService.subServiceName}
                  style={{ fontSize: 18, color: themeColors.black }}
                >
                  {subService.subServiceName}
                </label>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
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
          onClick={handleSubmit}
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

export default AmenitiesPage;
