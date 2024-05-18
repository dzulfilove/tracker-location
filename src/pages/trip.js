import * as React from "react";
import Navbar from "../components/navbar";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { Link } from "react-router-dom";

class MyTrip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: "",
      trips: [],
      tripSelesai: [],
      tripBelumSampai: [],
      user: {},
    };
    this.sectionRef = React.createRef();
  }

  componentDidMount = async () => {
    const userEmail = localStorage.getItem("userEmail");
    await this.setState({ displayName: userEmail });
    await this.getAllTripsByUid();
    await this.getPerjalananSelesai();
    await this.getPerjalananBelumSampai();
  };

  handleClick = () => {
    // Pastikan sectionRef sudah terinisialisasi sebelum mencoba mengaksesnya
    if (this.sectionRef.current) {
      this.sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  handleSampai = () => {
    window.location.href = "/arrive-trip";
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

  getAllTripsByUid = async () => {
    await this.getUserLogin(this.state.displayName);
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

      await new Promise((resolve) => {
        this.setState({ trips: tripList }, resolve);
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
        }}>
        <div className="font-DM flex flex-col px-4 pt-6 pb-20 mx-auto w-full bg-white shadow-2xl  rounded-[32px]">
          <div className="flex items-center gap-5 text-xl font-bold tracking-wide leading-7 text-center robaseded-[32px] ">
            <Navbar />
            <div className="flex-auto self-start font-semibold">
              Perjalanan Hari Ini
            </div>
          </div>
          <button className="floating-btn" onClick={this.handleClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24">
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
          <div
            ref={this.sectionRef}
            className="flex flex-col p-3 mt-8 capitalize bg-white rounded-2xl  bg-gradient-to-r from-blue-500 to-blue-800 ">
            {this.state.tripBelumSampai.length > 0 ? (
              <>
                {this.state.tripBelumSampai.map((trip) => (
                  <div
                    key={trip.id}
                    className="flex flex-col bg-white rounded-2xl">
                    <div className="flex flex-col px-3 pt-3 w-full bg-white rounded-2xl border shadow-lg  justify-center p-3 ">
                      <div className="flex gap-2.5 text-xs leading-5">
                        <img
                          loading="lazy"
                          srcSet="https://thumb.viva.co.id/media/frontend/thumbs3/2023/08/13/64d80ec78bcc1-cristiano-ronaldo-juara-arab-club-champions-cup-di-al-nassr_1265_711.jpg"
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
                        className="flex justify-center text-sm items-center px-16 py-2 mt-3.5 font-medium leading-5 text-right text-white whitespace-nowrap bg-blue-500 rounded-lg">
                        Sampai
                      </button>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <h1 className="text-white">belum kemana mana</h1>
            )}
          </div>
          <div className="w-full px-3 flex justify-center mt-5">
            {this.state.tripBelumSampai.length > 0 ? (
              <div className="self-start text-base font-medium tracking-wide leading-7 text-center text-white bg-blue-500 w-full p-2 rounded-xl shadow-lg flex justify-center gap-5 items-center">
                Selesaikan perjalanan
              </div>
            ) : (
              <Link
                to={`/input-trip/${this.state.user.uid}`}
                className="self-start text-base font-medium tracking-wide leading-7 text-center text-white bg-blue-500 w-full p-2 rounded-xl shadow-lg flex justify-center gap-5 items-center">
                Tambah
              </Link>
            )}
          </div>
          <div className=" bg-blue-500 text-white w-full  p-3 rounded-lg flex-auto self-start mt-6 text-base  font-medium">
            Telah Selesai
          </div>
          <div className="flex flex-col px-5 mt-6 capitalize bg-slate-50 rounded-2xl  ">
            {this.state.tripSelesai.map((trip, index) => (
              <div
                key={index}
                onClick={() => {
                  window.location.href = "/detail-trip";
                }}
                className="flex flex-col justify-center mt-8 w-full text-xs font-bold leading-5 capitalize bg-white rounded-2xl ">
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
                      {trip.lokasiAwal[0].lokasi} - {trip.lokasiAkhir[0].lokasi}
                    </div>
                    <div className="flex text-sm font-medium justify-center items-start p-2 w-full mt-2.5 text-right text-white bg-blue-500 rounded-lg">
                      {Math.round(trip.jarak)} KM ({trip.durasi} Menit)
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default MyTrip;
