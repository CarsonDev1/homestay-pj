import React, { useEffect, useState } from "react";
import { routes } from "../../../routes";
import { useNavigate } from "react-router-dom";
import "./Register.Style.scss";
import { registerCustomer } from "../Auth.Api";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ToastComponent from "../../../components/Toast/Toast.Component";
import secureLocalStorage from "react-secure-storage";

const RegisterPage = () => {
  const regexPhone = /^0[3|5|7|8|9]\d{8}$/;
  const regexEmail =
    /^(?=.{1,64}@)[A-Za-z_-]+[.A-Za-z0-9_-]*@[A-Za-z0-9]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;
  const regexPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,16}$/;

  const navigate = useNavigate();
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [disableButton, setDisableButton] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [displaySuccess, setDisplaySuccess] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [displayServerError, setDisplayServerError] = useState(false);
  const [displayExists, setDisplayExists] = useState(false);
  const [displayFullname, setDisplayFullname] = useState(false);
  const [displayInvalidPhone, setDisplayInvalidPhone] = useState(false);
  const [displayInvalidEmail, setDisplayInvalidEmail] = useState(false);
  const [displayInvalidPassword, setDisplayInvalidPassword] = useState(false);
  const [displayEmpty, setDisplayEmpty] = useState(false);
  const [testData, setTestData] = useState();

  console.log('testData', testData);
  

  const handleShowPassword = () => {
    setShowPassword((showPassword) => !showPassword);
  };

  const handleRegister = async () => {
    setDisableButton(true);
    if (
      fullname.trim() === "" ||
      phone.trim() === "" ||
      email.trim() === "" ||
      password.trim() === ""
    ) {
      setDisplayEmpty(true);
      setDisableButton(false);
    } else {
      if (fullname.trim().length < 1 || fullname.trim().length > 32) {
        setDisplayFullname(true);
        setDisableButton(false);
      } else if (!regexPhone.test(phone)) {
        setDisplayInvalidPhone(true);
        setDisableButton(false);
      } else if (!regexEmail.test(email)) {
        setDisplayInvalidEmail(true);
        setDisableButton(false);
      } else if (!regexPassword.test(password)) {
        setDisplayInvalidPassword(true);
        setDisableButton(false);
      } else {
        try {
          const data = {
            fullname: fullname.trim(),
            phone: phone.trim(),
            email: email.trim(),
            password: password.trim(),
          };

          const res = await registerCustomer(data);
          if (res.status === 200) {
            setDisplaySuccess(true);
            secureLocalStorage.setItem("email", res.data.data?.account?.email);
            secureLocalStorage.setItem("otp", res.data.data?.otp);
            setTestData(res.data.data?.otp);
            setDisableButton(false);
            setTimeout(() => {
              navigate(routes.auth.verifyOTP);
            }, 2000);
          } else if (res.status === 208) {
            setErrorMsg(res.data.message);
            setDisplayExists(true);
            setDisableButton(false);
          } else {
            setDisplayError(true);
            setDisableButton(false);
          }
        } catch (error) {
          setDisplayServerError(true);
          setDisableButton(false);
        }
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleRegister();
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
    if (displayServerError) {
      timeOut = setTimeout(() => {
        setDisplayServerError(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayServerError]);

  return (
    <div className="container_register">
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
        message="Registration fails!"
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
        message="Registration successfully!"
        type="success"
      />
      <div className="main_container_register">
        <h1 className="title_register">Register</h1>
        <div className="form_container_register">
          <div className="form_register" onKeyDown={handleKeyDown}>
            <div className="input_container_register">
              <label htmlFor="fullname">Fullname</label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                autoComplete="name"
                autoFocus
                placeholder="Please enter your fullname"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>
            <div className="input_container_register">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                autoComplete="tel"
                placeholder="Please enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="input_container_register">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input_container_register password">
              <label htmlFor="password">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Please enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="icon" onClick={handleShowPassword}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </div>
            </div>
            <button
              type="submit"
              className="submit_button_signup"
              onClick={handleRegister}
              disabled={disableButton}
            >
              Sign Up
            </button>
            <div className="link_container_authorlogin">
              <p>Already have an account?</p>
              <button
                type="button"
                className="link_button"
                onClick={() => navigate(routes.auth.login)}
              >
                Login here
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
