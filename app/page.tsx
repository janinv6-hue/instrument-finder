"use client";

import { useState } from "react";

export default function Home() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/facebook-search"
      );

      const data = await response.json();

      console.log(data);

      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-6">
        Instrument Finder
      </h1>

      <button
        onClick={handleSearch}
        className="bg-black text-white px-6 py-3 rounded mb-8"
      >
        Buscar ofertas
      </button>

      {loading && (
        <p className="mb-6">
          Buscando en Facebook Marketplace...
        </p>
      )}

      <div className="space-y-4">
        {results.map(
          (item: any, index: number) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="border rounded p-4 block hover:bg-gray-100"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    {item.category}
                  </p>

                  <h2 className="font-bold text-lg">
                    {item.title}
                  </h2>
                </div>

                <p className="text-2xl font-bold">
                  ${item.price}
                </p>
              </div>
            </a>
          )
        )}
      </div>
    </main>
  );
}