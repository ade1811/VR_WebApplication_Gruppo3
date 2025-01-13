import React from "react";
import EventCard from "./EventCard";
import Link from "next/link";

const EventCategory = ({ title, events, id }) => (
  <section className="my-6">
    <h2 className="text-white text-xl font-semibold mb-2 px-4">{title}</h2>
    <Link className="flex overflow-x-scroll space-x-4 px-4 scrollbar-hide"
          href={`/event/${id}`}>
      {events.map((event) => (
        <EventCard
          key={event.id}
          image={event.image}
          title={event.title}
          description={event.description}
        />
      ))}
    </Link>
  </section>
);

export default EventCategory;
