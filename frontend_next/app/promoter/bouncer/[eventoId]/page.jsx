'use client';

import { ArrowLeftIcon } from "@heroicons/react/solid";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function bouncer({params}) {
    const router = useRouter();
    const api = process.env.NEXT_PUBLIC_API;
    const par = React.use(params);

    const [email, setEmail] = useState("");
    const [bouncers, setBouncers] = useState([]);
    const [selectedBouncers, setSelectedBouncers] = useState([]);
    const [bouncerInServizio, setBouncerInServizio] = useState([]);
    const [event, setEvent] = useState();

    const token = localStorage.getItem("tokenID");

    useEffect(() => {
        const fetchBouncers = async () => {
            try {
                const response = await fetch(api + "/bouncerLavora/" + par.eventoId, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                setBouncerInServizio(data.data);
                console.log(data.data);
            } catch (error) {
                console.error("Error fetching bouncers:", error);
            }

            try {
                const response = await fetch(api + "/getOldBouncers", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                setBouncers(data.data);
                console.log(data.data);
            } catch (error) {
                console.error("Error fetching bouncers:", error);
            }

            try {
                const response = await fetch(api + "/getEventP/" + par.eventoId, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                const jsonData = await response.json();
                setEvent(jsonData.data.evento);
              } catch (error) {
                console.error("Error fetching event:", error);
              }
        };
        fetchBouncers();
    }, []);

    const handleAddBouncer = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(api + "/createBouncer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ email:email, eventoID: par.eventoId}),
            });

            if (response.ok) {
                alert("Bouncer aggiunto correttamente!");
                window.location.reload();
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.error("Error adding bouncer:", error);
        }
    };

    const handleCheckboxChange = (bouncerId) => {
        setSelectedBouncers((prev) =>
            prev.includes(bouncerId)
                ? prev.filter((id) => id !== bouncerId)
                : [...prev, bouncerId]
        );
    };

    const handleAssociateBouncers = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(api + "/setBouncer/" + par.eventoId, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ bouncerID: selectedBouncers }),
            });

            if (response.ok) {
                alert("Bouncer aggiunto correttamente!");
                window.location.reload();
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.error("Error adding bouncer:", error);
        }
    }

    const isBouncerAssigned = (bouncerId) => {
        return bouncerInServizio.some(b => b.bouncerID === bouncerId);
    };

    return (
        <div className="min-h-screen bg-bg1 bg-cover bg-center text-white flex flex-col items-center relative">
            {/* Overlay scuro solo sull'immagine di sfondo */}
            <div className="absolute inset-0 bg-black opacity-50"></div>

            {/* Header */}
            <header className="bg-transparent px-6 py-4 flex items-center fixed w-full top-0 z-50">
                <ArrowLeftIcon
                    className="h-6 w-6 text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
                    onClick={() => router.back()}
                />
                <h1 className="text-2xl font-bold ml-4">
                    {event?.titolo}
                </h1>
            </header>

            <div className="flex flex-col md:flex-row w-full max-w-7xl px-6 py-12 gap-8 z-10 relative mt-5">
                {/* Add Bouncer Section */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-md flex-1">
                    <h2 className="text-xl font-bold mb-4">Aggiungi un nuovo bouncer all'evento</h2>
                    <form onSubmit={handleAddBouncer} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2 bg-gray-700 rounded-lg text-white"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                        >
                            Aggiungi bouncer alla lista personale ed all'evento
                        </button>
                    </form>
                </div>

                {/* Bouncer List Section */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-md flex-1">
                    <h2 className="text-xl font-bold mb-4">Lista dei bouncer personali</h2>
                    <div className="space-y-2">
                        {bouncers ? (
                            bouncers.map((bouncer, key) => {
                                const isAssigned = isBouncerAssigned(bouncer.bouncerID);
                                return (
                                    <div key={key} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`bouncer-${bouncer.bouncerID}`}
                                            checked={isAssigned || selectedBouncers.includes(bouncer.bouncerID)}
                                            onChange={() => handleCheckboxChange(bouncer.bouncerID)}
                                            disabled={isAssigned}
                                            className={`mr-2 ${isAssigned ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        />
                                        <p>{`${bouncer.email}`}</p>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-sm">Non sono presenti bouncer</p>
                        )}
                    </div>
                    <button
                        onClick={handleAssociateBouncers}
                        className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
                    >
                        Associa altri bouncer all'evento
                    </button>
                </div>
            </div>
        </div>
    );
}
