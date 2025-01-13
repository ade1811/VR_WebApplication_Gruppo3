"use client";

import { useState } from "react";
import { HomeIcon, TicketIcon, CalendarIcon, SupportIcon, PlusCircleIcon, MapIcon, ShoppingBagIcon} from '@heroicons/react/solid';
import DashboardContent from "../components/dashboard_comp/DashboardContent";
import Link from "next/link";
import CreateEventPage from "../components/dashboard_comp/CreateEventPage";
import EventList from "../components/dashboard_comp/EventList";
import Map from "../components/dashboard_comp/Map";
import Calendar from "../components/dashboard_comp/Calendar";
import AiSupport from "../components/AiSupport";


export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const img  = localStorage.getItem("immagine");
  const api = process.env.NEXT_PUBLIC_API;

  const renderContent = () => {
    switch (currentPage) {
      case "Eventi":
        return <EventList />;
      case "Crea Evento":
        return <CreateEventPage />;
      case "Calendario":
        return <Calendar />;
      case "Supporto AI":
        return <AiSupport />;
      case "Mappa":
        return <Map />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="relative flex h-screen bg-bg1 bg-cover">
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Sidebar */}
      <aside
        className={`${isSidebarOpen ? "translate-x-0 z-20" : "-translate-x-full"} bg-gray-800 lg:translate-x-0 fixed lg:static inset-y-0 left-0
        w-64 text-white transform transition-transform duration-300 ease-in-out lg:z-auto
        flex flex-col justify-between px-2`}>
        <nav className="mt-4">
          <Link href="/" className="p-4 font-bold text-4xl">FastEvent</Link>
          <ul className="mt-6">
            <li className="p-2 rounded-md flex items-center">
              <div className="ml-2 font-medium text-base text-gray-500" href="#">MENU</div>
            </li>
            <li
              className={`p-2 rounded-md flex items-center cursor-pointer hover:bg-gray-700 ${currentPage === "dashboard" && "bg-gray-700"}`}
              onClick={() =>{setCurrentPage("Dashboard")
                setIsSidebarOpen(false)
              }}>
              <HomeIcon className="w-5 h-5" />
              <span className="ml-2 font-medium text-lg">Dashboard</span>
            </li>
            <li
              className="p-2 rounded-md flex items-center cursor-pointer hover:bg-gray-700"
              onClick={() => {setCurrentPage("Eventi")
                setIsSidebarOpen(false)
              }}>
              <TicketIcon className="w-5 h-5" />
              <span className="ml-2 font-medium text-lg">Eventi</span>
            </li>
            <li
              className="p-2 rounded-md flex items-center cursor-pointer hover:bg-gray-700"
              onClick={() => {setCurrentPage("Crea Evento")
                setIsSidebarOpen(false)
              }}>
              <PlusCircleIcon className="w-5 h-5" />
              <span className="ml-2 font-medium text-lg">Crea evento</span>
            </li>
            <li
              className="p-2 rounded-md flex items-center cursor-pointer hover:bg-gray-700"
              onClick={() => {setCurrentPage("Mappa")
                setIsSidebarOpen(false)
              }}>
              <MapIcon className="w-5 h-5" />
              <span className="ml-2 font-medium text-lg">Mappa</span>
            </li>
            <li
              className="p-2 rounded-md flex items-center cursor-pointer hover:bg-gray-700"
              onClick={() => {setCurrentPage("Calendario")
                setIsSidebarOpen(false)
              }}>
              <CalendarIcon className="w-5 h-5" />
              <span className="ml-2 font-medium text-lg">Calendario</span>
            </li>
            <li className="p-2 rounded-md flex items-center">
              <div className="ml-2 font-medium  mt-2 text-base text-gray-500">CONTATTI</div>
            </li>
            <li
              className="p-2 rounded-md flex items-center cursor-pointer hover:bg-gray-700"
              onClick={() => {setCurrentPage("Supporto AI")
                setIsSidebarOpen(false)
              }}>
              <SupportIcon className="w-5 h-5" />
              <span className="ml-2 font-medium text-lg">Supporto AI</span>
            </li>
            <li className="p-2 rounded-md flex items-center">
            </li>
          </ul>
        </nav>

        <div className="flex ml-2 bottom-0">
          <img src={api + "/image/" + img} alt="User Avatar" className="w-10 h-10 rounded-full mb-2 mr-2" />
          <Link href="/promoter_profile" className="text-white mt-1">{localStorage.getItem("anagrafica")}</Link>
        </div>
      </aside>

      {/* Overlay per mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col z-10 relative">
        {/* Header */}
        <header className="flex items-center justify-between bg-gray-800 p-6 fixed top-0 left-0 right-0 lg:left-64 z-20 border-l-4 border-gray-200">
          <button
            className="lg:hidden text-gray-300 focus:outline-none"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
          <h1 className="text-3xl font-bold">{currentPage}</h1>
        </header>

        {/* Corpo della pagina */}
        <main className="flex-1 p-6 overflow-y-auto z-10 relative">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
