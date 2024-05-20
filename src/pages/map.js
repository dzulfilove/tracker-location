import {
  MapContainer,
  TileLayer,
  Circle,
  CircleMarker,
  Polyline,
  Polygon,
  Rectangle,
} from "react-leaflet";
import { Icon } from "leaflet";
import MarkerIcon from "../assets/marker.png";
import { Marker } from "react-leaflet/Marker";
import { Popup } from "react-leaflet/Popup";
const center = [-5.404322389745186, 105.21239500924895];

const polyline = [
  [-5.391528099147527, 105.22667395019478],
  [-5.403021144477835, 105.22225367022453],
  [-5.398107787359712, 105.24117933855867],

  [-5.391528099147527, 105.22667395019478],
];

const multiPolyline = [
  [
    [-5.398107787359712, 105.24117933855867],
    [-5.403021144477835, 105.22225367022453],
  ],
  [
    [-5.391528099147527, 105.22667395019478],
    [-5.396740585394759, 105.19337164596004],
  ],
];
const multiPolyline2 = [
  {
    loc: [-5.398107787359712, 105.24117933855867],
  },
  { loc: [-5.403021144477835, 105.22225367022453] },
  {
    loc: [-5.391528099147527, 105.22667395019478],
  },
  { loc: [-5.396740585394759, 105.19337164596004] },
];

const polygon = [
  [51.515, -0.09],
  [51.52, -0.1],
  [51.52, -0.12],
];

const multiPolygon = [
  [
    [51.51, -0.12],
    [51.51, -0.13],
    [51.53, -0.13],
  ],
  [
    [51.51, -0.05],
    [51.51, -0.07],
    [51.53, -0.07],
  ],
];

const rectangle = [
  [51.49, -0.08],
  [51.5, -0.06],
];

const fillBlueOptions = { fillColor: "blue" };
const blackOptions = { color: "black" };
const limeOptions = { color: "lime" };
const purpleOptions = { color: "purple" };
const redOptions = { color: "ed" };

const MyLocation = (props) => {
  const customIcon = new Icon({
    iconUrl: MarkerIcon,
    iconSize: [38, 38],
  });

  console.log(props.objekMap, "Objek");
  console.log(props.arrayMap, "array");
  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {props.objekMap.map((item) => (
        <Marker position={item.location} icon={customIcon}>
          <Popup>{item.marker}</Popup>
        </Marker>
      ))}
      {/* <Circle center={center} pathOptions={fillBlueOptions} radius={200} />
      <CircleMarker
        center={[51.51, -0.12]}
        pathOptions={redOptions}
        radius={20}
      >
        <Popup>Popup in CircleMarker</Popup>
      </CircleMarker> */}
      {/* <Polyline pathOptions={limeOptions} positions={polyline} /> */}
      <Polyline pathOptions={limeOptions} positions={props.arrayMap} />
      {/* <Polygon pathOptions={purpleOptions} positions={polygon} />
      <Polygon pathOptions={purpleOptions} positions={multiPolygon} />
      <Rectangle bounds={rectangle} pathOptions={blackOptions} /> */}
    </MapContainer>
  );
};

export default MyLocation;
