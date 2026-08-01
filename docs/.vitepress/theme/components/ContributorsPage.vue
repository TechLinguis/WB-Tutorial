<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import contributors from '../../contributors.json'

// 接入的真实仓库
const repoName = 'TechLinguis/WB-Tutorial'
const repoUrl = 'https://github.com/TechLinguis/WB-Tutorial'

// 头像显示尺寸（CSS px）；请求 2x 以适配高 DPI 屏幕
const DISPLAY_SIZE = 64
const FETCH_SIZE = DISPLAY_SIZE * 2 // 128px

// 优化头像 URL：追加 &s=128 参数，让 GitHub CDN 返回小尺寸图片
// 原始 URL 形如 https://avatars.githubusercontent.com/u/123?v=4（默认 400px+）
// 优化后形如 https://avatars.githubusercontent.com/u/123?v=4&s=128（约减少 85% 体积）
const optimizedContributors = computed(() =>
  contributors.map((c) => ({
    login: c.login,
    avatar_url:
      c.avatar_url +
      (c.avatar_url.includes('?') ? '&' : '?') +
      's=' + FETCH_SIZE,
  }))
)

// 跟踪每张图片的加载状态，仅在图片实际加载完成后触发淡入动画
const loaded = reactive({})
function onAvatarLoad(login) {
  loaded[login] = true
}

// 跟随鼠标的高光位置（百分比）
const cardRef = ref(null)
const spotX = ref(50)
const spotY = ref(50)

function onMove(e) {
  const el = cardRef.value
  if (!el) return
  const r = el.getBoundingClientRect()
  spotX.value = ((e.clientX - r.left) / r.width) * 100
  spotY.value = ((e.clientY - r.top) / r.height) * 100
}

// 数字滚动计数（仅客户端，SSR 初始为 0）
const count = ref(0)
onMounted(() => {
  const target = contributors.length
  const dur = 1300
  const start = performance.now()
  const tick = (now) => {
    const p = Math.min((now - start) / dur, 1)
    count.value = Math.round(target * (1 - Math.pow(1 - p, 3))) // easeOutCubic
    if (p < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})
</script>

<template>
  <div class="contrib-page">
    <!-- Hero -->
    <header class="contrib-hero">
      <div class="contrib-hero__inner">
        <p class="contrib-eyebrow">OPEN SOURCE · COMMUNITY</p>
        <h1 class="contrib-title">项目贡献者</h1>

        <div class="contrib-stat">
          <span class="contrib-stat__icon" aria-hidden="true">✦</span>
          <span class="contrib-stat__num">{{ count }}</span>
          <span class="contrib-stat__label">位开发者共同构建</span>
        </div>

        <p class="contrib-sub">
          每一行文档、每一次修订，都来自这些开发者的热情付出。感谢他们让 WorkBuddy 教程站持续生长。
        </p>
      </div>
    </header>

    <!-- 贡献者卡片 -->
    <section
      ref="cardRef"
      class="contrib-card"
      :style="{ '--mx': spotX + '%', '--my': spotY + '%' }"
      @mousemove="onMove"
    >
      <div class="contrib-card__spot" aria-hidden="true"></div>
      <div class="contrib-card__head">
        <span class="contrib-card__dot"></span>
        <h2>GitHub 贡献者</h2>
      </div>

      <div class="contrib-avatars">
        <a
          v-for="c in optimizedContributors"
          :key="c.login"
          :aria-label="`${c.login} on GitHub`"
          :href="`https://github.com/${c.login}`"
          target="_blank"
          rel="noopener noreferrer"
          class="contrib-avatar-link"
        >
          <img
            :alt="c.login"
            :src="c.avatar_url"
            :width="DISPLAY_SIZE"
            :height="DISPLAY_SIZE"
            loading="lazy"
            decoding="async"
            class="contrib-avatar"
            :class="{ 'is-loaded': loaded[c.login] }"
            @load="onAvatarLoad(c.login)"
          />
        </a>
      </div>

      <p class="contrib-demo-note">
        * 数据实时取自仓库 <code>{{ repoName }}</code> 的 GitHub 贡献者列表。
      </p>
    </section>

    <!-- CTA -->
    <div class="contrib-cta">
      <a :href="repoUrl" target="_blank" rel="noopener" class="contrib-cta__btn">
        在 GitHub 上参与贡献
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 3h6v6" />
          <path d="M10 14 21 3" />
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        </svg>
      </a>
    </div>
  </div>
</template>

<style scoped>
@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.contrib-page {
  position: relative;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  margin: 0;
  padding: 0 0 5rem;
  text-align: center;
  overflow-x: hidden;
}

/* 集中极光：聚焦在 Hero 内容后方 */
.contrib-page::before {
  content: '';
  position: absolute;
  top: -120px;
  left: 50%;
  transform: translateX(-50%);
  width: 760px;
  max-width: 90vw;
  height: 520px;
  z-index: 0;
  background:
    radial-gradient(55% 55% at 50% 45%, rgba(40, 184, 148, 0.55), transparent 70%),
    radial-gradient(50% 48% at 50% 40%, rgba(99, 102, 241, 0.38), transparent 65%),
    radial-gradient(45% 45% at 50% 55%, rgba(20, 184, 166, 0.40), transparent 65%);
  filter: blur(48px);
  animation: aurora-pulse 10s ease-in-out infinite alternate;
}

@keyframes aurora-pulse {
  0% {
    opacity: 0.85;
    transform: translateX(-50%) scale(1);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) scale(1.08);
  }
}

/* ---------- Hero ---------- */
.contrib-hero {
  position: relative;
  z-index: 1;
  margin: 0 0 2.75rem;
  padding: 4.5rem 1.5rem 3.5rem;
  border-radius: 0;
  border-bottom: 1px solid var(--vp-c-divider);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent) 0%, transparent 55%),
    linear-gradient(180deg, var(--vp-c-bg-soft) 0%, color-mix(in srgb, var(--vp-c-bg-soft) 40%, transparent) 100%);
  overflow: hidden;
}

/* 科技网格纹理 */
.contrib-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image:
    linear-gradient(color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: radial-gradient(ellipse 80% 100% at 50% 0%, #000 30%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse 80% 100% at 50% 0%, #000 30%, transparent 80%);
  opacity: 0.7;
  pointer-events: none;
}

.contrib-hero__inner {
  position: relative;
  z-index: 1;
  max-width: 880px;
  margin: 0 auto;
}

.contrib-eyebrow {
  display: inline-block;
  margin: 0 0 0.8rem;
  padding: 0.28rem 0.8rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: #fff;
  background: linear-gradient(120deg, #28b894, #20c4a0);
  border-radius: 999px;
  box-shadow: 0 6px 18px -6px rgba(40, 184, 148, 0.55);
}

.contrib-title {
  margin: 0 0 0.2rem;
  font-size: 3.2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
}

.contrib-title::after {
  content: '';
  display: block;
  width: 64px;
  height: 4px;
  margin: 1rem auto 0;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, var(--vp-c-brand-1), transparent);
}

.contrib-stat {
  display: inline-flex;
  align-items: center;
  gap: 0.85rem;
  margin: 1.6rem 0 1rem;
  padding: 0.9rem 1.6rem;
  border-radius: 18px;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  /* 玻璃拟态底色 + 渐变描边 */
  background:
    linear-gradient(
      140deg,
      color-mix(in srgb, var(--vp-c-bg) 55%, transparent),
      color-mix(in srgb, var(--vp-c-bg) 25%, transparent)
    ) padding-box,
    linear-gradient(140deg, var(--vp-c-brand-1), var(--vp-c-brand-2), #8b5cf6) border-box;
  border: 1.5px solid transparent;
  backdrop-filter: blur(14px) saturate(150%);
  -webkit-backdrop-filter: blur(14px) saturate(150%);
  box-shadow:
    0 10px 34px -10px color-mix(in srgb, var(--vp-c-brand-1) 50%, transparent),
    inset 0 1px 0 color-mix(in srgb, #fff 10%, transparent);
}

/* 顶部玻璃高光 */
.contrib-stat::after {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 50%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.16), transparent);
  pointer-events: none;
  z-index: 0;
}

.contrib-stat__icon,
.contrib-stat__num,
.contrib-stat__label {
  position: relative;
  z-index: 1;
}

.contrib-stat__icon {
  font-size: 1.9rem;
  line-height: 1;
  background: linear-gradient(135deg, var(--vp-c-brand-1), #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 10px color-mix(in srgb, var(--vp-c-brand-1) 65%, transparent));
  animation: stat-pulse 2.6s ease-in-out infinite;
}

.contrib-stat__num {
  font-size: 4.8rem;
  font-weight: 800;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  background: linear-gradient(
    100deg,
    var(--vp-c-brand-1) 0%,
    #8b5cf6 22%,
    #22d3ee 50%,
    #8b5cf6 78%,
    var(--vp-c-brand-1) 100%
  );
  background-size: 220% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 22px color-mix(in srgb, var(--vp-c-brand-1) 45%, transparent));
  animation: stat-shimmer 4.5s linear infinite;
}

.contrib-stat__label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

@keyframes stat-shimmer {
  0% { background-position: 0% 50%; }
  100% { background-position: 220% 50%; }
}

@keyframes stat-pulse {
  0%, 100% { transform: scale(1); opacity: 0.85; }
  50% { transform: scale(1.18); opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .contrib-stat__num,
  .contrib-stat__icon { animation: none; }
}

.contrib-sub {
  margin: 0 auto;
  max-width: 560px;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  line-height: 1.75;
}

/* ---------- 卡片 ---------- */
.contrib-card {
  position: relative;
  z-index: 1;
  margin: 0 1.5rem;
  padding: 2.25rem 1.5rem 1.75rem;
  background: color-mix(in srgb, var(--vp-c-bg-soft) 74%, transparent);
  border: 1px solid var(--vp-c-divider);
  border-radius: 22px;
  box-shadow: 0 28px 70px -32px rgba(0, 0, 0, 0.55);
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-sizing: border-box;
}

/* 旋转渐变描边 */
.contrib-card::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: inherit;
  padding: 1.6px;
  background: conic-gradient(
    from var(--angle),
    #28b894,
    #14b8a6,
    #6366f1,
    #a855f7,
    #28b894
  );
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: border-spin 6s linear infinite;
  pointer-events: none;
}

/* 扫描高光 */
.contrib-card::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 2;
  background: linear-gradient(
    105deg,
    transparent 42%,
    rgba(255, 255, 255, 0.13) 50%,
    transparent 58%
  );
  transform: translateX(-120%);
  animation: shine-sweep 6s ease-in-out infinite;
  pointer-events: none;
}

@keyframes border-spin {
  to {
    --angle: 360deg;
  }
}

@keyframes shine-sweep {
  0%, 72% {
    transform: translateX(-120%);
  }
  92% {
    transform: translateX(120%);
  }
  100% {
    transform: translateX(120%);
  }
}

/* 跟随鼠标的高光 */
.contrib-card__spot {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: radial-gradient(
    240px circle at var(--mx) var(--my),
    color-mix(in srgb, var(--vp-c-brand-1) 26%, transparent),
    transparent 60%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.contrib-card:hover .contrib-card__spot {
  opacity: 1;
}

.contrib-card__head,
.contrib-demo-note,
.contrib-avatars {
  position: relative;
  z-index: 3;
}

.contrib-card__head {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  margin-bottom: 1.75rem;
}

.contrib-card__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(120deg, #28b894, #20c4a0);
  box-shadow: 0 0 0 4px rgba(40, 184, 148, 0.18);
}

.contrib-card__head h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.contrib-demo-note {
  margin: 1.5rem 0 0;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

.contrib-demo-note code {
  font-size: 0.78rem;
  padding: 0.1rem 0.4rem;
  background: var(--vp-c-default-soft);
  border-radius: 5px;
}

/* ---------- 头像增强 ---------- */
.contrib-avatars {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.9rem;
}

.contrib-avatar-link {
  display: inline-block;
  line-height: 0;
}

.contrib-avatar {
  display: inline-block;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 3px solid var(--vp-c-bg);
  box-shadow: 0 4px 14px -4px rgba(0, 0, 0, 0.35);
  vertical-align: middle;
  backface-visibility: hidden;
  -moz-osx-fontoothing: grayscale;
  transform: translateZ(0);

  /* 加载前：骨架占位背景 */
  background: color-mix(in srgb, var(--vp-c-default-soft) 60%, transparent);
  opacity: 0;
  transform: scale(0.6);
  transition: opacity 0.4s ease, transform 0.4s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

/* 图片加载完成后触发淡入 */
.contrib-avatar.is-loaded {
  opacity: 1;
  transform: scale(1);
}

.contrib-avatar:hover {
  transform: scale(1.14) translateY(-2px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 12px 28px -6px color-mix(in srgb, var(--vp-c-brand-1) 55%, transparent);
}

/* ---------- CTA ---------- */
.contrib-cta {
  margin-top: 2rem;
}

.contrib-cta__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.7rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: #06302a;
  text-decoration: none;
  background: linear-gradient(120deg, #28b894, #20c4a0);
  border-radius: 10px;
  transition: transform 0.15s ease, filter 0.2s ease, box-shadow 0.2s ease;
}

.contrib-cta__btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.05);
  box-shadow: 0 10px 26px -8px rgba(40, 184, 148, 0.6);
}

/* 不支持 mask-composite 时隐藏旋转描边，避免旧浏览器遮罩失效导致整块渐变覆盖内容 */
@supports not ((mask-composite: exclude) or (-webkit-mask-composite: xor)) {
  .contrib-card::before {
    display: none;
  }
}

@media (max-width: 640px) {
  .contrib-hero {
    padding: 2.5rem 1rem 2rem;
  }

  .contrib-title {
    font-size: 2rem;
  }

  .contrib-sub {
    font-size: 0.9rem;
    padding: 0 0.25rem;
  }

  .contrib-stat {
    gap: 0.5rem;
    padding: 0.7rem 1.1rem;
    border-radius: 14px;
    margin: 1.2rem 0 0.8rem;
  }

  .contrib-stat__num {
    font-size: 2.8rem;
  }

  .contrib-stat__icon {
    font-size: 1.3rem;
  }

  .contrib-card {
    margin: 0 0.75rem;
    padding: 1.5rem 1rem 1.25rem;
  }

  /* 小屏：头像缩小、间距收紧，让每行多排几个 */
  .contrib-avatars {
    gap: 0.7rem;
  }

  .contrib-avatar {
    width: 56px;
    height: 56px;
    border-width: 2px;
  }
}

@media (max-width: 400px) {
  .contrib-hero {
    padding: 2rem 0.75rem 1.75rem;
  }

  .contrib-title {
    font-size: 1.7rem;
  }

  .contrib-card {
    margin: 0 0.5rem;
    padding: 1.25rem 0.75rem 1rem;
  }

  .contrib-avatars {
    gap: 0.5rem;
  }

  .contrib-avatar {
    width: 48px;
    height: 48px;
  }
}

/* 触屏设备：禁用头像 hover 放大，避免滚动时误触 */
@media (hover: none) {
  .contrib-avatar:hover {
    transform: none;
    border-color: var(--vp-c-bg);
    box-shadow: 0 4px 14px -4px rgba(0, 0, 0, 0.35);
  }
}
</style>
