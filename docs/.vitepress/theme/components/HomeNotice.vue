<script setup>
import { ref, onMounted } from 'vue'

/**
 * 弹窗通知配置 —— 按需修改以下内容即可
 */
const NOTICE = {
  // 存储键：变更后旧用户的「不再显示」记录失效，会再次弹出
  storageKey: 'wb-home-notice-v4',
  title: '本站声明',
  content: '为避免误解，特此声明：本站为 WorkBuddy 教程站，并非官方网站。WorkBuddy 官方网址如下，请认准官方渠道：',
  links: [
    { text: 'www.workbuddy.cn', url: 'https://www.workbuddy.cn' },
    { text: 'www.workbuddy.ai', url: 'https://www.workbuddy.ai' },
    { text: 'www.codebuddy.cn/work', url: 'https://www.codebuddy.cn/work/' },
  ],
  confirmText: '我知道了',
  // 为 false 时，每次进入首页都会弹出（不写入「不再显示」记录）
  showOnce: false,
}

const visible = ref(false)

function checkHome() {
  try {
    const p = window.location.pathname
    const onHome = p === '/' || p === '/index.html' || p.endsWith('/index.html')
    if (!onHome) return
    if (NOTICE.showOnce && localStorage.getItem(NOTICE.storageKey)) return
    visible.value = true
  } catch (e) {
    console.error('[HomeNotice]', e)
  }
}

onMounted(() => {
  checkHome()
  // 浏览器前进/后退到首页时也弹出
  window.addEventListener('popstate', checkHome)
})

function close() {
  try {
    if (NOTICE.showOnce) localStorage.setItem(NOTICE.storageKey, '1')
  } catch (e) {
    console.error('[HomeNotice]', e)
  }
  visible.value = false
}
</script>

<template>
  <Transition name="wb-notice-fade">
    <div v-if="visible" class="wb-notice-mask" @click.self="close">
      <div class="wb-notice-card" role="dialog" aria-modal="true">
        <button class="wb-notice-close" aria-label="关闭" @click="close">×</button>
        <h2 class="wb-notice-title">{{ NOTICE.title }}</h2>
        <p class="wb-notice-content">{{ NOTICE.content }}</p>
        <ul v-if="NOTICE.links && NOTICE.links.length" class="wb-notice-list">
          <li v-for="(link, i) in NOTICE.links" :key="i">
            <a :href="link.url" target="_blank" rel="noopener">{{ link.text }}</a>
          </li>
        </ul>
        <div class="wb-notice-actions">
          <button class="wb-notice-btn" @click="close">{{ NOTICE.confirmText }}</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.wb-notice-mask {
  position: fixed;
  inset: 0;
  /* 必须低于导航栏（VitePress --vp-z-index-nav 默认 100），
     否则全屏公告会盖住顶部导航与汉堡菜单，导致移动端「菜单不显示」。 */
  z-index: 90;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  padding: 1rem;
}

.wb-notice-card {
  position: relative;
  width: min(440px, 92vw);
  max-height: 86vh;
  overflow-y: auto;
  padding: 2rem 1.75rem 1.75rem;
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 24px 64px -16px rgba(0, 0, 0, 0.5);
}

.wb-notice-close {
  position: absolute;
  top: 0.75rem;
  right: 0.85rem;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.wb-notice-close:hover {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
}

.wb-notice-title {
  margin: 0 0 0.85rem;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.wb-notice-content {
  margin: 0 0 1rem;
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}

.wb-notice-list {
  margin: 0 0 1.5rem;
  padding-left: 1.15rem;
  color: var(--vp-c-text-2);
}

.wb-notice-list li {
  margin: 0.4rem 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

.wb-notice-list li::marker {
  color: var(--vp-c-brand-1);
}

.wb-notice-list a {
  color: var(--vp-c-brand-1);
  font-weight: 600;
  text-decoration: none;
}

.wb-notice-list a:hover {
  text-decoration: underline;
}

.wb-notice-actions {
  display: flex;
  justify-content: flex-end;
}

.wb-notice-btn {
  padding: 0.55rem 1.6rem;
  border: none;
  border-radius: 10px;
  background: linear-gradient(120deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  color: #04222b;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.2s;
}

.wb-notice-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px -8px var(--vp-c-brand-1);
}

.wb-notice-fade-enter-active,
.wb-notice-fade-leave-active {
  transition: opacity 0.25s ease;
}

.wb-notice-fade-enter-from,
.wb-notice-fade-leave-to {
  opacity: 0;
}

.wb-notice-fade-enter-active .wb-notice-card {
  transition: transform 0.25s ease;
}

.wb-notice-fade-enter-from .wb-notice-card {
  transform: translateY(12px) scale(0.98);
}
</style>
