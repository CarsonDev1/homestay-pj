import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { themeColors } from "../../../../themes/schemes/PureLightThem";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import ToastComponent from "../../../../components/Toast/Toast.Component";

const libraries = ["places"];
const API_KEY = "AIzaSyCkhK3QrKfMyRahTXg_kObH8PRZrGifh-s";

const LocationPage = ({ prevStep, nextStep }) => {
  const [center, setCenter] = useState({ lat: 10.0432301, lng: 105.7438361 });
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
  const [displayError, setDisplayError] = useState(false);

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
          console.log(status);
        }
      });
    } catch (error) {
      setDisplayError(true);
    }
  };

  const handleSubmit = () => {
    if (address === "" || city === "" || lat === null || lng === null) {
      setDisplayEmpty(true);
    } else {
      const hotelAddress = {
        address: address,
        lat: lat,
        lng: lng,
        city: city,
      };

      nextStep(hotelAddress);
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
    if (displayError) {
      timeOut = setTimeout(() => {
        setDisplayError(false);
      }, 5500);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [displayError]);

  if (loadError) return <div>Load Error</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <Box display="flex" flexDirection="column" gap="2rem">
      <ToastComponent
        open={displayEmpty}
        close={() => setDisplayEmpty(false)}
        title="Error"
        message="You must enter address before continuing!"
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
        open={displayError}
        close={() => setDisplayError(false)}
        title="Error"
        message="Server maintenance is underway. Please try again later!"
        type="error"
      />

      <Box display="flex" flexDirection="column" gap="1rem">
        <Typography
          sx={{
            color: themeColors.title,
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          Location
        </Typography>
        <GooglePlacesAutocomplete
          apiKey={API_KEY}
          selectProps={{
            onChange: handleSelect,
          }}
        />
        <div style={{ height: "500px", width: "100%" }}>
          <GoogleMap
            mapContainerStyle={{ height: "100%", width: "100%" }}
            zoom={markerPosition ? 18 : 13}
            center={center}
          >
            {markerPosition && <Marker position={markerPosition} />}
          </GoogleMap>
        </div>
      </Box>

      <Box width="100%" display="flex" justifyContent="space-between">
        <Button
          onClick={() => prevStep()}
          sx={{
            width: "15%",
            textTransform: "none",
            color: themeColors.primary_600,
            fontSize: 18,
            border: `1px solid ${themeColors.primary_600}`,
            borderRadius: "8px",
            "&:hover": {
              bgcolor: themeColors.bg_Disabled,
            },
          }}
        >
          Back
        </Button>

        <Button
          onClick={handleSubmit}
          sx={{
            width: "15%",
            textTransform: "none",
            color: themeColors.white,
            fontSize: 18,
            fontWeight: 700,
            bgcolor: themeColors.primary_Default,
            borderRadius: "8px",
            "&:hover": {
              bgcolor: themeColors.primary_600,
            },
          }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default LocationPage;
