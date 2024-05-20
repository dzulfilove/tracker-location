import * as React from "react";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { useMap } from "react-leaflet/hooks";
import { Marker } from "react-leaflet/Marker";
import { Popup } from "react-leaflet/Popup";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import withRouter from "../withRouter";
import MarkerIcon from "../assets/marker.png";
import MyLocation from "./map";
import { db } from "../config/firebase";
import AOS from "aos";

import "aos/dist/aos.css";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { dbImage } from "../config/firebase";
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
class DetailTrip extends React.Component {
  constructor(props) {
    super(props);
    const idTrip = this.props.params.idTrip;

    this.state = {
      idTrip: idTrip,
      fromLocation: "",
      toLocation: "",
      distance: "15 KM",
      duration: "2 Jam",
      person: "Jose",
      trip: {},
      tripOdd: [],
      lokasiAwal: "",
      lokasiMulai: "",
      jamMulai: "",
      lokasiAkhir: "",
      lokasiSelesai: "",
      jamSelesai: "",
      user: {},
      nominal: 0,
      arrayMap: [],
      objekMap: [],
      arrayMapOdd: [],
      objekMapOdd: [],
      showDataOdd: false,
      dataLength: 0,
      totalJarakOdd: 0,
      nominalOdd: 0,
      totalDurasiOdd: 0,
    };
  }
  componentDidMount = async () => {
    const userEmail = localStorage.getItem("userEmail");
    AOS.init({ duration: 700 });
    await this.getUserLogin(userEmail);
    await this.getDataPerjalanan();
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
      console.log(userData);
      return userData;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };
  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
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

  // getDataPerjalanan = async () => {
  //   const { idTrip } = this.state;
  //   let newData = []; // Array untuk menyimpan hasil baru

  //   try {
  //     let currentIdTrip = idTrip; // ID trip yang sedang diperiksa
  //     let index = 1; // Inisialisasi index pertama

  //     while (currentIdTrip) {
  //       // Mendapatkan data trip utama
  //       const tripDoc = doc(db, "trips", currentIdTrip);
  //       const tripSnapshot = await getDoc(tripDoc);
  //       const tripData = tripSnapshot.data();

  //       // Tambahkan properti index ke dalam objek data
  //       tripData.index = index;

  //       // Memasukkan data ke dalam array baru
  //       newData.push(tripData);

  //       // Periksa apakah ada properti refTrip pada objek terakhir
  //       if (tripData.refTrip) {
  //         // Jika ada, update currentIdTrip dengan nilai refTrip
  //         currentIdTrip = tripData.refTrip;
  //         index++; // Tingkatkan index untuk objek berikutnya
  //       } else {
  //         // Jika tidak, hentikan loop
  //         break;
  //       }
  //     }

  //     // newData sekarang berisi semua data perjalanan dari semua refTrip
  //     console.log("New Data:", newData);
  //   } catch (error) {
  //     console.error("Error fetching trip details:", error);
  //   }
  // };

  getDataPerjalanan = async () => {
    const { idTrip } = this.state;
    let newData = []; // Array untuk menyimpan hasil baru

    try {
      let currentIdTrip = idTrip;
      let index = 1;

      while (currentIdTrip) {
        // Mendapatkan data trip utama
        const tripDoc = doc(db, "trips", currentIdTrip);
        const tripSnapshot = await getDoc(tripDoc);
        console.log(currentIdTrip);
        console.log(tripSnapshot.data(), "dataaaa");
        if (tripSnapshot.exists()) {
          const tripData = tripSnapshot.data();
          tripData.index = index; // Tambahkan properti index
          newData.push(tripData);

          const nominal = (tripData.jarak + tripData.jarak * 0.2) * 600;

          // Mendapatkan data dari subkoleksi 'lokasiAwal'
          const lokasiAwalRef = collection(tripDoc, "lokasiAwal");
          const lokasiAwalSnapshot = await getDocs(lokasiAwalRef);

          const lokasiAwalData = [];
          lokasiAwalSnapshot.forEach((lokasiDoc) => {
            lokasiAwalData.push(lokasiDoc.data());
          });
          tripData.lokasiAwal = lokasiAwalData;
          // Mendapatkan data dari subkoleksi 'lokasiAkhir'
          const lokasiAkhirRef = collection(tripDoc, "lokasiAkhir");
          const lokasiAkhirSnapshot = await getDocs(lokasiAkhirRef);

          const lokasiAkhirData = [];
          lokasiAkhirSnapshot.forEach((lokasiDoc) => {
            lokasiAkhirData.push(lokasiDoc.data());
          });
          tripData.lokasiAkhir = lokasiAkhirData;
          const hasil = [
            [lokasiAwalData[0].latitude, lokasiAwalData[0].longitude],
            [lokasiAkhirData[0].latitude, lokasiAkhirData[0].longitude],
          ];

          const objekMap = [
            {
              marker: lokasiAwalData[0].lokasi,
              location: [
                lokasiAwalData[0].latitude,
                lokasiAwalData[0].longitude,
              ],
            },
            {
              marker: lokasiAkhirData[0].lokasi,
              location: [
                lokasiAkhirData[0].latitude,
                lokasiAkhirData[0].longitude,
              ],
            },
          ];

          if (index == 1) {
            await new Promise((resolve) => {
              this.setState(
                {
                  trip: tripData,
                  lokasiAwal: lokasiAwalData[0],
                  lokasiMulai: lokasiAwalData[0].lokasi,
                  jamMulai: lokasiAwalData[0].jamMulai,
                  lokasiAkhir: lokasiAkhirData[0],
                  lokasiSelesai: lokasiAkhirData[0].lokasi,
                  jamSelesai: lokasiAkhirData[0].jamSampai,
                  nominal: nominal,
                  arrayMap: hasil,
                  objekMap: objekMap,
                },
                resolve
              );
            });
          }

          let idref = tripData.refTrips;
          console.log(idref, "refff");
          console.log(this.state.lokasiAwal, "lokasi");

          // Update currentIdTrip dan index jika ada refTrip
          if (tripData.refTrips) {
            currentIdTrip = idref.id;
            index++;
          } else {
            break;
          }
        } else {
          console.log("Dokumen tidak ditemukan.");
          break;
        }
      }

      newData.sort((a, b) => b.index - a.index);

      const transformedArray = newData.flatMap((obj) => [
        [obj.lokasiAwal[0].latitude, obj.lokasiAwal[0].longitude],
        [obj.lokasiAkhir[0].latitude, obj.lokasiAkhir[0].longitude],
      ]);

      const resultArray = [];

      // Loop through the dataArray to create the new structure
      newData.forEach((data, dataIndex) => {
        // Extract values from the current data object
        const { lokasiAwal, lokasiAkhir } = data;

        // For each object in the lokasiAwal array
        lokasiAwal.forEach((idx, idxIndex) => {
          resultArray.push({
            marker: idx.lokasi,
            location: [idx.latitude, idx.longitude],
          });
        });

        // For each object in the lokasiAkhir array
        lokasiAkhir.forEach((nm, lokasiAkhirIndex) => {
          resultArray.push({
            marker: nm.lokasi,
            location: [nm.latitude, nm.longitude],
          });
        });
      });

      const [dataAsli, ...dataOdd] = newData;
      const long = newData.length;

      console.log(transformedArray, "odd array");
      console.log(dataAsli, "asli");
      console.log(resultArray, "objek odd");
      console.log(newData, "Odd");

      this.setState({
        tripOdd: newData,
        dataLength: long,
        arrayMapOdd: transformedArray,
        objekMapOdd: resultArray,
      });
      // Log semua data baru yang telah diambil
      console.log("New Data:", newData);
    } catch (error) {
      console.error("Error fetching trip details:", error);
    }
  };

  formatRupiah(biaya) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(biaya);
  }

  jarakReal = (jarak) => {
    let jarakReal = jarak + (jarak * 20) / 100;
    return parseFloat(jarakReal.toFixed(2));
  };

  nominalTrip = (jarak) => {
    let nominalTrip = 0;

    return nominalTrip + 600 * jarak;
  };
  showOdd = () => {
    const { showDataOdd } = this.state;
    this.setState({ showDataOdd: !showDataOdd });
  };
  render() {
    const customIcon = new Icon({
      iconUrl: MarkerIcon,
      iconSize: [38, 38],
    });

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
        }}
      >
        <div className=" font-DM flex flex-col pt-4 justify-center items-start mx-auto w-full bg-white max-w-[480px] rounded-[32px]">
          <div className="flex  items-center justify-start gap-16 rounded-[32px] bg-white  p-2 px-4 w-full shadow-2xl ">
            <button
              onClick={() => {
                window.location.href = `/mytrip`;
              }}
              className="flex justify-center items-center p-2 rounded-full bg-blue-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#fff"
                  stroke="#fff"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="m14 7l-5 5m0 0l5 5"
                />
              </svg>
            </button>
            <div className="font-semibold text-xl">Detail Perjalanan</div>
          </div>
          <div className="flex  relative flex-col  pb-1.5 w-full aspect-[0.63] overflow-y-scroll h-[90%] bg-white">
            {/* <img
            loading="lazy"
            srcSet="https://img.freepik.com/free-vector/road-map-background-with-pointers_23-2147804978.jpg?t=st=1715912753~exp=1715916353~hmac=0cfa8d1c86293357a509c429a1ccc60623fd7422d1b4ce7db3f727f1b68759c4&w=740"
            className="object-cover absolute inset-0 size-full"
          /> */}
            {this.state.showDataOdd == true ? (
              <>
                <MyLocation
                  arrayMap={this.state.arrayMapOdd}
                  objekMap={this.state.objekMapOdd}
                />
              </>
            ) : (
              <>
                <MyLocation
                  arrayMap={this.state.arrayMap}
                  objekMap={this.state.objekMap}
                />
              </>
            )}

            <div className="bg-gradient-to-b from-white/0 to-white/100 h-14"></div>
            <div className="absolute flex flex-col justify-start w-full z-[9999] mt-[18rem] pb-1 ">
              <div className="flex flex-col px-4 w-full text-xl font-bold tracking-wide leading-7 text-center text-indigo-950"></div>
              {this.state.tripOdd.length > 1 && (
                <>
                  <div className="flex w-full justify-end pr-5 mt-6 items-center">
                    <button
                      onClick={this.showOdd}
                      className="px-6 py-1 rounded-lg flex justify-center gap-2 items-center bg-blue-500 text-white text-sm"
                    >
                      {this.state.showDataOdd == true ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 1024 1024"
                          >
                            <path
                              fill="white"
                              d="M104.704 685.248a64 64 0 0 0 90.496 0l316.8-316.8l316.8 316.8a64 64 0 0 0 90.496-90.496L557.248 232.704a64 64 0 0 0-90.496 0L104.704 594.752a64 64 0 0 0 0 90.496"
                            />
                          </svg>
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 1024 1024"
                          >
                            <path
                              fill="white"
                              d="M104.704 338.752a64 64 0 0 1 90.496 0l316.8 316.8l316.8-316.8a64 64 0 0 1 90.496 90.496L557.248 791.296a64 64 0 0 1-90.496 0L104.704 429.248a64 64 0 0 1 0-90.496"
                            />
                          </svg>
                        </>
                      )}
                      Perjalanan Sebelumnya
                    </button>
                  </div>
                </>
              )}
              {this.state.showDataOdd == false ? (
                <>
                  <div className="flex flex-col h-auto w-full ">
                    <div className="flex  flex-col px-4  w-full">
                      <div className="flex z-10 gap-2 items-center py-3 px-4 mt-3 text-lg leading-5 capitalize  bg-white rounded-2xl shadow-[0px_4px_15px_rgba(0,0,0,0.11)]">
                        <img
                          loading="lazy"
                          src={this.state.trip.fotoBukti}
                          className="shrink-0  w-14 aspect-[0.92] rounded-xl object-cover"
                        />
                        <div className="flex flex-col justify-start gap-3 items-start w-full p-2">
                          <div className="my-auto">
                            {this.state.user.display_name}
                          </div>
                          <div className="my-auto text-sm font-normal flex justify-between items-center w-full">
                            {this.state.jamMulai} - {this.state.jamSelesai}
                            <div className="my-auto text-sm p-2 w-[7.5rem] rounded-lg text-center bg-blue-500 text-white font-normal flex justify-center items-center">
                              {this.state.trip.kategori}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="justify-center mt-4 items-start px-4 py-4 text-sm font-medium leading-5 text-blue-500 bg-white rounded-2xl border border-solid border-zinc-100 shadow-[0px_4px_15px_rgba(0,0,0,0.11)]">
                        Alasan Perjalanan
                        <p className="text-sm text-black font-normal mt-2">
                          {this.state.trip.alasan}
                        </p>
                      </div>
                      <div className="flex w-full gap-px items-start self-center py-5 pr-1.5 pl-3.5 mt-3 text-base bg-white rounded-2xl shadow-[0px_4px_15px_rgba(0,0,0,0.14)]">
                        <img
                          loading="lazy"
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/a9bc270096c600a8441e862af32319044c1ddf0527ee7700bde19eeaa8bde1ed?"
                          className="shrink-0 w-4 aspect-[0.21]"
                        />
                        <div className="flex flex-col ">
                          <div className="flex gap-4">
                            <div className="my-auto font-medium  text-base  text-indigo-950">
                              Dari:
                            </div>
                            <div className="flex flex-wrap font-medium  p-1 text-sm  text-slate-500 justify-start  items-center h-auto overflow-hidden">
                              {this.state.lokasiMulai}
                            </div>
                          </div>

                          <div className="flex gap-4 pl-12">
                            <div className=" ml-1 flex font-medium  p-1 text-xs  text-slate-500 justify-start  items-center h-auto overflow-hidden">
                              {this.state.lokasiAwal.alamat}
                            </div>
                          </div>
                          <div className="flex gap-5 mt-4 ">
                            <div className="font-medium text-indigo-950">
                              Ke:
                            </div>
                            <div className="pl-3 flex  font-medium  p-1 text-sm  text-slate-500 justify-start  items-centerh-auto overflow-hidden">
                              {this.state.lokasiSelesai}
                            </div>
                          </div>
                          <div className="flex gap-4 pl-12">
                            <div className=" ml-1 flex flex-wrap font-medium  p-1 text-xs  text-slate-500 justify-start  items-center  h-auto overflow-hidden">
                              {this.state.lokasiAkhir.alamat}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col px-7 mt-5 w-full font-bold text-indigo-950">
                      <div className="flex flex-col gap-3 justify-between items-center p-2 text-base  text-center uppercase bg-white rounded-2xl shadow-[0px_4px_15px_rgba(0,0,0,0.15)]">
                        <div className="flex gap-5 justify-between items-center text-base  text-center uppercase w-full ">
                          <div className="w-[50%] flex justify-start gap-3 items-center p-2 ">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="none"
                                stroke="#10B981"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 12V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6m-10 6H3m18 0h-7m-8-3l-3 3l3 3m12-6l3 3l-3 3"
                              />
                            </svg>
                            <div className="text-sm">
                              {this.state.trip.jarak} KM
                            </div>
                          </div>
                          <div className="w-[50%] flex justify-end items-center gap-3 p-2 ">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="#10B981"
                                d="M12 20c4.4 0 8-3.6 8-8s-3.6-8-8-8s-8 3.6-8 8s3.6 8 8 8m0-18c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12S6.5 2 12 2m.5 5v6H7v-1.5h4V7z"
                              />
                            </svg>

                            <div className="text-sm">
                              {this.state.trip.durasi} Menit
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-5 justify-between items-center text-base  text-center uppercase w-full ">
                          <div className="w-[50%] flex flex-col justify-start gap-1 items-start p-2 ">
                            <div className="text-sm flex justify-start gap-1 text-blue-600">
                              {" "}
                              Jarak + 20%
                            </div>
                            <div className="text-sm flex  justify-center gap-1">
                              {" "}
                              {this.jarakReal(this.state.trip.jarak)} KM
                            </div>
                          </div>
                          <div className="w-[50%] flex flex-col justify-end items-start h-full gap-1 p-2 ">
                            <div className="text-sm text-blue-600">
                              Total Durasi
                            </div>
                            <div className="text-sm">
                              {this.formatDurasi(this.state.trip.durasi)}
                            </div>
                          </div>
                        </div>
                        <div className="flex p-2 gap-5 justify-between items-center text-base  text-center uppercase w-full border-t border-t-blue-500 ">
                          <div className="text-base font-semibold text-center w-full flex justify-center items-center">
                            {this.formatRupiah(
                              this.nominalTrip(
                                this.jarakReal(this.state.trip.jarak)
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {this.state.tripOdd.map((item, i) => (
                    <>
                      <div className="flex flex-col h-auto w-full mt-4 ">
                        <div className="flex  flex-col px-4  w-full">
                          <div
                            style={{
                              border:
                                item.index == 1 ? "1px solid #3B82F6" : "",
                            }}
                            className="flex z-10 gap-2 items-center py-2 px-4 mt-3 text-lg leading-5 capitalize  bg-white rounded-2xl shadow-[0px_4px_15px_rgba(0,0,0,0.11)]"
                          >
                            <img
                              loading="lazy"
                              src={item.fotoBukti}
                              className="shrink-0  w-14 aspect-[0.92] rounded-xl object-cover"
                            />
                            <div className="flex flex-col justify-start gap-3 items-start w-full p-2 ">
                              <div className="my-auto">
                                {this.state.user.display_name}
                              </div>
                              <div className="my-auto text-sm font-normal flex justify-between items-center w-full">
                                {item.lokasiAwal[0].jamMulai} -{" "}
                                {item.lokasiAkhir[0].jamSampai}
                                <div className="my-auto text-sm p-2 w-[7.5rem] rounded-lg text-center bg-blue-500 text-white font-normal flex justify-center items-center">
                                  {item.kategori}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div
                            style={{
                              border:
                                item.index == 1 ? "1px solid #3B82F6" : "",
                            }}
                            className="justify-center mt-4 items-start px-4 py-4 text-sm font-medium leading-5 text-blue-500 bg-white rounded-2xl border border-solid border-zinc-100 shadow-[0px_4px_15px_rgba(0,0,0,0.11)]"
                          >
                            Alasan Perjalanan
                            <p className="text-sm text-black font-normal mt-2">
                              {item.alasan}
                            </p>
                          </div>
                          <div
                            style={{
                              border:
                                item.index == 1 ? "1px solid #3B82F6" : "",
                            }}
                            className="flex w-full gap-px items-start self-center py-5 pr-1.5 pl-3.5 mt-3 text-base bg-white rounded-2xl shadow-[0px_4px_15px_rgba(0,0,0,0.14)]"
                          >
                            <img
                              loading="lazy"
                              src="https://cdn.builder.io/api/v1/image/assets/TEMP/a9bc270096c600a8441e862af32319044c1ddf0527ee7700bde19eeaa8bde1ed?"
                              className="shrink-0 w-4 aspect-[0.21]"
                            />
                            <div className="flex flex-col ">
                              <div className="flex gap-4">
                                <div className="my-auto font-medium  text-base  text-indigo-950">
                                  Dari:
                                </div>
                                <div className="flex flex-wrap font-medium  p-1 text-sm  text-slate-500 justify-start  items-center h-auto overflow-hidden">
                                  {item.lokasiAwal[0].lokasi}
                                </div>
                              </div>

                              <div className="flex gap-4 pl-12">
                                <div className=" ml-1 flex font-medium  p-1 text-xs  text-slate-500 justify-start  items-center h-auto overflow-hidden">
                                  {item.lokasiAwal[0].alamat}
                                </div>
                              </div>
                              <div className="flex gap-5 mt-4 ">
                                <div className="font-medium text-indigo-950">
                                  Ke:
                                </div>
                                <div className="pl-3 flex  font-medium  p-1 text-sm  text-slate-500 justify-start  items-centerh-auto overflow-hidden">
                                  {item.lokasiAkhir[0].lokasi}
                                </div>
                              </div>
                              <div className="flex gap-4 pl-12">
                                <div className=" ml-1 flex flex-wrap font-medium  p-1 text-xs  text-slate-500 justify-start  items-center  h-auto overflow-hidden">
                                  {item.lokasiAkhir[0].alamat}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col px-7 mt-5 w-full font-bold text-indigo-950">
                          <div
                            style={{
                              border:
                                item.index == 1 ? "1px solid #3B82F6" : "",
                            }}
                            className="flex flex-col gap-3 justify-between items-center p-2 text-base  text-center uppercase bg-white rounded-2xl shadow-[0px_4px_15px_rgba(0,0,0,0.15)]"
                          >
                            <div className="flex gap-5 justify-between items-center text-base  text-center uppercase w-full ">
                              <div className="w-[50%] flex justify-start gap-3 items-center p-2 ">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="none"
                                    stroke="#10B981"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M4 12V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6m-10 6H3m18 0h-7m-8-3l-3 3l3 3m12-6l3 3l-3 3"
                                  />
                                </svg>
                                <div className="text-sm flex flex-col justify-center gap-1">
                                  <p> {this.jarakReal(item.jarak)} KM</p>
                                </div>
                              </div>
                              <div className="w-[50%] flex justify-end items-center gap-3 p-2 ">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="#10B981"
                                    d="M12 20c4.4 0 8-3.6 8-8s-3.6-8-8-8s-8 3.6-8 8s3.6 8 8 8m0-18c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12S6.5 2 12 2m.5 5v6H7v-1.5h4V7z"
                                  />
                                </svg>

                                <div className="text-sm">
                                  {item.durasi} Menit
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-5 justify-between items-center text-base  text-center uppercase w-full ">
                              <div className="w-[50%] flex flex-col justify-start gap-1 items-start p-2 ">
                                <div className="text-sm flex justify-start gap-1 text-blue-600">
                                  {" "}
                                  Jarak + 20%
                                </div>
                                <div className="text-sm flex  justify-center gap-1">
                                  {" "}
                                  {item.jarak} KM
                                </div>
                              </div>
                              <div className="w-[50%] flex flex-col justify-end items-start h-full gap-1 p-2 ">
                                <div className="text-sm text-blue-600">
                                  Total Durasi
                                </div>
                                <div className="text-sm">
                                  {this.formatDurasi(item.durasi)}
                                </div>
                              </div>
                            </div>
                            <div className="flex p-2 gap-5 justify-between items-center text-base  text-center uppercase w-full border-t border-t-blue-500 ">
                              <div className="text-base font-semibold text-center w-full flex justify-center items-center">
                                {this.formatRupiah(
                                  this.nominalTrip(this.jarakReal(item.jarak))
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(DetailTrip);
