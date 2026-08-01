import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import HomeNotice from './components/HomeNotice.vue'
import DownloadPage from './components/DownloadPage.vue'
import Contributors from '@cssnr/vitepress-plugin-contributors'
import '@cssnr/vitepress-plugin-contributors/style.css'
import contributors from '../contributors.json'
import WechatFollowModal from './components/WechatFollowModal.vue'
import ContributorsPage from './components/ContributorsPage.vue'
import DocContributors from './components/DocContributors.vue'
import HomeFissionAd from './components/HomeFissionAd.vue'
import GithubStar from './components/GithubStar.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 首页 Hero 与 Features 之间：裂变广告
      'home-hero-info-after': () => h(HomeFissionAd),
      // 文档页底部注入「项目贡献者」区块
      'doc-after': () => h(DocContributors),
      // 挂载首页弹窗通知（组件内部已限定仅在首页显示）
      'layout-bottom': () => h('div', [h(HomeNotice), h(WechatFollowModal)]),
      // GitHub Star 按钮：放在导航栏社交图标（QQ）后面
      'nav-bar-content-after': () => h(GithubStar),
    })
  },
  enhanceApp({ app }) {
    app.component('Contributors', Contributors)
    app.component('DownloadPage', DownloadPage)
    app.component('ContributorsPage', ContributorsPage)
    app.component('DocContributors', DocContributors)
    app.component('HomeFissionAd', HomeFissionAd)
    app.component('GithubStar', GithubStar)
    app.config.globalProperties.$contributors = contributors
  },
}
