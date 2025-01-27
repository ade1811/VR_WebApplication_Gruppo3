'use client';

import { ArrowLeftIcon } from "@heroicons/react/solid";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from 'react';
import PacchettoVisualizzare from "@/app/components/PacchettoVisualizzare";
import dayjs from "dayjs";

export default function EventDetail({ params }) {
  const defaultEvento = {
    titolo: "Titolo non disponibile",
    genere: "Genere non disponibile",
    descrizione: "Descrizione non disponibile",
    data: "Data non disponibile",
    ora: "Ora non disponibile",
    luogo: "Luogo non disponibile",
    copertina: "image.png",
  };

  const router = useRouter();
  const API_KEY = process.env.NEXT_PUBLIC_MAPS_API;
  const [evento, setEvento] = useState([]);
  const [pacchetti, setPacchetti] = useState([]);
  const api = process.env.NEXT_PUBLIC_API;

  const par = React.use(params);
  const token = localStorage.getItem("tokenID");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(api + "/getEvent/" + par.eventoId, {});
        const jsonData = await response.json();
        if (response.status === 404) {
          setEvento(defaultEvento);
          setPacchetti([]);
        } else {
          setEvento(jsonData.data.evento);
          setPacchetti(jsonData.data.pacchetti);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };
    fetchData();
  }, [api, par.eventoId]);

  return (
    <div className="bg-bg1 min-h-screen text-white relative">
      {/* Div di oscuramento sotto il contenuto, z-index a 0 per essere sotto tutto */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

      {/* Header */}
      <header className="bg-gray-800 px-6 py-4 flex items-center shadow-md fixed w-full top-0 z-50">
        <ArrowLeftIcon
          className="h-6 w-6 text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
          onClick={() => router.back()}
        />
        <h1 className="text-xl font-bold ml-4">Dettaglio Evento</h1>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-6 px-6 lg:px-16 z-10 relative">
        {/* Sezione immagine e dettagli */}
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Immagine */}
          <div className="w-full lg:w-1/2 h-64 lg:h-auto rounded-lg overflow-hidden shadow-lg">
            <img
              src={evento ? api + "/image/" + evento?.copertina : null}
              alt={evento?.titolo}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Dettagli */}
          <div className="w-full lg:w-1/2 mt-6 lg:mt-0 bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-4xl lg:text-6xl font-extrabold text-gray-100 leading-tight">
              {evento?.titolo}
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
          </div>
        </div>
        
        <PacchettoVisualizzare pacchetti={pacchetti} id={par.eventoId} />

        {/* MAPPA */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-4">Posizione dell'Evento</h3>
          <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
            <iframe
              title="Event Location"
              src={`https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${evento?.luogo}`}
              className="w-full h-full border-0"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </main>
    </div>
  );
}
