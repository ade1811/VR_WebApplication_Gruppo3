'use client';

import React, { useState, useEffect } from "react";

export default function VisualTicket({ params }) {
  const [ticketData, setTicketData] = useState([]); // Stato per i dati dei biglietti
  const [isLoading, setIsLoading] = useState(false); // Stato di caricamento
  const api = process.env.NEXT_PUBLIC_API;

  const par = React.use(params);

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
    <div className="bg-bg1 min-h-screen flex items-center justify-center py-10 px-4 relative">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative max-w-4xl w-full bg-gray-700 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 bg-gray-700 text-white">
          <h1 className="text-2xl font-bold">Ticket Venduti</h1>
          <p className="text-indigo-200 text-sm mt-1">
            Elenco delle persone che hanno acquistato i biglietti, con dettagli sul pacchetto.
          </p>
        </div>
        {isLoading ? (
          <div className="p-6 text-center text-white">Caricamento in corso...</div>
        ) : (
          <ul role="list" className="divide-y divide-gray-200">
            {ticketData.length === 0 ? (
              <p className="p-6 text-center text-white">Nessun ticket trovato.</p>
            ) : (
              ticketData.map((ticket) => (
                <li
                  key={ticket.ticketID}
                  className="flex items-center justify-between p-4 hover:bg-gray-600 transition duration-150"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-white">{ticket.nome} {ticket.cognome}</span>
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
