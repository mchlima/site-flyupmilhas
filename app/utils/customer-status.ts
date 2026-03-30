export const CUSTOMER_STATUSES = [
  { value: 'lead', label: 'Lead', color: 'neutral' },
  { value: 'qualified', label: 'Qualificado', color: 'info' },
  { value: 'paid', label: 'Pago', color: 'success' },
  { value: 'in-mentoring', label: 'Em mentoria', color: 'primary' },
  { value: 'completed', label: 'Finalizado', color: 'success' },
  { value: 'cancelled', label: 'Cancelado', color: 'error' },
] as const

export function getStatusLabel(value: string): string {
  return CUSTOMER_STATUSES.find(s => s.value === value)?.label || value
}

export function getStatusColor(value: string): string {
  return CUSTOMER_STATUSES.find(s => s.value === value)?.color || 'neutral'
}
