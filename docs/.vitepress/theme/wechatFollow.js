import { ref } from 'vue'

// 全局共享状态：控制「关注公众号」弹窗
export const wechatOpen = ref(false)

export function openWechat() {
  wechatOpen.value = true
}

export function closeWechat() {
  wechatOpen.value = false
}
