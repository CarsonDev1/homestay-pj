import { IconButton } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import secureLocalStorage from "react-secure-storage";

const LogoutComponent = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    secureLocalStorage.clear();
    setTimeout(() => {
      navigate(routes.home.root);
    }, 1000);
  };

  return (
    <IconButton
      sx={{ "&:hover": { bgcolor: `rgba(255,255,255, 0.3)` } }}
      onClick={logout}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 50 50"
        fill="none"
      >
        <mask
          id="mask0_107_926"
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="50"
          height="50"
        >
          <rect width="50" height="50" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_107_926)">
          <path
            d="M10.4167 43.75C9.27083 43.75 8.28993 43.342 7.47396 42.526C6.65799 41.7101 6.25 40.7292 6.25 39.5833V10.4167C6.25 9.27083 6.65799 8.28993 7.47396 7.47396C8.28993 6.65799 9.27083 6.25 10.4167 6.25H25V10.4167H10.4167V39.5833H25V43.75H10.4167ZM33.3333 35.4167L30.4688 32.3958L35.7812 27.0833H18.75V22.9167H35.7812L30.4688 17.6042L33.3333 14.5833L43.75 25L33.3333 35.4167Z"
            fill="white"
          />
        </g>
      </svg>
    </IconButton>
  );
};

export default LogoutComponent;
