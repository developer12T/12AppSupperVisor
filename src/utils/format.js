export function formatDateToYYYYMMDD (date) {
  if (!(date instanceof Date)) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

export function formatCurrency (value) {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value || 0)
}

export function formatDate (dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}-${month}-${year}`
}

export function toDateOrNull (val) {
  if (!val) return null
  const d = new Date(val)
  return isNaN(d.getTime()) ? null : d
}

// make end-of-day inclusive for comparisons
export function endOfDay (d) {
  const x = new Date(d)
  x.setHours(23, 59, 59, 999)
  return x
}
export function getTeam3 (area = '') {
  const firstTwo = area.substring(0, 2) // index 0–1
  const thirdChar = area.substring(3, 4) // index 3
  return firstTwo + thirdChar
}

export function formatNumber(num) {
  return num.toLocaleString('en-US')
}

