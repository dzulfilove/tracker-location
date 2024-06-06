import * as React from "react";
import "../styles/style.css";
import { Link } from "react-router-dom";
import { db } from "../config/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import Navbar from "../components/navbar";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers";
import AOS from "aos";

import "aos/dist/aos.css";
import LoadingComp from "../components/loader2";
class Dashboard extends React.Component {
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
      totalKlaim: 0,
      totalJarak: 0,
      totalDurasi: 0,
      totalPengajuan: 0,
      loader: true,
      trip: [],
    };
  }

  componentDidMount = async () => {
    const userEmail = sessionStorage.getItem("userEmail");
    await this.getAllTripsByUid(userEmail);
    AOS.init({ duration: 700 });
  };
  handleFilter = (name, value) => {
    const dayjsDate = dayjs(value);

    let tanggalMulai = this.state.tanggalAwalString;
    let tanggalSelesai = this.state.tanggalAkhirString;

    if (!dayjsDate.isValid()) {
      return;
    }

    const formattedDate = dayjsDate.format("YYYY-MM-DD");

    if (name == "tanggalAwal") {
      tanggalMulai = formattedDate;
      this.setState({ tanggalAwal: value, tanggalAwalString: formattedDate });
    } else {
      tanggalSelesai = formattedDate;
      this.setState({ tanggalAkhir: value, tanggalAkhirString: formattedDate });
    }

    const { trips } = this.state;

    const filteredTrips = trips.filter((trip) => {
      const tripDate = new Date(trip.tanggal);
      const startDate = new Date(tanggalMulai);
      const endDate = new Date(tanggalSelesai);

      return tripDate >= startDate && tripDate <= endDate;
    });

    const totalJarak = filteredTrips.reduce(
      (total, item) => total + parseFloat(item.jarakKompensasi),
      0
    );
    const totalNominal = filteredTrips.reduce(
      (total, item) => total + parseFloat(item.nominal),
      0
    );
    const totalDurasi = filteredTrips.reduce(
      (total, item) => total + item.durasi,
      0
    );
    const totalParkir = filteredTrips.reduce(
      (total, item) =>
        total + parseFloat(item.biayaParkir ? item.biayaParkir : 0), // Jika biaya parkir tidak ada, maka biaya parkir dianggap 0

      0
    );
    const jumlahTrip = filteredTrips.length;
    const mulaiTgl = this.formatTanggal(tanggalMulai);
    const selesaiTgl = this.formatTanggal(tanggalSelesai);
    console.log(this.sortByDateAndTimeDescending(filteredTrips), "data Filter");
    this.setState({
      totalJarak: totalJarak.toFixed(2),
      jumlahTrip: jumlahTrip,
      totalDurasi: totalDurasi,
      totalParkir: totalParkir,
      totalPengajuan: totalNominal,
      tanggalMulaiTampil: mulaiTgl,
      tanggalSelesaiTampil: selesaiTgl,
    });

    this.setState({ filteredTrips, isFilter: true });
  };
  sortByDateAndTimeDescending = (arrayObjek) => {
    return arrayObjek.sort((a, b) => {
      const dateA = new Date(a.tanggal);
      const dateB = new Date(b.tanggal);

      if (dateB - dateA !== 0) {
        return dateB - dateA;
      }

      // Menggunakan metode sortir jam keluar dari user
      let [jamAInt, menitAInt] = a.lokasiAkhir[0].jamSampai
        .split(":")
        .map(Number);
      let [jamBInt, menitBInt] = b.lokasiAkhir[0].jamSampai
        .split(":")
        .map(Number);

      if (jamAInt !== jamBInt) {
        return jamBInt - jamAInt;
      } else {
        return menitBInt - menitAInt;
      }
    });
  };
  getAllTripsByUid = async (email) => {
    await this.getUserLogin(email);
    const { user } = this.state;
    try {
      const userRef = doc(db, "User", user.uid);
      const tripsCollection = collection(db, "trips");
      const userTripsQuery = query(
        tripsCollection,
        where("refUser", "==", userRef)
      );
      const querySnapshot = await getDocs(userTripsQuery);

      const tripList = [];
      for (const doc of querySnapshot.docs) {
        const tripData = doc.data();
        // Ambil data dari subkoleksi 'lokasiAwal'
        const lokasiAwalRef = collection(doc.ref, "lokasiAwal");
        const lokasiAwalSnapshot = await getDocs(lokasiAwalRef);
        const lokasiAwalData = lokasiAwalSnapshot.docs.map((lokasiDoc) =>
          lokasiDoc.data()
        );

        // Tambahkan data lokasiAwal ke dalam data perjalanan
        tripData.lokasiAwal = lokasiAwalData;

        const lokasiAkhirRef = collection(doc.ref, "lokasiAkhir");
        const lokasiAkhirSnapshot = await getDocs(lokasiAkhirRef);
        const lokasiAkhirData = lokasiAkhirSnapshot.docs.map((lokasiDoc) =>
          lokasiDoc.data()
        );

        // Tambahkan data lokasiAkhir ke dalam data perjalanan
        tripData.lokasiAkhir = lokasiAkhirData;

        tripList.push({ id: doc.id, ...tripData });
      }
      const jumlahTrip = tripList.length;

      const filteredArray = tripList.filter((item) => item.status == "Selesai");

      console.log(filteredArray, "Trip");
      const hasil = filteredArray.map((objek) => {
        // Menentukan faktor pengali berdasarkan kategori
        const faktorPengali = objek.kategori === "Dalam Kota" ? 500 : 600;

        // Menghitung nilai nominal berdasarkan rumus yang diberikan
        const nominal = objek.jarakKompensasi * faktorPengali;

        // Mengembalikan objek baru dengan properti nominal yang ditambahkan
        return {
          ...objek, // Menyalin properti objek yang ada
          nominal: nominal,
        };
      });
      const filteredTrips = hasil.filter((trip) => {
        const tripDate = new Date(trip.tanggal);
        const startDate = new Date(this.state.tanggalAwalString);
        const endDate = new Date(this.state.tanggalAkhirString);

        return tripDate >= startDate && tripDate <= endDate;
      });

      const totalKlaim = filteredTrips.reduce((total, obj) => {
        if (obj.klaim) {
          return obj.biayaParkir
            ? parseFloat(obj.biayaParkir) + total + parseFloat(obj.nominal)
            : 0 + total + parseFloat(obj.nominal);
        }
        return total;
      }, 0);
      const totalJarak = filteredTrips.reduce(
        (total, item) => total + parseFloat(item.jarakKompensasi),
        0
      );
      const totalNominal = filteredTrips.reduce(
        (total, item) => total + parseFloat(item.nominal),
        0
      );
      const totalParkir = filteredTrips.reduce(
        (total, item) =>
          total + parseFloat(item.biayaParkir ? item.biayaParkir : 0), // Jika biaya parkir tidak ada, maka biaya parkir dianggap 0

        0
      );
      const totalDurasi = filteredTrips.reduce(
        (total, item) => total + item.durasi,
        0
      );
      const mulaiTgl = this.formatTanggal(this.state.tanggalAwalString);
      const selesaiTgl = this.formatTanggal(this.state.tanggalAkhirString);
      console.log(mulaiTgl, "tagajkafkj");
      await new Promise((resolve) => {
        this.setState(
          {
            tanggalMulaiTampil: mulaiTgl,
            tanggalSelesaiTampil: selesaiTgl,
            trips: hasil,
            loader: false,
            totalParkir: totalParkir,
            totalJarak: totalJarak.toFixed(2),
            totalDurasi: totalDurasi,
            jumlahTrip: jumlahTrip,
            totalPengajuan: totalNominal,
            totalKlaim: totalKlaim,
          },
          resolve
        );
      });

      // console.log(this.state.trips);
    } catch (error) {
      console.error("Error fetching data: ", error);
      throw error;
    }
  };
  formatRupiah(angka) {
    return angka.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  getUserLogin = async (email) => {
    try {
      const userRef = collection(db, "User");
      const q = query(userRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return null;
      }
      const userData = querySnapshot.docs[0].data();
      console.log(userData.peran, "hcdghashsdh");
      await new Promise((resolve) => {
        this.setState({ user: userData }, resolve);
      });

      return userData;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };
  formatDurasi(durasi) {
    if (durasi < 60) {
      return durasi + " menit";
    } else if (durasi === 60) {
      return "1 jam";
    } else {
      const jam = Math.floor(durasi / 60);
      const menit = durasi % 60;
      if (menit === 0) {
        return jam + " jam";
      } else {
        return jam + " jam " + menit + " menit";
      }
    }
  }
  formatTanggal = (tanggal) => {
    const hari = dayjs(tanggal).locale("id").format("dddd");
    const bulan = dayjs(tanggal).locale("id").format("MMMM");
    const hasil =
      tanggal.substring(8, 10) + " " + bulan + " " + tanggal.substring(0, 4);
    console.log("tanggal", dayjs(tanggal).locale("id").format("MMMM"));

    return hasil;
  };

  render() {
    const {
      userName,
      startDate,
      endDate,
      totalTrips,
      totalDistance,
      totalDuration,
      submittedAmount,
      currentTrip,
    } = this.state;

    return (
      <div
        className="auth-main"
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "100%",
          height: "100%",
          overflowX: "hidden",
          position: "relative",
          marginBottom: "1rem",
        }}
      >
        <div className="font-DM flex flex-col px-4 pt-7 pb-11 mx-auto w-full font-bold bg-white  rounded-[32px]">
          <div className="flex gap-5 text-xl tracking-wide leading-7 text-center whitespace-nowrap rounded-[32px] text-blue-950">
            <Navbar />
            <div className="flex-auto my-auto text-xl font-semibold">
              Dashboard
            </div>
          </div>
          <div className="w-full flex justify-between items-center mt-6">
            <div className="w-[10rem] flex justify-center items-center px-2 py-4 text-sm font-medium text-white">
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="id"
              >
                <DatePicker
                  name="tanggalAwal"
                  locale="id"
                  label="Tanggal Awal"
                  value={this.state.tanggalAwal}
                  onChange={(selectedDate) =>
                    this.handleFilter("tanggalAwal", selectedDate)
                  }
                  inputFormat="DD/MM/YYYY"
                  renderInput={(params) => (
                    <TextField {...params} placeholder="dd/mm/yyyy" fullWidth />
                  )}
                />
              </LocalizationProvider>
            </div>
            -
            <div className="w-[10rem] flex justify-center items-center px-2 py-4 text-sm font-medium text-white">
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="id"
              >
                <DatePicker
                  name="tanggalAwal"
                  locale="id"
                  label="Tanggal Akhir"
                  value={this.state.tanggalAkhir}
                  onChange={(selectedDate) =>
                    this.handleFilter("tanggalAkhir", selectedDate)
                  }
                  inputFormat="DD/MM/YYYY"
                  renderInput={(params) => (
                    <TextField {...params} placeholder="dd/mm/yyyy" fullWidth />
                  )}
                />
              </LocalizationProvider>
            </div>
          </div>
          <div className="flex gap-5 justify-between px-5 py-7 mt-1 w-full text-base leading-5 bg-white rounded-2xl border border-solid border-zinc-100 shadow-xl">
            <div className="flex flex-col text-blue-950 w-full">
              <div className="text-base tracking-wide leading-7 text-start pb-3 border-b border-b-blue-500 mb-4 font-semibold">
                {this.state.user.display_name}
              </div>
              <div className="w-[100%]  flex justify-between items-center font-semibold">
                <div className="flex flex-col  capitalize">
                  <div className=" text-blue-500 capitalize">dari</div>
                  <div className="mt-3 capitalize font-medium  rounded-md">
                    {this.state.tanggalMulaiTampil}
                  </div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                >
                  <g fill="none">
                    <path
                      fill="#3B82F6"
                      d="M2 9c0-1.886 0-2.828.586-3.414C3.172 5 4.114 5 6 5h12c1.886 0 2.828 0 3.414.586C22 6.172 22 7.114 22 9c0 .471 0 .707-.146.854C21.707 10 21.47 10 21 10H3c-.471 0-.707 0-.854-.146C2 9.707 2 9.47 2 9"
                    />
                    <path
                      fill="#3B82F6"
                      fill-rule="evenodd"
                      d="M2.586 21.414C2 20.828 2 19.886 2 18v-5c0-.471 0-.707.146-.854C2.293 12 2.53 12 3 12h18c.471 0 .707 0 .854.146c.146.147.146.383.146.854v5c0 1.886 0 2.828-.586 3.414C20.828 22 19.886 22 18 22H6c-1.886 0-2.828 0-3.414-.586M8 16a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2z"
                      clip-rule="evenodd"
                    />
                    <path
                      stroke="#34D399"
                      stroke-linecap="round"
                      stroke-width="2"
                      d="M7 3v3m10-3v3"
                    />
                  </g>
                </svg>
                <div className="flex flex-col capitalize">
                  <div className="text-blue-500">Sampai</div>
                  <div className="mt-2.5 text-blue-950 font-medium">
                    {this.state.tanggalSelesaiTampil}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center px-4 pt-5 pb-8 mt-6 w-full shadow-xl tracking-wide text-center text-white bg-gradient-to-r from-blue-500 to-blue-800 rounded-2xl border border-blue-500 border-solid ">
            {this.state.loader == true ? (
              <>
                <LoadingComp />
              </>
            ) : (
              <>
                <div className="self-stretch text-base text-start font-semibold leading-7 pb-3 mb-4 border-b border-b-white">
                  {this.state.jumlahTrip} Perjalanan
                </div>

                <div className="flex  flex-col flex-start items-center gap-2 mt-3 w-full  ">
                  <div className="flex w-[100%] items-center justify-between">
                    <div className="flex gap-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="none"
                          stroke="white"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 12V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6m-10 6H3m18 0h-7m-8-3l-3 3l3 3m12-6l3 3l-3 3"
                        />
                      </svg>
                      <div className="text-sm leading-7 font-medium">
                        Total Jarak
                      </div>
                    </div>
                    <div className="text-base leading-7 font-semibold">
                      {this.state.totalJarak}
                    </div>
                  </div>
                  <div className="flex  w-[100%] items-center justify-between ">
                    <div className="flex gap-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="white"
                          d="M12 20c4.4 0 8-3.6 8-8s-3.6-8-8-8s-8 3.6-8 8s3.6 8 8 8m0-18c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12S6.5 2 12 2m.5 5v6H7v-1.5h4V7z"
                        />
                      </svg>
                      <div className="text-sm leading-7 font-medium">
                        Total Durasi
                      </div>
                    </div>
                    <div className="text-base leading-7 font-semibold">
                      {this.formatDurasi(this.state.totalDurasi)}
                    </div>
                  </div>
                </div>
                <div className="flex  flex-col flex-start items-center gap-2 mt-3 w-full  ">
                  <div className="flex w-[100%] items-center justify-between">
                    <div className="flex gap-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="none"
                          stroke="white"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="m14.5 10l-.035-.139A2.457 2.457 0 0 0 12.082 8h-.522a1.841 1.841 0 0 0-.684 3.55l2.248.9A1.841 1.841 0 0 1 12.44 16h-.521a2.457 2.457 0 0 1-2.384-1.861L9.5 14M12 6v2m0 8v2m9-6a9 9 0 1 1-18 0a9 9 0 0 1 18 0"
                        />
                      </svg>
                      <div className="text-sm leading-7 font-medium">
                        Total Pengajuan
                      </div>
                    </div>

                    <div className="text-base leading-7 font-semibold">
                      {this.formatRupiah(
                        this.state.totalPengajuan + this.state.totalParkir
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex  flex-col flex-start items-center gap-2 mt-3 w-full  ">
                  <div className="flex w-[100%] items-center justify-between">
                    <div className="flex gap-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="none"
                          stroke="white"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="m14.5 10l-.035-.139A2.457 2.457 0 0 0 12.082 8h-.522a1.841 1.841 0 0 0-.684 3.55l2.248.9A1.841 1.841 0 0 1 12.44 16h-.521a2.457 2.457 0 0 1-2.384-1.861L9.5 14M12 6v2m0 8v2m9-6a9 9 0 1 1-18 0a9 9 0 0 1 18 0"
                        />
                      </svg>
                      <div className="text-sm leading-7 font-medium">
                        Sudah Diklaim
                      </div>
                    </div>

                    <div className="text-base leading-7 font-semibold">
                      {this.formatRupiah(this.state.totalKlaim)}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="w-full px-3 flex flex-col gap-6 justify-center mt-5">
            <button
              onClick={() => {
                window.location.href = `/mytrip`;
              }}
              className="self-start text-base font-medium tracking-wide leading-7 text-center text-white bg-blue-500 w-full p-2 rounded-xl shadow-xl flex justify-center gap-5 items-center"
            >
              Perjalanan Saat Ini
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="white"
                  fill-rule="evenodd"
                  d="m9.005 4l8 8l-8 8L7 18l6.005-6L7 6z"
                />
              </svg>
            </button>
            {this.state.user.email == "akuntingkosasih@gmail.com" && (
              <>
                <button
                  onClick={() => {
                    window.location.href = `/dashboard`;
                  }}
                  className="self-start text-base font-medium tracking-wide leading-7 text-center text-white bg-blue-500 w-full p-2 rounded-xl shadow-xl flex justify-center gap-5 items-center"
                >
                  Dashboard Admin
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="white"
                      fill-rule="evenodd"
                      d="m9.005 4l8 8l-8 8L7 18l6.005-6L7 6z"
                    />
                  </svg>
                </button>
              </>
            )}
            {this.state.user.peran == "Scrum Master" && (
              <>
                <button
                  onClick={() => {
                    window.location.href = `/dashboard`;
                  }}
                  className="self-start text-base font-medium tracking-wide leading-7 text-center text-white bg-blue-500 w-full p-2 rounded-xl shadow-xl flex justify-center gap-5 items-center"
                >
                  Dashboard Admin
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="white"
                      fill-rule="evenodd"
                      d="m9.005 4l8 8l-8 8L7 18l6.005-6L7 6z"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
