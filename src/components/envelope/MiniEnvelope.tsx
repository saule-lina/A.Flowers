import { Seal } from './Seal'
import styles from './MiniEnvelope.module.css'

/** Маленький закрытый конверт с печатью — мотив для финального блока */
export function MiniEnvelope() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.body}>
        <div className={`${styles.face} ${styles.l}`} />
        <div className={`${styles.face} ${styles.r}`} />
        <div className={`${styles.face} ${styles.b}`} />
        <div className={`${styles.face} ${styles.flap}`} />
      </div>
      <div className={styles.seal}>
        <Seal id="mini-seal" />
      </div>
    </div>
  )
}
