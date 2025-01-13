'use client'
 
import { useSearchParams } from 'next/navigation'
import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function PasswordRecovery({ params }){
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const api = process.env.NEXT_PUBLIC_API;
    const searchParams = useSearchParams()
    const userType = searchParams.get('source')

    useEffect(() => {
      const fetchParams = async () => {
          const unwrap = await params;
          setToken(unwrap.token);
      };

      fetchParams();
  }, [params])

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const response = await fetch(api + `/passwordReset/${token}`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              mode: 'cors',
              body: JSON.stringify({ password }),
          });

          if (response.ok) {
              const data = await response.json();
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
    <div className="flex items-center justify-center min-h-screen bg-bg1 bg-cover bg-center">
    <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-96 z-10">
        <h2 className="text-white text-2xl font-bold mb-6 text-center">
          Recupera Password
        </h2>
        <form method="post" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="Password"
              className="block text-gray-300 text-sm font-semibold mb-2"
            >
              Password
            </label>
            <input
              required
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              value={password}
              placeholder="Inserisci la tua nuova password"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg mt-4 transition duration-200"
          >
            Agiorna Password
          </button>
        </form>
        <p className="text-gray-400 text-sm text-center mt-4">
          Ricorda la password?{' '}
          <Link href={userType == "user"? "/login": "/promoter/login"} className="text-blue-500 hover:underline">
            Accedi
          </Link>
        </p>
      </div>
    </div>
  );
};