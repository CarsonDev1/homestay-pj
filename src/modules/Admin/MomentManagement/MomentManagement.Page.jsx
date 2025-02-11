/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import "./MomentManagement.Style.scss";
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { themeColors } from "../../../themes/schemes/PureLightThem";
import { formatDate } from "../../../utils/helper";
import { useDispatch } from "react-redux";
import { getAllPost } from "../Admin.Api";
import { LoadingButton } from "@mui/lab";
import PostDetailsModal from "./Modal/PostDetails/PostDetails.Modal";

const statusValue = ["Awaiting Approval", "Approved", "Rejected"];
const styles = {
  titleTable: {
    color: themeColors.title,
    fontSize: 18,
    fontWeight: 700,
    p: "10px",
  },
  cellTable: {
    color: themeColors.black,
    fontSize: 16,
    p: "10px",
  },
};

const MomentManagementPage = () => {
  const dispatch = useDispatch();
  const onTopRef = useRef(null);

  const [status, setStatus] = useState("");
  const [data, setData] = useState([]);
  const [fetchData, setFetchData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPost = data?.filter(
    (post) => status === "" || post?.status === status
  );

  const postsPerPage = 8;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPost = filteredPost?.slice(indexOfFirstPost, indexOfLastPost);
  const totalPagePost = Math.ceil(filteredPost?.length / postsPerPage);

  const paginate = (event, value) => {
    event.preventDefault();
    setCurrentPage(value);
    if (onTopRef.current) {
      onTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setCurrentPage(1);
  };

  const init = async () => {
    const res = await getAllPost(dispatch);
    if (res) {
      setData(res);
    }
  };

  useEffect(() => {
    init();
  }, [data]);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setFetchData(true);
    }, 3000);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  return (
    <Box className="admin-moment__container" ref={onTopRef}>
      <Box className="admin-moment__content">
        <Box display="flex" flexDirection="column" gap="1rem">
          <Typography
            sx={{ color: themeColors.title, fontSize: 24, fontWeight: 700 }}
          >
            Travel Posts Management
          </Typography>
          <Typography
            sx={{ color: themeColors.title, fontSize: 20, fontWeight: 700 }}
          >
            {fetchData
              ? filteredPost?.length <= 1
                ? `Total Post: ${filteredPost?.length}`
                : `Total Posts: ${filteredPost?.length}`
              : `Total Post: 0`}
          </Typography>
        </Box>

        {fetchData ? (
          <>
            <Divider sx={{ bgcolor: themeColors.gray }} />

            <FormControl sx={{ maxWidth: "30%" }}>
              <Select
                value={status}
                onChange={handleStatusChange}
                displayEmpty
                size="small"
                sx={{ borderRadius: "4px" }}
              >
                <MenuItem value="">
                  <em style={{ color: "#B2B2B2" }}>
                    -- Choose status to filter --
                  </em>
                </MenuItem>
                {statusValue?.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={styles.titleTable}>
                        Poster's Name
                      </TableCell>
                      <TableCell sx={styles.titleTable}>
                        Poster's Email
                      </TableCell>
                      <TableCell sx={styles.titleTable}>Publish Date</TableCell>
                      <TableCell sx={styles.titleTable}>Post Title</TableCell>
                      <TableCell sx={styles.titleTable} align="center">
                        Posting Address
                      </TableCell>
                      <TableCell sx={styles.titleTable} align="center">
                        Status
                      </TableCell>
                      <TableCell sx={styles.titleTable} align="center">
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentPost?.map((post) => (
                      <TableRow
                        key={post?.blogID}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell sx={styles.cellTable} width="15%">
                          {post?.account?.fullName}
                        </TableCell>
                        <TableCell sx={styles.cellTable}>
                          {post?.account?.email}
                        </TableCell>
                        <TableCell sx={styles.cellTable}>
                          {formatDate(post?.publishDate)}
                        </TableCell>
                        <TableCell sx={styles.cellTable}>
                          <Typography
                            sx={{
                              width: "95%",
                              fontSize: 16,
                              display: "-webkit-box",
                              overflow: "hidden",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                              transition: "-webkit-line-clamp 0.1s",
                            }}
                          >
                            {post?.title}
                          </Typography>
                        </TableCell>
                        <TableCell sx={styles.cellTable} align="center">
                          {post?.location}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color:
                              post?.status === "Approved"
                                ? themeColors.status_Primary
                                : post.status === "Rejected"
                                ? themeColors.button_Secondary
                                : themeColors.status_Secondary,
                            fontWeight: 700,
                            fontSize: 16,
                            p: "10px",
                          }}
                        >
                          {post?.status}
                        </TableCell>
                        <TableCell sx={styles.cellTable} align="center">
                          <PostDetailsModal
                            data={{
                              id: post?.blogID,
                              title: post?.title,
                              images: post?.blogImages,
                              posterName: post?.account?.fullName,
                              posterEmail: post?.account?.email,
                              address: post?.location,
                              desc: post?.description,
                              status: post?.status,
                            }}
                          >
                            <Button
                              sx={{
                                bgcolor: themeColors.primary_Default,
                                color: themeColors.white,
                                textTransform: "none",
                                fontSize: 16,
                                borderRadius: "10px",
                                p: "6px 20px",
                                "&:hover": {
                                  bgcolor: themeColors.primary_600,
                                },
                              }}
                            >
                              View
                            </Button>
                          </PostDetailsModal>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {filteredPost?.length > 0 && (
                <Grid item xs={6} sx={{ alignItems: "center" }}>
                  <label>
                    <b>
                      Showing {currentPage} of {totalPagePost}{" "}
                      {totalPagePost > 1 ? "pages" : "page"}
                    </b>
                  </label>
                </Grid>
              )}
              <Stack sx={{ alignItems: "center" }}>
                {filteredPost?.length > 0 && (
                  <Pagination
                    color="standard"
                    variant="outlined"
                    defaultPage={1}
                    count={totalPagePost}
                    page={currentPage}
                    onChange={paginate}
                    size="medium"
                    showFirstButton
                    showLastButton
                  />
                )}
              </Stack>

              {filteredPost?.length === 0 && (
                <Box
                  width="100%"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  p="5px 0"
                >
                  <Typography
                    sx={{
                      fontSize: 18,
                      fontWeight: 400,
                    }}
                  >
                    No post found!
                  </Typography>
                </Box>
              )}
            </Box>
          </>
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
      </Box>
    </Box>
  );
};

export default MomentManagementPage;
