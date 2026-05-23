import axios from 'axios'

export async function searchItems(query: string) {
  const response = await axios.get(
    'https://api.mercadolibre.com/sites/MLM/search',
    {
      params: {
        q: query,
        limit: 20,
      },
    }
  )

  return response.data.results
}