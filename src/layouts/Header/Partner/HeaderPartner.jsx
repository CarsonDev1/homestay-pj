/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { AssetImages } from "../../../utils/images";
import { Avatar, Box, Typography } from "@mui/material";
import "./HeaderPartner.Style.scss";
import LogoutComponent from "../../../components/Logout/Logout.Component";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../routes";
import { getProfile } from "../../../modules/Auth/Auth.Api";
import secureLocalStorage from "react-secure-storage";
import { URL_IMAGE } from "../../../services/ApiUrl";
import { useDispatch } from "react-redux";

const HeaderPartner = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [data, setData] = useState({});

  const init = async () => {
    const res = await getProfile(
      secureLocalStorage.getItem("accountId"),
      dispatch
    );
    if (res) {
      setData(res);
    }
  };

  useEffect(() => {
    init();
  }, [data]);

  return (
    <header className="header__container--partner">
      <img src={AssetImages.LOGO} alt="" className="logo" />
      <div className="nav__container">
        <Typography
          className="nav__item"
          onClick={() => navigate(routes.partner.dashboard)}
        >
          Dashboard
        </Typography>

        <Typography
          className="nav__item"
          onClick={() => navigate(routes.partner.hotelInfor)}
        >
          Hotel Information
        </Typography>

        <Typography
          className="nav__item"
          onClick={() => navigate(routes.partner.roomManagement)}
        >
          Rooms
        </Typography>

        <Typography
          className="nav__item"
          onClick={() => navigate(routes.partner.bookingManagement)}
        >
          Bookings
        </Typography>

        <Typography
          className="nav__item"
          onClick={() => navigate(routes.partner.profile)}
        >
          Profile
        </Typography>

        <Typography
          className="nav__item"
          onClick={() => navigate(routes.partner.feedbackManagement)}
        >
          Reviews
        </Typography>
      </div>
      <div className="auth__container">
        <Box className="btn--is__logged">
          {data?.profile?.avatar ? (
            data?.profile?.avatar?.startsWith("/", 0) ? (
              <Avatar
                src={`${URL_IMAGE}${data?.profile?.avatar}`}
                sx={{ width: 30, height: 30, pointerEvents: "none" }}
              />
            ) : (
              <Avatar
                src={data?.profile?.avatar}
                sx={{ width: 30, height: 30, pointerEvents: "none" }}
              />
            )
          ) : (
            <img src={AssetImages.ICONS.USER} alt="" />
          )}
          {data?.profile?.fullName}
        </Box>
        <LogoutComponent />
      </div>
    </header>
  );
};

export default HeaderPartner;
