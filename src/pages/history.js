import * as React from "react";
import Navbar from "../components/navbar";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers";
import AOS from "aos";

import "aos/dist/aos.css";
import Loading from "../components/loader";
dayjs.locale("id");

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tanggalAwal: dayjs("2024-05-01").locale("id"),
      tanggalAkhir: dayjs().locale("id"),
      tanggalAwalString: "2024-05-01",
      tanggalAkhirString: dayjs().locale("id").format("YYYY-MM-DD"),
      displayName: "",
      user: {},
      trips: [],
      filteredTrips: [],
      isFilter: false,
      loader: true,
    };
    this.sectionRef = React.createRef();
  }

  componentDidMount = async () => {
    const userEmail = localStorage.getItem("userEmail");
    await this.setState({ displayName: userEmail });
    AOS.init({ duration: 700 });
    await this.getAllHistory();
  };

  getUserLogin = async (email) => {
    try {
      const userRef = collection(db, "User");
      const q = query(userRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return null;
      }
      const userData = querySnapshot.docs[0].data();

      await new Promise((resolve) => {
        this.setState({ user: userData }, resolve);
      });

      return userData;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  getAllHistory = async () => {
    await this.getUserLogin(this.state.displayName);
    const { user } = this.state;
    try {
      const userRef = doc(db, "User", user.uid);
      const tripsCollection = collection(db, "trips");
      const userTripsQuery = query(
        tripsCollection,
        where("refUser", "==", userRef),
        where("status", "==", "Selesai")
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

      const sortir = this.sortirBerdasarkanTanggalDanJamKeluarDesc(tripList);

      await new Promise((resolve) => {
        this.setState({ trips: sortir, loader: false }, resolve);
      });
    } catch (error) {
      console.error("Error fetching data: ", error);
      throw error;
    }
  };
  sortirBerdasarkanTanggalDanJamKeluarDesc = (arrayObjek) => {
    arrayObjek.sort((a, b) => {
      // Memisahkan tahun, bulan, dan hari dari string tanggal pada setiap objek
      let [tahunA, bulanA, hariA] = a.tanggal.split("-").map(Number);
      let [tahunB, bulanB, hariB] = b.tanggal.split("-").map(Number);

      // Membandingkan tanggal dari dua objek
      if (tahunA !== tahunB) {
        return tahunB - tahunA;
      } else if (bulanA !== bulanB) {
        return bulanB - bulanA;
      } else if (hariA !== hariB) {
        return hariB - hariA;
      } else {
        // Jika tanggalnya sama, membandingkan jam dan menit dari jamSampai pada lokasiAkhir
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
      }
    });

    return arrayObjek;
  };

  handleClick = () => {
    // Pastikan sectionRef sudah terinisialisasi sebelum mencoba mengaksesnya
    if (this.sectionRef.current) {
      this.sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
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

    const sort = this.sortirBerdasarkanTanggalDanJamKeluarDesc(filteredTrips);
    this.setState({ filteredTrips: sort, isFilter: true });
  };

  render() {
    return (
      <div
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
        <div className="font-DM flex flex-col px-4 pt-7 pb-8 mx-auto w-full bg-white   rounded-[32px]">
          <button className="floating-btn" onClick={this.handleClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="white"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="m17 14l-5-5m0 0l-5 5"
              />
            </svg>
          </button>
          <div className="flex gap-12 text-xl justify-start items-center font-bold tracking-wide leading-7 text-center robaseded-[32px] ">
            <Navbar />
            <div className=" self-start font-semibold text-xl">
              Riwayat Perjalanan
            </div>
          </div>
          <div
            data-aos="flip-up"
            ref={this.sectionRef}
            className="w-full flex justify-between items-center mt-6"
          >
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
          <div
            data-aos="slide-down"
            className=" bg-gradient-to-r from-blue-500 to-blue-800 text-white w-full  p-3 rounded-lg flex-auto self-start mt-4 text-base  font-medium"
          >
            Data Perjalanan
          </div>
          {this.state.loader == true ? (
            <>
              <Loading data-aos="fade-up" data-aos-delay="300" />
            </>
          ) : (
            <>
              {this.state.trips.length > 0 ? (
                <>
                  {this.state.isFilter ? (
                    <div
                      // data-aos="slide-down"
                      className="flex flex-col px-5 mt-6 capitalize bg-blue-100 rounded-2xl pb-7  "
                    >
                      {this.state.filteredTrips.map((trip) => (
                        <div
                          data-aos="fade-up"
                          key={trip.id}
                          onClick={() => {
                            window.location.href = `/detail-trip/${trip.id}`;
                          }}
                          className="flex flex-col justify-center mt-8 w-full text-xs font-bold leading-5 capitalize bg-white rounded-2xl "
                        >
                          <div className="flex gap-3.5 px-2 py-2.5 bg-white rounded-2xl border  border-solid shadow-md">
                            <img
                              loading="lazy"
                              srcSet={trip.fotoBukti}
                              className="shrink-0 aspect-[0.81] w-[30%] rounded-md object-cover"
                            />
                            <div className="flex flex-col self-start mt-1.5 w-[65%]">
                              <div className="text-base leading-5 flex flex-wrap w-full font-medium  ">
                                {trip.alasan}
                              </div>
                              <div className="mt-2 text-sm font-medium leading-5 text-start text-stone-500">
                                {trip.tanggal}
                              </div>
                              <div className="mt-2.5 text-start text-blue-500">
                                {trip.lokasiAwal[0].lokasi} -{" "}
                                {trip.lokasiAkhir[0].lokasi}
                              </div>
                              <div className="flex text-sm font-medium justify-center items-start p-2 w-full mt-2.5 text-right text-white bg-blue-500 rounded-lg">
                                {Math.round(trip.jarak)} KM ({trip.durasi}{" "}
                                Menit)
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col px-5 mt-6 capitalize bg-blue-100 rounded-2xl pb-7  ">
                      {this.state.trips.map((trip, index) => (
                        <div
                          data-aos={index == 2 ? "" : "fade-up"}
                          key={trip.id}
                          onClick={() => {
                            window.location.href = `/detail-trip/${trip.id}`;
                          }}
                          className="flex flex-col justify-center mt-8 w-full text-xs font-bold leading-5 capitalize bg-white rounded-2xl "
                        >
                          <div className="flex gap-3.5 px-2 py-2.5 bg-white rounded-2xl border  border-solid shadow-md">
                            <img
                              loading="lazy"
                              srcSet={trip.fotoBukti}
                              className="shrink-0 aspect-[0.81] w-[30%] rounded-md object-cover"
                            />
                            <div className="flex flex-col self-start mt-1.5 w-[65%]">
                              <div className="text-base leading-5 flex flex-wrap w-full font-medium  ">
                                {trip.alasan}
                              </div>
                              <div className="mt-2 text-sm font-medium leading-5 text-start text-stone-500">
                                {trip.tanggal}
                              </div>
                              <div className="mt-2.5 text-start text-blue-500">
                                {trip.lokasiAwal[0].lokasi} -{" "}
                                {trip.lokasiAkhir[0].lokasi}
                              </div>
                              <div className="flex text-sm font-medium justify-center items-start p-2 w-full mt-2.5 text-right text-white bg-blue-500 rounded-lg">
                                {Math.round(trip.jarak)} KM ({trip.durasi}{" "}
                                Menit)
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div
                    data-aos="fade-up"
                    data-aos-delay="300"
                    className="flex flex-col text-center max-w-[360px] mt-5"
                  >
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/0c65606ebee1b6385716d2b992b9da1ce85e7d156aec662e98ee133e4645beff?"
                      className="self-center w-full aspect-[1.37] max-w-[250px] "
                    />
                    <div className="mt-4 w-full text-lg font-medium text-blue-600">
                      Aktifitas masih kosong
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
}

export default History;
