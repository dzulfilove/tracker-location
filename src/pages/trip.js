import * as React from "react";
import Navbar from "../components/navbar";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { Link } from "react-router-dom";
import Person from "../assets/person.png";
import AOS from "aos";

import "aos/dist/aos.css";
import Loading from "../components/loader";
class MyTrip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: "",
      trips: [],
      tripSelesai: [],
      tripBelumSampai: [],
      user: {},
      loader: true,
      hariIni: "",
    };
    this.sectionRef = React.createRef();
  }

  componentDidMount = async () => {
    this.getHariIni();
    const userEmail = localStorage.getItem("userEmail");
    await this.setState({ displayName: userEmail });
    AOS.init({ duration: 700 });
    await this.getAllTripsByUid();
    // await this.getPerjalananSelesai();
    // await this.getPerjalananBelumSampai();
  };

  getHariIni = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    this.setState({ hariIni: formattedDate });
  };

  handleClick = () => {
    // Pastikan sectionRef sudah terinisialisasi sebelum mencoba mengaksesnya
    if (this.sectionRef.current) {
      this.sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  handleSampai = () => {
    window.location.href = `/arrive-trip/${this.state.tripBelumSampai[0].id}`;
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
  sortirBerdasarkanJamKeluarDesc(arrayObjek) {
    // Menggunakan metode sort() untuk melakukan pengurutan
    arrayObjek.sort((a, b) => {
      // Memisahkan jam dan menit dari string jamKeluar pada setiap objek
      let [jamAInt, menitAInt] = a.lokasiAkhir[0].jamSampai
        .split(":")
        .map(Number);
      let [jamBInt, menitBInt] = b.lokasiAkhir[0].jamSampai
        .split(":")
        .map(Number);

      // Membandingkan jam keluar dari dua objek
      if (jamAInt !== jamBInt) {
        return jamBInt - jamAInt;
      } else {
        return menitBInt - menitAInt;
      }
    });

    return arrayObjek;
  }
  getAllTripsByUid = async () => {
    await this.getUserLogin(this.state.displayName);
    const { user, hariIni } = this.state;
    try {
      const userRef = doc(db, "User", user.uid);
      const tripsCollection = collection(db, "trips");
      const userTripsQuery = query(
        tripsCollection,
        where("refUser", "==", userRef),
        where("tanggal", "==", hariIni)
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
      const tripBelumSampai = tripList.filter(
        (trip) => trip.status === "Belum selesai"
      );
      const belumSampai = tripBelumSampai[0];
      console.log(tripBelumSampai[1], "belumm");

      const tripSelesai = tripList.filter((trip) => trip.status === "Selesai");

      const sortir = this.sortirBerdasarkanJamKeluarDesc(tripSelesai);
      console.log(belumSampai, "sortir");

      this.setState({
        trips: sortir,
        loader: false,
        tripBelumSampai: tripBelumSampai,
        tripSelesai: tripSelesai,
      });
    } catch (error) {
      console.error("Error fetching data: ", error);
      throw error;
    }
  };

  getPerjalananSelesai = async () => {
    const tripSelesai = this.state.trips.filter(
      (trip) => trip.status === "Selesai"
    );
    await new Promise((resolve) => {
      this.setState({ tripSelesai }, resolve);
    });
  };

  getPerjalananBelumSampai = async () => {
    const tripBelumSampai = this.state.trips.filter(
      (trip) => trip.status === "Belum selesai"
    );
    await new Promise((resolve) => {
      this.setState({ tripBelumSampai: tripBelumSampai }, resolve);
    });
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
        <div className="font-DM flex flex-col px-4 pt-6 pb-20 mx-auto w-full bg-white shadow-2xl  rounded-[32px]">
          <div className="flex items-center gap-5 text-xl font-bold tracking-wide leading-7 text-center robaseded-[32px] mb-4 ">
            <Navbar />
            <div
              ref={this.sectionRef}
              className="flex-auto self-start font-semibold"
            >
              Perjalanan Hari Ini
            </div>
          </div>
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

          {this.state.tripBelumSampai.length > 0 && (
            <>
              <div
                data-aos="fade-up"
                ref={this.sectionRef}
                className="flex flex-col p-3 mt-8 capitalize bg-white rounded-2xl  bg-gradient-to-r from-blue-500 to-blue-800 "
              >
                {this.state.tripBelumSampai.map((trip) => (
                  <div
                    key={trip.id}
                    className="flex flex-col bg-white rounded-2xl"
                  >
                    <div className="flex flex-col px-3 pt-3 w-full bg-white rounded-2xl border shadow-lg  justify-center p-3 ">
                      <div className="flex gap-2.5 text-xs leading-5">
                        <img
                          loading="lazy"
                          srcSet={Person}
                          className="shrink-0 aspect-[0.81] w-[90px] h-[100%] rounded-md object-cover"
                        />
                        <div className="flex flex-col my-auto w-full">
                          <div className="text-base leading-5 font-medium flex flex-wrap w-full ">
                            {trip.alasan}
                          </div>
                          <div className="mt-2 text-sm font-medium leading-5 text-start text-zinc-500">
                            {trip.tanggal}
                          </div>
                          <div className="mt-1 text-start text-blue-500 text-sm">
                            Dari : {trip.lokasiAwal[0]?.lokasi}
                          </div>
                          <div className="flex items-center justify-center py-1 w-full mt-3 font-medium text-rose-400 rounded-lg border border-orange-600 border-solid bg-orange-400 bg-opacity-10">
                            Belum Sampai
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={this.handleSampai}
                        className="flex justify-center text-sm items-center px-16 py-2 mt-3.5 font-medium leading-5 text-right text-white whitespace-nowrap bg-blue-500 rounded-lg"
                      >
                        Sampai
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          <div
            data-aos="slide-down"
            className="w-full px-3 flex justify-center mt-5"
          >
            {this.state.tripBelumSampai.length > 0 ? (
              <></>
            ) : (
              <Link
                to={`/input-trip/${this.state.user.uid}`}
                className="self-start text-base font-medium tracking-wide leading-7 mb-5 text-center text-white bg-blue-500 w-full p-2 rounded-xl shadow-lg flex justify-center gap-5 items-center"
              >
                Tambah
              </Link>
            )}
          </div>
          <div
            data-aos="flip-up"
            className=" bg-gradient-to-r from-blue-500 to-blue-800 text-white w-full  p-3 rounded-lg flex-auto self-start mt-1 text-base  font-medium"
          >
            Telah Selesai
          </div>
          <div
            data-aos="slide-down"
            className="flex flex-col px-5 pb-4 mt-6 capitalize bg-blue-100 rounded-2xl  "
          >
            {this.state.loader == true ? (
              <>
                <Loading data-aos="fade-up" data-aos-delay="300" />
              </>
            ) : (
              <>
                {this.state.tripSelesai.length > 0 ? (
                  <>
                    {this.state.tripSelesai.map((trip, index) => (
                      <div
                        data-aos={index == 2 ? "" : "fade-up"}
                        data-aos-delay="300"
                        key={index}
                        onClick={() => {
                          window.location.href = `/detail-trip/${trip.id}`;
                        }}
                        className="flex flex-col justify-center mt-5 w-full text-xs font-bold leading-5 capitalize bg-white rounded-2xl "
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
                              {trip.jarakKompensasi} KM ({trip.durasi} Menit)
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <div
                      data-aos="fade-up"
                      data-aos-delay="300"
                      className="flex flex-col text-center max-w-[360px]"
                    >
                      <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/0c65606ebee1b6385716d2b992b9da1ce85e7d156aec662e98ee133e4645beff?"
                        className="self-center w-full aspect-[1.37] max-w-[250px] "
                      />
                      <div className="mt-4 w-full text-lg font-medium text-slate-700">
                        Aktifitas masih kosong
                      </div>
                      <div className="w-full text-sm text-gray-400">
                        Yuk Terapi Sekarang !!!
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default MyTrip;
