import { AddPhotoAlternateOutlined, Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { themeColors } from "../../../../../themes/schemes/PureLightThem";
import SpecialPriceModalAdd from "./SpecialPrice.ModalAdd";
import ToastComponent from "../../../../../components/Toast/Toast.Component";
import { formatPrice } from "../../../../../utils/helper";

const valueTypeBed = ["King Size", "Queen Size", "Double", "Single"];

const styles = {
  label: {
    fontSize: 20,
    fontWeight: 700,
  },
  input: {
    borderRadius: "4px",
    padding: "8px 14px",
    border: `1px solid ${themeColors.gray}`,
    fontSize: 16,
  },
};

const InformationModalAdd = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [typeRoom, setTypeRoom] = useState("");
  const [numberCapacity, setNumberCapacity] = useState("");
  const [quantity, setQuantity] = useState("");
  const [sizeRoom, setSizeRoom] = useState("");
  const [numberBed, setNumberBed] = useState("");
  const [typeBed, setTypeBed] = useState("");
  const [price, setPrice] = useState("");

  const [showNextModal, setShowNextModal] = useState(false);

  const [displayEmpty, setDisplayEmpty] = useState(false);
  const [displayForce, setDisplayForce] = useState(false);
  const [displayInvalidNumberCapacity, setDisplayInvalidNumberCapacity] =
    useState(false);
  const [displayInvalidQuantity, setDisplayInvalidQuantity] = useState(false);
  const [displayInvalidSizeRoom, setDisplayInvalidSizeRoom] = useState(false);
  const [displayInvalidNumberBed, setDisplayInvalidNumberBed] = useState(false);
  const [displayInvalidPrice, setDisplayInvalidPrice] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files].slice(0, 5));
    setShowNextModal(false);
  };

  const handleRemoveImage = (indexToRemove) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleTypeChange = (e) => {
    setTypeRoom(e.target.value);
    setShowNextModal(false);
  };

  const handleNumberCapacityChange = (e) => {
    setNumberCapacity(e.target.value);
    setShowNextModal(false);
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
    setShowNextModal(false);
  };

  const handleSizeRoomChange = (e) => {
    setSizeRoom(e.target.value);
    setShowNextModal(false);
  };

  const handleNumberBedChange = (e) => {
    setNumberBed(e.target.value);
    setShowNextModal(false);
  };

  const handleTypeBedChange = (e) => {
    setTypeBed(e.target.value);
    setShowNextModal(false);
  };

  const formatPrices = (number) => {
    return new Intl.NumberFormat("vi-VN").format(number);
  };

  const handlePriceChange = (e) => {
    const inputValue = e.target.value;
    const rawValue = inputValue.replace(/\D/g, "");
    setPrice(rawValue);
    setShowNextModal(false);
  };

  const checkValid = () => {
    if (selectedFiles.length === 0) {
      setShowNextModal(false);
      setDisplayForce(true);
    } else if (
      typeRoom.trim() === "" ||
      numberCapacity === "" ||
      quantity === "" ||
      sizeRoom === "" ||
      numberBed === "" ||
      typeBed.trim() === "" ||
      price === ""
    ) {
      setShowNextModal(false);
      setDisplayEmpty(true);
    } else {
      if (numberCapacity < 1 || numberCapacity > 6) {
        setShowNextModal(false);
        setDisplayInvalidNumberCapacity(true);
      } else if (quantity < 1 || quantity > 400) {
        setShowNextModal(false);
        setDisplayInvalidQuantity(true);
      } else if (sizeRoom < 0) {
        setShowNextModal(false);
        setDisplayInvalidSizeRoom(true);
      } else if (numberBed < 1 || numberBed > 3) {
        setShowNextModal(false);
        setDisplayInvalidNumberBed(true);
      } else if (price < 100000 || price > 99999999) {
        setShowNextModal(false);
        setDisplayInvalidPrice(true);
      } else {
        setShowNextModal(true);
      }
    }
  };

  useEffect(() => {
    let timeOut;
    if (displayForce) {
      timeOut = setTimeout(() => {
        setDisplayForce(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayForce]);

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
    if (displayInvalidNumberCapacity) {
      timeOut = setTimeout(() => {
        setDisplayInvalidNumberCapacity(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayInvalidNumberCapacity]);

  useEffect(() => {
    let timeOut;
    if (displayInvalidQuantity) {
      timeOut = setTimeout(() => {
        setDisplayInvalidQuantity(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayInvalidQuantity]);

  useEffect(() => {
    let timeOut;
    if (displayInvalidSizeRoom) {
      timeOut = setTimeout(() => {
        setDisplayInvalidSizeRoom(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayInvalidSizeRoom]);

  useEffect(() => {
    let timeOut;
    if (displayInvalidNumberBed) {
      timeOut = setTimeout(() => {
        setDisplayInvalidNumberBed(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayInvalidNumberBed]);

  useEffect(() => {
    let timeOut;
    if (displayInvalidPrice) {
      timeOut = setTimeout(() => {
        setDisplayInvalidPrice(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayInvalidPrice]);

  return (
    <>
      {React.cloneElement(children, {
        onClick: handleOpen,
      })}
      <ToastComponent
        open={displayForce}
        close={() => setDisplayForce(false)}
        title="Error"
        message="Please upload at least one image!"
        type="error"
      />

      <ToastComponent
        open={displayEmpty}
        close={() => setDisplayEmpty(false)}
        title="Error"
        message="All field are required!"
        type="error"
      />

      <ToastComponent
        open={displayInvalidNumberCapacity}
        close={() => setDisplayInvalidNumberCapacity(false)}
        title="Error"
        message="Number capacity must be between 1 and 6!"
        type="error"
      />

      <ToastComponent
        open={displayInvalidQuantity}
        close={() => setDisplayInvalidQuantity(false)}
        title="Error"
        message="Quantity must be between 1 and 400!"
        type="error"
      />

      <ToastComponent
        open={displayInvalidSizeRoom}
        close={() => setDisplayInvalidSizeRoom(false)}
        title="Error"
        message="Size of room must be greater than 0!"
        type="error"
      />

      <ToastComponent
        open={displayInvalidNumberBed}
        close={() => setDisplayInvalidNumberBed(false)}
        title="Error"
        message="Number of beds must be between 1 and 3!"
        type="error"
      />

      <ToastComponent
        open={displayInvalidPrice}
        close={() => setDisplayInvalidPrice(false)}
        title="Error"
        message={`Price must be between ${formatPrice(
          100000
        )} and ${formatPrice(99999999)}!`}
        type="error"
      />

      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{ color: themeColors.title, fontSize: 24, fontWeight: 700 }}
          >
            Add Room - Basic Information
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Stack direction="column" gap="2rem">
            <Box display="flex" flexDirection="column" gap="1rem">
              <Typography sx={styles.label}>Room Images</Typography>
              <Box
                width="100%"
                display="flex"
                flexWrap="wrap"
                gap="1rem"
                alignItems="center"
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    borderRadius: "6px",
                    gap: "1rem",
                  }}
                >
                  {selectedFiles.map((file, index) => (
                    <Box
                      key={index}
                      position="relative"
                      sx={{
                        display: "inline-block",
                        width: "20%",
                        height: "140px",
                        borderRadius: "6px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        loading="lazy"
                        src={URL.createObjectURL(file)}
                        alt={`preview ${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />
                      <IconButton
                        sx={{
                          width: 26,
                          height: 26,
                          position: "absolute",
                          color: themeColors.white,
                          top: 5,
                          right: 5,
                        }}
                        onClick={() => handleRemoveImage(index)}
                      >
                        <Close />
                      </IconButton>
                    </Box>
                  ))}
                  {selectedFiles.length < 5 && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        width: "20%",
                        height: "140px",
                        border: `1px dashed ${themeColors.gray}`,
                        position: "relative",
                        cursor: "pointer",
                        borderRadius: "6px",
                      }}
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      }
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <AddPhotoAlternateOutlined
                          sx={{ width: 34, height: 34 }}
                        />
                        <input
                          type="file"
                          id="fileInput"
                          multiple
                          onChange={handleFileChange}
                          style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            opacity: 0,
                            display: "none",
                          }}
                        />
                      </Box>
                      <span
                        style={{
                          margin: "10px 0",
                          fontSize: "1rem",
                          color: themeColors.gray,
                        }}
                      >
                        {selectedFiles.length}/5 Pictures
                      </span>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap="2rem">
              <Box flex={2} display="flex" flexDirection="column" gap="1rem">
                <Typography sx={styles.label}>Type of Room</Typography>
                <input
                  type="text"
                  placeholder="Please enter type of room"
                  style={styles.input}
                  value={typeRoom}
                  onChange={handleTypeChange}
                />
              </Box>

              <Box flex={1} display="flex" flexDirection="column" gap="1rem">
                <Typography sx={styles.label}>Number Capacity</Typography>
                <input
                  type="number"
                  placeholder="Please enter number capacity"
                  min={1}
                  max={6}
                  style={styles.input}
                  value={numberCapacity}
                  onChange={handleNumberCapacityChange}
                />
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap="2rem">
              <Box
                width="calc(100% / 3)"
                display="flex"
                flexDirection="column"
                gap="1rem"
              >
                <Typography sx={styles.label}>Quantity</Typography>
                <input
                  type="number"
                  placeholder="How many room are there in this type ?"
                  min={1}
                  style={styles.input}
                  value={quantity}
                  onChange={handleQuantityChange}
                />
              </Box>

              <Box
                width="calc(100% / 3)"
                display="flex"
                flexDirection="column"
                gap="1rem"
              >
                <Typography sx={styles.label}>Size of Room</Typography>
                <input
                  type="number"
                  placeholder="Please enter size of room"
                  min={30}
                  style={styles.input}
                  value={sizeRoom}
                  onChange={handleSizeRoomChange}
                />
              </Box>

              <Box
                width="calc(100% / 3)"
                display="flex"
                flexDirection="column"
                gap="1rem"
              >
                <Typography sx={styles.label}>Number of Bed</Typography>
                <input
                  type="number"
                  placeholder="Please enter number of bed"
                  min={1}
                  max={3}
                  style={styles.input}
                  value={numberBed}
                  onChange={handleNumberBedChange}
                />
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap="2rem">
              <Box flex={1} display="flex" flexDirection="column" gap="1rem">
                <Typography sx={styles.label}>Type of Bed</Typography>
                <FormControl>
                  <Select
                    value={typeBed}
                    onChange={handleTypeBedChange}
                    displayEmpty
                    size="small"
                    sx={{ borderRadius: "4px", height: "36.8px" }}
                  >
                    <MenuItem value="">
                      <em style={{ color: "#B2B2B2" }}>
                        -- Choose type of bed --
                      </em>
                    </MenuItem>
                    {valueTypeBed?.map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box flex={2} display="flex" flexDirection="column" gap="1rem">
                <Typography sx={styles.label}>Price</Typography>
                <input
                  type="text"
                  placeholder="Please enter price for this type"
                  min={100000}
                  max={9999999}
                  style={styles.input}
                  value={formatPrices(price)}
                  onChange={handlePriceChange}
                />
              </Box>
            </Box>
          </Stack>
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

          {showNextModal ? (
            <SpecialPriceModalAdd
              data={{
                images: selectedFiles,
                typeRoom: typeRoom,
                numberCapacity: numberCapacity,
                quantity: quantity,
                sizeRoom: sizeRoom,
                numberBed: numberBed,
                typeBed: typeBed,
                price: price,
              }}
              handleInformationClose={handleClose}
            >
              <Button
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
                Next
              </Button>
            </SpecialPriceModalAdd>
          ) : (
            <Button
              onClick={checkValid}
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
              Next
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InformationModalAdd;
