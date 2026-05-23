import { chromium } from "playwright";
import { NextRequest } from "next/server";

const SEARCHES = [
  {
    label: "Yamaha eléctricas",
    query: "guitarra electrica yamaha",
    maxPrice: 1500,
  },
  {
    label: "Squier",
    query: "guitarra squier",
    maxPrice: 2000,
  },
  {
    label: "Guitarras eléctricas",
    query: "guitarra electrica",
    maxPrice: 1000,
  },
  {
    label: "Bajos eléctricos",
    query: "bajo electrico",
    maxPrice: 2000,
  },
];

export async function GET(req: NextRequest) {
  try {
    const browser = await chromium.launch({
      headless: false,
    });

    const page = await browser.newPage();

    const allResults: any[] = [];

    for (const search of SEARCHES) {
      const url = `https://www.facebook.com/marketplace/guadalajara/search/?query=${encodeURIComponent(
        search.query
      )}`;

      await page.goto(url, {
        waitUntil: "networkidle",
      });

      try {
        await page.click('[aria-label="Cerrar"]');
      } catch {}

      await page.waitForTimeout(5000);

      await page.mouse.wheel(0, 5000);

      await page.waitForTimeout(3000);

      const listingLinks = await page
        .locator('a[href*="/marketplace/item"]')
        .all();

      for (
        let i = 0;
        i < Math.min(10, listingLinks.length);
        i++
      ) {
        const item = listingLinks[i];

        const text =
          (await item.textContent()) || "";

        const href =
          (await item.getAttribute("href")) ||
          "";

        const cleanText = text
          .replace(/\s+/g, " ")
          .trim();

        const priceMatch =
          cleanText.match(
            /MX\$?\s?([\d,]+)/
          );

        const price = priceMatch
          ? Number(
              priceMatch[1].replace(
                /,/g,
                ""
              )
            )
          : null;

        if (
          !price ||
          price < 501 ||
          price > search.maxPrice
        ) {
          continue;
        }

        const safeLabel =
          search.label.replace(
            /[^a-zA-Z0-9]/g,
            "-"
          );

        const screenshotPath =
          `public/screenshots/${safeLabel}-${i}.png`;

        try {
          await item.screenshot({
            path: screenshotPath,
          });
        } catch {}

        allResults.push({
          category: search.label,
          title: cleanText.slice(0, 120),
          price,
          link: href.startsWith("http")
            ? href
            : `https://facebook.com${href}`,
          screenshot:
            `/screenshots/${safeLabel}-${i}.png`,
        });
      }
    }

    const uniqueResults = allResults.filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          (t) => t.link === item.link
        )
    );

    uniqueResults.sort(
      (a, b) => a.price - b.price
    );

    return Response.json(uniqueResults);
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error:
          "Facebook scraping failed",
      },
      { status: 500 }
    );
  }
}