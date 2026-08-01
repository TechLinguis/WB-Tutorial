<script setup>
import { onMounted, onUnmounted } from 'vue'
import { wechatOpen, closeWechat, openWechat } from '../wechatFollow.js'

// 公众号二维码
const qrUrl = 'https://open.weixin.qq.com/qr/code?username=gh_4da3f05bb259'

function onKey(e) {
  if (e.key === 'Escape') closeWechat()
}

// 拦截导航栏微信图标点击 → 改为弹出公众号二维码
// 注意：这段全局监听必须放在真实组件（本组件 <script setup>）的 onMounted 里，
// 不能放在 theme/index.js 的 Layout 渲染函数（函数式组件）中 —— 那里 onMounted 不会注册。
function onClick(e) {
  const a = e.target.closest?.('a[href="#wechat-follow"]')
  if (a) {
    e.preventDefault()
    openWechat()
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKey)
  document.addEventListener('click', onClick)
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKey)
  document.removeEventListener('click', onClick)
})
</script>

<template>
  <!--
    用 <ClientOnly> 包裹 <Teleport>，避免 SSR 渲染时 Teleport 节点与客户端
    水合不一致，从而打断整个页面（含汉堡菜单）的事件绑定。
  -->
  <ClientOnly>
    <Teleport to="body">
      <div v-if="wechatOpen" class="wechat-modal" @click="closeWechat">
        <div class="wechat-modal__inner" @click.stop>
          <button
            type="button"
            class="wechat-modal__close"
            aria-label="关闭"
            @click="closeWechat"
          >
            ×
          </button>
          <div class="wechat-modal__frame">
            <img :src="qrUrl" alt="WorkBuddy 公众号二维码" />
          </div>
          <h3 class="wechat-modal__title">关注 酷码星语 公众号</h3>
          <p class="wechat-modal__desc">微信扫一扫，关注公众号获取最新教程</p>
        </div>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
.wechat-modal {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
}

.wechat-modal__inner {
  position: relative;
  width: 100%;
  max-width: 320px;
  padding: 1.75rem;
  text-align: center;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  box-shadow: 0 24px 64px -12px rgba(0, 0, 0, 0.55);
}

.wechat-modal__close {
  position: absolute;
  top: 12px;
  right: 14px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  line-height: 1;
  color: var(--vp-c-text-2);
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.wechat-modal__close:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.wechat-modal__frame {
  display: inline-block;
  padding: 12px;
  margin-bottom: 1rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 18px -8px rgba(0, 0, 0, 0.25);
}

.wechat-modal__frame img {
  width: 200px;
  height: 200px;
  display: block;
  object-fit: contain;
}

.wechat-modal__title {
  margin: 0 0 0.4rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.wechat-modal__desc {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}
</style>
