import { NextRequest } from "next/server";
import * as cheerio from "cheerio";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const query = searchParams.get("q") || "";
    const maxPrice =
      Number(searchParams.get("maxPrice")) || Infinity;

    const url = `https://listado.mercadolibre.com.mx/${encodeURIComponent(
      query
    )}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    const html = await response.text();

    const $ = cheerio.load(html);

    const results: any[] = [];

    $("li.ui-search-layout__item").each((_, element) => {
      const title = $(element)
        .find("h3")
        .text()
        .trim();

      const priceText = $(element)
        .find(".andes-money-amount__fraction")
        .first()
        .text()
        .replace(/,/g, "");

      const price = Number(priceText);

      const thumbnail =
        $(element)
          .find("img")
          .attr("data-src") ||
        $(element)
          .find("img")
          .attr("src");

      const permalink = $(element)
        .find("a")
        .attr("href");

      if (
        title &&
        price &&
        price <= maxPrice
      ) {
        results.push({
          title,
          price,
          thumbnail,
          permalink,
        });
      }
    });

    return Response.json(html);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Scraping failed" },
      { status: 500 }
    );
  }
}