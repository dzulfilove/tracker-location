import React, { useState, useEffect } from "react";

function MyLocation() {
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [add, setAdd] = useState("");
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      console.log(latitude, longitude);
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => setAdd(data.address));
    });
  }, []);
  console.log(add);
  return (
    <div>
      <h2>My Current Location</h2>
      {position.latitude && position.longitude ? (
        <p>
          Latitude: , Longitude: {add.road}, {add.city}, {add.country}
        </p>
      ) : (
        <p>Loading...</p>
      )}

      <p>
        Latitude: , Longitude: {add.road}, {add.city}, {add.country}
      </p>
    </div>
  );
}

export default MyLocation;
