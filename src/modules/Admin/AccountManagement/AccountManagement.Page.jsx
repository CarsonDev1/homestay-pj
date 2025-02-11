/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import "./AccountManagement.Style.scss";
import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Pagination,
  Paper,
  Select,
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
import { formatPhoneNumber } from "../../../utils/helper";
import { getAllAccount, searchAccount } from "../Admin.Api";
import { LoadingButton } from "@mui/lab";
import { useDispatch } from "react-redux";
import BlockAccountModal from "./Modal/BlockAccount.Modal";
import { URL_IMAGE } from "../../../services/ApiUrl";
import { AssetImages } from "../../../utils/images";

const roleValue = ["Customer", "Partner"];
const statusValue = [true, false];
const styles = {
  titleTable: {
    color: themeColors.title,
    fontSize: 18,
    fontWeight: 700,
  },
  cellTable: {
    color: themeColors.black,
    fontSize: 16,
  },
};

const AccountManagementPage = () => {
  const dispatch = useDispatch();
  const onTopRef = useRef(null);

  const [data, setData] = useState([]);
  const [dataSearch, setDataSearch] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [fetchData, setFetchData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const init = async () => {
    const res = await getAllAccount(dispatch);
    if (res) {
      setData(res);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = async () => {
    if (search.trim() === "") {
      setDataSearch([]);
    } else {
      const searchRes = await searchAccount(search.toLowerCase().trim());
      setCurrentPage(1);
      if (searchRes) {
        setDataSearch(searchRes);
      } else {
        setDataSearch([]);
      }
    }
  };

  const filterAccount = (listAccount) => {
    return listAccount?.filter((account) => {
      return (
        (status === "" || account?.isActive === status) &&
        (role === "" || account?.role?.name === role)
      );
    });
  };

  const filteredAccount = filterAccount(data);
  const filteredSearchAccount = filterAccount(dataSearch);

  const accountsPerPage = 6;
  const indexOfLastAccount = currentPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccount =
    dataSearch?.length > 0
      ? filteredSearchAccount?.slice(indexOfFirstAccount, indexOfLastAccount)
      : filteredAccount?.slice(indexOfFirstAccount, indexOfLastAccount);
  const totalPageAccount = Math.ceil(
    dataSearch?.length > 0
      ? filteredSearchAccount?.length / accountsPerPage
      : filteredAccount?.length / accountsPerPage
  );

  const paginate = (event, value) => {
    event.preventDefault();
    setCurrentPage(value);
    if (onTopRef.current) {
      onTopRef.current.scrollIntoView({ behavior: "smooth" });
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

  useEffect(() => {}, [status, role, search]);

  return (
    <Box className="admin-account__container" ref={onTopRef}>
      <Box className="admin-account__content">
        <Box display="flex" flexDirection="column" gap="1rem">
          <Typography
            sx={{ color: themeColors.title, fontSize: 24, fontWeight: 700 }}
          >
            Account Management
          </Typography>
          <Typography
            sx={{ color: themeColors.title, fontSize: 20, fontWeight: 700 }}
          >
            {fetchData
              ? dataSearch?.length > 0
                ? `Total Accounts: ${filteredSearchAccount?.length}`
                : filteredAccount?.length > 1
                ? `Total Accounts: ${filteredAccount?.length}`
                : `Total Account: ${filteredAccount?.length}`
              : `Total Account: 0`}
          </Typography>
        </Box>

        {fetchData ? (
          <>
            <Divider sx={{ bgcolor: themeColors.gray }} />

            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <TextField
                label="Search"
                placeholder="Search here..."
                value={search}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
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

              <FormControl sx={{ minWidth: "30%" }}>
                <Select
                  value={status}
                  onChange={handleStatusChange}
                  displayEmpty
                  size="small"
                  sx={{ borderRadius: "4px" }}
                >
                  <MenuItem value="">
                    <em style={{ color: "#B2B2B2" }}>
                      -- Choose status to filter --
                    </em>
                  </MenuItem>
                  {statusValue?.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item ? `Active` : `Inactive`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: "30%" }}>
                <Select
                  value={role}
                  onChange={handleRoleChange}
                  displayEmpty
                  size="small"
                  sx={{ borderRadius: "4px" }}
                >
                  <MenuItem value="">
                    <em style={{ color: "#B2B2B2" }}>
                      -- Choose role to filter --
                    </em>
                  </MenuItem>
                  {roleValue?.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                    <TableRow>
                      <TableCell sx={styles.titleTable}>Name</TableCell>
                      <TableCell sx={styles.titleTable}>Email</TableCell>
                      <TableCell sx={styles.titleTable}>Phone</TableCell>
                      <TableCell sx={styles.titleTable} align="center">
                        Role
                      </TableCell>
                      <TableCell sx={styles.titleTable} align="center">
                        Status
                      </TableCell>
                      <TableCell sx={styles.titleTable} align="center">
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentAccount?.map((account) => (
                      <TableRow
                        key={account?.accountID}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell sx={styles.cellTable}>
                          <Box display="flex" alignItems="center" gap="1rem">
                            {account?.profile?.avatar ? (
                              account?.profile?.avatar?.startsWith("/", 0) ? (
                                <Avatar
                                  src={`${URL_IMAGE}${account?.profile?.avatar}`}
                                  sx={{
                                    width: 56,
                                    height: 56,
                                    pointerEvents: "none",
                                  }}
                                />
                              ) : (
                                <Avatar
                                  src={`${account?.profile?.avatar}`}
                                  sx={{
                                    width: 56,
                                    height: 56,
                                    pointerEvents: "none",
                                  }}
                                />
                              )
                            ) : (
                              <Avatar
                                src={`${AssetImages.LOGO}`}
                                sx={{
                                  width: 56,
                                  height: 56,
                                  pointerEvents: "none",
                                }}
                              />
                            )}
                            <Typography
                              sx={{
                                display: "-webkit-box",
                                overflow: "hidden",
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                                transition: "-webkit-line-clamp 0.1s",
                                userSelect: "none",
                              }}
                            >
                              {account?.profile?.fullName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={styles.cellTable}>
                          {account?.email}
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "15%",
                            color: themeColors.black,
                            fontSize: 16,
                          }}
                        >
                          {account?.phone
                            ? formatPhoneNumber(account?.phone)
                            : null}
                        </TableCell>
                        <TableCell sx={styles.cellTable} align="center">
                          <Box
                            sx={{
                              bgcolor:
                                account?.role?.name === "Customer"
                                  ? themeColors.bg_Disabled
                                  : themeColors.status_Secondary,
                              p: "15px",
                              textAlign: "center",
                              color:
                                account?.role?.name === "Customer"
                                  ? themeColors.black
                                  : themeColors.white,
                              fontSize: 16,
                              borderRadius: "6px",
                            }}
                          >
                            {account?.role?.name}
                          </Box>
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color:
                              account?.isActive === true
                                ? themeColors.status_Primary
                                : themeColors.button_Secondary,
                            fontSize: 16,
                            fontWeight: 700,
                          }}
                        >
                          {account?.isActive === false ? "Inactive" : "Active"}
                        </TableCell>
                        <TableCell sx={styles.cellTable} align="center">
                          <BlockAccountModal
                            data={{
                              id: account?.accountID,
                              email: account?.email,
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
                                "&:disabled": {
                                  color: themeColors.white,
                                  bgcolor: "rgba(241, 69, 66, .7)",
                                },
                              }}
                              disabled={!account?.isActive}
                            >
                              {!account?.isActive ? "Blocked" : "Block"}
                            </Button>
                          </BlockAccountModal>
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
              {dataSearch?.length > 0
                ? filteredSearchAccount?.length > 0 && (
                    <Grid item xs={6} sx={{ alignItems: "center" }}>
                      <label>
                        <b>
                          Showing {currentPage} of {totalPageAccount}{" "}
                          {totalPageAccount > 1 ? "pages" : "page"}
                        </b>
                      </label>
                    </Grid>
                  )
                : filteredAccount?.length > 0 && (
                    <Grid item xs={6} sx={{ alignItems: "center" }}>
                      <label>
                        <b>
                          Showing {currentPage} of {totalPageAccount}{" "}
                          {totalPageAccount > 1 ? "pages" : "page"}
                        </b>
                      </label>
                    </Grid>
                  )}
              <Stack sx={{ alignItems: "center" }}>
                {dataSearch?.length > 0
                  ? filteredSearchAccount?.length > 0 && (
                      <Pagination
                        color="standard"
                        variant="outlined"
                        defaultPage={1}
                        count={totalPageAccount}
                        page={currentPage}
                        onChange={paginate}
                        size="medium"
                        showFirstButton
                        showLastButton
                      />
                    )
                  : filteredAccount?.length > 0 && (
                      <Pagination
                        color="standard"
                        variant="outlined"
                        defaultPage={1}
                        count={totalPageAccount}
                        page={currentPage}
                        onChange={paginate}
                        size="medium"
                        showFirstButton
                        showLastButton
                      />
                    )}
              </Stack>

              {dataSearch?.length > 0
                ? filteredSearchAccount?.length === 0 && (
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
                        No account found!
                      </Typography>
                    </Box>
                  )
                : filteredAccount?.length === 0 && (
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
                        No account found!
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

export default AccountManagementPage;
