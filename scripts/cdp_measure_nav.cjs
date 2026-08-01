// CDP 测量导航栏社交图标与自定义徽章的实际间距（带诊断）
const WebSocket = globalThis.WebSocket
const http = require('node:http')

const PORT = 9222
const URL = 'http://localhost:4173/'

function getJSON(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = ''
      res.on('data', (c) => (data += c))
      res.on('end', () => resolve(JSON.parse(data)))
    }).on('error', reject)
  })
}

async function main() {
  const list = await getJSON(`http://localhost:${PORT}/json`)
  const target = list.find((t) => t.type === 'page') || list[0]
  console.error('TARGET:', target.url, target.type)
  const ws = new WebSocket(target.webSocketDebuggerUrl)
  let id = 0
  const pending = new Map()
  function send(method, params) {
    return new Promise((resolve) => {
      const msgId = ++id
      pending.set(msgId, resolve)
      ws.send(JSON.stringify({ id: msgId, method, params: params || {} }))
    })
  }

  await new Promise((r) => ws.addEventListener('open', r))
  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data.toString())
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result)
      pending.delete(msg.id)
    }
  })

  await send('Page.enable')
  await send('Runtime.enable')
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  })
  await send('Page.navigate', { url: URL })
  // 等待加载 + 组件挂载
  await new Promise((r) => setTimeout(r, 3500))

  const diag = await send('Runtime.evaluate', {
    expression: `(function(){
      return {
        title: document.title,
        readyState: document.readyState,
        bodyLen: document.body ? document.body.innerHTML.length : -1,
        hasNavBar: !!document.querySelector('.VPNavBar'),
        hasSocial: !!document.querySelector('.VPNavBarSocialLinks'),
        hasBadge: !!document.querySelector('.md-source'),
        socialParent: document.querySelector('.VPNavBarSocialLinks') ? document.querySelector('.VPNavBarSocialLinks').parentElement.className : null
      };
    })()`,
    returnByValue: true,
  })
  console.error('DIAG:', JSON.stringify(diag.result.value))

  const result = await send('Runtime.evaluate', {
    expression: `(function(){
      function rect(el){ if(!el) return null; const r = el.getBoundingClientRect(); return {x: Math.round(r.x), right: Math.round(r.right), y: Math.round(r.y), bottom: Math.round(r.bottom), w: Math.round(r.width), h: Math.round(r.height)}; }
      const links = [...document.querySelectorAll('.VPNavBarSocialLinks .VPSocialLink')].map(rect);
      const badge = document.querySelector('.md-source');
      const badgeRect = rect(badge);
      const name = document.querySelector('.md-source__repository-name');
      const facts = document.querySelector('.md-source__facts');
      return {
        linkCount: links.length,
        links,
        badge: badgeRect,
        badgeIcon: rect(badge ? badge.querySelector('.md-source__icon') : null),
        name: rect(name),
        facts: rect(facts),
        gapLinksToBadge: (badgeRect && links.length) ? (badgeRect.x - links[links.length-1].right) : null,
        linkGap: (links.length>=2) ? (links[1].x - links[0].right) : null
      };
    })()`,
    returnByValue: true,
  })

  console.log(JSON.stringify(result.result.value, null, 2))
  ws.close()
  process.exit(0)
}

main().catch((e) => {
  console.error('ERR', e)
  process.exit(1)
})
