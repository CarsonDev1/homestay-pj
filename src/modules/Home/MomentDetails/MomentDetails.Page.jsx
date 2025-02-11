/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import BoxContainer from "../../../components/Box/Box.Container";
import "./MomentDetails.Style.scss";
import HeaderGuest from "../../../layouts/Header/Guest/HeaderGuest";
import FooterCustomer from "../../../layouts/Footer/Customer/FooterCustomer";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import { AssetImages } from "../../../utils/images";
import { themeColors } from "../../../themes/schemes/PureLightThem";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../routes";
import Slider from "react-slick";
import {
  checkLogin,
  formatDateWithWeekDay,
  formatDesc,
} from "../../../utils/helper";
import HeaderUser from "../../../layouts/Header/User/HeaderUser";
import { commentPost, getAllPost, getPostDetails } from "../Home.Api";
import secureLocalStorage from "react-secure-storage";
import { URL_IMAGE } from "../../../services/ApiUrl";
import {
  filterPostsApproved,
  filterPostsInCanTho,
  filterPostsInDaNang,
  filterPostsInHaNoi,
  filterPostsInHoChiMinh,
  filterPostsInQuyNhon,
} from "../../../utils/filter";
import ToastComponent from "../../../components/Toast/Toast.Component";
import { getProfile } from "../../Auth/Auth.Api";
import { useDispatch } from "react-redux";
import { LoadingButton } from "@mui/lab";

const MomentDetailsPage = () => {
  let listPostCanTho = [];
  let listPostHaNoi = [];
  let listPostHoChiMinh = [];
  let listPostDaNang = [];
  let listPostQuyNhon = [];

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onTopRef = useRef(null);
  const onCommentRef = useRef(null);

  const [data, setData] = useState({});
  const [dataAccount, setDataAccount] = useState({});
  const [dataPost, setDataPost] = useState([]);

  const [text, setText] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  const [displayEmpty, setDisplayEmpty] = useState(false);
  const [displayMaxLength, setDisplayMaxLength] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [displayServerError, setDisplayServerError] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const commentsPerPage = 10;
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComment = data?.comments?.slice(
    indexOfFirstComment,
    indexOfLastComment
  );
  const totalPageComment = Math.ceil(data?.comments?.length / commentsPerPage);

  const paginate = (event, value) => {
    event.preventDefault();
    setCurrentPage(value);
    if (onCommentRef.current) {
      onCommentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0",
    draggable: true,
    autoplay: true,
    autoplaySpeed: 3000,
    afterChange: (current) => setCurrentSlide(current),
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const filterListPost = (listPosts) => {
    switch (secureLocalStorage.getItem("blogLocation")) {
      case "Can Tho":
        listPostCanTho = filterPostsInCanTho(filterPostsApproved(listPosts));
        setDataPost(listPostCanTho);
        break;
      case "Ho Chi Minh":
        listPostHoChiMinh = filterPostsInHoChiMinh(
          filterPostsApproved(listPosts)
        );
        setDataPost(listPostHoChiMinh);
        break;
      case "Da Nang":
        listPostDaNang = filterPostsInDaNang(filterPostsApproved(listPosts));
        setDataPost(listPostDaNang);
        break;
      case "Quy Nhon":
        listPostQuyNhon = filterPostsInQuyNhon(filterPostsApproved(listPosts));
        setDataPost(listPostQuyNhon);
        break;
      case "Ha Noi":
        listPostHaNoi = filterPostsInHaNoi(filterPostsApproved(listPosts));
        setDataPost(listPostHaNoi);
        break;
      default:
        setDataPost([]);
        break;
    }
  };

  const init = async () => {
    const res = await getPostDetails(secureLocalStorage.getItem("blogId"));
    const resPost = await getAllPost();
    const resAccount = await getProfile(
      secureLocalStorage.getItem("accountId"),
      dispatch
    );

    if (res) {
      setData(res);
    }

    if (resPost) {
      filterListPost(resPost);
    }

    if (resAccount) {
      setDataAccount(resAccount);
    }
  };

  const handleSendComment = async () => {
    if (text === "") {
      setDisplayEmpty(true);
    } else {
      if (text?.trim().length <= 0 || text?.trim().length > 500) {
        setDisplayMaxLength(true);
      } else {
        try {
          let formData = new FormData();

          formData.append("blogId", secureLocalStorage.getItem("blogId"));
          formData.append("accountId", secureLocalStorage.getItem("accountId"));
          formData.append("description", text);

          const res = await commentPost(formData);

          if (res.status === 200) {
            setText("");
            if (onTopRef.current) {
              onTopRef.current.scrollIntoView({ behavior: "smooth" });
            }
          } else {
            setDisplayError(true);
          }
        } catch (error) {
          setDisplayServerError(true);
        }
      }
    }
  };

  useEffect(() => {
    init();
  }, [data]);

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
    if (displayMaxLength) {
      timeOut = setTimeout(() => {
        setDisplayMaxLength(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayMaxLength]);

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
    <BoxContainer>
      {checkLogin() ? <HeaderUser /> : <HeaderGuest />}
      <ToastComponent
        open={displayEmpty}
        close={() => setDisplayEmpty(false)}
        title="Error"
        message="You must enter your comment before send!"
        type="error"
      />

      <ToastComponent
        open={displayMaxLength}
        close={() => setDisplayMaxLength(false)}
        title="Error"
        message="Your comment must be between 1 and 500 characters!"
        type="error"
      />

      <ToastComponent
        open={displayError}
        close={() => setDisplayError(false)}
        title="Error"
        message="Comment fail!"
        type="error"
      />

      <ToastComponent
        open={displayServerError}
        close={() => setDisplayServerError(false)}
        title="Error"
        message="Server maintenance is underway. Please try again later!"
        type="error"
      />

      {data?.blogImages?.length >= 1 ? (
        <Box className="moment_Details_Container" ref={onTopRef}>
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
            <Typography sx={{ color: themeColors.text_Link }}>&gt;</Typography>
            <Typography
              onClick={() => {
                navigate(routes.home.filterMoment);
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
              {secureLocalStorage.getItem("location") ||
                secureLocalStorage.getItem("blogLocation")}
            </Typography>
            <Typography sx={{ color: themeColors.text_Link }}>&gt;</Typography>
            <Typography sx={{ color: themeColors.black, fontWeight: 700 }}>
              {secureLocalStorage.getItem("blogTitle")}
            </Typography>
          </Box>
          <Stack className="momemnt_Details_Content">
            <Box className="moment_Details-image_Wrapper">
              {data?.blogImages?.length === 1 &&
                data?.blogImages?.map((image) => (
                  <Box key={image?.imageID} width="100%" height="600px">
                    <img
                      src={`${URL_IMAGE}${image?.image}`}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "8px 8px 0 0",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                ))}

              {data?.blogImages?.length > 1 &&
                data?.blogImages?.length <= 3 && (
                  <Slider {...settings}>
                    {data?.blogImages?.map((image) => {
                      return (
                        <Box key={image?.imageID} height="600px">
                          <img
                            loading="lazy"
                            src={`${URL_IMAGE}${image?.image}`}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: "8px 8px 0 0",
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                      );
                    })}
                  </Slider>
                )}

              {data?.blogImages?.length > 3 && (
                <Slider {...sliderSettings}>
                  {data?.blogImages?.map((image, index) => {
                    const isCenter = index === currentSlide;
                    return (
                      <Box
                        key={image?.imageID}
                        className={`banner_image ${
                          isCenter ? "center" : "side"
                        }`}
                        style={{
                          transform: isCenter ? "scale(1.2)" : "scale(0.8)",
                          opacity: isCenter ? 1 : 1,
                          transition: "transform 0.5s ease, opacity 0.5s ease",
                          margin: isCenter ? "0 15px" : "0 10px",
                          zIndex: isCenter ? 2 : 1,
                        }}
                      >
                        <img
                          loading="lazy"
                          src={`${URL_IMAGE}${image?.image}`}
                          alt=""
                          style={{
                            width: "100%",
                            minHeight: isCenter ? "300px" : "280px",
                            maxHeight: isCenter ? "300px" : "280px",
                            borderRadius: "8px 8px 0 0",
                          }}
                        />
                      </Box>
                    );
                  })}
                </Slider>
              )}
            </Box>
            <Box className="moment_Details_Title">
              <Typography className="moment_Details_Title-name">
                {data?.title}
              </Typography>
              <Typography className="moment_Details_Title-rev">
                {data?.comments
                  ? data?.comments?.length <= 1
                    ? `${data?.comments?.length} review`
                    : `${data?.comments?.length} reviews`
                  : `0 review`}
              </Typography>
              <Divider
                sx={{ marginTop: "15px", color: themeColors.bg_Disabled }}
              />
            </Box>
            <Box className="moment_Details_Description">
              <Typography className="moment_Details_Title-des">
                {formatDesc(data?.description)}
              </Typography>
              <Divider
                sx={{ marginTop: "15px", color: themeColors.bg_Disabled }}
              />
            </Box>
            <Box ref={onCommentRef} height="10px"></Box>
            <Box className="moment_Details_Comment-Container">
              <Typography className="moment_Details_Comment-title">
                Comments from visitors:
              </Typography>
              {data?.comments?.length !== 0 ? (
                <Box className="moment_Details_Comment">
                  {currentComment?.map((comment) => (
                    <Box
                      className="moment_Details_Comment-visitor"
                      key={comment?.commentID}
                    >
                      <Box className="Comment_Account">
                        {comment?.account?.profile?.avatar ? (
                          comment?.account?.profile?.avatar?.startsWith(
                            "/",
                            0
                          ) ? (
                            <img
                              loading="lazy"
                              className="Comment_Account-icon"
                              src={`${URL_IMAGE}${comment?.account?.profile?.avatar}`}
                              alt="Avatar"
                            />
                          ) : (
                            <img
                              loading="lazy"
                              className="Comment_Account-icon"
                              src={`${comment?.account?.profile?.avatar}`}
                              alt="Avatar"
                            />
                          )
                        ) : (
                          <img
                            loading="lazy"
                            className="Comment_Account-icon"
                            src={`${AssetImages.LOGO}`}
                            alt="Avatar"
                          />
                        )}
                        <Box display="flex" flexDirection="column" gap=".5rem">
                          <Typography className="Comment_Account-name">
                            {comment?.account?.profile?.fullName}
                          </Typography>
                          <Typography
                            sx={{ fontSize: 16, color: themeColors.gray }}
                          >
                            {formatDateWithWeekDay(comment?.dateComment)}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography className="Comment_Account-desc">
                        {comment?.description}
                      </Typography>
                    </Box>
                  ))}

                  {data?.comments?.length > 0 && (
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        p: "20px",
                      }}
                    >
                      {data?.comments?.length > 0 && (
                        <Grid item xs={6} sx={{ alignItems: "center" }}>
                          <label>
                            <b>
                              Showing {currentPage} of {totalPageComment}{" "}
                              {totalPageComment > 1 ? "pages" : "page"}
                            </b>
                          </label>
                        </Grid>
                      )}
                      <Stack sx={{ alignItems: "center" }}>
                        {data?.comments?.length > 0 && (
                          <Pagination
                            color="standard"
                            variant="outlined"
                            defaultPage={1}
                            count={totalPageComment}
                            page={currentPage}
                            onChange={paginate}
                            size="medium"
                            showFirstButton
                            showLastButton
                          />
                        )}
                      </Stack>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box
                  width="100%"
                  p="20px 0"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography
                    sx={{
                      fontSize: 20,
                      fontWeight: 400,
                    }}
                  >
                    No comment in this post!
                  </Typography>
                </Box>
              )}
            </Box>

            {checkLogin() &&
            data?.account?.accountID !==
              secureLocalStorage.getItem("accountId") ? (
              <>
                <Divider
                  sx={{ marginTop: "15px", color: themeColors.bg_Disabled }}
                />
                <Box className="moment_Details_Your-Comment">
                  <Typography className="Your_Comment-title">
                    Your Comment:
                  </Typography>
                  <Box className="Your_Comment-desc">
                    <img
                      loading="lazy"
                      className="Your_Comment-avatar"
                      src={
                        dataAccount?.profile?.avatar?.startsWith("/", 0)
                          ? `${URL_IMAGE}${dataAccount?.profile?.avatar}`
                          : `${dataAccount?.profile?.avatar}`
                      }
                      alt=""
                    />
                    <textarea
                      onChange={handleTextChange}
                      style={{
                        width: "100%",
                        padding: "10px 16px",
                        fontSize: "16px",
                        resize: "none",
                        borderRadius: "6px",
                      }}
                      rows={8}
                      value={text}
                      placeholder="Your Comment is Here"
                    ></textarea>
                  </Box>
                  <IconButton onClick={handleSendComment} className="btn--send">
                    <img
                      className="Your_Comment-send"
                      src={AssetImages.ICONS.COMMENT_SEND}
                      alt=""
                    />
                  </IconButton>
                </Box>
              </>
            ) : (
              <Box mb="15px"></Box>
            )}
          </Stack>
          <Box className="moment_Details_Another-Container">
            <Typography className="moment_Details_Another-title">
              Another Post in {secureLocalStorage.getItem("blogLocation")}
            </Typography>
            {dataPost?.length !== 0 ? (
              <Box className="moment_Details_Another-Content">
                {dataPost?.slice(0, 4)?.map((post) => (
                  <Box
                    key={post?.blogID}
                    className="moment_Details_Another_Item"
                  >
                    <img
                      loading="lazy"
                      className="md_Another_img"
                      src={`${URL_IMAGE}${post?.blogImages[0]?.image}`}
                      alt="Post"
                    />
                    <Typography className="md_Another_Item-subtitle">
                      {post?.title}
                    </Typography>
                    <Typography className="md_Another_Item-comment">
                      {post?.comments?.length <= 1
                        ? `${post?.comments?.length} Comment`
                        : `${post?.comments?.length} Comments`}
                    </Typography>
                    <Button
                      onClick={() => {
                        secureLocalStorage.removeItem("blogId");
                        secureLocalStorage.removeItem("blogTitle");
                        secureLocalStorage.setItem("blogId", post?.blogID);
                        secureLocalStorage.setItem("blogTitle", post?.title);
                        navigate(routes.home.momentDetails);
                        if (onTopRef.current) {
                          onTopRef.current.scrollIntoView({
                            behavior: "smooth",
                          });
                        }
                      }}
                      sx={{
                        display: "flex",
                        margin: "auto",
                        width: "60%",
                        marginBottom: "10px",
                        backgroundColor: themeColors.primary_Default,
                        color: themeColors.white,
                        borderRadius: "8px",
                        textTransform: "none",
                        "&:hover": {
                          cursor: "pointer",
                          backgroundColor: themeColors.primary_600,
                        },
                      }}
                    >
                      View Details
                    </Button>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box display="flex" p="5px 0 25px">
                <Typography
                  sx={{ m: "auto", fontSize: 18, color: themeColors.black }}
                >
                  No post found in {secureLocalStorage.getItem("blogLocation")}!
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      ) : (
        <Box
          width="100%"
          p="20px 60px"
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
    </BoxContainer>
  );
};

export default MomentDetailsPage;
