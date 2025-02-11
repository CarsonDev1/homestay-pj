import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../routes";
import "./ResetPassword.Style.scss";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { resetPassword } from "../Auth.Api";
import secureLocalStorage from "react-secure-storage";
import ToastComponent from "../../../components/Toast/Toast.Component";

const ResetPasswordPage = () => {
  const regexPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,16}$/;

  const navigate = useNavigate();

  const [newPass, setNewPass] = useState("");
  const [confPass, setConfPass] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);

  const [disabledButton, setDisabledButton] = useState(false);

  const [displaySuccess, setDisplaySuccess] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [displayInvalid, setDisplayInvalid] = useState(false);
  const [displayEmpty, setDisplayEmpty] = useState(false);
  const [displayEqual, setDisplayEqual] = useState(false);

  const handleShowNewPassword = () => {
    setShowNewPassword((showNewPassword) => !showNewPassword);
  };

  const handleShowConfPassword = () => {
    setShowConfPassword((showConfPassword) => !showConfPassword);
  };

  const handleResetPass = async () => {
    setDisabledButton(true);

    if (newPass === "" || confPass === "") {
      setDisplayEmpty(true);
      setDisabledButton(false);
    } else {
      if (!regexPassword.test(newPass) || !regexPassword.test(confPass)) {
        setDisplayInvalid(true);
        setDisabledButton(false);
      } else {
        if (newPass.trim() !== confPass.trim()) {
          setDisplayEqual(true);
          setDisabledButton(false);
        } else {
          try {
            let formData = new FormData();

            formData.append("email", secureLocalStorage.getItem("email"));
            formData.append("newPassword", confPass);

            const response = await resetPassword(formData);

            if (response.status === 200) {
              setDisplaySuccess(true);
              setDisabledButton(false);
              secureLocalStorage.clear();
              setTimeout(() => {
                navigate(routes.auth.login);
              }, 2000);
            }
          } catch (error) {
            setDisplayError(true);
            setDisabledButton(false);
          }
        }
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleResetPass();
    }
  };

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
    if (displayEqual) {
      timeOut = setTimeout(() => {
        setDisplayEqual(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayEqual]);

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
    if (displayEmpty) {
      timeOut = setTimeout(() => {
        setDisplayEmpty(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayEmpty]);

  return (
    <div className="container_resetpassword">
      <ToastComponent
        open={displayEmpty}
        close={() => setDisplayEmpty(false)}
        title="Error"
        message="All field are required!"
        type="error"
      />

      <ToastComponent
        open={displayInvalid}
        close={() => setDisplayInvalid(false)}
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
        open={displayEqual}
        close={() => setDisplayEqual(false)}
        title="Error"
        message="Confirm password is not equal to password!"
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

      <div className="main_container_resetpassword">
        <h1 className="title_resetpassword">RESET PASSWORD</h1>
        <p className="title_attention_resetpassword">
          Please enter your new password below.
        </p>
        <div className="form_container_resetpassword">
          <div className="form_resetpassword" onKeyDown={handleKeyDown}>
            <div className="input_container_resetpassword password">
              <label htmlFor="new-password">Enter New Password</label>
              <input
                type={showNewPassword ? "text" : "password"}
                id="new-password"
                name="new-password"
                placeholder="Please enter new password"
                autoFocus
                onChange={(e) => setNewPass(e.target.value)}
              />
              <div className="icon" onClick={handleShowNewPassword}>
                {showNewPassword ? <VisibilityOff /> : <Visibility />}
              </div>
            </div>
            <div className="input_container_resetpassword password">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type={showConfPassword ? "text" : "password"}
                id="confirm-password"
                name="confirm-password"
                placeholder="Please enter new password again"
                onChange={(e) => setConfPass(e.target.value)}
              />
              <div className="icon" onClick={handleShowConfPassword}>
                {showConfPassword ? <VisibilityOff /> : <Visibility />}
              </div>
            </div>
            <button
              type="button"
              className="confirm_button_resetpassword"
              disabled={disabledButton}
              onClick={handleResetPass}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
