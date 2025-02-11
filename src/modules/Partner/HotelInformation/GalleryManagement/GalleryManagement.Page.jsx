/* eslint-disable react-hooks/exhaustive-deps */
import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Pagination,
  Paper,
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
import React, { useEffect, useRef, useState } from "react";
import { themeColors } from "../../../../themes/schemes/PureLightThem";
import DeleteImageModal from "../Modal/Gallery/DeleteImage/DeleteImage.Modal";
import AddImageModal from "../Modal/Gallery/AddImage/AddImage.Modal";
import { getAllGallery } from "../../Partner.Api";
import secureLocalStorage from "react-secure-storage";
import { LoadingButton } from "@mui/lab";
import { URL_IMAGE } from "../../../../services/ApiUrl";

const titleFilter = ["Hotel View", "Rooms", "Spa", "Dining", "Weddings"];

const stylesTitleTable = {
  color: themeColors.title,
  fontSize: 18,
  fontWeight: 700,
  p: "20px",
};

const GalleryManagementPage = () => {
  const onTopRef = useRef(null);

  const [data, setData] = useState([]);
  const [fetchData, setFetchData] = useState(false);

  const [title, setTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredImages = data?.filter(
    (image) => title === "" || image?.title === title
  );

  const imagesPerPage = 4;
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImage = filteredImages?.slice(
    indexOfFirstImage,
    indexOfLastImage
  );
  const totalPageImage = Math.ceil(filteredImages?.length / imagesPerPage);

  const handleFilterGallery = (e) => {
    setTitle(e.target.value);
    setCurrentPage(1);
  };

  const paginate = (event, value) => {
    event.preventDefault();
    setCurrentPage(value);
    if (onTopRef.current) {
      onTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const init = async () => {
    const res = await getAllGallery(secureLocalStorage.getItem("hotelId"));

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
    }, 5000);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  return (
    <Box display="flex" flexDirection="column" gap="2rem" ref={onTopRef}>
      <Typography
        sx={{ color: themeColors.title, fontSize: 24, fontWeight: 700 }}
      >
        Gallery Management
      </Typography>

      <Divider sx={{ bgcolor: themeColors.gray }} />

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          sx={{ color: themeColors.title, fontSize: 18, fontWeight: 700 }}
        >
          {filteredImages?.length <= 1
            ? `${filteredImages?.length} Image`
            : `${filteredImages?.length} Images`}
        </Typography>

        <FormControl sx={{ minWidth: "30%" }}>
          <Select
            value={title}
            onChange={handleFilterGallery}
            displayEmpty
            size="small"
            sx={{ borderRadius: "8px" }}
          >
            <MenuItem value="">
              <em style={{ color: "#B2B2B2" }}>-- Choose title to filter --</em>
            </MenuItem>
            {titleFilter?.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <AddImageModal>
          <Button
            sx={{
              bgcolor: themeColors.primary_Default,
              color: themeColors.white,
              textTransform: "none",
              fontSize: 16,
              fontWeight: 700,
              borderRadius: "10px",
              p: "6px 20px",
              "&:hover": {
                bgcolor: themeColors.primary_600,
              },
            }}
          >
            Add Image
          </Button>
        </AddImageModal>
      </Box>

      <Box>
        <TableContainer
          component={Paper}
          sx={{
            width: "auto",
            boxShadow: "none",
            border: "none",
            borderRadius: 0,
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background: themeColors.white,
                }}
              >
                <TableCell sx={stylesTitleTable}>Image</TableCell>
                <TableCell sx={stylesTitleTable}>Title</TableCell>
                <TableCell align="center" sx={stylesTitleTable}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentImage?.map((image) => (
                <TableRow
                  key={image?.imageID}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell sx={{ p: "20px" }}>
                    <Avatar
                      src={`${URL_IMAGE}${image?.image}`}
                      alt=""
                      sx={{
                        width: "380px",
                        height: "230px",
                        borderRadius: "8px",
                        boxShadow: themeColors.boxShadow,
                        transition: "all .2s linear",
                        "&:hover": {
                          transform: "scale(1.1)",
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{ color: themeColors.black, fontSize: 16, p: "20px" }}
                  >
                    {image?.title}
                  </TableCell>
                  <TableCell align="center" sx={{ p: "20px" }}>
                    <DeleteImageModal
                      data={{
                        id: image?.imageID,
                        img: image?.image,
                        title: image?.title,
                      }}
                    >
                      <Button
                        sx={{
                          bgcolor: themeColors.button_Secondary,
                          color: themeColors.white,
                          textTransform: "none",
                          fontSize: 16,
                          fontWeight: 700,
                          borderRadius: "10px",
                          p: "6px 20px",
                          "&:hover": {
                            bgcolor: themeColors.button_SecondaryHover,
                          },
                        }}
                      >
                        Delete
                      </Button>
                    </DeleteImageModal>
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
          mt: "20px",
        }}
      >
        {filteredImages?.length > 0 && (
          <Grid item xs={6} sx={{ alignItems: "center" }}>
            <label>
              <b>
                Showing {currentPage} of {totalPageImage}{" "}
                {totalPageImage > 1 ? "pages" : "page"}
              </b>
            </label>
          </Grid>
        )}
        <Stack sx={{ alignItems: "center" }}>
          {filteredImages?.length > 0 && (
            <Pagination
              color="standard"
              variant="outlined"
              defaultPage={1}
              count={totalPageImage}
              page={currentPage}
              onChange={paginate}
              size="medium"
              showFirstButton
              showLastButton
            />
          )}
        </Stack>

        {filteredImages?.length === 0 && (
          <Box
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            p="5px 0"
          >
            {!fetchData ? (
              <>
                <LoadingButton
                  loading
                  variant="outlined"
                  sx={{ border: "0 !important" }}
                />
                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: 400,
                  }}
                >
                  Fetching data...
                </Typography>
              </>
            ) : (
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 400,
                }}
              >
                No images found!
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default GalleryManagementPage;
