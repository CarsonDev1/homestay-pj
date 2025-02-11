import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../routes";
import "./ForgotPassword.Style.scss";
import { sendMail } from "../Auth.Api";
import secureLocalStorage from "react-secure-storage";
import ToastComponent from "../../../components/Toast/Toast.Component";

const ForgotPasswordPage = () => {
  const regexEmail =
    /^(?=.{1,64}@)[A-Za-z_-]+[.A-Za-z0-9_-]*@[A-Za-z0-9]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [disableButton, setDisableButton] = useState(false);

  const [displayEmpty, setDisplayEmpty] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);
  const [displayInvalid, setDisplayInvalid] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [displayServerError, setDisplayServerError] = useState(false);

  const handleSendMail = async () => {
    setDisableButton(true);
    if (email === "") {
      setDisplayEmpty(true);
      setDisableButton(false);
    } else {
      if (!regexEmail.test(email)) {
        setDisplayInvalid(true);
        setDisableButton(false);
      } else {
        try {
          const res = await sendMail(email);

          if (res.status === 200) {
            secureLocalStorage.setItem("email", email);
            secureLocalStorage.setItem("otp", res?.data);
            setDisplaySuccess(true);
            setDisableButton(false);
            setTimeout(() => {
              navigate(routes.auth.verifyEmail);
            }, 2000);
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
      handleSendMail();
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
    if (displayInvalid) {
      timeOut = setTimeout(() => {
        setDisplayInvalid(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayInvalid]);

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
    <div className="container_forgotpassword">
      <ToastComponent
        open={displayEmpty}
        close={() => setDisplayEmpty(false)}
        title="Error"
        message="Field email is required!"
        type="error"
      />

      <ToastComponent
        open={displayInvalid}
        close={() => setDisplayInvalid(false)}
        title="Invalid Email"
        message="Example: example@gmail.com"
        type="error"
      />

      <ToastComponent
        open={displayError}
        close={() => setDisplayError(false)}
        title="Error"
        message="Send OTP code fail!"
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
        message="The OTP code has been successfully sent to your email. Please check your email!"
        type="success"
      />

      <div className="main_container_forgotpassword">
        <h1 className="title_forgotpassword">FORGOT PASSWORD</h1>
        <p className="title_attention_forgotpassword">
          To reset your password, please enter the registered email address and
          we'll send you OTP in your email!
        </p>
        <div className="form_container_forgotpassword">
          <div className="form_forgotpassword" onKeyDown={handleKeyDown}>
            <div className="input_container_forgotpassword">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                placeholder="example@gmail.com"
                autoFocus
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              className="submit_button_forgotpassword"
              onClick={handleSendMail}
              disabled={disableButton}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
