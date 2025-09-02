export const sanitizeInventoryName = (key: string, id?: string) => {
  return (
    key
      .trim()
      .toLowerCase()
      .normalize('NFD') // elimina tildes
      .replace(/\p{Diacritic}/gu, '') // requiere soporte unicode
      .replace(/\s+/g, '_') // espacios -> guion bajo
      .replace(/[^a-z0-9_]/g, '') // elimina caracteres no válidos
      .slice(0, 30) + (id ? `_${id}` : '')
  )
}
