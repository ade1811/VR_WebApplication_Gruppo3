'use client';

import { ArrowLeftIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ModifyProfile() {
  const router = useRouter();
  const api = process.env.NEXT_PUBLIC_API;
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    image: null, // Per gestire il file
  });
  const [imagePreview, setImagePreview] = useState(null); // Per l'anteprima dell'immagine

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
  
    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file)); // Mostra l'anteprima dell'immagine
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null); // Rimuovi l'anteprima
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("tokenID");
    const form = new FormData();
  
    // Aggiungi tutti i dati di testo (nome, cognome, email) a FormData
    Object.keys(formData).forEach((key) => {
      if (key !== "image") {
        form.append(key, formData[key]);
      }
    });
  
    // Aggiungi l'immagine (se presente) a FormData
    if (formData.image) {
      form.append("file", formData.image);
    }
  
    try {
      const response = await fetch(`${api}/modifyProfile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        mode: "cors",
        body: form, // Usa FormData per inviare i dati
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("tokenPass", data.tokenPass);
        alert(data.message);
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error("Error during password recovery:", error);
      alert("Si è verificato un errore durante il recupero della password. Riprova più tardi.");
    }
  };

  const handleDeleteProfile = async () => {
    if (window.confirm("Sei sicuro di voler eliminare il tuo profilo? Questa azione non può essere annullata e " + 
      "tutti i tuoi dati non saranno più disponibili.")) {
      try {
        const response = await fetch(`${api}/delete`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('tokenID')}`,
          },
        });
  
        if (response.ok) {
          const data = response.json();
          localStorage.removeItem('tokenID');
          alert("Ciao, ci mancherai!!!!");
          router.push('/');
        } else {
          alert('Errore durante l\'eliminazione del profilo');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Errore durante l\'eliminazione del profilo');
      }
    }
  };

  return (
    <div className="min-h-screen bg-bg1 bg-cover bg-center text-white flex flex-col items-center relative">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <header className="bg-transparent px-6 py-4 flex items-center fixed w-full top-0 z-50">
        <ArrowLeftIcon
          className="h-6 w-6 text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
          onClick={() => router.back()}
        />
      </header>
      <div className="relative max-w-4xl mx-4 sm:mx-5 bg-gray-800 shadow-md rounded-3xl my-20 p-16 z-10">
        <form onSubmit={handleSubmit}>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-100">
              Profilo di {localStorage.getItem("anagrafica")}
            </h1>
            <p className="text-sm text-gray-400 mt-2">
              Visualizza e modifica le informazioni relative al tuo profilo
            </p>
          </div>
          <div className="space-y-8">
            <section>
              <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                <div className="col-span-full">
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-100"
                  >
                    Modifica foto profilo
                  </label>
                  <div className="mt-4 border-2 border-dashed border-gray-500 rounded-lg p-6 text-center">
                    <div className="mt-4 flex justify-center text-sm text-gray-400">
                      <label
                        htmlFor="image"
                        className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        <span>Carica un file</span>
                        <input
                          id="image"
                          name="image"
                          type="file"
                          className="sr-only"
                          onChange={handleInputChange}
                        />
                      </label>
                      <p className="pl-1">oppure trascina e carica</p>
                    </div>
                    {imagePreview && (
                      <div className="mt-4">
                        <img
                          src={imagePreview}
                          alt="Anteprima immagine"
                          className="w-32 h-32 object-cover rounded-full mx-auto"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="mt-2 text-sm text-red-500 hover:text-red-700"
                        >
                          Rimuovi immagine
                        </button>
                      </div>
                    )}
                    <p className="mt-2 text-xs text-gray-400">
                      PNG, JPG, GIF fino a 10MB
                    </p>
                  </div>
                </div>
              </div>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-gray-100">
                Informazioni personali
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                Modifica le tue informazioni anagrafiche
              </p>
              <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="nome"
                    className="block text-sm font-medium text-gray-100"
                  >
                    Nome
                  </label>
                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    value={formData.nome}
                    placeholder={localStorage
                      .getItem("anagrafica")
                      .split(" ")[0]}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-md border bg-gray-700 shadow-sm px-3 py-2 text-white focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="cognome"
                    className="block text-sm font-medium text-gray-100"
                  >
                    Cognome
                  </label>
                  <input
                    id="cognome"
                    name="cognome"
                    type="text"
                    value={formData.cognome}
                    placeholder={localStorage
                      .getItem("anagrafica")
                      .split(" ")[1]}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-md border bg-gray-700 shadow-sm px-3 py-2 text-white focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
                <div className="sm:col-span-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-100"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    placeholder={localStorage.getItem("email")}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-md border bg-gray-700 shadow-sm px-3 py-2 text-white focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>
            </section>
          </div>
          <div className="mt-6 flex justify-between items-center">
          <button
              type="button"
              onClick={handleDeleteProfile}
              className="bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Elimina profilo
            </button>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Salva modifiche
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
