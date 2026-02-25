import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { createBooking, getHotelDetail } from '../lib/api.js'
import { calculateNights, defaultSearchDates, formatCurrency } from '../utils/format.js'

function normalizeRoom(room) {
  return {
    roomId: room.roomId ?? room.id ?? room.room_id,
    name: room.name ?? room.roomName ?? room.room_name ?? 'Room',
    capacity: Number(room.capacity ?? room.maxGuests ?? room.max_guests ?? 0),
    pricePerNight: Number(room.pricePerNight ?? room.price_per_night ?? room.price ?? 0),
    totalNights: Number(room.totalNights ?? room.total_nights ?? 0),
    totalPrice: Number(room.totalPrice ?? room.total_price ?? 0),
  }
}

function HotelDetailPage() {
  const { hotelId } = useParams()
  const [searchParams] = useSearchParams()
  const fallbackDates = defaultSearchDates()

  const checkInDate = searchParams.get('checkInDate') || fallbackDates.checkInDate
  const checkOutDate = searchParams.get('checkOutDate') || fallbackDates.checkOutDate
  const guests = searchParams.get('guests') || '1'

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hotel, setHotel] = useState(null)
  const [rooms, setRooms] = useState([])
  const [selectedRoomId, setSelectedRoomId] = useState('')
  const [bookingForm, setBookingForm] = useState({
    fullName: '',
    email: '',
  })
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingMessage, setBookingMessage] = useState('')
  const [bookingError, setBookingError] = useState('')

  const totalNights = useMemo(() => calculateNights(checkInDate, checkOutDate), [checkInDate, checkOutDate])

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true)
      setError('')

      try {
        const response = await getHotelDetail(hotelId, { checkInDate, checkOutDate, guests })
        const payload = response?.data || response || {}
        const rawHotel = payload.hotel || payload.hotelDetail || payload.item || null
        const rawRooms =
          payload.availableRooms || payload.available_rooms || payload.rooms || payload.roomList || []

        setHotel(rawHotel)
        setRooms(Array.isArray(rawRooms) ? rawRooms.map(normalizeRoom) : [])
      } catch (err) {
        setError(err.message || 'Gagal memuat detail hotel')
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [hotelId, checkInDate, checkOutDate, guests])

  const selectedRoom = rooms.find((room) => String(room.roomId) === String(selectedRoomId))

  const submitBooking = async (event) => {
    event.preventDefault()
    if (!selectedRoom) {
      setBookingError('Pilih kamar terlebih dahulu')
      return
    }

    setBookingLoading(true)
    setBookingError('')
    setBookingMessage('')

    try {
      const payload = {
        hotelId: Number(hotelId),
        roomId: selectedRoom.roomId,
        checkInDate,
        checkOutDate,
        guests: Number(guests),
        fullName: bookingForm.fullName,
        email: bookingForm.email,
      }

      const response = await createBooking(payload)
      const reference = response?.data?.bookingReference || '-'
      setBookingMessage(`Booking berhasil. Reference: ${reference}`)
    } catch (err) {
      setBookingError(err.message || 'Booking gagal')
    } finally {
      setBookingLoading(false)
    }
  }

  return (
    <section>
      <Link to="/" className="link-back">
        ← Kembali ke pencarian
      </Link>

      <h1>Hotel Detail</h1>
      <p className="page-description">
        {checkInDate} - {checkOutDate} ({totalNights} malam), {guests} tamu
      </p>

      {loading ? <p>Loading detail hotel...</p> : null}
      {error ? <p className="error-box">{error}</p> : null}

      {hotel ? (
        <article className="card">
          <h2>{hotel.name}</h2>
          <p>{hotel.city}</p>
          <p>{hotel.address}</p>
          <p>{hotel.description || '-'}</p>
        </article>
      ) : null}

      <h3 className="section-title">Available Rooms</h3>
      <div className="result-list">
        {rooms.map((room) => {
          const price = Number(room.pricePerNight || room.price_per_night || 0)
          const roomNights = Number(room.totalNights || totalNights)
          const roomTotalPrice = Number(room.totalPrice || price * roomNights)

          return (
            <article key={room.roomId} className="card result-item">
              <div>
                <h4>{room.name}</h4>
                <p>Kapasitas: {room.capacity} tamu</p>
                <p>Harga / malam: {formatCurrency(price)}</p>
                <p>Total {roomNights} malam: {formatCurrency(roomTotalPrice)}</p>
              </div>
              <button type="button" onClick={() => setSelectedRoomId(String(room.roomId))}>
                Pilih Kamar
              </button>
            </article>
          )
        })}
      </div>

      {!loading && rooms.length === 0 ? (
        <p className="muted">Tidak ada kamar available untuk tanggal/jumlah tamu yang dipilih.</p>
      ) : null}

      <h3 className="section-title">Booking Form</h3>
      <form onSubmit={submitBooking} className="card form-grid">
        <label>
          Kamar Dipilih
          <input type="text" readOnly value={selectedRoom ? selectedRoom.name : 'Belum dipilih'} />
        </label>

        <label>
          Full Name
          <input
            type="text"
            value={bookingForm.fullName}
            onChange={(event) => setBookingForm((prev) => ({ ...prev, fullName: event.target.value }))}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={bookingForm.email}
            onChange={(event) => setBookingForm((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
        </label>

        <button type="submit" disabled={bookingLoading}>
          {bookingLoading ? 'Memproses...' : 'Confirm Booking'}
        </button>
      </form>

      {bookingMessage ? <p className="success-box">{bookingMessage}</p> : null}
      {bookingError ? <p className="error-box">{bookingError}</p> : null}
    </section>
  )
}

export default HotelDetailPage


