import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import PricingCard from './PricingCard';
import { PhotographIcon } from '@heroicons/react/solid';

export default function CreateEventPage() {
  const [currentPage, setCurrentPage] = useState("CreateEvent");
  const [image, setImage] = useState(null);
  const [displayLocation, setDisplayLocation] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    image: null,
    n_posti: 0,
    genere: '',
    isEcologic: 0,
  });
  const api = process.env.NEXT_PUBLIC_API;

  // Initialize Google Places Autocomplete
  useEffect(() => {
    const initializeAutocomplete = () => {
      const input = document.getElementById('location-input');
      if (input && window.google) {
        const autocomplete = new window.google.maps.places.Autocomplete(input);
        
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.geometry) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            
            // Aggiorna il display con l'indirizzo formattato
            setDisplayLocation(place.formatted_address);
            
            // Aggiorna formData con le coordinate nel formato richiesto
            setFormData(prev => ({
              ...prev,
              location: `${lat},${lng}`
            }));
          }
        });
      }
    };
    
    const loadGoogleMapsScript = () => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAPS_API}&libraries=places`;
        script.async = true;
        script.onload = initializeAutocomplete;
        document.head.appendChild(script);
      } else {
        initializeAutocomplete();
      }
    };

    loadGoogleMapsScript();
  }, []);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const preview = URL.createObjectURL(file);
      setImage(Object.assign(file, { preview }));
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'location') {
      setDisplayLocation(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (key !== 'image') {
        form.append(key, formData[key]);
      }
    });
  
    if (formData.image) {
      form.append('file', formData.image);
    }

    console.log('Form data:', form);
  
    try {
      const response = await fetch(api + '/addEvento', {
        method: 'POST',
        body: form,
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('tokenID')}`
        }
      });
  
      const data = await response.json();
      console.log('Response:', data);
      localStorage.setItem('idP', data.id);
      
      if (response.ok && data.id) {
        setCurrentPage("DynamicPricing");
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "CreateEvent":
        return (
          <div className="rounded-3xl relative isolate bg-gray-800 px-3 sm:px-8 mx-4 sm:mx-5 mt-24 sm:mt-32 sm:py-32 lg:px-8">
            <div aria-hidden="true" className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-4 sm:px-36 blur-3xl">
              <div
                style={{
                  clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
                className="mx-auto aspect-[1155/678] w-[90%] sm:w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
              />
            </div>
            <main className="relative z-10 pt-0 flex flex-col items-center px-4">
              <div className="mx-auto max-w-4xl text-center">
                <p className="text-balance mt-10 sm:mt-0 text-3xl sm:text-5xl font-semibold tracking-tight text-white">
                  Inserisci i dati del tuo evento
                </p>
              </div>
              
              <form
                className="w-full max-w-4xl bg-gray-800 shadow-2xl rounded-3xl p-4 sm:p-8 mt-8 space-y-6 mb-5 sm:mb-2"
                onSubmit={handleSubmit}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 font-semibold text-xl mb-2">Immagine dell'Evento</label>
                    <div
                      {...getRootProps()}
                      className={`w-full h-40 sm:h-52 bg-gray-700 border border-dashed rounded-md p-4 text-center cursor-pointer ${
                        isDragActive ? 'border-blue-500' : 'border-gray-600'
                      } flex items-center justify-center`}
                    >
                      <input {...getInputProps()} required/>
                      {image ? (
                        <img
                          src={image.preview}
                          alt="Anteprima"
                          className="mx-auto max-h-full object-cover rounded-md h-full"
                        />
                      ) : (
                        <p className="text-gray-300 text-sm sm:text-base flex items-center justify-center">
                          <PhotographIcon className="w-4 h-4 mr-2" />
                          {isDragActive
                            ? 'Rilascia qui l\'immagine...'
                            : 'Trascina un\'immagine o clicca per selezionarla'}
                        </p>
                      )}
                    </div>
                    {image && (
                      <button
                        type="button"
                        onClick={() => {
                          setImage(null);
                          setFormData((prev) => ({ ...prev, image: null }));
                        }}
                        className="text-red-500 hover:text-red-700 text-sm mt-2"
                      >
                        Rimuovi immagine
                      </button>
                    )}
                  </div>

                  <div>
                    <div>
                      <label className="block text-gray-300 font-semibold mb-2 text-xl">Titolo dell'Evento</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Inserisci il titolo"
                        required
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-300"
                      />
                    </div>
                    <div className="mt-4">
                      <label className="block text-gray-300 font-semibold mb-2 text-xl">Descrizione</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        placeholder="Descrizione dell'evento"
                        rows="4"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-300"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2 text-xl">Posizione</label>
                    <input
                      id="location-input"
                      type="text"
                      name="location"
                      value={displayLocation}
                      required
                      onChange={handleInputChange}
                      placeholder="Inizia a digitare per cercare un indirizzo..."
                      className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-300"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 font-semibold mb-2 text-xl">Data</label>
                      <input
                        type="date"
                        name="date"
                        required
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 font-semibold mb-2 text-xl">Ora</label>
                      <input
                        type="time"
                        name="time"
                        required
                        value={formData.time}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-300"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 font-semibold mb-2 text-xl">Genere</label>
                    <select
                      name="genere"
                      value={formData.genere}
                      required
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-300"
                    >
                      <option value="" disabled>
                        Seleziona il genere dell'evento
                      </option>
                      <option value="Tecnologia">Tecnologia</option>
                      <option value="Arte">Arte</option>
                      <option value="Sport">Sport</option>
                      <option value="Benessere">Benessere</option>
                      <option value="Cucina">Cucina</option>
                      <option value="Cultura">Cultura</option>
                      <option value="Festa">Festa</option>
                      <option value="Formazione">Formazione</option>
                      <option value="Musica">Musica</option>
                      <option value="Teatro">Teatro</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 font-semibold mb-2 text-xl">Posti disponibili</label>
                      <input
                        type="number"
                        name="n_posti"
                        placeholder="Inserisci il numero di posti disponibili"
                        required
                        value={formData.n_posti}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-300"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-300 font-semibold mb-2 text-xl">Ecologico?</label>
                      <input
                        type="checkbox"
                        name="isEcologic"
                        value={formData.isEcologic}
                        onChange={handleInputChange}
                        className="w-4 h-4 bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-300"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="submit"
                    className="text-sans rounded-lg bg-green-600 px-6 py-3 text-lg 
                              font-bold text-white shadow-lg hover:bg-green-500 
                              transition-transform transform hover:scale-105">
                    Aggiungi prezzario evento
                  </button>
                </div>
              </form>
            </main>
          </div>
        );
      case "DynamicPricing":
        return <PricingCard id={data.id} />;
      default:
        return null;
    }
  };

  return renderPage();
}