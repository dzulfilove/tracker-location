import * as React from "react";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";

const formatRupiah = (angka) => {
  return angka.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
const valueFormatter = (value) => `${value} Trip`;
const nominalFormatter = (value) => `${formatRupiah(value * 1000)}`;

const chartSetting = {
  yAxis: [
    {
      label: "rainfall ",
    },
  ],
  width: 730,
  height: 300,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: "translate(-20px, 0)",
    },
  },
};

export default function BarChartComponentPengajuan(props) {
  const [tickPlacement, setTickPlacement] = React.useState("middle");
  const [tickLabelPlacement, setTickLabelPlacement] = React.useState("middle");

  return (
    <div style={{ width: "100%" }}>
      <BarChart
        xAxis={[{ scaleType: "band", dataKey: "name" }]}
        series={[
          { dataKey: "trip", label: "Perjalanan", valueFormatter },
          {
            dataKey: "nominal",
            label: "Pengajuan",
            valueFormatter: nominalFormatter,
          },
        ]}
        {...chartSetting}
      />
    </div>
  );
}
