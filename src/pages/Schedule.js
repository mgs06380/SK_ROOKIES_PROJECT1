import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axiosInstance from '../api/axiosConfig';
import styles from '../styles/Schedule.module.css';

const localizer = momentLocalizer(moment);

const getTripColor = (tripId) => {
  const colors = JSON.parse(localStorage.getItem('tripColors')) || {};
  return colors[tripId] || '#4C728D'; // 저장된 색상이 없으면 기본 색상 반환
};

const Schedule = ({ userId, refresh }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const tripsResponse = await axiosInstance.get('/trips');
        const trips = tripsResponse.data;

        let allEvents = [];

        for (const trip of trips) {
          try {
            const detailsResponse = await axiosInstance.get(`/tripDetails?tripId=${trip.id}`);
            const tripDetails = detailsResponse.data;

            if (tripDetails && tripDetails.length > 0) {
              const tripColor = getTripColor(trip.id);
              const tripEvents = tripDetails.map((detail) => {
                const startDate = moment(trip.start_date);
                const endDate = moment(trip.end_date);
                
                let startDateTime = startDate.clone().set({
                  hour: detail.start_time ? parseInt(detail.start_time.split(':')[0]) : 0,
                  minute: detail.start_time ? parseInt(detail.start_time.split(':')[1]) : 0
                });

                let endDateTime = startDate.clone().set({
                  hour: detail.end_time ? parseInt(detail.end_time.split(':')[0]) : 0,
                  minute: detail.end_time ? parseInt(detail.end_time.split(':')[1]) : 0
                });

                if (endDateTime.isBefore(startDateTime)) {
                  endDateTime.add(1, 'day');
                }

                if (detail.all_day) {
                  startDateTime = startDate.startOf('day');
                  endDateTime = endDate.endOf('day');
                }

                return {
                  title: detail.description,
                  start: startDateTime.toDate(),
                  end: endDateTime.toDate(),
                  allDay: detail.all_day,
                  color: tripColor,
                };
              });

              allEvents = [...allEvents, ...tripEvents];
            }
          } catch (error) {
            if (error.response && error.response.status === 404) {
              console.log(`No details found for trip ${trip.id}. Skipping.`);
            } else {
              console.error(`Error fetching details for trip ${trip.id}:`, error);
            }
          }
        }

        console.log('All events:', allEvents);
        setEvents(allEvents);
      } catch (error) {
        console.error('Failed to fetch trips', error);
      }
    };

    fetchEvents();
  }, [userId, refresh]);

  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: event.color,
      color: 'white',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: '14px',
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      whiteSpace: 'normal',
      wordBreak: 'break-word',
      textAlign: 'center',
      padding: '2px',
      margin: '0',
      boxSizing: 'border-box',
    };
    return { style };
  };

  return (
    <div className={styles.scheduleContainer}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        views={['week', 'day']}
        step={30}
        timeslots={1}
        defaultView='week'
        eventPropGetter={eventStyleGetter}
        formats={{
          eventTimeRangeFormat: () => '', // 시간 표시 안함
          eventTimeRangeStartFormat: () => '', // 시작 시간 표시 안함
          eventTimeRangeEndFormat: () => '', // 종료 시간 표시 안함
        }}
        dayLayoutAlgorithm={'no-overlap'}
      />
    </div>
  );
};

export default Schedule;
