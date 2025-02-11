import React, { useState } from "react";
import "./Admin.Style.scss";
import BoxContainer from "../../components/Box/Box.Container";
import {
  Box,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Stack,
  Typography,
} from "@mui/material";
import HeaderAdmin from "../../layouts/Header/Admin/HeaderAdmin";
import { themeColors } from "../../themes/schemes/PureLightThem";
import { AssetImages } from "../../utils/images";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import AdminDashboardContainer from "./Dashboard/AdminDashboard.Container";
import AccountManagementContainer from "./AccountManagement/AccountManagement.Container";
import MomentManagementContainer from "./MomentManagement/MomentManagement.Container";
import VoucherManagementContainer from "./VoucherManagement/VoucherManagement.Container";
import HotelInformationContainer from "./HotelManagement/Information/HotelInformation.Container";
import ReportFeedbackContainer from "./HotelManagement/ReportFeedback/ReportFeedback.Container";
import RegisteringHotelContainer from "./HotelManagement/RegisteringHotel/RegisteringHotel.Container";

const subItems = ["Basic Information", "Report Feedback", "Registering Form"];

const AdminPage = () => {
  const [isSelectedSidebar, setIsSelectedSidebar] = useState(0);
  const [isSelectedSubSidebar, setIsSelectedSubSidebar] = useState(3);
  const [isHotelManagementExpanded, setIsHotelManagementExpanded] =
    useState(false);
  const [isHotelManagementOpened, setIsHotelManagementOpened] = useState(false);

  const handleHotelManagementClicked = (index) => {
    if (index === 1) {
      setIsHotelManagementExpanded(!isHotelManagementExpanded);
      setIsHotelManagementOpened(!isHotelManagementOpened);
    }
  };

  const handleSelectIndexSidebar = (index) => {
    setIsSelectedSidebar(index);
    if (index === 0 || index === 1 || index === 2 || index === 3) {
      document.documentElement.scrollTop = 0;
      setIsHotelManagementOpened(false);
      setIsSelectedSubSidebar(3);
    } else {
      handleHotelManagementClicked();
    }
  };

  const handleSelectIndexSubSidebar = (index) => {
    document.documentElement.scrollTop = 0;
    setIsSelectedSubSidebar(index);
    setIsSelectedSidebar(5);
  };

  return (
    <BoxContainer property="admin__container">
      <Box
        sx={{
          flex: 0.5,
          bgcolor: themeColors.primary_Default,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "fixed",
          height: "100%",
        }}
      >
        <Stack direction="row" justifyContent="center" p="30px 0">
          <img
            src={AssetImages.LOGO}
            alt=""
            style={{ width: "120px", height: "120px" }}
          />
        </Stack>
        <List disablePadding sx={{ width: "100%" }}>
          <Stack direction="column" gap="1rem">
            <ListItem disablePadding>
              <ListItemButton
                className="list-item__button"
                onClick={() => handleSelectIndexSidebar(0)}
                sx={{
                  bgcolor:
                    isSelectedSidebar === 0
                      ? themeColors.thirdary_Default
                      : "transparent",
                  "&:hover": {
                    bgcolor:
                      isSelectedSidebar === 0
                        ? themeColors.thirdary_Default
                        : "rgba(2, 112, 199, .5)",
                  },
                }}
              >
                <ListItemIcon>
                  <img src={AssetImages.ICONS.ADMIN.DASHBOARD} alt="" />
                </ListItemIcon>

                <Typography
                  className="list-item__title"
                  sx={{ fontWeight: isSelectedSidebar === 0 ? 700 : "normal" }}
                >
                  Dashboard
                </Typography>
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                className="list-item__button"
                onClick={() => handleHotelManagementClicked(1)}
                sx={{
                  bgcolor: "transparent",
                  "&:hover": {
                    bgcolor: "rgba(2, 112, 199, .5)",
                  },
                }}
              >
                <ListItemIcon onClick={handleHotelManagementClicked}>
                  <img src={AssetImages.ICONS.ADMIN.HOTEL} alt="" />
                </ListItemIcon>

                <Typography
                  className="list-item__title"
                  onClick={handleHotelManagementClicked}
                  sx={{ fontWeight: "normal" }}
                >
                  Hotel Management
                </Typography>

                <IconButton
                  onClick={handleHotelManagementClicked}
                  sx={{ marginLeft: "auto", color: themeColors.white }}
                >
                  {isHotelManagementExpanded ? (
                    isHotelManagementOpened ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )
                  ) : !isHotelManagementOpened ? (
                    <ExpandMore />
                  ) : (
                    <ExpandLess />
                  )}
                </IconButton>
              </ListItemButton>
            </ListItem>

            <Collapse in={isHotelManagementOpened} timeout="auto" unmountOnExit>
              <Stack direction="column" gap="1rem">
                {subItems.map((item, index) => (
                  <ListItem disablePadding key={index}>
                    <ListItemButton
                      className="list-item__button"
                      onClick={() => handleSelectIndexSubSidebar(index)}
                      sx={{
                        bgcolor:
                          index === isSelectedSubSidebar
                            ? themeColors.thirdary_Default
                            : "transparent",
                        pl: "4rem",
                        "&:hover": {
                          bgcolor:
                            index === isSelectedSubSidebar
                              ? themeColors.thirdary_Default
                              : "rgba(2, 112, 199, .5)",
                        },
                      }}
                    >
                      <ListItemIcon>
                        {index === 0 ? (
                          <img
                            src={AssetImages.ICONS.ADMIN.INFORMATION}
                            alt=""
                            style={{ width: 24, height: 24 }}
                          />
                        ) : null}
                        {index === 1 ? (
                          <img
                            src={AssetImages.ICONS.ADMIN.REPORT}
                            alt=""
                            style={{ width: 24, height: 24 }}
                          />
                        ) : null}
                        {index === 2 ? (
                          <img
                            src={AssetImages.ICONS.ADMIN.FORM}
                            alt=""
                            style={{ width: 24, height: 24 }}
                          />
                        ) : null}
                      </ListItemIcon>

                      <Typography
                        className="list-item__sub-title"
                        sx={{
                          fontWeight:
                            index === isSelectedSubSidebar ? 700 : "normal",
                        }}
                      >
                        {item}
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                ))}
              </Stack>
            </Collapse>

            <ListItem disablePadding>
              <ListItemButton
                className="list-item__button"
                onClick={() => handleSelectIndexSidebar(1)}
                sx={{
                  bgcolor:
                    isSelectedSidebar === 1
                      ? themeColors.thirdary_Default
                      : "transparent",
                  "&:hover": {
                    bgcolor:
                      isSelectedSidebar === 1
                        ? themeColors.thirdary_Default
                        : "rgba(2, 112, 199, .5)",
                  },
                }}
              >
                <ListItemIcon>
                  <img src={AssetImages.ICONS.ADMIN.ACCOUNT} alt="" />
                </ListItemIcon>

                <Typography
                  className="list-item__title"
                  sx={{ fontWeight: isSelectedSidebar === 1 ? 700 : "normal" }}
                >
                  Account Management
                </Typography>
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                className="list-item__button"
                onClick={() => handleSelectIndexSidebar(2)}
                sx={{
                  bgcolor:
                    isSelectedSidebar === 2
                      ? themeColors.thirdary_Default
                      : "transparent",
                  "&:hover": {
                    bgcolor:
                      isSelectedSidebar === 2
                        ? themeColors.thirdary_Default
                        : "rgba(2, 112, 199, .5)",
                  },
                }}
              >
                <ListItemIcon>
                  <img src={AssetImages.ICONS.ADMIN.MOMENT} alt="" />
                </ListItemIcon>

                <Typography
                  className="list-item__title"
                  sx={{ fontWeight: isSelectedSidebar === 2 ? 700 : "normal" }}
                >
                  Post Management
                </Typography>
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                className="list-item__button"
                onClick={() => handleSelectIndexSidebar(3)}
                sx={{
                  bgcolor:
                    isSelectedSidebar === 3
                      ? themeColors.thirdary_Default
                      : "transparent",
                  "&:hover": {
                    bgcolor:
                      isSelectedSidebar === 3
                        ? themeColors.thirdary_Default
                        : "rgba(2, 112, 199, .5)",
                  },
                }}
              >
                <ListItemIcon>
                  <img src={AssetImages.ICONS.ADMIN.VOUCHER} alt="" />
                </ListItemIcon>

                <Typography
                  className="list-item__title"
                  sx={{ fontWeight: isSelectedSidebar === 3 ? 700 : "normal" }}
                >
                  Voucher Management
                </Typography>
              </ListItemButton>
            </ListItem>
          </Stack>
        </List>
      </Box>
      <Box sx={{ flex: 2, ml: "19%" }}>
        <HeaderAdmin />
        {isSelectedSidebar === 0 ? <AdminDashboardContainer /> : null}
        {isSelectedSidebar === 1 ? <AccountManagementContainer /> : null}
        {isSelectedSidebar === 2 ? <MomentManagementContainer /> : null}
        {isSelectedSidebar === 3 ? <VoucherManagementContainer /> : null}

        {isSelectedSubSidebar === 0 ? <HotelInformationContainer /> : null}
        {isSelectedSubSidebar === 1 ? <ReportFeedbackContainer /> : null}
        {isSelectedSubSidebar === 2 ? <RegisteringHotelContainer /> : null}

        <Box display="flex" p="30px 0 50px" bgcolor={themeColors.bkgPage}>
          <Typography
            sx={{
              m: "auto",
              bgcolor: themeColors.white,
              p: "15px 15px",
              width: "80%",
              textAlign: "center",
              borderRadius: "6px",
            }}
          >
            2024 © - Designed by <span>BTD900</span>
          </Typography>
        </Box>
      </Box>
    </BoxContainer>
  );
};

export default AdminPage;
