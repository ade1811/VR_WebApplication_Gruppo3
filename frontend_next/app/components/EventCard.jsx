import React from "react";
import { BadgeCheckIcon } from '@heroicons/react/solid';

// Component for individual event card
export default function EventCard({ image, title , data , ecologic})
{
  const api = process.env.NEXT_PUBLIC_API;

  return(
    <div className="bg-gray-800 rounded-lg shadow-lg p-4 m-2 min-w-[320px] w-80 h-72 relative transform hover:scale-105 transition-transform duration-200">
  <img
    src={api + "/image/" + image}
    alt={title}
    className="w-full h-40 object-cover rounded-lg"
  />
  <h3 className="text-gray-200 text-xl font-semibold mt-4 truncate">{title}</h3>
  <p className="absolute left-4 bottom-4 text-gray-500 text-sm">{data}</p>
  {ecologic ? (<BadgeCheckIcon className="w-5 h-5 bottom-4 right-4 absolute text-green-600"/>) : null}
</div>
  )
};
