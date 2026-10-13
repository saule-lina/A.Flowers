import type { BudgetId, OccasionId, PaletteId, RecipientId } from './types'

/** Варианты ответов в подборе композиции. Порядок = порядок на экране. */
export const occasions: { id: OccasionId; label: string }[] = [
  { id: 'birthday', label: 'День рождения' },
  { id: 'romance', label: 'Свидание / романтика' },
  { id: 'apology', label: 'Извинение' },
  { id: 'gratitude', label: 'Благодарность' },
  { id: 'anniversary', label: 'Юбилей' },
  { id: 'newborn', label: 'Рождение ребёнка' },
  { id: 'wedding', label: 'Свадьба' },
  { id: 'corporate', label: 'Корпоративный подарок' },
  { id: 'march8', label: '8 марта' },
  { id: 'justbecause', label: 'Просто так' },
  { id: 'condolence', label: 'Соболезнование' },
]

export const recipients: { id: RecipientId; label: string }[] = [
  { id: 'her', label: 'Ей' },
  { id: 'him', label: 'Ему' },
  { id: 'mom', label: 'Маме' },
  { id: 'colleague', label: 'Коллеге / партнёру' },
  { id: 'home', label: 'Паре / в дом' },
  { id: 'any', label: 'Без уточнения' },
]

export const budgets: { id: BudgetId; label: string; min: number; max: number }[] = [
  { id: 'lt10', label: 'до 10 000 ₽', min: 0, max: 9999 },
  { id: '10-20', label: '10–20 000 ₽', min: 10000, max: 19999 },
  { id: '20-35', label: '20–35 000 ₽', min: 20000, max: 34999 },
  { id: '35plus', label: 'от 35 000 ₽', min: 35000, max: Infinity },
]

export const palettes: { id: PaletteId; label: string }[] = [
  { id: 'white', label: 'Белая и кремовая' },
  { id: 'pink', label: 'Нежно-розовая' },
  { id: 'red', label: 'Красная' },
  { id: 'bright', label: 'Яркая' },
  { id: 'green', label: 'Зелень и минимализм' },
]

export const finderSteps = [
  { id: 'occasion', numeral: 'I', title: 'Повод', question: 'По какому поводу букет?' },
  { id: 'recipient', numeral: 'II', title: 'Кому', question: 'Кому вы его дарите?' },
  { id: 'budget', numeral: 'III', title: 'Бюджет', question: 'На какой бюджет ориентируемся?' },
] as const
