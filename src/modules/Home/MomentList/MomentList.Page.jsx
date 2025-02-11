import React, { useEffect, useRef, useState } from "react";
import HeaderGuest from "../../../layouts/Header/Guest/HeaderGuest";
import FooterCustomer from "../../../layouts/Footer/Customer/FooterCustomer";
import BoxContainer from "../../../components/Box/Box.Container";
import "./MomentList.Style.scss";
import { checkLogin } from "../../../utils/helper";
import HeaderUser from "../../../layouts/Header/User/HeaderUser";
import { getAllPost } from "../Home.Api";
import {
  filterPostsApproved,
  filterPostsInCanTho,
  filterPostsInDaNang,
  filterPostsInHaNoi,
  filterPostsInHoChiMinh,
  filterPostsInQuyNhon,
} from "../../../utils/filter";
import { URL_IMAGE } from "../../../services/ApiUrl";
import { Box, Typography } from "@mui/material";
import { themeColors } from "../../../themes/schemes/PureLightThem";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { routes } from "../../../routes";
import { LoadingButton } from "@mui/lab";

const MomentListPage = () => {
  const frameWidth = 305;
  const margin = 23;
  const framesToShow = 1;

  const navigate = useNavigate();

  const galleryRefCanTho = useRef(null);
  const galleryRefHoChiMinh = useRef(null);
  const galleryRefDaNang = useRef(null);
  const galleryRefQuyNhon = useRef(null);
  const galleryRefHaNoi = useRef(null);

  const [dataPostHaNoi, setDataPostHaNoi] = useState([]);
  const [dataPostHoChiMinh, setDataPostHoChiMinh] = useState([]);
  const [dataPostDaNang, setDataPostDaNang] = useState([]);
  const [dataPostQuyNhon, setDataPostQuyNhon] = useState([]);
  const [dataPostCanTho, setDataPostCanTho] = useState([]);

  const [showScrollLeft, setShowScrollLeft] = useState(false);
  const [fetchData, setFetchData] = useState(false);

  const [showScrollLeftCanTho, setShowScrollLeftCanTho] = useState(false);
  const [showScrollRightCanTho, setShowScrollRightCanTho] = useState(false);

  const [showScrollLeftHoChiMinh, setShowScrollLeftHoChiMinh] = useState(false);
  const [showScrollRightHoChiMinh, setShowScrollRightHoChiMinh] =
    useState(false);

  const [showScrollLeftDaNang, setShowScrollLeftDaNang] = useState(false);
  const [showScrollRightDaNang, setShowScrollRightDaNang] = useState(false);

  const [showScrollLeftQuyNhon, setShowScrollLeftQuyNhon] = useState(false);
  const [showScrollRightQuyNhon, setShowScrollRightQuyNhon] = useState(false);

  const [showScrollLeftHaNoi, setShowScrollLeftHaNoi] = useState(false);
  const [showScrollRightHaNoi, setShowScrollRightHaNoi] = useState(false);

  const handleScrollCanTho = () => {
    const scrollLeft = galleryRefCanTho.current.scrollLeft;
    setShowScrollLeftCanTho(scrollLeft > 0);
  };

  const handleScrollHoChiMinh = () => {
    const scrollLeft = galleryRefHoChiMinh.current.scrollLeft;
    setShowScrollLeftHoChiMinh(scrollLeft > 0);
  };

  const handleScrollDaNang = () => {
    const scrollLeft = galleryRefDaNang.current.scrollLeft;
    setShowScrollLeftDaNang(scrollLeft > 0);
  };

  const handleScrollQuyNhon = () => {
    const scrollLeft = galleryRefQuyNhon.current.scrollLeft;
    setShowScrollLeftQuyNhon(scrollLeft > 0);
  };

  const handleScrollHaNoi = () => {
    const scrollLeft = galleryRefHaNoi.current.scrollLeft;
    setShowScrollLeftHaNoi(scrollLeft > 0);
  };

  const scrollLeft = (ref, setShowScrollRight) => {
    if (ref.current) {
      const scrollDistance = (frameWidth + margin) * framesToShow;
      const newPosition = Math.max(ref.current.scrollLeft - scrollDistance, 0);
      setShowScrollRight(newPosition > 0);
      ref.current.scrollTo({ left: newPosition, behavior: "smooth" });
      setShowScrollRight(false);
    }
  };

  const scrollRight = (ref, setShowScrollRight) => {
    if (ref.current) {
      setShowScrollLeft(true);
      const scrollDistance = (frameWidth + margin) * framesToShow;
      const maxScrollLeft = ref.current.scrollWidth - ref.current.clientWidth;
      const newPosition = Math.min(
        ref.current.scrollLeft + scrollDistance,
        maxScrollLeft
      );

      ref.current.scrollTo({ left: newPosition, behavior: "smooth" });
      setShowScrollRight(newPosition === maxScrollLeft);
    }
  };

  const init = async () => {
    const res = await getAllPost();

    if (res) {
      setDataPostHaNoi(filterPostsInHaNoi(filterPostsApproved(res)));
      setDataPostHoChiMinh(filterPostsInHoChiMinh(filterPostsApproved(res)));
      setDataPostDaNang(filterPostsInDaNang(filterPostsApproved(res)));
      setDataPostQuyNhon(filterPostsInQuyNhon(filterPostsApproved(res)));
      setDataPostCanTho(filterPostsInCanTho(filterPostsApproved(res)));
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setFetchData(true);
    }, 3000);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  useEffect(() => {
    secureLocalStorage.removeItem("location");
    secureLocalStorage.removeItem("blogId");
    secureLocalStorage.removeItem("blogLocation");
    secureLocalStorage.removeItem("blogTitle");
  }, []);

  return (
    <>
      <BoxContainer property="Post__container">
        {checkLogin() ? <HeaderUser /> : <HeaderGuest />}

        {dataPostCanTho?.length !== 0 ||
        dataPostHoChiMinh?.length !== 0 ||
        dataPostDaNang?.length !== 0 ||
        dataPostQuyNhon?.length !== 0 ||
        dataPostHaNoi?.length !== 0 ? (
          <>
            <div className="container_Post_All">
              <div className="Post_campus">
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    pb: "20px",
                  }}
                >
                  <h1>Posts About Popular Places In Can Tho</h1>
                  {dataPostCanTho?.length !== 0 && (
                    <Typography
                      onClick={() => {
                        secureLocalStorage.setItem("location", "Can Tho");
                        navigate(routes.home.filterMoment);
                        document.documentElement.scrollTop = 0;
                      }}
                      sx={{
                        fontSize: 18,
                        fontWeight: "normal",
                        color: themeColors.text_Link,
                        "&:hover": {
                          color: themeColors.primary_600,
                          textDecoration: "underline",
                          cursor: "pointer",
                        },
                      }}
                    >
                      See More &gt;
                    </Typography>
                  )}
                </Box>
                {dataPostCanTho?.length !== 0 ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {showScrollLeft && (
                      <button
                        onClick={() =>
                          scrollLeft(galleryRefCanTho, setShowScrollRightCanTho)
                        }
                        className="scroll-button-momentlist left-momentlist"
                        style={{
                          display: showScrollLeftCanTho ? "block" : "none",
                        }}
                      >
                        &lt;
                      </button>
                    )}
                    <div
                      className="gallery_post"
                      ref={galleryRefCanTho}
                      onScroll={handleScrollCanTho}
                    >
                      {dataPostCanTho?.slice(0, 7)?.map((moment) => (
                        <div
                          key={moment?.blogID}
                          className="Post_wrap"
                          onClick={() => {
                            secureLocalStorage.setItem(
                              "blogId",
                              moment?.blogID
                            );
                            secureLocalStorage.setItem(
                              "blogTitle",
                              moment?.title
                            );
                            secureLocalStorage.setItem(
                              "blogLocation",
                              moment?.location
                            );
                            navigate(routes.home.momentDetails);
                            document.documentElement.scrollTop = 0;
                          }}
                        >
                          <img
                            loading="lazy"
                            src={`${URL_IMAGE}${moment?.blogImages[0]?.image}`}
                            alt={moment?.title}
                          />
                          <div className="Post_colum">
                            <h1>{moment?.title}</h1>
                            <p className="comment">
                              {moment?.comments?.length <= 1
                                ? `${moment?.comments?.length} Comment`
                                : `${moment?.comments?.length} Comments`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() =>
                        scrollRight(galleryRefCanTho, setShowScrollRightCanTho)
                      }
                      className={`scroll-button-momentlist right-momentlist ${
                        showScrollRightCanTho ? "disabled" : ""
                      }`}
                      disabled={showScrollRightCanTho}
                    >
                      &gt;
                    </button>
                  </div>
                ) : (
                  <>
                    {fetchData ? (
                      <Box
                        width="100%"
                        p="20px 60px"
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
                          No posts found!
                        </Typography>
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
                  </>
                )}
              </div>
            </div>

            <div className="container_Post">
              <div className="Post_campus">
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    pb: "20px",
                  }}
                >
                  <h1>Posts About Popular Places In Ho Chi Minh</h1>
                  {dataPostHoChiMinh?.length !== 0 && (
                    <Typography
                      onClick={() => {
                        secureLocalStorage.setItem("location", "Ho Chi Minh");
                        navigate(routes.home.filterMoment);
                        document.documentElement.scrollTop = 0;
                      }}
                      sx={{
                        fontSize: 18,
                        fontWeight: "normal",
                        color: themeColors.text_Link,
                        "&:hover": {
                          color: themeColors.primary_600,
                          textDecoration: "underline",
                          cursor: "pointer",
                        },
                      }}
                    >
                      See More &gt;
                    </Typography>
                  )}
                </Box>
                {dataPostHoChiMinh?.length !== 0 ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {" "}
                    {showScrollLeft && (
                      <button
                        onClick={() =>
                          scrollLeft(
                            galleryRefHoChiMinh,
                            setShowScrollRightHoChiMinh
                          )
                        }
                        className="scroll-button-momentlist left-momentlist"
                        style={{
                          display: showScrollLeftHoChiMinh ? "block" : "none",
                        }}
                      >
                        &lt;
                      </button>
                    )}
                    <div
                      className="gallery_post"
                      ref={galleryRefHoChiMinh}
                      onScroll={handleScrollHoChiMinh}
                    >
                      {dataPostHoChiMinh?.slice(0, 7)?.map((moment) => (
                        <div
                          key={moment?.blogID}
                          className="Post_wrap"
                          onClick={() => {
                            secureLocalStorage.setItem(
                              "blogId",
                              moment?.blogID
                            );
                            secureLocalStorage.setItem(
                              "blogTitle",
                              moment?.title
                            );
                            secureLocalStorage.setItem(
                              "blogLocation",
                              moment?.location
                            );
                            navigate(routes.home.momentDetails);
                            document.documentElement.scrollTop = 0;
                          }}
                        >
                          <img
                            loading="lazy"
                            src={`${URL_IMAGE}${moment?.blogImages[0]?.image}`}
                            alt={moment?.title}
                          />
                          <div className="Post_colum">
                            <h1>{moment?.title}</h1>
                            <p className="comment">
                              {moment?.comments?.length <= 1
                                ? `${moment?.comments?.length} Comment`
                                : `${moment?.comments?.length} Comments`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() =>
                        scrollRight(
                          galleryRefHoChiMinh,
                          setShowScrollRightHoChiMinh
                        )
                      }
                      className={`scroll-button-momentlist right-momentlist ${
                        showScrollRightHoChiMinh ? "disabled" : ""
                      }`}
                      disabled={showScrollRightHoChiMinh}
                    >
                      &gt;
                    </button>
                  </div>
                ) : (
                  <>
                    {fetchData ? (
                      <Box
                        width="100%"
                        p="20px 60px"
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
                          No posts found!
                        </Typography>
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
                  </>
                )}
              </div>
            </div>

            <div className="container_Post">
              <div className="Post_campus">
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    pb: "20px",
                  }}
                >
                  <h1>Posts About Popular Places In Da Nang</h1>
                  {dataPostDaNang?.length !== 0 && (
                    <Typography
                      onClick={() => {
                        secureLocalStorage.setItem("location", "Da Nang");
                        navigate(routes.home.filterMoment);
                        document.documentElement.scrollTop = 0;
                      }}
                      sx={{
                        fontSize: 18,
                        fontWeight: "normal",
                        color: themeColors.text_Link,
                        "&:hover": {
                          color: themeColors.primary_600,
                          textDecoration: "underline",
                          cursor: "pointer",
                        },
                      }}
                    >
                      See More &gt;
                    </Typography>
                  )}
                </Box>
                {dataPostDaNang?.length !== 0 ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {showScrollLeft && (
                      <button
                        onClick={() =>
                          scrollLeft(galleryRefDaNang, setShowScrollRightDaNang)
                        }
                        className="scroll-button-momentlist left-momentlist"
                        style={{
                          display: showScrollLeftDaNang ? "block" : "none",
                        }}
                      >
                        &lt;
                      </button>
                    )}
                    <div
                      className="gallery_post"
                      ref={galleryRefDaNang}
                      onScroll={handleScrollDaNang}
                    >
                      {dataPostDaNang?.slice(0, 7)?.map((moment) => (
                        <div
                          key={moment?.blogID}
                          className="Post_wrap"
                          onClick={() => {
                            secureLocalStorage.setItem(
                              "blogId",
                              moment?.blogID
                            );
                            secureLocalStorage.setItem(
                              "blogTitle",
                              moment?.title
                            );
                            secureLocalStorage.setItem(
                              "blogLocation",
                              moment?.location
                            );
                            navigate(routes.home.momentDetails);
                            document.documentElement.scrollTop = 0;
                          }}
                        >
                          <img
                            loading="lazy"
                            src={`${URL_IMAGE}${moment?.blogImages[0]?.image}`}
                            alt={moment?.title}
                          />
                          <div className="Post_colum">
                            <h1>{moment?.title}</h1>
                            <p className="comment">
                              {moment?.comments?.length <= 1
                                ? `${moment?.comments?.length} Comment`
                                : `${moment?.comments?.length} Comments`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() =>
                        scrollRight(galleryRefDaNang, setShowScrollRightDaNang)
                      }
                      className={`scroll-button-momentlist right-momentlist ${
                        showScrollRightDaNang ? "disabled" : ""
                      }`}
                      disabled={showScrollRightDaNang}
                    >
                      &gt;
                    </button>
                  </div>
                ) : (
                  <>
                    {fetchData ? (
                      <Box
                        width="100%"
                        p="20px 60px"
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
                          No posts found!
                        </Typography>
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
                  </>
                )}
              </div>
            </div>

            <div className="container_Post">
              <div className="Post_campus">
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    pb: "20px",
                  }}
                >
                  <h1>Posts About Popular Places In Quy Nhon</h1>
                  {dataPostQuyNhon?.length !== 0 && (
                    <Typography
                      onClick={() => {
                        secureLocalStorage.setItem("location", "Quy Nhon");
                        navigate(routes.home.filterMoment);
                        document.documentElement.scrollTop = 0;
                      }}
                      sx={{
                        fontSize: 18,
                        fontWeight: "normal",
                        color: themeColors.text_Link,
                        "&:hover": {
                          color: themeColors.primary_600,
                          textDecoration: "underline",
                          cursor: "pointer",
                        },
                      }}
                    >
                      See More &gt;
                    </Typography>
                  )}
                </Box>
                {dataPostQuyNhon?.length !== 0 ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {" "}
                    {showScrollLeft && (
                      <button
                        onClick={() =>
                          scrollLeft(
                            galleryRefQuyNhon,
                            setShowScrollRightQuyNhon
                          )
                        }
                        className="scroll-button-momentlist left-momentlist"
                        style={{
                          display: showScrollLeftQuyNhon ? "block" : "none",
                        }}
                      >
                        &lt;
                      </button>
                    )}
                    <div
                      className="gallery_post"
                      ref={galleryRefQuyNhon}
                      onScroll={handleScrollQuyNhon}
                    >
                      {dataPostQuyNhon?.slice(0, 7)?.map((moment) => (
                        <div
                          key={moment?.blogID}
                          className="Post_wrap"
                          onClick={() => {
                            secureLocalStorage.setItem(
                              "blogId",
                              moment?.blogID
                            );
                            secureLocalStorage.setItem(
                              "blogTitle",
                              moment?.title
                            );
                            secureLocalStorage.setItem(
                              "blogLocation",
                              moment?.location
                            );
                            navigate(routes.home.momentDetails);
                            document.documentElement.scrollTop = 0;
                          }}
                        >
                          <img
                            loading="lazy"
                            src={`${URL_IMAGE}${moment?.blogImages[0]?.image}`}
                            alt={moment?.title}
                          />
                          <div className="Post_colum">
                            <h1>{moment?.title}</h1>
                            <p className="comment">
                              {moment?.comments?.length <= 1
                                ? `${moment?.comments?.length} Comment`
                                : `${moment?.comments?.length} Comments`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() =>
                        scrollRight(
                          galleryRefQuyNhon,
                          setShowScrollRightQuyNhon
                        )
                      }
                      className={`scroll-button-momentlist right-momentlist ${
                        showScrollRightQuyNhon ? "disabled" : ""
                      }`}
                      disabled={showScrollRightQuyNhon}
                    >
                      &gt;
                    </button>
                  </div>
                ) : (
                  <>
                    {fetchData ? (
                      <Box
                        width="100%"
                        p="20px 60px"
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
                          No posts found!
                        </Typography>
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
                  </>
                )}
              </div>
            </div>

            <div className="container_Post">
              <div className="Post_campus">
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    pb: "20px",
                  }}
                >
                  <h1>Posts About Popular Places In Ha Noi</h1>
                  {dataPostHaNoi?.length !== 0 && (
                    <Typography
                      onClick={() => {
                        secureLocalStorage.setItem("location", "Ha Noi");
                        navigate(routes.home.filterMoment);
                        document.documentElement.scrollTop = 0;
                      }}
                      sx={{
                        fontSize: 18,
                        fontWeight: "normal",
                        color: themeColors.text_Link,
                        "&:hover": {
                          color: themeColors.primary_600,
                          textDecoration: "underline",
                          cursor: "pointer",
                        },
                      }}
                    >
                      See More &gt;
                    </Typography>
                  )}
                </Box>
                {dataPostHaNoi?.length !== 0 ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {showScrollLeft && (
                      <button
                        onClick={() =>
                          scrollLeft(galleryRefHaNoi, setShowScrollRightHaNoi)
                        }
                        className="scroll-button-momentlist left-momentlist"
                        style={{
                          display: showScrollLeftHaNoi ? "block" : "none",
                        }}
                      >
                        &lt;
                      </button>
                    )}
                    <div
                      className="gallery_post"
                      ref={galleryRefHaNoi}
                      onScroll={handleScrollHaNoi}
                    >
                      {dataPostHaNoi?.slice(0, 7)?.map((moment) => (
                        <div
                          key={moment?.blogID}
                          className="Post_wrap"
                          onClick={() => {
                            secureLocalStorage.setItem(
                              "blogId",
                              moment?.blogID
                            );
                            secureLocalStorage.setItem(
                              "blogTitle",
                              moment?.title
                            );
                            secureLocalStorage.setItem(
                              "blogLocation",
                              moment?.location
                            );
                            navigate(routes.home.momentDetails);
                            document.documentElement.scrollTop = 0;
                          }}
                        >
                          <img
                            loading="lazy"
                            src={`${URL_IMAGE}${moment?.blogImages[0]?.image}`}
                            alt={moment?.title}
                          />
                          <div className="Post_colum">
                            <h1>{moment?.title}</h1>
                            <p className="comment">
                              {moment?.comments?.length <= 1
                                ? `${moment?.comments?.length} Comment`
                                : `${moment?.comments?.length} Comments`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() =>
                        scrollRight(galleryRefHaNoi, setShowScrollRightHaNoi)
                      }
                      className={`scroll-button-momentlist right-momentlist ${
                        showScrollRightHaNoi ? "disabled" : ""
                      }`}
                      disabled={showScrollRightHaNoi}
                    >
                      &gt;
                    </button>
                  </div>
                ) : (
                  <>
                    {fetchData ? (
                      <Box
                        width="100%"
                        p="20px 60px"
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
                          No posts found!
                        </Typography>
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
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            {fetchData ? (
              <Box
                width="100%"
                p="20px 60px"
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
                  No post found!
                </Typography>
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
          </>
        )}
        <FooterCustomer />
      </BoxContainer>
    </>
  );
};

export default MomentListPage;
