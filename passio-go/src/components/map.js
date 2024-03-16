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
    const route_colors_per_route = {
      "778": "#A50606", // allston loop
      "2235": "#9467BD", // quad sec
      "790": "#136D1C"  // quad expresss (NOT quad yard express)
    }
    const route_names_per_route = {
      "778": "Allston Loop",
      "2235": "Quad SEC",
      "790": "Quad Express"
    }
    const route_colors = [
      "#A50606", // allston loop
      "#9467BD", // quad sec
      "#136D1C"  // quad expresss (NOT quad yard express)
    ];

    var trips_per_route_dict = {"778": [661197, 661198, 661199, 661200, 661201, 661203, 661204, 664485, 661205, 661206, 661207, 661208, 661210, 661211, 661212, 661213, 661214, 661215, 661216, 661217, 661218, 661219, 661220, 661221, 661223, 661224, 661225, 661226, 661227, 661228, 661229, 661309, 661316, 661317, 661318, 661319, 661320, 670445, 670446, 670447, 670450, 670612, 670613, 670614, 670615, 670616], "2235": [661310, 670460, 670461, 670503, 670504, 670505, 670506, 670507, 670508, 670509, 670510, 670511, 670512, 670531, 670532, 670533, 670534, 670535, 670536, 670537, 670539, 670540, 670541, 670542, 670543, 670544, 670545, 670546, 670547, 670548, 670549, 670550, 670551, 670552, 670553, 670554, 670555, 670556], "790": [661290, 661291, 661292, 661293, 661294, 661295, 661296, 661297, 661298, 661299, 661300, 661301, 661302, 661303, 661304, 661305, 661306, 670178, 670179, 670180, 670181, 670182, 670183, 670184, 670185, 670186, 670187, 670188, 670189, 670190, 670191, 670192, 670193, 670194, 670195, 670196, 670197, 670198, 670201, 670202, 670203, 670204, 670205, 670206, 670207, 670208, 670209, 670210, 670211, 670212, 670213, 670214]}

    const findKeyForValue = (obj, value) => {
      for (const key in obj) {
        if (obj.hasOwnProperty(key) && obj[key].includes(value)) {
          return key;
        }
      }
      return null;
    };

    const inDictValues = (obj, value) => {
      for (const routeTrips of Object.values(obj)) {
        if (routeTrips.includes(value)) {
          return true;
        }
      }
      return false;
    };

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
            
            circle.on('click', function() {
              const stopId = stopInfo[0];

              const updatePopupContent = () => {
                let popupContent = `<strong>${stopName}</strong><br><br>`;

                fetch('https://passio3.com/harvard/passioTransit/gtfs/realtime/tripUpdates.json')
                    .then(response => response.json())
                    .then(tripUpdateData => {
                        // Initialize arrays to store arrival times and uncertainty values
                        const arrivalTimes = [];
                        const uncertaintyValues = []; // contains subarray [predArrivalTimeDiff, routeName]
              
                        const uncertaintyFetchPromises = []; // Array to store promises for fetching uncertainty data
              
                        for (const entity of tripUpdateData.entity) {
                            if (entity.trip_update && entity.trip_update.stop_time_update) {
                                for (const stopTimeUpdate of entity.trip_update.stop_time_update) {
                                    if (stopTimeUpdate.stop_id === stopId) {
                                        const tripId = entity.trip_update.trip.trip_id;

                                        // if trip is one of the three routes
                                        if (inDictValues(trips_per_route_dict, parseInt(tripId))) {
                                            const arrivalTime = stopTimeUpdate.arrival ? new Date(stopTimeUpdate.arrival.time * 1000).toLocaleString() : 'Unknown';
                                            arrivalTimes.push(arrivalTime);
              
                                            // Fetch uncertainty data and extract the uncertainty value
                                            const uncertaintyFetchPromise = fetch('./google_transit/uncertainties_by_route.txt')
                                                .then(response => response.text())
                                                .then(uncertaintyData => {
                                                    const uncertaintyLines = uncertaintyData.split('\n').slice(1); // Skip header line
                                                    for (const uncertaintyLine of uncertaintyLines) {
                                                        const [lineRouteId, lineStopId, lineActualArrival, predActualDiffArrival] = uncertaintyLine.split(',');
                  
                                                        const routeId = findKeyForValue(trips_per_route_dict, parseInt(tripId));
                                                        const routeName = route_names_per_route[routeId];
                  
                                                        if ((parseInt(lineRouteId) === parseInt(routeId)) && (parseInt(lineStopId) === parseInt(stopId))) {
                                                            uncertaintyValues.push([predActualDiffArrival, routeName]);
                                                            return; // Exit the loop once the uncertainty value is found
                                                        }
                                                    }
                                                })
                                                .catch(error => {
                                                    console.error('Error fetching uncertainty data:', error);
    
                                                });
                  
                                            uncertaintyFetchPromises.push(uncertaintyFetchPromise);
                                        } // end inDictValues if
                                    } // end stopId if
                                } // end trip_update if
                            }
                        }
              
                        // Wait for all uncertainty fetch promises to resolve
                        Promise.all(uncertaintyFetchPromises)
                            .then(() => {
                                // Append arrival times and uncertainty values to the popup content
                                arrivalTimes.forEach((arrivalTime, index) => {
                                    const routeName = uncertaintyValues[index][1];

                                    // popupContent += `<strong>Trip ID:</strong> ${tripUpdateData.entity[index].trip_update.trip.trip_id}<br>`;
                                    popupContent += `<strong>Route:</strong> ${routeName}<br>`;
                                    popupContent += `<strong>Arrival Time:</strong> ${arrivalTime}<br>`;
                                    popupContent += `<strong>Uncertainty Value:</strong> ${uncertaintyValues[index][0] || 'Unknown'}<br><br>`;
                                });
                                circle.setPopupContent(popupContent);
                            })
                            .catch(error => console.error('Error with uncertainty fetch promises:', error));
                    })
                    .catch(error => console.error('Error fetching live data:', error));
              };

              updatePopupContent();

              setInterval(updatePopupContent, 3000);
          });
          
          
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

              if (route_id !== '') {
                var route_color = route_colors_per_route[route_id];

                var latitude = vehicle['position']['latitude'];
                var longitude = vehicle['position']['longitude'];

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
        setInterval(updateMarkers, 1000); // fetch data and update bus locations every 1 second(s)
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
