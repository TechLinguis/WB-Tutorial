// 在候选 margin 下检查：徽章-QQ 间距，以及 QQ 是否与导航菜单项碰撞
const WebSocket = globalThis.WebSocket
const http = require('node:http')
const PORT = 9222
const URL = 'http://localhost:4173/'
function getJSON(u){return new Promise((res,rej)=>{http.get(u,r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>res(JSON.parse(d)))}).on('error',rej)})}
async function main(){
  const list=await getJSON(`http://localhost:${PORT}/json`);
  const target=list.find(t=>t.type==='page')||list[0];
  const ws=new WebSocket(target.webSocketDebuggerUrl);
  let id=0;const pend=new Map();
  const send=(m,p)=>new Promise(r=>{const i=++id;pend.set(i,r);ws.send(JSON.stringify({id:i,method:m,params:p||{}}))});
  await new Promise(r=>ws.addEventListener('open',r));
  ws.addEventListener('message',e=>{const m=JSON.parse(e.data.toString());if(m.id&&pend.has(m.id)){pend.get(m.id)(m.result);pend.delete(m.id)}});
  await send('Page.enable');await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await send('Page.navigate',{url:URL});
  await new Promise(r=>setTimeout(r,3500));

  async function measure(marginPx){
    await send('Runtime.evaluate',{expression:`(()=>{let s=document.getElementById('__tune');if(!s){s=document.createElement('style');s.id='__tune';document.head.appendChild(s);}s.textContent='.md-source{margin-left:${marginPx}px !important}';return true;})()`,returnByValue:true});
    await new Promise(r=>setTimeout(r,200));
    const r=await send('Runtime.evaluate',{expression:`(()=>{
      const links=[...document.querySelectorAll('.VPNavBarSocialLinks .VPSocialLink')];
      const b=document.querySelector('.md-source');
      const menuItems=[...document.querySelectorAll('.VPNavBarMenu .VPNavBarMenuLink, .VPNavBarMenu .VPNavBarMenuGroup')];
      const menuRight=menuItems.length?Math.max(...menuItems.map(e=>e.getBoundingClientRect().right)):null;
      const lr=links.length?links[links.length-1].getBoundingClientRect():null;
      const wx=links.length?links[0].getBoundingClientRect():null;
      const br=b.getBoundingClientRect();
      return {gapQQ: lr?Math.round(br.x-lr.right):null, wechatX: wx?Math.round(wx.x):null, qqRight: lr?Math.round(lr.right):null, menuRight: menuRight?Math.round(menuRight):null, spaceMenuToWechat: (menuRight&&wx)?Math.round(wx.x-menuRight):null};
    })()`,returnByValue:true});
    return r.result.value;
  }
  for(const px of [16,20,24]){
    const m=await measure(px);
    console.log(`margin=${px}px -> gapQQ=${m.gapQQ}px | wechatX=${m.wechatX} qqRight=${m.qqRight} menuRight=${m.menuRight} spaceMenu-Wechat=${m.spaceMenuToWechat}px`);
  }
  ws.close();process.exit(0);
}
main().catch(e=>{console.error('ERR',e);process.exit(1)});
