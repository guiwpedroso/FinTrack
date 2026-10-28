import { Transaction } from '@/types'
import { formatDate } from './formatters'

export const exportTransactionsToCSV = (transactions: Transaction[], filename: string = 'fintrack-transacoes.csv') => {
  if (!transactions || transactions.length === 0) {
    alert('Nenhuma transação disponível para exportar.')
    return
  }

  const headers = ['Data', 'Título', 'Tipo', 'Categoria', 'Valor (R$)', 'Descrição']
  
  const rows = transactions.map(t => {
    const typeLabel = t.type === 'income' ? 'Receita' : 'Despesa'
    const formattedDate = formatDate(t.date)
    const formattedAmount = t.amount.toFixed(2).replace('.', ',')
    const description = (t.description || '').replace(/"/g, '""')
    const title = (t.title || '').replace(/"/g, '""')
    const category = (t.category || '').replace(/"/g, '""')

    return [
      `"${formattedDate}"`,
      `"${title}"`,
      `"${typeLabel}"`,
      `"${category}"`,
      `"${formattedAmount}"`,
      `"${description}"`,
    ].join(';')
  })

  // Prepend UTF-8 BOM (\uFEFF) for proper Excel character encoding
  const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
