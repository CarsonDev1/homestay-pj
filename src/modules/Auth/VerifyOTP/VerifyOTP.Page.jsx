import React, { useEffect, useState } from "react";
import "./VerifyOTP.Style.scss";
import secureLocalStorage from "react-secure-storage";
import { Box, Typography } from "@mui/material";
import { themeColors } from "../../../themes/schemes/PureLightThem";
import { sendMail, verifyEmail } from "../Auth.Api";
import ToastComponent from "../../../components/Toast/Toast.Component";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../routes";

const VerifyOTPPage = () => {
  const navigate = useNavigate();

  const [otpCode, setOtpCode] = useState("");
  const [show, setShow] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const [displayEmpty, setDisplayEmpty] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);
  const [displayErrorOtp, setDisplayErrorOtp] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [displayResendSuccess, setDisplayResendSuccess] = useState(false);
  const [displayResendError, setDisplayResendError] = useState(false);

  const handleChangeOtpCode = (e) => {
    setOtpCode(e.target.value);
  };

  const handleVerify = async () => {
    if (otpCode === "") {
      setDisplayEmpty(true);
    } else {
      try {
        if (secureLocalStorage.getItem("otp").toString() === otpCode) {
          let formData = new FormData();

          formData.append("email", secureLocalStorage.getItem("email"));

          const res = await verifyEmail(formData);
          if (res.status === 200) {
            setDisplaySuccess(true);
            secureLocalStorage.removeItem("otp");
            secureLocalStorage.removeItem("email");
            if (secureLocalStorage.getItem("role") === "Partner") {
              setTimeout(() => {
                secureLocalStorage.removeItem("role");
                navigate(routes.partner.registration);
              }, 2000);
            } else {
              setTimeout(() => {
                navigate(routes.auth.login);
              }, 2000);
            }
          }
        } else {
          setDisplayErrorOtp(true);
        }
      } catch (error) {
        setDisplayError(true);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleVerify();
    }
  };

  const handleResendOTP = async () => {
    try {
      setCountdown(60);
      setShow((prev) => !prev);
      const response = await sendMail(secureLocalStorage.getItem("email"));
      if (response.status === 200) {
        secureLocalStorage.setItem("otp", response.data.toString());
        setDisplayResendSuccess(true);
      }
    } catch (error) {
      setDisplayResendError(true);
    }
  };

  useEffect(() => {
    let timer;

    if (countdown > 0 && !show) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && !show) {
      secureLocalStorage.removeItem("otp");
      setShow(true);
    }

    return () => clearTimeout(timer);
  }, [countdown, show]);

  useEffect(() => {
    let timeOut;
    if (displayEmpty) {
      timeOut = setTimeout(() => {
        setDisplayEmpty(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayEmpty]);

  useEffect(() => {
    let timeOut;
    if (displayErrorOtp) {
      timeOut = setTimeout(() => {
        setDisplayErrorOtp(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayErrorOtp]);

  useEffect(() => {
    let timeOut;
    if (displayResendError) {
      timeOut = setTimeout(() => {
        setDisplayResendError(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayResendError]);

  useEffect(() => {
    let timeOut;
    if (displayResendSuccess) {
      timeOut = setTimeout(() => {
        setDisplayResendSuccess(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayResendSuccess]);

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

  return (
    <div className="container__verify-otp">
      <ToastComponent
        open={displayEmpty}
        close={() => setDisplayEmpty(false)}
        title="Error"
        message="OTP code cannot be empty!"
        type="error"
      />

      <ToastComponent
        open={displayErrorOtp}
        close={() => setDisplayErrorOtp(false)}
        title="Error"
        message="Your OTP code is incorrect!"
        type="error"
      />

      <ToastComponent
        open={displayResendError}
        close={() => setDisplayResendError(false)}
        title="Error"
        message="Resend OTP code failure!"
        type="error"
      />

      <ToastComponent
        open={displayResendSuccess}
        close={() => setDisplayResendSuccess(false)}
        title="Success"
        message="Resend OTP successfully. Please check your email!"
        type="success"
      />

      <ToastComponent
        open={displayError}
        close={() => setDisplayError(false)}
        title="Error"
        message="Your OTP code is old. Please resend!"
        type="error"
      />

      <ToastComponent
        open={displaySuccess}
        close={() => setDisplaySuccess(false)}
        title="Success"
        message="Verify email successfully!"
        type="success"
      />

      <div className="main_container__verify-otp">
        <h1 className="title__verify-otp">VERIFY YOUR EMAIL</h1>
        <p className="title_attention__verify-otp">
          OTP Code has sent to your email. Please enter it to verify!
        </p>
        <div className="form_container__verify-otp">
          <div className="form__verify-otp" onKeyDown={handleKeyDown}>
            <div className="input_container__verify-otp">
              <label htmlFor="otp">OTP</label>
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder="000000"
                maxLength={6}
                size={6}
                autoFocus
                value={otpCode}
                onChange={handleChangeOtpCode}
              />
            </div>
            <button
              className="submit_button__verify-otp"
              onClick={handleVerify}
            >
              Verify
            </button>
          </div>
        </div>
        {!show ? (
          <Box
            sx={{
              width: "100%",
              p: "15px 5px 5px 5px",
              textAlign: "center",
            }}
          >
            If your email don't have a message, please wait for{" "}
            <Typography className="color-change-3x" sx={{ display: "inline" }}>
              {countdown}
            </Typography>{" "}
            seconds to resend OTP code.
          </Box>
        ) : (
          <Box
            sx={{
              width: "100%",
              p: "15px 5px 5px 5px",
              textAlign: "center",
            }}
          >
            <Typography
              onClick={handleResendOTP}
              sx={{
                display: "inline",
                color: themeColors.primary_600,
                "&:hover": {
                  cursor: "pointer",
                  color: themeColors.thirdary,
                },
              }}
            >
              resend OTP code
            </Typography>
          </Box>
        )}
      </div>
    </div>
  );
};

export default VerifyOTPPage;
