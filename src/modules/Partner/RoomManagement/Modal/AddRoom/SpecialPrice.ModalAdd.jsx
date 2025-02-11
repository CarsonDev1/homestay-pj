import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { themeColors } from "../../../../../themes/schemes/PureLightThem";
import { AddCircleOutline, Close } from "@mui/icons-material";
import AmenitiesModalAdd from "./Amenities.ModalAdd";
import ToastComponent from "../../../../../components/Toast/Toast.Component";
import { formatDate, formatPrice } from "../../../../../utils/helper";

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
  subLabel: {
    fontSize: 18,
    fontWeight: 700,
  },
};

const SpecialPriceForm = ({
  index,
  form,
  handleChange,
  removeForm,
  formatPrices,
}) => {
  // Get current date -> yyyy/MM/dd
  const today = new Date().toISOString().split("T")[0];

  // Calculate min date form startDate
  const getMinEndDate = (startDate) => {
    if (!startDate) return today;
    const start = new Date(startDate);
    const minEnd = new Date(start);
    minEnd.setDate(start.getDate() + 1);
    return minEnd.toISOString().split("T")[0];
  };

  return (
    <Box key={index} display="flex" flexDirection="column" gap="1rem">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography sx={styles.label}>Special Price {index + 1}</Typography>

        {index !== 0 && (
          <IconButton onClick={() => removeForm(index)}>
            <Close />
          </IconButton>
        )}
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap="2rem"
      >
        <Box flex={1} display="flex" flexDirection="column" gap="1rem">
          <Typography sx={styles.subLabel}>Start Date</Typography>
          <input
            type="date"
            name="startDate"
            style={styles.input}
            value={form.startDate}
            min={today}
            onChange={(e) => handleChange(index, e)}
          />
        </Box>

        <Box flex={1} display="flex" flexDirection="column" gap="1rem">
          <Typography sx={styles.subLabel}>End Date</Typography>
          <input
            type="date"
            name="endDate"
            style={styles.input}
            value={form.endDate}
            min={getMinEndDate(form.startDate)}
            onChange={(e) => handleChange(index, e)}
          />
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" gap="1rem">
        <Typography sx={styles.subLabel}>
          {form.startDate && form.endDate
            ? `Price from ${formatDate(form.startDate)} to ${formatDate(
                form.endDate
              )}`
            : `Price`}
        </Typography>
        <input
          type="text"
          name="price"
          placeholder="Please enter price form start date to end date"
          min={100000}
          max={9999999}
          value={formatPrices(form.price)}
          style={styles.input}
          onChange={(e) => handleChange(index, e)}
        />
      </Box>
    </Box>
  );
};

const SpecialPriceModalAdd = ({ children, data, handleInformationClose }) => {
  const [open, setOpen] = useState(false);
  const [forms, setForms] = useState([
    { startDate: "", endDate: "", price: "" },
  ]);

  const [showNextModal, setShowNextModal] = useState(false);

  const [errorMessageEmpty, setErrorMessageEmpty] = useState("");
  const [errorMessageDate, setErrorMessageDate] = useState("");
  const [errorMessagePrice, setErrorMessagePrice] = useState("");
  const [errorMessageDuplicate, setErrorMessageDuplicate] = useState("");
  const [errorMessageOverlapping, setErrorMessageOverlapping] = useState("");
  const [errorChildrenEmpty, setErrorChildrenEmpty] = useState("");
  const [errorChildrenDate, setErrorChildrenDate] = useState("");
  const [errorChildrenPrice, setErrorChildrenPrice] = useState("");
  const [errorChildrenDuplicate, setErrorChildrenDuplicate] = useState("");
  const [errorChildrenOverlapping, setErrorChildrenOverlapping] = useState("");

  const [displayEmpty, setDisplayEmpty] = useState(false);
  const [displayInvalidDate, setDisplayInvalidDate] = useState(false);
  const [displayInvalidPrice, setDisplayInvalidPrice] = useState(false);
  const [displayDuplicate, setDisplayDuplicate] = useState(false);
  const [displayOverlapping, setDisplayOverlapping] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    handleInformationClose();
  };

  const handleBack = () => {
    setOpen(false);
  };

  const addForm = () => {
    setForms([...forms, { startDate: "", endDate: "", price: "" }]);
  };

  const removeForm = (indexToRemove) => {
    setForms(forms.filter((_, index) => index !== indexToRemove));
  };

  const formatPrices = (number) => {
    return new Intl.NumberFormat("vi-VN").format(number);
  };

  const handleChange = (index, event) => {
    const { name, value } = event.target;
    let updatedValue = value;

    if (name === "price") {
      const numericValue = value.replace(/\D/g, "");
      updatedValue = numericValue;
    }

    const updatedForms = forms.map((form, i) =>
      i === index ? { ...form, [name]: updatedValue } : form
    );

    setForms(updatedForms);
    setShowNextModal(false);
  };

  const checkValid = () => {
    let errorForms = [];
    let priceErrorForms = [];
    let duplicateDateForms = [];
    let overlappingDateForms = [];
    let dateErrorForms = [];

    forms.forEach((form, i) => {
      if (form.startDate === "" || form.endDate === "" || form.price === "") {
        errorForms.push(i + 1);
      } else if (form.price < 100000 || form.price > 99999999) {
        priceErrorForms.push(i + 1);
      } else if (new Date(form.endDate) <= new Date(form.startDate)) {
        dateErrorForms.push(i + 1);
      }
    });

    const normalizeDate = (dateString) => {
      const date = new Date(dateString);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    for (let i = 0; i < forms.length; i++) {
      for (let j = i + 1; j < forms.length; j++) {
        const startDate1 = normalizeDate(forms[i].startDate);
        const endDate1 = normalizeDate(forms[i].endDate);
        const startDate2 = normalizeDate(forms[j].startDate);
        const endDate2 = normalizeDate(forms[j].endDate);

        if (startDate1 === startDate2 || endDate1 === endDate2) {
          duplicateDateForms.push(`${i + 1} and ${j + 1}`);
        }

        if (
          (startDate1 <= endDate2 && startDate1 >= startDate2) ||
          (startDate2 <= endDate1 && startDate2 >= startDate1)
        ) {
          overlappingDateForms.push(`${i + 1} and ${j + 1}`);
        }
      }
    }

    if (errorForms.length > 0) {
      setErrorMessageEmpty(`All fields are required at form Special Price:`);
      setErrorChildrenEmpty(errorForms);
      setDisplayEmpty(true);
      setShowNextModal(false);
    } else if (dateErrorForms.length > 0) {
      setErrorMessageDate(
        `End date must be greater than start date at form Special Price:`
      );
      setErrorChildrenDate(dateErrorForms);
      setDisplayInvalidDate(true);
      setShowNextModal(false);
    } else if (priceErrorForms.length > 0) {
      setErrorMessagePrice(
        `Price must be between ${formatPrice(100000)} and ${formatPrice(
          99999999
        )} at form Special Price:`
      );
      setErrorChildrenPrice(priceErrorForms);
      setDisplayInvalidPrice(true);
      setShowNextModal(false);
    } else if (duplicateDateForms.length > 0) {
      setErrorMessageDuplicate(`Duplicate start date at form Special Price:`);
      setErrorChildrenDuplicate(duplicateDateForms);
      setDisplayDuplicate(true);
      setShowNextModal(false);
      duplicateDateForms.pop();
    } else if (overlappingDateForms.length > 0) {
      setErrorMessageOverlapping(
        `Overlapping date ranges at form Special Price:`
      );
      setErrorChildrenOverlapping(overlappingDateForms);
      setDisplayOverlapping(true);
      setShowNextModal(false);
    } else {
      setShowNextModal(true);
    }
  };

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
    if (displayInvalidDate) {
      timeOut = setTimeout(() => {
        setDisplayInvalidDate(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayInvalidDate]);

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

  useEffect(() => {
    let timeOut;
    if (displayDuplicate) {
      timeOut = setTimeout(() => {
        setDisplayDuplicate(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayDuplicate]);

  useEffect(() => {
    let timeOut;
    if (displayOverlapping) {
      timeOut = setTimeout(() => {
        setDisplayOverlapping(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayOverlapping]);

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
        <ToastComponent
          open={displayEmpty}
          close={() => setDisplayEmpty(false)}
          title="Error"
          message={errorMessageEmpty}
          children={errorChildrenEmpty}
          type="error"
        />

        <ToastComponent
          open={displayInvalidDate}
          close={() => setDisplayInvalidDate(false)}
          title="Error"
          message={errorMessageDate}
          children={errorChildrenDate}
          type="error"
        />

        <ToastComponent
          open={displayInvalidPrice}
          close={() => setDisplayInvalidPrice(false)}
          title="Error"
          message={errorMessagePrice}
          children={errorChildrenPrice}
          type="error"
        />

        <ToastComponent
          open={displayDuplicate}
          close={() => setDisplayDuplicate(false)}
          title="Error"
          message={errorMessageDuplicate}
          children={errorChildrenDuplicate}
          type="error"
        />

        <ToastComponent
          open={displayOverlapping}
          close={() => setDisplayOverlapping(false)}
          title="Error"
          message={errorMessageOverlapping}
          children={errorChildrenOverlapping}
          type="error"
        />

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
            Add Room - Special Price
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Stack direction="column" gap="2rem">
            <Box display="flex" alignItems="center" justifyContent="flex-end">
              <Button
                onClick={addForm}
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
                startIcon={<AddCircleOutline />}
              >
                More
              </Button>
            </Box>

            {forms.map((form, index) => (
              <SpecialPriceForm
                key={index}
                index={index}
                form={form}
                handleChange={handleChange}
                removeForm={removeForm}
                formatPrices={formatPrices}
              />
            ))}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-around" }}>
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

          {showNextModal ? (
            <AmenitiesModalAdd
              data={{ basicInfor: data, specialPrice: forms }}
              handleInformationClose={handleInformationClose}
              handleSpecialPriceClose={handleClose}
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
            </AmenitiesModalAdd>
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

export default SpecialPriceModalAdd;
