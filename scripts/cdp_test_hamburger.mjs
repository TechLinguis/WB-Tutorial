import { createHash, randomBytes } from 'crypto';
import http from 'http';
import { EventEmitter } from 'events';

const PORT = 9222;
function getJSON(url){return new Promise((res,rej)=>{http.get(url,r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>res(JSON.parse(d)))}).on('error',rej)})}

class WS extends EventEmitter {
  constructor(url){super();this.buf=Buffer.alloc(0);const u=new URL(url);
    const key=createHash('sha1').update('x'+Date.now()).digest('base64');
    const req=http.request({host:u.hostname,port:u.port,path:u.pathname+u.search,headers:{Connection:'Upgrade',Upgrade:'websocket','Sec-WebSocket-Key':key,'Sec-WebSocket-Version':'13'}});
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
      const op=b0&0x0f;
      if(op===1){try{this.emit('msg',JSON.parse(payload.toString()))}catch(e){}}
    }
  }
  send(obj){const p=Buffer.from(JSON.stringify(obj));let header;
    if(p.length<126){header=Buffer.from([0x81,0x80|p.length]);}
    else{header=Buffer.from([0x81,0xfe,p.length>>8&255,p.length&255]);}
    const mask=randomBytes(4);const m=Buffer.alloc(p.length);for(let i=0;i<p.length;i++)m[i]=p[i]^mask[i%4];
    this.sock.write(Buffer.concat([header,mask,m]));
  }
}

const targets=await getJSON('http://localhost:'+PORT+'/json');
const page=targets.find(t=>t.type==='page')||targets[0];
const ws=new WS(page.webSocketDebuggerUrl);
let id=0;const pending={};const consoleMsgs=[];
ws.on('msg',m=>{
  if(m.id&&pending[m.id]){pending[m.id](m);delete pending[m.id];}
  if(m.method==='Runtime.consoleAPICalled'){const t=m.params.args.map(a=>a.value||a.description).join(' ');consoleMsgs.push(`[${m.params.type}] ${t}`);}
  if(m.method==='Runtime.exceptionThrown'){consoleMsgs.push(`[EXCEPTION] ${m.params.exceptionDetails.text} ${m.params.exceptionDetails.exception?.description||''}`);}
});
function cmd(method,params={}){return new Promise((res)=>{const i=++id;pending[i]=res;ws.send({id:i,method,params})})}

await new Promise(r=>setTimeout(r,500));
await cmd('Page.enable');
await cmd('Runtime.enable');
await cmd('Page.navigate',{url:'http://localhost:4173/'});
await new Promise(r=>setTimeout(r,5000));

// Check pre-click state
const before = await cmd('Runtime.evaluate',{expression:`(()=>{
  const burger=document.querySelector('.VPNavBarHamburger');
  const screen=document.querySelector('.VPNavScreen');
  return {
    burgerExists: !!burger,
    burgerAriaLabel: burger?.getAttribute('aria-label'),
    burgerRect: burger?JSON.parse(JSON.stringify(burger.getBoundingClientRect())):null,
    screenExists: !!screen,
    screenStyle: screen?getComputedStyle(screen).display:null
  };
})()`,returnByValue:true});
console.log('BEFORE CLICK:', JSON.stringify(before.result?.result?.value,null,2));

// Simulate clicking the hamburger
await cmd('Runtime.evaluate',{expression:`document.querySelector('.VPNavBarHamburger').click()`});
await new Promise(r=>setTimeout(r,1000));

// Check post-click state
const after = await cmd('Runtime.evaluate',{expression:`(()=>{
  const burger=document.querySelector('.VPNavBarHamburger');
  const screen=document.querySelector('.VPNavScreen');
  const isActive = burger?.classList.contains('active');
  return {
    burgerActive: isActive,
    screenStyle: screen?getComputedStyle(screen).display:null,
    screenOpacity: screen?getComputedStyle(screen).opacity:null,
    screenInDom: !!screen,
    menuLinksCount: document.querySelectorAll('.VPNavScreenMenuLink').length
  };
})()`,returnByValue:true});
console.log('AFTER CLICK:', JSON.stringify(after.result?.result?.value,null,2));

console.log('=== CONSOLE / ERRORS ===');
consoleMsgs.forEach(m=>console.log(m));
console.log('Total messages:', consoleMsgs.length);
process.exit(0);
