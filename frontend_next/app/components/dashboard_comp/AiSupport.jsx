import React, { use, useState, useEffect } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/solid";

export default function AiSupport() {
  const [messages, setMessages] = useState([
    { text: "Ciao! Sono un consulente di evento e ti aiuterò nel creare qualcosa di magnifico. Di cosa hai bisogno?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("dashboard", "Supporto AI");
  })

  const handleSend = () => {
    if (input.trim() !== "") {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      setIsLoading(true);

      fetch("http://100.127.243.64:5327/" + input)
        .then((response) => response.json())
        .then((data) => {
          setMessages((prev) => [
            ...prev,
            { text: data.response, sender: "bot" },
          ]);
          setIsLoading(false);
        })
        .catch((error) => {
          setMessages((prev) => [
            ...prev,
            { text: "Si è verificato un errore.", sender: "bot" },
          ]);
          setIsLoading(false);
          console.error("Error:", error);
        });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="z-auto flex flex-col h-3/4 mt-20 bg-gray-800 text-white rounded-3xl sm:mx-auto sm:w-3/4 md:w-2/3 lg:w-1/2 shadow-lg">
      {/* Header */}
      <div className="bg-gray-800 py-4 px-6 shadow-md rounded-t-3xl">
        <h1 className="text-xl font-bold">Sono qui per aiutarti</h1>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-6 py-3 break-words ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-200"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 rounded-lg px-6 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="bg-gray-800 p-4 rounded-b-3xl">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Scrivi un messaggio..."
            className="flex-1 bg-gray-700 text-white px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 rounded-full "
          />
          <button
            onClick={handleSend}
            className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-full"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
