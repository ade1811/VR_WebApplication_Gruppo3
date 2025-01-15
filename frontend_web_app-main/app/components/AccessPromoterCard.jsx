import React from 'react';
import Link from 'next/link';

const features = [
  { name: 'Pubblicazione Eventi', description: 'Crea eventi personalizzati facilmente con tutte le opzioni di gestione.' },
  { name: 'Monitoraggio Eventi', description: 'Tieni traccia in tempo reale dello stato dei tuoi eventi.' },
  { name: 'Statistiche Eventi Generali', description: 'Accedi a report dettagliati sull’andamento degli eventi.' },
  { name: 'Supporto Metodi di Pagamento', description: 'Offri diverse opzioni di pagamento per i tuoi partecipanti.' },
];

export default function AccessPromoterCard() {
  return (
    <section className="py-24 bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100 rounded-3xl relative isolate overflow-hidden">
      <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Vuoi diventare un promoter?</h2>
          <p className="mt-4 text-gray-300 leading-relaxed">
            Una piattaforma completa per creare, monitorare e analizzare eventi con facilità. Scopri le principali funzionalità che rendono il nostro sistema ideale per ogni tipo di evento.
          </p>

          <dl className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="border-t border-gray-700 pt-4">
                <dt className="font-semibold text-white text-lg">{feature.name}</dt>
                <dd className="mt-2 text-gray-300 text-sm">{feature.description}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10">
            <Link
              href="/promoter/signin"
              className="inline-block bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105"
            >
              Diventa Promoter
            </Link>
          </div>
        </div>

        <div className="gap-6 hidden lg:block">
          
          <img
            alt="Monitoraggio eventi in tempo reale"
            src="/images/img_cell.png"
            className="rounded-lg object-cover"
          />
          
        </div>
      </div>

      <div aria-hidden="true" className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6">
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
        />
      </div>
    </section>
  );
}
