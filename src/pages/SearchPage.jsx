import { useState } from 'react'
import { Link } from 'react-router-dom'
import { searchHotels } from '../lib/api.js'
import { defaultSearchDates, formatCurrency } from '../utils/format.js'

const initialDates = defaultSearchDates()

function normalizeHotel(hotel) {
  return {
    hotelId: hotel.hotelId ?? hotel.id ?? hotel.hotel_id,
    hotelName: hotel.hotelName ?? hotel.name ?? hotel.hotel_name ?? 'Hotel',
    city: hotel.city ?? '-',
    address: hotel.address ?? '-',
    lowestPricePerNight: Number(
      hotel.lowestPricePerNight ?? hotel.lowest_price_per_night ?? hotel.pricePerNight ?? 0,
    ),
  }
}

function SearchPage() {
  const [form, setForm] = useState({
    city: '',
    checkInDate: initialDates.checkInDate,
    checkOutDate: initialDates.checkOutDate,
    guests: 2,
  })
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onSearch = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await searchHotels(form)
      const payload = response?.data || response || {}
      const rawItems = payload.items || payload.hotels || payload.results || []
      setItems(Array.isArray(rawItems) ? rawItems.map(normalizeHotel) : [])
    } catch (err) {
      setItems([])
      setError(err.message || 'Gagal mencari hotel')
    } finally {
      setLoading(false)
    }
  }

  const searchParams = new URLSearchParams({
    checkInDate: form.checkInDate,
    checkOutDate: form.checkOutDate,
    guests: form.guests,
  }).toString()

  return (
    <section>
      <h1>Search Hotel</h1>
      <p className="page-description">Cari hotel berdasarkan kota, tanggal, dan jumlah tamu.</p>

      <form onSubmit={onSearch} className="card form-grid">
        <label>
          Kota
          <input
            type="text"
            name="city"
            placeholder="Contoh : Bali"
            value={form.city}
            onChange={onChange}
            required
          />
        </label>

        <label>
          Check-in
          <input type="date" name="checkInDate" value={form.checkInDate} onChange={onChange} required />
        </label>

        <label>
          Check-out
          <input type="date" name="checkOutDate" value={form.checkOutDate} onChange={onChange} required />
        </label>

        <label>
          Guests
          <input
            type="number"
            min="1"
            name="guests"
            value={form.guests}
            onChange={onChange}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error ? <p className="error-box">{error}</p> : null}

      <div className="result-list">
        {items.map((hotel) => (
          <article key={hotel.hotelId} className="card result-item">
            <div>
              <h3>{hotel.hotelName}</h3>
              <p>{hotel.city}</p>
              <p>{hotel.address}</p>
            </div>
            <div className="result-meta">
              <strong>{formatCurrency(hotel.lowestPricePerNight)} / malam</strong>
              <Link className="button-link" to={`/hotels/${hotel.hotelId}?${searchParams}`}>
                Lihat Detail
              </Link>
            </div>
          </article>
        ))}
      </div>

      {!loading && !error && items.length === 0 ? <p className="muted">Belum ada hasil pencarian.</p> : null}
    </section>
  )
}

export default SearchPage


