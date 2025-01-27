"use client";
import { useEffect, useState } from 'react';

export default function homeBouncer(params) {
    const [events, setEvents] = useState([]);
    const api = process.env.NEXT_PUBLIC_API;
    

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(api + "/getEventsBouncer", {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("tokenID")}`,
                    }
                });
                const data = await response.json();
                console.log(data.data);
                setEvents(data.data);
                
              } catch (error) {
                console.error("Error fetching event:", error);
                window.location.href = "/bouncer/login";
              }
        };
        fetchEvents();
    }, []);

    return (
        <div className="min-h-screen bg-bg1 bg-cover bg-center text-white flex flex-col items-center relative">
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black opacity-50"></div>

            {/* Header */}
            <header className="bg-transparent px-6 py-4 flex items-center fixed w-full top-0 z-50">
                <h1 className="text-2xl font-bold ml-4">I tuoi Eventi</h1>
            </header>

            {/* Content */}
            <div className="container mx-auto px-6 py-12 z-10 relative mt-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event, key) => (
                        <button 
                            onClick={() => {window.location.href = "/bouncer/scan?event=" + event.eventoID}}
                            key={key} 
                            className="bg-gray-800 rounded-lg shadow-lg p-6 hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
                        >
                            <h2 className="text-2xl font-bold mb-4 text-white">{event.titolo}</h2>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">{event.data}</span>
                                <span className="text-blue-400">{event.ora}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
