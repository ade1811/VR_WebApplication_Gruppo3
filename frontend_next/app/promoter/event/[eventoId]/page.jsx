'use client';

import { ArrowLeftIcon, PencilIcon } from "@heroicons/react/solid";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from 'react';
import PrezzoView from "@/app/components/PrezzoView";
import dayjs from "dayjs";

export default function EventDetail({ params }) {
  const router = useRouter();
  const [evento, setEvento] = useState(null);
  const [pacchetti, setPacchetti] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [titolo, setTitolo] = useState(evento?.titolo || '');
  const [descrizione, setDescrizione] = useState(evento?.descrizione || '');
  const [luogo, setLuogo] = useState(evento?.luogo || '');
  const [data, setData] = useState(evento?.data || '');
  const [ora, setOra] = useState(evento?.ora || '');
  const [displayLocation, setDisplayLocation] = useState('');
  const api = process.env.NEXT_PUBLIC_API;

  const [eventoID, setEventoID] = useState("");


  const par = React.use(params);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(api + "/getEventP/" + par.eventoId, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenID")}`,
          },
        });
        const jsonData = await response.json();
        if (response.status === 404) {
          router.push('/404');
          return;
        }
        setEvento(jsonData.data.evento);
        setPacchetti(jsonData.data.pacchetti);
        setEventoID(par.eventoId);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };
    fetchData();
  }, [api, par.eventoId]);

  const saveChanges = async () => {
    try {
      const response = await fetch(`${api}/modifyEvent`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tokenID')}`
        },
        body: JSON.stringify({eventoID, titolo, descrizione,
          luogo, data, ora})
      });

      if (response.ok) {
        setIsEditing(false);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

// Initialize Google Places Autocomplete
useEffect(() => {
  const loadGoogleMapsScript = () => {
    if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAPS_API}&libraries=places`;
      script.async = true;
      script.onload = initializeAutocomplete;
      document.head.appendChild(script);
    } else if (window.google) {
      initializeAutocomplete();
    }
  };

  const initializeAutocomplete = () => {
    const input = document.getElementById('location-input');
    if (input && window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(input);
      
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          
          setDisplayLocation(place.formatted_address);
          setLuogo(`${lat},${lng}`);
        }
      });
    }
  };

  loadGoogleMapsScript();
}, [isEditing]);

  return (
    <div className="bg-bg1 min-h-screen text-white relative">
  {/* Opacità di sfondo */}
  <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

  {/* Contenuto principale */}
  <div className="relative z-10">
    {/* Header */}
    <header className="bg-gray-800 px-6 py-4 flex items-center shadow-md fixed w-full top-0 z-50">
      <ArrowLeftIcon
        className="h-6 w-6 text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
        onClick={() => router.back()}
      />
      <h1 className="text-xl font-bold ml-4">Dettaglio Evento</h1>
    </header>

    {/* Main Content */}
    <main className="pt-20 pb-6 px-6 lg:px-16">
      {/* Sezione immagine e dettagli */}
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Immagine */}
        <div className="w-full lg:w-1/2 h-64 lg:h-auto rounded-lg overflow-hidden shadow-lg">
          <img
            src={evento ? api + "/image/" + evento.copertina : null}
            alt={evento?.titolo}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Dettagli */}
        <div className="w-full lg:w-1/2 mt-6 lg:mt-0 bg-gray-800 p-8 rounded-lg shadow-lg">
          {isEditing ? (
            <>
              <input
                type="text"
                className="w-full bg-gray-700 text-white p-2 rounded mb-4"
                value={titolo}
                placeholder={evento?.titolo}
                onChange={(e) => setTitolo(e.target.value)}
              />
              <textarea
                className="w-full bg-gray-700 text-white p-2 rounded mb-4"
                placeholder={evento?.descrizione}
                value={descrizione}
                onChange={(e) => setDescrizione(e.target.value)}
              />
              <input
                id="location-input"
                type="text"
                className="w-full bg-gray-700 text-white p-2 rounded mb-4"
                placeholder={evento?.luogo}
                value={displayLocation}
                onChange={(e) => setDisplayLocation(e.target.value)}
              />
              <div className="flex space-x-4 mb-4">
                <input
                  type="date"
                  className="bg-gray-700 text-white p-2 rounded"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                />
                <input
                  type="time"
                  className="bg-gray-700 text-white p-2 rounded"
                  value={ora}
                  onChange={(e) => setOra(e.target.value)}
                />
              </div>
              <div className="flex space-x-4">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                  onClick={saveChanges}
                >
                  Salva
                </button>
                <button
                  className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
                  onClick={() => setIsEditing(false)}
                >
                  Annulla
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl lg:text-3xl text-gray-100 leading-tight">Scheda descrittiva di:</h1>
              <h2 className="text-4xl lg:text-6xl font-extrabold text-gray-100 leading-tight">
                {evento?.titolo || "Caricamento..."}
              </h2>
              <p className="text-blue-600 text-lg">{evento?.genere}</p>
              <p className="text-gray-400 mt-4 text-lg lg:text-xl leading-relaxed">
                {evento?.descrizione}
              </p>
              <div className="mt-4 text-gray-700 text-lg space-y-2">
                <p>
                  <span className="inline-block mr-4 font-semibold bg-gray-900 text-gray-300 px-3 py-1 rounded-lg shadow">
                    Data: {dayjs(evento?.data).format("DD/MM/YYYY")}
                  </span>
                  <span className="inline-block font-semibold bg-gray-900 text-gray-300 px-3 py-1 rounded-lg shadow">
                    Ora: {evento?.ora}
                  </span>
                </p>
                <p>
                  <span className="bg-gray-900 text-gray-300 px-2 py-1 rounded-md shadow-sm inline-block">
                    Luogo: {evento?.luogo}
                  </span>
                </p>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4">
                <button
                  className="w-full flex sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300"
                  onClick={() => setIsEditing(true)}
                >
                  Modifica <PencilIcon className="ml-1 w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <PrezzoView pacchetti={pacchetti} id={par.eventoId} />

      {/* MAPPA */}
      <div className="mt-12">
        <h3 className="text-2xl font-semibold mb-4">Posizione dell'Evento</h3>
        <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
          <iframe
            title="Event Location"
            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_MAPS_API}&q=${evento?.luogo}`}
            className="w-full h-full border-0"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </main>
  </div>
</div>

  );
}
