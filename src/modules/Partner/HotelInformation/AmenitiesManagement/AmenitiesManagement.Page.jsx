import {
  Box,
  Button,
  Grid,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { themeColors } from "../../../../themes/schemes/PureLightThem";
import { calculateSubService } from "../../../../utils/helper";
import UpdateAmenitiesModal from "../Modal/UpdateAmenities/UpdateAmenities.Modal";
import { getAllAmenities } from "../../Partner.Api";
import secureLocalStorage from "react-secure-storage";
import { LoadingButton } from "@mui/lab";

const stylesTitleTable = {
  color: themeColors.title,
  fontSize: 18,
  fontWeight: 700,
};

const AmenitiesManagementPage = () => {
  const onTopRef = useRef(null);

  const [data, setData] = useState([]);
  const [fetchData, setFetchData] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const servicesPerPage = 2;
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentService = data?.slice(indexOfFirstService, indexOfLastService);
  const totalPageService = Math.ceil(data?.length / servicesPerPage);

  const paginate = (event, value) => {
    event.preventDefault();
    setCurrentPage(value);
    if (onTopRef.current) {
      onTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const init = async () => {
    const res = await getAllAmenities(secureLocalStorage.getItem("hotelId"));

    if (res) {
      setData(res);
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setFetchData(true);
    }, 5000);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  return (
    <Box display="flex" flexDirection="column" gap="1rem" ref={onTopRef}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          sx={{ color: themeColors.title, fontSize: 18, fontWeight: 700 }}
        >
          {calculateSubService(data) <= 1
            ? `Total Amenity: ${calculateSubService(data)}`
            : `Total Amenities: ${calculateSubService(data)}`}
        </Typography>

        <UpdateAmenitiesModal
          data={{
            amenities: data,
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
        </UpdateAmenitiesModal>
      </Box>

      <Box>
        <TableContainer
          component={Paper}
          sx={{
            width: "auto",
            boxShadow: "none",
            border: "none",
            borderRadius: 0,
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background: themeColors.white,
                }}
              >
                <TableCell sx={stylesTitleTable}>Service</TableCell>
                <TableCell sx={stylesTitleTable}>Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentService?.map((service) => (
                <TableRow
                  key={service?.serviceID}
                  sx={{
                    borderBottom: `1px solid rgba(224, 224, 224, 1)`,
                    "&:last-child, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell
                    sx={{
                      color: themeColors.black,
                      fontSize: 16,
                      verticalAlign: "top",
                      borderBottom: "none",
                    }}
                  >
                    {service?.type}
                  </TableCell>
                  {service?.subServices?.map((subService, index) => (
                    <TableCell
                      key={subService?.subServiceID}
                      sx={{
                        color: themeColors.black,
                        fontSize: 16,
                        display: "flex",
                        borderBottom: `1px solid rgba(224, 224, 224, 1)`,
                        "&:last-child": { border: 0 },
                      }}
                    >
                      <Typography
                        sx={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}
                      >
                        {index + 1}. {subService?.subServiceName}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: "20px",
        }}
      >
        {data?.length > 0 && (
          <Grid item xs={6} sx={{ alignItems: "center" }}>
            <label>
              <b>
                Showing {currentPage} of {totalPageService}{" "}
                {totalPageService > 1 ? "pages" : "page"}
              </b>
            </label>
          </Grid>
        )}
        <Stack sx={{ alignItems: "center" }}>
          {data?.length > 0 && (
            <Pagination
              color="standard"
              variant="outlined"
              defaultPage={1}
              count={totalPageService}
              page={currentPage}
              onChange={paginate}
              size="medium"
              showFirstButton
              showLastButton
            />
          )}
        </Stack>
        {data?.length === 0 && (
          <Box
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            p="5px 0"
          >
            {!fetchData ? (
              <>
                <LoadingButton
                  loading
                  variant="outlined"
                  sx={{ border: "0 !important" }}
                />
                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: 400,
                  }}
                >
                  Fetching data...
                </Typography>
              </>
            ) : (
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 400,
                }}
              >
                No services found!
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AmenitiesManagementPage;
