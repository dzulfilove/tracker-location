import * as React from "react";
import Navbar from "../components/navbar";

class BackTrip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      travelReason: "",
      selectedLocation: "",
      departureLocation: "",
      departureTime: "",
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
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
        <div className="flex relative flex-col px-5 w-full bg-white rounded-[32px] font-DM pt-6">
          <div className="flex justify-start items-center gap-12 text-xl font-bold tracking-wide leading-7 text-center robaseded-[32px] ">
            <Navbar />
            <div className="font-semibold text-xl ">Sampai Tujuan</div>
          </div>

          <div className="flex flex-col w-full p-2 h-auto justify-start gap-4 items-center mt-4">
            <img
              src="https://cdn0-production-images-kly.akamaized.net/9OUSsC0l4qNPdJKSI710gG-vt5A=/1200x1200/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/2978826/original/069237400_1574827441-20191126-Tampilan-Ronaldo-Pakai-Ikat-Rambut-AFP-2.jpg"
              className="w-[10rem] h-[15rem] flex justify-center items-center rounded-xl shadow-lg bg-white object-cover "
            />
            <button className="w-[15rem] p-2 bg-blue-500 text-white text-sm flex justify-center items-center rounded-md">
              {" "}
              Ambil Foto
            </button>
          </div>
          <div className="mt-6 text-sm font-medium leading-5 ">
            Lokasi Keberangkatan
          </div>
          <div className="flex flex-col justify-center mt-5 ">
            <input
              type="text"
              name="travelReason"
              readOnly
              value={this.state.travelReason}
              onChange={this.handleInputChange}
              className="shrink-0 h-11 bg-white rounded-xl shadow-md px-3 border-blue-500 border"
            />
          </div>
          <div className="mt-6 text-sm font-medium leading-5 ">
            Jam Keberangkatan
          </div>
          <div className="flex justify-between mt-5 ">
            <input
              type="text"
              name="travelReason"
              value={this.state.travelReason}
              onChange={this.handleInputChange}
              readOnly
              className="shrink-0 h-11 bg-white rounded-xl shadow-md px-3 w-[260px] border-blue-500 border"
            />
            <div className="p-3 rounded-full bg-blue-500 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="white"
                  d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10s10-4.486 10-10S17.514 2 12 2m0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8s8 3.589 8 8s-3.589 8-8 8"
                />
                <path
                  fill="white"
                  d="M13 7h-2v5.414l3.293 3.293l1.414-1.414L13 11.586z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-6 text-sm font-medium leading-5 ">
            Pilih Lokasi Sampai
          </div>
          <div className="flex flex-col justify-center mt-6">
            <input
              type="text"
              name="selectedLocation"
              value={this.state.selectedLocation}
              onChange={this.handleInputChange}
              className="shrink-0 h-11  bg-white rounded-lg shadow-md px-3"
            />
          </div>
          <div className="mt-6 text-sm font-medium leading-5 ">
            Tetapkan Lokasi Sampai
          </div>
          <div className="flex gap-3 mt-5 justify-between">
            <input
              type="text"
              name="departureLocation"
              value={this.state.departureLocation}
              onChange={this.handleInputChange}
              className="shrink-0 max-w-full h-11 bg-white rounded-lg border border-solid border-zinc-100 shadow-md w-[260px] px-3"
            />
            <div className="p-3 rounded-full bg-blue-500 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="white"
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7m0 9.5a2.5 2.5 0 0 1 0-5a2.5 2.5 0 0 1 0 5"
                />
              </svg>
            </div>
          </div>
          <div className="mt-6 text-sm font-medium leading-5 ">Jam Sampai</div>
          <div className="flex gap-3 mt-5 justify-between">
            <input
              type="text"
              name="departureLocation"
              value={this.state.departureLocation}
              readOnly
              onChange={this.handleInputChange}
              className="shrink-0 max-w-full h-11 bg-white rounded-lg border border-solid border-blue-500 shadow-md w-[260px] px-3"
            />
            <div className="p-3 rounded-full bg-blue-500 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="white"
                  d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10s10-4.486 10-10S17.514 2 12 2m0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8s8 3.589 8 8s-3.589 8-8 8"
                />
                <path
                  fill="white"
                  d="M13 7h-2v5.414l3.293 3.293l1.414-1.414L13 11.586z"
                />
              </svg>
            </div>
          </div>
          <button className="justify-center items-center p-2 mt-8 mb-10 text-base font-semibold tracking-wide leading-7 text-center text-white whitespace-nowrap bg-blue-500 rounded-lg">
            Simpan
          </button>
        </div>
      </div>
    );
  }
}

export default BackTrip;
