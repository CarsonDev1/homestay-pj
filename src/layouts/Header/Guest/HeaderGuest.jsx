import React from "react";
import { AssetImages } from "../../../utils/images";
import { Button, Typography } from "@mui/material";
import "./HeaderGuest.Style.scss";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../routes";
import secureLocalStorage from "react-secure-storage";

const HeaderGuest = () => {
  const navigate = useNavigate();

  return (
    <header className="header__container--guest">
      <img src={AssetImages.LOGO} alt="" className="logo" />
      <div className="nav__container">
        <Typography
          className="nav__item"
          onClick={() => {
            secureLocalStorage.removeItem("city");
            navigate(routes.home.root);
          }}
        >
          Home
        </Typography>

        <Typography
          className="nav__item"
          onClick={() => navigate(routes.home.listHotels)}
        >
          Hotels
        </Typography>

        <Typography
          className="nav__item"
          onClick={() => navigate(routes.home.listMoments)}
        >
          Moments
        </Typography>

        <Typography
          className="nav__item"
          onClick={() => navigate(routes.home.listVouchers)}
        >
          Vouchers
        </Typography>

        <Typography
          className="nav__item"
          onClick={() => navigate(routes.home.aboutUs)}
        >
          About Us
        </Typography>
      </div>
      <div className="auth__container">
        <Button
          className="btn--partner__registration"
          onClick={() => navigate(routes.auth.partnerRegistration)}
        >
          Partner Registration
        </Button>

        <Button
          className="btn--login__register"
          onClick={() => navigate(routes.auth.login)}
        >
          Login/Register
        </Button>
      </div>
    </header>
  );
};

export default HeaderGuest;
