import React, { useEffect, useState } from "react";
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
    const route_colors_per_route = {
      "778": "#A50606", // allston loop
      "2235": "#9467BD", // quad sec
      "790": "#136D1C"  // quad expresss (NOT quad yard express)
    }
    const route_colors = [
      "#A50606", // allston loop
      "#9467BD", // quad sec
      "#136D1C"  // quad expresss (NOT quad yard express)
    ];

    var trips_per_route_dict = {"778": [661197, 661198, 661199, 661200, 661201, 661203, 661204, 664485, 661205, 661206, 661207, 661208, 661210, 661211, 661212, 661213, 661214, 661215, 661216, 661217, 661218, 661219, 661220, 661221, 661223, 661224, 661225, 661226, 661227, 661228, 661229, 661309, 661316, 661317, 661318, 661319, 661320, 670445, 670446, 670447, 670450, 670612, 670613, 670614, 670615, 670616], "2235": [661310, 670460, 670461, 670503, 670504, 670505, 670506, 670507, 670508, 670509, 670510, 670511, 670512, 670531, 670532, 670533, 670534, 670535, 670536, 670537, 670539, 670540, 670541, 670542, 670543, 670544, 670545, 670546, 670547, 670548, 670549, 670550, 670551, 670552, 670553, 670554, 670555, 670556], "790": [661290, 661291, 661292, 661293, 661294, 661295, 661296, 661297, 661298, 661299, 661300, 661301, 661302, 661303, 661304, 661305, 661306, 670178, 670179, 670180, 670181, 670182, 670183, 670184, 670185, 670186, 670187, 670188, 670189, 670190, 670191, 670192, 670193, 670194, 670195, 670196, 670197, 670198, 670201, 670202, 670203, 670204, 670205, 670206, 670207, 670208, 670209, 670210, 670211, 670212, 670213, 670214]}

    const fetchStopsAndMarkers = () => {
      fetch('/google_transit/stops.txt')
        .then(response => response.text())
        .then(data => {
          const stops = data.split('\n').slice(1);
          stops.forEach(stop => {
            const stopInfo = stop.split(',');
            const stopName = stopInfo[2];
            const stopLat = parseFloat(stopInfo[4]);
            const stopLon = parseFloat(stopInfo[5]);

            const circle = L.circleMarker([stopLat, stopLon], {
              color: 'black',
              fillColor: 'black',
              fillOpacity: 1.0,
              radius: 5
            }).addTo(map);

            // display stop name once circle is clicked
            circle.bindPopup(stopName);
          });
        })
        .catch(error => console.error('Error fetching stops data:', error));
    };

    const fetchRoutes = () => {
      const fetchPromises = [];

      for (let i = 1; i <= route_colors.length; i++) {
        const route_json = `/routes/route_${i}.json`;
        fetchPromises.push(
          fetch(route_json)
            .then((response) => response.json())
            .then((data) => {
              const offset = (i - 1) * 0.0001;
              const polylineCoordinates = data.map(
                (coord) => new L.LatLng(coord[0], coord[1] + offset)
              );
              const polyline = L.polyline(polylineCoordinates, {
                color: route_colors[i - 1],
                weight: 2
              }).addTo(map);
              routePolylines.push(polyline);
            })
        );
      }

      return Promise.all(fetchPromises);
    };

    const updateMarkers = () => {
      fetch('https://passio3.com/harvard/passioTransit/gtfs/realtime/vehiclePositions.json')
        .then(response => response.json())
        .then(data => {
          // Remove previous circle markers
          circleMarkers.forEach(marker => marker.remove());
          circleMarkers = [];

          Object.keys(data).forEach(function(key) {
            var entities_list = data['entity'];

            entities_list.forEach(function(entity) {
              // TODO: add if statement to only display vehicles associated with the 3 routes we care about
              // trips_per_route_dict
              var vehicle = entity['vehicle'];
              var trip_id = parseInt(entity['vehicle']['trip']['trip_id']);
              var route_id = ''

              for (const [key, value] of Object.entries(trips_per_route_dict)) {
                if (value.includes(trip_id)) {
                  route_id = key;
                }
              }

              if (route_id != '') {
                var route_color = route_colors_per_route[route_id];

                var latitude = vehicle['position']['latitude'];
                var longitude = vehicle['position']['longitude'];
                console.log('lagtitude: ', latitude);
                console.log('longtitude: ', longitude);

                // Create a circle marker at the specified latitude and longitude
                var circle = L.circleMarker([latitude, longitude], {
                    color: route_color, // border color of marker
                    fillColor: route_color, // fill color of marker
                    fillOpacity: 1.0, // opacity of marker
                    radius: 5 // radius of marker
                }).addTo(map);

                circleMarkers.push(circle);
              }
            });
          });
        })
        .catch(error => console.error('Error fetching data:', error));
    };

    let circleMarkers = [];
    fetchStopsAndMarkers();

    fetchRoutes()
      .then(() => {
        map.fitBounds(L.featureGroup(routePolylines).getBounds());
        setInterval(updateMarkers, 1000); // fetch data and update markers every 1 second(s)
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
