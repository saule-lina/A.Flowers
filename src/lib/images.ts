/** Путь к оптимизированному изображению: («bouquets/bordeaux-1», 960) → /images/bouquets/bordeaux-1-960.webp */
export const imageSrc = (name: string, w: number): string => `/images/${name}-${w}.webp`
