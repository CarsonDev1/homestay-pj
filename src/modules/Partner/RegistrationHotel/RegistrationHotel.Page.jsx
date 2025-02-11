import React, { useState } from "react";
import "./RegistrationHotel.Style.scss";
import BoxContainer from "../../../components/Box/Box.Container";
import { Box, Stack, Typography } from "@mui/material";
import FooterPartner from "../../../layouts/Footer/Partner/FooterPartner";
import BasicInformationPage from "./BasicInformation/BasicInformation.Page";
import AmenitiesPage from "./Amenities/Amenities.Page";
import GalleryPage from "./Gallery/Gallery.Page";
import { themeColors } from "../../../themes/schemes/PureLightThem";
import LocationPage from "./Location/Location.Page";

const itemsSidebar = ["Basic Information", "Location", "Amenities", "Gallery"];

const RegistrationHotelPage = () => {
  const [step, setStep] = useState(0);
  const [dataHotel, setDataHotel] = useState({});

  const nextStep = (data) => {
    setStep(step + 1);
    document.documentElement.scrollTop = 0;
    setDataHotel({ ...data, ...dataHotel });
  };

  const prevStep = () => {
    setStep(step - 1);
    document.documentElement.scrollTop = 0;
  };

  const multiStepForm = () => {
    switch (step) {
      case 0:
        return <BasicInformationPage nextStep={nextStep} />;
      case 1:
        return <LocationPage prevStep={prevStep} nextStep={nextStep} />;
      case 2:
        return <AmenitiesPage prevStep={prevStep} nextStep={nextStep} />;
      case 3:
        return <GalleryPage prevStep={prevStep} data={dataHotel} />;
      default:
        return null;
    }
  };

  return (
    <>
      <BoxContainer property="registration-form__container">
        <Box width="100%" mb="20px">
          <Typography
            sx={{
              textAlign: "center",
              fontSize: 30,
              fontWeight: 700,
              color: themeColors.title,
            }}
          >
            Hotel Information Registration
          </Typography>
        </Box>

        <Box className="registration-form__content">
          <Box className="registration-form__sidebar">
            <Stack direction="column" p="15px 0" gap="1rem">
              {itemsSidebar.map((item, index) => (
                <Typography
                  key={index}
                  sx={{
                    color:
                      index === step
                        ? themeColors.secondary_Default
                        : themeColors.black,
                    bgcolor:
                      index === step ? themeColors.bgTitle : "transparent",
                    p: index === step ? "20px 0 20px 20px" : "10px 0 10px 15px",
                    borderLeft:
                      index === step
                        ? `5px solid ${themeColors.secondary_Default}`
                        : null,
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Stack>
          </Box>

          <Box className="registration-form__form">{multiStepForm()}</Box>
        </Box>
      </BoxContainer>
      <FooterPartner />
    </>
  );
};

export default RegistrationHotelPage;
