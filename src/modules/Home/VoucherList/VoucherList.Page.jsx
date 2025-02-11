import React, { useState, useEffect } from "react";
import HeaderGuest from "../../../layouts/Header/Guest/HeaderGuest";
import FooterCustomer from "../../../layouts/Footer/Customer/FooterCustomer";
import BoxContainer from "../../../components/Box/Box.Container";
import { Box, Typography } from "@mui/material";
import { AssetImages } from "../../../utils/images";
import "./VoucherList.Style.scss";
import { getAllVoucher, receiveVoucher } from "../Home.Api";
import { themeColors } from "../../../themes/schemes/PureLightThem";
import { URL_IMAGE } from "../../../services/ApiUrl";
import { checkLogin } from "../../../utils/helper";
import HeaderUser from "../../../layouts/Header/User/HeaderUser";
import secureLocalStorage from "react-secure-storage";
import ToastComponent from "../../../components/Toast/Toast.Component";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../routes";

const VoucherListPage = () => {
  const images = [
    AssetImages.BANNER.BANNER_1,
    AssetImages.BANNER.BANNER_2,
    AssetImages.BANNER.BANNER_3,
    AssetImages.BANNER.BANNER_4,
    AssetImages.BANNER.BANNER_5,
  ];

  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [fetchData, setFetchData] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [voucherPage, setVoucherPage] = useState(8);

  const [displaySuccess, setDisplaySuccess] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [displayServerError, setDisplayServerError] = useState(false);

  const handleSeeMore = () => {
    setVoucherPage((prev) => prev + 3);
  };

  const init = async () => {
    const res = await getAllVoucher();
    if (res) {
      setData(res);
    }
  };

  const handleReceive = async (voucherId) => {
    if (!checkLogin()) {
      navigate(routes.auth.login);
    } else {
      try {
        let formData = new FormData();

        formData.append("accountID", secureLocalStorage.getItem("accountId"));
        formData.append("voucherID", voucherId);

        const response = await receiveVoucher(formData);

        if (response.status === 200) {
          setDisplaySuccess(true);
        } else {
          setDisplayError(true);
        }
      } catch (error) {
        setDisplayServerError(true);
      }
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setFetchData(true);
    }, 3000);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    let timeOut;
    if (displayServerError) {
      timeOut = setTimeout(() => {
        setDisplayServerError(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayServerError]);

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

  useEffect(() => {
    let timeOut;
    if (displaySuccess) {
      timeOut = setTimeout(() => {
        setDisplaySuccess(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displaySuccess]);

  return (
    <>
      <BoxContainer property="Voucher__container">
        {checkLogin() ? <HeaderUser /> : <HeaderGuest />}
        <ToastComponent
          open={displayError}
          close={() => setDisplayError(false)}
          title="Warning"
          message="You have already received this voucher!"
          type="warning"
        />

        <ToastComponent
          open={displayServerError}
          close={() => setDisplayServerError(false)}
          title="Error"
          message="Server maintenance is underway. Please try again later!"
          type="error"
        />

        <ToastComponent
          open={displaySuccess}
          close={() => setDisplaySuccess(false)}
          title="Success"
          message="Receive voucher successfully!"
          type="success"
        />

        <Box className="content__banner ">
          <Box className="banner">
            <img
              src={`${images[currentImageIndex]}`}
              alt=""
              style={{ width: "100%", objectFit: "cover", display: "block" }}
            />
          </Box>
        </Box>

        {fetchData ? (
          <div className="voucherlist_container">
            <div className="boxes-container">
              {data?.map((voucher, index) => {
                if (index > voucherPage) {
                  return null;
                } else {
                  return (
                    <div key={voucher?.voucherID} className="box">
                      <img
                        loading="lazy"
                        src={`${URL_IMAGE}${voucher?.voucherImage}`}
                        alt={voucher?.voucherName}
                      />
                      <h1>{voucher?.voucherName}</h1>
                      <button onClick={() => handleReceive(voucher?.voucherID)}>
                        Get Coupon
                      </button>
                    </div>
                  );
                }
              })}
            </div>
            <Box display="flex" m="20px 0 0">
              {voucherPage < data?.length ? (
                <Box
                  onClick={handleSeeMore}
                  sx={{
                    m: "auto",
                  }}
                >
                  <Typography
                    sx={{
                      color: themeColors.white,
                      fontSize: 18,
                      textAlign: "center",
                      bgcolor: themeColors.secondary_Default,
                      p: "10px 30px",
                      borderRadius: "8px",
                      transition: "all .2s linear",
                      "&:hover": {
                        cursor: "pointer",
                        bgcolor: themeColors.thirdary_Default,
                      },
                    }}
                  >
                    See more
                  </Typography>
                </Box>
              ) : (
                <Typography
                  sx={{
                    m: "auto",
                    fontSize: "1.2rem",
                    color: "black",
                    fontWeight: "500",
                  }}
                >
                  You have just viewed {data?.length}{" "}
                  {data?.length > 1 ? "vouchers" : "voucher"}
                </Typography>
              )}
            </Box>
          </div>
        ) : (
          <Box
            width="100%"
            p="20px 60px"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <LoadingButton
              loading
              variant="outlined"
              sx={{ border: "0 !important" }}
            />
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 400,
              }}
            >
              Loading...
            </Typography>
          </Box>
        )}
        <FooterCustomer />
      </BoxContainer>
    </>
  );
};

export default VoucherListPage;
