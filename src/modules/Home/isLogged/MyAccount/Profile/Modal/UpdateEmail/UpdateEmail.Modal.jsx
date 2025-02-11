import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { themeColors } from "../../../../../../../themes/schemes/PureLightThem";
import { Close } from "@mui/icons-material";
import { sendMail } from "../../../../../../Auth/Auth.Api";
import ToastComponent from "../../../../../../../components/Toast/Toast.Component";
import OTPInput from "otp-input-react";
import secureLocalStorage from "react-secure-storage";
import { updateMail } from "../../../../../Home.Api";

const UpdateEmailModal = ({ children, data }) => {
  const regexEmail =
    /^(?=.{1,64}@)[A-Za-z_-]+[.A-Za-z0-9_-]*@[A-Za-z0-9]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState("");
  const [show, setShow] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const [isVerify, setIsVerify] = useState(false);

  const [displayEmpty, setDisplayEmpty] = useState(false);
  const [displayDuplicateEmail, setDisplayDuplicateEmail] = useState(false);
  const [displayInvalidFormat, setDisplayInvalidFormat] = useState(false);
  const [displayError, setDisplayError] = useState(false);

  const [displayOtpError, setDisplayOtpError] = useState(false);
  const [displayOtpIsOld, setDisplayOtpIsOld] = useState(false);

  const [displaySuccess, setDisplaySuccess] = useState(false);
  const [displayServerError, setDisplayServerError] = useState(false);

  const [displayResendSuccess, setDisplayResendSuccess] = useState(false);
  const [displayResendError, setDisplayResendError] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    setIsVerify(false);
    setEmail("");
    setOtp("");
    setCountdown(60);
  };

  const handleClose = () => {
    setOpen(false);
    setIsVerify(false);
  };

  const handleBack = () => {
    setIsVerify(false);
    setEmail("");
    setOtp("");
    setCountdown(60);
  };

  const checkEmailValid = () => {
    setDisplayEmpty(false);
    setDisplayInvalidFormat(false);
    setDisplayDuplicateEmail(false);

    if (email.trim() === "") {
      setDisplayEmpty(true);
      return false;
    } else if (!regexEmail.test(email.trim())) {
      setDisplayInvalidFormat(true);
      return false;
    } else if (data?.email) {
      if (data?.email === email.trim()) {
        setDisplayDuplicateEmail(true);
        return false;
      }
    }
    return true;
  };

  const sendEmail = async () => {
    if (!checkEmailValid()) {
      return;
    }

    try {
      const response = await sendMail(email);
      if (response.status === 200) {
        setDisplaySuccess(true);
        setTimeout(() => {
          setIsVerify(true);
          secureLocalStorage.setItem("otp", response.data.toString());
        }, 3000);
      } else {
        setDisplayError(true);
      }
    } catch (error) {
      setDisplayServerError(true);
    }
  };

  const updateEmail = async () => {
    if (otp.trim() === "") {
      setDisplayEmpty(true);
    } else {
      try {
        if (secureLocalStorage.getItem("otp")) {
          if (secureLocalStorage.getItem("otp") === otp) {
            let formData = new FormData();

            formData.append(
              "accountID",
              secureLocalStorage.getItem("accountId")
            );
            formData.append("email", email);

            const response = await updateMail(formData);

            if (response.status === 200) {
              setDisplaySuccess(true);
              setTimeout(() => {
                secureLocalStorage.removeItem("otp");
                handleClose();
              }, 3000);
            } else if (response.status === 208) {
              setDisplayDuplicateEmail(true);
            } else {
              setDisplayError(true);
            }
          } else {
            setDisplayOtpError(true);
          }
        } else {
          setDisplayOtpIsOld(true);
        }
      } catch (error) {
        setDisplayServerError(true);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (isVerify) {
        updateEmail();
      } else {
        sendEmail();
      }
    }
  };

  const handleResendOTP = async () => {
    try {
      setCountdown(60);
      setShow((prev) => !prev);
      const response = await sendMail(data?.email);
      if (response.status === 200) {
        secureLocalStorage.setItem("otp", response.data.toString());
        setDisplayResendSuccess(true);
        setOtp("");
      }
    } catch (error) {
      setDisplayResendError(true);
    }
  };

  useEffect(() => {
    let timer;

    if (isVerify) {
      if (countdown > 0 && !show) {
        timer = setTimeout(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);
      } else if (countdown === 0 && !show) {
        secureLocalStorage.removeItem("otp");
        setShow(true);
      }
    }

    return () => clearTimeout(timer);
  }, [countdown, show, isVerify]);

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
    if (displayInvalidFormat) {
      timeOut = setTimeout(() => {
        setDisplayInvalidFormat(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayInvalidFormat]);

  useEffect(() => {
    let timeOut;
    if (displayDuplicateEmail) {
      timeOut = setTimeout(() => {
        setDisplayDuplicateEmail(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayDuplicateEmail]);

  useEffect(() => {
    let timeOut;
    if (displayOtpError) {
      timeOut = setTimeout(() => {
        setDisplayOtpError(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayOtpError]);

  useEffect(() => {
    let timeOut;
    if (displayOtpIsOld) {
      timeOut = setTimeout(() => {
        setDisplayOtpIsOld(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayOtpIsOld]);

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
    if (displaySuccess) {
      timeOut = setTimeout(() => {
        setDisplaySuccess(false);
      }, 3000);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displaySuccess]);

  return (
    <>
      {React.cloneElement(children, {
        onClick: handleOpen,
      })}
      <ToastComponent
        open={displayEmpty}
        close={() => setDisplayEmpty(false)}
        title="Error"
        message={
          !isVerify ? "Field email is required!" : "OTP code cannot be empty!"
        }
        type="error"
      />

      <ToastComponent
        open={displayInvalidFormat}
        close={() => setDisplayInvalidFormat(false)}
        title="Invalid Email"
        message="Example: example@gmail.com"
        type="error"
      />

      <ToastComponent
        open={displayDuplicateEmail}
        close={() => setDisplayDuplicateEmail(false)}
        title="Error"
        message={
          !isVerify
            ? "New email cannot equal to old email!"
            : "Email already exists!"
        }
        type="error"
      />

      <ToastComponent
        open={displayOtpError}
        close={() => setDisplayOtpError(false)}
        title="Error"
        message="Your OTP code is incorrect!"
        type="error"
      />

      <ToastComponent
        open={displayOtpIsOld}
        close={() => setDisplayOtpIsOld(false)}
        title="Error"
        message="Your OTP code is old. Please resend!"
        type="error"
      />

      <ToastComponent
        open={displayError}
        close={() => setDisplayError(false)}
        title="Error"
        message={!isVerify ? "Send OTP code fail!" : "Update new email fail!"}
        type="error"
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
        message={
          !isVerify
            ? "The OTP code has been successfully sent to your email. Please check your email!"
            : "Update new email successfully!"
        }
        type="success"
      />

      <ToastComponent
        open={displayResendError}
        close={() => setDisplayResendError(false)}
        title="Error"
        message="Resend OTP code fail!"
        type="error"
      />

      <ToastComponent
        open={displayResendSuccess}
        close={() => setDisplayResendSuccess(false)}
        title="Success"
        message="Resend OTP successfully. Please check your email!"
        type="success"
      />

      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{ fontSize: 24, fontWeight: 700, color: themeColors.title }}
          >
            {!isVerify ? `Update Email` : `Verify Email`}
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box
            display="flex"
            flexDirection="column"
            gap="2rem"
            p="2rem 0"
            onKeyDown={handleKeyDown}
          >
            <Typography sx={{ textAlign: "center", fontSize: 18 }}>
              {!isVerify
                ? `Please enter new email on input below!`
                : `Please verify your email on input below!`}
            </Typography>
            {!isVerify ? (
              <TextField
                size="small"
                placeholder="example@gmail.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            ) : (
              <Box sx={{ display: "grid", placeItems: "center" }}>
                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  OTPLength={6}
                  otpType="number"
                  placeholder={[0, 0, 0, 0, 0, 0]}
                  autoFocus
                />
              </Box>
            )}
            {isVerify &&
              (!show ? (
                <Box
                  sx={{
                    width: "100%",
                    p: "15px 5px 5px 5px",
                    textAlign: "center",
                  }}
                >
                  If your email don't have a message, please wait for{" "}
                  <Typography
                    className="color-change-3x"
                    sx={{ display: "inline" }}
                  >
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
              ))}
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button
            onClick={isVerify ? handleBack : handleClose}
            sx={{
              bgcolor: "transparent",
              color: themeColors.primary_600,
              p: "5px 40px",
              border: `1px solid ${themeColors.primary_600}`,
              borderRadius: "8px",
              textTransform: "none",
              fontSize: 16,
              "&:hover": {
                bgcolor: themeColors.bgTitle,
              },
            }}
          >
            {isVerify ? `Back` : `Cancel`}
          </Button>

          {isVerify ? (
            <Button
              onClick={updateEmail}
              sx={{
                bgcolor: themeColors.primary_Default,
                color: themeColors.white,
                p: "5px 40px",
                borderRadius: "8px",
                textTransform: "none",
                fontSize: 16,
                "&:hover": {
                  bgcolor: themeColors.primary_600,
                },
                "&:disabled": {
                  bgcolor: themeColors.bg_Disabled,
                  color: themeColors.text_Link,
                },
              }}
            >
              Verify
            </Button>
          ) : (
            <Button
              onClick={sendEmail}
              sx={{
                bgcolor: themeColors.primary_Default,
                color: themeColors.white,
                p: "5px 40px",
                borderRadius: "8px",
                textTransform: "none",
                fontSize: 16,
                "&:hover": {
                  bgcolor: themeColors.primary_600,
                },
                "&:disabled": {
                  bgcolor: themeColors.bg_Disabled,
                  color: themeColors.text_Link,
                },
              }}
            >
              Send code
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateEmailModal;
