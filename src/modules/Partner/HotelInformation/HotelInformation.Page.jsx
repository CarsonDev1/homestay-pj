import React, { useState } from "react";
import "./HotelInformation.Style.scss";
import HeaderPartner from "../../../layouts/Header/Partner/HeaderPartner";
import FooterPartner from "../../../layouts/Footer/Partner/FooterPartner";
import BoxContainer from "../../../components/Box/Box.Container";
import { Box, Stack, Typography } from "@mui/material";
import { themeColors } from "../../../themes/schemes/PureLightThem";
import BasicInformationPage from "./BasicInformation/BasicInformation.Page";
import AmenitiesManagementPage from "./AmenitiesManagement/AmenitiesManagement.Page";
import GalleryManagementPage from "./GalleryManagement/GalleryManagement.Page";
import LocationPage from "./Location/Location.Page";

const itemsSidebar = [
  "Basic Information",
  "Location",
  "Amenities Management",
  "Gallery Management",
];

const HotelInformationPage = () => {
  const [indexSidebar, setIndexSidebar] = useState(0);

  const handleSelectIndexSidebar = (index) => {
    setIndexSidebar(index);
  };

  return (
    <>
      <HeaderPartner />

      <BoxContainer property="partner-hotel__container">
        <Box className="partner-hotel__sidebar">
          <Stack direction="column" p="15px 0" gap="1rem">
            {itemsSidebar.map((item, index) => (
              <Typography
                key={index}
                onClick={() => handleSelectIndexSidebar(index)}
                sx={{
                  color:
                    index === indexSidebar
                      ? themeColors.secondary_Default
                      : themeColors.black,
                  bgcolor:
                    index === indexSidebar
                      ? themeColors.bgTitle
                      : "transparent",
                  p:
                    index === indexSidebar
                      ? "20px 0 20px 20px"
                      : "10px 0 10px 15px",
                  borderLeft:
                    index === indexSidebar
                      ? `5px solid ${themeColors.secondary_Default}`
                      : null,
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: themeColors.bgTitle,
                  },
                }}
              >
                {item}
              </Typography>
            ))}
          </Stack>
        </Box>

        <Box className="partner-hotel__content">
          {indexSidebar === 0 ? <BasicInformationPage /> : null}
          {indexSidebar === 1 ? <LocationPage /> : null}
          {indexSidebar === 2 ? <AmenitiesManagementPage /> : null}
          {indexSidebar === 3 ? <GalleryManagementPage /> : null}
        </Box>
      </BoxContainer>

      <FooterPartner />
    </>
  );
};

export default HotelInformationPage;
