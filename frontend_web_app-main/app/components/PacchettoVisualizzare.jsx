import React, { useState, useEffect } from 'react';
import { PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/solid';
import {loadStripe} from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function PacchettoVisualizzare({ pacchetti }) {
  const [localPacchetti, setLocalPacchetti] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    // Verifica se i pacchetti contengono gli ID
    if (pacchetti && pacchetti.length > 0) {
      setLocalPacchetti(pacchetti);

      // Inizializza il conteggio per ogni pacchetto a 0
      const initialQuantities = {};
      pacchetti.forEach((pkg) => {
        if (pkg.pacchettoID !== undefined) {
          initialQuantities[pkg.id] = 0;
        } else {
          console.error("Pacchetto senza ID:", pkg);
        }
      });
      setQuantities(initialQuantities);
      console.log(localPacchetti);
    }
  }, [pacchetti]);

  const handleIncrement = (id) => {
    if (id !== undefined) {
      setQuantities((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + 1,
      }));
    } else {
      console.error("ID undefined per l'incremento");
    }
  };

  const handleDecrement = (id) => {
    if (id !== undefined) {
      setQuantities((prev) => ({
        ...prev,
        [id]: Math.max(0, (prev[id] || 0) - 1), // Evita valori negativi
      }));
    } else {
      console.error("ID undefined per il decremento");
    }
  };

  const getSelectedPackages = () => {
    const selectedPackages = localPacchetti
      .filter(pkg => quantities[pkg.pacchettoID] > 0)
      .map(pkg => ({
        titolo: pkg.titolo,
        pacchettoID: pkg.pacchettoID,
        prezzo: pkg.prezzo,
        quantita: quantities[pkg.pacchettoID]
      }));
    return selectedPackages;
  };

  const api = process.env.NEXT_PUBLIC_API;
  const token = localStorage.getItem('tokenID');
  const handlePurchase = async () => {
    const payload = getSelectedPackages();
    const stripe = await stripePromise;
    // Ready for API call
    if (pacchetti.length > 0){
      fetch(api + "/createTicket", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then( async (data) => {
          const { error } = await stripe.redirectToCheckout({
            sessionId: data.id,
          });
      
          alert(data.message);
          // Esegui azioni post-acquisto
        })
        .catch((error) => {
          console.error('Errore API:', error);
          // Gestisci errori
        });
    }
    else{
      alert("Nessun pacchetto selezionato");
    }


  };

  return (
    <div className="flex flex-col items-center bg-gray-900 p-4">
      <h1 className="text-3xl sm:text-7xl font-extrabold my-10">
        Pacchetti di pricing dell'evento
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Pacchetti esistenti */}
        {localPacchetti.map((pkg, key) => (
          <div
            key={key} // Utilizza direttamente pkg.id
            className="bg-gray-800 text-white rounded-lg shadow-lg p-6 grid grid-cols-3 gap-4 relative"
          >
            {/* Colonna 1: Titolo e descrizione */}
            <div className="flex flex-col justify-start">
              <h2 className="text-2xl font-bold mb-2">{pkg?.titolo}</h2>
              <p className="text-gray-400">{pkg?.descrizione}</p>
            </div>

            {/* Colonna 2: Prezzo */}
            <div className="flex flex-col justify-start items-end">
              <p className="text-4xl font-bold mb-4">${pkg?.prezzo}</p>
            </div>

            {/* Colonna 3: Tasti +, - e conteggio */}
            <div className="flex flex-col justify-center items-center space-y-4">
              <button
                onClick={() => handleIncrement(pkg.pacchettoID)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full"
              >
                <PlusCircleIcon className="w-4 h-4" />
              </button>
              <p className="text-xl font-bold">{quantities[pkg.pacchettoID] || 0}</p>
              <button
                onClick={() => handleDecrement(pkg.pacchettoID)}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-full"
              >
                <MinusCircleIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Bottone acquisto unico */}
      <button
        onClick={handlePurchase}
        className="mt-10 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg"
      >
        Acquista Biglietti
      </button>
    </div>
  );
}
