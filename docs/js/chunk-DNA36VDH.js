var m="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",A={};function E(l,r){if(!A[l]){A[l]={};for(let n=0;n<l.length;n++)A[l][l.charAt(n)]=n}return A[l][r]}function b(l){return l==null?"":M(l,6,r=>m.charAt(r))}function L(l){return l==null?"":l==""?null:(l=l.replaceAll(" ","+"),w(l.length,32,r=>E(m,l.charAt(r))))}function M(l,r,n){if(l==null)return"";let p=[],d={},k={},s,f,a,v="",u="",g="",i=2,c=3,h=2,e=0,o=0;for(f=0;f<l.length;f+=1)if(v=l.charAt(f),Object.prototype.hasOwnProperty.call(d,v)||(d[v]=c++,k[v]=!0),g=u+v,Object.prototype.hasOwnProperty.call(d,g))u=g;else{if(Object.prototype.hasOwnProperty.call(k,u)){if(u.charCodeAt(0)<256){for(s=0;s<h;s++)e=e<<1,o==r-1?(o=0,p.push(n(e)),e=0):o++;for(a=u.charCodeAt(0),s=0;s<8;s++)e=e<<1|a&1,o==r-1?(o=0,p.push(n(e)),e=0):o++,a=a>>1}else{for(a=1,s=0;s<h;s++)e=e<<1|a,o==r-1?(o=0,p.push(n(e)),e=0):o++,a=0;for(a=u.charCodeAt(0),s=0;s<16;s++)e=e<<1|a&1,o==r-1?(o=0,p.push(n(e)),e=0):o++,a=a>>1}i--,i==0&&(i=Math.pow(2,h),h++),delete k[u]}else for(a=d[u],s=0;s<h;s++)e=e<<1|a&1,o==r-1?(o=0,p.push(n(e)),e=0):o++,a=a>>1;i--,i==0&&(i=Math.pow(2,h),h++),d[g]=c++,u=String(v)}if(u!==""){if(Object.prototype.hasOwnProperty.call(k,u)){if(u.charCodeAt(0)<256){for(s=0;s<h;s++)e=e<<1,o==r-1?(o=0,p.push(n(e)),e=0):o++;for(a=u.charCodeAt(0),s=0;s<8;s++)e=e<<1|a&1,o==r-1?(o=0,p.push(n(e)),e=0):o++,a=a>>1}else{for(a=1,s=0;s<h;s++)e=e<<1|a,o==r-1?(o=0,p.push(n(e)),e=0):o++,a=0;for(a=u.charCodeAt(0),s=0;s<16;s++)e=e<<1|a&1,o==r-1?(o=0,p.push(n(e)),e=0):o++,a=a>>1}i--,i==0&&(i=Math.pow(2,h),h++),delete k[u]}else for(a=d[u],s=0;s<h;s++)e=e<<1|a&1,o==r-1?(o=0,p.push(n(e)),e=0):o++,a=a>>1;i--,i==0&&(i=Math.pow(2,h),h++)}for(a=2,s=0;s<h;s++)e=e<<1|a&1,o==r-1?(o=0,p.push(n(e)),e=0):o++,a=a>>1;for(;;)if(e=e<<1,o==r-1){p.push(n(e));break}else o++;return p.join("")}function w(l,r,n){let p=[],d,k=4,s=4,f=3,a="",v=[],u,g,i,c,h,e,o,t={val:n(0),position:r,index:1};for(u=0;u<3;u+=1)p[u]=u;for(i=0,h=Math.pow(2,2),e=1;e!=h;)c=t.val&t.position,t.position>>=1,t.position==0&&(t.position=r,t.val=n(t.index++)),i|=(c>0?1:0)*e,e<<=1;switch(d=i){case 0:for(i=0,h=Math.pow(2,8),e=1;e!=h;)c=t.val&t.position,t.position>>=1,t.position==0&&(t.position=r,t.val=n(t.index++)),i|=(c>0?1:0)*e,e<<=1;o=String.fromCharCode(i);break;case 1:for(i=0,h=Math.pow(2,16),e=1;e!=h;)c=t.val&t.position,t.position>>=1,t.position==0&&(t.position=r,t.val=n(t.index++)),i|=(c>0?1:0)*e,e<<=1;o=String.fromCharCode(i);break;case 2:return""}for(p[3]=o,g=o,v.push(o);;){if(t.index>l)return"";for(i=0,h=Math.pow(2,f),e=1;e!=h;)c=t.val&t.position,t.position>>=1,t.position==0&&(t.position=r,t.val=n(t.index++)),i|=(c>0?1:0)*e,e<<=1;switch(o=i){case 0:for(i=0,h=Math.pow(2,8),e=1;e!=h;)c=t.val&t.position,t.position>>=1,t.position==0&&(t.position=r,t.val=n(t.index++)),i|=(c>0?1:0)*e,e<<=1;p[s++]=String.fromCharCode(i),o=s-1,k--;break;case 1:for(i=0,h=Math.pow(2,16),e=1;e!=h;)c=t.val&t.position,t.position>>=1,t.position==0&&(t.position=r,t.val=n(t.index++)),i|=(c>0?1:0)*e,e<<=1;p[s++]=String.fromCharCode(i),o=s-1,k--;break;case 2:return v.join("")}if(k==0&&(k=Math.pow(2,f),f++),p[o])a=p[o];else if(o===s&&typeof g=="string")a=g+g.charAt(0);else return null;v.push(a),p[s++]=g+a.charAt(0),k--,g=a,k==0&&(k=Math.pow(2,f),f++)}}var W=class{constructor(r,n){W.SharedWorkerSupported?this.ActualWorker=new SharedWorker(r,n):this.ActualWorker=new Worker(r,n)}get onmessage(){var r;return W.SharedWorkerSupported?(r=this.ActualWorker)==null?void 0:r.port.onmessage:this.ActualWorker.onmessage}set onmessage(r){W.SharedWorkerSupported?this.ActualWorker.port.onmessage=r:this.ActualWorker.onmessage=r}get onmessageerror(){var r;return W.SharedWorkerSupported?(r=this.ActualWorker)==null?void 0:r.port.onmessageerror:this.ActualWorker.onmessageerror}set onmessageerror(r){W.SharedWorkerSupported?this.ActualWorker.port.onmessageerror=r:this.ActualWorker.onmessageerror=r}start(){var r;if(W.SharedWorkerSupported)return(r=this.ActualWorker)==null?void 0:r.port.start()}postMessage(r,n){var p;return W.SharedWorkerSupported?(p=this.ActualWorker)==null?void 0:p.port.postMessage(r,n):this.ActualWorker.postMessage(r,n)}terminate(){var r;return W.SharedWorkerSupported?(r=this.ActualWorker)==null?void 0:r.port.close():this.ActualWorker.terminate()}close(){return this.terminate()}get port(){return this.ActualWorker.port}get onerror(){return this.ActualWorker.onerror}set onerror(r){this.ActualWorker.onerror=r}addEventListener(r,n,p){var d;return W.SharedWorkerSupported&&r!=="error"?(d=this.ActualWorker)==null?void 0:d.port.addEventListener(r,n,p):this.ActualWorker.addEventListener(r,n,p)}removeEventListener(r,n,p){var d;return W.SharedWorkerSupported&&r!=="error"?(d=this.ActualWorker)==null?void 0:d.port.removeEventListener(r,n,p):this.ActualWorker.removeEventListener(r,n,p)}dispatchEvent(r){return this.ActualWorker.dispatchEvent(r)}},S=W;S.SharedWorkerSupported="SharedWorker"in globalThis;var C=S;export{b as a,L as b,C as c};
//# sourceMappingURL=chunk-DNA36VDH.js.map
