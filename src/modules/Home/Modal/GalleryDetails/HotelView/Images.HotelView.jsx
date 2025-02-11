import React, { useEffect, useState } from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { themeColors } from "../../../../../themes/schemes/PureLightThem";
import { filterImageHotelView } from "../../../../../utils/filter";
import { URL_IMAGE } from "../../../../../services/ApiUrl";
import { LoadingButton } from "@mui/lab";

const ImagesHotelView = ({ data }) => {
  const [fetchData, setFetchData] = useState(false);

  const listImages = filterImageHotelView(data?.listImages);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setFetchData(true);
    }, 3000);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);
  return (
    <>
      {fetchData ? (
        <Box display="flex" flexWrap="wrap" gap="1rem">
          {listImages?.length !== 0 ? (
            listImages?.map((image) => (
              <Box
                key={image?.imageID}
                sx={{
                  width: "49%",
                  minHeight: "250px",
                  maxHeight: "250px",
                }}
              >
                <Avatar
                  src={`${URL_IMAGE}${image?.image}`}
                  alt=""
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "6px",
                    boxShadow: themeColors.boxShadow,
                    "&:hover": {
                      boxShadow: themeColors.boxShadowHover,
                    },
                  }}
                />
              </Box>
            ))
          ) : (
            <Box m="auto">
              <Typography sx={{ fontSize: 17 }}>No images</Typography>
            </Box>
          )}
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
  );
};

export default ImagesHotelView;
