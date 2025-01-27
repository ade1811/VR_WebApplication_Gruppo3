'use client';

import React, { useState, useEffect } from "react";
import { ArrowLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TicketPage({ params }) {
  const [ticketData, setTicketData] = useState([]); // Stato per i dati dei biglietti
  const [isLoading, setIsLoading] = useState(false); // Stato di caricamento
  const api = process.env.NEXT_PUBLIC_API;

  const par = React.use(params);
  const router = useRouter();

  useEffect(() => {
    const fetchTicketData = async () => {
      setIsLoading(true); // Imposta lo stato di caricamento
      try {
        const token = localStorage.getItem("tokenID");
        if (!token) {
          throw new Error("Token non trovato!");
        }

        const response = await fetch(api + "/getTicket/" + par.eventoId, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }

        const result = await response.json();
        setTicketData(result.data || []); // Aggiorna lo stato con i dati ricevuti
      } catch (error) {
        console.error(error);
        alert("Errore durante il caricamento dei dati.");
      } finally {
        setIsLoading(false); // Fine del caricamento
      }
    };

    fetchTicketData(); // Esegui il fetch al caricamento del componente
  }, [api]);

  return (
    <div className="bg-bg1 min-h-screen flex flex-col py-10 px-4 relative">
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Header */}
      <header className="px-4 py-4 flex items-center fixed w-full top-0 z-50">
        <ArrowLeftIcon
          className="h-6 w-6 text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
          onClick={() => router.back()}
        />
        <h1 className="text-xl font-bold ml-4">Gestione biglietti</h1>
      </header>

      {/* Contenuto */}
      <div className="relative z-10 max-w-4xl w-full mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden mt-24"> {/* Aggiunto margin-top per evitare che l'header si sovrapponga */}
        <div className="p-6 bg-gray-800 text-white">
          <h2 className="text-xl font-bold">Ticket Venduti</h2>
          <p className="text-indigo-200 text-sm mt-1">
            Elenco delle persone che hanno acquistato i biglietti, con dettagli sul pacchetto.
          </p>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-[350px]">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            </div>
          </div>
        ) : (
          <ul role="list" className="divide-y divide-gray-700">
            {ticketData.length === 0 ? (
              <p className="p-6 text-center text-white">Nessun ticket trovato.</p>
            ) : (
              ticketData.map((ticket) => (
                <li
                  key={ticket.ticketID}
                  className="flex items-center justify-between p-4 hover:bg-gray-600 transition duration-150"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-white">{ticket.nome} {ticket.cognome}</span>
                    <span className="text-sm text-gray-300">{ticket.titolo}</span>
                    <span className="text-sm text-gray-300">Prezzo: €{ticket.prezzo}</span>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`h-4 w-4 rounded-full ${ticket.isScanned ? 'bg-green-500' : 'bg-red-500'}`}
                      title={ticket.isScanned ? 'Scansionato' : 'Non Scansionato'}
                    ></div>
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
