import * as React from "react";
import "../styles/style.css";
import { Link } from "react-router-dom";

import Navbar from "../components/navbar";
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "Dzulfi Allaudin",
      startDate: "25, Des 2024",
      endDate: "25, Des 2025",
      totalTrips: 27,
      totalDistance: "200 KM",
      totalDuration: "120 Jam",
      submittedAmount: "Rp. 100000000",
      currentTrip: {
        title: "Monitoring GTS",
        date: "15 Sep, 2022",
        from: "Kantor Pusat",
        status: "Belum Sampai",
      },
    };
  }

  render() {
    const {
      userName,
      startDate,
      endDate,
      totalTrips,
      totalDistance,
      totalDuration,
      submittedAmount,
      currentTrip,
    } = this.state;

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
        <div className="font-DM flex flex-col px-4 pt-7 pb-11 mx-auto w-full font-bold bg-white shadow-2xl rounded-[32px]">
          <div className="flex gap-5 text-xl tracking-wide leading-7 text-center whitespace-nowrap rounded-[32px] text-indigo-950">
            <Navbar />
            <div className="flex-auto my-auto text-xl font-semibold">
              Dashboard
            </div>
          </div>
          <div className="w-full px-2 flex justify-between items-center mt-8">
            <div className="w-50% border bg-blue-500 rounded-md flex justify-center items-center px-5 py-2 text-sm font-medium text-white">
              13 Mei 2024
            </div>
            --
            <div className="w-50% border bg-blue-500 rounded-md flex justify-center items-center px-5 py-2 text-sm font-medium text-white">
              31 Mei 2024
            </div>
          </div>
          <div className="flex gap-5 justify-between px-5 py-7 mt-3 w-full text-base leading-5 bg-white rounded-2xl border border-solid border-zinc-100 shadow-xl">
            <div className="flex flex-col text-indigo-950 w-full">
              <div className="text-base tracking-wide leading-7 text-start pb-3 border-b border-b-blue-500 mb-4 font-semibold">
                {userName}
              </div>
              <div className="w-[100%]  flex justify-between items-center font-semibold">
                <div className="flex flex-col  capitalize">
                  <div className=" text-blue-500 capitalize">dari</div>
                  <div className="mt-3 capitalize font-medium  rounded-md">
                    {startDate}
                  </div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                >
                  <g fill="none">
                    <path
                      fill="#3B82F6"
                      d="M2 9c0-1.886 0-2.828.586-3.414C3.172 5 4.114 5 6 5h12c1.886 0 2.828 0 3.414.586C22 6.172 22 7.114 22 9c0 .471 0 .707-.146.854C21.707 10 21.47 10 21 10H3c-.471 0-.707 0-.854-.146C2 9.707 2 9.47 2 9"
                    />
                    <path
                      fill="#3B82F6"
                      fill-rule="evenodd"
                      d="M2.586 21.414C2 20.828 2 19.886 2 18v-5c0-.471 0-.707.146-.854C2.293 12 2.53 12 3 12h18c.471 0 .707 0 .854.146c.146.147.146.383.146.854v5c0 1.886 0 2.828-.586 3.414C20.828 22 19.886 22 18 22H6c-1.886 0-2.828 0-3.414-.586M8 16a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2z"
                      clip-rule="evenodd"
                    />
                    <path
                      stroke="#34D399"
                      stroke-linecap="round"
                      stroke-width="2"
                      d="M7 3v3m10-3v3"
                    />
                  </g>
                </svg>
                <div className="flex flex-col capitalize">
                  <div className="text-blue-500">Sampai</div>
                  <div className="mt-2.5 text-indigo-950 font-medium">
                    {endDate}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center px-4 pt-5 pb-8 mt-6 w-full tracking-wide text-center text-white bg-blue-500 rounded-2xl border border-blue-500 border-solid shadow-[0px_4px_15px_rgba(0,0,0,0.15)]">
            <div className="self-stretch text-base text-start font-semibold leading-7 pb-3 mb-4 border-b border-b-white">
              {totalTrips} Perjalanan
            </div>

            <div className="flex  flex-col flex-start items-center gap-2 mt-3 w-full  ">
              <div className="flex w-[100%] items-center justify-between">
                <div className="flex gap-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="white"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 12V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6m-10 6H3m18 0h-7m-8-3l-3 3l3 3m12-6l3 3l-3 3"
                    />
                  </svg>
                  <div className="text-sm leading-7 font-medium">
                    Total Jarak
                  </div>
                </div>
                <div className="text-base leading-7 font-semibold">
                  {totalDistance}
                </div>
              </div>
              <div className="flex  w-[100%] items-center justify-between ">
                <div className="flex gap-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="white"
                      d="M12 20c4.4 0 8-3.6 8-8s-3.6-8-8-8s-8 3.6-8 8s3.6 8 8 8m0-18c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12S6.5 2 12 2m.5 5v6H7v-1.5h4V7z"
                    />
                  </svg>
                  <div className="text-sm leading-7 font-medium">
                    Total Durasi
                  </div>
                </div>
                <div className="text-base leading-7 font-semibold">
                  {totalDuration}
                </div>
              </div>
            </div>
            <div className="flex  flex-col flex-start items-center gap-2 mt-3 w-full  ">
              <div className="flex w-[100%] items-center justify-between">
                <div className="flex gap-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="white"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m14.5 10l-.035-.139A2.457 2.457 0 0 0 12.082 8h-.522a1.841 1.841 0 0 0-.684 3.55l2.248.9A1.841 1.841 0 0 1 12.44 16h-.521a2.457 2.457 0 0 1-2.384-1.861L9.5 14M12 6v2m0 8v2m9-6a9 9 0 1 1-18 0a9 9 0 0 1 18 0"
                    />
                  </svg>
                  <div className="text-sm leading-7 font-medium">Pengajuan</div>
                </div>

                <div className="text-base leading-7 font-semibold">
                  {submittedAmount}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full px-3 flex justify-center mt-5">
            <Link
              to="/mytrip"
              className="self-start text-base font-medium tracking-wide leading-7 text-center text-white bg-blue-500 w-full p-2 rounded-xl shadow-lg flex justify-center gap-5 items-center"
            >
              Perjalanan Saat Ini
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="white"
                  fill-rule="evenodd"
                  d="m9.005 4l8 8l-8 8L7 18l6.005-6L7 6z"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
