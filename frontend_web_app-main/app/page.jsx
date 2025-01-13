'use client';

import { useEffect } from 'react';
import { Carousel1 } from './components/Carousel1';
import AccessPromoterCard from './components/AccessPromoterCard';
import CallToAction from './components/CallToAction';
import Link from 'next/link';

// LANDING PAGE START
export default function Home() {
  useEffect(() => {
    const elements = document.querySelectorAll('.fade-slide-in');

    const observerOptions = {
      threshold: 0.2, // Trigger quando il 20% dell'elemento è visibile
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect(); // Cleanup observer
    };
  }, []);

  return (
    <div className="bg-bg1 min-h-screen relative overflow-hidden">
      {/* SFONDO OSCURATO */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* HEADER CON TOP BAR 
      <header className="fixed top-0 left-0 w-full p-4 shadow-md z-10 overflow-hidden animated-header fade-slide-in">
        <div className="relative z-10 flex justify-between items-center">
          <img src="/images/logo.png" height="40" width="40" alt="Fast Event Logo" />
        </div>

        
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-70 animate-gradient"></div>
      </header>
      */}

      {/* PRIMA HERO SECTION PRINCIPALE */}
      <div className="relative px-6 lg:px-8">
        <div className="text-center py-20 sm:py-32 fade-slide-in">
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

        {/* CAROUSEL DI SCORRIMENTO PER INFORMAZIONI SUI CONTENUTI */}
        <section className="my-16 fade-slide-in">
          <Carousel1 />
        </section>

        {/* SEZIONE DI ACCESSO AL SOTTODOMINIO DEL PROMOTER */}
        <section className="fade-slide-in">
          <AccessPromoterCard />
        </section>

        {/* Footer */}
        <footer className="py-8 text-center text-gray-400 text-sm fade-slide-in">
          <p>© {new Date().getFullYear()} Fast Event. Tutti i diritti riservati.</p>
          <div className="mt-4 space-x-6">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Termini di Servizio</Link>
            <Link href="/contact" className="hover:text-white">Contatti</Link>
          </div>
        </footer>
      </div>

      {/* Animazioni CSS */}
      <style jsx>{`
        .fade-slide-in {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }

        .fade-slide-in.visible {
          opacity: 1;
          transform: translateY(0);
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animated-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(270deg, #6b5b95, #feb236, #d64161, #ff7b25);
          background-size: 400% 400%;
          animation: gradient 8s ease infinite;
          z-index: -1;
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
}
