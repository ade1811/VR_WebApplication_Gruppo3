import { CalendarIcon, ClipboardCheckIcon, TicketIcon } from '@heroicons/react/outline'; // Se usi Heroicons, altrimenti importa dal pacchetto di icone che usi

const FeaturesSection = () => {
  return (
    <div className="mt-20 p-10 border-transparent bg-gray-900 rounded-3xl shadow-xl bg-opacity-90">
      <h2 className="text-sans text-3xl font-semibold text-center text-gray-100 mb-8">Caratteristiche Principali</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-gray-200">
        
        {/* Feature 1 */}
        <div>
          <div className="flex justify-center mb-3">
            <CalendarIcon className="w-10 h-10 text-indigo-300" />
          </div>
          <h3 className="text-sans text-xl font-bold">Crea Eventi</h3>
          <p className="text-sans mt-2 text-sm">Organizza eventi personalizzati con opzioni avanzate di gestione e promozione.</p>
        </div>
        
        {/* Feature 2 */}
        <div>
          <div className="flex justify-center mb-3">
            <ClipboardCheckIcon className="w-10 h-10 text-indigo-300" />
          </div>
          <h3 className="text-sans text-xl font-bold">Gestione Prenotazioni</h3>
          <p className="text-sans mt-2 text-sm">Controlla e monitora le prenotazioni, con strumenti di tracciamento in tempo reale.</p>
        </div>
        
        {/* Feature 3 */}
        <div>
          <div className="flex justify-center mb-3">
            <TicketIcon className="w-10 h-10 text-indigo-300" />
          </div>
          <h3 className="text-sans text-xl font-bold">Acquista Biglietti</h3>
          <p className="text-sans mt-2 text-sm">Facile acquisto di biglietti con supporto per più metodi di pagamento.</p>
        </div>
        
      </div>
    </div>
  );
}

export default FeaturesSection;
