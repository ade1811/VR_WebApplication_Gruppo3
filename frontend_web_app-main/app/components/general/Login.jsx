'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import Link from 'next/link';

export default function Login({ userType }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  userType = userType || 'user';
  const router = useRouter()

  const api = process.env.NEXT_PUBLIC_API;

  // Function triggered on form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(api + "/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({ email, password, userType }), // Include userType in the request
      });

      if (response.ok) {
        const data = await response.json();
        
        localStorage.setItem('tokenID', data.token);

        if(userType != "bouncer"){
        const anagrafica = data.anagrafica.nome + " " + data.anagrafica.cognome;
        localStorage.setItem("anagrafica", anagrafica);
        localStorage.setItem("immagine", data.immagine);
      }  
        if (userType === "promoter")
          router.push('/promoter/dashboard');
        else if (userType === "user")  
          router.push("/home_client");
        else if (userType === "bouncer")
          router.push("/bouncer/home");
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Si è verificato un errore durante il login. Riprova più tardi.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-bg1 bg-cover bg-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 lg:w-full lg:max-w-md sm:max-w-[350px] sm:m-3 p-8 space-y-8 bg-gray-800 shadow-2xl rounded-xl">
        <h2 className="text-2xl font-bold text-center text-gray-200">
        Accedi come {userType.charAt(0).toUpperCase() + userType.slice(1)}
        </h2>

        <form className="mt-8 space-y-6" method="post" onSubmit={handleSubmit}>
          <div className="relative">
            <label htmlFor="email" className="text-sm font-medium text-gray-400">Email</label>
            <input
              type="email"
              id="email"
              className="w-full text-gray-900 mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all focus:ring-indigo-600"
              placeholder="Inserisci la tua email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative mt-4">
            <label htmlFor="password" className="text-sm font-medium text-gray-400">Password</label>
            <input
              type="password"
              id="password"
              className="w-full text-gray-900 mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all focus:ring-indigo-600"
              placeholder="Inserisci la password"
              value={password}
              required
              onChange={(p) => setPassword(p.target.value)}
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <Link href={{pathname :"/recupera_password", query: {source: userType}}}
            className="text-sm text-blue-500 hover:underline">Password dimenticata?</Link>
          </div>

          <button
            type="submit"
            className="w-full font-sans py-2 mt-6 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-all"
          >
            Accedi
          </button>
        </form>

        <div className="flex items-center justify-center mt-4 text-sm">
          <span className="text-gray-600">Non hai un account? </span>
          <Link href={userType === "user"? "/signin" : "/promoter/signin"}
           className="ml-1 font-medium text-blue-500 hover:underline">Registrati</Link>
        </div>
      </div>
    </div>
  );
}
