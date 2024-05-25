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
function formatDurasi(durasi) {
  if (durasi < 60) {
    return durasi + " menit";
  } else if (durasi === 60) {
    return "1 jam";
  } else if (durasi < 1440) {
    // 1440 menit = 1 hari
    const jam = Math.floor(durasi / 60);
    const menit = durasi % 60;
    if (menit === 0) {
      return jam + " jam";
    } else {
      return jam + " jam " + menit + " menit";
    }
  } else {
    const hari = Math.floor(durasi / 1440);
    const sisaMenit = durasi % 1440;
    const jam = Math.floor(sisaMenit / 60);
    const menit = sisaMenit % 60;

    let result = hari + " hari";
    if (jam > 0) {
      result += " " + jam + " jam";
    }
    if (menit > 0) {
      result += " " + menit + " menit";
    }
    return result;
  }
}

const valueFormatter = (value) => `${value} Trip`;
const nominalFormat = (value) => `${formatRupiah(value)}`;
const durasiFormat = (value) => `${formatDurasi(value)}`;
const tripFormat = (value) => `${value}`;
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
  if (props.name == "nominal") {
    props.data.forEach((item) => {
      const itemMonth = parseInt(item.tanggal.split("-")[1], 10) - 1; // Mendapatkan indeks bulan
      if (itemMonth >= 0 && itemMonth < 12) {
        result[itemMonth].nominal += item.nominal;
      }
    });
  } else if (props.name == "durasi") {
    props.data.forEach((item) => {
      const itemMonth = parseInt(item.tanggal.split("-")[1], 10) - 1; // Mendapatkan indeks bulan
      if (itemMonth >= 0 && itemMonth < 12) {
        result[itemMonth].nominal += item.durasi;
      }
    });
  } else {
    props.data.forEach((item) => {
      const itemMonth = parseInt(item.tanggal.split("-")[1], 10) - 1; // Mendapatkan indeks bulan
      if (itemMonth >= 0 && itemMonth < 12) {
        result[itemMonth].nominal += 1;
      }
    });
  }

  console.log(result);

  const data = result.map((item) => item.nominal);
  return (
    <LineChart
      width={props.name == "durasi" ? 680 : props.name == "nominal" ? 820 : 680}
      height={300}
      series={[
        {
          data: data,
          color: "#2E96FF",
          label:
            props.name == "durasi"
              ? "Durasi"
              : props.name == "nominal"
              ? "Nominal"
              : "Trip",

          area: true,
          showMark: true,
          valueFormatter:
            props.name == "durasi"
              ? durasiFormat
              : props.name == "nominal"
              ? nominalFormat
              : valueFormatter,
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
