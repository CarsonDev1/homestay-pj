/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { themeColors } from "../../../../../themes/schemes/PureLightThem";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import RejectPostModal from "../RejectPost/RejectPost.Modal";
import { URL_IMAGE } from "../../../../../services/ApiUrl";
import { approvePost } from "../../../Admin.Api";
import { Bounce, toast } from "react-toastify";
import { formatDesc } from "../../../../../utils/helper";

const styles = {
  label: {
    fontSize: 20,
    fontWeight: 700,
  },
  data: {
    p: "8px 14px",
    bgcolor: "transparent",
    color: themeColors.black,
    fontSize: 16,
    border: `1px solid ${themeColors.gray}`,
    borderRadius: "6px",
    textAlign: "justify",
  },
  subLabel: {
    fontSize: 18,
    fontWeight: 700,
  },
};

const PostDetailsModal = ({ children, data }) => {
  const id = data?.id;
  const postStatus = data?.status;

  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(data?.images[0]?.image);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeImage = (img) => {
    setImage(img);
  };

  const handleApprovePost = async () => {
    const res = await approvePost(id);
    if (res.status === 200) {
      toast.success("Approve post success!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        pauseOnFocusLoss: false,
      });
      handleClose();
    } else {
      toast.error("Approve post error!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        pauseOnFocusLoss: false,
      });
    }
  };

  useEffect(() => {}, [data, handleApprovePost]);

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
        maxWidth="md"
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
            Post Details
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap="2rem">
            {image && (
              <Box display="flex" flexDirection="column" gap="1rem">
                <>
                  <Typography sx={styles.label}>Images</Typography>
                  <img
                    loading="lazy"
                    src={`${URL_IMAGE}${image}`}
                    alt=""
                    style={{
                      width: "100%",
                      minHeight: "450px",
                      maxHeight: "450px",
                      borderRadius: "8px",
                      objectFit: "cover",
                    }}
                  />

                  {data?.images?.length > 1 && (
                    <Box display="flex" gap="1rem" width="100%">
                      {data?.images?.map((img) => (
                        <Box
                          key={img?.imageID}
                          width="20%"
                          height="100px"
                          onClick={() => handleChangeImage(img?.image)}
                          sx={{
                            borderRadius: "8px",
                            transition: "all .2s linear",
                            "&:hover": {
                              cursor: "pointer",
                              boxShadow: themeColors.boxShadow,
                              transform: "scale(1.1)",
                            },
                          }}
                        >
                          <img
                            loading="lazy"
                            src={`${URL_IMAGE}${img?.image}`}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: "8px",
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  )}
                </>
              </Box>
            )}

            <Box display="flex" alignItems="center" gap="2rem">
              <Box flex={1} display="flex" flexDirection="column" gap="1rem">
                <Typography>Poster's Name</Typography>
                <Box sx={styles.data}>{data?.posterName}</Box>
              </Box>

              <Box flex={0.7} display="flex" flexDirection="column" gap="1rem">
                <Typography>Poster's Email</Typography>
                <Box sx={styles.data}>{data?.posterEmail}</Box>
              </Box>
            </Box>

            <Box display="flex" flexDirection="column" gap="1rem">
              <Typography>Post Title</Typography>
              <Box sx={styles.data}>{data?.title}</Box>
            </Box>

            <Box display="flex" flexDirection="column" gap="1rem">
              <Typography>Posting Address</Typography>
              <Box sx={styles.data}>{data?.address}</Box>
            </Box>

            <Box display="flex" flexDirection="column" gap="1rem">
              <Typography>Post Description</Typography>
              <Box sx={styles.data}>{formatDesc(data?.desc)}</Box>
            </Box>
          </Box>
        </DialogContent>

        {postStatus === "Awaiting Approval" ? (
          <DialogActions sx={{ justifyContent: "space-around" }}>
            <RejectPostModal
              data={{
                id: id,
              }}
              handleCloseParnentModal={handleClose}
            >
              <Button
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
                Reject
              </Button>
            </RejectPostModal>

            <Button
              onClick={handleApprovePost}
              sx={{
                bgcolor: themeColors.primary_Default,
                color: themeColors.white,
                p: "5px 40px",
                borderRadius: "8px",
                textTransform: "none",
                fontSize: 16,
                "&:hover": {
                  bgcolor: themeColors.primary_600,
                },
              }}
            >
              Approve
            </Button>
          </DialogActions>
        ) : (
          <DialogActions sx={{ justifyContent: "flex-end" }}>
            <Button
              onClick={handleClose}
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
              Close
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};

export default PostDetailsModal;
