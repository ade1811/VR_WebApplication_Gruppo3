'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register({userType}){
  //'cliente' or 'promoter'
  const router = useRouter()

  const api = process.env.NEXT_PUBLIC_API

  const [nome, setNome] = useState("")
  const [cognome, setCognome] = useState("")
  const [ddn, setDdn] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  //funzione richiamata al click del bottone nel FrontEnd che manda email e amount a BackEnd tramite API
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(api + "/signin", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({nome, cognome, ddn, email, password, userType})
    });
    const data = await response.json();
    localStorage.setItem('tokenID', data.token);

    if(userType != "bouncer"){
      const anagrafica = data.anagrafica.nome + " " + data.anagrafica.cognome;
      localStorage.setItem("anagrafica", anagrafica);
      localStorage.setItem("immagine", data.immagine);}
      localStorage.setItem("email", data.email);

    console.log(data.role)
    if (response.ok) {
      if(data.role === "promoter"){
        router.push('/promoter/dashboard')}
      else{
        router.push("/home_client")
      }
    } else {
        alert(data.message);
    } 
  }
  return (
    <div className="h-screen bg-bg1 bg-cover bg-center overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className=" flex items-center justify-center min-h-screen">
    
      <div className="lg:w-full lg:max-w-md sm:min-w-[200px] sm:max-w-[350px] sm:m-3
      p-8 z-10 space-y-8 bg-gray-800 shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold text-center text-gray-200">
          Registrazione {userType === 'user' ? 'Cliente' : 'Promoter'}
        </h2>
        {/* FORM REGISTRAZIONE*/}
        <form className="space-y-6" method='post' onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="text-sm font-medium text-gray-400">Nome</label>
              <input
                type="text"
                id="firstName"
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all text-gray-900"
                placeholder="Inserisci il tuo nome"
                value={nome}
                required
                onChange={(n) => setNome(n.target.value)}
              />
            </div>

            <div>
              <label htmlFor="lastName" className="text-sm font-medium text-gray-400">Cognome</label>
              <input
                type="text"
                id="lastName"
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 transition-all focus:ring-indigo-600 text-gray-900"
                placeholder="Inserisci il tuo cognome"
                value={cognome}
                required
                onChange={(c) => setCognome(c.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="birthdate" className="text-sm font-medium text-gray-400">Data di nascita</label>
            <input
              type="date"
              id="birthdate"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 transition-all focus:ring-indigo-600 text-gray-900"
              value={ddn}
                required
                onChange={(d) => setDdn(d.target.value)}
            />
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-400">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 transition-all focus:ring-indigo-600 text-gray-900"
              placeholder="Inserisci la tua email"
              value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-400">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 transition-all focus:ring-indigo-600 text-gray-900"
              placeholder="Crea una password"
              value={password}
                required
                onChange={(p) => setPassword(p.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full font-sans py-2 mt-6 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-800 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
          >
            Registrati
          </button>
        </form>

        <div className="flex items-center justify-center mt-4 text-sm">
          <span className="text-gray-600">Hai già un account?</span>
          <Link href={userType === "user"? "/login": "/promoter/login"} className="ml-1 font-medium text-blue-500 hover:underline">Accedi</Link>
        </div>
      </div>
    </div>
    </div>
  );
}
