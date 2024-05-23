import React from "react";
import { Button } from "@material-tailwind/react";
import dayjs from "dayjs";
import "dayjs/locale/id";
import Home, { Sidebar } from "../components/sidebar";
import Tables from "../components/table";
import TablesData from "../components/table";
import MyTable from "../components/table";
import DataTable from "../components/table";
class DashboardAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "Dzulfi Allaudin",
      startDate: "25, Des 2024",
      endDate: "25, Des 2025",
      totalTrips: 27,
      tanggalMulaiTampil: "",
      tanggalSelesaiTampil: "",
      totalDistance: "200 KM",
      tanggalAwal: dayjs("2024-05-01").locale("id"),
      tanggalAkhir: dayjs().locale("id"),
      tanggalAwalString: "2024-05-01",
      tanggalAkhirString: dayjs().locale("id").format("YYYY-MM-DD"),
      totalDuration: "120 Jam",
      submittedAmount: "Rp. 100000000",
      currentTrip: {
        title: "Monitoring GTS",
        date: "15 Sep, 2022",
        from: "Kantor Pusat",
        status: "Belum Sampai",
      },

      user: {},
      totalParkir: 0,
      jumlahTrip: 0,
      totalJarak: 0,
      totalDurasi: 0,
      totalPengajuan: 0,
      loader: true,
      trip: [],
    };
  }
  render() {
    return <div></div>;
  }
}
export default DashboardAdmin;
