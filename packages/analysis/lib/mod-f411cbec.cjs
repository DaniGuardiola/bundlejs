"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});let r;const o=async()=>{if(r)return r;const e=await Promise.resolve().then(()=>require("./wasm-aea94250.cjs")),{default:s,source:t}=e;return await s(await t()),r=e};async function a(e,s=4096,t=6,c=22){const{compress:n}=await o();return n(e,s,t,c)}async function i(e,s=4096){const{decompress:t}=await o();return t(e,s)}exports.compress=a;exports.decompress=i;exports.getWASM=o;
//# sourceMappingURL=mod-f411cbec.cjs.map
