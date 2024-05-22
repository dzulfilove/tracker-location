import * as React from "react";
import Navbar from "../components/navbar";
import { db } from "../config/firebase";
import { useSelector } from "react-redux";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import withRouter from "../withRouter";
class MyTrip extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      userName: "Dzulfi Allaudin",
      startDate: "25, Des 2024",
      endDate: "25, Des 2025",
      totalTrips: 27,
      totalDistance: "200 KM",
      totalDuration: "120 Jam",
      submittedAmount: "Rp. 100000000",
      user: {},
      currentTrip: {
        title: "Monitoring GTS",
        date: "15 Sep, 2022",
        from: "Kantor Pusat",
        status: "Belum Sampai",
      },
      trips: [
        {
          title: "Monitoring GTS",
          date: "15 Sep, 2022",
          route: "Kantor Pusat - GTS Palapa",
          distance: "15 KM",
          duration: "2 Jam",
        },
        {
          title: "Monitoring GTS",
          date: "15 Sep, 2022",
          route: "Kantor Pusat - GTS Palapa",
          distance: "15 KM",
          duration: "2 Jam",
        },
        {
          title: "Monitoring GTS",
          date: "15 Sep, 2022",
          route: "Kantor Pusat - GTS Palapa",
          distance: "15 KM",
          duration: "2 Jam",
        },
        {
          title: "Monitoring GTS",
          date: "15 Sep, 2022",
          route: "Kantor Pusat - GTS Palapa",
          distance: "15 KM",
          duration: "2 Jam",
        },
      ],
    };
    this.sectionRef = React.createRef();
  }

  componentDidMount = () => {
    const { id } = this.state;
    const userEmail = localStorage.getItem("userEmail");

    console.log(id, "srerr");

    this.getAllTripsByUid(userEmail);
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
      console.log(userData, "userrrr");
      return userData;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
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
      // const totalDurasi =
      const totalDurasi = tripList.reduce(
        (total, item) => total + item.durasi,
        0
      );

      const totalJarak = tripList.reduce(
        (total, item) => total + parseFloat(item.jarak),
        0
      );
      console.log(tripList, "Trip");
      const hasil = tripList.map((objek) => {
        // Menghitung nilai nominal berdasarkan rumus yang diberikan
        const nominal = (objek.jarak + objek.jarak * 0.2) * 600;

        // Mengembalikan objek baru dengan properti nominal yang ditambahkan
        return {
          ...objek, // Menyalin properti objek yang ada
          nominal: nominal, // Menambahkan properti nominal
        };
      });
      const updatedTrips = hasil.map((trip) => {
        const awalLokasi = trip.lokasiAwal
          .map((item) => item.lokasi)
          .join(", ");
        const akhirLokasi = trip.lokasiAkhir
          .map((item) => item.lokasi)
          .join(", ");
        return {
          ...trip,
          lokasiTrip: `${awalLokasi} - ${akhirLokasi}`,
        };
      });
      const totalNominal = hasil.reduce(
        (total, item) => total + parseFloat(item.nominal),
        0
      );

      console.log(updatedTrips, "updateee");
      await new Promise((resolve) => {
        this.setState(
          {
            trips: updatedTrips,
            totalJarak: totalJarak,
            totalDurasi: totalDurasi,
            jumlahTrip: jumlahTrip,
            totalPengajuan: totalNominal,
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
  handleClick = () => {
    // Pastikan sectionRef sudah terinisialisasi sebelum mencoba mengaksesnya
    if (this.sectionRef.current) {
      this.sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  handleTambah = () => {
    window.location.href = "/input-trip";
  };
  handleSampai = () => {
    window.location.href = `/arrive-trip/${this.state.user.uid}/${this.state.trips[0].id}`;
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
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="white"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="m17 14l-5-5m0 0l-5 5"
              />
            </svg>
          </button>
          <div
            ref={this.sectionRef}
            className="flex flex-col p-3 mt-8 capitalize bg-white rounded-2xl  bg-gradient-to-r from-blue-500 to-blue-800 "
          >
            <div className="flex flex-col  bg-white rounded-2xl ">
              <div className="flex flex-col px-3 pt-3 w-full bg-white rounded-2xl border shadow-lg  justify-center p-3 ">
                <div className="flex gap-2.5 text-xs leading-5">
                  <img
                    loading="lazy"
                    srcSet="https://i.pinimg.com/564x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg"
                    className="shrink-0 aspect-[0.81] w-[90px] h-[100%] rounded-md object-cover"
                  />
                  <div className="flex flex-col my-auto w-full">
                    <div className="text-base leading-5 font-medium flex flex-wrap w-full ">
                      {this.state.currentTrip.title}``
                    </div>
                    <div className="mt-2 text-sm font-medium leading-5 text-start text-zinc-500">
                      {this.state.currentTrip.date}
                    </div>
                    <div className="mt-1 text-start text-blue-500 text-sm">
                      Dari : {this.state.currentTrip.from}
                    </div>
                    <div className="flex items-center justify-center py-1 w-full mt-3 font-medium text-rose-400 rounded-lg border border-orange-600 border-solid bg-orange-400 bg-opacity-10">
                      {this.state.currentTrip.status}
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
          </div>
          <div className="w-full px-3 flex justify-center mt-5">
            <button
              onClick={this.handleTambah}
              className="self-start text-base font-medium tracking-wide leading-7 text-center text-white bg-blue-500 w-full p-2 rounded-xl shadow-lg flex justify-center gap-5 items-center"
            >
              Tambah
            </button>
          </div>
          <div className=" bg-blue-500 text-white w-full  p-3 rounded-lg flex-auto self-start mt-6 text-base  font-medium">
            Telah Selesai
          </div>
          <div className="flex flex-col px-5 mt-6 capitalize bg-slate-50 rounded-2xl  ">
            {this.state.trips.map((trip, index) => (
              <div
                key={index}
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
                    <div className="mt-2.5 text-start text-blue-500 font-medium">
                      {/* {trip.lokasiAwal.map((index,item) => (
                        <p> {item.lokasi}</p>
                      ))}
                      {trip.lokasiAkhir.map((item) => (
                        <p> {item.lokasi}</p>
                      ))} */}
                      {trip.lokasiTrip}
                    </div>
                    <div className="flex text-sm font-medium justify-center items-start p-2 w-full mt-2.5 text-right text-white bg-blue-500 rounded-lg">
                      {trip.jarak} KM ({trip.durasi})
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

export default withRouter(MyTrip);
