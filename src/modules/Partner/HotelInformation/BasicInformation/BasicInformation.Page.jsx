import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { themeColors } from "../../../../themes/schemes/PureLightThem";
import { formatDesc } from "../../../../utils/helper";
import UpdateInformationModal from "../Modal/UpdateInformation/UpdateInformation.Modal";
import { getBasicInformation } from "../../Partner.Api";
import secureLocalStorage from "react-secure-storage";
import { URL_IMAGE } from "../../../../services/ApiUrl";

const styles = {
  box: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  label: {
    color: themeColors.title,
    fontSize: 20,
    fontWeight: 700,
  },
  data: {
    p: "10px 15px",
    bgcolor: themeColors.bg_Disabled,
    color: themeColors.text_Link,
    fontSize: 16,
    border: `1px solid ${themeColors.gray}`,
    borderRadius: "8px",
  },
};

const BasicInformationPage = () => {
  const [data, setData] = useState({});

  const init = async () => {
    const res = await getBasicInformation(
      secureLocalStorage.getItem("hotelId")
    );

    if (res) {
      setData(res);
    }
  };

  useEffect(() => {
    init();
  }, [data]);

  return (
    <Box display="flex" flexDirection="column" gap="2rem">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          sx={{ color: themeColors.title, fontSize: 24, fontWeight: 700 }}
        >
          Information
        </Typography>

        <UpdateInformationModal
          data={{
            img: data?.mainImage,
            name: data?.name,
            opened: data?.openedIn,
            desc: data?.description,
          }}
        >
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
            Edit
          </Button>
        </UpdateInformationModal>
      </Box>

      <Box sx={styles.box}>
        <Typography sx={styles.label}>Main Image</Typography>
        <img
          loading="lazy"
          src={`${URL_IMAGE}${data?.mainImage}`}
          alt=""
          style={{
            width: "100%",
            borderRadius: "8px",
            boxShadow: themeColors.boxShadow,
          }}
        />
      </Box>

      <Box display="flex" alignItems="center" gap="3rem">
        <Box flex={1} sx={styles.box}>
          <Typography sx={styles.label}>Hotel Name</Typography>
          <Box sx={styles.data}>{data?.name ? data?.name : "-"}</Box>
        </Box>

        <Box flex={0.5} sx={styles.box}>
          <Typography sx={styles.label}>Opened In</Typography>
          <Box sx={styles.data}>{data?.openedIn ? data?.openedIn : "-"}</Box>
        </Box>
      </Box>

      <Box sx={styles.box}>
        <Typography sx={styles.label}>Description</Typography>
        <Box sx={styles.data}>
          {formatDesc(data?.description ? data?.description : "-")}
        </Box>
      </Box>
    </Box>
  );
};

export default BasicInformationPage;
