/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./PartnerProfile.Style.scss";
import HeaderPartner from "../../../layouts/Header/Partner/HeaderPartner";
import BoxContainer from "../../../components/Box/Box.Container";
import FooterPartner from "../../../layouts/Footer/Partner/FooterPartner";
import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import { EditOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { themeColors } from "../../../themes/schemes/PureLightThem";
import { formatDate, formatPhoneNumber } from "../../../utils/helper";
import UpdateProfileModal from "./Modal/UpdateProfile.Modal";
import { URL_IMAGE } from "../../../services/ApiUrl";
import { changePassword, getProfile } from "../../Auth/Auth.Api";
import secureLocalStorage from "react-secure-storage";
import ToastComponent from "../../../components/Toast/Toast.Component";
import { AssetImages } from "../../../utils/images";
import { useDispatch } from "react-redux";
import UpdatePhoneModal from "../../Home/isLogged/MyAccount/Profile/Modal/UpdatePhone/UpdatePhone.Modal";
import UpdateEmailModal from "../../Home/isLogged/MyAccount/Profile/Modal/UpdateEmail/UpdateEmail.Modal";

const PartnerProfilePage = () => {
  const regexPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,16}$/;

  const dispatch = useDispatch();

  const [data, setData] = useState(null);

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [cofPass, setCofPass] = useState("");

  const [isClicked, setIsClicked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);

  const [disabledButton, setDisabledButton] = useState(false);

  const [displaySuccess, setDisplaySuccess] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [displayErrorOldPass, setDisplayErrorOldPass] = useState(false);
  const [displayEmpty, setDisplayEmpty] = useState(false);
  const [displayInvalidFormat, setDisplayInvalidFormat] = useState(false);
  const [displayErrorPassword, setDisplayErrorPassword] = useState(false);

  const handleClicked = () => {
    setIsClicked((prev) => !prev);
    setIsDisabled((prev) => !prev);
  };

  const handleShowOldPassword = () => {
    setShowOldPassword((showOldPassword) => !showOldPassword);
  };

  const handleShowNewPassword = () => {
    setShowNewPassword((showNewPassword) => !showNewPassword);
  };

  const handleShowConfPassword = () => {
    setShowConfPassword((showConfPassword) => !showConfPassword);
  };

  const init = async () => {
    const res = await getProfile(
      secureLocalStorage.getItem("accountId"),
      dispatch
    );
    if (res) {
      setData(res);
    }
  };

  const handleChangePassword = async () => {
    setDisabledButton(true);

    if (oldPass === "" || newPass === "" || cofPass === "") {
      setDisplayEmpty(true);
      setDisabledButton(false);
    } else {
      if (
        !regexPassword.test(oldPass) ||
        !regexPassword.test(newPass) ||
        !regexPassword.test(cofPass)
      ) {
        setDisplayInvalidFormat(true);
        setDisabledButton(false);
      } else {
        if (newPass.trim() !== cofPass.trim()) {
          setDisplayErrorPassword(true);
          setDisabledButton(false);
        } else {
          const dataChangePass = {
            accountId: secureLocalStorage.getItem("accountId"),
            oldPassword: oldPass,
            newPassword: cofPass,
          };

          try {
            const response = await changePassword(dataChangePass);

            if (response.status === 200) {
              setDisplaySuccess(true);
              setDisabledButton(false);
              handleClicked();
              setOldPass("");
              setNewPass("");
              setCofPass("");
            } else {
              setDisplayErrorOldPass(true);
              setDisabledButton(false);
            }
          } catch (error) {
            setDisplayError(true);
            setDisabledButton(false);
          }
        }
      }
    }
  };

  useEffect(() => {
    init();
  }, [data]);

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
    if (displayErrorPassword) {
      timeOut = setTimeout(() => {
        setDisplayErrorPassword(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayErrorPassword]);

  useEffect(() => {
    let timeOut;
    if (displayErrorOldPass) {
      timeOut = setTimeout(() => {
        setDisplayErrorOldPass(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayErrorOldPass]);

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
    <>
      <HeaderPartner />

      <ToastComponent
        open={displayEmpty}
        close={() => setDisplayEmpty(false)}
        title="Error"
        message="All field are required!"
        type="error"
      />

      <ToastComponent
        open={displayInvalidFormat}
        close={() => setDisplayInvalidFormat(false)}
        title="Invalid Password"
        message="Password must have at least:"
        type="error"
        children={[
          "One lowercase letter",
          "One uppercase letter",
          "One digit",
          "One special letter",
          "From 8 to 16 characters",
        ]}
      />

      <ToastComponent
        open={displayErrorPassword}
        close={() => setDisplayErrorPassword(false)}
        title="Error"
        message="Confirm password is not equal to password!"
        type="error"
      />

      <ToastComponent
        open={displayErrorOldPass}
        close={() => setDisplayErrorOldPass(false)}
        title="Error"
        message="Old password is incorrect to change!"
        type="error"
      />

      <ToastComponent
        open={displayError}
        close={() => setDisplayError(false)}
        title="Error"
        message="Server maintenance is underway. Please try again later!"
        type="error"
      />

      <ToastComponent
        open={displaySuccess}
        close={() => setDisplaySuccess(false)}
        title="Success"
        message="Change password successfully!"
        type="success"
      />

      <BoxContainer property="partner-profile__container">
        <Box className="partner-profile__information">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography className="partner-profile__title">
              Basic Information
            </Typography>
            <UpdateProfileModal
              data={{
                id: data?.accountID,
                name: data?.profile?.fullName,
                email: data?.email,
                phone: data?.phone,
                avt: data?.profile?.avatar,
                birthday: data?.profile?.birthDay,
                gender: data?.profile?.gender,
                address: data?.profile?.address,
              }}
            >
              <Typography className="partner-profile__btn--edit">
                Edit
              </Typography>
            </UpdateProfileModal>
          </Box>

          <Box display="flex" alignItems="flex-start">
            <Box flex={0.6}>
              {data?.profile?.avatar ? (
                data?.profile?.avatar?.startsWith("/", 0) ? (
                  <Avatar
                    src={`${URL_IMAGE}${data?.profile?.avatar}`}
                    sx={{
                      width: "240px",
                      height: "240px",
                    }}
                  />
                ) : (
                  <Avatar
                    src={`${data?.profile?.avatar}`}
                    sx={{
                      width: "240px",
                      height: "240px",
                    }}
                  />
                )
              ) : (
                <Avatar
                  src={`${AssetImages.LOGO}`}
                  sx={{
                    width: "240px",
                    height: "240px",
                  }}
                />
              )}
            </Box>
            <Box flex={2}>
              <Box display="flex" alignItems="center" gap="2rem">
                <Box
                  flex={0.6}
                  display="flex"
                  flexDirection="column"
                  gap="2rem"
                >
                  <Box
                    width="100%"
                    display="flex"
                    flexDirection="column"
                    gap="1rem"
                  >
                    <Typography className="information__label">
                      Fullname
                    </Typography>
                    <Box
                      sx={{
                        width: "100%",
                        p: "8px 14px",
                        bgcolor: themeColors.bg_Disabled,
                        color: themeColors.text_Link,
                        fontSize: 16,
                        borderRadius: "6px",
                      }}
                    >
                      {data?.profile?.fullName ? data?.profile?.fullName : "-"}
                    </Box>
                  </Box>

                  <Box
                    width="100%"
                    display="flex"
                    flexDirection="column"
                    gap="1rem"
                  >
                    <Typography className="information__label">
                      Gender
                    </Typography>
                    <Box
                      sx={{
                        width: "100%",
                        p: "8px 14px",
                        bgcolor: themeColors.bg_Disabled,
                        color: themeColors.text_Link,
                        fontSize: 16,
                        borderRadius: "6px",
                      }}
                    >
                      {data?.profile?.gender ? data?.profile?.gender : "-"}
                    </Box>
                  </Box>

                  <Box
                    width="100%"
                    display="flex"
                    flexDirection="column"
                    gap="1rem"
                  >
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography className="information__label">
                        Phone
                      </Typography>
                      <UpdatePhoneModal
                        data={{ email: data?.email, phone: data?.phone }}
                      >
                        <IconButton
                          sx={{
                            color: themeColors.primary_Default,
                            transition: "all .3s linear",
                            "&:hover": {
                              color: themeColors.text_Link,
                            },
                          }}
                        >
                          <EditOutlined />
                        </IconButton>
                      </UpdatePhoneModal>
                    </Box>

                    <Box
                      sx={{
                        width: "100%",
                        p: "8px 14px",
                        bgcolor: themeColors.bg_Disabled,
                        color: themeColors.text_Link,
                        fontSize: 16,
                        borderRadius: "6px",
                      }}
                    >
                      {data?.phone ? formatPhoneNumber(data?.phone) : "-"}
                    </Box>
                  </Box>
                </Box>

                <Box flex={1} display="flex" flexDirection="column" gap="2rem">
                  <Box
                    width="100%"
                    display="flex"
                    flexDirection="column"
                    gap="1rem"
                  >
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography className="information__label">
                        Email
                      </Typography>
                      <UpdateEmailModal data={{ email: data?.email }}>
                        <IconButton
                          sx={{
                            color: themeColors.primary_Default,
                            transition: "all .3s linear",
                            "&:hover": {
                              color: themeColors.text_Link,
                            },
                          }}
                        >
                          <EditOutlined />
                        </IconButton>
                      </UpdateEmailModal>
                    </Box>
                    <Box
                      sx={{
                        width: "100%",
                        p: "8px 14px",
                        bgcolor: themeColors.bg_Disabled,
                        color: themeColors.text_Link,
                        fontSize: 16,
                        borderRadius: "6px",
                      }}
                    >
                      {data?.email ? data?.email : "-"}
                    </Box>
                  </Box>

                  <Box
                    width="100%"
                    display="flex"
                    flexDirection="column"
                    gap="1rem"
                  >
                    <Typography className="information__label">
                      Birthday
                    </Typography>
                    <Box
                      sx={{
                        width: "100%",
                        p: "8px 14px",
                        bgcolor: themeColors.bg_Disabled,
                        color: themeColors.text_Link,
                        fontSize: 16,
                        borderRadius: "6px",
                      }}
                    >
                      {data?.profile?.birthDay
                        ? formatDate(data?.profile?.birthDay)
                        : "-"}
                    </Box>
                  </Box>

                  <Box
                    width="100%"
                    display="flex"
                    flexDirection="column"
                    gap="1rem"
                  >
                    <Typography className="information__label">
                      Address
                    </Typography>
                    <Box
                      sx={{
                        width: "100%",
                        p: "8px 14px",
                        bgcolor: themeColors.bg_Disabled,
                        color: themeColors.text_Link,
                        fontSize: 16,
                        borderRadius: "6px",
                      }}
                    >
                      {data?.profile?.address ? data?.profile?.address : "-"}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className="partner-profile__change-password">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography className="partner-profile__title">
              Change Password
            </Typography>
            <Typography
              className="partner-profile__btn--edit"
              onClick={handleClicked}
            >
              Edit
            </Typography>
          </Box>

          <Box className="change-password__form">
            <Typography className="change-password__form--label">
              Old Password
            </Typography>
            <input
              type={showOldPassword ? "text" : "password"}
              disabled={!isClicked}
              className={
                !isClicked
                  ? "change-password__form--input input--disabled"
                  : "change-password__form--input form__input"
              }
              value={!isDisabled ? oldPass : ""}
              placeholder={isClicked ? "Please enter your old password" : "-"}
              onChange={(e) => setOldPass(e.target.value)}
            />
            {isClicked && (
              <div className="icon" onClick={handleShowOldPassword}>
                {showOldPassword ? <VisibilityOff /> : <Visibility />}
              </div>
            )}
          </Box>

          <Box className="change-password__form">
            <Typography className="change-password__form--label">
              New Password
            </Typography>
            <input
              type={showNewPassword ? "text" : "password"}
              disabled={!isClicked}
              className={
                !isClicked
                  ? "change-password__form--input input--disabled"
                  : "change-password__form--input form__input"
              }
              value={!isDisabled ? newPass : ""}
              placeholder={isClicked ? "Please enter your new password" : "-"}
              onChange={(e) => setNewPass(e.target.value)}
            />
            {isClicked && (
              <div className="icon" onClick={handleShowNewPassword}>
                {showNewPassword ? <VisibilityOff /> : <Visibility />}
              </div>
            )}
          </Box>

          <Box className="change-password__form">
            <Typography className="change-password__form--label">
              Confirm Password
            </Typography>
            <input
              type={showConfPassword ? "text" : "password"}
              disabled={!isClicked}
              className={
                !isClicked
                  ? "change-password__form--input input--disabled"
                  : "change-password__form--input form__input"
              }
              value={!isDisabled ? cofPass : ""}
              placeholder={isClicked ? "Please enter again password" : "-"}
              onChange={(e) => setCofPass(e.target.value)}
            />
            {isClicked && (
              <div className="icon" onClick={handleShowConfPassword}>
                {showConfPassword ? <VisibilityOff /> : <Visibility />}
              </div>
            )}
          </Box>

          {isClicked && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              gap="2rem"
            >
              <Button
                onClick={handleClicked}
                sx={{
                  border: `1px solid ${themeColors.primary_600}`,
                  borderRadius: "10px",
                  textTransform: "none",
                  p: "8px 30px",
                  bgcolor: "transparent",
                  color: themeColors.primary_600,
                  "&:hover": {
                    bgcolor: themeColors.bgTitle,
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleChangePassword}
                sx={{
                  borderRadius: "10px",
                  textTransform: "none",
                  p: "8px 30px",
                  bgcolor: themeColors.primary_Default,
                  color: themeColors.white,
                  "&:hover": {
                    bgcolor: themeColors.primary_600,
                  },
                  "&:disabled": {
                    bgcolor: themeColors.bg_Disabled,
                    color: themeColors.text_Link,
                  },
                }}
                disabled={disabledButton}
              >
                Save
              </Button>
            </Box>
          )}
        </Box>
      </BoxContainer>

      <FooterPartner />
    </>
  );
};

export default PartnerProfilePage;
