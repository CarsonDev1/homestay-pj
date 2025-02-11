import { Box, Typography } from "@mui/material";
import React from "react";
import { themeColors } from "../../../../themes/schemes/PureLightThem";
import { formatDesc } from "../../../../utils/helper";

const DescriptionPage = ({ data }) => {
  return (
    <Box
      sx={{
        bgcolor: themeColors.white,
        borderRadius: "8px",
        p: "10px 20px",
        boxShadow: themeColors.boxShadow,
      }}
    >
      <Typography
        sx={{
          color: themeColors.title,
          fontSize: 24,
          fontWeight: 700,
          mb: "20px",
        }}
      >
        Hotel Description
      </Typography>
      <Box
        sx={{ display: "flex", gap: "4rem", alignItems: "center", mb: "20px" }}
      >
        <Box sx={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
          <Typography
            sx={{ fontSize: 18, fontWeight: 700, color: themeColors.black }}
          >
            Opened In:
          </Typography>
          <Typography sx={{ fontSize: 16, color: themeColors.black }}>
            {data?.year}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
          <Typography
            sx={{ fontSize: 18, fontWeight: 700, color: themeColors.black }}
          >
            Number of rooms:
          </Typography>
          <Typography sx={{ fontSize: 16, color: themeColors.black }}>
            {data?.numberRooms}
          </Typography>
        </Box>
      </Box>
      <Typography sx={{ textAlign: "justify", textWrap: "pretty", mb: "5px" }}>
        {formatDesc(data?.desc)}
      </Typography>
    </Box>
  );
};

export default DescriptionPage;
