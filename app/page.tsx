"use client";

import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    try {
      setLoading(true);

      const response = await fetch(
        `https://api.mercadolibre.com/sites/MLM/search?q=${encodeURIComponent(query)}`
      );

      const data = await response.json();

      const filtered = data.results
        .filter(
          (item: any) =>
            item.price <= Number(maxPrice || Infinity)
        )
        .map((item: any) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          thumbnail: item.thumbnail,
          permalink: item.permalink,
        }));

      setResults(filtered);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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
          <a
            key={item.id}
            href={item.permalink}
            target="_blank"
            className="border p-4 rounded flex gap-4 items-center block"
          >
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-24 h-24 object-cover"
            />

            <div>
              <h2 className="font-bold">
                {item.title}
              </h2>

              <p className="text-lg">
                ${item.price}
              </p>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}