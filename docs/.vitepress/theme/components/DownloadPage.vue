<script setup>
import { ref } from 'vue'

const platforms = [
  {
    name: 'Windows x64（兼容 ARM64）',
    desc: 'Windows 10 / 11',
    link: 'https://download.codebuddy.cn/workbuddy/saas/win32-x64-user/WorkBuddy-win32-x64-user-5.3.5.34189228-8044e898.exe',
    theme: 'brand',
    recommended: true,
  },
  {
    name: 'Mac x64',
    desc: 'macOS 12 及以上',
    link: 'https://download.codebuddy.cn/workbuddy/saas/darwin-x64/WorkBuddy-darwin-x64-5.3.5.34189228-8044e898.dmg',
    theme: 'alt',
  },
  {
    name: 'Mac ARM64',
    desc: 'macOS 12 及以上',
    link: 'https://download.codebuddy.cn/workbuddy/saas/darwin-arm64/WorkBuddy-darwin-arm64-5.3.5.34189228-8044e898.dmg',
    theme: 'alt',
  },
  {
    name: '鸿蒙电脑版',
    desc: 'HarmonyOS PC · 华为应用市场',
    link: 'https://appgallery.huawei.com/app/detail?id=com.tencent.workbuddy',
    theme: 'alt',
  },
]

const mobile = [
  {
    name: '微信小程序',
    desc: '扫码或搜索 WorkBuddy 进入',
    qr: 'https://download.codebuddy.cn/web/workbuddy/0bebf86e38e7d71ff0c313d661e7753ff996c54e/assets/wechat-mini-BvkfUo9Q.png',
  },
  {
    name: 'iOS 下载',
    desc: 'App Store',
    link: 'https://apps.apple.com/cn/app/workbuddy-ai-%E5%B7%A5%E4%BD%9C%E5%8F%B0/id6761374913',
  },
  {
    name: 'Android 下载',
    desc: 'APK 直链',
    link: 'https://download.codebuddy.cn/web/workbuddy/workbuddy-latest.apk',
  },
  {
    name: '鸿蒙手机版',
    desc: 'HarmonyOS 手机 · 华为应用市场',
    link: 'https://appgallery.huawei.com/app/detail?id=com.tencent.workbuddyohos',
  },
]

const inviteUrl =
  'https://www.workbuddy.cn/events/invite?inviteCode=pg6clpiswepfyhq'

const showQr = ref(false)
const qrSrc = ref('')

function openQr(src) {
  qrSrc.value = src
  showQr.value = true
}

function closeQr() {
  showQr.value = false
}
</script>

<template>
  <div class="download-page">
    <header class="download-header">
      <h1 class="download-title">下载 WorkBuddy</h1>
      <p class="download-subtitle">选择适合你的平台，下载最新版本</p>
    </header>

    <!-- 裂变广告：WorkBuddy 邀请有礼 -->
    <div class="fission-ad">
      <div class="fission-ad__glow fission-ad__glow--tl"></div>
      <div class="fission-ad__glow fission-ad__glow--br"></div>

      <span class="fission-ad__badge">
        <svg class="fission-ad__badge-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
          <path d="M20 3v4"/>
          <path d="M22 5h-4"/>
        </svg>
        限时福利 · 8/31 截止
      </span>

      <div class="fission-ad__brand">
        <div class="fission-ad__icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="8" width="18" height="4" rx="1"/>
            <path d="M12 8v13"/>
            <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>
            <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/>
          </svg>
        </div>
        <div class="fission-ad__brand-text">
          <h3 class="fission-ad__vendor">WorkBuddy 新人专享</h3>
          <p class="fission-ad__tagline">新用户注册即领 2,000 积分</p>
        </div>
      </div>

      <div class="fission-ad__divider"></div>

      <div class="fission-ad__meta">
        <div class="fission-ad__highlight">
          <p>新用户注册即领 <b>2,000</b> 积分，立即可用 · 你邀好友再得 <b>50</b> 积分起</p>
        </div>
        <p class="fission-ad__specs">好友 7 日活跃再得 100 · 付费升级双方各得 500</p>
      </div>

      <div class="fission-ad__divider"></div>

      <div class="fission-ad__action">
        <div class="fission-ad__price-wrap">
          <div class="fission-ad__price-row">
            <span class="fission-ad__price">2,000</span>
            <span class="fission-ad__period">新人积分</span>
          </div>
        </div>
        <div class="fission-ad__cta-wrap">
          <a :href="inviteUrl" target="_blank" rel="noopener" class="fission-ad__cta">
            立即注册领积分
            <svg class="fission-ad__cta-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h6v6"/>
              <path d="M10 14 21 3"/>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            </svg>
          </a>
        </div>
      </div>
    </div>

    <section class="download-section">
      <h2>桌面端</h2>
      <div class="download-grid">
        <div
          v-for="p in platforms"
          :key="p.name"
          class="download-card"
          :class="{ recommended: p.recommended }"
        >
          <span v-if="p.recommended" class="rec-badge">推荐</span>
          <h3>{{ p.name }}</h3>
          <p>{{ p.desc }}</p>
          <a
            :href="p.link"
            target="_blank"
            rel="noopener"
            :class="['download-btn', p.theme]"
          >
            立即下载
          </a>
        </div>
      </div>
    </section>

    <section class="download-section">
      <h2>移动端</h2>
      <div class="download-grid mobile">
        <div v-for="m in mobile" :key="m.name" class="download-card compact">
          <h3>{{ m.name }}</h3>
          <p>{{ m.desc }}</p>
          <a
            v-if="!m.qr"
            :href="m.link"
            target="_blank"
            rel="noopener"
            class="download-btn alt"
          >
            前往下载
          </a>
          <button v-else type="button" class="download-btn alt" @click="openQr(m.qr)">
            查看二维码
          </button>
        </div>
      </div>
    </section>

    <p class="download-tip">
      提示：请根据你的操作系统与芯片架构选择对应安装包。
    </p>

    <div class="download-declare">
      <h3>下载声明</h3>
      <p>
        本页所有下载链接均取自 WorkBuddy 官方网站（workbuddy.cn / codebuddy.cn），仅供学习与技术交流使用。下载后建议核对文件信息，并在安装前进行安全扫描；不同平台安装包可能随版本迭代调整，若链接失效或版本更新，请以官方渠道发布的内容为准。本站为第三方教程文档站点，与官方无隶属关系，不对下载内容的使用后果承担责任。
      </p>
    </div>

    <!-- 微信小程序二维码弹窗 -->
    <div v-if="showQr" class="qr-modal" @click="closeQr">
      <div class="qr-modal-inner" @click.stop>
        <button type="button" class="qr-close-x" aria-label="关闭" @click="closeQr">×</button>
        <div class="qr-frame">
          <img :src="qrSrc" alt="微信小程序二维码" />
        </div>
        <p>微信扫一扫，搜索或扫码进入 WorkBuddy 小程序</p>
        <button type="button" class="download-btn alt" @click="closeQr">关闭</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.download-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 3rem 1rem 5rem;
  text-align: center;
  position: relative;
}

.download-page::before {
  content: '';
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 720px;
  max-width: 100%;
  height: 320px;
  background: radial-gradient(60% 60% at 50% 0%, rgba(80, 160, 255, 0.14), transparent 70%);
  pointer-events: none;
  z-index: -1;
}

/* 头部 */
.download-header {
  margin-bottom: 2.5rem;
}

.download-title {
  margin: 0 0 0.6rem;
  font-size: 2.6rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
}

.download-subtitle {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 1.05rem;
}

/* 分区标题 */
.download-section {
  margin: 3.25rem 0;
  text-align: left;
}

.download-section h2 {
  margin: 0 0 1.25rem;
  padding-left: 0.85rem;
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  border-left: 4px solid var(--vp-c-brand-1);
}

.download-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 1.25rem;
}

.download-grid.mobile {
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
}

/* 卡片 */
.download-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.9rem 1.5rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.download-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 40px -16px rgba(0, 0, 0, 0.35);
  border-color: var(--vp-c-brand-1);
}

.download-card.compact {
  padding: 1.5rem 1.25rem;
}

.download-card.recommended {
  border-color: var(--vp-c-brand-1);
  box-shadow: inset 0 0 0 1px var(--vp-c-brand-1);
}

.rec-badge {
  position: absolute;
  top: 14px;
  right: 14px;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.22rem 0.6rem;
  border-radius: 999px;
  color: #04222b;
  background: linear-gradient(120deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
}

.download-card h3 {
  margin: 0 0 0.5rem;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.download-card p {
  flex: 1;
  margin: 0 0 1.4rem;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}

/* 按钮 */
.download-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.92rem;
  font-family: inherit;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.2s ease, filter 0.2s ease;
}

.download-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.05);
}

.download-btn.brand {
  background: linear-gradient(120deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  color: #04222b;
}

.download-btn.alt {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.download-btn.alt:hover {
  border-color: var(--vp-c-brand-1);
}

.download-tip {
  margin-top: 2.5rem;
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
}

.download-declare {
  margin-top: 1.5rem;
  padding: 1.25rem 1.5rem;
  text-align: left;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-left: 4px solid var(--vp-c-brand-1);
  border-radius: 12px;
}

.download-declare h3 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.download-declare p {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.65;
  color: var(--vp-c-text-2);
}

/* 裂变广告 —— Evoxt 风格卡片 */
/* 裂变广告配色变量：跟随 VitePress 主题切换 */
:global(html) {
  --ad-bg: linear-gradient(135deg, #e9fbf4 0%, #f4fbf9 100%);
  --ad-text: var(--vp-c-text-1);
  --ad-text-sub: var(--vp-c-text-2);
  --ad-border: var(--vp-c-divider);
  --ad-glow-tl: rgba(40, 184, 148, 0.30);
  --ad-glow-br: rgba(20, 184, 166, 0.26);
  --ad-badge-text: #fff;
  --ad-highlight-bg: rgba(40, 184, 148, 0.12);
  --ad-highlight-text: var(--vp-c-text-1);
  --ad-accent: #0f9b7d;
  --ad-cta-text: #06302a;
  --ad-icon-bg: rgba(40, 184, 148, 0.16);
  --ad-icon-color: #0f9b7d;
  --ad-divider: rgba(0, 0, 0, 0.08);
  --ad-shadow: 0 20px 50px -20px rgba(0, 0, 0, 0.15);
}

:global(html.dark) {
  --ad-bg: linear-gradient(135deg, #1a1f3c 0%, #11152b 100%);
  --ad-text: #fff;
  --ad-text-sub: rgba(255, 255, 255, 0.55);
  --ad-border: rgba(255, 255, 255, 0.06);
  --ad-glow-tl: #28b894;
  --ad-glow-br: #14b8a6;
  --ad-badge-text: #fff;
  --ad-highlight-bg: rgba(255, 255, 255, 0.08);
  --ad-highlight-text: rgba(255, 255, 255, 0.9);
  --ad-accent: #5eead4;
  --ad-cta-text: #06302a;
  --ad-icon-bg: rgba(255, 255, 255, 0.1);
  --ad-icon-color: #fff;
  --ad-divider: rgba(255, 255, 255, 0.1);
  --ad-shadow: 0 20px 50px -20px rgba(0, 0, 0, 0.45);
}

.fission-ad {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin: 2rem 0 3rem;
  padding: 1.5rem;
  overflow: hidden;
  text-align: left;
  background: var(--ad-bg);
  border: 1px solid var(--ad-border);
  border-radius: 16px;
  box-shadow: var(--ad-shadow);
}

.fission-ad__glow {
  position: absolute;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.35;
  pointer-events: none;
}

.fission-ad__glow--tl {
  top: -60px;
  left: -40px;
  background: radial-gradient(circle, var(--ad-glow-tl), transparent 70%);
}

.fission-ad__glow--br {
  bottom: -60px;
  right: -40px;
  background: radial-gradient(circle, var(--ad-glow-br), transparent 70%);
}

.fission-ad__badge {
  position: absolute;
  top: 12px;
  left: 12px;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.6rem;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--ad-badge-text);
  background: linear-gradient(120deg, #28b894, #1aa67f);
  border-radius: 999px;
}

.fission-ad__badge-icon {
  flex-shrink: 0;
}

.fission-ad__brand {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  min-width: 170px;
}

.fission-ad__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: var(--ad-icon-color);
  background: var(--ad-icon-bg);
  border-radius: 12px;
}

.fission-ad__brand-text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.fission-ad__vendor {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--ad-text);
}

.fission-ad__tagline {
  margin: 0;
  font-size: 0.78rem;
  color: var(--ad-text-sub);
}

.fission-ad__divider {
  width: 1px;
  align-self: stretch;
  background: var(--ad-divider);
}

.fission-ad__meta {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.fission-ad__highlight {
  padding: 0.5rem 0.75rem;
  background: var(--ad-highlight-bg);
  border-radius: 8px;
}

.fission-ad__highlight p {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--ad-highlight-text);
}

.fission-ad__highlight b {
  color: var(--ad-accent);
  font-weight: 700;
}

.fission-ad__specs {
  margin: 0;
  font-size: 0.78rem;
  color: var(--ad-text-sub);
}

.fission-ad__action {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.6rem;
  min-width: 120px;
}

.fission-ad__price-row {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.fission-ad__price {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--ad-text);
}

.fission-ad__period {
  font-size: 0.8rem;
  color: var(--ad-text-sub);
}

.fission-ad__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.55rem 1rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--ad-cta-text);
  text-decoration: none;
  background: linear-gradient(120deg, #28b894, #20c4a0);
  border-radius: 8px;
  transition: transform 0.15s ease, filter 0.2s ease;
}

.fission-ad__cta:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.fission-ad__cta-icon {
  flex-shrink: 0;
}

@media (max-width: 960px) {
  /* 裂变广告：改纵向堆叠（覆盖原 760px 断点，让平板/窄屏也垂直） */
  .fission-ad {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    /* 顶部留出空间给左上角的「限时福利」徽章，避免与品牌图标重叠 */
    padding: 2.75rem 1.25rem 1.25rem;
  }

  .fission-ad__divider {
    width: 100%;
    height: 1px;
    align-self: auto;
  }

  .fission-ad__brand {
    min-width: auto;
  }

  .fission-ad__action {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    min-width: auto;
    width: 100%;
  }

  /* 下载页整体：收紧留白 */
  .download-page {
    padding: 1.75rem 0.9rem 3rem;
  }

  .download-title {
    font-size: 1.85rem;
  }

  .download-subtitle {
    font-size: 0.95rem;
  }

  /* 卡片网格：始终 1 列，避免溢出 */
  .download-grid,
  .download-grid.mobile {
    grid-template-columns: 1fr;
    gap: 0.85rem;
  }

  .download-card {
    padding: 1.4rem 1.1rem;
  }

  .download-card.compact {
    padding: 1.2rem 1rem;
  }

  .download-section {
    margin: 2.4rem 0;
  }

  .download-section h2 {
    font-size: 1.2rem;
  }
}

/* 小屏（≤400px）进一步压缩 */
@media (max-width: 400px) {
  .fission-ad {
    padding: 2.5rem 0.85rem 1rem;
    gap: 0.85rem;
  }

  .fission-ad__vendor {
    font-size: 1rem;
  }

  .fission-ad__tagline,
  .fission-ad__specs {
    font-size: 0.74rem;
  }

  .fission-ad__highlight p {
    font-size: 0.8rem;
  }

  .fission-ad__price {
    font-size: 1.25rem;
  }

  .fission-ad__cta {
    padding: 0.5rem 0.85rem;
    font-size: 0.8rem;
  }

  .download-page {
    padding: 1.4rem 0.75rem 2.5rem;
  }

  .download-title {
    font-size: 1.55rem;
  }
}

/* 二维码弹窗 */
.qr-modal {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
}

.qr-modal-inner {
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

.qr-close-x {
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

.qr-close-x:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.qr-frame {
  display: inline-block;
  padding: 12px;
  margin-bottom: 1rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 18px -8px rgba(0, 0, 0, 0.25);
}

.qr-frame img {
  width: 200px;
  height: 200px;
  display: block;
  object-fit: contain;
}

.qr-modal-inner p {
  margin: 0 0 1.25rem;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}
</style>
