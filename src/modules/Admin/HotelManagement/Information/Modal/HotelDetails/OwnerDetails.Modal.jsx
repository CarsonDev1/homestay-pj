import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { themeColors } from "../../../../../../themes/schemes/PureLightThem";
import { Close } from "@mui/icons-material";
import { formatPhoneNumber } from "../../../../../../utils/helper";
import { URL_IMAGE } from "../../../../../../services/ApiUrl";
import { AssetImages } from "../../../../../../utils/images";

const styles = {
  label: {
    fontSize: 18,
    fontWeight: 700,
  },
  data: {
    p: "8px 14px",
    bgcolor: themeColors.bg_Disabled,
    color: themeColors.text_Link,
    fontSize: 16,
    borderRadius: "6px",
  },
};

const OwnerDetailsModal = ({
  children,
  data,
  handleInforClose,
  handleAmenitiesClose,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    handleInforClose();
    handleAmenitiesClose();
    setOpen(false);
  };

  const handleBack = () => {
    setOpen(false);
  };

  useEffect(() => {}, [data]);

  return (
    <>
      {React.cloneElement(children, {
        onClick: handleOpen,
      })}
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{ fontSize: 24, fontWeight: 700, color: themeColors.title }}
          >
            Owner Information Details
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box display="flex" alignItems="flex-start" gap="2rem">
            <Box flex={1} display="flex" flexDirection="column" gap="1rem">
              <Typography sx={styles.label}>Owner Avatar</Typography>
              {data?.owner?.profile?.avatar ? (
                data?.owner?.profile?.avatar?.startsWith("/", 0) ? (
                  <Avatar
                    src={`${URL_IMAGE}${data?.owner?.profile?.avatar}`}
                    sx={{ width: 200, height: 200 }}
                  />
                ) : (
                  <Avatar
                    src={`${data?.owner?.profile?.avatar}`}
                    sx={{ width: 200, height: 200 }}
                  />
                )
              ) : (
                <Avatar
                  src={`${AssetImages.LOGO}`}
                  sx={{ width: 200, height: 200 }}
                />
              )}
            </Box>

            <Box flex={1.5} display="flex" flexDirection="column" gap="1rem">
              <Box display="flex" flexDirection="column" gap="1rem">
                <Typography sx={styles.label}>Owner Name</Typography>
                <Box sx={styles.data}>{data?.owner?.profile?.fullName}</Box>
              </Box>

              <Box display="flex" flexDirection="column" gap="1rem">
                <Typography sx={styles.label}>Owner Email</Typography>
                <Box sx={styles.data}>{data?.owner?.email}</Box>
              </Box>

              <Box display="flex" flexDirection="column" gap="1rem">
                <Typography sx={styles.label}>Owner Phone</Typography>
                <Box sx={styles.data}>
                  {formatPhoneNumber(data?.owner?.phone)}
                </Box>
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={handleBack}
            sx={{
              bgcolor: "transparent",
              color: themeColors.primary_600,
              p: "5px 40px",
              border: `1px solid ${themeColors.primary_600}`,
              borderRadius: "8px",
              textTransform: "none",
              fontSize: 16,
              "&:hover": {
                bgcolor: themeColors.bgTitle,
              },
            }}
          >
            Back
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OwnerDetailsModal;
