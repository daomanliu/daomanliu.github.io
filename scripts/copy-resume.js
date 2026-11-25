// 把 resume/dist 复制进 dist/resume，让 GitHub Pages 部署后地址是 /resume/
// 根目录 package.json 的 postbuild 会自动调用它；resume 没构建过就安静跳过。
import { cp } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const src = path.join(projectRoot, 'resume', 'dist')
const dest = path.join(projectRoot, 'dist', 'resume')

if (!existsSync(src)) {
  console.warn('[copy-resume] 没找到 resume/dist，跳过（需要时先跑 npm run resume:build）')
  process.exit(0)
}

if (!existsSync(path.join(projectRoot, 'dist'))) {
  console.warn('[copy-resume] 没找到 dist/，跳过（请先跑 vite build）')
  process.exit(0)
}

await cp(src, dest, { recursive: true })
console.log('[copy-resume] resume/dist → dist/resume 完成')
