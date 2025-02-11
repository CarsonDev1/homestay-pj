/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./Profile.Style.scss";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { EditOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import UpdateProfileModal from "../../Modal/UpdateProfile/UpdateProfile.Modal";
import secureLocalStorage from "react-secure-storage";
import { useDispatch } from "react-redux";
import {
  changePassword,
  getProfile,
  resetPassword,
} from "../../../../Auth/Auth.Api";
import ToastComponent from "../../../../../components/Toast/Toast.Component";
import BoxContainer from "../../../../../components/Box/Box.Container";
import { formatDate, formatPhoneNumber } from "../../../../../utils/helper";
import { themeColors } from "../../../../../themes/schemes/PureLightThem";
import UpdateEmailModal from "./Modal/UpdateEmail/UpdateEmail.Modal";
import UpdatePhoneModal from "./Modal/UpdatePhone/UpdatePhone.Modal";

const ProfilePage = () => {
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

  const handleUpdatePassword = async () => {
    setDisabledButton(true);

    if (newPass === "" || cofPass === "") {
      setDisplayEmpty(true);
      setDisabledButton(false);
    } else {
      if (!regexPassword.test(newPass) || !regexPassword.test(cofPass)) {
        setDisplayInvalidFormat(true);
        setDisabledButton(false);
      } else {
        if (newPass.trim() !== cofPass.trim()) {
          setDisplayErrorPassword(true);
          setDisabledButton(false);
        } else {
          try {
            let formData = new FormData();

            formData.append("email", data?.email);
            formData.append("newPassword", cofPass);

            const response = await resetPassword(formData);

            if (response.status === 200) {
              setDisplaySuccess(true);
              setDisabledButton(false);
              handleClicked();
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
        message={
          data?.password
            ? "Old password is incorrect to change!"
            : `Update new password fail!`
        }
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
        message={
          data?.password
            ? `Change password successfully!`
            : `Update new password successfully!`
        }
        type="success"
      />

      <BoxContainer property="profile__container">
        <Box className="profile__content">
          <Box className="profile__basic-infor">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography className="basic-infor__title">
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
                <button className="btn--edit">Edit</button>
              </UpdateProfileModal>
            </Box>
            <Box display="flex" alignItems="center" mt="20px" gap="4rem">
              <Box flex={1.5}>
                <Box className="form__basic-infor">
                  <Typography className="form__label">Fullname</Typography>
                  <div className="form__input--disabled">
                    {data?.profile?.fullName ? data?.profile?.fullName : "-"}
                  </div>
                </Box>

                <Box className="form__basic-infor">
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography className="form__label">Phone</Typography>
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
                  <div className="form__input--disabled">
                    {data?.phone ? formatPhoneNumber(data?.phone) : "-"}
                  </div>
                </Box>

                <Box className="form__basic-infor">
                  <Typography className="form__label">Gender</Typography>
                  <div className="form__input--disabled">
                    {data?.profile?.gender ? data?.profile?.gender : "-"}
                  </div>
                </Box>
              </Box>

              <Box flex={2}>
                <Box className="form__basic-infor">
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography className="form__label">Email</Typography>
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
                  <div className="form__input--disabled">
                    {data?.email ? data?.email : "-"}
                  </div>
                </Box>

                <Box className="form__basic-infor">
                  <Typography className="form__label">Birthday</Typography>
                  <div className="form__input--disabled">
                    {data?.profile?.birthDay
                      ? formatDate(data?.profile?.birthDay)
                      : "-"}
                  </div>
                </Box>

                <Box className="form__basic-infor">
                  <Typography className="form__label">Address</Typography>
                  <div className="form__input--disabled">
                    {data?.profile?.address ? data?.profile?.address : "-"}
                  </div>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box className="profile__change-pass">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography className="change-pass__title">
                {data?.password ? `Change` : `Update`} Password
              </Typography>
              <button className="btn--edit" onClick={handleClicked}>
                Edit
              </button>
            </Box>
            {data?.password ? (
              <Box className="form__change-pass">
                <Typography className="form__label">Old Password</Typography>
                <input
                  type={showOldPassword ? "text" : "password"}
                  disabled={!isClicked}
                  className={
                    !isClicked ? "input--disabled input" : "form__input input"
                  }
                  value={!isDisabled ? oldPass : ""}
                  placeholder={
                    isClicked ? "Please enter your old password" : "-"
                  }
                  onChange={(e) => setOldPass(e.target.value)}
                />
                {isClicked && (
                  <div className="icon" onClick={handleShowOldPassword}>
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </div>
                )}
              </Box>
            ) : null}

            <Box className="form__change-pass">
              <Typography className="form__label">New Password</Typography>
              <input
                type={showNewPassword ? "text" : "password"}
                disabled={!isClicked}
                className={
                  !isClicked ? "input--disabled input" : "form__input input"
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

            <Box className="form__change-pass">
              <Typography className="form__label">Confirm Password</Typography>
              <input
                type={showConfPassword ? "text" : "password"}
                disabled={!isClicked}
                className={
                  !isClicked ? "input--disabled input" : "form__input input"
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
                mt="20px"
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
                  onClick={
                    data?.password ? handleChangePassword : handleUpdatePassword
                  }
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
        </Box>
      </BoxContainer>
    </>
  );
};

export default ProfilePage;
