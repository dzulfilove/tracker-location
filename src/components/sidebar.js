import React, { useEffect, useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { RiSettings4Line } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
import { AiOutlineUser, AiOutlineHeart } from "react-icons/ai";
import { AiOutlineAreaChart } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";
import { FiMessageSquare, FiFolder, FiShoppingCart } from "react-icons/fi";
import { Link, NavLink } from "react-router-dom";
import DashboardAdmin from "../pages/dashboardAdmin";
import Logo from "../assets/iconLogo.png";
import Tables from "./table";
import DataTable from "./table";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import Select from "react-tailwindcss-select";
import { DatePicker } from "@mui/x-date-pickers";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { dbImage } from "../config/firebase";
import AOS from "aos";
import { GrMoney } from "react-icons/gr";
import "aos/dist/aos.css";
import distance from "../assets/distance.png";
import Swal from "sweetalert2";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  updateDoc,
  addDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import Loading from "./loader";
import BarChartComponent from "./barChart";
import PieChartComponent from "./pieChart";
import LineChartComponent from "./lineChart";
import PieChartComponentKlaim from "./pieChartKlaim";
const Home = () => {
  const menus = [
    { name: "Statistik", link: "statistik", icon: AiOutlineAreaChart },
    { name: "Dashboard", link: "dashboard", icon: MdOutlineDashboard },

    // { name: "messages", link: "/", icon: FiMessageSquare },
    // { name: "File Manager", link: "/", icon: FiFolder },
    // { name: "Cart", link: "/", icon: FiShoppingCart },
    // { name: "Setting", link: "/", icon: RiSettings4Line },
  ];
  const [open, setOpen] = useState(true);
  const [menu, setMenu] = useState("dashboard");
  const [tanggalAwal, setTanggalAwal] = useState(
    dayjs("2024-05-01").locale("id")
  );
  const [tanggalAwalString, setTanggalAwalString] = useState("2024-05-01");

  const [tanggalAkhirString, setTanggalAkhirString] = useState(
    dayjs().locale("id").format("YYYY-MM-DD")
  );
  const [tanggalAkhir, setTanggalAkhir] = useState(dayjs().locale("id"));
  const [userData, setUserData] = useState([]);
  const [dataTerpilih, setDataTerpilh] = useState(null);
  const [dataTrips, setDataTrips] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);
  const [dataTripsBulan, setDataTripsBulan] = useState([]);
  const [dataTripsBulanKategori, setDataTripsBulanKategori] = useState([]);
  const [dataTripsTahun, setDataTripsTahun] = useState([]);
  const [dataDetailTrips, setDataDetailTrips] = useState([]);
  const [userFilter, setUserFilter] = useState(null);
  const [tripsDisplay, setTripsDisplay] = useState(null);
  const [tripsDisplayAwal, setTripsDisplayAwal] = useState(null);
  const [tripsLength, setTripsLength] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalJarak, setTotalJarak] = useState(0);
  const [totalDurasi, setTotalDurasi] = useState(0);
  const [totalTrip, setTotalTrip] = useState(0);
  const [totalParkir, setTotalParkir] = useState(0);
  const [totalKlaim, setTotalKlaim] = useState(0);
  const [nama, setNama] = useState("");
  const [totalPengajuan, setTotalPengajuan] = useState(0);
  const [title, setTitle] = useState("Dashboard");

  useEffect(() => {
    // Efek samping yang ingin dijalankan
    getAllUser();
    getAllTrips();
    AOS.init({ duration: 700 });
  }, []);

  const getAllUser = async () => {
    const lokasiCollection = collection(db, "User");
    try {
      const querySnapshot = await getDocs(lokasiCollection);
      const userList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      await new Promise((r) => {
        setUserData(userList);
      });
    } catch (error) {
      console.error("Error mengambil data lokasi: ", error);
    }
  };

  const getAllTrips = async () => {
    console.log(dataTerpilih, "terpilihdhdhdh");
    try {
      const tripsCollection = collection(db, "trips");
      const querySnapshot = await getDocs(tripsCollection);

      const tripList = [];
      for (const doc of querySnapshot.docs) {
        const tripData = doc.data();
        // Mendapatkan nama dokter dari referensi dokter_ref
        const userDoc = await getDoc(tripData.refUser);

        let nama = null;

        if (userDoc.data() == undefined) {
          console.log(userDoc, "dokkterrr");
          nama = "Nama";
        } else {
          nama = userDoc.data().display_name;
        }
        tripData.nama = nama;
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

      dataChart(hasil);
      const filteredTrips = hasil.filter((trip) => {
        const tripDate = new Date(trip.tanggal);
        const startDate = new Date(tanggalAwalString);
        const endDate = new Date(tanggalAkhirString);

        return tripDate >= startDate && tripDate <= endDate;
      });

      if (showDetail == true) {
        // // Filter dan sort data
        const filteredArray = filteredTrips.filter((data) => data.nama == nama);
        const sortData = sortByDateAndTimeDescending(filteredArray);
        handleDetailShow(sortData, dataTerpilih);

        // Tampilkan alert sukses
        console.log("Menampilkan Swal");
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Pengajuan Berhasil Di Klaim",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      const groupedTrips = filteredTrips.reduce((acc, trip) => {
        if (!acc[trip.nama]) {
          acc[trip.nama] = {
            nama: trip.nama,
            totalJarak: 0,
            totalNominal: 0,
            totalParkir: 0,
            totalDurasi: 0,
            jumlahTrip: 0,
          };
        }
        acc[trip.nama].totalJarak += parseFloat(trip.jarakKompensasi);
        acc[trip.nama].totalNominal += parseFloat(trip.nominal);
        acc[trip.nama].totalParkir += parseFloat(
          trip.biayaParkir ? trip.biayaParkir : 0
        );
        acc[trip.nama].totalDurasi += trip.durasi;
        acc[trip.nama].jumlahTrip += 1;
        return acc;
      }, {});

      const finalGroupedTrips = Object.values(groupedTrips);

      const jumlah = finalGroupedTrips.length;

      await new Promise((resolve) => {
        setDataFilter(filteredTrips);
        setShowLoader(false);
        setDataTrips(hasil);
        setTripsLength(jumlah);
        setTripsDisplay(finalGroupedTrips);
        setTripsDisplayAwal(finalGroupedTrips);
      });
    } catch (error) {
      console.error("Error fetching data: ", error);
      throw error;
    }
  };

  const hanldeClearFilter = () => {
    setUserFilter(null);
    const filteredTrips = dataTrips.filter((trip) => {
      const tripDate = new Date(trip.tanggal);
      const startDate = new Date(tanggalAwalString);
      const endDate = new Date(tanggalAkhirString);

      return tripDate >= startDate && tripDate <= endDate;
    });
    const groupedTrips = filteredTrips.reduce((acc, trip) => {
      if (!acc[trip.nama]) {
        acc[trip.nama] = {
          nama: trip.nama,
          totalJarak: 0,
          totalNominal: 0,
          totalParkir: 0,
          totalDurasi: 0,
          jumlahTrip: 0,
        };
      }
      acc[trip.nama].totalJarak += parseFloat(trip.jarakKompensasi);
      acc[trip.nama].totalNominal += parseFloat(trip.nominal);
      acc[trip.nama].totalParkir += parseFloat(
        trip.biayaParkir ? trip.biayaParkir : 0
      );
      acc[trip.nama].totalDurasi += trip.durasi;
      acc[trip.nama].jumlahTrip += 1;
      return acc;
    }, {});

    const finalGroupedTrips = Object.values(groupedTrips);
    setTripsDisplay(finalGroupedTrips);
    setDataFilter(filteredTrips);
  };
  const handleFilterTanggal = (name, value) => {
    const dayjsDate = dayjs(value);

    let tanggalMulai = tanggalAwalString;
    let tanggalSelesai = tanggalAkhirString;

    if (!dayjsDate.isValid()) {
      return;
    }

    const formattedDate = dayjsDate.format("YYYY-MM-DD");

    if (name == "tanggalAwal") {
      tanggalMulai = formattedDate;
      setTanggalAwal(value);
      setTanggalAwalString(formattedDate);
    } else {
      tanggalSelesai = formattedDate;
      setTanggalAkhir(value);
      setTanggalAkhirString(formattedDate);
    }

    const filteredTrips = dataTrips.filter((trip) => {
      const tripDate = new Date(trip.tanggal);
      const startDate = new Date(tanggalMulai);
      const endDate = new Date(tanggalSelesai);

      return tripDate >= startDate && tripDate <= endDate;
    });

    const groupedTrips = filteredTrips.reduce((acc, trip) => {
      if (!acc[trip.nama]) {
        acc[trip.nama] = {
          nama: trip.nama,
          totalJarak: 0,
          totalNominal: 0,
          totalParkir: 0,
          totalDurasi: 0,
          jumlahTrip: 0,
        };
      }
      acc[trip.nama].totalJarak += parseFloat(trip.jarakKompensasi);
      acc[trip.nama].totalNominal += parseFloat(trip.nominal);
      acc[trip.nama].totalParkir += parseFloat(
        trip.biayaParkir ? trip.biayaParkir : 0
      );
      acc[trip.nama].totalDurasi += trip.durasi;
      acc[trip.nama].jumlahTrip += 1;
      return acc;
    }, {});

    setDataFilter(filteredTrips);
    const finalGroupedTrips = Object.values(groupedTrips);
    if (userFilter == null) {
      setTripsDisplay(finalGroupedTrips);
    } else {
      const filteredUser = finalGroupedTrips.filter(
        (item) => item.nama == userFilter.label
      );
      setTripsDisplay(filteredUser);
    }
  };

  const handleFilterUser = (value) => {
    let tanggalMulai = tanggalAwalString;
    let tanggalSelesai = tanggalAkhirString;

    const filteredTrips = dataTrips.filter((trip) => {
      const tripDate = new Date(trip.tanggal);
      const startDate = new Date(tanggalMulai);
      const endDate = new Date(tanggalSelesai);

      return tripDate >= startDate && tripDate <= endDate;
    });

    const groupedTrips = filteredTrips.reduce((acc, trip) => {
      if (!acc[trip.nama]) {
        acc[trip.nama] = {
          nama: trip.nama,
          totalJarak: 0,
          totalNominal: 0,
          totalParkir: 0,
          totalDurasi: 0,
          jumlahTrip: 0,
        };
      }
      acc[trip.nama].totalJarak += parseFloat(trip.jarakKompensasi);
      acc[trip.nama].totalNominal += parseFloat(trip.nominal);
      acc[trip.nama].totalParkir += parseFloat(
        trip.biayaParkir ? trip.biayaParkir : 0
      );
      acc[trip.nama].totalDurasi += trip.durasi;
      acc[trip.nama].jumlahTrip += 1;
      return acc;
    }, {});

    const finalGroupedTrips = Object.values(groupedTrips);
    setTripsDisplay(finalGroupedTrips);
    setUserFilter(value);

    const filteredArray = finalGroupedTrips.filter(
      (item) => item.nama == value.label
    );
    setDataFilter(filteredTrips);
    setTripsDisplay(filteredArray);
  };

  const optionsUser = userData.map(({ display_name, email }) => ({
    label: display_name ? display_name : "Tidak Ada Nama",
    value: email,
  }));

  const handleDetailShow = (array, data) => {
    console.log("adadadad", array);

    const totalKlaim = array.reduce((total, obj) => {
      if (obj.klaim) {
        return obj.biayaParkir
          ? parseFloat(obj.biayaParkir) + total + parseFloat(obj.nominal)
          : 0 + total + parseFloat(obj.nominal);
      }
      return total;
    }, 0);
    setShowDetail(true);
    setTitle("Detail Perjalanan");
    setNama(array[0].nama);
    setDataTerpilh(data);
    setDataDetailTrips(array);
    setTotalKlaim(totalKlaim);
    setTotalJarak(data.totalJarak);
    setTotalDurasi(data.totalDurasi);
    setTotalTrip(data.jumlahTrip);
    setTotalPengajuan(data.totalNominal);
    setTotalParkir(data.totalParkir);
  };

  const formatRupiah = (angka) => {
    const nilai = parseFloat(angka);
    return nilai.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };
  const formatDurasi = (durasi) => {
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
  };

  const handleMenu = (name) => {
    setMenu(name.link);
    if (name.link == "dashboard") {
      setShowDetail(false);
    }
    setTitle(name.name);
  };

  const dataChart = (array) => {
    // Mengubah string menjadi objek Date
    const tanggal = new Date(tanggalAkhirString);

    // Mendapatkan tahun dari objek Date
    const tahun = tanggal.getFullYear();

    // Mendapatkan bulan dari objek Date
    // Perlu ditambah 1 karena getMonth() mengembalikan nilai 0-11 untuk bulan Januari-Desember
    const bulan = tanggal.getMonth() + 1;

    const dataBulan = filterByMonth(array, bulan);
    const dataTahun = filterByYear(array, tahun);

    const groupedTripsBulan = dataBulan.reduce((acc, trip) => {
      if (!acc[trip.nama]) {
        acc[trip.nama] = {
          nama: trip.nama,
          totalJarak: 0,
          totalNominal: 0,
          totalParkir: 0,
          totalDurasi: 0,
          jumlahTrip: 0,
        };
      }
      acc[trip.nama].totalJarak += parseFloat(trip.jarakKompensasi);
      acc[trip.nama].totalNominal += parseFloat(trip.nominal);
      acc[trip.nama].totalParkir += parseFloat(
        trip.biayaParkir ? trip.biayaParkir : 0
      );
      acc[trip.nama].totalDurasi += trip.durasi;
      acc[trip.nama].jumlahTrip += 1;
      return acc;
    }, {});

    const finalGroupedTripsBulan = Object.values(groupedTripsBulan);

    setDataTripsBulan(finalGroupedTripsBulan);
    setDataTripsBulanKategori(dataBulan);
    setDataTripsTahun(dataTahun);
    console.log(`bulan ${bulan}`, finalGroupedTripsBulan);
  };
  // Fungsi untuk memfilter berdasarkan bulan
  function filterByMonth(dataArray, month) {
    return dataArray.filter((obj) => {
      const objMonth = new Date(obj.tanggal).getMonth() + 1; // getMonth() returns month from 0-11
      return objMonth === month;
    });
  }

  // Fungsi untuk memfilter berdasarkan tahun
  function filterByYear(dataArray, year) {
    return dataArray.filter((obj) => {
      const objYear = new Date(obj.tanggal).getFullYear();
      return objYear === year;
    });
  }

  const formatBulan = (tanggal) => {
    const bulan = dayjs(tanggal).locale("id").format("MMMM");
    const hasil =
      tanggal.substring(8, 10) + " " + bulan + " " + tanggal.substring(0, 4);
    console.log("tanggal", dayjs(tanggal).locale("id").format("MMMM"));

    return bulan;
  };
  const sortByDateAndTimeDescending = (arrayObjek) => {
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

  const formatTahun = (tanggal) => {
    const bulan = dayjs(tanggal).locale("id").format("YYYY");

    return bulan;
  };
  async function handleKlaim() {
    try {
      setLoading(true);

      // Buat array promise untuk setiap pembaruan dokumen
      const updatePromises = dataDetailTrips.map(async (trip) => {
        const docRef = doc(db, "trips", trip.id);
        await updateDoc(docRef, {
          klaim: true,
        });
        console.log(`Trip dengan ID ${trip.id} berhasil diperbarui.`);
      });

      // Tunggu semua promise selesai
      await Promise.all(updatePromises);

      // Ambil data trip terbaru
      await getAllTrips();
    } catch (error) {
      console.error(`Gagal memperbarui trip:`, error);
    }
  }

  console.log(dataTrips, "data");
  return (
    <section className="flex gap-6 bg-[#F1F5F9]">
      <div
        className={`bg-blue-800 min-h-screen pl-8 ${
          open ? "w-72" : "w-[6rem]"
        } duration-500 text-gray-100 px-4 text-xl`}
      >
        <div className="py-3 flex justify-end">
          <HiMenuAlt3
            size={26}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div
          className={`flex ${
            open ? "px-4" : "px-0"
          }items-center justify-center gap-2 py-5.5 lg:py-6.5 mb-10 mt-3 `}
        >
          <NavLink
            className="flex px-1 justify-start gap-5 w-full items-center text-blue-100"
            to="/dashboard"
          >
            {/* <img
              loading="lazy"
              src={Logo}
              className="shrink-0  w-8  h-8 bg-slate-900 rounded-xl object-cover"
            /> */}
            <FaRegUser />
            {open && (
              <>
                <h5
                  style={{
                    transitionDelay: `${4}00ms`,
                  }}
                  className={`text-xl font-semibold text-blue-100 text-center whitespace-pre duration-500 ${
                    !open && "opacity-0 translate-x-28 overflow-hidden"
                  }`}
                >
                  Halo Admin
                </h5>
              </>
            )}
          </NavLink>
        </div>

        <div
          className={`${open ? "p-2" : "p-0"} text-base w-full  text-blue-200 `}
        >
          Menu
        </div>
        <div className="mt-4 flex flex-col gap-4 relative text-blue-100">
          {menus?.map((menu, i) => (
            <button
              onClick={() => {
                handleMenu(menu);
              }}
              key={i}
              className={` ${
                menu?.margin && "mt-5"
              } group flex items-center text-base  gap-3.5 font-medium p-2 hover:bg-blue-600 rounded-md`}
            >
              <div>{React.createElement(menu?.icon, { size: "20" })}</div>
              <h2
                style={{
                  transitionDelay: `${i + 3}00ms`,
                }}
                className={`whitespace-pre duration-500 ${
                  !open && "opacity-0 translate-x-28 overflow-hidden"
                }`}
              >
                {menu?.name}
              </h2>
              <h2
                className={`${
                  open && "hidden"
                } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
              >
                {menu?.name}
              </h2>
            </button>
          ))}
        </div>
      </div>
      <div className=" mt-8 text-xl text-gray-900 font-semibold w-full flex flex-col justify-start items-center ">
        <div className="flex w-full mt-6 h-full flex-col justify-start items-center gap-6 ">
          <div
            data-aos="slide-down"
            className="w-[90%] flex justify-start items-center  text-2xl font-semibold bg-white shadow-md p-4 py-6 rounded-xl"
          >
            {menu == "dashboard" && (
              <>
                {showDetail == true && (
                  <>
                    <button
                      onClick={() => {
                        setShowDetail(false);
                        setTitle("Dashboard");
                      }}
                      className="w-8 h-8 flex justify-center items-center rounded-lg  mr-3"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill="#3B82F6"
                          d="M7.4 12.5L3.8 9H16V7H3.8l3.6-3.5l-1.5-1.4L0 8l5.9 5.9z"
                        />
                      </svg>
                    </button>{" "}
                  </>
                )}
              </>
            )}
            {title}
          </div>
          {menu == "dashboard" ? (
            <>
              {showDetail == true ? (
                <>
                  <div className="flex justify-between items-center w-[90%] h-auto">
                    <div className="flex p-8 flex-col justify-center items-start gap-1 w-[31.5rem] h-[12rem] bg-white rounded-xl shadow-md  ">
                      <div className="flex justify-start items-center ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#3B82F6"
                            d="M14.844 20H6.5C5.121 20 4 18.879 4 17.5S5.121 15 6.5 15h7c1.93 0 3.5-1.57 3.5-3.5S15.43 8 13.5 8H8.639a9.812 9.812 0 0 1-1.354 2H13.5c.827 0 1.5.673 1.5 1.5s-.673 1.5-1.5 1.5h-7C4.019 13 2 15.019 2 17.5S4.019 22 6.5 22h9.593a10.415 10.415 0 0 1-1.249-2M5 2C3.346 2 2 3.346 2 5c0 3.188 3 5 3 5s3-1.813 3-5c0-1.654-1.346-3-3-3m0 4.5a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 5 6.5"
                          />
                          <path
                            fill="#3B82F6"
                            d="M19 14c-1.654 0-3 1.346-3 3c0 3.188 3 5 3 5s3-1.813 3-5c0-1.654-1.346-3-3-3m0 4.5a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 19 18.5"
                          />
                        </svg>
                      </div>
                      <h5 className="text-gray-700 text-base font-normal mt-4">
                        Total Perjalanan
                      </h5>
                      <h3 className="text-gray-700 text-2xl font-semibold">
                        {totalTrip} Perjalanan
                      </h3>
                    </div>

                    <div className="flex p-8 flex-col justify-center items-start gap-1 w-[28rem] h-[12rem] bg-white rounded-xl shadow-md ">
                      <div className="flex justify-start items-center ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#3B82F6"
                            d="M6.5 8.11c-.89 0-1.61-.72-1.61-1.61A1.61 1.61 0 0 1 6.5 4.89c.89 0 1.61.72 1.61 1.61A1.61 1.61 0 0 1 6.5 8.11M6.5 2C4 2 2 4 2 6.5c0 3.37 4.5 8.36 4.5 8.36S11 9.87 11 6.5C11 4 9 2 6.5 2m11 6.11a1.61 1.61 0 0 1-1.61-1.61a1.609 1.609 0 1 1 3.22 0a1.61 1.61 0 0 1-1.61 1.61m0-6.11C15 2 13 4 13 6.5c0 3.37 4.5 8.36 4.5 8.36S22 9.87 22 6.5C22 4 20 2 17.5 2m0 14c-1.27 0-2.4.8-2.82 2H9.32a3 3 0 0 0-3.82-1.83A3.003 3.003 0 0 0 3.66 20a3.017 3.017 0 0 0 3.84 1.83c.85-.3 1.5-.98 1.82-1.83h5.37c.55 1.56 2.27 2.38 3.81 1.83A3 3 0 0 0 20.35 18c-.43-1.2-1.57-2-2.85-2m0 4.5A1.5 1.5 0 0 1 16 19a1.5 1.5 0 0 1 1.5-1.5A1.5 1.5 0 0 1 19 19a1.5 1.5 0 0 1-1.5 1.5"
                          />
                        </svg>
                      </div>
                      <h5 className="text-gray-700 text-base font-normal mt-4">
                        Total Jarak
                      </h5>
                      <h3 className="text-gray-700 text-2xl font-semibold">
                        {parseFloat(totalJarak.toFixed(2))} KM
                      </h3>
                    </div>

                    <div className="flex p-8 flex-col justify-center items-start gap-1 w-[28rem] h-[12rem] bg-white rounded-xl shadow-md ">
                      <div className="flex justify-start items-center ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#3B82F6"
                            d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16m1-8h4v2h-6V7h2z"
                          />
                        </svg>
                      </div>
                      <h5 className="text-gray-700 text-base font-normal mt-4">
                        Total Durasi
                      </h5>
                      <h3 className="text-gray-700 text-2xl font-semibold">
                        {formatDurasi(totalDurasi)}
                      </h3>
                    </div>
                  </div>
                  <div className="flex justify-between items-center w-[90%] h-auto">
                    <div className="flex p-8 flex-col justify-center items-start gap-1 w-[22.5rem] h-[13rem] bg-white rounded-xl shadow-md ">
                      <div className="flex justify-start items-center ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          viewBox="0 0 24 24"
                        >
                          <g
                            fill="none"
                            stroke="#3B82F6"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.5"
                            color="#3B82F6"
                          >
                            <path d="M20.943 16.835a15.76 15.76 0 0 0-4.476-8.616c-.517-.503-.775-.754-1.346-.986C14.55 7 14.059 7 13.078 7h-2.156c-.981 0-1.472 0-2.043.233c-.57.232-.83.483-1.346.986a15.76 15.76 0 0 0-4.476 8.616C2.57 19.773 5.28 22 8.308 22h7.384c3.029 0 5.74-2.227 5.25-5.165" />
                            <path d="M7.257 4.443c-.207-.3-.506-.708.112-.8c.635-.096 1.294.338 1.94.33c.583-.009.88-.268 1.2-.638C10.845 2.946 11.365 2 12 2s1.155.946 1.491 1.335c.32.37.617.63 1.2.637c.646.01 1.305-.425 1.94-.33c.618.093.319.5.112.8l-.932 1.359c-.4.58-.599.87-1.017 1.035S13.837 7 12.758 7h-1.516c-1.08 0-1.619 0-2.036-.164S8.589 6.38 8.189 5.8zm6.37 8.476c-.216-.799-1.317-1.519-2.638-.98s-1.53 2.272.467 2.457c.904.083 1.492-.097 2.031.412c.54.508.64 1.923-.739 2.304c-1.377.381-2.742-.214-2.89-1.06m1.984-5.06v.761m0 5.476v.764" />
                          </g>
                        </svg>
                      </div>
                      <h5 className="text-gray-700 text-base font-normal mt-4">
                        Total Biaya Parkir
                      </h5>
                      <h3 className="text-gray-700 text-2xl font-semibold">
                        {formatRupiah(totalParkir)}
                      </h3>
                    </div>
                    <div className="flex p-8 flex-col justify-center items-start gap-1 w-[22.5rem] h-[13rem] bg-white rounded-xl shadow-md ">
                      <div className="flex justify-between items-center w-full ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#3B82F6"
                            fill-rule="evenodd"
                            d="M11.948 1.25h.104c.899 0 1.648 0 2.242.08c.628.084 1.195.27 1.65.725c.456.456.642 1.023.726 1.65c.06.44.075.964.079 1.57c.648.021 1.226.06 1.74.128c1.172.158 2.121.49 2.87 1.238c.748.749 1.08 1.698 1.238 2.87c.153 1.14.153 2.595.153 4.433v.112c0 1.838 0 3.294-.153 4.433c-.158 1.172-.49 2.121-1.238 2.87c-.749.748-1.698 1.08-2.87 1.238c-1.14.153-2.595.153-4.433.153H9.944c-1.838 0-3.294 0-4.433-.153c-1.172-.158-2.121-.49-2.87-1.238c-.748-.749-1.08-1.698-1.238-2.87c-.153-1.14-.153-2.595-.153-4.433v-.112c0-1.838 0-3.294.153-4.433c.158-1.172.49-2.121 1.238-2.87c.749-.748 1.698-1.08 2.87-1.238a17.54 17.54 0 0 1 1.74-.128c.004-.606.02-1.13.079-1.57c.084-.627.27-1.194.725-1.65c.456-.455 1.023-.64 1.65-.725c.595-.08 1.345-.08 2.243-.08M8.752 5.252c.378-.002.775-.002 1.192-.002h4.112c.417 0 .814 0 1.192.002c-.004-.57-.018-1-.064-1.347c-.063-.461-.17-.659-.3-.789c-.13-.13-.328-.237-.79-.3c-.482-.064-1.13-.066-2.094-.066s-1.612.002-2.095.067c-.461.062-.659.169-.789.3c-.13.13-.237.327-.3.788c-.046.346-.06.776-.064 1.347M5.71 6.89c-1.006.135-1.586.389-2.01.812c-.422.423-.676 1.003-.811 2.009c-.138 1.027-.14 2.382-.14 4.289c0 1.907.002 3.262.14 4.29c.135 1.005.389 1.585.812 2.008c.423.423 1.003.677 2.009.812c1.028.138 2.382.14 4.289.14h4c1.907 0 3.262-.002 4.29-.14c1.005-.135 1.585-.389 2.008-.812c.423-.423.677-1.003.812-2.009c.138-1.027.14-2.382.14-4.289c0-1.907-.002-3.261-.14-4.29c-.135-1.005-.389-1.585-.812-2.008c-.423-.423-1.003-.677-2.009-.812c-1.027-.138-2.382-.14-4.289-.14h-4c-1.907 0-3.261.002-4.29.14M12 9.25a.75.75 0 0 1 .75.75v.01c1.089.274 2 1.133 2 2.323a.75.75 0 0 1-1.5 0c0-.384-.426-.916-1.25-.916c-.824 0-1.25.532-1.25.916s.426.917 1.25.917c1.385 0 2.75.96 2.75 2.417c0 1.19-.911 2.048-2 2.323V18a.75.75 0 0 1-1.5 0v-.01c-1.089-.274-2-1.133-2-2.323a.75.75 0 0 1 1.5 0c0 .384.426.916 1.25.916c.824 0 1.25-.532 1.25-.916s-.426-.917-1.25-.917c-1.385 0-2.75-.96-2.75-2.417c0-1.19.911-2.049 2-2.323V10a.75.75 0 0 1 .75-.75"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                      <h5 className="text-gray-700 text-base font-normal mt-4">
                        Total Nominal
                      </h5>
                      <h3 className="text-gray-700 text-2xl font-semibold">
                        {formatRupiah(totalPengajuan)}
                      </h3>
                    </div>
                    <div className="flex p-8 flex-col justify-center items-start gap-1 w-[42rem] h-[13rem] bg-white rounded-xl shadow-md ">
                      <div className="w-full flex justify-between items-center mt-1">
                        <div className="w-[37%] flex justify-between items-center mt-1 ">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="38"
                            height="38"
                            viewBox="0 0 24 24"
                          >
                            <g
                              fill="none"
                              stroke="#3B82F6"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="1.5"
                              color="#3B82F6"
                            >
                              <path d="m19.333 14l.824.758c.179.176.268.264.237.339s-.159.075-.412.075h-3.104C15.288 15.172 14 16.438 14 18c0 .352.066.69.185 1m2.482 3l-.824-.758c-.179-.176-.268-.264-.237-.339s.159-.075.412-.075h3.104C20.712 20.828 22 19.562 22 18c0-.352-.066-.69-.185-1" />
                              <path d="M21.991 11.5C22 10.9 22 10.736 22 10c0-3.771 0-5.657-1.172-6.828S17.771 2 14 2h-4C6.229 2 4.343 2 3.172 3.172S2 6.229 2 10s0 5.657 1.172 6.828S6.229 18 10 18h1m7.5-8h-.009M5.5 10h-.009" />
                              <path d="M14.5 10a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0" />
                            </g>
                          </svg>
                          <h5 className="text-gray-700 text-xl font-semibold">
                            Total Pengajuan
                          </h5>
                        </div>

                        <h3 className="text-gray-700 text-2xl font-semibold">
                          {formatRupiah(totalPengajuan + totalParkir)}
                        </h3>
                      </div>

                      <div className="w-full flex justify-between items-center mt-3">
                        <p className="text-base font-normal text-teal-500  bg-teal-50 border border-teal-500 px-2 py-1 rounded-md">
                          {" "}
                          Sudah Diklaim
                        </p>
                        <p className="text-base font-normal ">
                          {" "}
                          {formatRupiah(totalKlaim)}
                        </p>
                      </div>
                      <div className="w-full flex justify-between items-center mt-1">
                        <div className="text-base font-normal text-blue-500 bg-blue-50 border border-blue-500 px-2 py-1 rounded-md ">
                          {" "}
                          Belum Diklaim
                        </div>
                        <p className="text-base font-normal ">
                          {" "}
                          {formatRupiah(
                            totalPengajuan + totalParkir - totalKlaim
                          )}
                        </p>
                      </div>
                      {totalPengajuan + totalParkir - totalKlaim > 0 && (
                        <>
                          <div className="w-full flex justify-end items-center mt-1">
                            {loading == true ? (
                              <>
                                <div className="text-base w-[40%] flex justify-center gap-5 items-center font-normal bg-blue-500 text-blue-50 border border-blue-500 px-2 py-1 rounded-md ">
                                  Loading{" "}
                                  <AiOutlineLoading3Quarters className="w-7 h-7 animate-spin" />
                                  {/* Klaim Semua */}
                                </div>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={handleKlaim}
                                  className="text-base w-[40%] flex justify-center items-center font-normal bg-blue-500 text-blue-50 border border-blue-500 px-2 py-1 rounded-md "
                                >
                                  Klaim Semua
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  {showLoader == false ? (
                    <>
                      <DataTable
                        data-aos="fade-up"
                        data-aos-delay="150"
                        data={tripsDisplay}
                        jumlah={tripsLength}
                        showDetail={showDetail}
                        detailData={dataDetailTrips}
                        dataTrips={dataFilter}
                      />{" "}
                    </>
                  ) : (
                    <>
                      <Loading />
                    </>
                  )}
                </>
              ) : (
                <>
                  <div
                    className="w-[90%] flex justify-between items-end  text-2xl font-semibold   "
                    style={{ zIndex: "99999" }}
                  >
                    <div className="w-auto flex z-[999] justify-start gap-3 items-center p-2 border shadow-md bg-white rounded-xl">
                      <div className="flex items-center justify-center z-[999] w-[20rem]">
                        <Select
                          options={optionsUser}
                          name="Lokasi"
                          placeholder="Pilih User"
                          value={userFilter}
                          isSearchable
                          onChange={handleFilterUser}
                          classNames={{
                            menuButton: ({ isDisabled }) =>
                              `ps-3 text-[15px] flex text-base hover:cursor-pointer z-[999] text-blue-500 w-[100%] rounded-lg  transition-all duration-300 focus:outline-none ${
                                isDisabled
                                  ? ""
                                  : " focus:ring focus:ring-blue-500/20"
                              }`,
                            menu: "h-[34rem] overflow-y-scroll  bg-white absolute w-full bg-slate-50 shadow-lg z-[999] w-[100%] border rounded py-1 mt-1.5 text-base text-gray-700",
                            listItem: ({ isSelected }) =>
                              `block transition duration-200 px-2 py-2 cursor-pointer z-[999] select-none truncate rounded-lg ${
                                isSelected
                                  ? "text-blue-500 bg-slate-50"
                                  : "text-blue-500 hover:bg-blue-100 hover:text-blue-500"
                              }`,
                          }}
                        />
                        <button
                          onClick={hanldeClearFilter}
                          className="w-8 h-8 flex justify-center items-center rounded-lg  mr-3"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="#3B82F6"
                              d="m14.031 1.888l9.657 9.657l-8.345 8.345l-.27.272H20v2H6.748L.253 15.667zm.322 16.164l6.507-6.507l-6.829-6.828l-6.828 6.828l6.828 6.828l.32-.323zM5.788 12.96l-2.707 2.707l4.495 4.495h4.68l.365-.37z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="w-auto flex justify-start gap-3 items-center p-2 px-6 border shadow-md bg-white rounded-xl">
                      <div className="w-[10rem] flex justify-center items-center px-2 py-4 text-sm font-medium ">
                        <LocalizationProvider
                          dateAdapter={AdapterDayjs}
                          adapterLocale="id"
                        >
                          <DatePicker
                            name="tanggalAwal"
                            locale="id"
                            className="bg-white"
                            label="Tanggal Awal"
                            value={tanggalAwal}
                            onChange={(selectedDate) =>
                              handleFilterTanggal("tanggalAwal", selectedDate)
                            }
                            inputFormat="DD/MM/YYYY"
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="dd/mm/yyyy"
                                fullWidth
                              />
                            )}
                          />
                        </LocalizationProvider>
                      </div>
                      -
                      <div className="w-[10rem] flex justify-center items-center px-2 py-4 text-sm font-medium ">
                        <LocalizationProvider
                          dateAdapter={AdapterDayjs}
                          adapterLocale="id"
                        >
                          <DatePicker
                            name="tanggalAwal"
                            locale="id"
                            className="bg-white"
                            label="Tanggal Akhir"
                            value={tanggalAkhir}
                            onChange={(selectedDate) =>
                              handleFilterTanggal("tanggalAkhir", selectedDate)
                            }
                            inputFormat="DD/MM/YYYY"
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="dd/mm/yyyy"
                                fullWidth
                              />
                            )}
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                  </div>
                  {showLoader == false ? (
                    <>
                      <DataTable
                        data-aos="fade-up"
                        data-aos-delay="150"
                        data={tripsDisplay}
                        showDetail={showDetail}
                        jumlah={tripsLength}
                        dataTrips={dataFilter}
                        detailData={dataDetailTrips}
                        handleDetail={handleDetailShow}
                      />{" "}
                    </>
                  ) : (
                    <>
                      <Loading />
                    </>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <div className="flex justify-between items-center w-[90%] h-auto mt-5">
                <div
                  data-aos="slide-down"
                  className="bg-white rounded-xl shadow-md w-[62%] p-8 h-[25rem] flex flex-col justify-center items-start"
                >
                  <h3 className="text-lg font-medium mb-6 ">
                    Pengajuan Bulan {formatBulan(tanggalAkhirString)}
                  </h3>
                  <BarChartComponent dataBulan={dataTripsBulan} />
                </div>
                <div
                  data-aos="slide-down"
                  className="bg-white rounded-xl shadow-md w-[35%] p-8 flex h-[25rem] flex-col justify-center items-start"
                >
                  <h3 className="text-lg font-medium mb-6 ">
                    Kategori Perjalanan Bulan {formatBulan(tanggalAkhirString)}
                  </h3>
                  <PieChartComponent data={dataTripsBulanKategori} />
                </div>
              </div>
              <div
                data-aos="fade-up"
                className="flex justify-between items-center w-[90%] h-auto mt-5 "
              >
                <div className="bg-white rounded-xl shadow-md w-[35%] p-8 flex h-[25rem] flex-col justify-center items-start">
                  <h3 className="text-lg font-medium mb-6 ">
                    Kategori Perjalanan Tahun {formatTahun(tanggalAkhirString)}
                  </h3>
                  <PieChartComponent data={dataTripsTahun} />
                </div>
                <div
                  data-aos="fade-up"
                  className="bg-white rounded-xl shadow-md w-[62%] p-8 h-[25rem] flex flex-col justify-center items-start"
                >
                  <h3 className="text-lg font-medium mb-6 ">
                    Pengajuan Tahun {formatTahun(tanggalAkhirString)}
                  </h3>
                  <LineChartComponent data={dataTripsTahun} name={"nominal"} />
                </div>
              </div>

              <div
                data-aos="fade-up"
                className="flex justify-between items-center w-[90%] h-auto mt-5 mb-20"
              >
                <div className="bg-white rounded-xl shadow-md w-[48.5%] p-8 flex h-[25rem] flex-col justify-center items-start">
                  <h3 className="text-lg font-medium mb-6 ">
                    Jumlah Perjalanan Tahun {formatTahun(tanggalAkhirString)}
                  </h3>
                  <LineChartComponent
                    data={dataTripsTahun}
                    name={"perjalanan"}
                  />
                </div>
                <div
                  data-aos="fade-up"
                  className="bg-white rounded-xl shadow-md w-[48.5%] p-8 h-[25rem] flex flex-col justify-center items-start"
                >
                  <h3 className="text-lg font-medium mb-6 ">
                    Jumlah Durasi Tahun {formatTahun(tanggalAkhirString)}
                  </h3>
                  <LineChartComponent data={dataTripsTahun} name={"durasi"} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Home;
