'use client';

import { Carousel1 } from './components/Carousel1';
import AccessPromoterCard from './components/AccessPromoterCard';
import {ArrowCircleDownIcon } from '@heroicons/react/solid';

import Link from 'next/link';

// LANDING PAGE START
export default function Home() {
  return (
    <div className="bg-bg1 min-h-screen relative overflow-hidden">
      {/* SFONDO OSCURATO */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* PRIMA HERO SECTION PRINCIPALE */}
      <div className="relative px-6 lg:px-8">
        <div className="text-center py-20 sm:py-24 fade-slide-in">
          <img src="/images/logo.png" height="150" width="150" className="mx-auto mb-8" alt="Fast Event Logo" />
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl drop-shadow-lg">
            Fast Event
          </h1>
          <p className="mt-6 text-lg font-medium text-gray-300 sm:text-xl max-w-3xl mx-auto">
            Scopri tutto quello che puoi fare su Fast Event: crea eventi, gestisci prenotazioni, acquista biglietti e molto altro ancora per rendere ogni evento indimenticabile!
          </p>
          <div className="mt-8 flex justify-center gap-x-6">
            {/* LINK DI ACCESSO AL LOGIN */}
            <Link
              href="/login"
              className="text-sans rounded-lg bg-indigo-600 px-6 py-3 text-lg 
            font-bold text-white shadow-lg hover:bg-indigo-500 
            transition-transform transform hover:scale-105">
              Login
            </Link>
            {/* LINK DI ACCESSO ALLA REGISTRAZIONE */}
            <Link
              href="/signin"
              className="text-sans rounded-lg text-lg font-semibold text-gray-300 
            hover:text-white transition-transform transform hover:scale-105 py-3">
              Registrazione →
            </Link>
          </div>
        </div>

        <button onClick={() => {
            window.scrollTo({
              top: document.body.scrollHeight, // Altezza totale della pagina
              behavior: 'smooth', // Animazione di scorrimento
            });
          }} 
          className="absolute right-5 mb-10 flex items-center text-sans rounded-lg bg-indigo-600 px-6 py-3 text-lg font-bold text-white shadow-lg hover:bg-indigo-500 transition-transform transform hover:scale-105">
          Diventare un promoter? 
          <ArrowCircleDownIcon className="w-5 h-5 ml-2" />
        </button>


        {/* CAROUSEL DI SCORRIMENTO PER INFORMAZIONI SUI CONTENUTI */}
        <section className="my-20">
          <Carousel1 />
        </section>

        {/* SEZIONE DI ACCESSO AL SOTTODOMINIO DEL PROMOTER */}
        <section>
          <AccessPromoterCard />
        </section>

        {/* Footer */}
        <footer className="py-8 text-center text-gray-400 text-sm fade-slide-in">
          <p>© {new Date().getFullYear()} Fast Event. Tutti i diritti riservati.</p>
          <div className="mt-4 space-x-6">
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
            <Link href="#" className="hover:text-white">Termini di Servizio</Link>
            <Link href="#" className="hover:text-white">Contatti</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
