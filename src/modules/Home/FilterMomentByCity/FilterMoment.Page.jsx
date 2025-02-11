/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import BoxContainer from "../../../components/Box/Box.Container";
import HeaderGuest from "../../../layouts/Header/Guest/HeaderGuest";
import FooterCustomer from "../../../layouts/Footer/Customer/FooterCustomer";
import { Box, Button, Stack, Typography } from "@mui/material";
import "./FilterMoment.Style.scss";
import { AssetImages } from "../../../utils/images";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../routes";
import { checkLogin } from "../../../utils/helper";
import HeaderUser from "../../../layouts/Header/User/HeaderUser";
import { themeColors } from "../../../themes/schemes/PureLightThem";
import secureLocalStorage from "react-secure-storage";
import {
  filterPostsApproved,
  filterPostsInCanTho,
  filterPostsInDaNang,
  filterPostsInHaNoi,
  filterPostsInHoChiMinh,
  filterPostsInQuyNhon,
} from "../../../utils/filter";
import { getAllPost } from "../Home.Api";
import { URL_IMAGE } from "../../../services/ApiUrl";
import { LoadingButton } from "@mui/lab";

const FilterMomentPage = () => {
  let listPostCanTho = [];
  let listPostHaNoi = [];
  let listPostHoChiMinh = [];
  let listPostDaNang = [];
  let listPostQuyNhon = [];

  const location =
    secureLocalStorage.getItem("location") ||
    secureLocalStorage.getItem("blogLocation");

  const navigate = useNavigate();
  const onTopRef = useRef(null);

  const [data, setData] = useState([]);
  const [anotherPost, setAnotherPost] = useState([]);

  const [postPage, setPostPage] = useState(7);

  const handleSeeMore = () => {
    setPostPage((prev) => prev + 4);
  };

  const handleCreateMoment = () => {
    if (checkLogin()) {
      secureLocalStorage.setItem("path", "filter");
      navigate(routes.home.createMoment);
    } else {
      navigate(routes.auth.login);
    }
  };

  const filterListCities = () => {
    switch (location) {
      case "Can Tho":
        setAnotherPost([
          {
            city: "Ho Chi Minh",
            img: AssetImages.BANNER.BANNER_1,
          },
          {
            city: "Da Nang",
            img: AssetImages.BANNER.BANNER_4,
          },
          {
            city: "Quy Nhon",
            img: AssetImages.BANNER.BANNER_5,
          },
          {
            city: "Ha Noi",
            img: AssetImages.BANNER.BANNER_3,
          },
        ]);
        break;
      case "Ho Chi Minh":
        setAnotherPost([
          {
            city: "Can Tho",
            img: AssetImages.BANNER.BANNER_2,
          },
          {
            city: "Da Nang",
            img: AssetImages.BANNER.BANNER_4,
          },
          {
            city: "Quy Nhon",
            img: AssetImages.BANNER.BANNER_5,
          },
          {
            city: "Ha Noi",
            img: AssetImages.BANNER.BANNER_3,
          },
        ]);
        break;
      case "Da Nang":
        setAnotherPost([
          {
            city: "Can Tho",
            img: AssetImages.BANNER.BANNER_2,
          },
          {
            city: "Ho Chi Minh",
            img: AssetImages.BANNER.BANNER_1,
          },
          {
            city: "Quy Nhon",
            img: AssetImages.BANNER.BANNER_5,
          },
          {
            city: "Ha Noi",
            img: AssetImages.BANNER.BANNER_3,
          },
        ]);
        break;
      case "Quy Nhon":
        setAnotherPost([
          {
            city: "Can Tho",
            img: AssetImages.BANNER.BANNER_2,
          },
          {
            city: "Ho Chi Minh",
            img: AssetImages.BANNER.BANNER_1,
          },
          {
            city: "Da Nang",
            img: AssetImages.BANNER.BANNER_4,
          },
          {
            city: "Ha Noi",
            img: AssetImages.BANNER.BANNER_3,
          },
        ]);
        break;
      case "Ha Noi":
        setAnotherPost([
          {
            city: "Can Tho",
            img: AssetImages.BANNER.BANNER_2,
          },
          {
            city: "Ho Chi Minh",
            img: AssetImages.BANNER.BANNER_1,
          },
          {
            city: "Da Nang",
            img: AssetImages.BANNER.BANNER_4,
          },
          {
            city: "Quy Nhon",
            img: AssetImages.BANNER.BANNER_5,
          },
        ]);
        break;
      default:
        setAnotherPost([]);
        break;
    }
  };

  const filterListPost = (listPosts) => {
    switch (location) {
      case "Can Tho":
        listPostCanTho = filterPostsInCanTho(filterPostsApproved(listPosts));
        setData(listPostCanTho);
        break;
      case "Ho Chi Minh":
        listPostHoChiMinh = filterPostsInHoChiMinh(
          filterPostsApproved(listPosts)
        );
        setData(listPostHoChiMinh);
        break;
      case "Da Nang":
        listPostDaNang = filterPostsInDaNang(filterPostsApproved(listPosts));
        setData(listPostDaNang);
        break;
      case "Quy Nhon":
        listPostQuyNhon = filterPostsInQuyNhon(filterPostsApproved(listPosts));
        setData(listPostQuyNhon);
        break;
      case "Ha Noi":
        listPostHaNoi = filterPostsInHaNoi(filterPostsApproved(listPosts));
        setData(listPostHaNoi);
        break;
      default:
        setData([]);
        break;
    }
  };

  const init = async () => {
    const res = await getAllPost();

    if (res) {
      filterListPost(res);
    }
  };

  useEffect(() => {
    init();
    filterListCities();
  }, [data]);

  useEffect(() => {
    secureLocalStorage.removeItem("blogId");
    secureLocalStorage.removeItem("blogTitle");
    secureLocalStorage.removeItem("path");
  }, []);

  return (
    <Box ref={onTopRef}>
      {checkLogin() ? <HeaderUser /> : <HeaderGuest />}
      {data?.length > 0 ? (
        <BoxContainer property="filterMoment_container">
          <Stack className="filterMoment_title_container">
            <Box display="flex" alignItems="center" gap=".5rem" mb="20px">
              <Typography
                onClick={() => {
                  navigate(routes.home.listMoments);
                  document.documentElement.scrollTop = 0;
                }}
                sx={{
                  color: themeColors.text_Link,
                  "&:hover": {
                    color: themeColors.primary_600,
                    textDecoration: "underline",
                    cursor: "pointer",
                  },
                }}
              >
                Posts
              </Typography>
              <Typography sx={{ color: themeColors.text_Link }}>
                &gt;
              </Typography>
              <Typography sx={{ color: themeColors.black, fontWeight: 700 }}>
                {location}
              </Typography>
            </Box>
            <Box className="filterMoment_title-1">
              <Typography className="filterMoment_title-heading">
                Travel guide in{" "}
                {location !== "Ha Noi"
                  ? `${location} City`
                  : `${location} Capital`}
              </Typography>
              <Typography className="filterMoment_title-desc">
                {location === "Can Tho"
                  ? `Can Tho is a city located in Can Tho, Việt Nam. There are many
              popular attractions here, including the Mekong Delta, Luu Huu
              Phuoc Park, and My Khanh Tourist Village, making this a
              destination that is hard to miss.`
                  : location === "Ho Chi Minh"
                  ? `Ho Chi Minh City, Vietnam, is a bustling city with diverse culture and rich history. 
                Famous landmarks include Ben Thanh Market, Reunification Palace, and War Remnants Museum. 
                Visitors should try pho, banh mi, and explore the Cu Chi Tunnels.`
                  : location === "Da Nang"
                  ? `Da Nang City, located in central Vietnam, boasts beautiful beaches, historic sites, and delicious cuisine. 
                Highlights include the Marble Mountains for scenic views and pagodas, My Khe Beach for relaxation, and the vibrant Han Market for local goods. 
                Don't miss trying Mi Quang (turmeric noodles) and exploring the ancient town of Hoi An nearby.`
                  : location === "Quy Nhon"
                  ? `Quy Nhon City, situated on Vietnam's central coast, offers a serene escape with its pristine beaches and cultural attractions. 
                Must-see spots include the Thap Doi Cham Towers for historical insights, Ky Co Beach for its turquoise waters and cliffs, and the bustling local markets for fresh seafood and souvenirs. 
                Don't forget to try the local specialty, Banh It La Gai (sticky rice cake with fern leaf).`
                  : `Ha Noi, Vietnam's capital, blends rich history with vibrant culture. 
                Must-see attractions include Hoan Kiem Lake, the Old Quarter's bustling streets, Ho Chi Minh Mausoleum, Temple of Literature, and local cuisine like pho and bun cha.`}
              </Typography>
            </Box>
            <Box className="filterMoment_title-2">
              <Typography className="filterMoment_title-2-heading">
                City Experience {location}
              </Typography>
              <Button
                onClick={handleCreateMoment}
                className="filterMoment_btn-create"
              >
                Create Moment
              </Button>
            </Box>
          </Stack>
          <Box className="filterMoment_Item_Container">
            {data?.map((post, index) => {
              if (index > postPage) {
                return null;
              } else {
                return (
                  <Box
                    key={post?.blogID}
                    className="filterMoment_item_content"
                    onClick={() => {
                      secureLocalStorage.setItem("blogId", post?.blogID);
                      secureLocalStorage.setItem(
                        "blogLocation",
                        post?.location
                      );
                      secureLocalStorage.setItem("blogTitle", post?.title);
                      navigate(routes.home.momentDetails);
                      document.documentElement.scrollTop = 0;
                    }}
                  >
                    <img
                      loading="lazy"
                      className="fm_img"
                      src={`${URL_IMAGE}${post?.blogImages[0]?.image}`}
                      alt={`This is Moment ${index + 1}`}
                    />
                    <Typography className="fm_desc">{post?.title}</Typography>
                    <Box className="fm_city">{post?.location}</Box>
                    <Box className="fm_account">
                      <img
                        className="fm_img_icon"
                        src={AssetImages.ICONS.MOMENT_AVATAR}
                        alt={post?.account?.fullName}
                      />
                      <Typography className="fm_account-name">
                        {post?.account?.fullName}
                      </Typography>
                    </Box>
                  </Box>
                );
              }
            })}
          </Box>
          <Box display="flex" p="20px 0">
            {postPage < data?.length - 1 ? (
              <Box m="auto" onClick={handleSeeMore}>
                <Typography
                  sx={{
                    color: themeColors.white,
                    fontSize: 18,
                    textAlign: "center",
                    bgcolor: themeColors.secondary_Default,
                    p: "10px 30px",
                    borderRadius: "8px",
                    transition: "all .2s linear",
                    "&:hover": {
                      cursor: "pointer",
                      bgcolor: themeColors.thirdary_Default,
                    },
                  }}
                >
                  See more
                </Typography>
              </Box>
            ) : (
              <Typography
                sx={{
                  m: "auto",
                  fontSize: "1.2rem",
                  color: "black",
                  fontWeight: "500",
                }}
              >
                You have just viewed {data?.length}{" "}
                {data?.length > 1 ? "posts" : "post"}
              </Typography>
            )}
          </Box>
          <Box className="filterMoment_Other_Item_Container">
            <Typography className="filterMoment_Other_Item_title">
              Other cities
            </Typography>
            <Box className="filterMoment_Other_Item_Wrapper">
              {anotherPost?.map((post, index) => (
                <Box
                  className="filterMoment_Other_Item_content"
                  key={index}
                  onClick={() => {
                    secureLocalStorage.removeItem("location");
                    secureLocalStorage.setItem("location", post?.city);
                    navigate(routes.home.filterMoment);
                    if (onTopRef.current) {
                      onTopRef.current.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  <img
                    className="fm_Other_img"
                    src={post?.img}
                    alt="This is Moment pictured"
                  />
                  <Typography className="fm_Other_title">
                    {post?.city}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </BoxContainer>
      ) : (
        <Box
          width="100%"
          p="20px 0"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <LoadingButton
            loading
            variant="outlined"
            sx={{ border: "0 !important" }}
          />
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: 400,
            }}
          >
            Loading...
          </Typography>
        </Box>
      )}
      <FooterCustomer />
    </Box>
  );
};

export default FilterMomentPage;
