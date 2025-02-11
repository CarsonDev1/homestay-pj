import { AddPhotoAlternateOutlined, Close, Loop } from "@mui/icons-material";
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
import React, { useRef, useState } from "react";
import { themeColors } from "../../../../../themes/schemes/PureLightThem";
import { addVoucher } from "../../../Admin.Api";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const styles = {
  label: {
    fontSize: 18,
    fontWeight: 700,
  },
  input: {
    fontSize: 16,
    padding: "8.5px 14px",
    borderRadius: "4px",
    border: "1px solid rgba(0, 0, 0, .2)",
  },
};

const AddVoucherModal = ({ children }) => {
  const fileInputRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [image, setImage] = useState("");
  const [images, setImages] = useState(null);
  const [nameVoucher, setNameVoucher] = useState("");
  const [codeVoucher, setCodeVoucher] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [description, setDescription] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUploadImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setImages(file);

      const reader = new FileReader();

      reader.onloadend = () => {
        setImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const generateCodeVoucher = () => {
    const char =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += char.charAt(Math.floor(Math.random() * char.length));
    }
    setCodeVoucher(result);
  };

  const handleSubmit = async () => {
    if (
      images === null ||
      nameVoucher === "" ||
      codeVoucher === "" ||
      quantity === "" ||
      discount === "" ||
      description === ""
    ) {
      toast.error("All field are required!", {
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
    } else {
      if (quantity <= 0 || quantity > 1001) {
        toast.error("Quantity must be greater than 0 and less than 1000!", {
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
      } else if (discount < 1 || discount > 21) {
        toast.error("Discount must be between 1 and 20%", {
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
      } else if (nameVoucher.length < 1 || nameVoucher.length > 501) {
        toast.error("Name of voucher must be between 1 and 500 characters!", {
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
      } else if (description.length < 1 || description.length > 501) {
        toast.error("Description must be between 1 and 500 characters!", {
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
      } else {
        const res = await addVoucher(
          images,
          nameVoucher,
          codeVoucher,
          quantity,
          discount,
          description
        );
        if (res) {
          toast.success("Add voucher successfully!", {
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
          toast.error("Add voucher fail!", {
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
        }
      }
    }
  };

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
            Add Voucher
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap="2rem">
            <Box display="flex" flexDirection="column" gap="1rem">
              <Typography sx={styles.label}>Image Voucher</Typography>
              <Box
                onClick={handleUploadImage}
                sx={{
                  width: "100%",
                  height: "auto",
                  border: "1px dashed #bbbbbf",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "5px",
                  p: "5px",
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
              >
                {image ? (
                  <img
                    loading="lazy"
                    src={image}
                    alt="Uploaded"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "8px",
                      boxShadow: themeColors.boxShadow,
                    }}
                  />
                ) : (
                  <>
                    <AddPhotoAlternateOutlined />
                    <Typography sx={{ fontSize: "16px" }}>Add Image</Typography>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleFileInputChange}
                />
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap="2rem">
              <Box flex={2} display="flex" flexDirection="column" gap="1rem">
                <Typography sx={styles.label}>Name Voucher</Typography>
                <input
                  type="text"
                  style={styles.input}
                  placeholder="Please enter name voucher"
                  value={nameVoucher}
                  onChange={(e) => setNameVoucher(e.target.value)}
                />
              </Box>

              <Box flex={1} display="flex" flexDirection="column" gap="1rem">
                <Typography sx={styles.label}>Voucher Code</Typography>
                <Box display="flex" alignItems="center">
                  <input
                    type="text"
                    style={{
                      minHeight: 40,
                      fontSize: 16,
                      padding: "8.5px 14px",
                      borderRadius: "4px 0 0 4px",
                      border: "1px solid rgba(0, 0, 0, .2)",
                    }}
                    readOnly
                    value={codeVoucher}
                  />
                  <IconButton
                    onClick={generateCodeVoucher}
                    sx={{
                      bgcolor: themeColors.primary_Default,
                      borderRadius: "0 4px 4px 0",
                      color: themeColors.white,
                      "&:hover": {
                        bgcolor: themeColors.primary_600,
                      },
                    }}
                  >
                    <Loop />
                  </IconButton>
                </Box>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap="1rem">
              <Typography flex={0.3} sx={styles.label}>
                Quantity
              </Typography>
              <input
                type="number"
                style={{
                  fontSize: 16,
                  padding: "8.5px 14px",
                  borderRadius: "4px",
                  border: "1px solid rgba(0, 0, 0, .2)",
                  flex: 2,
                }}
                placeholder="Please enter quantity can use voucher"
                min={1}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </Box>

            <Box display="flex" alignItems="center" gap="1rem">
              <Typography flex={0.3} sx={styles.label}>
                Discount
              </Typography>
              <input
                type="number"
                style={{
                  fontSize: 16,
                  padding: "8.5px 14px",
                  borderRadius: "4px",
                  border: "1px solid rgba(0, 0, 0, .2)",
                  flex: 2,
                }}
                placeholder="Please enter how much discount this voucher has"
                min={1}
                max={100}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </Box>

            <Box display="flex" flexDirection="column" gap="1rem">
              <Typography sx={styles.label}>Description</Typography>
              <textarea
                style={{
                  fontSize: 16,
                  padding: "8.5px 14px",
                  borderRadius: "4px",
                  border: "1px solid rgba(0, 0, 0, .2)",
                  resize: "none",
                }}
                rows={8}
                placeholder="Please enter condition to use and another description for this voucher"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-around" }}>
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
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
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
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddVoucherModal;
