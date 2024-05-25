import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

export default function PieChartComponent() {
  return (
    <PieChart
      series={[
        {
          data: [
            { id: 0, value: 10, label: "series A" },
            { id: 1, value: 15, label: "series B" },
          ],
        },
      ]}
      width={400}
      height={200}
    />
  );
}
