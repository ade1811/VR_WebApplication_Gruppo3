"use client"
// components/QRScanner.js

import React, { useState, useRef, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { useSearchParams } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/navigation';

export default function QRScanner(){
  const searchParams = useSearchParams();
  const eventID = searchParams.get('event');
  const api = process.env.NEXT_PUBLIC_API;
  const router = useRouter();
  
  const [qrCode, setQrCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Verifica che il codice venga eseguito solo lato client
    if (typeof window !== 'undefined' && navigator.mediaDevices) {
      // Verifica se possiamo accedere alla fotocamera
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          setHasPermission(true);
        })
        .catch((error) => {
          console.error('Accesso alla fotocamera negato', error);
          setHasPermission(false);
        });
    }
  }, []);

  useEffect(() => {
    if (isScanning && hasPermission) {
      const codeReader = new BrowserMultiFormatReader();
      const startScanning = () => {
        codeReader.decodeFromVideoDevice(
          undefined, // Usa la fotocamera predefinita
          videoRef.current, // Riferimento alla videocamera
          (result, error) => {
            if (result) {
              setQrCode(result.getText());
              setIsScanning(false); // Ferma la scansione dopo aver trovato il QR code
            }
            if (error && !(error instanceof Error)) {
              console.error(error);
            }
          }
        );
      };

      startScanning();

      return () => {
        codeReader.reset(); // Ferma la scansione quando il componente viene smontato
      };
    }
  }, [isScanning, hasPermission]);

  const start = () => {
    setIsScanning(true);
  };

  const stop = () => {
    setIsScanning(false);
  };

  useEffect(() => {
    if (qrCode) {
      fetch(api + '/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('tokenID')}`,
        },
        body: JSON.stringify({
          eventoID: eventID,
          matricola: qrCode,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          setQrCode('');
        })
        .catch((error) => {
          alert(data.message);
          console.log('Errore durante il check-in:', error);
          setQrCode('');
        });
    }
  });

  return (
    <div className="min-h-screen bg-bg1 bg-cover bg-center text-white flex flex-col items-center relative">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>
  
      {/* Header */}
      <header className="bg-transparent px-6 py-4 flex items-center fixed w-full top-0 z-50 backdrop-blur-md">
        <ArrowLeftIcon
          className="h-6 w-6 text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
          onClick={() => router.push("/bouncer/home")}
        />
        <h1 className="text-xl sm:text-2xl font-bold ml-4">Scansiona QR Code</h1>
      </header>
  
      {/* Scanner Container */}
      <div className="container mx-auto px-4 py-12 z-10 relative mt-24">
        <div className="max-w-lg mx-auto bg-gray-800/90 rounded-lg shadow-2xl p-6 sm:p-8">
          <div >
            {hasPermission ? (
              <>
                <video
                  ref={videoRef}
                  width="100%"
                  height="auto"
                  className="border border-gray-600 rounded-lg"
                />
                {qrCode && (
                  <p className="mt-4 text-sm text-green-400 font-medium">
                    QR Code Scansionato: {qrCode}
                  </p>
                )}
              </>
            ) : (
              <p className="text-center text-gray-400 mt-4">
                Non è possibile accedere alla fotocamera. Verifica i permessi.
              </p>
            )}
          </div>
          <div className="mt-6 flex justify-center gap-4">
            {!isScanning ? (
              <button
                onClick={start}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all"
              >
                Inizia la scansione
              </button>
            ) : (
              <button
                onClick={stop}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all"
              >
                Ferma la scansione
              </button>
            )}
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-300 text-sm">
              Posiziona il QR code all'interno dell'area di scansione
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  
  
};