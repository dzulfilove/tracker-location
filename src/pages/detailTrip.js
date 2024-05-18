import * as React from "react";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { useMap } from "react-leaflet/hooks";
import { Marker } from "react-leaflet/Marker";
import { Popup } from "react-leaflet/Popup";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";

import MarkerIcon from "../assets/marker.png";
import MyLocation from "./map";
class DetailTrip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fromLocation: "",
      toLocation: "",
      distance: "15 KM",
      duration: "2 Jam",
      person: "Jose",
    };
  }
  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
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
          marginBottom: "1rem",
        }}>
        <div className=" font-DM flex flex-col pb-4 pt-4 justify-center items-start mx-auto w-full bg-white max-w-[480px] rounded-[32px]">
          <div className="flex  items-center justify-start gap-16 rounded-[32px] bg-white  p-2 px-4 w-full shadow-2xl ">
            <button className="flex justify-center items-center p-2 rounded-full bg-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24">
                <path
                  fill="#fff"
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
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
            <MyLocation />
            <div className="bg-gradient-to-b from-white/0 to-white/100 h-14"></div>
            <div className="absolute flex flex-col justify-start w-full z-[9999] mt-[18rem] pb-1 ">
              <div className="flex flex-col px-4 w-full text-xl font-bold tracking-wide leading-7 text-center text-indigo-950">
                <div className="shrink-0 self-center h-1 bg-gray-200 rounded-[100px] w-[63px]" />
              </div>
              <div className="flex  flex-col px-4 mt-6 w-full">
                <div className="flex z-10 gap-3.5 items-center p-2  mt-6 text-lg leading-5 capitalize  bg-white rounded-2xl shadow-[0px_4px_15px_rgba(0,0,0,0.11)]">
                  <img
                    loading="lazy"
                    src="https://cdn0-production-images-kly.akamaized.net/9OUSsC0l4qNPdJKSI710gG-vt5A=/1200x1200/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/2978826/original/069237400_1574827441-20191126-Tampilan-Ronaldo-Pakai-Ikat-Rambut-AFP-2.jpg"
                    className="shrink-0  w-14 aspect-[0.92] rounded-xl"
                  />
                  <div className="flex flex-col justify-start gap-3 items-start w-full p-2">
                    <div className="my-auto">{this.state.person}</div>
                    <div className="my-auto text-sm font-normal">
                      08:00 - 09:00
                    </div>
                  </div>
                </div>
                <div className="justify-center mt-4 items-start px-4 py-4 text-sm font-medium leading-5 text-blue-500 bg-white rounded-2xl border border-solid border-zinc-100 shadow-[0px_4px_15px_rgba(0,0,0,0.11)]">
                  Alasan Perjalanan
                  <p className="text-sm text-black font-normal mt-2">
                    jhbasxhbsjadcbsdbcjbdcjbsdejdb
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
                      <div className="flex flex-wrap font-medium  p-1 text-sm  text-slate-500 justify-start  items-center w-[41%] h-auto overflow-hidden">
                        Bandarjsncsssssssssssssssssssssssssssssssssssssssssssssssssssss
                      </div>
                    </div>

                    <div className="flex gap-4 pl-12">
                      <div className=" ml-1 flex flex-wrap font-medium  p-1 text-xs  text-slate-500 justify-start  items-center w-[45%] h-auto overflow-hidden">
                        Bandarjsncsssssssssssssssssssssssssssssssssssssssssssssssssssss
                      </div>
                    </div>
                    <div className="flex gap-5 mt-4 ">
                      <div className="font-medium text-indigo-950">Ke:</div>
                      <div className="pl-3 flex flex-wrap font-medium  p-1 text-sm  text-slate-500 justify-start  items-center w-[42%] h-auto overflow-hidden">
                        Bandarjsncsssssssssssssssssssssssssssssssssssssssssssssssssssss
                      </div>
                    </div>
                    <div className="flex gap-4 pl-12">
                      <div className=" ml-1 flex flex-wrap font-medium  p-1 text-xs  text-slate-500 justify-start  items-center w-[45%] h-auto overflow-hidden">
                        Bandarjsncsssssssssssssssssssssssssssssssssssssssssssssssssssss
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col px-7 mt-5 w-full font-bold text-indigo-950">
                <div className="flex flex-col gap-3 justify-between items-center p-2 text-base  text-center uppercase bg-white rounded-2xl shadow-[0px_4px_15px_rgba(0,0,0,0.15)]">
                  <div className="flex gap-5 justify-between items-center text-base  text-center uppercase w-full ">
                    <div className="w-[50%] flex justify-start gap-9 items-center p-2 ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24">
                        <path
                          fill="none"
                          stroke="#10B981"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 12V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6m-10 6H3m18 0h-7m-8-3l-3 3l3 3m12-6l3 3l-3 3"
                        />
                      </svg>
                      <div className="self-stretch my-auto">
                        {this.state.distance}
                      </div>
                    </div>
                    <div className="w-[50%] flex justify-start items-center gap-9 p-2 ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24">
                        <path
                          fill="#10B981"
                          d="M12 20c4.4 0 8-3.6 8-8s-3.6-8-8-8s-8 3.6-8 8s3.6 8 8 8m0-18c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12S6.5 2 12 2m.5 5v6H7v-1.5h4V7z"
                        />
                      </svg>

                      <div className="">{this.state.duration}</div>
                    </div>
                  </div>
                  <div className="flex p-2 gap-5 justify-between items-center text-base  text-center uppercase w-full border-t border-t-blue-500 ">
                    <div className="text-base font-semibold text-center w-full flex justify-center items-center">
                      Rp. 100.0000,00
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DetailTrip;
