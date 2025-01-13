import React from "react";
import { EyeIcon, PencilIcon, EyeOffIcon, TicketIcon, UserGroupIcon  } from "@heroicons/react/solid";
import { useRouter } from "next/navigation";

export default function EventCardPromoter({ title, date, eventID, copertina, isVisible }) {
  const api = process.env.NEXT_PUBLIC_API;
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("tokenID");
    const response = await fetch(api + "/changeVisibility/" + eventID, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    window.location.reload();
  };


  return (
    <div>
      <div className="bg-gray-800 rounded-lg shadow-lg p-4 m-2 min-w-[320px] w-80 h-72 flex-shrink-0 transform hover:scale-105 transition-transform duration-200 relative">
        {/* Immagine dell'evento */}
        <img
          src={api + "/image/" + copertina}
          alt={title}
          className="w-full h-40 object-cover rounded-lg"
        />

        {/* Titolo dell'evento */}
        <h3 className="text-white text-xl font-semibold mt-4">{title}</h3>

        {/* Footer della card */}
        <div className="absolute bottom-4 left-4 text-gray-300 text-sm">
          {date} {/* Mostra la data dell'evento */}
        </div>

        {/* Pulsanti di azione */}
        <button id="change visibility" onClick={handleSubmit}>
          {isVisible ? (
            <EyeIcon className="w-4 h-4 text-gray-400 hover:text-gray-100 absolute bottom-4 right-4" />
          ) : (
            <EyeOffIcon className="w-4 h-4 text-gray-400 hover:text-gray-100 absolute bottom-4 right-4" />
          )}
        </button>

        <button
          onClick={(e) => {e.preventDefault();
            router.push(`/promoter/event/${eventID}`);}}
          title="Modifica"
          className="text-gray-300 hover:text-white transition-colors duration-200"
          aria-label="Edit Event"
        >
          <PencilIcon className="w-4 h-4 text-gray-400 hover:text-gray-100 absolute bottom-4 right-10" />
        </button>

        <button
          onClick={(e) => {e.preventDefault();
            router.push("/promoter/ticket/" + eventID);}}
          title="Biglietti"
          className="text-gray-300 hover:text-white transition-colors duration-200"
          aria-label="Tickets"
        >
          <TicketIcon className="w-4 h-4 text-gray-400 hover:text-gray-100 absolute bottom-4 right-16" />
        </button>

        <button
          onClick={(e) => {e.preventDefault();
            router.push("/promoter/bouncer/" + eventID);}}
          title="Bouncer"
          className="text-gray-300 hover:text-white transition-colors duration-200"
          aria-label="Tickets"
        >
          <UserGroupIcon className="w-4 h-4 text-gray-400 hover:text-gray-100 absolute bottom-4 right-24" />
        </button>
      </div>
    </div>
  );
}
