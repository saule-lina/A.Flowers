import { useCallback, useEffect, useMemo, useState } from 'react'
import { siteConfig } from '../../content/site.config'
import { budgets, finderSteps, occasions, palettes, recipients } from '../../content/finder'
import type { Bouquet } from '../../content/types'
import { hasSelection, labelOf, matchBouquets, readStateFromUrl, writeStateToUrl, type FinderState } from '../../lib/finder'
import { track } from '../../lib/analytics'
import { formatPriceFrom } from '../../lib/format'
import { SectionHead } from '../layout/SectionHead'
import { Picture } from '../ui/Picture'
import { OrderButtons } from '../order/OrderButtons'
import { ArrowIcon } from '../ui/Icons'
import styles from './Finder.module.css'

type Props = { onOpenBouquet: (b: Bouquet) => void }

type Step = 0 | 1 | 2 | 3 // 3 = результаты

export function Finder({ onOpenBouquet }: Props) {
  const [state, setState] = useState<FinderState>(() => readStateFromUrl())
  const [step, setStep] = useState<Step>(() => {
    const s = readStateFromUrl()
    return s.budget ? 3 : s.recipient ? 2 : s.occasion ? 1 : 0
  })
  const [animKey, setAnimKey] = useState(0)

  const goTo = useCallback((next: Step) => {
    setStep(next)
    setAnimKey((k) => k + 1)
  }, [])

  useEffect(() => {
    writeStateToUrl(state)
  }, [state])

  useEffect(() => {
    if (step === 3 && hasSelection(state)) {
      track(siteConfig.analytics.goals.finderComplete, state)
    }
  }, [step, state])

  const result = useMemo(() => matchBouquets(state), [state])

  const pick = <K extends keyof FinderState>(key: K, value: FinderState[K], next?: Step) => {
    setState((s) => ({ ...s, [key]: s[key] === value ? undefined : value }))
    if (next !== undefined) goTo(next)
  }

  const reset = () => {
    setState({})
    goTo(0)
  }

  const ctxFor = (b: Bouquet) => ({
    bouquetName: b.name,
    priceFrom: b.priceFrom,
    occasionLabel: labelOf.occasion(state.occasion),
    recipientLabel: labelOf.recipient(state.recipient),
  })

  const f = siteConfig.finder
  const current = step < 3 ? finderSteps[step as 0 | 1 | 2] : null
  const summary = [labelOf.occasion(state.occasion), labelOf.recipient(state.recipient), labelOf.budget(state.budget), labelOf.palette(state.palette)]
    .filter(Boolean)
    .join(' · ')

  return (
    <section id="finder" className={`theme-cream ${styles.section}`} aria-labelledby="finder-title">
      <div className="container">
        <SectionHead numeral="II" caption={f.caption} title={f.title} intro={f.intro} />

        <div className={styles.panel}>
          {/* индикатор шагов */}
          <ol className={styles.steps} aria-label="Шаги подбора">
            {finderSteps.map((s, i) => (
              <li key={s.id} className={`${styles.step} ${step === i ? styles.active : ''} ${step > i ? styles.done : ''}`}>
                <button type="button" onClick={() => goTo(i as Step)} aria-current={step === i ? 'step' : undefined}>
                  <span className={styles.stepNum}>{s.numeral}</span>
                  <span>{s.title}</span>
                </button>
              </li>
            ))}
            <li className={`${styles.step} ${step === 3 ? styles.active : ''}`}>
              <button type="button" onClick={() => goTo(3)} aria-current={step === 3 ? 'step' : undefined}>
                <span className={styles.stepNum}>→</span>
                <span>Результат</span>
              </button>
            </li>
          </ol>

          <div key={animKey} className={styles.stage}>
            {current && (
              <fieldset className={styles.fieldset}>
                <legend className={styles.question}>{current.question}</legend>
                <div className={styles.options} role="group">
                  {step === 0 &&
                    occasions.map((o) => (
                      <button key={o.id} type="button" className="chip" aria-pressed={state.occasion === o.id} onClick={() => pick('occasion', o.id, 1)}>
                        {o.label}
                      </button>
                    ))}
                  {step === 1 &&
                    recipients.map((o) => (
                      <button key={o.id} type="button" className="chip" aria-pressed={state.recipient === o.id} onClick={() => pick('recipient', o.id, 2)}>
                        {o.label}
                      </button>
                    ))}
                  {step === 2 &&
                    budgets.map((o) => (
                      <button key={o.id} type="button" className="chip" aria-pressed={state.budget === o.id} onClick={() => pick('budget', o.id)}>
                        {o.label}
                      </button>
                    ))}
                </div>
                {step === 2 && (
                  <div className={styles.extra}>
                    <p className={styles.extraLabel}>Гамма (необязательно)</p>
                    <div className={styles.options} role="group" aria-label="Цветовая гамма">
                      {palettes.map((o) => (
                        <button key={o.id} type="button" className="chip" aria-pressed={state.palette === o.id} onClick={() => pick('palette', o.id)}>
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className={styles.nav}>
                  {step > 0 && (
                    <button type="button" className={styles.link} onClick={() => goTo((step - 1) as Step)}>
                      ← Назад
                    </button>
                  )}
                  <button type="button" className={`btn btn--ink ${styles.next}`} onClick={() => goTo(step === 2 ? 3 : ((step + 1) as Step))}>
                    {step === 2 ? 'Показать подборку' : 'Дальше'}
                    <ArrowIcon />
                  </button>
                  <button type="button" className={styles.link} onClick={() => goTo(3)}>
                    Сразу к результатам
                  </button>
                </div>
              </fieldset>
            )}

            {step === 3 && (
              <div className={styles.results}>
                <div className={styles.resultsHead}>
                  <p className={styles.summary}>{summary || 'Без уточнений — наша подборка на сегодня'}</p>
                  <button type="button" className={styles.link} onClick={reset}>
                    Начать заново
                  </button>
                </div>

                {hasSelection(state) && result.exactCount === 0 && (
                  <div className={styles.noMatch}>
                    <h3>{f.noExactMatch}</h3>
                    <p>{f.noExactMatchNote}</p>
                    <OrderButtons theme="cream" primaryOnly primaryLabel="Написать в Telegram" ctx={{ occasionLabel: labelOf.occasion(state.occasion), recipientLabel: labelOf.recipient(state.recipient) }} />
                  </div>
                )}
                {hasSelection(state) && result.exactCount > 0 && result.exactCount < 3 && <p className={styles.note}>{f.fewMatchesNote}</p>}

                <ul className={styles.list}>
                  {result.results.map((b) => (
                    <li key={b.id} className={styles.item}>
                      <button type="button" className={styles.itemPhoto} onClick={() => onOpenBouquet(b)} aria-label={`Открыть композицию «${b.name}»`}>
                        <Picture name={b.images[0] ? `bouquets/${b.images[0]}` : null} alt={`Композиция «${b.name}»`} placeholderTitle={b.name} sizes="(max-width: 767px) 92vw, 30vw" />
                      </button>
                      <div className={styles.itemBody}>
                        <div className={styles.itemTop}>
                          <h3 className={styles.itemName}>
                            <button type="button" onClick={() => onOpenBouquet(b)}>
                              {b.name}
                            </button>
                          </h3>
                          <span className={styles.price}>{formatPriceFrom(b.priceFrom)}</span>
                        </div>
                        <p className={styles.composition}>{b.composition.join(', ')}</p>
                        <p className={styles.why}>
                          <span className={styles.whyLabel}>Почему подходит</span>
                          {b.why}
                        </p>
                        {!b.exact && hasSelection(state) && <p className={styles.near}>ближайший вариант</p>}
                        <OrderButtons theme="cream" size="s" ctx={ctxFor(b)} primaryLabel="Заказать" className={styles.itemButtons} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
