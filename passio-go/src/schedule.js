import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./components/accordion";
import Papa from "papaparse";

const Schedule = ({ routeId }) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Function to convert 24-hour time to 12-hour time format and return in a sortable format
  const convertAndSortTime = (time24) => {
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = ((hours + 11) % 12) + 1;
    return {
      display: `${hours12}:${minutes < 10 ? "0" + minutes : minutes} ${period}`,
      sortValue: hours * 60 + minutes, // Convert to minutes for easy comparison
    };
  };

  // Function to check if a time is after the current time
  const isAfterCurrentTime = (timeString) => {
    const [time, period] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    // Adjust hours for 12-hour time format
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
  
    const now = new Date();
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
    const timeInMinutes = hours * 60 + minutes;
  
    return timeInMinutes > currentTimeInMinutes;
  };
  

  useEffect(() => {
    const fetchCsv = (filePath) => {
      return fetch(filePath)
        .then((response) => response.text())
        .then((csvText) =>
          Papa.parse(csvText, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
          })
        )
        .then((result) => result.data)
        .catch((err) => {
          throw new Error(`Error parsing ${filePath}: ${err.message}`);
        });
    };

    Promise.all([
      fetchCsv("/google_transit/trips.txt"),
      fetchCsv("/google_transit/stop_times.txt"),
      fetchCsv("/google_transit/stops.txt"),
    ])
      .then(([trips, stopTimes, stops]) => {
        const tripIds = trips
          .filter((trip) => trip.route_id.toString() === routeId)
          .map((trip) => trip.trip_id);
        const filteredStopTimes = stopTimes.filter((stopTime) =>
          tripIds.includes(stopTime.trip_id)
        );

        const stopsMap = stops.reduce(
          (acc, stop) => ({ ...acc, [stop.stop_id]: stop.stop_name }),
          {}
        );

        const scheduleForRoute = filteredStopTimes.reduce((acc, stopTime) => {
          const stopName = stopsMap[stopTime.stop_id];
          if (!acc[stopName]) {
            acc[stopName] = [];
          }
          const { display, sortValue } = convertAndSortTime(
            stopTime.arrival_time
          );
          acc[stopName].push({ display, sortValue });
          return acc;
        }, {});

        // Sort times for each stop
        for (let stopName in scheduleForRoute) {
          scheduleForRoute[stopName].sort((a, b) => a.sortValue - b.sortValue);
          scheduleForRoute[stopName] = scheduleForRoute[stopName].map(
            (time) => time.display
          ); 
        }

        setSchedule(
          Object.entries(scheduleForRoute).map(([stopName, times]) => ({
            stopName,
            times,
          }))
        );
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [routeId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {schedule.length > 0 ? (
        schedule.map((item, index) => {
            
          // Find the index of the closest time to the current time for each stop
          const closestTimeIndex = item.times
            .map((time) => isAfterCurrentTime(time))
            .indexOf(true);

          return (
            <div key={index}>
              <Accordion className="AccordionRoot" type="multiple">
                <AccordionItem value={item.stopName}>
                  <AccordionTrigger>
                    <h3 className="stop-name">{item.stopName}</h3>
                  </AccordionTrigger>
                  <AccordionContent className='schedule-content'>
                    <div className='stops-dropdown'>
                      {item.times.map((time, timeIndex) => (
                        <div
                          key={timeIndex}
                          className={`times ${timeIndex === closestTimeIndex ? 'closest-time' : ''}`}
                        >
                          {time}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          );
        })
      ) : (
        <div>No schedule found for this route.</div>
      )}
    </div>
  );
};

export default Schedule;
