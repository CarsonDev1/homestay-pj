import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { themeColors } from "../../../../themes/schemes/PureLightThem";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { getAddress, updateAddress } from "../../Partner.Api";
import secureLocalStorage from "react-secure-storage";
import ToastComponent from "../../../../components/Toast/Toast.Component";

const styles = {
  p: "6px 14px",
  bgcolor: themeColors.bg_Disabled,
  color: themeColors.text_Link,
  fontSize: 16,
  borderRadius: "6px",
  display: "-webkit-box",
  overflow: "hidden",
  WebkitLineClamp: 1,
  WebkitBoxOrient: "vertical",
  userSelect: "none",
};

const libraries = ["places"];
const API_KEY = "AIzaSyCkhK3QrKfMyRahTXg_kObH8PRZrGifh-s";

const LocationPage = () => {
  const [data, setData] = useState({});

  const [displayEdited, setDisplayEdited] = useState(false);

  const [center, setCenter] = useState({
    lat: 10.0124808,
    lng: 105.7323119,
  });
  const [markerPosition, setMarkerPosition] = useState(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries,
  });

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  const [displayEmpty, setDisplayEmpty] = useState(false);
  const [displayNotFound, setDisplayNotFound] = useState(false);
  const [displayServerError, setDisplayServerError] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);

  const handleSelect = (address) => {
    try {
      setAddress(address.label);
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: address.label }, (results, status) => {
        if (status === "OK") {
          const position = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          };
          setCenter(position);
          setMarkerPosition(position);
          setLat(position.lat);
          setLng(position.lng);

          const addressComponents = results[0].address_components;
          for (let component of addressComponents) {
            if (component.types.includes("locality")) {
              setCity(component.long_name);
              break;
            }
            if (component.types.includes("administrative_area_level_1")) {
              setCity(component.long_name);
            }
          }
        } else {
          setDisplayNotFound(true);
        }
      });
    } catch (error) {
      setDisplayServerError(true);
    }
  };

  const init = async () => {
    const res = await getAddress(secureLocalStorage.getItem("hotelId"));

    if (res) {
      setData(res);
    }
  };

  const handleSubmit = async () => {
    if (address === "" || city === "" || lat === null || lng === null) {
      setDisplayEmpty(true);
    } else {
      try {
        let formData = new FormData();

        formData.append("hotelID", secureLocalStorage.getItem("hotelId"));
        formData.append("City", city);
        formData.append("latitude", lat);
        formData.append("longitude", lng);
        formData.append("Address", address);

        const response = await updateAddress(formData);

        if (response.status === 200) {
          setDisplaySuccess(true);
          setDisplayEdited(false);
        } else {
          setDisplayError(true);
        }
      } catch (error) {
        setDisplayError(true);
      }
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (data?.address) {
      setAddress(data?.address);
    }

    if (data?.city) {
      setCity(data?.city);
    }

    if (data?.latidue && data?.lontidue) {
      setCenter({ lat: data?.latidue, lng: data?.lontidue });
      setMarkerPosition({ lat: data?.latidue, lng: data?.lontidue });
    }
  }, [data?.address, data?.city, data?.latidue, data?.lontidue]);

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
    if (displayNotFound) {
      timeOut = setTimeout(() => {
        setDisplayNotFound(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayNotFound]);

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

  if (loadError) return <div>Load Error</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <Box display="flex" flexDirection="column" gap="2rem">
      <ToastComponent
        open={displayEmpty}
        close={() => setDisplayEmpty(false)}
        title="Error"
        message="You must enter address before updating!"
        type="error"
      />

      <ToastComponent
        open={displayNotFound}
        close={() => setDisplayNotFound(false)}
        title="Error"
        message="Not found address!"
        type="error"
      />

      <ToastComponent
        open={displayServerError}
        close={() => setDisplayServerError(false)}
        title="Error"
        message="Your request has reached its limit!"
        type="error"
      />

      <ToastComponent
        open={displayError}
        close={() => setDisplayError(false)}
        title="Error"
        message="Update hotel's location fail!"
        type="error"
      />

      <ToastComponent
        open={displaySuccess}
        close={() => setDisplaySuccess(false)}
        title="Success"
        message="Update hotel's location successfully!"
        type="success"
      />

      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography
          sx={{ color: themeColors.title, fontSize: 24, fontWeight: 700 }}
        >
          Hotel's Location
        </Typography>
        <Button
          onClick={() => setDisplayEdited((prev) => !prev)}
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
          Edit
        </Button>
      </Box>

      <Box display="flex" flexDirection="column" gap="1rem">
        {displayEdited && (
          <GooglePlacesAutocomplete
            apiKey={API_KEY}
            selectProps={{
              onChange: handleSelect,
            }}
          />
        )}

        <Box display="flex" alignItems="center" gap="2rem">
          <Box flex={2} display="flex" flexDirection="column" gap="1rem">
            <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
              Address
            </Typography>
            <Typography sx={styles}>{address ? address : "-"}</Typography>
          </Box>

          <Box flex={0.6} display="flex" flexDirection="column" gap="1rem">
            <Typography sx={{ fontSize: 18, fontWeight: 700 }}>City</Typography>
            <Typography sx={styles}>{city ? city : "-"}</Typography>
          </Box>
        </Box>
      </Box>

      <div style={{ height: "500px", width: "100%" }}>
        <GoogleMap
          mapContainerStyle={{ height: "100%", width: "100%" }}
          zoom={markerPosition ? 18 : 15}
          center={center}
        >
          {markerPosition && <Marker position={markerPosition} />}
        </GoogleMap>
      </div>

      <Box display="flex" justifyContent="flex-end">
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
            "&:disabled": {
              bgcolor: themeColors.bg_Disabled,
              color: themeColors.text_Link,
            },
          }}
          disabled={!displayEdited}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default LocationPage;
