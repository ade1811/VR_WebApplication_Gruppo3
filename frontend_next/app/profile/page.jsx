'use client'

import React, { useEffect, useState } from 'react'; // Aggiungi gli import mancanti
import { ArrowLeftIcon, PencilIcon, UserIcon } from "@heroicons/react/solid";
import { useRouter } from "next/navigation";
import Link from 'next/link';

export default function Profile() {
    const router = useRouter(); // Inizializza useRouter
    const [data, setData] = useState([]); // Stato inizializzato con array vuoto
    const [numEventi, setNumEventi] = useState(0); // Stato per il numero di eventi
    const img  = localStorage.getItem("immagine"); //endpoint per api immagine
    const [userType, setUserType] = useState(""); // Stato per il tipo di utente
    const [userTickets, setUserTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const api = process.env.NEXT_PUBLIC_API;
    const token = localStorage.getItem("tokenID")

    useEffect(() => {
        ; // Sostituisci con il tuo token
      
        // Fetch dei dati dall'API con il token di autenticazione
        fetch(api + '/profile', {
          method: 'GET', // Metodo di richiesta
          headers: {
            'Content-Type': 'application/json', // Tipo di contenuto della richiesta
            'Authorization': `Bearer ${token}` // Aggiungi il token nell'intestazione
          }
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Errore nel caricamento dei dati.");
            }
            return response.json(); // Converti la risposta in formato JSON
          })
          .then((data) => {
            if (data) {
              setData(data.data); // Imposta i dati nel primo stato
              const anagrafica = data.anagrafica.nome + " " + data.anagrafica.cognome;
              localStorage.removeItem("anagrafica");
              localStorage.setItem("anagrafica", anagrafica);
              localStorage.removeItem("immagine");
              localStorage.setItem("immagine", data.immagine);
              console.log(data);
              setNumEventi(data.numEventi || 0); // Imposta il numero di eventi
              setUserType(data.userType); // Imposta il tipo di utente
            }
          })
          .catch((error) => {
            console.error("Errore nel caricamento dei dati:", error);
          });
    }, [api]); // Array di dipendenze corretto

    useEffect(() => {
      const fetchUserTickets = async () => {
        if (!userType || userType !== 'user') return;
        
        try {
          const response = await fetch(`${api}/getMyTickets`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!response.ok) {
            throw new Error('Errore nel caricamento dei biglietti.');
          }
          const ticketsData = await response.json();
          setUserTickets(ticketsData.data);
        } catch (error) {
          console.error('Errore nel caricamento dei biglietti:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserTickets();
    }, [api, userType]);

    return (
        <div className="min-h-screen bg-bg1 bg-cover text-white flex flex-col items-center relative">
            {/* Gradiente e sfondo opaco su tutta la pagina */}
            <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
            <header className="bg-transparent px-6 py-4 flex items-center fixed w-full top-0 z-50">
                <ArrowLeftIcon
                    className="h-6 w-6 text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                    onClick={() => router.back()}
                />
            </header>
            {/* Spazio aggiuntivo sotto la header fissa */}
            <div className="pt-0 w-full flex flex-col items-center z-10">
                
                {/* Sezione di sfondo con gradiente e immagine */}
                <div className="w-full h-80 bg-gray-900 relative flex items-center justify-center">
                    

                    {/* Immagine di sfondo */}
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-50"
                        //style={{ backgroundImage: "url('images/img_slide3.jpg')" }}  Sostituisci con il percorso della tua immagine
                    ></div>
                </div>

                {/* Immagine del profilo */}
                <div className="relative -mt-20 bg-gray-300 rounded-full">
                    <img
                        src={api + "/image/" + img} // Sostituisci con l'URL della tua immagine di profilo
                        alt="Profile"
                        className="w-36 h-36 rounded-full border-4 border-gray-800 object-cover shadow-md"
                    />
                    <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full">
                        <UserIcon className="h-5 w-5" />
                    </div>
                </div>

                {/* Nome */}
                <div className="text-center mt-5">
                    <h1 className="text-2xl font-bold flex flex-row">{localStorage.getItem("anagrafica")} 
                        <Link href="/ModifyProfile"><PencilIcon className='w-5 h-5 ml-2 mt-1'/></Link>
                    </h1>
                </div>

                {/* Statistiche */}
                <div className="flex space-x-8 mt-5 text-center">
                    <div className="text-center">
                        <span className="text-xl font-semibold">{numEventi}</span>
                        <p className="text-gray-400">{userType === "promoter"? "Eventi": "Biglietti Acquistati"}</p>
                    </div>   
                </div>

            
                <div className="w-full max-w-4xl mt-8 px-4">
                {isLoading && userType === "user"? (
                  <p>Caricamento biglietti...</p>
                ) : userTickets.length > 0 && userType === "user" ? (
                  <><h2 className="text-xl font-bold mb-4">I Tuoi Biglietti</h2>
                  <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-700 pr-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userTickets.map((ticket, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-4">
                        <h3 className="font-semibold">{ticket.evento}</h3>
                        <p className="text-gray-400">Data: {new Date(ticket.data).toLocaleDateString()}</p>
                        <p className="text-gray-400">Tipo: {ticket.tipo}</p>
                        <p className="text-gray-400">Prezzo: €{ticket.prezzo}</p>
                      </div>
                    ))}
                  </div>
                </div></>
                ) : userType === "user"?  (
                  <p>Nessun biglietto trovato.</p>
                ):null}
              </div>
            </div>
        </div>
    );
}
