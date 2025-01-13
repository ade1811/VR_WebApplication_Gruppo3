'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PricingCard({id}) {
  const [tiers, setTiers] = useState([]);
  const api = process.env.NEXT_PUBLIC_API;
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("tokenID");
    
    if (!token) {
      console.error('No token found');
      router.push('/login');
      return;
    }

    const combinedData = {
      tiers
    };

    try {
      const response = await fetch(api + `/addPacchetto/${localStorage.getItem("idP")}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        mode: 'cors',
        body: JSON.stringify(combinedData)
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
  

  // Aggiungere un nuovo pacchetto
  const addTier = () => {
    const newTier = {
      id: `tier-${Date.now()}`, // ID univoco
      title: '', // Campo vuoto per il titolo
      description: '', // Campo vuoto per la descrizione
      price: 0, // Campo vuoto per il prezzo
    };
    setTiers([...tiers, newTier]);
  };

  // Rimuovere un pacchetto
  const removeTier = (id) => {
    setTiers(tiers.filter((tier) => tier.id !== id));
  };

  // Aggiornare i dati di un pacchetto
  const updateTier = (id, field, value) => {
    setTiers((prevTiers) =>
      prevTiers.map((tier) =>
        tier.id === id ? { ...tier, [field]: value } : tier
      )
    );
  };

  return (
    <div className="rounded-3xl relative isolate bg-gray-800 px-8 mx-4 sm:mx-20 mt-24 sm:py-32 lg:px-8">
      <div aria-hidden="true" className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl">
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
        />
      </div>
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl">
          Inserisci i pacchetti per il tuo evento
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-gray-300 sm:text-xl">
        Puoi scegliere un numero limitato di pacchetti fino a 5 poi c'è il plus e devi cacciare i soldi
      </p>
      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-8 lg:max-w-4xl lg:grid-cols-2">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className="relative bg-gray-900 shadow-2xl mx-5 mb-6 rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10"
          >
            <h1 className="text-gray-300 text-4xl">Pacchetto evento</h1>

            {/* Form per il pacchetto */}
            <form className="space-y-6 bg-gray-900 p-5 rounded-2xl">
              <div>
                <label
                  htmlFor={`title-${tier.id}`}
                  className="block text-sm font-medium text-gray-300"
                >
                  Titolo
                </label>
                <input
                  type="text"
                  id={`title-${tier.id}`}
                  value={tier.title}
                  onChange={(e) => updateTier(tier.id, 'title', e.target.value)}
                  className="text-white bg-gray-700 mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Inserisci il titolo"
                />
              </div>
              <div>
                <label
                  htmlFor={`description-${tier.id}`}
                  className="block text-sm font-medium text-gray-300"
                >
                  Descrizione
                </label>
                <textarea
                  id={`description-${tier.id}`}
                  value={tier.description}
                  onChange={(e) =>
                    updateTier(tier.id, 'description', e.target.value)
                  }
                  rows="4"
                  className="text-white bg-gray-700 mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Inserisci una descrizione"
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor={`price-${tier.id}`}
                  className="block text-sm font-medium text-gray-300"
                >
                  Prezzo
                </label>
                <input
                  type="number"
                  id={`price-${tier.id}`}
                  value={tier.price}
                  onChange={(e) => updateTier(tier.id, 'price', e.target.value)}
                  className="text-white bg-gray-700 mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Inserisci il prezzo"
                />
              </div>
            </form>

            <button
              type="button"
              onClick={() => removeTier(tier.id)}
              className="mt-4 text-sm text-white bg-red-600 p-2 rounded-lg hover:bg-red-400 transition-all"
            >
              Rimuovi pacchetto
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={addTier}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all"
        >
          Aggiungi pacchetto
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-3 mx-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all"
        >
          Salva pricing evento
        </button>
      </div>

      
    </div>
  );
}