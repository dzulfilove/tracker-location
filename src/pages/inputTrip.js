import * as React from "react";
import Navbar from "../components/navbar";
import { Tabs, Tab } from "react-bootstrap";
import "../styles/myStyle.css";
import Select from "react-tailwindcss-select";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import withRouter from "../withRouter";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaLocationDot } from "react-icons/fa6";
import { MdAccessTime } from "react-icons/md";
import Swal from "sweetalert2";
import AOS from "aos";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { dbImage } from "../config/firebase";
import "aos/dist/aos.css";

class InputTrip extends React.Component {
  constructor(props) {
    super(props);
    const { id } = this.props.params;
    this.state = {
      alasan: null,
      isLanjutPerjalanan: "tab1",
      isMencariLokasi: false,
      kategori: null,
      optionsLokasi: [],
      lokasi: null,
      jnsParkir: null,
      adaParkirShow: false,
      showParkir: false,
      biayaParkir: 0,
      lokasiAwal: {},
      namaLokasi: "",
      addLokasi: "",
      jamBerangkat: null,
      user: id,
      status: "Belum selesai",
      isProses: false,
      hariIni: "",
      trips: [],
      trip: {},
      lokasiLain: false,
      optionsLokasiTerakhir: [],
      lokasiAwalSelect: {},
      fotoBukti: "",
      adaParkir: "",
    };
  }

  componentDidMount = async () => {
    await this.getHariIni();
    await this.getAllLokasi();
    await this.getPerjalananHariIni();
    AOS.init({ duration: 700 });
    await this.getLokasiPerjalananTerakhir();
  };

  getHariIni = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    this.setState({ hariIni: formattedDate });
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleKamera = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    this.handleFoto(file);
  };

  handleFoto = async (file) => {
    const storageRef = ref(dbImage, `buktiParkir/${Date.now()}.jpg`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(
        ref(dbImage, snapshot.ref.fullPath)
      );

      this.setState({ fotoBukti: downloadURL, isOpenCamera: false }, () => {
        console.log("Foto berhasil diunggah:", this.state.fotoBukti);
      });
    } catch (error) {
      console.error("Gagal mengunggah foto:", error);
    }
  };
  handleTab = (newValue) => {
    this.setState({ isLanjutPerjalanan: newValue });
  };

  handleChangeKategori = async (value) => {
    await new Promise((resolve) => {
      this.setState({ kategori: value }, resolve);
    });
    console.log("kategori: ", this.state.kategori);
  };
  handleChangeParkir = async (value) => {
    if (value.label == "Khusus") {
      this.setState({ showParkir: true });
    } else {
      this.setState({ showParkir: false });
    }
    await new Promise((resolve) => {
      this.setState({ jnsParkir: value }, resolve);
    });
    console.log("kategori: ", this.state.kategori);
  };
  getAllLokasi = async () => {
    const lokasiCollection = collection(db, "lokasi");
    try {
      const querySnapshot = await getDocs(lokasiCollection);
      const lokasiList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      this.setState({ optionsLokasi: lokasiList });
      await new Promise((r) => {
        this.setState({ optionsLokasi: lokasiList }, r);
      });
      console.log({ lokasi: this.state.optionsLokasi });
    } catch (error) {
      console.error("Error mengambil data lokasi: ", error);
    }
  };

  handleChangeLokasi = async (value) => {
    if (value.label == "Lainnya") {
      this.setState({ lokasiLain: true });
    } else {
      this.setState({ lokasiLain: false });
    }
    await new Promise((resolve) => {
      this.setState({ lokasi: value }, resolve);
    });
  };

  handleButtonLokasi = async () => {
    this.setState({ isMencariLokasi: true });
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const { latitude, longitude } = position.coords;
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
      const response = await fetch(url);
      const data = await response.json();

      await new Promise((resolve) => {
        this.setState(
          {
            lokasiAwal: { latitude, longitude },
            namaLokasi: `${data.address.village}, ${data.address.city}, ${data.address.state}, ${data.address.country}`,
          },
          resolve
        );
      });
      console.log(
        { lokasiAwal: this.state.lokasiAwal },
        { namaLokasi: this.state.namaLokasi }
      );

      this.setState({ isMencariLokasi: false });
    } catch (error) {
      console.error("Error:", error);
      this.setState({ isMencariLokasi: false });
    }
  };

  handleButtonJam = () => {
    const sekarang = new Date();
    const jam = String(sekarang.getHours()).padStart(2, "0");
    const menit = String(sekarang.getMinutes()).padStart(2, "0");
    const waktuFormatted = `${jam}:${menit}`;

    this.setState({ jamBerangkat: waktuFormatted });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ isProses: true });
    const cek = this.isAnyStateEmpty();

    if (cek == false) {
      const currentDate = new Date();
      const formattedDate = format(
        currentDate,
        "MMMM dd, yyyy 'at' hh:mm:ss a 'UTC'XXX",
        { locale: enUS }
      );
      try {
        const {
          kategori,
          alasan,
          jamBerangkat,
          lokasiAwal,
          status,
          user,
          namaLokasi,
          hariIni,
          lokasi,
          addLokasi,
        } = this.state;

        console.log(hariIni);
        let lokasiMulai = "";
        if (lokasi.value == "Lainnya") {
          lokasiMulai = addLokasi;
        } else {
          lokasiMulai = lokasi.value;
        }
        if (lokasi.value == "Lainnya") {
          const lokasiRef = collection(db, "lokasi");
          await addDoc(lokasiRef, {
            label: addLokasi,
            value: addLokasi,
          });
        }
        const tripRef = collection(db, "trips");
        const userRef = doc(db, "User", user);
        const newTrip = await addDoc(tripRef, {
          kategori: kategori.value,
          alasan,
          status,
          refUser: userRef,
          tanggal: hariIni,
          tanggalFilter: formattedDate,
          durasi: 0,
          fotoBukti: "",
          jarak: 0,
          jarakKompensasi: 0,
        });

        // Menyimpan data lokasiAwal di dalam subkoleksi
        const lokasiAwalRef = collection(newTrip, "lokasiAwal");
        await addDoc(lokasiAwalRef, {
          jamMulai: jamBerangkat,
          latitude: lokasiAwal.latitude,
          longitude: lokasiAwal.longitude,
          alamat: namaLokasi,
          lokasi: lokasiMulai,
        });
        Swal.fire({
          title: "Berhasil",
          text: "Berhasil ditambah",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = `/mytrip`;
          }
        });
        this.setState({ isProses: false });
      } catch (error) {
        console.error("Error:", error);
        this.setState({ isProses: false });
      }
    }
  };

  // logic untuk lanjut perjalanan
  getPerjalananHariIni = async () => {
    const { user, hariIni } = this.state;
    try {
      const userRef = doc(db, "User", user);
      const tripsCollection = collection(db, "trips");
      const userTripsQuery = query(
        tripsCollection,
        where("refUser", "==", userRef),
        where("tanggal", "==", hariIni),
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

  getLokasiPerjalananTerakhir = () => {
    const optionsLokasiTerakhir = this.state.trips.map((trip) => ({
      value: trip.lokasiAkhir[0].lokasi,
      label: `${trip.lokasiAkhir[0].lokasi} - ${trip.alasan}`,
      nilai: trip.lokasiAkhir[0],
      id: trip.id,
    }));
    console.log(this.state.trips, "jkahdsdjh");

    this.setState({ optionsLokasiTerakhir });
  };

  handleChangeLokasiTerakhir = async (trip) => {
    await new Promise((resolve) => {
      this.setState({ lokasiAwalSelect: trip }, resolve);
    });

    console.log(this.state.lokasiAwalSelect);
  };
  isAnyStateEmpty() {
    const {
      alasan,
      jamBerangkat,
      status,
      user,
      hariIni,
      lokasiAwalSelect,
      kategori,

      adaParkir,
    } = this.state;

    let emptyStates = [];

    if (!alasan) emptyStates.push("alasan");
    if (!jamBerangkat) emptyStates.push("jamBerangkat");
    if (!status) emptyStates.push("status");
    if (!user) emptyStates.push("user");
    if (!hariIni) emptyStates.push("hariIni");
    if (!lokasiAwalSelect) emptyStates.push("lokasiAwalSelect");
    if (!kategori) emptyStates.push("kategori");

    if (!adaParkir) emptyStates.push("adaParkir");

    if (emptyStates.length > 0) {
      Swal.fire({
        title: "Gagal",
        text: `Harap Isi Kolom ${emptyStates}`,
        icon: "error",
      });
      return true;
    }

    return false;
  }

  handlePerjalananLanjut = async (e) => {
    e.preventDefault();
    const cek = this.isAnyStateEmpty();

    if (cek == false) {
      try {
        const {
          alasan,
          jamBerangkat,
          status,
          user,
          hariIni,
          lokasiAwalSelect,
          kategori,
          fotoBukti,
          biayaParkir,
          jnsParkir,
          adaParkir,
        } = this.state;

        let hargaParkir = 0;
        if (adaParkir == "ya") {
          if (jnsParkir.value == "Khusus") {
            hargaParkir = biayaParkir;
          } else {
            hargaParkir = 2000;
          }
        }
        const currentDate = new Date();
        const formattedDate = format(
          currentDate,
          "MMMM dd, yyyy 'at' hh:mm:ss a 'UTC'XXX",
          { locale: enUS }
        );
        const lokasiAwalNilai = lokasiAwalSelect.nilai;
        const refTrip = lokasiAwalSelect.id;
        const lokasiAwal = {
          ...lokasiAwalNilai,
          jamMulai: jamBerangkat,
        };
        delete lokasiAwal.jamSampai;

        console.log({
          alasan,
          jamBerangkat,
          status,
          user,
          hariIni,
          lokasiAwalSelect,
        });

        const userRef = doc(db, "User", user);

        const tripRef = collection(db, "trips");
        const documentRef = doc(db, "trips", refTrip);
        const documentData = {
          path: documentRef.path,
          id: documentRef.id,
        };

        console.log(documentData);

        let newTrip;

        if (adaParkir === "ya") {
          newTrip = await addDoc(tripRef, {
            alasan,
            kategori: kategori.value,
            status,
            refUser: userRef,
            tanggal: hariIni,
            tanggalFilter: formattedDate,
            durasi: 0,
            fotoBukti: null,
            parkir: true,
            buktiParkir: fotoBukti,
            biayaParkir: hargaParkir,
            jenisParkir: jnsParkir.value,
            jarak: 0,
            jarakKompensasi: 0,
            refTrips: documentData,
          });
        } else {
          newTrip = await addDoc(tripRef, {
            alasan,
            kategori: kategori.value,
            status,
            refUser: userRef,
            tanggal: hariIni,
            tanggalFilter: formattedDate,
            durasi: 0,
            parkir: false,
            fotoBukti: null,
            jarak: 0,
            jarakKompensasi: 0,
            refTrips: documentData,
          });
        }

        // newTrip sekarang bisa diakses di sini
        console.log(newTrip);

        // Menyimpan data lokasiAwal di dalam subkoleksi
        const lokasiAwalRef = collection(newTrip, "lokasiAwal");
        await addDoc(lokasiAwalRef, lokasiAwal);
        Swal.fire({
          title: "Berhasil",
          text: "Berhasil menambah lanjut perjalanan",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = `/mytrip`;
          }
        });

        console.log("berhasil");
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  render() {
    const optionsKategori = [
      { value: "Dalam Kota", label: "Dalam Kota" },
      { value: "Luar Kota", label: "Luar Kota" },
    ];

    const optionsParkir = [
      { value: "Umum", label: "Umum" },
      { value: "Khusus", label: "Khusus" },
    ];
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
        <div className="flex relative flex-col px-5 w-full bg-white rounded-[32px] font-DM pt-7">
          <div className="flex gap-11 items-center justify-start text-xl font-bold tracking-wide leading-7 text-center rounded-[32px] ">
            <Navbar />
            <div className="self-start font-medium text-xl">
              Tambah Perjalanan
            </div>
          </div>
          <div data-aos="slide-down" className="mt-5">
            <Tabs
              id="controlled-tab-example"
              activeKey={this.state.isLanjutPerjalanan}
              onSelect={this.handleTab}
              className="custom-tab-bar"
            >
              <Tab eventKey="tab1" title="Baru"></Tab>
              <Tab eventKey="tab2" title="Lanjut"></Tab>
            </Tabs>
          </div>
          {this.state.isLanjutPerjalanan == "tab1" && (
            <>
              <div
                data-aos="fade-up"
                className="my-5 text-sm font-medium leading-5 "
              >
                Kategori Perjalanan
              </div>
              <div data-aos="fade-up" style={{ zIndex: "999" }}>
                <Select
                  options={optionsKategori}
                  name="Kategori"
                  placeholder="Pilih Kategori"
                  value={this.state.kategori}
                  onChange={this.handleChangeKategori}
                  classNames={{
                    menuButton: ({ isDisabled }) =>
                      `ps-3 text-[15px] flex text-sm text-blue-500 w-[100%] bg-blue-100 rounded-lg shadow-md transition-all duration-300 focus:outline-none ${
                        isDisabled
                          ? "bg-blue-100"
                          : "bg-blue-100 focus:ring focus:ring-blue-500/20"
                      }`,
                    menu: "absolute w-full bg-slate-50 shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700",
                    listItem: ({ isSelected }) =>
                      `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-lg ${
                        isSelected
                          ? "text-blue-500 bg-slate-50"
                          : "text-blue-500 hover:bg-blue-100 hover:text-blue-500"
                      }`,
                  }}
                />
              </div>
              <div
                data-aos="fade-up"
                data-aos-delay="50"
                className="mt-5 text-sm font-medium leading-5 "
              >
                Alasan Perjalanan
              </div>
              <div
                data-aos-delay="50"
                data-aos="fade-up"
                className="flex flex-col justify-center mt-5 "
              >
                <input
                  type="text"
                  name="travelReason"
                  value={this.state.alasan}
                  onChange={(e) => this.setState({ alasan: e.target.value })}
                  className="shrink-0 h-11 bg-white rounded-lg shadow-md px-3"
                />
              </div>
              <div
                data-aos="fade-up"
                data-aos-delay="100"
                className="mt-6 text-sm font-medium leading-5 "
              >
                Pilih Lokasi
              </div>
              <div
                data-aos="fade-up"
                style={{ zIndex: "999" }}
                data-aos-delay="100"
                className="flex flex-col justify-center mt-6"
              >
                <Select
                  options={this.state.optionsLokasi}
                  name="Lokasi"
                  placeholder="Pilih Lokasi"
                  value={this.state.lokasi}
                  onChange={this.handleChangeLokasi}
                  classNames={{
                    menuButton: ({ isDisabled }) =>
                      `ps-3 text-[15px] flex text-sm text-blue-500 w-[100%] bg-blue-100 rounded-lg shadow-md transition-all duration-300 focus:outline-none ${
                        isDisabled
                          ? "bg-blue-100"
                          : "bg-blue-100 focus:ring focus:ring-blue-500/20"
                      }`,
                    menu: "absolute w-full bg-slate-50 shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700",
                    listItem: ({ isSelected }) =>
                      `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-lg ${
                        isSelected
                          ? "text-blue-500 bg-slate-50"
                          : "text-blue-500 hover:bg-blue-100 hover:text-blue-500"
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
                      className="shrink-0 h-11 bg-white rounded-lg shadow-md px-3"
                    />
                  </div>
                </>
              )}

              <div
                data-aos="fade-up"
                data-aos-delay="150"
                className="mt-6 text-sm font-medium leading-5 "
              >
                Tetapkan Lokasi Keberangkatan
              </div>
              <div
                data-aos="fade-up"
                data-aos-delay="150"
                className="flex gap-3 mt-5 justify-between"
              >
                <input
                  type="text"
                  name="departureLocation"
                  value={this.state.namaLokasi}
                  onChange={this.handleInputChange}
                  className="shrink-0 max-w-full h-11 text-sm bg-white rounded-lg border border-solid border-zinc-100 shadow-md w-[260px] px-3"
                  readOnly
                />
                <button
                  disabled={this.state.isProses}
                  onClick={this.handleButtonLokasi}
                  className={`p-3 rounded-full bg-blue-500 flex items-center justify-center`}
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
              <div className="mt-6 text-sm font-medium leading-5 ">
                Tetapkan Jam Keberangkatan
              </div>
              <div className="flex gap-3 mt-5 justify-between">
                <input
                  type="text"
                  name="departureLocation"
                  placeholder="Klik Icon Jam Disamping"
                  value={this.state.jamBerangkat}
                  onChange={this.handleInputChange}
                  className="shrink-0 max-w-full h-11 bg-white rounded-lg border border-solid border-zinc-100 shadow-md w-[260px] px-3"
                  readOnly
                />
                <button
                  onClick={this.handleButtonJam}
                  className="p-3 rounded-full bg-blue-500 flex items-center justify-center"
                >
                  <div className="text-white">
                    <MdAccessTime className="w-5" />
                  </div>
                </button>
              </div>
              <button
                disabled={this.state.isProses}
                onClick={this.handleSubmit}
                className="justify-center items-center p-2 mt-8 mb-10 text-base font-medium tracking-wide leading-7 text-center text-white whitespace-nowrap bg-blue-500 rounded-lg"
              >
                Tambah
              </button>
            </>
          )}
          {this.state.isLanjutPerjalanan == "tab2" && (
            <>
              <div
                data-aos-delay="50"
                data-aos="fade-up"
                className="mt-5 text-sm font-medium leading-5 "
              >
                Pilih Lokasi Awal
              </div>
              <div
                data-aos-delay="50"
                data-aos="fade-up"
                style={{ zIndex: "998" }}
                className="flex flex-col justify-center mt-5"
              >
                <Select
                  options={this.state.optionsLokasiTerakhir}
                  name="Lokasi"
                  placeholder="Pilih Lokasi"
                  value={this.state.lokasiAwalSelect}
                  onChange={this.handleChangeLokasiTerakhir}
                  classNames={{
                    menuButton: ({ isDisabled }) =>
                      `ps-3 text-[15px] flex text-sm text-blue-500 py-2 w-[100%] bg-blue-100 rounded-lg shadow-md transition-all duration-300 focus:outline-none ${
                        isDisabled
                          ? "bg-blue-100"
                          : "bg-blue-100 focus:ring focus:ring-blue-500/20"
                      }`,
                    menu: "absolute w-full bg-slate-50 shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700 z-[999]",
                    listItem: ({ isSelected }) =>
                      `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-lg  ${
                        isSelected
                          ? "text-blue-500 bg-slate-50"
                          : "text-blue-500 hover:bg-blue-100 hover:text-blue-500"
                      }`,
                  }}
                />
              </div>
              <div
                data-aos-delay="100"
                data-aos="fade-up"
                className="my-5 text-sm font-medium leading-5 "
              >
                Kategori Perjalanan
              </div>
              <div style={{ zIndex: "996" }}>
                <div data-aos="fade-up" data-aos-delay="100">
                  <Select
                    options={optionsKategori}
                    name="Kategori"
                    placeholder="Pilih Kategori"
                    value={this.state.kategori}
                    onChange={this.handleChangeKategori}
                    classNames={{
                      menuButton: ({ isDisabled }) =>
                        `ps-3 text-[15px]  flex text-sm text-blue-500 w-[100%] bg-blue-100 rounded-lg shadow-md transition-all duration-300 focus:outline-none ${
                          isDisabled
                            ? "bg-blue-100"
                            : "bg-blue-100 focus:ring focus:ring-blue-500/20"
                        }`,
                      menu: " z-[99] absolute w-full bg-slate-50 shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700",
                      listItem: ({ isSelected }) =>
                        `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-lg ${
                          isSelected
                            ? "text-blue-500 bg-slate-50"
                            : "text-blue-500 hover:bg-blue-100 hover:text-blue-500"
                        }`,
                    }}
                  />
                </div>
              </div>
              <div
                data-aos="fade-up"
                data-aos-delay="150"
                className="mt-5 text-sm font-medium leading-5 "
              >
                Ada Biaya Parkir ? (Pilih Salah Satu)
              </div>
              <div
                data-aos="fade-up"
                data-aos-delay="150"
                className="flex justify-start gap-5 items-center w-full mt-5 text-sm"
              >
                <label className="flex items-center p-2 w-[5rem] justify-center border border-blue-500 rounded-xl">
                  <input
                    type="radio"
                    name="biayaParkir"
                    value="ya"
                    checked={this.state.adaParkir === "ya"}
                    onChange={(e) =>
                      this.setState({
                        adaParkir: e.target.value,
                        adaParkirShow: true,
                      })
                    }
                    className="mr-2"
                  />
                  Ya
                </label>
                <label className="flex items-center p-2 w-[5rem] justify-center border border-blue-500 rounded-xl">
                  <input
                    type="radio"
                    name="biayaParkir"
                    value="tidak"
                    checked={this.state.adaParkir === "tidak"}
                    onChange={(e) =>
                      this.setState({
                        adaParkir: e.target.value,
                        adaParkirShow: false,
                      })
                    }
                    className="mr-2"
                  />
                  Tidak
                </label>
              </div>

              {this.state.adaParkirShow == true && (
                <>
                  <div
                    data-aos-delay="100"
                    data-aos="fade-up"
                    className="my-5 text-sm font-medium leading-5 "
                  >
                    Jenis Parkir
                  </div>
                  <div style={{ zIndex: "99" }}>
                    <div data-aos="fade-up" data-aos-delay="100">
                      <Select
                        options={optionsParkir}
                        name="Kategori"
                        placeholder="Pilih Jenis Parkir"
                        value={this.state.jnsParkir}
                        onChange={this.handleChangeParkir}
                        classNames={{
                          menuButton: ({ isDisabled }) =>
                            `ps-3 text-[15px]  flex text-sm text-blue-500 w-[100%] bg-blue-100 rounded-lg shadow-md transition-all duration-300 focus:outline-none ${
                              isDisabled
                                ? "bg-blue-100"
                                : "bg-blue-100 focus:ring focus:ring-blue-500/20"
                            }`,
                          menu: " z-[99] absolute w-full bg-slate-50 shadow-lg border rounded py-1 mt-1.5 text-sm text-gray-700",
                          listItem: ({ isSelected }) =>
                            `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-lg ${
                              isSelected
                                ? "text-blue-500 bg-slate-50"
                                : "text-blue-500 hover:bg-blue-100 hover:text-blue-500"
                            }`,
                        }}
                      />
                    </div>
                  </div>
                </>
              )}
              {this.state.showParkir == true && (
                <>
                  <div
                    data-aos="fade-up"
                    data-aos-delay="150"
                    className="mt-5 text-sm font-medium leading-5 "
                  >
                    Bukti Parkir
                  </div>
                  <div className="flex flex-col w-full p-2 h-auto justify-start gap-4 items-center mt-4">
                    <img
                      data-aos="fade-up"
                      src={this.state.fotoBukti}
                      className="w-[6rem] h-[8rem] flex justify-center items-center rounded-xl shadow-lg bg-white object-cover "
                    />
                    <div className="w-[15rem] p-2 bg-blue-500 text-white text-sm flex justify-center items-center rounded-md">
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
                    data-aos-delay="150"
                    className="mt-5 text-sm font-medium leading-5 "
                  >
                    Nominal Parkir
                  </div>
                  <div
                    data-aos="fade-up"
                    data-aos-delay="150"
                    className="flex flex-col justify-center mt-5 "
                  >
                    <input
                      type="number"
                      name="travelReason"
                      value={this.state.biayaParkir}
                      onChange={(e) =>
                        this.setState({ biayaParkir: e.target.value })
                      }
                      className="shrink-0 h-11 bg-white rounded-lg shadow-md px-3"
                    />
                  </div>
                </>
              )}
              <div
                data-aos="fade-up"
                data-aos-delay="150"
                className="mt-5 text-sm font-medium leading-5 "
              >
                Alasan Perjalanan
              </div>
              <div
                data-aos="fade-up"
                data-aos-delay="150"
                className="flex flex-col justify-center mt-5 "
              >
                <input
                  type="text"
                  name="travelReason"
                  value={this.state.alasan}
                  onChange={(e) => this.setState({ alasan: e.target.value })}
                  className="shrink-0 h-11 bg-white rounded-lg shadow-md px-3"
                />
              </div>
              <div
                data-aos="fade-up"
                data-aos-delay="200"
                className="mt-6 text-sm font-medium leading-5 "
              >
                Tetapkan Jam Keberangkatan
              </div>
              <div
                data-aos="fade-up"
                data-aos-delay="200"
                className="flex gap-3 mt-5 justify-between"
              >
                <input
                  type="time"
                  value={this.state.jamBerangkat}
                  onChange={this.handleInputChange}
                  className="shrink-0 max-w-full h-11 text-sm bg-white rounded-lg border border-solid border-zinc-100 shadow-md w-[260px] px-3"
                  readOnly
                />
                <button
                  onClick={this.handleButtonJam}
                  className="p-3 rounded-full bg-blue-500 flex items-center justify-center"
                >
                  <div className="text-white">
                    <MdAccessTime className="w-5" />
                  </div>
                </button>
              </div>
              <button
                onClick={this.handlePerjalananLanjut}
                className="justify-center items-center p-2 mt-8 mb-10 text-base font-medium tracking-wide leading-7 text-center text-white whitespace-nowrap bg-blue-500 rounded-lg"
              >
                Tambah
              </button>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(InputTrip);
