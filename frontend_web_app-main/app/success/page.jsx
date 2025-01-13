'use client'
import { useEffect } from 'react'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function SuccessPage() {

    return (
        <div className="min-h-screen bg-bg1 bg-cover bg-center flex items-center justify-center relative">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            
            <div className="max-w-md w-full p-8 bg-gray-800 shadow-xl rounded-lg text-center z-10">
                <div className="mb-4 flex justify-center">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-4">
                    Pagamento completato con successo!
                </h1>
                <p className="text-gray-300 mb-8">
                    Grazie per il tuo acquisto. Riceverai una email di conferma con i dettagli della transazione.
                </p>
                <Link
                    href="/home_client"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Torna alla home
                </Link>
            </div>
        </div>
    )
}