'use client'

import EventCardPromoter from '../EventCardPromoter';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Usa next/navigation
import Link from 'next/link';

export default function EventList() {
    const [data, setData] = useState([]);
    const api = process.env.NEXT_PUBLIC_API;
    const logo = "images/bg1.png";
    const router = useRouter(); // Usa useRouter da next/navigation

    useEffect(() => {
        const token = localStorage.getItem("tokenID");

        fetch(api + "/getEvents", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            setData(data.data); // Imposta lo stato con i dati ricevuti
        })
        .catch(error => {
            console.error("Errore durante il fetch:", error);
        });
    }, [api]);

    return (
        <div className='mt-20 relative z-5'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full justify-center'>
                {data.map((event, index) => (
                    <Link href={`/event/${event.eventoID}`} key={event.id || index}
                            title="Visualizza"
                            className="text-gray-300 hover:text-white transition-colors duration-200"
                            aria-label="View Event">
                        <EventCardPromoter
                            eventID={event.eventoID}
                            title={event.titolo}
                            date={event.data}
                            copertina={event.copertina || logo}
                            isVisible={event.isVisible}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
}
