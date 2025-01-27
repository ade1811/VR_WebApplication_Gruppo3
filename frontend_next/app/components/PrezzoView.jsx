import React, { useState, useEffect } from 'react';

export default function PrezzoView({ pacchetti, id }) {
  const [localPacchetti, setLocalPacchetti] = useState([]);
  const [tiers, setTiers] = useState([]);
  const api = process.env.NEXT_PUBLIC_API;

  useEffect(() => {
    setLocalPacchetti(pacchetti);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("tokenID");
    
    if (!token) {
      router.push('/login');
      return;
    }

    // Clean and format tiers data
    const formattedTiers = tiers.map(tier => ({
      title: tier.titolo || tier.title,
      description: tier.descrizione || tier.description,
      price: tier.prezzo || tier.price
    }));

    try {
      const response = await fetch(api + `/addPacchetto/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tiers: formattedTiers
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      alert('Pacchetti creati con successo!');
      
    } catch (error) {
      console.error('Error:', error);
      alert(`Errore durante l'invio: ${error.message}`);
    }
  };
  // Aggiungi un nuovo pacchetto
  const addPackage = () => {
    const newTier = {
      id: `tier-${Date.now()}`, // ID univoco
      title: '', // Campo vuoto per il titolo
      description: '', // Campo vuoto per la descrizione
      price: 0, // Campo vuoto per il prezzo
    };
    setTiers([...tiers, newTier]);
  };

  // Rimuovi un pacchetto aggiunto
  const removePackage = (id) => {
    setTiers(tiers.filter((pkg) => pkg.id !== id));
  };

  // Aggiorna i dettagli di un pacchetto aggiunto
  const updatePackage = (id, field, value) => {
    setTiers((prevTiers) =>
      prevTiers.map((tier) =>
        tier.id === id ? { ...tier, [field]: value } : tier
      )
    );
  };

  const addPren = (e) => {
    e.preventDefault();
    const newTier = {
      id: `tier-${Date.now()}`,
      disabled: true,
      title: 'Ingresso Gratuito',
      description: 'Prenotazione con pagamento in loco',
      price: 0
    };
    setTiers([...tiers, newTier]);
    tiers.forEach(tier => {
      if (tier.title === 'Ingresso Gratuito') {
        tier.price = 0;
      }
    });
  }

  return (
    <div className="mt-20 rounded-xl flex flex-col items-center bg-gray-900 p-4 pb-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold mt-10 mb-5">
        Pacchetti di pricing dell'evento
      </h1>
      <p className="text-gray-500 font-light my-5">In questa parte puoi inserire ulteriori pacchetti di pricing, che la potenziale clientela potrà acquistare tramite i biglietti</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Pacchetti esistenti */}
        {localPacchetti.map((pkg, key) => (
          <div
            key={key}
            className="bg-gray-800 text-white rounded-lg shadow-lg p-6 grid grid-cols-2"
          >
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">{pkg?.titolo}</h2>
                <p className="text-gray-400 mb-6">{pkg?.descrizione}</p>
              </div>
            </div>
            <div className="flex flex-col justify-between items-end">
              <p className="text-4xl font-bold">${pkg?.prezzo}</p>
            </div>
          </div>
        ))}

        {/* Pacchetti aggiunti dinamicamente */}
        {tiers.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-gray-800 text-white rounded-lg shadow-lg p-6 grid grid-cols-2"
          >
            <div className="flex flex-col justify-between">
              <div>
                <label className="block text-gray-400 mb-2">
                  Titolo:
                  <input
                    type="text"
                    value={pkg.titolo}
                    placeholder={pkg.title}
                    onChange={(e) =>
                      updatePackage(pkg.id, 'title', e.target.value)
                    }
                    className="w-full bg-gray-700 text-white p-2 rounded-md"
                  />
                </label>
                <label className="block text-gray-400 mb-2">
                  Descrizione:
                  <textarea
                    value={pkg.descrizione}
                    placeholder={pkg.description}
                    onChange={(e) => updatePackage(pkg.id, 'description', e.target.value)}
                    className="w-full bg-gray-700 text-white p-2 rounded-md"
                  />
                </label>
              </div>
            </div>
            <div className="flex flex-col justify-between items-end">
              <label className="block text-gray-400 mb-2">
                Prezzo (€):
                <input
                  type="number"
                  min ={0}
                  disabled={pkg.disabled}
                  placeholder={pkg.price}
                  value={pkg.prezzo}
                  onChange={(e) =>updatePackage(pkg.id, 'price', Number(e.target.value))}
                  className= {`w-full bg-gray-700 text-white p-2 rounded-md ${pkg.disabled ? 'cursor-not-allowed' : ''}`}
                />
              </label>
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg mt-4"
                onClick={() => removePackage(pkg.id)}
              >
                Rimuovi
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-4">
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
          onClick={addPackage}
        >
          Nuovo pacchetto
        </button>
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg"
          onClick={addPren}
        >
          Nuova prenotazione
        </button>
        {tiers.length > 0 && (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
            onClick={handleSubmit}
          >
            Salva pricing evento
          </button>
          
        )}
      </div>
    </div>
  );
}
