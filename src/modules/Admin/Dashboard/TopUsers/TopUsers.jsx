import {
  Avatar,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { formatPrice } from "../../../../utils/helper";
import { themeColors } from "../../../../themes/schemes/PureLightThem";
import { URL_IMAGE } from "../../../../services/ApiUrl";
import { AssetImages } from "../../../../utils/images";

const styles = {
  titleTable: {
    color: themeColors.title,
    fontSize: 18,
    fontWeight: 700,
    p: "10px 0",
  },
  dataTable: {
    color: themeColors.black,
    fontSize: 15,
    p: "12.5px 0",
  },
};

const TopUsers = ({ data }) => {
  const dataTopUser = data?.slice(0, 5);

  useEffect(() => {}, [dataTopUser, data]);

  return (
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
            <TableCell align="center" sx={styles.titleTable}>
              Bookings
            </TableCell>
            <TableCell align="right" sx={styles.titleTable}>
              Spending
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataTopUser?.map((user, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell sx={styles.dataTable}>
                <Box display="flex" alignItems="center" gap=".5rem">
                  {user?.avatar ? (
                    user?.avatar?.startsWith("/", 0) ? (
                      <Avatar
                        src={`${URL_IMAGE}${user?.avatar}`}
                        sx={{ width: 36, height: 36 }}
                      />
                    ) : (
                      <Avatar
                        src={`${user?.avatar}`}
                        sx={{ width: 36, height: 36 }}
                      />
                    )
                  ) : (
                    <Avatar
                      src={`${AssetImages.LOGO}`}
                      sx={{ width: 36, height: 36 }}
                    />
                  )}
                  <Typography sx={styles.dataTable}>
                    {user?.fullName}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center" sx={styles.dataTable}>
                {user?.totalBooking}
              </TableCell>
              <TableCell align="right" sx={styles.dataTable}>
                {formatPrice(Math.ceil(user?.spending))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TopUsers;
