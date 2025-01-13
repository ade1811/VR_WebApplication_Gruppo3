'use client'

import { ArrowLeftIcon, PhotographIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function ModifyProfile() {
    const router = useRouter(); // Inizializza useRouter
    const api = process.env.NEXT_PUBLIC_API; // Inizializza la variabile api con l'URL dell'API
    const [email, setEmail] = useState(""); // Inizializza la variabile email con il valore vuoto
    const [nome, setNome] = useState(""); // Inizializza la variabile nome con il valore vuoto
    const [cognome, setCognome] = useState(""); // Inizializza la variabile cognome con il valore vuoto


    const handleSubmit = async (e) => {
      const token = localStorage.getItem("tokenID");
      e.preventDefault();
      try {
          const response = await fetch(api + "/modifyProfile", {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              mode: 'cors',
              body: JSON.stringify({ nome, cognome, email}),
          });

          if (response.ok) {
              const data = await response.json();
              localStorage.setItem("tokenPass", data.tokenPass)
              alert(data.message);
          } else {
              const data = await response.json();
              alert(data.message);
          }
      } catch (error) {
          console.error('Error during password recovery:', error);
          alert('Si è verificato un errore durante il recupero della password. Riprova più tardi.');
      }
    } 
  
  return (
    <div className="min-h-screen bg-bg1 bg-cover bg-center text-white flex flex-col items-center relative">
      {/* Overlay scuro solo sull'immagine di sfondo */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Header */}
      <header className="bg-transparent px-6 py-4 flex items-center fixed w-full top-0 z-50">
        <ArrowLeftIcon
          className="h-6 w-6 text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
          onClick={() => router.back()}
        />
      </header>

      {/* Contenuto */}
      <div className="relative max-w-4xl mx-4 sm:mx-5 bg-gray-800 shadow-md rounded-3xl my-20 p-16 z-10">
        <form method="post" onSubmit={handleSubmit}>
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-100">Profilo di {localStorage.getItem("anagrafica")}</h1>
            <p className="text-sm text-gray-400 mt-2">
              Visualizza e modifica le informazioni relative al tuo profilo
            </p>
          </div>

          {/* Profile Section */}
          <div className="space-y-8">
            <section>
              <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                {/* Profile Picture */}
                <div className="col-span-full">
                  <label
                    htmlFor="photo"
                    className="block text-sm font-medium text-gray-100"
                  >
                    Foto profilo
                  </label>
                  <div className="mt-2 flex items-center gap-x-4">
                    <button
                      type="button"
                      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    > 
                      Upload New Photo
                    </button>
                  </div>
                </div>

                {/* Cover Photo */}
                <div className="col-span-full">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm font-medium text-gray-100"
                  >
                    Immagine di copertina
                  </label>
                  <div className="mt-4 border-2 border-dashed border-gray-500 rounded-lg p-6 text-center">
                    <div className="mt-4 flex justify-center text-sm text-gray-400">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="mt-2 text-xs text-gray-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* info */}
            <section>
              <h2 className="text-lg font-semibold text-gray-100">
                Informazioni personali
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                Modifica le tue informazioni anagrafiche
              </p>

              <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                {/* nome */}
                <div className="sm:col-span-3">
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium text-gray-100"
                  >
                    Nome
                  </label>
                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    autoComplete="given-name"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="mt-2 w-full rounded-md border bg-gray-700 shadow-sm px-3 py-2 text-white focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                {/* cognome */}
                <div className="sm:col-span-3">
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium text-gray-100"
                  >
                    Cognome
                  </label>
                  <input
                    id="cognoname"
                    name="cognome"
                    type="text"
                    autoComplete="family-name"
                    value={cognome}
                    onChange={(e) => setCognome(e.target.value)}
                    className="mt-2 w-full rounded-md border bg-gray-700 shadow-sm px-3 py-2 text-white focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                {/* Email */}
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
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full rounded-md border bg-gray-700 shadow-sm px-3 py-2 text-white focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-10 flex justify-end gap-x-4">
            <button
              type="button"
              className="text-sm font-semibold text-gray-400 hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-600"
            >
              Salva
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
