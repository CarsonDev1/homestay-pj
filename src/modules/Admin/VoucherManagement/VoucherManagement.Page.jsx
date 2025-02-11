/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import "./VoucherManagement.Style.scss";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  InputAdornment,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { themeColors } from "../../../themes/schemes/PureLightThem";
import { SearchOutlined } from "@mui/icons-material";
import AddVoucherModal from "./Modal/AddVoucher/AddVoucher.Modal";
import { formatDesc } from "../../../utils/helper";
import { getAllVoucher, searchVoucher } from "../Admin.Api";
import { LoadingButton } from "@mui/lab";
import DeleteVoucherModal from "./Modal/DeleteVoucher/DeleteVoucher.Modal";
import UpdateVoucherModal from "./Modal/UpdateVoucher/UpdateVoucher.Modal";

const styles = {
  titleTable: {
    color: themeColors.title,
    fontSize: 18,
    fontWeight: 700,
    p: "10px",
  },
  cellTable: {
    color: themeColors.black,
    fontSize: 16,
    p: "10px",
  },
};

const VoucherManagementPage = () => {
  const onTopRef = useRef(null);

  const [data, setData] = useState([]);
  const [fetchData, setFetchData] = useState(false);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const vouchersPerPage = 6;
  const indexOfLastVoucher = currentPage * vouchersPerPage;
  const indexOfFirstVoucher = indexOfLastVoucher - vouchersPerPage;
  const currentVoucher = data.slice(indexOfFirstVoucher, indexOfLastVoucher);
  const totalPageVoucher = Math.ceil(data.length / vouchersPerPage);

  const paginate = (event, value) => {
    event.preventDefault();
    setCurrentPage(value);
    if (onTopRef.current) {
      onTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const init = async () => {
    const res = await getAllVoucher();
    if (res) {
      if (search === "") {
        setData(res);
      } else {
        const searchRes = await searchVoucher(search.toLowerCase().trim());
        if (searchRes) {
          setData(searchRes);
        } else {
          setData(res);
        }
      }
    }
  };

  useEffect(() => {
    init();
  }, [data]);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setFetchData(true);
    }, 3000);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  return (
    <Box className="admin-voucher__container" ref={onTopRef}>
      <Box className="admin-voucher__content">
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography
            sx={{ color: themeColors.title, fontSize: 24, fontWeight: 700 }}
          >
            Voucher Management
          </Typography>

          <AddVoucherModal>
            <Button
              sx={{
                bgcolor: themeColors.primary_Default,
                color: themeColors.white,
                textTransform: "none",
                fontSize: 16,
                borderRadius: "10px",
                p: "6px 20px",
                "&:hover": {
                  bgcolor: themeColors.primary_600,
                },
              }}
            >
              Create
            </Button>
          </AddVoucherModal>
        </Box>

        <Typography
          sx={{ color: themeColors.title, fontSize: 20, fontWeight: 700 }}
        >
          {fetchData
            ? data.length <= 1
              ? `Total Voucher: ${data.length}`
              : `Total Vouchers: ${data.length}`
            : `Total Voucher: 0`}
        </Typography>

        {fetchData ? (
          <>
            <Divider sx={{ bgcolor: themeColors.gray }} />

            <TextField
              label="Search"
              placeholder="Search here..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchOutlined />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: "30%",
              }}
              size="small"
            />

            <Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={styles.titleTable}>Name</TableCell>
                      <TableCell sx={styles.titleTable}>Code</TableCell>
                      <TableCell align="center" sx={styles.titleTable}>
                        Quantity
                      </TableCell>
                      <TableCell align="center" sx={styles.titleTable}>
                        Discount
                      </TableCell>
                      <TableCell sx={styles.titleTable}>Description</TableCell>
                      <TableCell align="center" sx={styles.titleTable}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentVoucher.map((voucher) => (
                      <TableRow
                        key={voucher?.voucherID}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell
                          sx={{
                            color: themeColors.black,
                            fontSize: 16,
                            p: "10px",
                            width: "20%",
                          }}
                        >
                          <Box display="flex" alignItems="center" gap="1rem">
                            <Avatar
                              sx={{
                                width: 50,
                                height: 50,
                                bgcolor: themeColors.primary_Default,
                                color: themeColors.white,
                              }}
                            >
                              $
                            </Avatar>
                            <Typography
                              sx={{
                                width: "90%",
                                fontSize: 16,
                                display: "-webkit-box",
                                overflow: "hidden",
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                                transition: "-webkit-line-clamp 0.1s",
                              }}
                            >
                              {voucher.voucherName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={styles.cellTable}>
                          {voucher.code}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={styles.cellTable}
                          width="20%"
                        >
                          {voucher.quantityUse}
                        </TableCell>
                        <TableCell align="center" sx={styles.cellTable}>
                          {voucher.discount}%
                        </TableCell>
                        <TableCell sx={{ width: "35%" }}>
                          <Typography
                            sx={{
                              width: "90%",
                              fontSize: 16,
                              display: "-webkit-box",
                              overflow: "hidden",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                              transition: "-webkit-line-clamp 0.1s",
                            }}
                          >
                            {formatDesc(voucher.description)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center" sx={styles.cellTable}>
                          <Box display="flex" alignItems="center" gap="1rem">
                            <UpdateVoucherModal
                              data={{
                                id: voucher?.voucherID,
                                img: voucher?.voucherImage,
                                name: voucher?.voucherName,
                                code: voucher?.code,
                                quantity: voucher?.quantityUse,
                                discount: voucher?.discount,
                                desc: voucher?.description,
                              }}
                            >
                              <Button
                                sx={{
                                  bgcolor: themeColors.primary_Default,
                                  color: themeColors.white,
                                  textTransform: "none",
                                  fontSize: 16,
                                  borderRadius: "10px",
                                  p: "6px 20px",
                                  "&:hover": {
                                    bgcolor: themeColors.primary_600,
                                  },
                                }}
                              >
                                Edit
                              </Button>
                            </UpdateVoucherModal>

                            <DeleteVoucherModal
                              data={{
                                id: voucher?.voucherID,
                                code: voucher?.code,
                              }}
                            >
                              <Button
                                sx={{
                                  bgcolor: themeColors.button_Secondary,
                                  color: themeColors.white,
                                  textTransform: "none",
                                  fontSize: 16,
                                  borderRadius: "10px",
                                  p: "6px 20px",
                                  "&:hover": {
                                    bgcolor: themeColors.button_SecondaryHover,
                                  },
                                }}
                              >
                                Delete
                              </Button>
                            </DeleteVoucherModal>
                          </Box>
                        </TableCell>
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
              }}
            >
              {data?.length > 0 && (
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
                {data?.length > 0 && (
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

              {data?.length === 0 && (
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
            p="20px 0"
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
      </Box>
    </Box>
  );
};

export default VoucherManagementPage;
