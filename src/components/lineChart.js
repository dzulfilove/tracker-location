import * as React from "react";
import { LineChart, lineElementClasses } from "@mui/x-charts/LineChart";

const xLabels = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const formatRupiah = (angka) => {
  return angka.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
const valueFormatter = (value) => `${value} Trip`;
const nominalFormat = (value) => `${formatRupiah(value)}`;
export default function LineChartComponent(props) {
  // Inisialisasi array hasil dengan 12 objek untuk setiap bulan
  const result = [
    { bulan: "januari", nominal: 0 },
    { bulan: "februari", nominal: 0 },
    { bulan: "maret", nominal: 0 },
    { bulan: "april", nominal: 0 },
    { bulan: "mei", nominal: 0 },
    { bulan: "juni", nominal: 0 },
    { bulan: "juli", nominal: 0 },
    { bulan: "agustus", nominal: 0 },
    { bulan: "september", nominal: 0 },
    { bulan: "oktober", nominal: 0 },
    { bulan: "november", nominal: 0 },
    { bulan: "desember", nominal: 0 },
  ];

  // Bulan dalam format angka ke nama bulan
  const monthNames = [
    "januari",
    "februari",
    "maret",
    "april",
    "mei",
    "juni",
    "juli",
    "agustus",
    "september",
    "oktober",
    "november",
    "desember",
  ];

  // Loop melalui data awal dan tambahkan nominal ke bulan yang sesuai di result
  props.data.forEach((item) => {
    const itemMonth = parseInt(item.tanggal.split("-")[1], 10) - 1; // Mendapatkan indeks bulan
    if (itemMonth >= 0 && itemMonth < 12) {
      result[itemMonth].nominal += item.nominal;
    }
  });

  console.log(result);

  const data = result.map((item) => item.nominal);
  return (
    <LineChart
      width={800}
      height={300}
      series={[
        {
          data: data,
          color: "#2E96FF",
          label: "Nominal",
          area: true,
          showMark: true,
          valueFormatter: nominalFormat,
        },
      ]}
      xAxis={[{ scaleType: "point", data: xLabels }]}
      sx={{
        [`& .${lineElementClasses.root}`]: {
          display: "none",
        },
      }}
    />
  );
}
