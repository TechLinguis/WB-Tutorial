/**
 * 按源文件绝对路径提取 git 贡献信息（同步，构建期调用）。
 *
 * 返回结构：
 *   {
 *     last: { name, email, date } | null,   // 最后修改人（最近一次提交作者）
 *     contributors: [{ name, email }],        // 去重后的全部贡献者（含 Co-Authored-By）
 *     count: number
 *   }
 * 文件未被 git 跟踪 / git 不可用时返回 null。
 *
 * 注意：通过 `git -C <文件所在目录>` 执行，git 会自动向上查找 .git，
 * 因此无需关心仓库根目录位置。
 */
import { execSync } from 'node:child_process'
import path from 'node:path'

// 将 Windows 反斜杠路径转为正斜杠，避免 shell 转义问题
const toPosix = (p) => p.replace(/\\/g, '/')

export function getGitInfo(absFile) {
  if (!absFile) return null

  const dir = toPosix(path.dirname(absFile))
  const file = toPosix(absFile)

  const git = (args) => {
    try {
      return execSync(`git -C "${dir}" log ${args} -- "${file}"`, {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      })
    } catch {
      // 文件未跟踪 / 无提交历史 / git 不可用 → 返回空
      return ''
    }
  }

  // 最后修改人
  const lastRaw = git('-1 --pretty=format:%an|%ae|%aI').trim()
  let last = null
  if (lastRaw) {
    const [name, email, date] = lastRaw.split('|')
    last = { name, email, date }
  }

  // 贡献者：提交作者去重
  const authorsRaw = git('--pretty=format:%an|%ae')
  const map = new Map()
  for (const line of authorsRaw.split('\n')) {
    if (!line.trim()) continue
    const [name, email] = line.split('|')
    if (email && !map.has(email)) map.set(email, { name, email })
  }

  // 协作人：提交正文里的 Co-Authored-By: Name <email>
  const bodies = git('--pretty=format:%b')
  const re = /Co-Authored-By:\s*(.+?)\s*<(.+?)>/g
  let m
  while ((m = re.exec(bodies))) {
    const email = m[2].trim()
    if (!map.has(email)) map.set(email, { name: m[1].trim(), email })
  }

  const contributors = [...map.values()]
  return { last, contributors, count: contributors.length }
}
