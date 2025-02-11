import React from "react";
import { themeColors } from "../../themes/schemes/PureLightThem";

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

const BarChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={styles.container}>
        <p className="label" style={styles.title}>
          {getMonth(label)}
        </p>
        <p style={styles.booking}>{`Total bookings: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default BarChartTooltip;
