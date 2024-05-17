import * as React from "react";
import Navbar from "../components/navbar";

class History extends React.Component {
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
      trips: [
        {
          title: "Monitoring GTS",
          date: "15 Sep, 2022",
          route: "Kantor Pusat - GTS Palapa",
          distance: "15 KM",
          duration: "2 Jam",
        },
        {
          title: "Monitoring GTS",
          date: "15 Sep, 2022",
          route: "Kantor Pusat - GTS Palapa",
          distance: "15 KM",
          duration: "2 Jam",
        },
        {
          title: "Monitoring GTS",
          date: "15 Sep, 2022",
          route: "Kantor Pusat - GTS Palapa",
          distance: "15 KM",
          duration: "2 Jam",
        },
        {
          title: "Monitoring GTS",
          date: "15 Sep, 2022",
          route: "Kantor Pusat - GTS Palapa",
          distance: "15 KM",
          duration: "2 Jam",
        },
      ],
    };
  }

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
        <div className="font-DM flex flex-col px-4 pt-7 pb-8 mx-auto w-full bg-white   rounded-[32px]">
          <div className="flex gap-12 text-xl justify-start items-center font-bold tracking-wide leading-7 text-center robaseded-[32px] ">
            <Navbar />
            <div className=" self-start font-semibold text-xl">
              Riwayat Perjalanan
            </div>
          </div>
          <div className="w-full px-2 flex justify-between items-center mt-6">
            <div className="w-50% border bg-blue-500 rounded-md flex justify-center items-center px-5 py-2 text-sm font-medium text-white shadow-md">
              13 Mei 2024
            </div>
            --
            <div className="w-50% border bg-blue-500 rounded-md flex justify-center items-center px-5 py-2 text-sm font-medium text-white shadow-md">
              31 Mei 2024
            </div>
          </div>
          <div className=" bg-blue-500 text-white w-full  p-3 rounded-lg flex-auto self-start mt-4 text-base  font-medium">
            Data Perjalanan
          </div>
          <div className="flex flex-col px-5 mt-6 capitalize bg-slate-50 rounded-2xl  ">
            {this.state.trips.map((trip, index) => (
              <div
                key={index}
                onClick={() => {
                  window.location.href = "/detail-trip";
                }}
                className="flex flex-col justify-center mt-8 w-full text-xs font-bold leading-5 capitalize bg-white rounded-2xl "
              >
                <div className="flex gap-3.5 px-2 py-2.5 bg-white rounded-2xl border  border-solid shadow-md">
                  <img
                    loading="lazy"
                    srcSet="https://thumb.viva.co.id/media/frontend/thumbs3/2023/08/13/64d80ec78bcc1-cristiano-ronaldo-juara-arab-club-champions-cup-di-al-nassr_1265_711.jpg"
                    className="shrink-0 aspect-[0.81] w-[30%] rounded-md object-cover"
                  />
                  <div className="flex flex-col self-start mt-1.5 w-[65%]">
                    <div className="text-base leading-5 flex flex-wrap w-full font-medium  ">
                      {trip.title}
                    </div>
                    <div className="mt-2 text-sm font-medium leading-5 text-start text-stone-500">
                      {trip.date}
                    </div>
                    <div className="mt-2.5 text-start text-blue-500">
                      {trip.route}
                    </div>
                    <div className="flex text-sm font-medium justify-center items-start p-2 w-full mt-2.5 text-right text-white bg-blue-500 rounded-lg">
                      {trip.distance} ({trip.duration})
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
