import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const code = searchParams.get("code");

    if (!code) {
      return Response.json(
        { error: "No code received" },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://api.mercadolibre.com/oauth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grant_type: "authorization_code",
          client_id: process.env.MELI_CLIENT_ID,
          client_secret: process.env.MELI_CLIENT_SECRET,
          code,
          redirect_uri: process.env.MELI_REDIRECT_URI,
        }),
      }
    );

    const data = await response.json();

    console.log(data);

    return Response.json(data);
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "OAuth failed" },
      { status: 500 }
    );
  }
}