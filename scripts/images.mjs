// Генерация оптимизированных изображений: source-images/** -> public/images/**
// Запуск: npm run images
// Для каждого файла source-images/<группа>/<имя>.(jpg|jpeg|png|webp)
// создаются public/images/<группа>/<имя>-<ширина>.webp в нужных размерах
// с кадрированием под фиксированное соотношение сторон (4:5 для карточек).
import sharp from 'sharp'
import { readdir, mkdir, stat } from 'node:fs/promises'
import { join, extname, basename } from 'node:path'

const SRC = 'source-images'
const OUT = 'public/images'

// Настройки по группам: соотношение сторон и набор ширин
const GROUPS = {
  bouquets: { ratio: 4 / 5, widths: [480, 960, 1440] },
  flowers: { ratio: 4 / 5, widths: [480, 960] },
  about: { ratio: 4 / 5, widths: [480, 960, 1440] },
  wide: { ratio: 16 / 9, widths: [960, 1600, 2400] },
}

const exts = new Set(['.jpg', '.jpeg', '.png', '.webp'])

async function exists(p) {
  try { await stat(p); return true } catch { return false }
}

async function processGroup(group, cfg) {
  const dir = join(SRC, group)
  if (!(await exists(dir))) return
  await mkdir(join(OUT, group), { recursive: true })
  const files = (await readdir(dir)).filter((f) => exts.has(extname(f).toLowerCase()))
  for (const file of files) {
    const name = basename(file, extname(file))
    const input = sharp(join(dir, file)).rotate()
    for (const w of cfg.widths) {
      const h = Math.round(w / cfg.ratio)
      const out = join(OUT, group, `${name}-${w}.webp`)
      await input
        .clone()
        .resize(w, h, { fit: 'cover', position: 'attention' })
        // лёгкая «живописная» тонировка: чуть темнее и спокойнее по цвету
        .modulate({ brightness: 0.94, saturation: 0.86 })
        .webp({ quality: 78, effort: 5 })
        .toFile(out)
    }
    console.log(`✓ ${group}/${name}`)
  }
}

for (const [group, cfg] of Object.entries(GROUPS)) {
  await processGroup(group, cfg)
}
console.log('Готово: public/images обновлён')
