import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// URL del file GeoJSON dell'Italia
const geoUrl =
  "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/italy-regions.geojson";

// Componente principale della mappa
export default function MapChart({ onRegionSelect }) {
  const [hoveredRegion, setHoveredRegion] = useState(null); // Stato per la regione in hover

  const handleRegionClick = (regionName) => {
    onRegionSelect(regionName); // Passa il nome della regione al componente di visualizzazione
  };

  return (
    <div className="w-full h-screen flex bg-gray-800 rounded-xl mt-10 justify-center items-center relative">
      {/* Contenitore con larghezza e altezza esplicite */}
      <div className="w-full h-full max-w-3xl">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 2500,  // Scala per l'Italia
            center: [12.4964, 41.9028], // Centro della mappa (coordinate di Roma)
          }}
          style={{ width: "100%", height: "100%" }} // Impostazione per adattarsi al contenitore
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  className="geography"
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#ECEFF1" // Colore di riempimento
                  stroke="#607D8B" // Colore dei contorni
                  strokeWidth={0.5} // Spessore del contorno
                  onMouseEnter={() => setHoveredRegion(geo.properties.name)} // Setta il nome della regione quando passa il mouse sopra
                  onMouseLeave={() => setHoveredRegion(null)} // Reset quando il mouse esce dalla regione
                  onClick={() => handleRegionClick(geo.properties.name)} // Gestisce il click sulla regione
                  tabIndex="-1"
                  style={{
                    default: { fill: "#fff" , transition: "fill 0.3s ease, transform 0.3s ease"},
                    hover: { fill: "#04D", transform: "scale(1.02)" },
                    pressed: { fill: "#02A" },
                  }}
                />
              ))
            }
          </Geographies>
        </ComposableMap>
      </div>

      {/* Label della regione hoverata */}
      {hoveredRegion && (
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-white text-black p-2 rounded shadow-md">
          {hoveredRegion}
        </div>
      )}
    </div>
  );
}
