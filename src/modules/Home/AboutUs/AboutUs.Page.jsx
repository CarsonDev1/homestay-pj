import React, { useEffect, useState } from "react";
import "./AboutUs.Style.scss";
import BoxContainer from "../../../components/Box/Box.Container";
import { Avatar, Box, Divider, IconButton, Typography } from "@mui/material";
import { checkLogin } from "../../../utils/helper";
import HeaderUser from "../../../layouts/Header/User/HeaderUser";
import HeaderGuest from "../../../layouts/Header/Guest/HeaderGuest";
import FooterCustomer from "../../../layouts/Footer/Customer/FooterCustomer";
import { themeColors } from "../../../themes/schemes/PureLightThem";
import { AssetImages } from "../../../utils/images";
import { dataTeamMember, dataTestimonials } from "../../../utils/dataSet";
import { ChevronLeftOutlined, ChevronRightOutlined } from "@mui/icons-material";

const AboutUsPage = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState("right");
  const [isAnimating, setIsAnimating] = useState(false);
  const { avt, color, name, content, job } = dataTestimonials[index];

  const prevTestimonials = () => {
    if (!isAnimating) {
      setDirection("left");
      setIsAnimating(true);
      setIndex(
        (prev) => (prev - 1 + dataTestimonials.length) % dataTestimonials.length
      );
    }
  };

  const nextTestimonials = () => {
    if (!isAnimating) {
      setDirection("right");
      setIsAnimating(true);
      setIndex((prev) => (prev + 1) % dataTestimonials.length);
    }
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const enterClass = direction === "right" ? "slide-enter" : "slide-left-enter";

  return (
    <BoxContainer>
      {checkLogin() ? <HeaderUser /> : <HeaderGuest />}

      <Box height="25rem" bgcolor={themeColors.black} overflow="hidden">
        <Box
          sx={{
            width: "100%",
            height: "100%",
            position: "relative",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Box width="100%" position="absolute">
            <img
              src={AssetImages.ABOUT_US.HEADER}
              alt=""
              style={{ opacity: 0.5 }}
            />
          </Box>

          <Box
            sx={{
              width: "60%",
              position: "relative",
              color: themeColors.white,
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              textAlign: "center",
            }}
          >
            <h2 style={{ fontSize: "2rem" }}>About Us</h2>
            <Typography sx={{ fontSize: 18 }}>
              At EPOSH Booking, we believe that booking a hotel should be easy,
              convenient, and stress-free. Whether you're planning a family
              vacation, a business trip, or a weekend getaway, our platform is
              designed to provide you with the best hotel options at the best
              prices.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box className="about-us__container">
        <Box className="about-us__mission">
          <Box className="about-us__content">
            <h3 className="content__title">Our Mission</h3>
            <Typography className="content__desc">
              Our mission is to simplify the hotel booking process and offer our
              customers a wide range of accommodation choices, from
              budget-friendly options to luxurious stays. We aim to make travel
              planning seamless and enjoyable by providing a user-friendly
              interface, comprehensive search filters, and detailed hotel
              information.
            </Typography>
          </Box>

          <Box className="about-us__image">
            <img
              src={AssetImages.ABOUT_US.MISSION}
              alt=""
              style={{ width: "100%", objectFit: "cover", display: "block" }}
            />
          </Box>
        </Box>

        <Box className="about-us__story">
          <Box className="about-us__image">
            <img
              src={AssetImages.ABOUT_US.STORY}
              alt=""
              style={{ width: "100%", objectFit: "cover", display: "block" }}
            />
          </Box>

          <Box className="about-us__content">
            <h3 className="content__title">Our Story</h3>
            <Typography className="content__desc">
              Founded in 2024, EPOSH booking started with a simple goal: to make
              hotel booking easier for everyone. What began as a small project
              has grown into a trusted platform used by travelers from all over
              the world. Our commitment to quality and customer satisfaction has
              been the driving force behind our success.
            </Typography>
          </Box>
        </Box>

        <Box className="our-team">
          <h3>Meet Our Team</h3>
          <Box className="team__lecturer">
            <Box className="team__image">
              <img
                src={AssetImages.AVT_FAKE.HIEUNT}
                alt=""
                style={{ width: "100%", objectFit: "cover", display: "block" }}
              />
            </Box>
            <Box className="team__infor">
              <h4 className="infor__name">Nguyen Trung Hieu</h4>
              <Typography className="infor__position">Lecturer</Typography>
            </Box>
          </Box>

          <Box className="team__member">
            {dataTeamMember.map((member, index) => (
              <Box className="member" key={index}>
                <Box className="member__image">
                  <img
                    src={member.img}
                    alt=""
                    style={{
                      width: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </Box>
                <Box className="team__infor">
                  <h4 className="infor__name">{member.name}</h4>
                  <Typography className="infor__position">
                    {member.position}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box className="testimonials__container">
          <h3>Testimonials</h3>
          <Box className="testimonial__wrapper">
            <IconButton
              onClick={prevTestimonials}
              sx={{ width: 40, height: 40 }}
            >
              <ChevronLeftOutlined sx={{ width: 30, height: 30 }} />
            </IconButton>

            <Box
              className={`testimonial__card ${isAnimating ? enterClass : ""}`}
            >
              <Box
                sx={{
                  borderTop: `10px solid ${color}`,
                  borderRadius: "6px 6px 0 0",
                }}
              >
                <Box className="card__avatar">
                  <Avatar
                    src={avt}
                    alt=""
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      border: `1px solid ${themeColors.gray}`,
                    }}
                  />
                </Box>

                <Box className="card__quote">{`"${content}"`}</Box>

                <Divider sx={{ bgcolor: themeColors.gray, m: "2rem 0 1rem" }} />

                <Box className="card__infor">
                  <h4 style={{ fontSize: 20, color: themeColors.title }}>
                    {name}
                  </h4>
                  <Typography sx={{ fontSize: 17 }}>{job}</Typography>
                </Box>
              </Box>
            </Box>

            <IconButton
              onClick={nextTestimonials}
              sx={{ width: 40, height: 40 }}
            >
              <ChevronRightOutlined sx={{ width: 30, height: 30 }} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <FooterCustomer />
    </BoxContainer>
  );
};

export default AboutUsPage;
