import * as React from "react";
import Navbar from "../components/navbar";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tanggalAwal: "2024-05-01",
      tanggalAkhir: null,
      displayName: "",
      user: {},
      currentTrip: {
        title: "Monitoring GTS",
        date: "15 Sep, 2022",
        from: "Kantor Pusat",
        status: "Belum Sampai",
      },
      trips: [],
    };
  }

  componentDidMount = async () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const tanggalAkhir = `${year}-${month}-${day}`;
    console.log("tanggalAkhir:", tanggalAkhir);
    this.setState({ tanggalAkhir });

    const userEmail = localStorage.getItem("userEmail");
    await this.setState({ displayName: userEmail });
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

      console.log({ user: this.state.user });

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

      await new Promise((resolve) => {
        this.setState({ trips: tripList }, resolve);
      });

      console.log({ trips: this.state.trips });
    } catch (error) {
      console.error("Error fetching data: ", error);
      throw error;
    }
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
        <div className="font-DM flex flex-col px-4 pt-7 pb-8 mx-auto w-full bg-white   rounded-[32px]">
          <div className="flex gap-12 text-xl justify-start items-center font-bold tracking-wide leading-7 text-center robaseded-[32px] ">
            <Navbar />
            <div className=" self-start font-semibold text-xl">
              Riwayat Perjalanan
            </div>
          </div>
          <div className="w-full flex justify-between items-center mt-6">
            <div className="w-5/12 border bg-blue-500 rounded-md flex justify-center items-center px-2 py-4 text-sm font-medium text-white shadow-md">
              <input
                type="date"
                className="bg-blue-500"
                value={this.state.tanggalAwal}
                onChange={(e) => this.setState({ tanggalAwal: e.target.value })}
              />
            </div>
            --
            <div className="w-5/12 border bg-blue-500 rounded-md flex justify-center items-center px-2 py-4 text-sm font-medium text-white shadow-md">
              <input
                type="date"
                className="bg-blue-500"
                value={this.state.tanggalAkhir}
                // onChange={}
              />
            </div>
          </div>
          <div className=" bg-blue-500 text-white w-full  p-3 rounded-lg flex-auto self-start mt-4 text-base  font-medium">
            Data Perjalanan
          </div>
          <div className="flex flex-col px-5 mt-6 capitalize bg-slate-50 rounded-2xl  ">
            {this.state.trips.map((trip) => (
              <div
                key={trip.id}
                onClick={() => {
                  window.location.href = "/detail-trip";
                }}
                className="flex flex-col justify-center mt-8 w-full text-xs font-bold leading-5 capitalize bg-white rounded-2xl ">
                <div className="flex gap-3.5 px-2 py-2.5 bg-white rounded-2xl border  border-solid shadow-md">
                  <img
                    loading="lazy"
                    srcSet="https://thumb.viva.co.id/media/frontend/thumbs3/2023/08/13/64d80ec78bcc1-cristiano-ronaldo-juara-arab-club-champions-cup-di-al-nassr_1265_711.jpg"
                    className="shrink-0 aspect-[0.81] w-[30%] rounded-md object-cover"
                  />
                  <div className="flex flex-col self-start mt-1.5 w-[65%]">
                    <div className="text-base leading-5 flex flex-wrap w-full font-medium  ">
                      {/* {trip.title} */}
                    </div>
                    <div className="mt-2 text-sm font-medium leading-5 text-start text-stone-500">
                      {/* {trip.date} */}
                    </div>
                    <div className="mt-2.5 text-start text-blue-500">
                      {/* {trip.route} */}
                    </div>
                    <div className="flex text-sm font-medium justify-center items-start p-2 w-full mt-2.5 text-right text-white bg-blue-500 rounded-lg">
                      {/* {trip.distance} ({trip.duration}) */}
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

export default History;
