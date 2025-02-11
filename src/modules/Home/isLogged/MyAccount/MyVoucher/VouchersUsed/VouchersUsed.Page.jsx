/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Grid,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { LoadingButton } from "@mui/lab";
import { useDispatch } from "react-redux";
import { getAllVoucherByAccountId } from "../../../../Home.Api";
import { themeColors } from "../../../../../../themes/schemes/PureLightThem";
import { URL_IMAGE } from "../../../../../../services/ApiUrl";
import VoucherDetailsModal from "../../../Modal/VoucherDetails/VoucherDetails.Modal";
import { filterVoucherUsed } from "../../../../../../utils/filter";

const VouchersUsedPage = () => {
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [fetchData, setFetchData] = useState(false);

  let listVoucherUsed = filterVoucherUsed(data);

  const [currentPage, setCurrentPage] = useState(1);

  const vouchersPerPage = 8;
  const indexOfLastVoucher = currentPage * vouchersPerPage;
  const indexOfFirstVoucher = indexOfLastVoucher - vouchersPerPage;
  const currentVoucher = listVoucherUsed?.slice(
    indexOfFirstVoucher,
    indexOfLastVoucher
  );
  const totalPageVoucher = Math.ceil(listVoucherUsed?.length / vouchersPerPage);

  const paginate = (event, value) => {
    event.preventDefault();
    setCurrentPage(value);
    document.documentElement.scrollTop = 100;
  };

  const init = async () => {
    const res = await getAllVoucherByAccountId(
      secureLocalStorage.getItem("accountId"),
      dispatch
    );

    if (res) {
      setData(res);
    }
  };

  useEffect(() => {
    init();
  }, [data]);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setFetchData(true);
    }, 5000);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  return (
    <>
      {fetchData ? (
        <>
          <Box display="flex" flexWrap="wrap" gap="30px">
            {currentVoucher?.map((item) => (
              <Box
                key={item?.voucher?.voucherID}
                sx={{
                  width: "48.5%",
                  bgcolor: themeColors.gray,
                  display: "flex",
                  gap: "10px",
                  alignItems: "stretch",
                  borderRadius: "8px",
                  boxShadow: themeColors.boxShadow,
                  "&:hover": {
                    boxShadow: themeColors.boxShadowHover,
                  },
                }}
              >
                <div
                  style={{
                    flex: 2,
                    width: "100%",
                    borderRadius: "8px 0 0 8px",
                  }}
                >
                  <img
                    loading="lazy"
                    src={`${URL_IMAGE}${item?.voucher?.voucherImage}`}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "8px 0 0 8px",
                    }}
                  />
                </div>
                <Box
                  flex={1}
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  p="10px"
                  gap="15px"
                >
                  <Typography
                    sx={{
                      fontSize: 18,
                      color: themeColors.title,
                      fontWeight: 700,
                    }}
                  >
                    {item?.voucher?.voucherName}
                  </Typography>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    gap="10px"
                  >
                    <Typography
                      sx={{
                        fontSize: 16,
                        bgcolor: themeColors.primary_Default,
                        p: "5px 10px",
                        borderRadius: "6px",
                        color: themeColors.white,
                        fontWeight: 700,
                      }}
                    >
                      {item?.voucher?.code}
                    </Typography>
                    <VoucherDetailsModal
                      data={{
                        img: item?.voucher?.voucherImage,
                        name: item?.voucher?.voucherName,
                        code: item?.voucher?.code,
                        discount: item?.voucher?.discount,
                        desc: item?.voucher?.description,
                      }}
                    >
                      <Button
                        sx={{
                          fontSize: 14,
                          bgcolor: themeColors.primary_Default,
                          p: "5px 10px",
                          borderRadius: "6px",
                          color: themeColors.white,
                          textTransform: "none",
                          "&:hover": {
                            bgcolor: themeColors.primary_600,
                          },
                        }}
                      >
                        View
                      </Button>
                    </VoucherDetailsModal>
                  </Box>
                </Box>
              </Box>
            ))}
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
            {listVoucherUsed?.length > 0 && (
              <Grid item xs={6} sx={{ alignItems: "center" }}>
                <label>
                  <b>
                    Showing {currentPage} of {totalPageVoucher}{" "}
                    {totalPageVoucher > 1 ? "pages" : "page"}
                  </b>
                </label>
              </Grid>
            )}
            <Stack sx={{ alignItems: "center" }}>
              {listVoucherUsed?.length > 0 && (
                <Pagination
                  color="standard"
                  variant="outlined"
                  defaultPage={1}
                  count={totalPageVoucher}
                  page={currentPage}
                  onChange={paginate}
                  size="medium"
                  showFirstButton
                  showLastButton
                />
              )}
            </Stack>

            {listVoucherUsed?.length === 0 && (
              <Box
                width="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                p="5px 0"
              >
                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: 400,
                  }}
                >
                  No voucher found!
                </Typography>
              </Box>
            )}
          </Box>
        </>
      ) : (
        <Box
          width="100%"
          p="20px 60px"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <LoadingButton
            loading
            variant="outlined"
            sx={{ border: "0 !important" }}
          />
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: 400,
            }}
          >
            Loading...
          </Typography>
        </Box>
      )}
    </>
  );
};

export default VouchersUsedPage;
