"use client";

import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    setLoading(true);

    const response = await fetch(
      `/api/search?q=${query}&maxPrice=${maxPrice}`
    );

    const data = await response.json();

    if (Array.isArray(data)) {
  setResults(data);
} else {
  console.error(data);
  setResults([]);
}
    setLoading(false);
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Instrument Finder
      </h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Instrumento"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded w-64"
        />

        <input
          type="number"
          placeholder="Precio máximo"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border p-2 rounded w-48"
        />

        <button
          onClick={handleSearch}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Buscar
        </button>
      </div>

      {loading && <p>Buscando...</p>}

      <div className="space-y-4">
        {results.map((item) => (
          <div
            key={item.id}
            className="border p-4 rounded"
          >
            <h2 className="font-bold">
              {item.title}
            </h2>

            <p>${item.price}</p>
          </div>
        ))}
      </div>
    </main>
  );
}