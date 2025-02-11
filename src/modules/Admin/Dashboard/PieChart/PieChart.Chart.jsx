import React, { useEffect, useState } from "react";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { getDataPieChart } from "../../Admin.Api";
import { themeColors } from "../../../../themes/schemes/PureLightThem";

const COLORS = [
  `${themeColors.button_Secondary}`,
  `${themeColors.status_Primary}`,
  `${themeColors.status_Secondary}`,
  `${themeColors.thirdary_Default}`,
  `${themeColors.primary_Default}`,
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const PieChartChart = () => {
  const [data, setData] = useState([]);

  const init = async () => {
    const res = await getDataPieChart();
    if (res) {
      setData(res);
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {}, [data]);

  return (
    <PieChart width={350} height={350}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={renderCustomizedLabel}
        outerRadius={130}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

export default PieChartChart;
