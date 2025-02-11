import React, { useEffect, useState } from "react";
import "./MyPosts.Style.scss";
import { Box, Button, Typography } from "@mui/material";
import AllPostsPage from "./AllPosts/AllPosts.Page";
import PendingPostsPage from "./AwaitingApprovalPosts/PendingPosts.Page";
import ApprovedPostsPage from "./ApprovedPosts/ApprovedPosts.Page";
import RejectedPostsPage from "./RejectedPosts/RejectedPosts.Page";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import BoxContainer from "../../../../../components/Box/Box.Container";
import { themeColors } from "../../../../../themes/schemes/PureLightThem";
import { routes } from "../../../../../routes";

const navItems = ["All", "Awaiting Approval", "Approved", "Rejected"];

const MyPostsPage = () => {
  const navigate = useNavigate();

  const [isSelected, setIsSelected] = useState(0);

  const handleSelect = (index) => {
    setIsSelected(index);
  };

  useEffect(() => {
    secureLocalStorage.removeItem("bookingId");
    secureLocalStorage.removeItem("blogId");
    secureLocalStorage.removeItem("blogLocation");
    secureLocalStorage.removeItem("blogTitle");
    secureLocalStorage.removeItem("path");
  }, []);

  return (
    <BoxContainer property="my-posts__container">
      <Box className="my-post__content">
        <Box className="my-post__nav">
          {navItems.map((item, index) => (
            <Typography
              key={index}
              onClick={() => handleSelect(index)}
              sx={{
                color:
                  index === isSelected
                    ? themeColors.primary_Default
                    : themeColors.black,
                fontWeight: index === isSelected ? 700 : "normal",
                borderBottom:
                  index === isSelected
                    ? `3px solid ${themeColors.primary_Default}`
                    : "none",
                fontSize: 18,
                cursor: "pointer",
                "&:hover": {
                  color:
                    index !== isSelected
                      ? themeColors.text_Disabled
                      : themeColors.primary_Default,
                },
              }}
            >
              {item}
            </Typography>
          ))}
        </Box>

        <Box width="100%" display="flex" justifyContent="flex-end">
          <Button
            onClick={() => {
              secureLocalStorage.setItem("path", "my-account");
              navigate(routes.home.createMoment);
            }}
            sx={{
              bgcolor: themeColors.primary_Default,
              color: themeColors.white,
              textTransform: "none",
              fontWeight: 700,
              fontSize: 16,
              p: "10px 25px",
              borderRadius: "8px",
              "&:hover": {
                bgcolor: themeColors.primary_600,
              },
            }}
          >
            Post Travel Moments
          </Button>
        </Box>

        {isSelected === 0 ? <AllPostsPage /> : null}
        {isSelected === 1 ? <PendingPostsPage /> : null}
        {isSelected === 2 ? <ApprovedPostsPage /> : null}
        {isSelected === 3 ? <RejectedPostsPage /> : null}
      </Box>
    </BoxContainer>
  );
};

export default MyPostsPage;
