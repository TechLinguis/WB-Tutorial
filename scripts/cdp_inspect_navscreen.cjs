const http = require('http');
const crypto = require('crypto');
const { EventEmitter } = require('events');

const PORT = 9222;
function getJSON(url){return new Promise((res,rej)=>{http.get(url,r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>res(JSON.parse(d)))}).on('error',rej)})}

class WS extends EventEmitter {
  constructor(url){super();this.buf=Buffer.alloc(0);const u=new URL(url);
    const key=crypto.createHash('sha1').update('x'+Date.now()).digest('base64');
    const req=http.request({host:u.hostname,port:u.port,path:u.pathname+u.search,headers:{Connection:'Upgrade',Upgrade:'websocket','Sec-WebSocket-Key':key,'Sec-WebSocket-Version':13}});
    req.on('upgrade',(res,socket)=>{this.sock=socket;socket.on('data',d=>this._onData(d));socket.on('error',e=>this.emit('error',e))});
    req.end();
  }
  _onData(data){this.buf=Buffer.concat([this.buf,data]);
    while(this.buf.length>=2){
      const b0=this.buf[0],b1=this.buf[1];
      const masked=(b1&0x80)===0x80; let len=b1&0x7f; let off=2;
      if(len===126){if(this.buf.length<4)return;len=this.buf.readUInt16BE(2);off=4;}
      else if(len===127){if(this.buf.length<10)return;len=Number(this.buf.readBigUInt64BE(2));off=10;}
      const need=off+len; if(this.buf.length<need)return;
      let payload=this.buf.slice(off,need);
      if(masked){const m=this.buf.slice(off-4,off);const u=Buffer.alloc(len);for(let i=0;i<len;i++)u[i]=payload[i]^m[i%4];payload=u;}
      this.buf=this.buf.slice(need);
      const op=b0&0xf;
      if(op===1){try{this.emit('msg',JSON.parse(payload))}catch(e){}}
    }
  }
  send(obj){const p=Buffer.from(JSON.stringify(obj));let header;
    if(p.length<126){header=Buffer.from([0x81,0x80|p.length]);}
    else{header=Buffer.from([0x81,0xfe,p.length>>8&255,p.length&255]);}
    const mask=crypto.randomBytes(4);const m=Buffer.alloc(p.length);for(let i=0;i<p.length;i++)m[i]=p[i]^mask[i%4];
    this.sock.write(Buffer.concat([header,mask,m]));
  }
}

async function main(){
  const targets=await getJSON('http://localhost:'+PORT+'/json');
  const page=targets.find(t=>t.type==='page')||targets[0];
  const ws=new WS(page.webSocketDebuggerUrl);
  let id=0;const pending={};
  ws.on('msg',m=>{if(m.id&&pending[m.id]){pending[m.id](m);delete pending[m.id];}});
  function cmd(method,params={}){return new Promise((res)=>{const i=++id;pending[i]=res;ws.send({id:i,method,params})})}

  await new Promise(r=>setTimeout(r,500));

  // Clear cache and do hard reload
  await cmd('Network.enable');
  await cmd('Network.setCacheDisabled',{cacheDisabled:true});
  await cmd('Page.navigate',{url:'http://localhost:4173/?_nocache='+Date.now()});
  await new Promise(r=>setTimeout(r,5000));

  // Click hamburger
  await cmd('Runtime.evaluate',{expression:'document.querySelector(".VPNavBarHamburger").click()'});
  await new Promise(r=>setTimeout(r,1200));

  // Check VPNavScreen
  const expr = `(()=>{
    const screen = document.querySelector('.VPNavScreen');
    if (!screen) return { error: 'no screen' };
    const cs = getComputedStyle(screen);
    const rect = screen.getBoundingClientRect();

    // Find ALL rules matching VPNavScreen and their sources
    const sheets = Array.from(document.styleSheets).filter(s => { try { return true; } catch(e) { return false; } });
    const allRules = [];
    for (const sheet of sheets) {
      try {
        for (const rule of sheet.cssRules) {
          if (rule.selectorText && rule.selectorText.includes('VPNavScreen')) {
            const h = rule.style.getPropertyValue('height') || '';
            const imp = rule.style.getPropertyPriority('height') || '';
            allRules.push({
              selector: rule.selectorText,
              height: h,
              important: imp,
              href: sheet.href ? sheet.href.substring(sheet.href.lastIndexOf('/')+1) : 'inline'
            });
          }
        }
      } catch(e) {}
    }

    return {
      computedHeight: cs.height,
      computedMinHeight: cs.minHeight,
      computedMaxHeight: cs.maxHeight,
      rectHeight: rect.height,
      rectBottom: rect.bottom,
      scrollHeight: screen.scrollHeight,
      inlineStyle: screen.getAttribute('style'),
      allMatchingRules: allRules
    };
  })()`;

  const info = await cmd('Runtime.evaluate',{expression:expr, returnByValue:true});
  console.log(JSON.stringify(info.result?.result?.value, null, 2));
  process.exit(0);
}
main().catch(e=>{console.error(e);process.exit(1)});
