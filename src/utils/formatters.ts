export const formatCurrency = (amount: number, currency: 'BRL' | 'USD' | 'EUR' = 'BRL'): string => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'R$ 0,00'
  }

  const localeMap: Record<string, string> = {
    BRL: 'pt-BR',
    USD: 'en-US',
    EUR: 'de-DE',
  }

  const locale = localeMap[currency] || 'pt-BR'

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `R$ ${amount.toFixed(2).replace('.', ',')}`
  }
}

/**
 * Formats YYYY-MM-DD to DD/MM/AAAA reliably avoiding timezone offset shifts
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  
  // If in YYYY-MM-DD format
  const parts = dateString.split('T')[0].split('-')
  if (parts.length === 3) {
    const [year, month, day] = parts
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
  }

  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/**
 * Formats to short month name and year (e.g., "Out 2026")
 */
export const formatShortMonth = (dateString: string): string => {
  if (!dateString) return ''
  const parts = dateString.split('-')
  if (parts.length >= 2) {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    const monthIndex = parseInt(parts[1], 10) - 1
    const monthName = months[monthIndex] || parts[1]
    return `${monthName}/${parts[0].slice(2)}`
  }
  return dateString
}

/**
 * Formats to full month and year (e.g., "Outubro de 2026")
 */
export const formatMonthYear = (yearMonthStr: string): string => {
  const parts = yearMonthStr.split('-')
  if (parts.length >= 2) {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]
    const monthIndex = parseInt(parts[1], 10) - 1
    const monthName = months[monthIndex] || parts[1]
    return `${monthName} de ${parts[0]}`
  }
  return yearMonthStr
}

/**
 * Formats a percentage change like +15.4% or -3.2%
 */
export const formatPercent = (val: number): string => {
  if (isNaN(val) || !isFinite(val)) return '0%'
  const prefix = val > 0 ? '+' : ''
  return `${prefix}${val.toFixed(1).replace('.', ',')}%`
}

/**
 * Parse string with Brazilian currency format (1.250,50) to float number
 */
export const parseBrazilianNumber = (input: string | number): number => {
  if (typeof input === 'number') return input
  if (!input) return 0

  // Remove R$, spaces, then replace dots (thousands) and comma (decimal)
  const cleaned = input
    .replace(/[R$\s]/g, '')
    .replace(/\./g, '')
    .replace(',', '.')

  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}
