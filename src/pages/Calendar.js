import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axiosInstance from '../api/axiosConfig';
import styles from '../styles/Calendar.module.css';

const localizer = momentLocalizer(moment);

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const getTripColor = (tripId) => {
  const colors = JSON.parse(localStorage.getItem('tripColors')) || {};
  if (!colors[tripId]) {
    colors[tripId] = getRandomColor();
    localStorage.setItem('tripColors', JSON.stringify(colors));
  }
  return colors[tripId];
};

const MyCalendar = ({ userId, refresh }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get('/trips');
        const trips = response.data;
        const events = trips.map(trip => ({
          title: trip.title,
          start: new Date(trip.start_date),
          end: new Date(trip.end_date),
          allDay: true,
          color: getTripColor(trip.id)
        }));
        setEvents(events);
      } catch (error) {
        console.error('Failed to fetch trips', error);
      }
    };

    fetchEvents();
  }, [userId, refresh]);

  const eventStyleGetter = (event) => {
    const backgroundColor = event.color;
    const style = {
      backgroundColor,
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };
    return {
      style
    };
  };

  return (
    <div className={styles.calendarContainer}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        className={styles.calendar}
        views={['month']}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
};

export default MyCalendar;
