import ReactApexChart from 'react-apexcharts';

export default function ChartCard({ title, chartOptions, chartSeries, chartType = 'area', height = 350 }) {
  return (
    <div className="bg-gray-800 shadow p-6 rounded-xl">
      <h2 className="text-gray-400 text-xl">{title}</h2>
      <div className="h-[350px] mt-4 bg-gray-700 rounded-lg">
        <ReactApexChart
          options={chartOptions}
          series={chartSeries}
          type={chartType}
          height={height} 
        />
      </div>
    </div>
  );
}
