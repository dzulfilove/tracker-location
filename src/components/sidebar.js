import React, { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { RiSettings4Line } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
import { AiOutlineUser, AiOutlineHeart } from "react-icons/ai";
import { FiMessageSquare, FiFolder, FiShoppingCart } from "react-icons/fi";
import { Link, NavLink } from "react-router-dom";
import DashboardAdmin from "../pages/dashboardAdmin";
import Logo from "../assets/iconLogo.png";
import Tables from "./table";
import DataTable from "./table";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import Select from "react-tailwindcss-select";
import { DatePicker } from "@mui/x-date-pickers";
const Home = () => {
  const menus = [
    { name: "Dashboard", link: "/dashboard", icon: MdOutlineDashboard },
    { name: "user", link: "/", icon: AiOutlineUser },
    { name: "messages", link: "/", icon: FiMessageSquare },
    { name: "File Manager", link: "/", icon: FiFolder },
    { name: "Cart", link: "/", icon: FiShoppingCart },
    { name: "Setting", link: "/", icon: RiSettings4Line },
  ];
  const [open, setOpen] = useState(true);
  const [tanggalAwal, setTanggalAwal] = useState(
    dayjs("2024-05-01").locale("id")
  );
  const [tanggalAkhir, setTanggalAkhir] = useState(dayjs().locale("id"));
  const optionsUser = [
    { value: "Dalam Kota", label: "Dalam Kota" },
    { value: "Luar Kota", label: "Luar Kota" },
  ];
  return (
    <section className="flex gap-6 bg-[#F1F5F9]">
      <div
        className={`bg-[#1C2434] min-h-screen pl-8 ${
          open ? "w-72" : "w-[6rem]"
        } duration-500 text-gray-100 px-4`}
      >
        <div className="py-3 flex justify-end">
          <HiMenuAlt3
            size={26}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div
          className={`flex ${
            open ? "px-4" : "px-0"
          }items-center justify-center gap-2 py-5.5 lg:py-6.5 mb-10 mt-3 `}
        >
          <NavLink
            className="flex px-1 justify-start gap-5 w-full items-center"
            to="/"
          >
            <img
              loading="lazy"
              src={Logo}
              className="shrink-0  w-8  h-8 bg-slate-900 rounded-xl object-cover"
            />
            {open && (
              <>
                <h5
                  tyle={{
                    transitionDelay: `${4}00ms`,
                  }}
                  className={`text-xl font-semibold text-white text-center whitespace-pre duration-500 ${
                    !open && "opacity-0 translate-x-28 overflow-hidden"
                  }`}
                >
                  Halo Admin
                </h5>
              </>
            )}
          </NavLink>
        </div>

        <div
          className={`${open ? "p-2" : "p-0"} text-base w-full  text-gray-400 `}
        >
          Menu
        </div>
        <div className="mt-4 flex flex-col gap-4 relative">
          {menus?.map((menu, i) => (
            <Link
              to={menu?.link}
              key={i}
              className={` ${
                menu?.margin && "mt-5"
              } group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-blue-600 rounded-md`}
            >
              <div>{React.createElement(menu?.icon, { size: "20" })}</div>
              <h2
                style={{
                  transitionDelay: `${i + 3}00ms`,
                }}
                className={`whitespace-pre duration-500 ${
                  !open && "opacity-0 translate-x-28 overflow-hidden"
                }`}
              >
                {menu?.name}
              </h2>
              <h2
                className={`${
                  open && "hidden"
                } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
              >
                {menu?.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>
      <div className=" mt-8 text-xl text-gray-900 font-semibold w-full flex flex-col justify-start items-center ">
        <div className="flex w-full mt-6 h-full flex-col justify-start items-center gap-6 ">
          <div className="w-[90%] flex justify-start items-center  text-2xl font-semibold bg-white shadow-md p-4 py-6 rounded-xl">
            Data Perjalanan
          </div>
          <div
            className="w-[90%] flex justify-between items-end  text-2xl font-semibold  "
            style={{ zIndex: "99999" }}
          >
            <div className="w-auto flex z-[999] justify-start gap-3 items-center p-2 border shadow-md bg-white rounded-xl">
              <div className="flex flex-col justify-center z-[999] w-[20rem]">
                <Select
                  options={optionsUser}
                  name="Lokasi"
                  placeholder="Pilih User"
                  // value={this.state.lokasi}
                  // onChange={this.handleChangeLokasi}
                  classNames={{
                    menuButton: ({ isDisabled }) =>
                      `ps-3 text-[15px] flex text-base z-[999] text-blue-500 w-[100%] rounded-lg  transition-all duration-300 focus:outline-none ${
                        isDisabled ? "" : " focus:ring focus:ring-blue-500/20"
                      }`,
                    menu: "bg-white absolute w-full bg-slate-50 shadow-lg z-[999] border rounded py-1 mt-1.5 text-base text-gray-700",
                    listItem: ({ isSelected }) =>
                      `block transition duration-200 px-2 py-2 cursor-pointer z-[999] select-none truncate rounded-lg ${
                        isSelected
                          ? "text-blue-500 bg-slate-50"
                          : "text-blue-500 hover:bg-blue-100 hover:text-blue-500"
                      }`,
                  }}
                />
              </div>
            </div>
            <div className="w-auto flex justify-start gap-3 items-center p-2 px-6 border shadow-md bg-white rounded-xl">
              <div className="w-[10rem] flex justify-center items-center px-2 py-4 text-sm font-medium ">
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="id"
                >
                  <DatePicker
                    name="tanggalAwal"
                    locale="id"
                    className="bg-white"
                    label="Tanggal Awal"
                    value={tanggalAwal}
                    onChange={(selectedDate) =>
                      this.handleFilter("tanggalAwal", selectedDate)
                    }
                    inputFormat="DD/MM/YYYY"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="dd/mm/yyyy"
                        fullWidth
                      />
                    )}
                  />
                </LocalizationProvider>
              </div>
              -
              <div className="w-[10rem] flex justify-center items-center px-2 py-4 text-sm font-medium ">
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="id"
                >
                  <DatePicker
                    name="tanggalAwal"
                    locale="id"
                    className="bg-white"
                    label="Tanggal Akhir"
                    value={tanggalAkhir}
                    onChange={(selectedDate) =>
                      this.handleFilter("tanggalAkhir", selectedDate)
                    }
                    inputFormat="DD/MM/YYYY"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="dd/mm/yyyy"
                        fullWidth
                      />
                    )}
                  />
                </LocalizationProvider>
              </div>
            </div>
          </div>
          <DataTable />
        </div>
      </div>
    </section>
  );
};

export default Home;
