import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const query = searchParams.get("q") || "";
    const maxPrice =
      Number(searchParams.get("maxPrice")) || Infinity;

    const response = await fetch(
      `https://api.mercadolibre.com/sites/MLM/search?q=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MELI_ACCESS_TOKEN}`,
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();

    console.log(data);

    if (!data.results || !Array.isArray(data.results)) {
      return Response.json({
        error: "No results found",
        data,
      });
    }

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
      {
        error: "Search failed",
      },
      {
        status: 500,
      }
    );
  }
}