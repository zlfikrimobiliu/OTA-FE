export function formatCurrency(value) {
  const amount = Number(value || 0)
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function calculateNights(checkInDate, checkOutDate) {
  if (!checkInDate || !checkOutDate) return 0
  const start = new Date(checkInDate)
  const end = new Date(checkOutDate)
  const diffMs = end.getTime() - start.getTime()
  return diffMs > 0 ? Math.ceil(diffMs / (1000 * 60 * 60 * 24)) : 0
}

export function defaultSearchDates() {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const toISODate = (date) => date.toISOString().split('T')[0]

  return {
    checkInDate: toISODate(today),
    checkOutDate: toISODate(tomorrow),
  }
}


