import React, { useState, useEffect } from "react";

export default function DataMap({ region }) {
  const [regionData, setRegionData] = useState({
    regione: "Seleziona regione",
    eventi: 0,
    partecipanti: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const api = process.env.NEXT_PUBLIC_API;

  useEffect(() => {
    const fetchRegionData = async () => {
      if (!region) return;
      setIsLoading(true);
      setIsDataLoaded(false);

      try {
        const token = localStorage.getItem("tokenID");
        const response = await fetch(api + `/regione/${region}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setRegionData(data);
        setIsDataLoaded(true);
      } catch (error) {
        setIsLoading(false);
        alert("Error fetching region data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegionData();
  }, [region, api]);

  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center backdrop-blur-sm z-50">
      <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="w-full h-screen mt-10 z-5 relative">
      {(isLoading || !isDataLoaded) && <LoadingOverlay />}

      <div className={`bg-gray-800 rounded-xl shadow-2xl overflow-hidden ${(isLoading || !isDataLoaded) ? "blur-sm" : ""}`}>
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-700 pb-6">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent p-2">
              {region || "Seleziona Regione"}
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700 p-6 rounded-lg hover:bg-gray-600 transition-colors">
              <h2 className="text-2xl font-semibold text-white mb-4">Dettagli regione</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Popolazione</span>
                  <span className="text-blue-400 font-bold">{regionData.popolazione || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Tasso di partecipazione</span>
                  <span className="text-purple-400 font-bold">{regionData.tasso || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 p-6 rounded-lg hover:bg-gray-600 transition-colors">
              <h2 className="text-2xl font-semibold text-white mb-4">Statistiche</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Eventi Totali</span>
                  <span className="text-blue-400 font-bold">{regionData.regione || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Partecipanti</span>
                  <span className="text-purple-400 font-bold">{regionData.partecipanti || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 p-6 rounded-lg hover:bg-gray-600 transition-colors">
                <h2 className="text-2xl font-semibold text-white mb-4">Top 3 generi</h2>
                <ol className="list-decimal list-inside text-blue-300 space-y-2">
                    <li className="font-bold">{regionData?.generi?.[0] || 'Nessun genere'}</li>
                    <li className="font-bold text-blue-400">{regionData?.generi?.[1] || 'Nessun genere'}</li>
                    <li className="font-bold text-blue-500">{regionData?.generi?.[2] || 'Nessun genere'}</li>
                </ol>
            </div>


            <div className="bg-gray-700 p-6 rounded-lg hover:bg-gray-600 transition-colors">
              <h2 className="text-2xl font-semibold text-white mb-4">Statistiche</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Eventi Totali</span>
                  <span className="text-blue-400 font-bold">{regionData.regione || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Partecipanti</span>
                  <span className="text-purple-400 font-bold">{regionData.partecipanti || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
