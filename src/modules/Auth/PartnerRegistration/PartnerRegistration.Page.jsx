import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../routes";
import "./PartnerRegistration.Style.scss";
import { registerPartner } from "../Auth.Api";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ToastComponent from "../../../components/Toast/Toast.Component";
import secureLocalStorage from "react-secure-storage";

const PartnerRegistration = () => {
  const regexPhone = /^0[3|5|7|8|9]\d{8}$/;
  const regexEmail =
    /^(?=.{1,64}@)[A-Za-z_-]+[.A-Za-z0-9_-]*@[A-Za-z0-9]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;
  const regexPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,16}$/;

  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  const [displaySuccess, setDisplaySuccess] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [displayExists, setDisplayExists] = useState(false);
  const [displayFullname, setDisplayFullname] = useState(false);
  const [displayInvalidPhone, setDisplayInvalidPhone] = useState(false);
  const [displayInvalidEmail, setDisplayInvalidEmail] = useState(false);
  const [displayInvalidPassword, setDisplayInvalidPassword] = useState(false);
  const [displayErrorPassword, setDisplayErrorPassword] = useState(false);
  const [displayEmpty, setDisplayEmpty] = useState(false);

  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleAgreeChange = () => {
    setAgree(!agree);
  };

  const handleShowPassword = () => {
    setShowPassword((showPassword) => !showPassword);
  };

  const handleShowConfPassword = () => {
    setShowConfPassword((showConfPassword) => !showConfPassword);
  };

  const handleSubmit = async () => {
    setAgree(!agree);
    if (
      fullName.trim() === "" ||
      phoneNumber.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      setDisplayEmpty(true);
    } else {
      if (fullName.trim().length < 1 || fullName.trim().length > 32) {
        setDisplayFullname(true);
      } else if (!regexPhone.test(phoneNumber)) {
        setDisplayInvalidPhone(true);
      } else if (!regexEmail.test(email)) {
        setDisplayInvalidEmail(true);
      } else if (
        !regexPassword.test(password) ||
        !regexPassword.test(confirmPassword)
      ) {
        setDisplayInvalidPassword(true);
      } else {
        if (password.trim() !== confirmPassword.trim()) {
          setDisplayErrorPassword(true);
        } else {
          let formData = new FormData();

          formData.append("email", email.trim());
          formData.append("password", confirmPassword);
          formData.append("phone", phoneNumber.trim());
          formData.append("fullName", fullName.trim());

          const res = await registerPartner(formData);

          if (res.status === 208) {
            setErrorMsg(res.data.message);
            setDisplayExists(true);
          } else if (res.status === 200) {
            setDisplaySuccess(true);
            secureLocalStorage.setItem(
              "email",
              res.data.data?.addAccount?.email
            );
            secureLocalStorage.setItem("otp", res.data.data?.otp);
            secureLocalStorage.setItem(
              "role",
              res.data.data?.addAccount?.role?.name
            );
            secureLocalStorage.setItem(
              "accountId",
              res.data.data?.addAccount?.accountID
            );
            setTimeout(() => {
              navigate(routes.auth.verifyOTP);
            }, 2000);
          } else {
            setDisplayError(true);
          }
        }
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

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
    if (displayFullname) {
      timeOut = setTimeout(() => {
        setDisplayFullname(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayFullname]);

  useEffect(() => {
    let timeOut;
    if (displayInvalidPhone) {
      timeOut = setTimeout(() => {
        setDisplayInvalidPhone(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayInvalidPhone]);

  useEffect(() => {
    let timeOut;
    if (displayInvalidEmail) {
      timeOut = setTimeout(() => {
        setDisplayInvalidEmail(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayInvalidEmail]);

  useEffect(() => {
    let timeOut;
    if (displayInvalidPassword) {
      timeOut = setTimeout(() => {
        setDisplayInvalidPassword(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayInvalidPassword]);

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
    if (displayExists) {
      timeOut = setTimeout(() => {
        setDisplayExists(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayExists]);

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
    if (displayErrorPassword) {
      timeOut = setTimeout(() => {
        setDisplayErrorPassword(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayErrorPassword]);

  return (
    <div className="container_partner_registration">
      <ToastComponent
        open={displayEmpty}
        close={() => setDisplayEmpty(false)}
        title="Error"
        message="All field are required!"
        type="error"
      />

      <ToastComponent
        open={displayFullname}
        close={() => setDisplayFullname(false)}
        title="Error"
        message="Fullname must be between 1 and 32 characters!"
        type="error"
      />

      <ToastComponent
        open={displayInvalidPhone}
        close={() => setDisplayInvalidPhone(false)}
        title="Invalid Phone"
        message="Example: 03 | 05 | 07 | 08 | 09xx xxx xxx"
        type="error"
      />

      <ToastComponent
        open={displayInvalidEmail}
        close={() => setDisplayInvalidEmail(false)}
        title="Invalid Email"
        message="Example: example@gmail.com"
        type="error"
      />

      <ToastComponent
        open={displayInvalidPassword}
        close={() => setDisplayInvalidPassword(false)}
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
        open={displayExists}
        close={() => setDisplayExists(false)}
        title="Error"
        message={errorMsg}
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
        open={displayErrorPassword}
        close={() => setDisplayErrorPassword(false)}
        title="Error"
        message="Confirm password is not equal to password!"
        type="error"
      />

      <ToastComponent
        open={displaySuccess}
        close={() => setDisplaySuccess(false)}
        title="Success"
        message="Registration successfully!"
        type="success"
      />

      <div className="main_container_partner_registration">
        <h1 className="title_partner_registration">Partner Registration</h1>
        <div className="form_container_partner_registration">
          <div className="form_partner_registration" onKeyDown={handleKeyDown}>
            <div className="input_container_partner_registration">
              <label htmlFor="full-name">Fullname</label>
              <input
                type="text"
                id="full-name"
                name="full-name"
                value={fullName}
                onChange={handleFullNameChange}
                placeholder="Please enter your fullname"
                autoFocus
              />
            </div>
            <div className="input_container_partner_registration">
              <label htmlFor="phone-number">Phone Number</label>
              <input
                type="text"
                id="phone-number"
                name="phone-number"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                placeholder="Please enter your phone number"
              />
            </div>
            <div className="input_container_partner_registration">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="example@gmail.com"
              />
            </div>
            <div className="input_container_partner_registration password">
              <label htmlFor="password">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Please enter your password"
              />
              <div className="icon" onClick={handleShowPassword}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </div>
            </div>
            <div className="input_container_partner_registration password">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type={showConfPassword ? "text" : "password"}
                id="confirm-password"
                name="confirm-password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Please enter again your password"
              />
              <div className="icon" onClick={handleShowConfPassword}>
                {showConfPassword ? <VisibilityOff /> : <Visibility />}
              </div>
            </div>
            <div className="click_checkbox_container_partner_registration">
              <input
                type="checkbox"
                id="agree"
                name="agree"
                checked={agree}
                onChange={handleAgreeChange}
                className="checkbox_button_container_partner_registration"
              />
              <div className="link_container__partner_registration">
                <label
                  htmlFor="agree"
                  className="container_title_partner_registration"
                >
                  I agree to the
                </label>
                <p className="checkbox_container_title_partner_registration">
                  {" "}
                  Terms of Service
                </p>
                <label
                  htmlFor="agree"
                  className="container_title_partner_registration"
                >
                  and
                </label>
                <p className="checkbox_container_title_partner_registration">
                  {" "}
                  Privacy Policy
                </p>
              </div>
            </div>
            <button
              type="button"
              className={`submit_button ${!agree && `disable`}`}
              onClick={handleSubmit}
              disabled={!agree}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerRegistration;
