export default function CardDashboard({ title, amount, percentage }) {
    // Determina il colore in base al valore di percentage
    let percentageColor = " "
    if (percentage != null)
    {
        percentageColor = percentage[0] == "+" ? 'text-green-500' : 'text-red-500';
    }
    else
        {percentageColor = "trasparent"}
    

    return (
        <div className="bg-gray-800 shadow p-4 rounded-xl">
            <h2 className="text-gray-400">{title}</h2>
            <p className="text-2xl font-bold text-gray-100">{amount}</p>
            <p className={`text-sm ${percentageColor}`}>{percentage}</p>
        </div>
    );
}
