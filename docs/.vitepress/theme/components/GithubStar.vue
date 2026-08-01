<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const repo = 'TechLinguis/WB-Tutorial'
const repoUrl = `https://github.com/${repo}`

const stars = ref(null)
const forks = ref(null)

let timer = null

async function fetchStats() {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    })
    if (!res.ok) throw new Error(res.status)
    const data = await res.json()
    stars.value = typeof data.stargazers_count === 'number' ? data.stargazers_count : -1
    forks.value = typeof data.forks_count === 'number' ? data.forks_count : -1
  } catch {
    stars.value = -1
    forks.value = -1
  }
}

onMounted(() => {
  fetchStats()
  timer = setInterval(fetchStats, 5 * 60 * 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})

function format(n) {
  if (n === null || n === undefined || n < 0) return '-'
  if (n >= 1000) return parseFloat((n / 1000).toFixed(2)) + 'k'
  return String(n)
}
</script>

<template>
  <a
    class="md-source"
    :href="repoUrl"
    target="_blank"
    rel="noopener noreferrer"
    data-md-component="source"
    title="前往 GitHub 仓库"
  >
    <!-- GitHub 图标 -->
    <div class="md-source__icon md-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .321.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    </div>

    <!-- 仓库名（首行） + stats（第二行） -->
    <div class="md-source__repository">
      <span class="md-source__repository-name">{{ repo }}</span>
      <ul class="md-source__facts">
        <li class="md-source__fact md-source__fact--stars">
          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>
          {{ format(stars) }}
        </li>
        <li class="md-source__fact md-source__fact--forks">
          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/></svg>
          {{ format(forks) }}
        </li>
      </ul>
    </div>
  </a>
</template>

<style scoped>
.md-source {
  display: inline-flex;
  align-items: flex-start; /* 顶部对齐，适配两行布局 */
  font-size: 0.68rem;
  line-height: 1.4;
  color: var(--vp-c-text-2);
  text-decoration: none;
  white-space: nowrap;
  margin-left: 1.25rem; /* 与 QQ 图标留出 12px 干净间距（CDP 实测确定） */
}

.md-source__icon {
  display: inline-flex;
  width: 1.2rem;
  height: 1.2rem;
  flex-shrink: 0;
  margin-top: 0.1rem; /* 与首行文字基线对齐微调 */
}

.md-source__icon svg {
  width: 100%;
  height: 100%;
  fill: currentColor;
}

[dir=ltr] .md-source__icon + .md-source__repository {
  margin-left: -1.4rem;
  padding-left: 1.4rem;
}

.md-source__repository {
  display: inline-block;
  color: var(--vp-c-text-1);
  white-space: nowrap;
}

/* 仓库名：独立成行 */
.md-source__repository-name {
  display: block;
  font-weight: 700;
}

/* Stats：换到名称下方第二行 */
.md-source__facts {
  display: block;
  margin-top: 0.15rem;
  padding: 0;
  list-style: none;
}

.md-source__fact {
  display: inline-flex;
  align-items: center;
  padding: 0 0.3rem 0 0.4rem;
  border-left: 0.05rem solid var(--vp-c-divider);
  line-height: 1;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  opacity: 0.75;
}

/* 第二行首个 stat 去掉左边线，避免与名称混淆 */
.md-source__fact:first-child {
  border-left: none;
  padding-left: 0;
}

.md-source__fact svg {
  width: 0.8rem;
  height: 0.8rem;
  margin-right: 0.2rem;
  fill: currentColor;
}

.md-source:hover {
  color: var(--vp-c-text-1);
}
.md-source:hover .md-source__fact {
  opacity: 1;
}

@media (max-width: 480px) {
  .md-source {
    font-size: 0.62rem;
    margin-left: 0.75rem;
  }
  .md-source__icon {
    width: 1rem;
    height: 1rem;
  }
  [dir=ltr] .md-source__icon + .md-source__repository {
    margin-left: -1.2rem;
    padding-left: 1.2rem;
  }
}
</style>
