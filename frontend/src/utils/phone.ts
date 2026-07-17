export function normalizeAndFormatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)

  if (digits.length === 0) return ''
  if (digits.length < 3) return `(${digits}`

  const areaCode = digits.slice(0, 2)
  const localNumber = digits.slice(2)
  const prefixLength = digits.length === 11 ? 5 : 4
  const prefix = localNumber.slice(0, prefixLength)
  const suffix = localNumber.slice(prefixLength)

  return `(${areaCode}) ${prefix}${suffix ? `-${suffix}` : ''}`
}
