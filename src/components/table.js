import React, { useState } from "react";

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

const DataTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(5);

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = data.slice(indexOfFirstData, indexOfLastData);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4 bg-white w-[90%] rounded-xl shadow-lg">
      <table className="w-full text-left text-lg font-normal">
        <thead>
          <tr className="bg-blue-500 text-white rounded-xl font-normal">
            <th className="px-4 py-2 font-medium">No</th>
            <th className="px-4 py-2 font-medium">Nama</th>
            <th className="px-4 py-2 font-medium">Alasan</th>
            <th className="px-4 py-2 font-medium">Lokasi Awal</th>
            <th className="px-4 py-2 font-medium">Lokasi Tujuan</th>
            <th className="px-4 py-2 font-medium">Jarak</th>
            <th className="px-4 py-2 font-medium">Durasi</th>
            <th className="px-4 py-2 font-medium">Nominal</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item) => (
            <tr key={item.id}>
              <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2">
                {item.id}
              </td>
              <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2">
                {item.name}
              </td>
              <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2">
                {item.age}
              </td>
              <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2">
                {item.age}
              </td>
              <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2">
                {item.age}
              </td>
              <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2">
                {item.age}
              </td>
              <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2">
                {item.age}
              </td>
              <td className="border-b border-blue-gray-300 h-[4rem] max-h-[6rem] px-4 py-2">
                {item.age}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-10">
        {Array.from(
          { length: Math.ceil(data.length / dataPerPage) },
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
    </div>
  );
};

export default DataTable;
