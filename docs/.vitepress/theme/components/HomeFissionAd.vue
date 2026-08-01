<script setup>
const inviteUrl =
  'https://www.workbuddy.cn/events/invite?inviteCode=pg6clpiswepfyhq'
</script>

<template>
  <div class="hf-banner" role="banner">
    <span class="hf-banner__tag">限时福利</span>
    <span class="hf-banner__text">
      新用户注册即领 <strong>2,000</strong> 积分 · 邀好友再得
      <strong>50+</strong> 积分 · 8/31 截止
    </span>
    <a :href="inviteUrl" target="_blank" rel="noopener" class="hf-banner__cta">
      立即领取
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"/>
        <path d="m12 5 7 7-7 7"/>
      </svg>
    </a>
  </div>
</template>

<style scoped>
/* ===== 首页裂变横幅 —— 紧凑单行 Banner ===== */

.hf-banner {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin: 1rem auto 1.5rem;
  padding: 0.55rem 1rem;
  max-width: 100%;
  background: linear-gradient(90deg, #eafcf7 0%, #f0faf8 60%, #f4fbfa 100%);
  border: 1px solid rgba(40, 184, 148, 0.22);
  border-radius: 999px;
  box-shadow: 0 1px 8px rgba(40, 184, 148, 0.10);
  font-size: 0.82rem;
  line-height: 1.4;
  box-sizing: border-box;
  overflow: visible;
}

/* 标签 */
.hf-banner__tag {
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.55rem;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #fff;
  background: linear-gradient(120deg, #28b894, #1aa67f);
  border-radius: 999px;
  white-space: nowrap;
  flex-shrink: 0;
}

/* 文案 */
.hf-banner__text {
  flex: 1;
  min-width: 0;
  color: var(--vp-c-text-2);
  font-size: 0.82rem;
}

.hf-banner__text strong {
  color: #0d9b78;
  font-weight: 700;
}

/* CTA 按钮 */
.hf-banner__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.35rem 0.85rem;
  font-size: 0.78rem;
  font-weight: 700;
  color: #06302a;
  text-decoration: none;
  background: linear-gradient(120deg, #28b894, #20c4a0);
  border-radius: 999px;
  white-space: nowrap;
  flex-shrink: 0;
  transition: transform 0.15s ease, filter 0.2s ease;
}

.hf-banner__cta:hover {
  transform: translateY(-1px);
  filter: brightness(1.08);
}

/* 入场动画 */
@keyframes hf-slide-down {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.hf-banner {
  animation: hf-slide-down 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* 暗色模式 */
:global(html.dark) .hf-banner {
  background: linear-gradient(90deg, rgba(20, 80, 65, 0.35) 0%, rgba(15, 55, 48, 0.25) 100%);
  border-color: rgba(94, 234, 212, 0.14);
  box-shadow: 0 1px 12px rgba(0, 0, 0, 0.25);
}

:global(html.dark) .hf-banner__text {
  color: rgba(255, 255, 255, 0.6);
}

:global(html.dark) .hf-banner__text strong {
  color: #5eead4;
}

/* ---------- 手机端适配 ---------- */

@media (max-width: 640px) {
  .hf-banner {
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.45rem;
    margin: 0.75rem 0.5rem 1.25rem;
    padding: 0.65rem 0.85rem;
    border-radius: 12px;
    text-align: center;
  }

  .hf-banner__text {
    font-size: 0.78rem;
    text-align: center;
  }

  .hf-banner__cta {
    font-size: 0.76rem;
    padding: 0.35rem 0.75rem;
  }
}

/* 超小屏：进一步收紧 */
@media (max-width: 400px) {
  .hf-banner {
    margin: 0.5rem 0.35rem 1rem;
    padding: 0.55rem 0.7rem;
    gap: 0.35rem;
  }

  .hf-banner__tag {
    font-size: 0.6rem;
    padding: 0.12rem 0.45rem;
  }

  .hf-banner__text {
    font-size: 0.74rem;
  }

  .hf-banner__cta {
    font-size: 0.72rem;
    padding: 0.32rem 0.65rem;
  }
}
</style>
