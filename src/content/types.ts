export type OccasionId =
  | 'birthday'
  | 'romance'
  | 'apology'
  | 'gratitude'
  | 'anniversary'
  | 'newborn'
  | 'wedding'
  | 'corporate'
  | 'march8'
  | 'justbecause'
  | 'condolence'

export type RecipientId = 'her' | 'him' | 'mom' | 'colleague' | 'home' | 'any'

export type BudgetId = 'lt10' | '10-20' | '20-35' | '35plus'

export type PaletteId = 'white' | 'pink' | 'red' | 'bright' | 'green'

export type Bouquet = {
  id: string
  /** Благородное название композиции */
  name: string
  /** Базовые имена фото в public/images/bouquets/ (без размера и расширения).
   *  Пустой массив = показать элегантную заглушку «фото скоро». */
  images: string[]
  /** Состав: «пионовидные розы», «маттиола», «эвкалипт» */
  composition: string[]
  /** Цена «от», ₽ */
  priceFrom: number
  size: 'S' | 'M' | 'L' | 'XL'
  occasions: OccasionId[]
  recipients: RecipientId[]
  palette: PaletteId
  /** Одна фраза: почему подходит */
  why: string
  /** Если цветы сезонные */
  season?: string
  /** Какие виды цветов входят (id из flowers.ts) — для фильтра галереи */
  flowerIds: string[]
  /** Демо-контент: заменить на реальные работы студии */
  draft: true
}

export type Flower = {
  id: string
  name: string
  /** Базовое имя фото в public/images/flowers/ или null — заглушка */
  image: string | null
  description: string
  season: string
  /** Символика / для какого повода подходит */
  meaning: string
  draft: true
}
