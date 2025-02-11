import React, { useEffect } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import LineChartTooltip from "../../../../components/Tooltip/LineChartTooltip";

const LineChartChart = ({ data }) => {
  const formatYAxis = (tickItem) => {
    if (tickItem >= 1000000) {
      return `${(tickItem / 1000000).toFixed(0)}tr`;
    }
    return tickItem;
  };

  useEffect(() => {}, [data]);

  return (
    <LineChart
      width={700}
      height={340}
      data={data}
      margin={{
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" fontSize={13} />
      <YAxis fontSize={13} tickFormatter={formatYAxis} />
      <Tooltip content={<LineChartTooltip />} />
      <Line type="monotone" dataKey="data" stroke="#82ca9d" />
    </LineChart>
  );
};

export default LineChartChart;
