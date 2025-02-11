import React from "react";
import { themeColors } from "../../themes/schemes/PureLightThem";
import { formatPrice } from "../../utils/helper";

const styles = {
  container: {
    backgroundColor: themeColors.white,
    border: `1px solid ${themeColors.gray}`,
    borderRadius: "6px",
    padding: "10px",
  },
  title: {
    color: themeColors.black,
    fontSize: 16,
    marginBottom: "10px",
  },
  booking: {
    color: "#8884d8",
  },
  revenue: {
    color: "#82ca9d",
  },
};

const getMonth = (label) => {
  switch (label) {
    case "Jan":
      return "January";
    case "Feb":
      return "February";
    case "Mar":
      return "March";
    case "Apr":
      return "April";
    case "May":
      return "May";
    case "Jun":
      return "June";
    case "Jul":
      return "July";
    case "Aug":
      return "August";
    case "Sep":
      return "September";
    case "Oct":
      return "October";
    case "Nov":
      return "November";
    case "Dec":
      return "December";
    default:
      return "";
  }
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={styles.container}>
        <p className="label" style={styles.title}>
          {getMonth(label)}
        </p>
        <p style={styles.booking}>{`Booking: ${payload[0].value}`}</p>
        <p style={styles.revenue}>{`Revenue: ${formatPrice(
          Math.ceil(payload[1].value)
        )} VND`}</p>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
