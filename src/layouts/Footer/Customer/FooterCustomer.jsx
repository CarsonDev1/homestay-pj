import React from "react";
import "./FooterCustomer.Style.scss";
import { Divider, Typography } from "@mui/material";
import { AssetImages } from "../../../utils/images";
import { themeColors } from "../../../themes/schemes/PureLightThem";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../routes";

const FooterCustomer = () => {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate(routes.home.root);
    document.documentElement.scrollTop = 0;
  };

  const goToListHotel = () => {
    navigate(routes.home.listHotels);
    document.documentElement.scrollTop = 0;
  };

  const goToListMoment = () => {
    navigate(routes.home.listMoments);
    document.documentElement.scrollTop = 0;
  };

  const goToListVoucher = () => {
    navigate(routes.home.listVouchers);
    document.documentElement.scrollTop = 0;
  };

  const goToAboutUs = () => {
    navigate(routes.home.aboutUs);
    document.documentElement.scrollTop = 0;
  };

  return (
    <footer className="footer__container--customer">
      <div className="footer--logo">
        <Divider
          sx={{
            width: "42%",
            height: 0.5,
            bgcolor: themeColors.white,
          }}
        />
        <img src={AssetImages.LOGO} alt="" className="logo" />
        <Divider
          sx={{
            width: "42%",
            height: 0.5,
            bgcolor: themeColors.white,
          }}
        />
      </div>

      <div className="footer--wrapper">
        <div className="wrapper--box">
          <Typography className="box__title">Contact Information</Typography>
          <div className="box__item">
            <img src={AssetImages.ICONS.PHONE} alt="" />
            <Typography className="item__text">
              +84 - 982 - 004 - 055
            </Typography>
          </div>

          <div className="box__item">
            <img src={AssetImages.ICONS.PHONE} alt="" />
            <Typography className="item__text">
              +84 - 907 - 625 - 917
            </Typography>
          </div>

          <div className="box__item">
            <img src={AssetImages.ICONS.PHONE} alt="" />
            <Typography className="item__text">
              +84 - 386 - 040 - 060
            </Typography>
          </div>

          <div className="box__item">
            <img src={AssetImages.ICONS.MAIL} alt="" />
            <Typography className="item__text">eposhhotel@gmail.com</Typography>
          </div>

          <div className="box__item">
            <img src={AssetImages.ICONS.LOCATION} alt="" />
            <Typography className="item__text">
              FPT University, Ninh Kieu, Can Tho
            </Typography>
          </div>
        </div>

        <div className="wrapper--box">
          <Typography className="box__title">Quick Navigation</Typography>
          <div className="box__item quick-nav" onClick={goToHome}>
            <img src={AssetImages.ICONS.RIGHT} alt="" />
            <Typography className="item__text nav">Home</Typography>
          </div>

          <div className="box__item quick-nav" onClick={goToListHotel}>
            <img src={AssetImages.ICONS.RIGHT} alt="" />
            <Typography className="item__text nav">Hotels</Typography>
          </div>

          <div className="box__item quick-nav" onClick={goToListMoment}>
            <img src={AssetImages.ICONS.RIGHT} alt="" />
            <Typography className="item__text nav">Moments</Typography>
          </div>

          <div className="box__item quick-nav" onClick={goToListVoucher}>
            <img src={AssetImages.ICONS.RIGHT} alt="" />
            <Typography className="item__text nav">Vouchers</Typography>
          </div>

          <div className="box__item quick-nav" onClick={goToAboutUs}>
            <img src={AssetImages.ICONS.RIGHT} alt="" />
            <Typography className="item__text nav">About Us</Typography>
          </div>
        </div>

        <div className="wrapper--box">
          <Typography className="box__title">Download app Eposh.com</Typography>
          <div className="box__qr-code">
            <img
              src={AssetImages.QRCODE}
              alt=""
              style={{ width: "222.8px", height: "226.8px" }}
            />

            <div className="box__download">
              <img
                src={AssetImages.CHPLAY}
                alt=""
                style={{ width: "150px", height: "auto" }}
              />

              <img
                src={AssetImages.APPSTORE}
                alt=""
                style={{ width: "150px", height: "auto" }}
              />

              <Typography className="item__text">
                Scan the QR code to download the application
              </Typography>
            </div>
          </div>
        </div>
      </div>

      <Divider
        sx={{
          width: "100%",
          height: "1px",
          bgcolor: themeColors.white,
          m: "20px 0",
        }}
      />

      <div className="credit">
        Created by
        <span> BTD900 </span>| all right reserved
      </div>
    </footer>
  );
};

export default FooterCustomer;
