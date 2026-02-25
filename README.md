# OTA Mini Booking Frontend By : Fikri Mobiliu

Frontend untuk technical assignment mini hotel booking engine.

## Stack

- React + Vite
- React Router
- Fetch API

## Fitur

- Search hotel by city, date, guests
- Hotel detail + list available rooms
- Booking form (full name + email) dan tampilkan booking reference
- Admin basic:
  - Create hotel
  - Create room
  - Set room price
  - View all bookings

## Setup

1. Install dependencies:

```bash
npm install
```

2. Set environment:

Salin value `VITE_API_BASE_URL` dari file `env.example` ke file `.env`.

3. Jalankan dev server:

```bash
npm run dev
```

## Environment

- `VITE_API_BASE_URL`: base URL backend API.
- Default fallback di app: `http://localhost:3000/api/v1`

Contoh:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

## Route Frontend

- `/` - search page
- `/hotels/:hotelId` - detail + booking
- `/admin` - admin dashboard
