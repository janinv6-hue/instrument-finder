import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const query = searchParams.get("q") || "";
    const maxPrice =
      Number(searchParams.get("maxPrice")) || Infinity;

    const response = await fetch(
      `https://api.mercadolibre.com/sites/MLM/search?q=${encodeURIComponent(query)}`
    );

    console.log("STATUS:", response.status);

    const text = await response.text();

    console.log("RAW RESPONSE:", text);

    const data = JSON.parse(text);

    const results = data.results
      .filter((item: any) => item.price <= maxPrice)
      .map((item: any) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        thumbnail: item.thumbnail,
        permalink: item.permalink,
      }));

    return Response.json(results);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Algo salió mal" },
      { status: 500 }
    );
  }
}