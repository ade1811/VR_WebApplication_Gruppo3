import React from "react";

// Component for individual event card
export default function EventCard({ image, title })
{
  const api = process.env.NEXT_PUBLIC_API;

  return(
    <div className="bg-gray-800 rounded-lg shadow-lg p-4 m-2 min-w-[320px] w-80 h-72 flex-shrink-0 transform hover:scale-105 transition-transform duration-200">
      <img
        src={api + "/image/" + image}
        alt={title}
        className="w-full h-40 object-cover rounded-lg"
      />
      <h3 className="text-gray-200 text-xl font-semibold mt-4 truncate">{title}</h3>
    </div>
  )
};
