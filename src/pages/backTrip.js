import * as React from "react";
import Navbar from "../components/navbar";
import { db } from "../config/firebase";
import { useSelector } from "react-redux";
import Select from "react-tailwindcss-select";
import dayjs from "dayjs";
import Webcam from "react-webcam";
import Swal from "sweetalert2";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaLocationDot } from "react-icons/fa6";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { dbImage } from "../config/firebase";
import imageCompression from "browser-image-compression";
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
import AOS from "aos";

import "aos/dist/aos.css";
import withRouter from "../withRouter";
import Person from "../assets/person.png";
import Loading from "../components/loader";

class BackTrip extends React.Component {
  constructor(props) {
    super(props);
    const idTrip = this.props.params;
    this.webcamRef = React.createRef();
    const userEmail = sessionStorage.getItem("userEmail");

    this.state = {
      idTrip: idTrip.idTrip,
      trips: {},
      userEmail,
      optionsLokasi: [],
      jamSampai: dayjs().locale("id").format("HH:mm"),
      jamMulai: "",
      position: { latitude: null, longitude: null },
      add: "",
      lokasiMulai: "",
      lokasi: {},
      isOpenCamera: false,
      lokasiLain: false,
      isProses: false,
      loader: false,
      lokasiAkhir: {},
      namaLokasi: {},
      isMencariLokasi: false,
      namaLokasi: "",
      fotoBukti: Person,
      durasi: null,
      addLokasi: "",
      jarak: null,
      user: {},
      lokasiAwal: {},
      isSubmit: false,
    };
  }

  componentDidMount = async () => {
    const userEmail = sessionStorage.getItem("userEmail");
    await this.getUserLogin(userEmail);
    await this.getDataPerjalanan();
    await this.getAllLokasi();
    AOS.init({ duration: 700 });
    await this.handleHitungDurasi();
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
  getDataPerjalanan = async () => {
    const { idTrip } = this.state;
    console.log(idTrip, "id");
    try {
      // Mendapatkan data trip utama
      const tripDoc = doc(db, "trips", idTrip);
      const tripSnapshot = await getDoc(tripDoc);
      console.log("lokasiauishdushdfjh", tripSnapshot);

      if (tripSnapshot.exists()) {
        const tripData = tripSnapshot.data();
        this.setState({ trip: tripData });

        // Mendapatkan data dari subkoleksi 'lokasiAwal'
        const lokasiAwalRef = collection(tripDoc, "lokasiAwal");
        const lokasiAwalSnapshot = await getDocs(lokasiAwalRef);
        const lokasiAwalData = [];
        lokasiAwalSnapshot.forEach((lokasiDoc) => {
          lokasiAwalData.push(lokasiDoc.data());
        });

        await new Promise((resolve) => {
          this.setState(
            {
              lokasiAwal: lokasiAwalData,
              lokasiMulai: lokasiAwalData[0].lokasi,
              jamMulai: lokasiAwalData[0].jamMulai,
            },
            resolve
          );
        });

        console.log(this.state.lokasiAwal, "lokasi");
      } else {
        console.log("Dokumen tidak ditemukan.");
      }
    } catch (error) {
      console.error("Error fetching trip details:", error);
    }
  };
  capture = () => {
    const imageSrc = this.webcamRef.current.getScreenshot();
    this.setState({ fotoBukti: imageSrc });
  };

  handleKamera = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    this.handleFoto(file);
  };

  handleFoto = async (file) => {
    try {
      // Fungsi untuk mengompres gambar menggunakan canvas
      const compressImage = (file, maxWidth, maxHeight, quality) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = URL.createObjectURL(file);
          img.onload = () => {
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxWidth) {
                height = Math.round((height *= maxWidth / width));
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width = Math.round((width *= maxHeight / height));
                height = maxHeight;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
              (blob) => {
                resolve(blob);
              },
              "image/jpeg",
              quality
            );
          };
          img.onerror = (err) => {
            reject(err);
          };
        });
      };

      // Kompresi gambar dengan resolusi maksimal 1920x1920 dan kualitas 0.7
      const compressedFile = await compressImage(file, 1920, 1920, 0.7);

      // Unggah gambar yang telah dikompres ke Firebase
      const storageRef = ref(dbImage, `trip/${Date.now()}.jpg`);
      const snapshot = await uploadBytes(storageRef, compressedFile);
      const downloadURL = await getDownloadURL(
        ref(dbImage, snapshot.ref.fullPath)
      );

      // Setel state dengan URL gambar yang diunggah
      this.setState({ fotoBukti: downloadURL, isOpenCamera: false }, () => {
        console.log("Foto berhasil diunggah:", this.state.fotoBukti);
      });
    } catch (error) {
      console.error("Gagal mengunggah foto:", error);
    }
  };

  // Fungsi untuk mengonversi data URI menjadi Blob
  dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  handleLokasiAkhir = async () => {
    this.setState({ isMencariLokasi: true });
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const { latitude, longitude } = position.coords;
      // const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
      // const response = await fetch(url);
      // const data = await response.json();

      await new Promise((resolve) => {
        this.setState(
          {
            lokasiAkhir: { latitude, longitude },
            add: `Berhasil Dapat Lokasi`,
          },
          resolve
        );
      });
      console.log(
        { lokasiAkhir: this.state.lokasiAkhir },
        { namaLokasi: this.state.namaLokasi }
      );

      await this.handleHitungJarak();

      this.setState({ isMencariLokasi: false });
    } catch (error) {
      this.setState({ isMencariLokasi: false });
      console.error("Error:", error);
    }
  };

  handleHitungDurasi = async () => {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const jamSelesai = `${hours}:${minutes}`;
    const { lokasiAwal, jamSampai } = this.state;
    const jamMulai = lokasiAwal[0].jamMulai;
    console.log(lokasiAwal);

    // Mengonversi waktu string menjadi menit
    const [jamMulaiHours, jamMulaiMinutes] = jamMulai.split(":").map(Number);
    const [jamSelesaiHours, jamSelesaiMinutes] = jamSampai
      .split(":")
      .map(Number);

    const totalMenitMulai = jamMulaiHours * 60 + jamMulaiMinutes;
    const totalMenitSelesai = jamSelesaiHours * 60 + jamSelesaiMinutes;

    // Menghitung selisih waktu dalam menit
    const durasi = totalMenitSelesai - totalMenitMulai;
    console.log(durasi, "durasi segggg");
    await new Promise((resolve) => {
      this.setState({ durasi: durasi }, resolve);
    });
  };

  handleHitungJarak = async () => {
    const { lokasiAwal, lokasiAkhir } = this.state;
    // Lokasi awal
    const latitudeAwal = lokasiAwal[0].latitude;
    const longitudeAwal = lokasiAwal[0].longitude;

    // lokasi akhir
    const latitudeAkhir = lokasiAkhir.latitude;
    const longitudeAkhir = lokasiAkhir.longitude;

    const r = 6371; // radius bumi (km)
    const toRadians = (degree) => degree * (Math.PI / 180);

    const dLat = toRadians(latitudeAkhir - latitudeAwal);
    const dLon = toRadians(longitudeAkhir - longitudeAwal);
    const radLat1 = toRadians(latitudeAwal);
    const radLat2 = toRadians(latitudeAkhir);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(radLat1) *
        Math.cos(radLat2) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const jarak = r * c;
    console.log("jarak", jarak);
    console.log(latitudeAwal);
    console.log(longitudeAwal);
    await new Promise((resolve) => {
      this.setState({ jarak: parseFloat(jarak.toFixed(2)) }, resolve);
    });
  };
  isAnyStateEmpty() {
    const {
      lokasiAkhir,
      fotoBukti,
      durasi,
      jarak,
      lokasi,
      add,
      jamSampai,
      idTrip,
    } = this.state;

    let emptyStates = [];

    if (!lokasiAkhir) emptyStates.push("lokasiAkhir");
    if (!fotoBukti) emptyStates.push("fotoBukti");
    if (!durasi) emptyStates.push("durasi");
    // if (!jarak) emptyStates.push("jarak");
    if (!lokasi) emptyStates.push("lokasi");
    if (!add) emptyStates.push("add");
    if (!jamSampai) emptyStates.push("jamSampai");
    if (!idTrip) emptyStates.push("idTrip");

    if (emptyStates.length > 0) {
      console.log("State yang kosong:", emptyStates);
      return true;
    }

    return false;
  }
  sendMessage = async (text, foto) => {
    try {
      const response = await fetch(
        "https://api.telegram.org/bot6823587684:AAE4Ya6Lpwbfw8QxFYec6xAqWkBYeP53MLQ/sendPhoto",

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: "-1001812360373",
            message_thread_id: "4294967304",
            photo: foto,
            caption: text,
            parse_mode: "html",
          }),
        }
      );

      // Cek apakah respons dari fetch adalah OK (status code 200)
      if (response.ok) {
        console.log("berhasilllllll");
      } else {
        console.log("gagalllllll");
      }
    } catch (error) {
      // Tangani kesalahan yang terjadi selama fetch
      console.error("Error:", error);
      // alert("Terjadi kesalahan. Silakan coba lagi.");
    }
  };
  handleTele = (jarakKompensasi) => {
    console.log("Berjalan");

    const {
      lokasiAkhir,
      fotoBukti,
      durasi,
      jarak,
      lokasi,
      add,
      jamSampai,
      user,
      idTrip,
      lokasiMulai,
      jamMulai,
      trip,
    } = this.state;
    const tanggalPulang = this.formatTanggal(trip.tanggal);
    const text = `\n<b>Nama :  </b>${
      user.display_name
    }\n<b>Hari, Tanggal : </b> ${tanggalPulang}\n<b>Pukul : </b> ${jamMulai} - ${jamSampai} \n<b>Keperluan : </b>${
      trip.alasan
    }\n<b>Lokasi : </b> Dari ${lokasiMulai} , Ke ${
      lokasi.value
    } \n<b>Jarak : </b> ${jarakKompensasi} KM \n<b>Durasi : </b> ${this.formatDurasi(
      durasi
    )}  \n`;
    const textGambar = `${fotoBukti}`;
    console.log(text);
    this.sendMessage(text, textGambar);
  };

  handleBalik = async (e) => {
    e.preventDefault();
    console.log("Berjalan");

    await new Promise((resolve) => {
      this.setState(
        {
          isSubmit: true,
          loader: true,
        },
        resolve
      );
    });

    this.handleSubmit();
  };
  handleSubmit = async () => {
    const {
      lokasiAkhir,
      fotoBukti,
      durasi,
      jarak,
      lokasi,
      add,
      jamSampai,
      user,
      idTrip,
      trip,
      jamMulai,
      addLokasi,
      lokasiMulai,
    } = this.state;
    let lokasiSelesai = "";
    let kosong = false;

    if (lokasi.value == "Lainnya") {
      lokasiSelesai = addLokasi;
      if (addLokasi == "") {
        Swal.fire({
          title: "Gagal",
          text: "Tambahkan Lokasi Terlebuh Dahulu",
          icon: "error",
        });
        kosong = true;
        this.setState({ loader: false });
      }
    } else {
      lokasiSelesai = lokasi.value;
    }

    if (kosong == false) {
      const status = "Selesai";
      const cekKosong = this.isAnyStateEmpty();
      let jarakReal = jarak + (jarak * 20) / 100;
      const jarakKompensasi = parseFloat(jarakReal.toFixed(2));
      const tanggalPulang = this.formatTanggal(trip.tanggal);

      if (cekKosong == true) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Lengkapi Data Terlebih Dahulu ",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        try {
          await updateDoc(doc(db, "trips", idTrip), {
            fotoBukti,
            durasi,
            jarak,
            jarakKompensasi,
            status,
          });

          if (lokasi.value == "Lainnya") {
            const lokasiRef = collection(db, "lokasi");
            await addDoc(lokasiRef, {
              label: addLokasi,
              value: addLokasi,
            });
          }

          // Add a new document to the lokasiAkhir subcollection
          const lokasiAkhirRef = collection(db, "trips", idTrip, "lokasiAkhir");
          await addDoc(lokasiAkhirRef, {
            jamSampai: jamSampai,
            latitude: lokasiAkhir.latitude,
            longitude: lokasiAkhir.longitude,
            lokasi: lokasiSelesai,
          });
          const text = `\n<b>Nama :  </b>${
            user.display_name ? user.display_name : this.state.userEmail
          }\n<b>Hari, Tanggal : </b> ${tanggalPulang}\n<b>Pukul : </b> ${jamMulai} - ${jamSampai} \n<b>Keperluan : </b>${
            trip.alasan
          }\n<b>Lokasi : </b> Dari ${lokasiMulai} , Ke ${lokasiSelesai} \n<b>Jarak : </b> ${jarakKompensasi} KM \n<b>Durasi : </b> ${this.formatDurasi(
            durasi
          )}  \n`;
          const textGambar = `${fotoBukti}`;
          await this.sendMessage(text, textGambar);
          await new Promise((resolve) => {
            this.setState(
              {
                loader: false,
              },
              resolve
            );
          });

          console.log("selesai");
          Swal.fire({
            title: "Berhasil",
            text: "Anda Berhasi Sampai Tujuan",
            icon: "success",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = `/mytrip`;
            }
          });
        } catch (error) {
          console.error(error);
        }
      }
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
      hari +
      " , " +
      tanggal.substring(8, 10) +
      " " +
      bulan +
      " " +
      tanggal.substring(0, 4);
    console.log("tanggal", dayjs(tanggal).locale("id").format("MMMM"));

    return hasil;
  };
  getAllLokasi = async () => {
    const lokasiCollection = collection(db, "lokasi");
    try {
      const querySnapshot = await getDocs(lokasiCollection);
      const lokasiList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(lokasiList);
      this.setState({ optionsLokasi: lokasiList });
      await new Promise((r) => {
        this.setState({ optionsLokasi: lokasiList }, r);
      });
      console.log({ lokasi: this.state.optionsLokasi });
    } catch (error) {
      console.error("Error mengambil data lokasi: ", error);
    }
  };
  getLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
      fetch(url)
        .then((res) => res.json())
        .then((data) =>
          this.setState({
            add: `${data.address.village}, ${data.address.city}, ${data.address.state} ,${data.address.country}`,
          })
        );
    });
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };
  handleDropdown = (name, selectedOption) => {
    if (selectedOption.label == "Lainnya") {
      this.setState({ lokasiLain: true });
    } else {
      this.setState({ lokasiLain: false });
    }
    this.setState({ lokasi: selectedOption });
  };
  render() {
    const optionsLokasi = this.state.optionsLokasi.map((data) => ({
      value: data.value,
      label: data.label,
    }));
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
        {this.state.loader == true && (
          <>
            <div className="absolute w-full h-full flex pb-28 justify-center items-center z-[9999] bg-white">
              <Loading />
            </div>
          </>
        )}

        {this.state.isOpenCamera == true ? (
          <>
            <div className=" font-DM flex flex-col  px-3 pt-4 justify-center items-center mx-auto w-full bg-white max-w-[480px] rounded-[32px]">
              <div className="flex  relative flex-col  pb-1.5 w-full aspect-[0.63] overflow-y-scroll h-[90%] border-[3px] rounded-xl border-blue-500 ">
                <Webcam
                  audio={false}
                  ref={this.webcamRef}
                  screenshotFormat="image/jpeg"
                  className=" flex flex-col justify-start w-full pb-1 "
                />
                <div className="absolute flex  justify-start gap-5 pl-28 items-center w-full z-[9999] mt-[26rem] pb-1 ">
                  <button
                    className="w-[5rem] h-[5rem] ml-3 rounded-full bg-blue-500 flex justify-center items-center"
                    onClick={this.handleFoto}
                  >
                    <div className="w-[3rem] h-[3rem] rounded-full border-[3px] border-white"></div>
                  </button>
                  <button
                    className="w-[3rem] h-[3rem] rounded-full bg-red-500 flex justify-center items-center"
                    onClick={this.handleKamera}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="white"
                        d="M12 4c-4.419 0-8 3.582-8 8s3.581 8 8 8s8-3.582 8-8s-3.581-8-8-8m3.707 10.293a.999.999 0 1 1-1.414 1.414L12 13.414l-2.293 2.293a.997.997 0 0 1-1.414 0a.999.999 0 0 1 0-1.414L10.586 12L8.293 9.707a.999.999 0 1 1 1.414-1.414L12 10.586l2.293-2.293a.999.999 0 1 1 1.414 1.414L13.414 12z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex relative flex-col px-5 w-full bg-white rounded-[32px] font-DM pt-6">
              <div className="flex justify-start items-center gap-12 text-xl font-bold tracking-wide leading-7 text-center robaseded-[32px] ">
                <Navbar />
                <div className="font-semibold text-xl ">Sampai Tujuan</div>
              </div>

              <div className="flex flex-col w-full p-2 h-auto justify-start gap-4 items-center mt-4">
                <img
                  data-aos="fade-up"
                  src={this.state.fotoBukti}
                  className="w-[10rem] h-[15rem] flex justify-center items-center rounded-xl shadow-lg bg-white object-cover "
                />
                <div
                  data-aos="slide-down"
                  className="w-[15rem] p-2 bg-blue-500 text-white text-sm flex justify-center items-center rounded-md"
                >
                  {/* <button
                  onClick={this.handleKamera}
                  className="w-[15rem] p-2 bg-blue-500 text-white text-sm flex justify-center items-center rounded-md"
                > */}
                  <input
                    type="file"
                    accept="image/*"
                    className="w-[15rem] p-2 bg-blue-500 text-white text-sm flex justify-center items-center rounded-md"
                    capture="camera"
                    ref={this.fileInputRef}
                    onChange={this.handleKamera}
                    placeholder="Ambil Foto"
                  />
                </div>
              </div>
              <div
                data-aos="fade-up"
                data-aos-delay="50"
                className="mt-6 text-sm font-medium leading-5 "
              >
                Lokasi Keberangkatan
              </div>
              <div
                data-aos="fade-up"
                data-aos-delay="100"
                className="flex flex-col justify-center mt-5 "
              >
                <input
                  type="text"
                  name="travelReason"
                  readOnly
                  value={this.state.lokasiMulai}
                  onChange={this.handleInputChange}
                  className="shrink-0 h-11 bg-white rounded-xl shadow-md px-3 border-blue-500 border"
                />
              </div>
              <div
                data-aos="fade-up"
                data-aos-delay="150"
                className="mt-6 text-sm font-medium leading-5 "
              >
                Jam Keberangkatan
              </div>
              <div className="flex justify-between mt-5 ">
                <input
                  type="text"
                  name="travelReason"
                  value={this.state.jamMulai}
                  readOnly
                  className="shrink-0 h-11 bg-white rounded-xl shadow-md px-3 w-full border-blue-500 border"
                />
              </div>
              <div className="mt-6 text-sm font-medium leading-5 ">
                Pilih Lokasi Sampai
              </div>
              <div
                data-aos="fade-up"
                style={{ zIndex: "996" }}
                className="flex flex-col justify-center mt-6"
              >
                <Select
                  options={optionsLokasi}
                  name="lokasi"
                  onChange={(selectedOption) =>
                    this.handleDropdown("lokasi", selectedOption)
                  }
                  placeholder="Pilih Lokasi"
                  value={this.state.lokasi}
                  classNames={{
                    menuButton: ({ isDisabled }) =>
                      `text-[15px] flex text-sm text-blue-500 w-[100%] bg-blue-100 rounded-xl p-2 shadow-md transition-all duration-300 focus:outline-none ${
                        isDisabled
                          ? "bg-blue-100 "
                          : "bg-blue-100 focus:ring focus:ring-blue-500/20"
                      }`,
                    menu: "absolute z-10 w-full bg-slate-50 shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700",
                    listItem: ({ isSelected }) =>
                      `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded ${
                        isSelected
                          ? `text-blue-500 bg-slate-50`
                          : `text-blue-500 hover:bg-blue-100 hover:text-blue-500`
                      }`,
                  }}
                />
              </div>
              {this.state.lokasiLain == true && (
                <>
                  <div
                    data-aos="fade-up"
                    data-aos-delay="50"
                    className="mt-5 text-sm font-medium leading-5 "
                  >
                    Tambah Lokasi
                  </div>
                  <div
                    data-aos-delay="50"
                    data-aos="fade-up"
                    className="flex flex-col justify-center mt-5 "
                  >
                    <input
                      type="text"
                      name="travelReason"
                      value={this.state.addLokasi}
                      onChange={(e) =>
                        this.setState({ addLokasi: e.target.value })
                      }
                      className={`shrink-0 h-11 bg-white rounded-lg shadow-md px-3 ${
                        this.state.addLokasi == ""
                          ? "border border-red-500"
                          : ""
                      } `}
                    />
                  </div>
                </>
              )}
              <div
                data-aos="fade-up"
                className="mt-6 text-sm font-medium leading-5 "
              >
                Tetapkan Lokasi Sampai
              </div>
              <div
                data-aos="fade-up"
                className="flex gap-3 mt-5 justify-between"
              >
                <input
                  type="text"
                  name="departureLocation"
                  value={this.state.add}
                  onChange={this.handleInputChange}
                  className="shrink-0 max-w-full h-11 bg-white rounded-lg border border-solid border-zinc-100 shadow-md w-[260px] px-3"
                />
                <button
                  onClick={this.handleLokasiAkhir}
                  className="p-3 rounded-full bg-blue-500 flex items-center justify-center shadow-xl"
                >
                  {this.state.isMencariLokasi ? (
                    <div className="text-white">
                      <AiOutlineLoading3Quarters className="w-5 animate-spin" />
                    </div>
                  ) : (
                    <div className="text-white">
                      <FaLocationDot className="w-5" />
                    </div>
                  )}
                </button>
              </div>
              {this.state.add !== "" && (
                <>
                  <div className="mt-6 text-sm font-medium leading-5 ">
                    Jam Sampai
                  </div>
                  <div className="flex gap-3 mt-5 justify-between">
                    <input
                      type="text"
                      name="departureLocation"
                      value={this.state.jamSampai}
                      readOnly
                      className="shrink-0 w-full h-11 bg-white rounded-lg border border-solid border-blue-500 shadow-md  px-3"
                    />
                  </div>
                </>
              )}
              {this.state.isSubmit == false ? (
                <>
                  <button
                    onClick={this.handleBalik}
                    className="justify-center items-center p-2 mt-8 mb-10 text-base font-semibold tracking-wide leading-7 text-center text-white whitespace-nowrap bg-blue-500 rounded-lg"
                  >
                    Simpan
                  </button>
                </>
              ) : (
                <>
                  <button className="justify-center items-center p-2 mt-8 mb-10 text-base font-semibold tracking-wide leading-7 text-center text-white whitespace-nowrap bg-blue-300 rounded-lg">
                    Simpan
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    );
  }
}

export default withRouter(BackTrip);
