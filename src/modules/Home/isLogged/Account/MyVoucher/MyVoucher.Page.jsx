import React, { useState } from "react";
import "./MyVoucher.Style.scss";
import { Box, Typography } from "@mui/material";
import AllVouchersPage from "./AllVouchers/AllVouchers.Page";
import VouchersUsedPage from "./VouchersUsed/VouchersUsed.Page";
import VouchersUnusedPage from "./VouchersUnused/VouchersUnused.Page";
import { themeColors } from "../../../../../themes/schemes/PureLightThem";

const navItems = ["All Vouchers", "Vouchers Unused", "Vouchers Used"];

const MyVoucherPage = () => {
  const [isSelected, setIsSelected] = useState(0);

  const handleSelect = (index) => {
    setIsSelected(index);
  };

  return (
    <div className="my-voucher__container">
      <Box className="my-voucher__content">
        <Box className="my-voucher__nav">
          {navItems.map((item, index) => (
            <Typography
              key={index}
              onClick={() => handleSelect(index)}
              sx={{
                color:
                  index === isSelected
                    ? themeColors.primary_Default
                    : themeColors.black,
                fontWeight: index === isSelected ? 700 : "normal",
                borderBottom:
                  index === isSelected
                    ? `3px solid ${themeColors.primary_Default}`
                    : "none",
                fontSize: 18,
                cursor: "pointer",
                "&:hover": {
                  color:
                    index !== isSelected
                      ? themeColors.text_Disabled
                      : themeColors.primary_Default,
                },
              }}
            >
              {item}
            </Typography>
          ))}
        </Box>

        {isSelected === 0 ? <AllVouchersPage /> : null}
        {isSelected === 1 ? <VouchersUnusedPage /> : null}
        {isSelected === 2 ? <VouchersUsedPage /> : null}
      </Box>
    </div>
  );
};

export default MyVoucherPage;
