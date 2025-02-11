import React from "react";
import "./ToastModal.Style.scss";
import { Alert, AlertTitle, IconButton } from "@mui/material";
import { CheckCircleOutline, Close, Info, Warning } from "@mui/icons-material";
import { themeColors } from "../../themes/schemes/PureLightThem";
import { LoadingButton } from "@mui/lab";

const ToastModalComponent = ({
  open,
  close,
  title,
  message,
  type,
  children,
}) => {
  return (
    <Alert
      icon={
        type === "error" ? (
          <Info
            sx={{ color: themeColors.button_Secondary, width: 30, height: 30 }}
          />
        ) : type === "success" ? (
          <CheckCircleOutline sx={{ color: themeColors.status_Primary }} />
        ) : type === "warning" ? (
          <Warning sx={{ color: themeColors.status_Secondary }} />
        ) : (
          <LoadingButton
            loading
            variant="outlined"
            sx={{ border: "0 !important" }}
          />
        )
      }
      className="toast"
      variant="filled"
      severity={type}
      action={
        <IconButton onClick={close} sx={{ color: "rgba(0, 0, 0, 0.3)" }}>
          <Close />
        </IconButton>
      }
      sx={{
        display: open ? "flex" : "none",
        borderLeft:
          type === "error"
            ? `5px solid ${themeColors.button_Secondary}`
            : type === "success"
            ? `5px solid ${themeColors.status_Primary}`
            : type === "warning"
            ? `5px solid ${themeColors.status_Secondary}`
            : `5px solid ${themeColors.gray}`,
        color: "#888",
      }}
    >
      <AlertTitle sx={{ color: "#333", fontWeight: 700 }}>{title}</AlertTitle>
      {message}
      <br />
      {children?.map((item, index) => (
        <ul key={index} style={{ marginLeft: "2rem" }}>
          <li>
            <strong>{item}</strong>
          </li>
        </ul>
      ))}
    </Alert>
  );
};

export default ToastModalComponent;
