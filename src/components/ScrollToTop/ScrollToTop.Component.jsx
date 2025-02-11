import { KeyboardArrowUpOutlined } from "@mui/icons-material";
import { Fab, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { themeColors } from "../../themes/schemes/PureLightThem";

const ScrollToTopComponent = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <Tooltip title="Scroll To Top" placement="left">
      <Fab
        size="small"
        onClick={scrollToTop}
        sx={{
          display: visible ? "flex" : "none",
          position: "fixed",
          top: "90%",
          right: "2%",
          bgcolor: themeColors.white,
          color: themeColors.text_Link,
          boxShadow: themeColors.boxShadow,
          transition: "all .3s linear",
          zIndex: 99999,
          "&:hover": {
            bgcolor: themeColors.bg_Disabled,
            boxShadow: themeColors.boxShadowHover,
          },
        }}
      >
        <KeyboardArrowUpOutlined />
      </Fab>
    </Tooltip>
  );
};

export default ScrollToTopComponent;
