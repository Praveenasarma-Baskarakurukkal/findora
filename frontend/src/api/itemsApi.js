import axios from 'axios'

const BASE_URL = 'http://localhost:8080'

export async function searchItems(keyword, category) {
  const params = {}

  if (keyword?.trim()) {
    params.keyword = keyword.trim()
  }

  if (category?.trim()) {
    params.category = category.trim()
  }

  const response = await axios.get(`${BASE_URL}/api/items/search`, {
    params,
  })

  return response.data
}
