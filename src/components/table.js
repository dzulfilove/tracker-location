import React, { useState } from "react";
import swal from "sweetalert2";
import dayjs from "dayjs";
import "dayjs/locale/id";
const data = [
  { id: 1, name: "John Doe", age: 25 },
  { id: 2, name: "Jane Doe", age: 30 },
  { id: 3, name: "Jim Smith", age: 35 },
  { id: 4, name: "Jill Smith", age: 40 },
  { id: 5, name: "Jake Brown", age: 45 },
  { id: 6, name: "Jessica Brown", age: 50 },
  { id: 7, name: "Jay Green", age: 55 },
  { id: 8, name: "Jill Green", age: 60 },
  { id: 9, name: "Joe White", age: 65 },
  { id: 10, name: "Joan White", age: 70 },
];

const DataTable = (props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(5);
  const [dataPerPageDetail] = useState(5);

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const indexOfLastDataDetail = currentPage * dataPerPageDetail;
  const indexOfFirstDataDetail = indexOfLastDataDetail - dataPerPageDetail;
  const currentData = props.data.slice(indexOfFirstData, indexOfLastData);
  const currentDataDetail = props.detailData.slice(
    indexOfFirstDataDetail,
    indexOfLastDataDetail
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
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

  const formatTanggal = (tanggal) => {
    const hari = dayjs(tanggal).locale("id").format("dddd");
    const bulan = dayjs(tanggal).locale("id").format("MMMM");
    const hasil =
      tanggal.substring(8, 10) + " " + bulan + " " + tanggal.substring(0, 4);
    console.log("tanggal", dayjs(tanggal).locale("id").format("MMMM"));

    return hasil;
  };
  const showAlert = (url, name) => {
    swal.fire({
      title: name,
      imageUrl: url,
      imageWidth: 400,
      imageHeight: 550,
      imageAlt: name,
      customClass: {
        popup: "bg-white text-blue-500",
        title: "text-2xl font-medium mb-4",
        image: "object-cover rounded-xl",
        confirmButton: "bg-blue-500 text-white hover:bg-blue-500",
      },
    });
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
  const handleDetailShow = (item) => {
    const filteredArray = props.dataTrips.filter(
      (data) => data.nama == item.nama
    );
    console.log(props.dataTrips, "itemmmmmm");
    const sortData = sortByDateAndTimeDescending(filteredArray);
    props.handleDetail(sortData, item);
  };
  console.log(props.data, "itemmmmmm");

  return (
    <div className="p-4 bg-white w-[90%] rounded-xl shadow-lg mb-[4rem]">
      <table className="w-full text-left text-base font-normal">
        <thead>
          {props.showDetail == true ? (
            <>
              <tr className="bg-blue-500 text-white rounded-xl font-normal py-6">
                <th className="px-4 py-4 font-medium rounded-l-xl">Tanggal</th>
                <th className="px-4 py-4 font-medium ">Foto</th>

                <th className="px-4 py-4 font-medium">Alasan</th>

                <th className="px-4 py-4 font-medium">Lokasi</th>

                <th className="px-4 py-4 w-36 font-medium">Jarak </th>
                <th className="px-4 py-4 font-medium">Durasi</th>
                <th className="px-4 py-4 font-medium">Nominal</th>
                <th className="px-4 py-4 font-medium">Parkir</th>

                <th className="px-4 py-4 font-medium rounded-r-xl">
                  Bukti Parkir
                </th>
              </tr>
            </>
          ) : (
            <>
              <tr className="bg-blue-500 text-white rounded-xl font-normal">
                <th className="px-4 py-4 font-medium rounded-l-xl">Nama</th>

                <th className="px-4 py-4 font-medium">Lokasi</th>

                <th className="px-4 py-4 w-36 font-medium">Jarak </th>
                <th className="px-4 py-4 font-medium">Durasi</th>
                <th className="px-4 py-4 font-medium">Nominal</th>
                <th className="px-4 py-4 font-medium rounded-r-xl">Parkir</th>
              </tr>
            </>
          )}
        </thead>
        <tbody>
          {props.showDetail == true ? (
            <>
              {currentDataDetail.map((item, index) => (
                <tr key={item.nama}>
                  <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2">
                    {formatTanggal(item.tanggal)}
                  </td>
                  <td
                    onClick={() => {
                      showAlert(item.fotoBukti, "Bukti Sampai Tujuan");
                    }}
                    className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-4 hover:cursor-pointer"
                  >
                    <img
                      loading="lazy"
                      srcSet={item.fotoBukti}
                      className="shrink-0 aspect-[0.81] w-[5rem] h-[6rem] rounded-md object-cover"
                    />
                  </td>

                  <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2">
                    {item.alasan}
                  </td>

                  <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2">
                    Dari {item.lokasiAwal[0].lokasi} , Ke{" "}
                    {item.lokasiAkhir[0].lokasi}
                  </td>

                  <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2">
                    {item.jarakKompensasi} KM
                  </td>

                  <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2">
                    {formatDurasi(item.durasi)}
                  </td>
                  <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2">
                    {formatRupiah(item.nominal)}
                  </td>
                  <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2">
                    {item.biayaParkir ? (
                      <>{formatRupiah(item.biayaParkir)}</>
                    ) : (
                      <>{formatRupiah(0)}</>
                    )}
                  </td>
                  {item.parkir == true && (
                    <>
                      <td
                        className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2 hover:cursor-pointer"
                        onClick={() => {
                          showAlert(item.buktiParkir, "Bukti Parkir");
                        }}
                      >
                        {item.jenisParkir == "Khusus" ? (
                          <>
                            {" "}
                            <img
                              loading="lazy"
                              srcSet={item.buktiParkir}
                              className="shrink-0 aspect-[0.81] w-[4rem] h-[6rem] rounded-md object-cover"
                            />
                          </>
                        ) : (
                          <></>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </>
          ) : (
            <>
              {props.jumlah > 0 && (
                <>
                  {currentData.map((item, index) => (
                    <tr
                      key={item.nama}
                      onClick={() => {
                        handleDetailShow(item);
                      }}
                      className="hover:cursor-pointer"
                    >
                      <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2">
                        {item.nama}
                      </td>

                      <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2">
                        {item.jumlahTrip} Trip
                      </td>

                      <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2">
                        {parseFloat(item.totalJarak.toFixed(2))} KM
                      </td>

                      <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2">
                        {formatDurasi(item.totalDurasi)}
                      </td>
                      <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2">
                        {formatRupiah(item.totalNominal)}
                      </td>
                      <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2">
                        {formatRupiah(item.totalParkir)}
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </>
          )}
        </tbody>
      </table>
      {props.showDetail == true ? (
        <>
          <div className="mt-10">
            {Array.from(
              {
                length: Math.ceil(props.detailData.length / dataPerPageDetail),
              },
              (_, i) => i + 1
            ).map((page) => (
              <button
                key={page}
                className={`mx-1 rounded-md border h-12 w-12 py-2 px-2 ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "bg-white text-blue-500"
                }`}
                onClick={() => paginate(page)}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="mt-10">
            {Array.from(
              { length: Math.ceil(props.data.length / dataPerPage) },
              (_, i) => i + 1
            ).map((page) => (
              <button
                key={page}
                className={`mx-1 rounded-md border h-12 w-12 py-2 px-2 ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "bg-white text-blue-500"
                }`}
                onClick={() => paginate(page)}
              >
                {page}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DataTable;
