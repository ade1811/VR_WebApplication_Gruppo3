'use client'

import EventCardPromoter from '../EventCardPromoter';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Usa next/navigation
import { EyeIcon, EyeOffIcon, PencilIcon, TicketIcon, UserGroupIcon } from '@heroicons/react/solid'; // Importa le icone
import { Tooltip } from '@mui/material'; // Importa Tooltip di Material-UI


export default function EventList() {
    const [data, setData] = useState([]);
    const api = process.env.NEXT_PUBLIC_API;
    const logo = "images/bg1.png";
    const router = useRouter(); // Usa useRouter da next/navigation

    useEffect(() => {
        const token = localStorage.getItem("tokenID");

        fetch(api + "/getEvents", {
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
            setData(data.data); // Imposta lo stato con i dati ricevuti
        })
        .catch(error => {
            console.error("Errore durante il fetch:", error);
        });
    }, [api]);

    useEffect(() => {
        localStorage.setItem("dashboard", "Eventi");
      })

    return (
        <div className='mt-20 relative z-5'>
          {/* Legenda delle operazioni */}
          <div className="mb-6 bg-gray-800 p-3 rounded-lg shadow-md sm:flex items-center justify-between text-gray-300 lg:flex hidden">
          <h2>Legenda delle operazioni: </h2>
                <Tooltip title="Rendi l'evento visibile al pubblico" placement="top">
                    <div className="flex items-center space-x-2 cursor-pointer">
                        <EyeIcon className="h-5 w-5 text-blue-500" />
                        <span className="text-sm">Mostra evento</span>
                    </div>
                </Tooltip>
                <Tooltip title="Rendi l'evento non visibile al pubblico" placement="top">
                    <div className="flex items-center space-x-2 cursor-pointer">
                        <EyeOffIcon className="h-5 w-5 text-red-500" />
                        <span className="text-sm">Nascondi evento</span>
                    </div>
                </Tooltip>
                <Tooltip title="Modifica le informazioni dell'evento" placement="top">
                    <div className="flex items-center space-x-2 cursor-pointer">
                        <PencilIcon className="h-5 w-5 text-yellow-500" />
                        <span className="text-sm">Modifica</span>
                    </div>
                </Tooltip>
                <Tooltip title="Visualizza i biglietti acquistati per l'evento" placement="top">
                    <div className="flex items-center space-x-2 cursor-pointer">
                        <TicketIcon className="h-5 w-5 text-green-500" />
                        <span className="text-sm">Biglietti</span>
                    </div>
                </Tooltip>
                <Tooltip title="Visualizza i bouncer assegnati all'evento" placement="top">
                    <div className="flex items-center space-x-2 cursor-pointer">
                        <UserGroupIcon className="h-5 w-5 text-purple-500" />
                        <span className="text-sm">Bouncer</span>
                    </div>
                </Tooltip>
            </div>
            
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full justify-center'>
            {data.length === 0 ? (
              <div className="col-span-full text-center text-xl text-gray-400 bg-gray-800 rounded-lg mt-24 py-5">
                Non ci sono eventi
              </div>
            ) : (
              data.map((event, index) => (
                <EventCardPromoter
                  key={event.eventoID}
                  eventID={event.eventoID}
                  title={event.titolo}
                  date={event.data}
                  copertina={event.copertina || logo}
                  isVisible={event.isVisible}
                />
              ))
            )}
          </div>
        </div>
      );
}
