import {
  CheckCircleOutline,
  Close,
  Error,
  Info,
  Warning,
} from "@mui/icons-material";
import { Alert, AlertTitle, IconButton } from "@mui/material";
import React from "react";
import { themeColors } from "../../themes/schemes/PureLightThem";
import "./Toast.Style.scss";
import { LoadingButton } from "@mui/lab";

const ToastComponent = ({ open, close, title, message, type, children }) => {
  return (
    <Alert
      icon={
        type === "error" ? (
          <Error
            sx={{ color: themeColors.button_Secondary, width: 30, height: 30 }}
          />
        ) : type === "success" ? (
          <CheckCircleOutline sx={{ color: themeColors.status_Primary }} />
        ) : type === "warning" ? (
          <Warning sx={{ color: themeColors.status_Secondary }} />
        ) : type === "info" ? (
          <Info sx={{ color: themeColors.primary_Default }} />
        ) : (
          <LoadingButton
            loading
            variant="outlined"
            sx={{ border: "0 !important" }}
          />
        )
      }
      className={type === "loading" ? `waiting` : `toast`}
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
            : type === "info"
            ? `5px solid ${themeColors.primary_Default}`
            : `5px solid ${themeColors.gray}`,
        color: "#888",
      }}
    >
      <AlertTitle sx={{ color: "#333", fontWeight: 700 }}>{title}</AlertTitle>
      {message}
      <br />
      {children?.length > 0 &&
        children?.map((item, index) => (
          <ul key={index} style={{ marginLeft: "2rem" }}>
            <li>
              <strong>{item}</strong>
            </li>
          </ul>
        ))}
    </Alert>
  );
};

export default ToastComponent;
