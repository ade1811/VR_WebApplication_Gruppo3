import React, { useState } from "react";
import MapChart from "./MapChart";  // Importa il componente MapChart
import DataMap from "./DataMap";    // Importa il componente DataMap

export default function Map() {
  const [selectedRegion, setSelectedRegion] = useState(null); // Stato per la regione selezionata

  const handleRegionSelect = (regionName) => {
    setSelectedRegion(regionName); // Aggiorna lo stato con la regione selezionata
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10 justify-center">
      {/* Passa la funzione handleRegionSelect a MapChart */}
      <MapChart onRegionSelect={handleRegionSelect} />

      {/* Passa la regione selezionata a DataMap */}
      {selectedRegion && <DataMap region={selectedRegion} />}
    </div>
  );
}
