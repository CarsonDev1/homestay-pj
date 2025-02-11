import React, { useEffect } from "react";
import { Bar, BarChart, Tooltip, XAxis, YAxis } from "recharts";
import BarChartTooltip from "../../../../components/Tooltip/BarChartTooltip";

const BarChartChart = ({ data }) => {
  useEffect(() => {}, [data]);

  return (
    <BarChart
      width={700}
      height={400}
      data={data}
      margin={{
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
      }}
    >
      <XAxis dataKey="name" />
      <YAxis yAxisId="left" orientation="left" />
      <Tooltip content={<BarChartTooltip />} />
      <Bar yAxisId="left" dataKey="data" fill="#8884d8" />
    </BarChart>
  );
};

export default BarChartChart;
