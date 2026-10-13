import { bouquets } from '../content/bouquets'
import { budgets, occasions, palettes, recipients } from '../content/finder'
import type { Bouquet, BudgetId, OccasionId, PaletteId, RecipientId } from '../content/types'

export type FinderState = {
  occasion?: OccasionId
  recipient?: RecipientId
  budget?: BudgetId
  palette?: PaletteId
}

const PARAM = { occasion: 'occasion', recipient: 'for', budget: 'budget', palette: 'palette' } as const

const isId = <T extends { id: string }>(list: readonly T[], v: string | null): v is T['id'] =>
  v !== null && list.some((o) => o.id === v)

export function readStateFromUrl(search = window.location.search): FinderState {
  const p = new URLSearchParams(search)
  const state: FinderState = {}
  const o = p.get(PARAM.occasion)
  const r = p.get(PARAM.recipient)
  const b = p.get(PARAM.budget)
  const pal = p.get(PARAM.palette)
  if (isId(occasions, o)) state.occasion = o
  if (isId(recipients, r)) state.recipient = r
  if (isId(budgets, b)) state.budget = b
  if (isId(palettes, pal)) state.palette = pal
  return state
}

export function writeStateToUrl(state: FinderState): void {
  const url = new URL(window.location.href)
  const p = url.searchParams
  ;(Object.keys(PARAM) as (keyof FinderState)[]).forEach((key) => {
    const v = state[key]
    if (v) p.set(PARAM[key], v)
    else p.delete(PARAM[key])
  })
  window.history.replaceState(window.history.state, '', url.toString())
}

export const hasSelection = (s: FinderState): boolean => Boolean(s.occasion || s.recipient || s.budget || s.palette)

const budgetMatches = (b: Bouquet, id: BudgetId): boolean => {
  const range = budgets.find((x) => x.id === id)
  return !!range && b.priceFrom >= range.min && b.priceFrom <= range.max
}

/** Веса: повод важнее бюджета, бюджет важнее гаммы */
const WEIGHT = { occasion: 3, recipient: 2, budget: 1.5, palette: 1 }

export type FinderResult = {
  results: (Bouquet & { exact: boolean })[]
  exactCount: number
}

export function matchBouquets(state: FinderState, limit = 6): FinderResult {
  const scored = bouquets.map((b) => {
    let score = 0
    let exact = true
    if (state.occasion) {
      if (b.occasions.includes(state.occasion)) score += WEIGHT.occasion
      else exact = false
    }
    if (state.recipient) {
      const ok = b.recipients.includes(state.recipient) || (state.recipient === 'any' && true)
      if (ok) score += WEIGHT.recipient
      else exact = false
      // «ему» — композиции для мужчин получают дополнительный вес
      if (state.recipient === 'him' && b.recipients.includes('him')) score += 1
    }
    if (state.budget) {
      if (budgetMatches(b, state.budget)) score += WEIGHT.budget
      else {
        exact = false
        // соседний ценовой диапазон — частичный балл
        const idx = budgets.findIndex((x) => x.id === state.budget)
        const neighbours = [budgets[idx - 1], budgets[idx + 1]].filter(Boolean)
        if (neighbours.some((n) => budgetMatches(b, n.id))) score += WEIGHT.budget / 2
      }
    }
    if (state.palette) {
      if (b.palette === state.palette) score += WEIGHT.palette
      else exact = false
    }
    return { ...b, score, exact: exact && hasSelection(state) }
  })

  scored.sort((a, b) => b.score - a.score || a.priceFrom - b.priceFrom)
  const exact = scored.filter((b) => b.exact)
  const exactCount = exact.length
  let results = exact.slice(0, limit)
  if (results.length < 3) {
    const rest = scored.filter((b) => !b.exact)
    results = results.concat(rest.slice(0, Math.max(3, Math.min(limit, 4)) - results.length))
  }
  return { results, exactCount }
}

export const labelOf = {
  occasion: (id?: OccasionId) => occasions.find((o) => o.id === id)?.label,
  recipient: (id?: RecipientId) => recipients.find((o) => o.id === id)?.label,
  budget: (id?: BudgetId) => budgets.find((o) => o.id === id)?.label,
  palette: (id?: PaletteId) => palettes.find((o) => o.id === id)?.label,
}
