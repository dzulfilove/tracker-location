import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

export default function PieChartComponent(props) {
  // Fungsi untuk menghitung total berdasarkan kategori
  function calculateTotalsByCategory(dataArray) {
    const totals = dataArray.reduce(
      (acc, obj) => {
        if (obj.kategori === "Dalam Kota") {
          acc.dalam += obj.nominal;
          acc.tripDalam += 1;
        } else if (obj.kategori === "Luar Kota") {
          acc.luar += obj.nominal;
          acc.tripLuar += 1;
        }
        return acc;
      },
      { dalam: 0, luar: 0, tripDalam: 0, tripLuar: 0 }
    );

    return [
      { id: 0, label: "Dalam Kota", value: totals.tripDalam },
      { id: 1, label: "Luar Kota", value: totals.tripLuar },
    ];
  }

  // Contoh penggunaan fungsi
  const data = calculateTotalsByCategory(props.data);
  console.log("pieeedde", data);
  return (
    <PieChart
      series={[
        {
          data: data,
        },
      ]}
      width={400}
      height={200}
    />
  );
}
