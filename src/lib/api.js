const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'

async function request(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase()
  const hasBody = options.body !== undefined && options.body !== null
  const headers = {
    ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
  }

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      method,
      headers,
    })
  } catch {
    throw new Error(
      `Tidak bisa terhubung ke API (${API_BASE_URL}). Cek backend berjalan, URL benar, dan CORS sudah diizinkan.`,
    )
  }

  const contentType = response.headers.get('content-type')
  const payload = contentType?.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    const message = payload?.message || 'Request failed'
    const error = new Error(message)
    error.status = response.status
    error.payload = payload
    throw error
  }

  return payload
}

function toQueryString(params) {
  const searchParams = new URLSearchParams()

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value))
    }
  })

  return searchParams.toString()
}

export async function searchHotels(params) {
  const query = toQueryString(params)
  return request(`/hotels/search?${query}`)
}

export async function getHotelDetail(hotelId, params) {
  const query = toQueryString(params)
  return request(`/hotels/${hotelId}?${query}`)
}

export async function createBooking(body) {
  return request('/bookings', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function createHotel(body) {
  return request('/admin/hotels', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function createRoom(body) {
  return request('/admin/rooms', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function updateRoomPrice(roomId, pricePerNight) {
  return request(`/admin/rooms/${roomId}/price`, {
    method: 'PATCH',
    body: JSON.stringify({ pricePerNight }),
  })
}

export async function getAdminBookings(params) {
  const query = toQueryString(params)
  return request(`/admin/bookings?${query}`)
}


