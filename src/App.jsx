import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import SearchPage from './pages/SearchPage.jsx'
import HotelDetailPage from './pages/HotelDetailPage.jsx'
import AdminPage from './pages/AdminPage.jsx'

function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          {isAdminRoute ? (
            <>
              <div className="brand">Admin Dashboard</div>
              <nav className="nav-links">
                <Link to="/">Back to Search</Link>
              </nav>
            </>
          ) : (
            <>
              <Link to="/" className="brand">
                OTA Mini Booking
              </Link>
              <nav className="nav-links">
                <Link to="/">Search Hotel</Link>
              </nav>
            </>
          )}
        </div>
      </header>
      <main className="page-container">
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/hotels/:hotelId" element={<HotelDetailPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
