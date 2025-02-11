import React, { useEffect, useState } from "react";
import BoxContainer from "../../../../components/Box/Box.Container";
import HeaderUser from "../../../../layouts/Header/User/HeaderUser";
import FooterCustomer from "../../../../layouts/Footer/Customer/FooterCustomer";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import "./CreateMoment.Style.scss";
import { AssetImages } from "../../../../utils/images";
import { themeColors } from "../../../../themes/schemes/PureLightThem";
import secureLocalStorage from "react-secure-storage";
import { createPost } from "../../Home.Api";
import { useNavigate } from "react-router-dom";
import ToastComponent from "../../../../components/Toast/Toast.Component";
import { routes } from "../../../../routes";

const valueLocation = [
  "Ha Noi",
  "Da Nang",
  "Quy Nhon",
  "Ho Chi Minh",
  "Can Tho",
];

const CreateMomentPage = () => {
  const navigate = useNavigate();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [location, setLocation] = useState("");
  const [checkAccept, setCheckAccept] = useState(false);

  const [displayEmptyFile, setDisplayEmptyFile] = useState(false);
  const [displayEmpty, setDisplayEmpty] = useState(false);
  const [displayTitleMaxLength, setDisplayTitleMaxLength] = useState(false);
  const [displayServerError, setDisplayServerError] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files].slice(0, 5));
  };

  const handleRemoveImage = (indexToRemove) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleCheckAcceptChange = (e) => {
    setCheckAccept(e.target.checked);
  };

  const handleBack = () => {
    switch (secureLocalStorage.getItem("path")) {
      case "filter":
        navigate(routes.home.filterMoment);
        break;
      case "my-account":
        navigate(routes.home.myAccount);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async () => {
    setCheckAccept(!checkAccept);
    if (selectedFiles.length === 0) {
      setDisplayEmptyFile(true);
    } else {
      if (title.trim() === "" || text.trim() === "" || location.trim() === "") {
        setDisplayEmpty(true);
      } else {
        if (title.trim().length < 0 || title.trim().length > 100) {
          setDisplayTitleMaxLength(true);
        } else {
          try {
            const data = {
              selectedFiles,
              title,
              text,
              location,
            };

            let formData = new FormData();

            formData.append(
              "accountID",
              secureLocalStorage.getItem("accountId")
            );
            formData.append("Title", data.title);
            formData.append("Description", data.text);
            formData.append("Location", data.location);

            data.selectedFiles?.forEach((file) => {
              formData.append("image", file);
            });

            const response = await createPost(formData);

            if (response.status === 200) {
              setDisplaySuccess(true);
              setTimeout(() => {
                navigate(routes.home.root);
                document.documentElement.scrollTop = 0;
              }, 2000);
            } else {
              setDisplayError(true);
            }
          } catch (error) {
            setDisplayServerError(true);
          }
        }
      }
    }
  };

  useEffect(() => {
    let timeOut;
    if (displayEmptyFile) {
      timeOut = setTimeout(() => {
        setDisplayEmptyFile(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayEmptyFile]);

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
    if (displayTitleMaxLength) {
      timeOut = setTimeout(() => {
        setDisplayTitleMaxLength(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayTitleMaxLength]);

  useEffect(() => {
    let timeOut;
    if (displayServerError) {
      timeOut = setTimeout(() => {
        setDisplayServerError(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayServerError]);

  useEffect(() => {
    let timeOut;
    if (displayError) {
      timeOut = setTimeout(() => {
        setDisplayError(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayError]);

  useEffect(() => {
    let timeOut;
    if (displaySuccess) {
      timeOut = setTimeout(() => {
        setDisplaySuccess(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displaySuccess]);

  return (
    <BoxContainer>
      <HeaderUser />
      <ToastComponent
        open={displayEmptyFile}
        close={() => setDisplayEmptyFile(false)}
        title="Error"
        message="Please upload at least 1 image!"
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
        open={displayTitleMaxLength}
        close={() => setDisplayTitleMaxLength(false)}
        title="Error"
        message="Title of post must be between 1 to 100 characters!"
        type="error"
      />

      <ToastComponent
        open={displayError}
        close={() => setDisplayError(false)}
        title="Error"
        message="Create post fail!"
        type="error"
      />

      <ToastComponent
        open={displayServerError}
        close={() => setDisplayServerError(false)}
        title="Error"
        message="Server maintenance is underway. Please try again later!"
        type="error"
      />

      <ToastComponent
        open={displaySuccess}
        close={() => setDisplaySuccess(false)}
        title="Success"
        message="Create post successfully!"
        type="success"
      />

      <Stack className="createMoment_Container">
        <Box display="flex" alignItems="center" gap=".5rem" mb="20px">
          <Typography
            sx={{ color: themeColors.text_Link }}
            onClick={handleBack}
          >
            &lt;
          </Typography>
          <Typography
            onClick={handleBack}
            sx={{
              color: themeColors.text_Link,
              "&:hover": {
                color: themeColors.primary_600,
                textDecoration: "underline",
                cursor: "pointer",
              },
            }}
          >
            Back
          </Typography>
        </Box>

        <Box className="createMoment_Content">
          <Typography className="createMoment_Title">
            Share a travel moment
          </Typography>
          <Typography className="createMoment_subTitle">
            Share your pictures
          </Typography>
          <Typography className="createMoment_desc">
            We encourage you to post photos of popular destinations.
          </Typography>
          <Box className="createMoment_Content_itemImgs">
            {selectedFiles.length > 0 && (
              <Box className="createMoment_Content_itemImgs--preview">
                {selectedFiles.map((file, index) => (
                  <div className="image-preview-wrapper" key={index}>
                    <img
                      loading="lazy"
                      src={URL.createObjectURL(file)}
                      alt={`preview ${index}`}
                    />
                    <div
                      className="btn_removeImg"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <img src={AssetImages.ICONS.REMOVE_IMAGE} alt="" />
                    </div>
                  </div>
                ))}
              </Box>
            )}
            {selectedFiles.length < 5 && (
              <Box
                className="createMoment_Content_itemImgs--item"
                onClick={() => document.getElementById("fileInput").click()}
              >
                <Box className="createMoment_Content_itemImgs--item-input">
                  <img loading="lazy" src={AssetImages.MOMENTS.CAMERA} alt="" />
                  <input
                    id="fileInput"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                  />
                </Box>
                <span>{selectedFiles.length}/5 Pictures</span>
              </Box>
            )}
          </Box>

          <Box mt="1rem">
            <Box className="createMoment_Content_addTitle">
              <Typography className="createMoment_Content_addTitle--Title">
                Title
              </Typography>
              <TextField
                variant="standard"
                className="createMoment_Content_addTitle--subTitle"
                placeholder="Please enter the post title"
                onChange={(e) => setTitle(e.target.value)}
              />
            </Box>

            <Box className="createMoment_Content_addTitle">
              <Typography className="createMoment_Content_addTitle--TitleTxt">
                Tell us about your trip
              </Typography>
              <TextField
                multiline
                rows={10}
                sx={{ width: "100%", fontSize: "16px" }}
                onChange={handleTextChange}
              />
            </Box>

            <Box className="createMoment_Content_addTitle">
              <Typography className="createMoment_Content_addLocation--Title">
                Location
              </Typography>
              <FormControl
                variant="standard"
                sx={{ minWidth: "30%", mb: "10px" }}
              >
                <Select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  displayEmpty
                  size="medium"
                >
                  <MenuItem value="">
                    <em style={{ color: "#B2B2B2", fontSize: 16 }}>
                      -- Choose location for your post --
                    </em>
                  </MenuItem>
                  {valueLocation?.map((item) => (
                    <MenuItem key={item} value={item} sx={{ fontSize: 16 }}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box className="createMoment_Content_addPolicy">
              <input
                style={{ width: "16px", height: "16px" }}
                type="checkbox"
                checked={checkAccept}
                onChange={handleCheckAcceptChange}
              />
              <Typography className="createMoment_Content_addPolicy--Title">
                By posting, I confirm that these images belong to me and I agree
                to the terms of eposhbooking.online{" "}
                <span
                  style={{
                    color: themeColors.text_Disabled,
                    fontStyle: "italic",
                  }}
                >
                  Terms and Conditions
                </span>{" "}
                &{" "}
                <span
                  style={{
                    color: themeColors.text_Disabled,
                    fontStyle: "italic",
                  }}
                >
                  Community Rules
                </span>
                .
              </Typography>
            </Box>
            <Button
              disabled={!checkAccept}
              onClick={handleSubmit}
              className={
                checkAccept
                  ? "createMoment_Content_addMoment--btn-submit"
                  : "createMoment_Content_addMoment--btn-disable"
              }
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Stack>
      <FooterCustomer />
    </BoxContainer>
  );
};

export default CreateMomentPage;
