import * as React from 'react';
import { useState, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar, PickersDay } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import 'dayjs/locale/it';
import { Badge } from '@mui/material';

// Imposta la localizzazione in italiano
dayjs.locale('it');
const token = localStorage.getItem('tokenID');

const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center backdrop-blur-sm z-50">
    <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
  </div>
);

export default function StyledDateCalendar() {
  const [events, setEvents] = useState([]);
  const [dateEv, setDateEv] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const api = process.env.NEXT_PUBLIC_API;

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${api}/calendar`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setEvents(data.eventi || []);
        setDateEv(data.eventi_data || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  // Funzione per determinare il numero di eventi specifici per una data
  const getEventCounts = (day) => {
    const myEventCount = events.filter((event) => dayjs(event.data).isSame(day, 'day')).length;
    const dateEvent = dateEv.find((date) => dayjs(date.data).isSame(day, 'day'));
    const otherEventCount = dateEvent ? dateEvent.num : 0;
    return { myEventCount, otherEventCount };
  };

  // Custom Day Renderer con colori dinamici
  const CustomDay = (props) => {
    const { day, outsideCurrentMonth, ...other } = props;
    const { myEventCount, otherEventCount } = getEventCounts(day);

    // Determina il colore del badge
    let badgeColor = 'default'; // Default: nessun colore
    let customBackgroundColor;

    if (myEventCount > 0) {
      badgeColor = 'primary'; // Blu per i tuoi eventi
    } else if (otherEventCount === 1) {
      badgeColor = 'success'; // Verde intenso per un evento
    } else if (otherEventCount === 2) {
      customBackgroundColor = '#FF4500'; // Arancione scuro personalizzato
    } else if (otherEventCount >= 3) {
      customBackgroundColor = '#FF0000'; // Rosso scuro personalizzato
    }

    return (
      <Badge
        key={day.toString()}
        overlap="circular"
        badgeContent={(myEventCount > 0 || otherEventCount > 0) ? '•' : undefined}
        color={customBackgroundColor ? undefined : badgeColor}
        className="relative"
        sx={{
          '& .MuiBadge-badge': {
            width: '8px',
            height: '8px',
            top: '20%',
            right: '50%',
            transform: 'translate(50%, -50%)',
            backgroundColor: customBackgroundColor || undefined,
            border: customBackgroundColor ? '2px solid white' : undefined, // Contrasto maggiore
          },
        }}
      >
        <PickersDay {...other} day={day} outsideCurrentMonth={outsideCurrentMonth} />
      </Badge>
    );
  };

  return (
    isLoading ? <LoadingOverlay /> : (
      <div className="mt-24 w-full flex flex-row bg-gray-800 rounded-xl p-6">
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
        <div className="p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg h-[350px]">
          <DateCalendar
            sx={{
              '.MuiPickersDay-root': {
                color: '#ffffff',
                '&.Mui-selected': {
                  backgroundColor: '#3B82F6',
                  color: '#ffffff',
                  borderRadius: '8px',
                },
                '&:hover': {
                  backgroundColor: '#374151',
                },
              },
              '.MuiPickersCalendarHeader-root': {
                color: '#3B82F6',
                padding: '10px 0',
                borderRadius: '6px',
              },
              '.MuiPickersCalendarHeader-label': {
                fontWeight: 'bold',
                fontSize: '1.5rem',
                textTransform: 'capitalize',
              },
              '.MuiPickersCalendarHeader-day': {
                color: '#9CA3AF',
              },
              '.MuiTypography-root': {
                color: '#E5E7EB',
              },
              '.MuiPickersArrowSwitcher-root .MuiSvgIcon-root': {
                color: '#ffffff',
              },
              '.MuiPickersArrowSwitcher-button': {
                '&:hover': {
                  backgroundColor: '#374151',
                },
              },
              '.MuiDayCalendar-weekDayLabel': {
                color: '#E5E7EB',
              },
            }}
            slots={{
              day: CustomDay,
            }}
          />
        </div>
      </LocalizationProvider>
      <div className="divider mx-4 bg-gray-700 w-1" />
      <div className="flex-1 p-4">
        <h2 className="text-xl font-semibold text-blue-400 mb-4">I tuoi eventi</h2>
        <div className="grid grid-cols-1 gap-4 
        overflow-y-auto max-h-[320px] scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-700">
          {events.map((event, key) => (
            <div
              key={key}
              className="bg-gray-700 rounded-xl p-4 shadow transition-transform duration-300"
            >
              <h3 className="text-lg font-bold text-white mb-2">{event.titolo}</h3>
              <p className="text-sm text-gray-400 mb-1">
                <strong>Data:</strong> {dayjs(event.data).format('DD MMMM YYYY')}
              </p>
              <p className="text-sm text-gray-400 mb-1">
                <strong>Luogo:</strong> {event.luogo}
              </p>
              <p className="text-sm text-gray-400">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    )
  );
}