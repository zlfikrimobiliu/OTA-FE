import { useState } from 'react'
import { createHotel, createRoom, getAdminBookings, updateRoomPrice } from '../lib/api.js'

function formatThousandInput(value) {
  const digitsOnly = String(value || '').replace(/\D/g, '')
  if (!digitsOnly) return ''
  return new Intl.NumberFormat('id-ID').format(Number(digitsOnly))
}

function parseThousandInput(value) {
  const digitsOnly = String(value || '').replace(/\D/g, '')
  return digitsOnly ? Number(digitsOnly) : 0
}

function AdminPage() {
  const [hotelForm, setHotelForm] = useState({
    name: '',
    city: '',
    address: '',
    description: '',
  })
  const [roomForm, setRoomForm] = useState({
    hotelId: '',
    name: '',
    capacity: 2,
    pricePerNight: '',
    totalRooms: 1,
  })
  const [priceForm, setPriceForm] = useState({
    roomId: '',
    pricePerNight: '',
  })

  const [bookings, setBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [adminMessage, setAdminMessage] = useState('')
  const [adminError, setAdminError] = useState('')

  const handleHotelSubmit = async (event) => {
    event.preventDefault()
    setAdminError('')
    setAdminMessage('')

    try {
      const response = await createHotel(hotelForm)
      const hotelId = response?.data?.hotelId
      setAdminMessage(`Hotel berhasil dibuat${hotelId ? ` (ID: ${hotelId})` : ''}`)
      setHotelForm({ name: '', city: '', address: '', description: '' })
    } catch (err) {
      setAdminError(err.message || 'Gagal membuat hotel')
    }
  }

  const handleRoomSubmit = async (event) => {
    event.preventDefault()
    setAdminError('')
    setAdminMessage('')

    try {
      const payload = {
        ...roomForm,
        hotelId: Number(roomForm.hotelId),
        capacity: Number(roomForm.capacity),
        pricePerNight: parseThousandInput(roomForm.pricePerNight),
        totalRooms: Number(roomForm.totalRooms),
      }
      const response = await createRoom(payload)
      const roomId = response?.data?.roomId
      setAdminMessage(`Room berhasil dibuat${roomId ? ` (ID: ${roomId})` : ''}`)
    } catch (err) {
      setAdminError(err.message || 'Gagal membuat room')
    }
  }

  const handlePriceSubmit = async (event) => {
    event.preventDefault()
    setAdminError('')
    setAdminMessage('')

    try {
      await updateRoomPrice(Number(priceForm.roomId), parseThousandInput(priceForm.pricePerNight))
      setAdminMessage('Harga room berhasil diupdate')
    } catch (err) {
      setAdminError(err.message || 'Gagal update harga room')
    }
  }

  const fetchBookings = async () => {
    setLoadingBookings(true)
    setAdminError('')

    try {
      const response = await getAdminBookings({ page: 1, limit: 20 })
      setBookings(response?.data?.items || [])
    } catch (err) {
      setAdminError(err.message || 'Gagal load bookings')
      setBookings([])
    } finally {
      setLoadingBookings(false)
    }
  }

  return (
    <section>
      <h1>Kelola Hotel & Booking</h1>
      <p className="page-description">Buat hotel, atur kamar, update harga, dan monitor booking.</p>

      {adminMessage ? <p className="success-box">{adminMessage}</p> : null}
      {adminError ? <p className="error-box">{adminError}</p> : null}

      <div className="admin-grid">
        <form onSubmit={handleHotelSubmit} className="card form-grid">
          <h3>Create Hotel</h3>
          <label>
            Name
            <input
              value={hotelForm.name}
              onChange={(event) => setHotelForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
          </label>
          <label>
            City
            <input
              value={hotelForm.city}
              onChange={(event) => setHotelForm((prev) => ({ ...prev, city: event.target.value }))}
              required
            />
          </label>
          <label>
            Address
            <input
              value={hotelForm.address}
              onChange={(event) => setHotelForm((prev) => ({ ...prev, address: event.target.value }))}
              required
            />
          </label>
          <label>
            Description
            <textarea
              rows={3}
              value={hotelForm.description}
              onChange={(event) => setHotelForm((prev) => ({ ...prev, description: event.target.value }))}
            />
          </label>
          <button type="submit">Create Hotel</button>
        </form>

        <form onSubmit={handleRoomSubmit} className="card form-grid">
          <h3>Create Room</h3>
          <label>
            Hotel ID
            <input
              type="number"
              min="1"
              value={roomForm.hotelId}
              onChange={(event) => setRoomForm((prev) => ({ ...prev, hotelId: event.target.value }))}
              required
            />
          </label>
          <label>
            Room Name
            <input
              value={roomForm.name}
              onChange={(event) => setRoomForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
          </label>
          <label>
            Capacity
            <input
              type="number"
              min="1"
              value={roomForm.capacity}
              onChange={(event) => setRoomForm((prev) => ({ ...prev, capacity: event.target.value }))}
              required
            />
          </label>
          <label>
            Price Per Night
            <input
              type="text"
              inputMode="numeric"
              value={roomForm.pricePerNight}
              onChange={(event) =>
                setRoomForm((prev) => ({
                  ...prev,
                  pricePerNight: formatThousandInput(event.target.value),
                }))
              }
              required
            />
          </label>
          <label>
            Total Rooms
            <input
              type="number"
              min="1"
              value={roomForm.totalRooms}
              onChange={(event) => setRoomForm((prev) => ({ ...prev, totalRooms: event.target.value }))}
              required
            />
          </label>
          <button type="submit">Create Room</button>
        </form>

        <form onSubmit={handlePriceSubmit} className="card form-grid">
          <h3>Set Room Price</h3>
          <label>
            Room ID
            <input
              type="number"
              min="1"
              value={priceForm.roomId}
              onChange={(event) => setPriceForm((prev) => ({ ...prev, roomId: event.target.value }))}
              required
            />
          </label>
          <label>
            New Price Per Night
            <input
              type="text"
              inputMode="numeric"
              value={priceForm.pricePerNight}
              onChange={(event) =>
                setPriceForm((prev) => ({
                  ...prev,
                  pricePerNight: formatThousandInput(event.target.value),
                }))
              }
              required
            />
          </label>
          <button type="submit">Update Price</button>
        </form>

        <section className="card">
          <div className="inline-actions">
            <h3>All Bookings</h3>
            <button type="button" onClick={fetchBookings} disabled={loadingBookings}>
              {loadingBookings ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Hotel</th>
                  <th>Room</th>
                  <th>Guest</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.bookingReference || booking.id}>
                    <td>{booking.bookingReference || '-'}</td>
                    <td>{booking.hotelId || '-'}</td>
                    <td>{booking.roomId || '-'}</td>
                    <td>{booking.fullName || '-'}</td>
                    <td>{booking.email || '-'}</td>
                    <td>{booking.status || '-'}</td>
                  </tr>
                ))}
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="muted center-text">
                      Belum ada data booking.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </section>
  )
}

export default AdminPage


