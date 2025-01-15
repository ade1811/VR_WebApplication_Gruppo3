"use client";

import ChartCard from "../ChartCard";
import CardDashboard from "../CardDashboard";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const chartOptions = {
  chart: {
    type: "area",
    background: "#2d3748",
    toolbar: { show: false },
  },
  stroke: { curve: "smooth", colors: ["#63B3ED", "#4FD1C5"] },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    labels: { style: { colors: "#A0AEC0" } },
  },
  yaxis: { labels: { style: { colors: "#A0AEC0" } } },
  grid: { borderColor: "#4A5568" },
  tooltip: { theme: "dark" },
  legend: { labels: { colors: "#A0AEC0" } },
};

export default function DashboardContent() {
  const [data, setData] = useState([]); // Stato inizializzato con array vuoto
  const router = useRouter();
  const [chartSeries1, setChartSeries1] = useState([]);
  const [chartSeries2, setChartSeries2] = useState([]);


  const api = process.env.NEXT_PUBLIC_API;
  useEffect(() => {
    const token = localStorage.getItem("tokenID"); // sostituisci con il tuo token

    // Fetch dei dati dall'API con il token di autenticazione
    fetch(api + "/dashboard", {
      method: "GET", // Metodo di richiesta
      headers: {
        "Content-Type": "application/json", // tipo di contenuto della richiesta
        Authorization: `Bearer ${token}`, // Aggiungi il token nell'intestazione
      },
    })
      .then((response) => {
        if (response.status !== 200) {
          // Se l'API risponde con errore di autenticazione
          router.push("/promoter/login"); // Reindirizza alla pagina di login
          return null;
        }
        if (!response.ok) {
          throw new Error("Errore nel caricamento dei dati.");
        }
        return response.json(); // Converti la risposta in formato JSON
      })
      .then((data) => {
        if (data && data.data) {
          setData(data.data); // Imposta i dati solo se esistono
          setChartSeries1([
            {
              name: data.grafici.name1, // Nome del grafico
              data: data.grafici.data1, // Array di dati
            },
          ]);
          setChartSeries2([
            {
              name: data.grafici.name2, // Nome del grafico
              data: data.grafici.data2, // Array di dati
            },
          ]);

          console.log(data.data)
        }
      })
      .catch((error) => {
        router.push("/promoter/login");
      });
  }, [api, router]);

  return (
    <div className="pt-14 relative z-5">
      {/* Dashboard Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {Object.values(data || {}).map((entity, index) => (
          <CardDashboard
            key={index}
            title={entity.title}
            amount={entity.amount}
            percentage={entity.percentage}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 justify-center">
        <ChartCard
          title="Andamento Eventi"
          chartOptions={chartOptions}
          chartSeries={chartSeries1}
          chartType="line"
          height={350}
        />
        <ChartCard
          title="Profitto settimanale"
          chartOptions={chartOptions}
          chartSeries={chartSeries2}
          chartType="area"
          height={350}
        />
      </div>
    </div>
  );
}
