'use client'

import React, { use, useState, useEffect } from "react";
import {UserIcon, BellIcon } from '@heroicons/react/solid';
import EventCard from "../components/eventCard";
import Link from "next/link";

export default function Home() {
  // State per ricerca eventi
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]);
  const [racommandation, setRacommandation] = useState([])
  const [fEvents, setFilteredEvents] = useState(events);
  const api = process.env.NEXT_PUBLIC_API;


  useEffect(() => {
          fetch(api + "/getAllEvents", {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  
              }
          })
          .then(response => {
              if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
          })
          .then(data => {
            setEvents(data.data); // Imposta lo stato con i dati ricevuti
          })
          .catch(error => {
              console.error("Errore durante il fetch:", error);
          });
      },[api] );

  useEffect(() => {
    const token = localStorage.getItem("tokenID");
        fetch(api + "/recommender", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
          setRacommandation(data.suggeriti); // Imposta lo stato con i dati ricevuti
        })
        .catch(error => {
            console.error("Errore durante il fetch:", error);
        });
    },[api] );

  // Funzione per filtrare gli eventi in base alla ricerca
  const filterEvents = (events) => {
    return events.filter((event) =>
      event.titolo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  useEffect(() => {
    const filtered = filterEvents(events);
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  const genres = [
    "Tecnologia", "Arte", "Sport", "Benessere", "Cucina", 
    "Cultura", "Festa", "Formazione", "Musica", "Teatro"
  ];

  return (
    <div className="min-h-full bg-bg1 bg-cover bg-center bg-fixed relative">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      <header className="bg-gray-800 fixed top-0 w-full flex flex-col sm:flex-row sm:justify-between items-center px-6 py-4 shadow-md z-50 space-y-2 sm:space-y-0">
        <div className="w-full flex items-center justify-between sm:justify-start">
          <Link href="/" className="text-white text-2xl font-bold">FastEvent</Link>
          <div className="flex space-x-4 sm:ml-0">
            <UserIcon className="h-6 w-6 text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer ml-5" />
            <BellIcon className="h-6 w-6 text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer" />
          </div>
        </div>
        <div className="w-full sm:w-auto flex justify-center mt-2 sm:mt-0">
          <input
            type="text"
            placeholder="Cerca eventi..."
            className="w-full sm:w-64 px-3 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) =>{ setSearchTerm(e.target.value)}}
          />
        </div>
      </header>
      
      <main className="relative z-10 container mx-auto px-4 py-8 mt-16">
        {genres.map((genre) => {
          const genreEvents = fEvents.filter(event => event.genere === genre);
          
          return (
            <div key={genre} className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-white">{genre}</h2>
              
              
              {genreEvents.length > 0 ? (
                <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide scroll-smooth">
                  {genreEvents.map((event, key) => (
                    <Link 
                      href={"/event/" + event.eventoID} 
                      key={key}
                      className="flex-none w-80"
                    >
                      <EventCard
                        key={key}
                        image={event.copertina}
                        title={event.titolo}
                        desc={event.descrizione}
                      />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg p-6 text-gray-400">
                  Nessun evento disponibile per la categoria {genre}
                </div>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
}