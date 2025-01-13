'use client'

import React, { useEffect, useState } from 'react'; // Aggiungi gli import mancanti
import { ArrowLeftIcon, PencilIcon } from "@heroicons/react/solid";
import { useRouter } from "next/navigation";
import Link from 'next/link';

export default function Profile() {
    const router = useRouter(); // Inizializza useRouter
    const [data, setData] = useState([]); // Stato inizializzato con array vuoto
    const [numEventi, setNumEventi] = useState(0); // Stato per il numero di eventi
    const img  = localStorage.getItem("immagine");

    const api = process.env.NEXT_PUBLIC_API;

    useEffect(() => {
        const token = localStorage.getItem("tokenID"); // Sostituisci con il tuo token
      
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
              console.log(data);
              setNumEventi(data.numEventi || 0); // Imposta il numero di eventi
            }
          })
          .catch((error) => {
            console.error("Errore nel caricamento dei dati:", error);
          });
    }, []); // Array di dipendenze corretto

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
                        style={{ backgroundImage: "url('images/img_slide3.jpg')" }} // Sostituisci con il percorso della tua immagine
                    ></div>
                </div>

                {/* Immagine del profilo */}
                <div className="relative -mt-20 bg-gray-300 rounded-full">
                    <img
                        src={api + "/image/" + img} // Sostituisci con l'URL della tua immagine di profilo
                        alt="Profile"
                        className="w-36 h-36 rounded-full border-4 border-gray-800 object-cover shadow-md"
                    />
                    <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-full">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>

                {/* Nome e posizione */}
                <div className="text-center mt-5">
                    <h1 className="text-2xl font-bold flex flex-row">{localStorage.getItem("anagrafica")} 
                        <Link href="/ModifyProfile"><PencilIcon className='w-5 h-5 ml-2 mt-1'/></Link>
                    </h1>
                    <p className="text-blue-400">UI/UX Designer</p>
                </div>

                {/* Statistiche */}
                <div className="flex space-x-8 mt-5 text-center">
                    <div className="text-center">
                        <span className="text-xl font-semibold">{numEventi}</span>
                        <p className="text-gray-400">Eventi</p>
                    </div>
                    <div className="text-center">
                        <span className="text-xl font-semibold">129K</span>
                        <p className="text-gray-400">Followers</p>
                    </div>
                    <div className="text-center">
                        <span className="text-xl font-semibold">2K</span>
                        <p className="text-gray-400">Following</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
