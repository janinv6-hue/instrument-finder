export async function GET() {
  const authUrl =
    `https://auth.mercadolibre.com.mx/authorization` +
    `?response_type=code` +
    `&client_id=${process.env.MELI_CLIENT_ID}` +
    `&redirect_uri=${process.env.MELI_REDIRECT_URI}`;

  return Response.redirect(authUrl);
}