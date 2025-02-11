import { Box, Divider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { themeColors } from "../../../../themes/schemes/PureLightThem";
import { AssetImages } from "../../../../utils/images";
import { getAllAmenities } from "../../../Partner/Partner.Api";
import secureLocalStorage from "react-secure-storage";
import { LoadingButton } from "@mui/lab";

const AmenitiesPage = () => {
  const [data, setData] = useState([]);

  const init = async () => {
    const res = await getAllAmenities(secureLocalStorage.getItem("hotelId"));

    if (res) {
      setData(res);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      {data?.length > 0 ? (
        <Box
          sx={{
            bgcolor: themeColors.white,
            p: "10px 20px 0",
            borderRadius: "8px",
            boxShadow: themeColors.boxShadow,
          }}
        >
          {data?.map((item, index) => (
            <Box
              display="flex"
              flexDirection="column"
              m={index === data?.length - 1 ? "0 0 2rem" : "0"}
              key={item?.serviceID}
            >
              <Box
                display="flex"
                flexDirection="column"
                gap="1.5rem"
                padding="5px 30px"
              >
                <Box display="flex" gap="1rem" alignItems="center">
                  <Typography
                    sx={{
                      fontSize: 24,
                      color: themeColors.title,
                      fontWeight: 700,
                    }}
                  >
                    {item?.type}
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  gap="2rem"
                  alignItems="center"
                  flexWrap="wrap"
                >
                  {item?.subServices?.map((items) => (
                    <Box
                      display="flex"
                      gap="1rem"
                      alignItems="center"
                      key={items?.subServiceID}
                    >
                      <img src={AssetImages.ICONS.CHECKED} alt="" />
                      <Typography
                        sx={{
                          width: "360px",
                          fontSize: 18,
                          fontWeight: "normal",
                          color: themeColors.black,
                        }}
                      >
                        {items?.subServiceName}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
              {index !== data?.length - 1 && (
                <Divider
                  orientation="horizontal"
                  sx={{
                    width: "100%",
                    height: "1px",
                    bgcolor: themeColors.gray,
                    m: "2rem 0",
                  }}
                />
              )}
            </Box>
          ))}
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

export default AmenitiesPage;
