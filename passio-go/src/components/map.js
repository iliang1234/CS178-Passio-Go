import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const HarvardSquareMap = () => {
  useEffect(() => {
    const map = L.map("map").setView([42.3736, -71.1097], 16);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);

    const routePolylines = [];
    const route_colors = [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "black",
      "purple",
      "cyan",
      "magenta",
      "goldenrod",
      "indianred",
      "lawngreen",
      "lightblue",
      "lightpink",
      "pink",
    ];

    const fetchPromises = [];

    for (let i = 1; i <= route_colors.length; i++) {
      const route_json = `/routes/route_${i}.json`;
      fetchPromises.push(
        fetch(route_json)
          .then((response) => response.json())
          .then((data) => {
            const offset = (i - 1) * 0.00002;
            const polylineCoordinates = data.map(
              (coord) => new L.LatLng(coord[0], coord[1] + offset)
            );
            const polyline = L.polyline(polylineCoordinates, {
              color: route_colors[i - 1],
            }).addTo(map);
            routePolylines.push(polyline);
          })
      );
    }

    Promise.all(fetchPromises)
      .then(() => {
        map.fitBounds(L.featureGroup(routePolylines).getBounds());
      })
      .catch((error) =>
        console.error("Error with fetching route data:", error)
      );

    return () => {
      map.remove();
    };
  }, []);

  return (
    <>
      <div id="map" style={{ height: "100%", width: "100%" }}></div>
    </>
  );
};

export default HarvardSquareMap;
