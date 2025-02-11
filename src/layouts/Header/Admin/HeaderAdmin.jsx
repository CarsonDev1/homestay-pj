import { Avatar, Box, Typography } from "@mui/material";
import React from "react";
import LogoutComponent from "../../../components/Logout/Logout.Component";
import { themeColors } from "../../../themes/schemes/PureLightThem";

const HeaderAdmin = () => {
  return (
    <header
      style={{
        width: "100%",
        backgroundColor: themeColors.secondary_Default,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 30px",
      }}
    >
      <Typography
        sx={{
          fontSize: 28,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "4px",
          color: themeColors.white,
        }}
      >
        Admin Panel
      </Typography>
      <Box display="flex" alignItems="center" gap="1.5rem">
        <Avatar
          sx={{
            width: "50px",
            height: "50px",
            bgcolor: themeColors.title,
            fontSize: 20,
            color: themeColors.white,
          }}
        >
          A
        </Avatar>
        <LogoutComponent />
      </Box>
    </header>
  );
};

export default HeaderAdmin;
