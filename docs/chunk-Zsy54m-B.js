import {ai as wr$1}from'./chunk-B3iCqdgg.js';import {du as O$1,go as R,aw as po$1,N as qn,ds as Y0,cz as kp$1,cN as Ct$1,ga as nt$1,fn as V$1,eE as my,e2 as Sp$1,v as vS,dc as ls,f8 as a1,ch as Jn,X as Xi,J as Ji,Z as Zi,Y as Yi,Q as Qi,t as ta,e as ea,r as ra,n as na,o as oa,s as sa,i as ia,b as r0,c as e0,d as aa,aj as qa,f as ca,u as ua,l as la,p as pa,h as Yo$1,m as ma,k as fa,q as ha,w as da,x as ga,y as xa,z as ba,A as wa,C as ya,D as n0,F as Ea,I as va,K as ka,L as Ta,M as $a,S as Sa,O as Na,P as Ia,U as Aa,V as Da,W as Ma,_ as _a,a4 as Ra,a6 as a0,a8 as Ba,ab as Ga,ac as Ca,ae as Oa,af as Pa,ag as La,ah as Wa,ai as Xn,ak as Zn,al as Yn,am as za,an as Ua,ao as Ka,ap as Va,ar as Qo$1,aq as Ha,as as ja,at as Xa,au as Ja,av as Za,az as Ya,aA as Qa,aB as tc$1,aC as ec,aE as rc$1,aG as oc$1,aH as nc$1,aI as sc$1,ay as p0,aS as ic$1,aN as ac$1,aO as cc$1,aP as h0,aQ as f0,aR as uc$1,aT as lc$1,aV as pc$1,aW as mc$1,aZ as fc$1,a_ as hc$1,b0 as gc$1,b1 as xc$1,b2 as bc$1,b3 as dc$1,b5 as yc$1,b6 as wc$1,b9 as Ec$1,ba as vc$1,bd as Tc$1,be as $c$1,bg as kc$1,bh as Sc$1,bi as Nc$1,bj as Ic$1,bl as Ac$1,bm as Fa,bn as Dc$1,bp as Mc$1,bq as Bc$1,br as _c$1,bs as Rc$1,bt as x0,bu as Fc$1,bv as g0,bw as Gc$1,bx as bu$1,by as Cc$1,bz as Oc$1,bB as Pc$1,bC as Wc$1,bD as qc$1,bE as Uc$1,bF as Hc$1,bG as Vc$1,bI as Kc$1,bJ as zc$1,bK as Yc$1,bL as jc$1,bM as Jc$1,bN as Qc$1,bO as tu$1,bP as eu$1,bQ as ru$1,bR as ou$1,bS as Zc$1,bT as Xc$1,bU as b0,bV as nu$1,bW as su$1,bX as xu$1,bY as iu$1,bZ as au$1,b_ as cu$1,b$ as uu$1,c3 as lu$1,c6 as Lc$1,c7 as tn$1,c8 as pu$1,c9 as mu$1,ca as en$1,cb as fu$1,cc as hu$1,cd as du$1,cg as gu$1,fa as Qp$1,gm as Gr$1,gw as _e,fZ as Dm$1,fH as Wn,cL as Vr$1}from'./chunk-BHbI4SeR.js';import {D,A as A$1}from'./main-D47UKO2Q.js';vS();vS();var je={};A$1(je,{assertNotComplex:()=>ce,bindCanvasToFramebuffer:()=>cm,bindColorTextureToFramebuffer:()=>gt,bindTextureToProgramUniformSampler:()=>Ur,bindTextureUnit:()=>nc,bindVertexBufferToProgramAttribute:()=>At,callAndCheck:()=>I,canBeRepresented:()=>Ir,createFragmentShader:()=>Er,createFramebuffer:()=>Or,createProgram:()=>kr,createStaticIndexBuffer:()=>Fr,createStaticVertexBuffer:()=>Ar,createTexture:()=>Dr,createVertexShader:()=>Nr,getBatchDim:()=>Ce,getExtensionOrThrow:()=>Xe,getFramebufferErrorMessage:()=>sc,getMaxTexturesInShader:()=>Mr,getNumChannels:()=>im,getProgramUniformLocation:()=>Br,getProgramUniformLocationOrThrow:()=>Lr,getRowsCols:()=>be,getShapeAs3D:()=>qe,getTextureShapeFromLogicalShape:()=>Vr,getWebGLDisjointQueryTimerVersion:()=>Gr,getWebGLErrorMessage:()=>rc,getWebGLMaxTextureSize:()=>Wr,hasExtension:()=>ee,isCapableOfRenderingToFloatTexture:()=>zr,isDownloadFloatTextureEnabled:()=>Hr,isReshapeFree:()=>Ie,isWebGLFenceEnabled:()=>Xr,isWebGLVersionEnabled:()=>Dt,linkProgram:()=>_r,logShaderSourceAndInfoLog:()=>_t,resetMaxTextureSize:()=>lm,resetMaxTexturesInShader:()=>um,unbindColorTextureFromFramebuffer:()=>Ft,unbindTextureUnit:()=>am,validateFramebuffer:()=>Ke,validateProgram:()=>xt,validateTextureSize:()=>Pr});vS();vS();var Ae={},It={alpha:false,antialias:false,premultipliedAlpha:false,preserveDrawingBuffer:false,depth:false,stencil:false,failIfMajorPerformanceCaveat:true};function Rr(o,t){Ae[o]=t;}function J(o,t){if(!(o in Ae)||t!=null){let r=tm(o,t);if(r!==null)Ae[o]=r;else return console.log("Could not get context for WebGL version",o),null}let e=Ae[o];return e==null||e.isContextLost()?(delete Ae[o],J(o)):(e.disable(e.DEPTH_TEST),e.disable(e.STENCIL_TEST),e.disable(e.BLEND),e.disable(e.DITHER),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SAMPLE_COVERAGE),e.enable(e.SCISSOR_TEST),e.enable(e.CULL_FACE),e.cullFace(e.BACK),Ae[o])}function em(o){if(!O$1().getBool("IS_SAFARI")&&typeof OffscreenCanvas<"u"&&o===2)return new OffscreenCanvas(300,150);if(typeof document<"u")return document.createElement("canvas");throw new Error("Cannot create a canvas in this context")}function tm(o,t){if(o!==1&&o!==2)throw new Error("Cannot get WebGL rendering context, WebGL is disabled.");let e=t??em(o);return e.addEventListener("webglcontextlost",r=>{r.preventDefault(),delete Ae[o];},false),O$1().getBool("SOFTWARE_WEBGL_ENABLED")&&(It.failIfMajorPerformanceCaveat=false),o===1?e.getContext("webgl",It)||e.getContext("experimental-webgl",It):e.getContext("webgl2",It)}vS();var Fe=(function(o){return o[o.DENSE=0]="DENSE",o[o.SHARED_BATCH=1]="SHARED_BATCH",o})(Fe||{}),K=(function(o){return o[o.RENDER=0]="RENDER",o[o.UPLOAD=1]="UPLOAD",o[o.PIXELS=2]="PIXELS",o[o.DOWNLOAD=3]="DOWNLOAD",o})(K||{}),X=(function(o){return o[o.UNPACKED_FLOAT16=0]="UNPACKED_FLOAT16",o[o.UNPACKED_FLOAT32=1]="UNPACKED_FLOAT32",o[o.PACKED_4X1_UNSIGNED_BYTE=2]="PACKED_4X1_UNSIGNED_BYTE",o[o.PACKED_2X2_FLOAT32=3]="PACKED_2X2_FLOAT32",o[o.PACKED_2X2_FLOAT16=4]="PACKED_2X2_FLOAT16",o})(X||{});function De(o,t){return [t,o]}function tc(o,t){return o*t}function ft(o){let t=R.sizeFromShape(o),e=Math.ceil(t/4);return R.sizeToSquarishShape(e)}function me(o,t){return [Math.max(1,Math.ceil(t/2)),Math.max(1,Math.ceil(o/2))]}function oc(o,t){let[e,r]=me(o,t);return e*r*4}function ht(o,t){let e=o,r,n,s,i,c,a,l,u,p,d;return O$1().getNumber("WEBGL_VERSION")===2?(r=e.R32F,n=e.R16F,s=e.RGBA16F,i=e.RGBA32F,c=e.RED,l=4,u=1,p=e.HALF_FLOAT,d=e.FLOAT,a=e.RGBA8):(r=o.RGBA,n=o.RGBA,s=o.RGBA,i=e.RGBA,c=o.RGBA,l=4,u=4,p=t!=null?t.HALF_FLOAT_OES:null,d=o.FLOAT,a=o.RGBA),{internalFormatFloat:r,internalFormatHalfFloat:n,internalFormatPackedHalfFloat:s,internalFormatPackedFloat:i,textureFormatFloat:c,downloadTextureFormat:a,downloadUnpackNumChannels:l,defaultNumChannels:u,textureTypeHalfFloat:p,textureTypeFloat:d}}function I(o,t){let e=t();return O$1().getBool("DEBUG")&&om(o),e}function om(o){let t=o.getError();if(t!==o.NO_ERROR)throw new Error("WebGL Error: "+rc(o,t))}var rm=596e-10,nm=65504;function Ir(o){return !!(O$1().getBool("WEBGL_RENDER_FLOAT32_ENABLED")||o===0||rm<Math.abs(o)&&Math.abs(o)<nm)}function rc(o,t){switch(t){case o.NO_ERROR:return "NO_ERROR";case o.INVALID_ENUM:return "INVALID_ENUM";case o.INVALID_VALUE:return "INVALID_VALUE";case o.INVALID_OPERATION:return "INVALID_OPERATION";case o.INVALID_FRAMEBUFFER_OPERATION:return "INVALID_FRAMEBUFFER_OPERATION";case o.OUT_OF_MEMORY:return "OUT_OF_MEMORY";case o.CONTEXT_LOST_WEBGL:return "CONTEXT_LOST_WEBGL";default:return `Unknown error code ${t}`}}function Xe(o,t){return ge(o,()=>o.getExtension(t),'Extension "'+t+'" not supported on this browser.')}function Nr(o,t){let e=ge(o,()=>o.createShader(o.VERTEX_SHADER),"Unable to create vertex WebGLShader.");if(I(o,()=>o.shaderSource(e,t)),I(o,()=>o.compileShader(e)),o.getShaderParameter(e,o.COMPILE_STATUS)===false)throw console.log(o.getShaderInfoLog(e)),new Error("Failed to compile vertex shader.");return e}function Er(o,t){let e=ge(o,()=>o.createShader(o.FRAGMENT_SHADER),"Unable to create fragment WebGLShader.");if(I(o,()=>o.shaderSource(e,t)),I(o,()=>o.compileShader(e)),O$1().get("ENGINE_COMPILE_ONLY"))return e;if(o.getShaderParameter(e,o.COMPILE_STATUS)===false)throw _t(t,o.getShaderInfoLog(e)),new Error("Failed to compile fragment shader.");return e}var sm=/ERROR: [0-9]+:([0-9]+):/g;function _t(o,t){let e=sm.exec(t);if(e==null){console.log(`Couldn't parse line number in error: ${t}`),console.log(o);return}let r=+e[1],n=o.split(`
`),s=n.length.toString().length+2,i=n.map((p,d)=>R.rightPad((d+1).toString(),s)+p),c=0;for(let p=0;p<i.length;p++)c=Math.max(i[p].length,c);let a=i.slice(0,r-1),l=i.slice(r-1,r),u=i.slice(r);console.log(a.join(`
`)),console.log(t.split(`
`)[0]),console.log(`%c ${R.rightPad(l[0],c)}`,"border:1px solid red; background-color:#e3d2d2; color:#a61717"),console.log(u.join(`
`));}function kr(o){return ge(o,()=>o.createProgram(),"Unable to create WebGLProgram.")}function _r(o,t){if(I(o,()=>o.linkProgram(t)),!O$1().get("ENGINE_COMPILE_ONLY")&&o.getProgramParameter(t,o.LINK_STATUS)===false)throw console.log(o.getProgramInfoLog(t)),new Error("Failed to link vertex and fragment shaders.")}function xt(o,t){if(I(o,()=>o.validateProgram(t)),o.getProgramParameter(t,o.VALIDATE_STATUS)===false)throw console.log(o.getProgramInfoLog(t)),new Error("Shader program validation failed.")}function Ar(o,t){let e=ge(o,()=>o.createBuffer(),"Unable to create WebGLBuffer");return I(o,()=>o.bindBuffer(o.ARRAY_BUFFER,e)),I(o,()=>o.bufferData(o.ARRAY_BUFFER,t,o.STATIC_DRAW)),e}function Fr(o,t){let e=ge(o,()=>o.createBuffer(),"Unable to create WebGLBuffer");return I(o,()=>o.bindBuffer(o.ELEMENT_ARRAY_BUFFER,e)),I(o,()=>o.bufferData(o.ELEMENT_ARRAY_BUFFER,t,o.STATIC_DRAW)),e}function im(){return O$1().getNumber("WEBGL_VERSION")===2?1:4}function Dr(o){return ge(o,()=>o.createTexture(),"Unable to create WebGLTexture.")}function Pr(o,t){let e=O$1().getNumber("WEBGL_MAX_TEXTURE_SIZE");if(o<=0||t<=0){let r=`[${o}x${t}]`;throw new Error("Requested texture size "+r+" is invalid.")}if(o>e||t>e){let r=`[${o}x${t}]`,n=`[${e}x${e}]`;throw new Error("Requested texture size "+r+" greater than WebGL maximum on this browser / GPU "+n+".")}}function Or(o){return ge(o,()=>o.createFramebuffer(),"Unable to create WebGLFramebuffer.")}function At(o,t,e,r,n,s,i){let c=o.getAttribLocation(t,e);return c===-1?false:(I(o,()=>o.bindBuffer(o.ARRAY_BUFFER,r)),I(o,()=>o.vertexAttribPointer(c,n,o.FLOAT,false,s,i)),I(o,()=>o.enableVertexAttribArray(c)),true)}function nc(o,t,e){ic(o,e),I(o,()=>o.activeTexture(o.TEXTURE0+e)),I(o,()=>o.bindTexture(o.TEXTURE_2D,t));}function am(o,t){ic(o,t),I(o,()=>o.activeTexture(o.TEXTURE0+t)),I(o,()=>o.bindTexture(o.TEXTURE_2D,null));}function Lr(o,t,e){return ge(o,()=>o.getUniformLocation(t,e),'uniform "'+e+'" not present in program.')}function Br(o,t,e){return o.getUniformLocation(t,e)}function Ur(o,t,e,r){I(o,()=>nc(o,t,r)),I(o,()=>o.uniform1i(e,r));}function cm(o){I(o,()=>o.bindFramebuffer(o.FRAMEBUFFER,null)),I(o,()=>o.viewport(0,0,o.canvas.width,o.canvas.height)),I(o,()=>o.scissor(0,0,o.canvas.width,o.canvas.height));}function gt(o,t,e){I(o,()=>o.bindFramebuffer(o.FRAMEBUFFER,e)),I(o,()=>o.framebufferTexture2D(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,t,0));}function Ft(o,t){I(o,()=>o.bindFramebuffer(o.FRAMEBUFFER,t)),I(o,()=>o.framebufferTexture2D(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,null,0));}function Ke(o){let t=o.checkFramebufferStatus(o.FRAMEBUFFER);if(t!==o.FRAMEBUFFER_COMPLETE)throw new Error("Error binding framebuffer: "+sc(o,t))}function sc(o,t){switch(t){case o.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:return "FRAMEBUFFER_INCOMPLETE_ATTACHMENT";case o.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:return "FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT";case o.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:return "FRAMEBUFFER_INCOMPLETE_DIMENSIONS";case o.FRAMEBUFFER_UNSUPPORTED:return "FRAMEBUFFER_UNSUPPORTED";default:return `unknown error ${t}`}}function ge(o,t,e){let r=I(o,()=>t());if(r==null)throw new Error(e);return r}function ic(o,t){let e=o.MAX_COMBINED_TEXTURE_IMAGE_UNITS-1,r=t+o.TEXTURE0;if(r<o.TEXTURE0||r>e){let n=`[gl.TEXTURE0, gl.TEXTURE${e}]`;throw new Error(`textureUnit must be in ${n}.`)}}function Ce(o,t=2){return R.sizeFromShape(o.slice(0,o.length-t))}function be(o){if(o.length===0)throw Error("Cannot get rows and columns of an empty shape array.");return [o.length>1?o[o.length-2]:1,o[o.length-1]]}function qe(o){let t=[1,1,1];return o.length===0||o.length===1&&o[0]===1||(t=[Ce(o),...be(o)]),t}function Vr(o,t=false){let e=O$1().getNumber("WEBGL_MAX_TEXTURE_SIZE"),r=O$1().getNumber("WEBGL_MAX_SIZE_FOR_NARROW_TEXTURE");r===1/0&&O$1().getBool("WEBGL_AUTO_SQUARIFY_NARROW_TEXTURE_SHAPE")&&(r=e/2),t&&(e=e*2,r=r*2,o=o.map((c,a)=>a>=o.length-2?R.nearestLargerEven(o[a]):o[a]),o.length===1&&(o=[2,o[0]])),o.length!==2&&(o=R.squeezeShape(o).newShape);let n=R.sizeFromShape(o),s=null;o.length<=1&&n<=e?s=[1,n]:o.length===2&&o[0]<=e&&o[1]<=e?s=o:o.length===3&&o[0]*o[1]<=e&&o[2]<=e?s=[o[0]*o[1],o[2]]:o.length===3&&o[0]<=e&&o[1]*o[2]<=e?s=[o[0],o[1]*o[2]]:o.length===4&&o[0]*o[1]*o[2]<=e&&o[3]<=e?s=[o[0]*o[1]*o[2],o[3]]:o.length===4&&o[0]<=e&&o[1]*o[2]*o[3]<=e&&(s=[o[0],o[1]*o[2]*o[3]]);let i=s!=null&&Math.max(...s)>r&&Math.min(...s)<=(t?2:1)&&Math.min(...s)>0;if(s==null||i)if(t){let c=Ce(o),a=2,l=2;o.length&&([a,l]=be(o)),n=c*(a/2)*(l/2),s=R.sizeToSquarishShape(n).map(u=>u*2);}else s=R.sizeToSquarishShape(n);return s}function Nt(o){return o%2===0}function Ie(o,t){if(o=o.slice(-2),t=t.slice(-2),R.arraysEqual(o,t)||!o.length||!t.length||o[0]===0||o[1]===0||t[0]===0||t[1]===0)return  true;if(o.length!==t.length){let e=o[o.length-1],r=t[t.length-1];if(e===r||Nt(e)&&Nt(r)&&(o[0]===1||t[0]===1))return  true}return o[1]===t[1]&&Nt(o[0])&&Nt(t[0])}var Et,kt;function Wr(o){if(Et==null){let t=J(o);Et=t.getParameter(t.MAX_TEXTURE_SIZE);}return Et}function lm(){Et=null;}function um(){kt=null;}function Mr(o){if(kt==null){let t=J(o);kt=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS);}return Math.min(16,kt)}function Gr(o){if(o===0)return 0;let t,e=J(o);return ee(e,"EXT_disjoint_timer_query_webgl2")&&o===2?t=2:ee(e,"EXT_disjoint_timer_query")?t=1:t=0,t}function ee(o,t){return o.getExtension(t)!=null}function Dt(o){try{if(J(o)!=null)return !0}catch(t){return console.log("Error when getting WebGL context: ",t),false}return  false}function zr(o){if(o===0)return  false;let t=J(o);if(o===1){if(!ee(t,"OES_texture_float"))return  false}else if(!ee(t,"EXT_color_buffer_float"))return  false;return wr(t)}function Hr(o){if(o===0)return  false;let t=J(o);if(o===1){if(!ee(t,"OES_texture_float")||!ee(t,"WEBGL_color_buffer_float"))return  false}else {if(ee(t,"EXT_color_buffer_float"))return wr(t);let r="EXT_color_buffer_half_float";if(ee(t,r)){let n=t.getExtension(r);return pm(t,n)}return  false}return wr(t)}function wr(o){let t=ht(o),e=o.createTexture();o.bindTexture(o.TEXTURE_2D,e),o.texImage2D(o.TEXTURE_2D,0,t.internalFormatFloat,1,1,0,t.textureFormatFloat,t.textureTypeFloat,null);let s=o.createFramebuffer();o.bindFramebuffer(o.FRAMEBUFFER,s),o.framebufferTexture2D(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,e,0);let i=o.checkFramebufferStatus(o.FRAMEBUFFER)===o.FRAMEBUFFER_COMPLETE;return o.bindTexture(o.TEXTURE_2D,null),o.bindFramebuffer(o.FRAMEBUFFER,null),o.deleteTexture(e),o.deleteFramebuffer(s),i}function pm(o,t){let e=ht(o,t),r=o.createTexture();o.bindTexture(o.TEXTURE_2D,r),o.texImage2D(o.TEXTURE_2D,0,e.internalFormatHalfFloat,1,1,0,e.textureFormatFloat,e.textureTypeHalfFloat,null);let i=o.createFramebuffer();o.bindFramebuffer(o.FRAMEBUFFER,i),o.framebufferTexture2D(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,r,0);let c=o.checkFramebufferStatus(o.FRAMEBUFFER)===o.FRAMEBUFFER_COMPLETE;return o.bindTexture(o.TEXTURE_2D,null),o.bindFramebuffer(o.FRAMEBUFFER,null),o.deleteTexture(r),o.deleteFramebuffer(i),c}function Xr(o){return o!==2?false:J(o).fenceSync!=null}function ce(o,t){Array.isArray(o)||(o=[o]),o.forEach(e=>{e!=null&&R.assert(e.dtype!=="complex64",()=>`${t} does not support complex64 tensors in the WebGL backend.`);});}var k=O$1();k.registerFlag("HAS_WEBGL",()=>k.getNumber("WEBGL_VERSION")>0);k.registerFlag("WEBGL_VERSION",()=>Dt(2)?2:Dt(1)?1:0);k.registerFlag("WEBGL_CHECK_NUMERICAL_PROBLEMS",()=>false);k.registerFlag("WEBGL_BUFFER_SUPPORTED",()=>k.get("WEBGL_VERSION")===2);k.registerFlag("WEBGL_CPU_FORWARD",()=>true);k.registerFlag("WEBGL_FORCE_F16_TEXTURES",()=>false);k.registerFlag("WEBGL_PACK",()=>k.getBool("HAS_WEBGL"));k.registerFlag("WEBGL_PACK_NORMALIZATION",()=>k.getBool("WEBGL_PACK"));k.registerFlag("WEBGL_PACK_CLIP",()=>k.getBool("WEBGL_PACK"));k.registerFlag("WEBGL_PACK_DEPTHWISECONV",()=>k.getBool("WEBGL_PACK"));k.registerFlag("WEBGL_PACK_BINARY_OPERATIONS",()=>k.getBool("WEBGL_PACK"));k.registerFlag("WEBGL_PACK_UNARY_OPERATIONS",()=>k.getBool("WEBGL_PACK"));k.registerFlag("WEBGL_PACK_ARRAY_OPERATIONS",()=>k.getBool("WEBGL_PACK"));k.registerFlag("WEBGL_PACK_IMAGE_OPERATIONS",()=>k.getBool("WEBGL_PACK"));k.registerFlag("WEBGL_PACK_REDUCE",()=>k.getBool("WEBGL_PACK"));k.registerFlag("WEBGL_LAZILY_UNPACK",()=>k.getBool("WEBGL_PACK"));k.registerFlag("WEBGL_CONV_IM2COL",()=>k.getBool("WEBGL_PACK"));k.registerFlag("WEBGL_PACK_CONV2DTRANSPOSE",()=>k.getBool("WEBGL_PACK"));k.registerFlag("WEBGL_MAX_TEXTURE_SIZE",()=>Wr(k.getNumber("WEBGL_VERSION")));k.registerFlag("WEBGL_MAX_TEXTURES_IN_SHADER",()=>Mr(k.getNumber("WEBGL_VERSION")));k.registerFlag("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION",()=>{let o=k.getNumber("WEBGL_VERSION");return o===0?0:Gr(o)});k.registerFlag("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE",()=>k.getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")>0&&!ls.isMobile());k.registerFlag("WEBGL_RENDER_FLOAT32_CAPABLE",()=>zr(k.getNumber("WEBGL_VERSION")));k.registerFlag("WEBGL_RENDER_FLOAT32_ENABLED",()=>k.getBool("WEBGL_FORCE_F16_TEXTURES")?false:k.getBool("WEBGL_RENDER_FLOAT32_CAPABLE"));k.registerFlag("WEBGL_DOWNLOAD_FLOAT_ENABLED",()=>Hr(k.getNumber("WEBGL_VERSION")));k.registerFlag("WEBGL_FENCE_API_ENABLED",()=>Xr(k.getNumber("WEBGL_VERSION")));k.registerFlag("WEBGL_SIZE_UPLOAD_UNIFORM",()=>k.getBool("WEBGL_RENDER_FLOAT32_ENABLED")?4:0);k.registerFlag("WEBGL_DELETE_TEXTURE_THRESHOLD",()=>-1,o=>{if(typeof o!="number")throw new Error(`WEBGL_DELETE_TEXTURE_THRESHOLD must be a number but got ${o}.`);if(o<0&&o!==-1)throw new Error(`WEBGL_DELETE_TEXTURE_THRESHOLD must be -1 (indicating never delete) or at least 0, but got ${o}.`)});k.registerFlag("WEBGL_FLUSH_THRESHOLD",()=>ls.isMobile()?1:-1,o=>{if(typeof o!="number")throw new Error(`WEBGL_FLUSH_THRESHOLD must be a number but got ${o}.`);if(o<0&&o!==-1)throw new Error(`WEBGL_FLUSH_THRESHOLD must be -1 (indicating never manual flush) or at least 0, but got ${o}.`)});k.registerFlag("CPU_HANDOFF_SIZE_THRESHOLD",()=>128);k.registerFlag("WEBGL_USE_SHAPES_UNIFORMS",()=>false);k.registerFlag("TOPK_LAST_DIM_CPU_HANDOFF_SIZE_THRESHOLD",()=>1e5);k.registerFlag("TOPK_K_CPU_HANDOFF_THRESHOLD",()=>128);k.registerFlag("WEBGL_EXP_CONV",()=>false);k.registerFlag("SOFTWARE_WEBGL_ENABLED",()=>k.getBool("IS_TEST"));k.registerFlag("WEBGL_MAX_SIZE_FOR_NARROW_TEXTURE",()=>1/0);k.registerFlag("WEBGL_AUTO_SQUARIFY_NARROW_TEXTURE_SHAPE",()=>false);k.registerFlag("WEBGL2_ISNAN_CUSTOM",()=>false);k.registerFlag("ENGINE_COMPILE_ONLY",()=>false);vS();vS();function U(){let o,t,e,r,n,s,i,c,a,l;return O$1().getNumber("WEBGL_VERSION")===2?(o="#version 300 es",t="in",e="out",r="in",n="texture",s="outputColor",i="out vec4 outputColor;",c=O$1().getBool("WEBGL2_ISNAN_CUSTOM")?`
      bool isnan_custom(float val) {
        uint floatToUint = floatBitsToUint(val);
        return (floatToUint & 0x7fffffffu) > 0x7f800000u;
      }

      bvec4 isnan_custom(vec4 val) {
        return bvec4(isnan_custom(val.x),
          isnan_custom(val.y), isnan_custom(val.z), isnan_custom(val.w));
      }

      #define isnan(value) isnan_custom(value)
    `:"",a="",l=`
      #define round(value) newRound(value)
      int newRound(float value) {
        return int(floor(value + 0.5));
      }

      ivec4 newRound(vec4 value) {
        return ivec4(floor(value + vec4(0.5)));
      }
    `):(o="",t="attribute",e="varying",r="varying",n="texture2D",s="gl_FragColor",i="",c=`
      #define isnan(value) isnan_custom(value)
      bool isnan_custom(float val) {
        return (val > 0. || val < 1. || val == 0.) ? false : true;
      }
      bvec4 isnan_custom(vec4 val) {
        return bvec4(isnan(val.x), isnan(val.y), isnan(val.z), isnan(val.w));
      }
    `,a=`
      uniform float INFINITY;

      bool isinf(float val) {
        return abs(val) == INFINITY;
      }
      bvec4 isinf(vec4 val) {
        return equal(abs(val), vec4(INFINITY));
      }
    `,l=`
      int round(float value) {
        return int(floor(value + 0.5));
      }

      ivec4 round(vec4 value) {
        return ivec4(floor(value + vec4(0.5)));
      }
    `),{version:o,attribute:t,varyingVs:e,varyingFs:r,texture2D:n,output:s,defineOutput:i,defineSpecialNaN:c,defineSpecialInf:a,defineRound:l}}vS();vS();vS();function le(o,t,e="index"){let r=R.computeStrides(t);return r.map((n,s)=>{let i=`int ${o[s]} = ${e} / ${n}`,c=s===r.length-1?`int ${o[s+1]} = ${e} - ${o[s]} * ${n}`:`index -= ${o[s]} * ${n}`;return `${i}; ${c};`}).join("")}function Pe(o,t,e="index"){let r=R.computeStrides(t);return r.map((n,s)=>{let i=`int ${o[s]} = ${e} / outShapeStrides[${s}]`,c=s===r.length-1?`int ${o[s+1]} = ${e} - ${o[s]} * outShapeStrides[${s}]`:`index -= ${o[s]} * outShapeStrides[${s}]`;return `${i}; ${c};`}).join("")}function dm(o,t){let e=o.length,r=o.map(s=>`${t}[${s}]`),n=new Array(e-1);n[e-2]=r[e-1];for(let s=e-3;s>=0;--s)n[s]=`(${n[s+1]} * ${r[s+1]})`;return n}function ac(o,t,e="index"){let r=o.map((s,i)=>i),n=dm(r,t);return n.map((s,i)=>{let c=`int ${o[i]} = ${e} / ${n[i]}`,a=i===n.length-1?`int ${o[i+1]} = ${e} - ${o[i]} * ${n[i]}`:`index -= ${o[i]} * ${n[i]}`;return `${c}; ${a};`}).join("")}function Ye(o){let t=R.computeStrides(o).map(e=>e.toString());return `
  int getFlatIndex(ivec3 coords) {
    return coords.x * ${t[0]} + coords.y * ${t[1]} + coords.z;
  }
`}function Qe(){return `
  int getFlatIndex(ivec3 coords) {
    return coords.x * outShapeStrides[0] + coords.y * outShapeStrides[1] + coords.z;
  }
`}var Pt=`
  const float FLOAT_MAX = 1.70141184e38;
  const float FLOAT_MIN = 1.17549435e-38;

  lowp vec4 encode_float(highp float v) {
    if (isnan(v)) {
      return vec4(255, 255, 255, 255);
    }

    highp float av = abs(v);

    if(av < FLOAT_MIN) {
      return vec4(0.0, 0.0, 0.0, 0.0);
    } else if(v > FLOAT_MAX) {
      return vec4(0.0, 0.0, 128.0, 127.0) / 255.0;
    } else if(v < -FLOAT_MAX) {
      return vec4(0.0, 0.0,  128.0, 255.0) / 255.0;
    }

    highp vec4 c = vec4(0,0,0,0);

    highp float e = floor(log2(av));
    highp float m = exp2(fract(log2(av))) - 1.0;

    c[2] = floor(128.0 * m);
    m -= c[2] / 128.0;
    c[1] = floor(32768.0 * m);
    m -= c[1] / 32768.0;
    c[0] = floor(8388608.0 * m);

    highp float ebias = e + 127.0;
    c[3] = floor(ebias / 2.0);
    ebias -= c[3] * 2.0;
    c[2] += floor(ebias) * 128.0;

    c[3] += 128.0 * step(0.0, -v);

    return c / 255.0;
  }
`;var{getBroadcastDims:cc}=kp$1;function lc(o,t,e){let r=[];if(o.forEach(m=>{let f=R.sizeFromShape(m.shapeInfo.logicalShape);if(m.shapeInfo.isUniform?r.push(`uniform float ${m.name}${f>1?`[${f}]`:""};`):(r.push(`uniform sampler2D ${m.name};`),r.push(`uniform int offset${m.name};`)),e.enableShapeUniforms){let{uniformShape:h}=Ot(e.packedInputs,m.shapeInfo.logicalShape,m.shapeInfo.texShape);switch(h.length){case 1:r.push(`uniform int ${m.name}Shape;`);break;case 2:r.push(`uniform ivec2 ${m.name}Shape;`);break;case 3:r.push(`uniform ivec3 ${m.name}Shape;`);break;case 4:r.push(`uniform ivec4 ${m.name}Shape;`);break;}r.push(`uniform ivec2 ${m.name}TexShape;`);}}),e.enableShapeUniforms){switch(t.logicalShape.length){case 1:r.push("uniform int outShape;");break;case 2:r.push("uniform ivec2 outShape;"),r.push("uniform int outShapeStrides;");break;case 3:r.push("uniform ivec3 outShape;"),r.push("uniform ivec2 outShapeStrides;");break;case 4:r.push("uniform ivec4 outShape;"),r.push("uniform ivec3 outShapeStrides;");break;}r.push("uniform ivec2 outTexShape;");}e.customUniforms&&e.customUniforms.forEach(m=>{r.push(`uniform ${m.type} ${m.name}${m.arrayIndex?`[${m.arrayIndex}]`:""};`);});let n=r.join(`
`),s=o.map(m=>mm(m,t,e.packedInputs,e.enableShapeUniforms)).join(`
`),i=t.texShape,c=U(),a=xm(c),l,u,p=bm(c);return t.isPacked?(l=fm(t.logicalShape,i,e.enableShapeUniforms),u=Cm(c)):(l=hm(t.logicalShape,i,e.enableShapeUniforms),u=gm(c)),e.packedInputs&&(p+=ym),[p,a,u,n,l,s,e.userCode].join(`
`)}function Je(o,t=false){let e=o.shapeInfo.logicalShape;switch(e.length){case 0:return Pm(o,t);case 1:return Lm(o,t);case 2:return Um(o,t);case 3:return Wm(o,t);case 4:return Gm(o,t);case 5:return zm(o);case 6:return Hm(o);default:throw new Error(`${e.length}-D input sampling is not yet supported`)}}function uc(o,t){switch(o.shapeInfo.logicalShape.length){case 0:return Dm(o);case 1:return Om(o,t);case 2:return Bm(o,t);case 3:return Vm(o,t);default:return Mm(o,t)}}function mm(o,t,e=false,r){let n="";e?n+=uc(o,r):n+=Je(o,r);let s=o.shapeInfo.logicalShape,i=t.logicalShape;return s.length<=i.length&&(e?n+=Xm(o,t):n+=Km(o,t)),n}function fm(o,t,e){switch(o.length){case 0:return pc();case 1:return Rm(o,t,e);case 2:return Am(o,t,e);case 3:return wm(o,t,e);default:return Nm(o,t,e)}}function hm(o,t,e){switch(o.length){case 0:return pc();case 1:return Tm(o,t,e);case 2:return Fm(o,t,e);case 3:return Im(o,t,e);case 4:return Em(o,t,e);case 5:return km(o,t);case 6:return _m(o,t);default:throw new Error(`${o.length}-D output sampling is not yet supported`)}}function xm(o){return `
    float sampleTexture(sampler2D textureSampler, vec2 uv) {
      return ${o.texture2D}(textureSampler, uv).r;
    }
  `}function gm(o){return `
    void setOutput(float val) {
      ${o.output} = vec4(val, 0, 0, 0);
    }
  `}function Cm(o){return `
    void setOutput(vec4 val) {
      ${o.output} = val;
    }
  `}function bm(o){return `${o.version}
    precision highp float;
    precision highp int;
    precision highp sampler2D;
    ${o.varyingFs} vec2 resultUV;
    ${o.defineOutput}
    const vec2 halfCR = vec2(0.5, 0.5);

    struct ivec5
    {
      int x;
      int y;
      int z;
      int w;
      int u;
    };

    struct ivec6
    {
      int x;
      int y;
      int z;
      int w;
      int u;
      int v;
    };

    uniform float NAN;
    ${o.defineSpecialNaN}
    ${o.defineSpecialInf}
    ${o.defineRound}

    int imod(int x, int y) {
      return x - y * (x / y);
    }

    int idiv(int a, int b, float sign) {
      int res = a / b;
      int mod = imod(a, b);
      if (sign < 0. && mod != 0) {
        res -= 1;
      }
      return res;
    }

    //Based on the work of Dave Hoskins
    //https://www.shadertoy.com/view/4djSRW
    #define HASHSCALE1 443.8975
    float random(float seed){
      vec2 p = resultUV * seed;
      vec3 p3  = fract(vec3(p.xyx) * HASHSCALE1);
      p3 += dot(p3, p3.yzx + 19.19);
      return fract((p3.x + p3.y) * p3.z);
    }

    ${vm}
    ${$m}
    ${Sm}
  `}var vm=`
vec2 uvFromFlat(int texNumR, int texNumC, int index) {
  int texR = index / texNumC;
  int texC = index - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
vec2 packedUVfrom1D(int texNumR, int texNumC, int index) {
  int texelIndex = index / 2;
  int texR = texelIndex / texNumC;
  int texC = texelIndex - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
`,$m=`
vec2 packedUVfrom2D(int texelsInLogicalRow, int texNumR,
  int texNumC, int row, int col) {
  int texelIndex = (row / 2) * texelsInLogicalRow + (col / 2);
  int texR = texelIndex / texNumC;
  int texC = texelIndex - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
`,Sm=`
vec2 packedUVfrom3D(int texNumR, int texNumC,
    int texelsInBatch, int texelsInLogicalRow, int b,
    int row, int col) {
  int index = b * texelsInBatch + (row / 2) * texelsInLogicalRow + (col / 2);
  int texR = index / texNumC;
  int texC = index - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
`,ym=`
  float getChannel(vec4 frag, vec2 innerDims) {
    vec2 modCoord = mod(innerDims, 2.);
    return modCoord.x == 0. ?
      (modCoord.y == 0. ? frag.r : frag.g) :
      (modCoord.y == 0. ? frag.b : frag.a);
  }
  float getChannel(vec4 frag, int dim) {
    float modCoord = mod(float(dim), 2.);
    return modCoord == 0. ? frag.r : frag.g;
  }
`;function pc(){return `
    int getOutputCoords() {
      return 0;
    }
  `}function Rm(o,t,e){let r=[Math.ceil(t[0]/2),Math.ceil(t[1]/2)];return r[0]===1?e?`
      int getOutputCoords() {
        return 2 * int(resultUV.x * ceil(float(outTexShape[1]) / 2.0));
      }
    `:`
      int getOutputCoords() {
        return 2 * int(resultUV.x * ${r[1]}.0);
      }
    `:r[1]===1?e?`
      int getOutputCoords() {
        return 2 * int(resultUV.y * ceil(float(outTexShape[0]) / 2.0));
      }
    `:`
      int getOutputCoords() {
        return 2 * int(resultUV.y * ${r[0]}.0);
      }
    `:e?`
    int getOutputCoords() {
      ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(packedTexShape[0], packedTexShape[1]));
      return 2 * (resTexRC.x * packedTexShape[1] + resTexRC.y);
    }
  `:`
    int getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${r[0]}, ${r[1]}));
      return 2 * (resTexRC.x * ${r[1]} + resTexRC.y);
    }
  `}function Tm(o,t,e){return t[0]===1?e?`
      int getOutputCoords() {
        return int(resultUV.x * float(outTexShape[1]));
      }
    `:`
      int getOutputCoords() {
        return int(resultUV.x * ${t[1]}.0);
      }
    `:t[1]===1?e?`
      int getOutputCoords() {
        return int(resultUV.y * float(outTexShape[0]));
      }
    `:`
      int getOutputCoords() {
        return int(resultUV.y * ${t[0]}.0);
      }
    `:e?`
    int getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(outTexShape[0], outTexShape[1]));
      return resTexRC.x * outTexShape[1] + resTexRC.y;
    }
  `:`
    int getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${t[0]}, ${t[1]}));
      return resTexRC.x * ${t[1]} + resTexRC.y;
    }
  `}function wm(o,t,e){if(e)return `
    ivec3 getOutputCoords() {
      ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
      int texelsInLogicalRow = int(ceil(float(outShape[2]) / 2.0));
      int texelsInBatch = texelsInLogicalRow * int(ceil(float(outShape[1]) / 2.0));
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(packedTexShape[0], packedTexShape[1]));
      int index = resTexRC.x * packedTexShape[1] + resTexRC.y;

      int b = index / texelsInBatch;
      index -= b * texelsInBatch;

      int r = 2 * (index / texelsInLogicalRow);
      int c = imod(index, texelsInLogicalRow) * 2;

      return ivec3(b, r, c);
    }
  `;let r=[Math.ceil(t[0]/2),Math.ceil(t[1]/2)],n=Math.ceil(o[2]/2),s=n*Math.ceil(o[1]/2);return `
    ivec3 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${r[0]}, ${r[1]}));
      int index = resTexRC.x * ${r[1]} + resTexRC.y;

      int b = index / ${s};
      index -= b * ${s};

      int r = 2 * (index / ${n});
      int c = imod(index, ${n}) * 2;

      return ivec3(b, r, c);
    }
  `}function Im(o,t,e){if(e)return `
  ivec3 getOutputCoords() {
    ivec2 resTexRC = ivec2(resultUV.yx *
                           vec2(outTexShape[0], outTexShape[1]));
    int index = resTexRC.x * outTexShape[1] + resTexRC.y;
    ${Pe(["r","c","d"],o)}
    return ivec3(r, c, d);
  }
`;let r=le(["r","c","d"],o);return `
    ivec3 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${t[0]}, ${t[1]}));
      int index = resTexRC.x * ${t[1]} + resTexRC.y;
      ${r}
      return ivec3(r, c, d);
    }
  `}function Nm(o,t,e){if(e)return `
    ivec4 getOutputCoords() {
      ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(packedTexShape[0], packedTexShape[1]));
      int index = resTexRC.x * packedTexShape[1] + resTexRC.y;

      int texelsInLogicalRow = int(ceil(float(outShape[3]) / 2.0));
      int texelsInBatch = texelsInLogicalRow * int(ceil(float(outShape[2]) / 2.0));
      int texelsInBatchN = texelsInBatch * outShape[1];

      int b2 = index / texelsInBatchN;
      index -= b2 * texelsInBatchN;

      int b = index / texelsInBatch;
      index -= b * texelsInBatch;

      int r = 2 * (index / texelsInLogicalRow);
      int c = imod(index, texelsInLogicalRow) * 2;

      return ivec4(b2, b, r, c);
    }
  `;let r=[Math.ceil(t[0]/2),Math.ceil(t[1]/2)],n=Math.ceil(o[o.length-1]/2),s=n*Math.ceil(o[o.length-2]/2),i=s,c="",a="b, r, c";for(let l=2;l<o.length-1;l++)i*=o[o.length-l-1],c=`
      int b${l} = index / ${i};
      index -= b${l} * ${i};
    `+c,a=`b${l}, `+a;return `
    ivec${o.length} getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${r[0]}, ${r[1]}));
      int index = resTexRC.x * ${r[1]} + resTexRC.y;

      ${c}

      int b = index / ${s};
      index -= b * ${s};

      int r = 2 * (index / ${n});
      int c = imod(index, ${n}) * 2;

      return ivec${o.length}(${a});
    }
  `}function Em(o,t,e){if(e)return `
    ivec4 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
        vec2(outTexShape[0], outTexShape[1]));
      int index = resTexRC.x * outTexShape[1] + resTexRC.y;
      ${Pe(["r","c","d","d2"],o)}
      return ivec4(r, c, d, d2);
    }
  `;let r=le(["r","c","d","d2"],o);return `
    ivec4 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
        vec2(${t[0]}, ${t[1]}));
      int index = resTexRC.x * ${t[1]} + resTexRC.y;
      ${r}
      return ivec4(r, c, d, d2);
    }
  `}function km(o,t){let e=le(["r","c","d","d2","d3"],o);return `
    ivec5 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx * vec2(${t[0]},
                             ${t[1]}));

      int index = resTexRC.x * ${t[1]} + resTexRC.y;

      ${e}

      ivec5 outShape = ivec5(r, c, d, d2, d3);
      return outShape;
    }
  `}function _m(o,t){let e=le(["r","c","d","d2","d3","d4"],o);return `
    ivec6 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
        vec2(${t[0]}, ${t[1]}));
      int index = resTexRC.x * ${t[1]} + resTexRC.y;

      ${e}

      ivec6 result = ivec6(r, c, d, d2, d3, d4);
      return result;
    }
  `}function Am(o,t,e){let r=[Math.ceil(t[0]/2),Math.ceil(t[1]/2)];if(R.arraysEqual(o,t))return e?`
      ivec2 getOutputCoords() {
        ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
        return 2 * ivec2(resultUV.yx * vec2(packedTexShape[0], packedTexShape[1]));
      }
    `:`
      ivec2 getOutputCoords() {
        return 2 * ivec2(resultUV.yx * vec2(${r[0]}, ${r[1]}));
      }
    `;let n=Math.ceil(o[1]/2);return e?`
    ivec2 getOutputCoords() {
      ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
      int texelsInLogicalRow = int(ceil(float(outShape[1]) / 2.0));
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(packedTexShape[0], packedTexShape[1]));

      int index = resTexRC.x * packedTexShape[1] + resTexRC.y;
      int r = 2 * (index / texelsInLogicalRow);
      int c = imod(index, texelsInLogicalRow) * 2;

      return ivec2(r, c);
    }
  `:`
    ivec2 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${r[0]}, ${r[1]}));

      int index = resTexRC.x * ${r[1]} + resTexRC.y;
      int r = 2 * (index / ${n});
      int c = imod(index, ${n}) * 2;

      return ivec2(r, c);
    }
  `}function Fm(o,t,e){return R.arraysEqual(o,t)?e?`
      ivec2 getOutputCoords() {
        return ivec2(resultUV.yx * vec2(outTexShape[0], outTexShape[1]));
      }
    `:`
      ivec2 getOutputCoords() {
        return ivec2(resultUV.yx * vec2(${t[0]}, ${t[1]}));
      }
    `:o[1]===1?e?`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(outTexShape[0], outTexShape[1]));
        int index = resTexRC.x * outTexShape[1] + resTexRC.y;
        return ivec2(index, 0);
      }
    `:`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(${t[0]}, ${t[1]}));
        int index = resTexRC.x * ${t[1]} + resTexRC.y;
        return ivec2(index, 0);
      }
    `:o[0]===1?e?`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(outTexShape[0], outTexShape[1]));
        int index = resTexRC.x * outTexShape[1] + resTexRC.y;
        return ivec2(0, index);
      }
    `:`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(${t[0]}, ${t[1]}));
        int index = resTexRC.x * ${t[1]} + resTexRC.y;
        return ivec2(0, index);
      }
    `:e?`
    ivec2 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(outTexShape[0], outTexShape[1]));
      int index = resTexRC.x * outTexShape[1] + resTexRC.y;
      int r = index / outShape[1];
      int c = index - r * outShape[1];
      return ivec2(r, c);
    }
  `:`
    ivec2 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${t[0]}, ${t[1]}));
      int index = resTexRC.x * ${t[1]} + resTexRC.y;
      int r = index / ${o[1]};
      int c = index - r * ${o[1]};
      return ivec2(r, c);
    }
  `}function Oe(o){return `offset${o}`}function Dm(o){let t=o.name,e="get"+t.charAt(0).toUpperCase()+t.slice(1),r=U();return `
    vec4 ${e}() {
      return ${r.texture2D}(${t}, halfCR);
    }
  `}function Pm(o,t){let e=o.name,r="get"+e.charAt(0).toUpperCase()+e.slice(1);if(o.shapeInfo.isUniform)return `float ${r}() {return ${e};}`;let[n,s]=o.shapeInfo.texShape;if(n===1&&s===1)return `
      float ${r}() {
        return sampleTexture(${e}, halfCR);
      }
    `;let i=Oe(e);if(t)return `
    float ${r}() {
      vec2 uv = uvFromFlat(${e}TexShape[0], ${e}TexShape[1], ${i});
      return sampleTexture(${e}, uv);
    }
  `;let[c,a]=o.shapeInfo.texShape;return `
    float ${r}() {
      vec2 uv = uvFromFlat(${c}, ${a}, ${i});
      return sampleTexture(${e}, uv);
    }
  `}function Om(o,t){let e=o.name,r="get"+e.charAt(0).toUpperCase()+e.slice(1),n=o.shapeInfo.texShape,s=U();if(t)return `
    vec4 ${r}(int index) {
      ivec2 packedTexShape = ivec2(ceil(float(${e}TexShape[0]) / 2.0), ceil(float(${e}TexShape[1]) / 2.0));
      vec2 uv = packedUVfrom1D(
        packedTexShape[0], packedTexShape[1], index);
      return ${s.texture2D}(${e}, uv);
    }
  `;let i=[Math.ceil(n[0]/2),Math.ceil(n[1]/2)];return `
    vec4 ${r}(int index) {
      vec2 uv = packedUVfrom1D(
        ${i[0]}, ${i[1]}, index);
      return ${s.texture2D}(${e}, uv);
    }
  `}function Lm(o,t){let e=o.name,r="get"+e.charAt(0).toUpperCase()+e.slice(1);if(o.shapeInfo.isUniform)return `
      float ${r}(int index) {
        ${et(o)}
      }
    `;let n=o.shapeInfo.texShape,s=n[0],i=n[1];if(i===1&&s===1)return `
      float ${r}(int index) {
        return sampleTexture(${e}, halfCR);
      }
    `;let c=Oe(e);return i===1?t?`
      float ${r}(int index) {
        vec2 uv = vec2(0.5, (float(index + ${c}) + 0.5) / float(${e}TexShape[0]));
        return sampleTexture(${e}, uv);
      }
    `:`
      float ${r}(int index) {
        vec2 uv = vec2(0.5, (float(index + ${c}) + 0.5) / ${s}.0);
        return sampleTexture(${e}, uv);
      }
    `:s===1?t?`
      float ${r}(int index) {
        vec2 uv = vec2((float(index + ${c}) + 0.5) / float(${e}TexShape[1]), 0.5);
        return sampleTexture(${e}, uv);
      }
    `:`
      float ${r}(int index) {
        vec2 uv = vec2((float(index + ${c}) + 0.5) / ${i}.0, 0.5);
        return sampleTexture(${e}, uv);
      }
    `:t?`
    float ${r}(int index) {
      vec2 uv = uvFromFlat(${e}TexShape[0], ${e}TexShape[1], index + ${c});
      return sampleTexture(${e}, uv);
    }
  `:`
    float ${r}(int index) {
      vec2 uv = uvFromFlat(${s}, ${i}, index + ${c});
      return sampleTexture(${e}, uv);
    }
  `}function Bm(o,t){let e=o.shapeInfo.logicalShape,r=o.name,n="get"+r.charAt(0).toUpperCase()+r.slice(1),s=o.shapeInfo.texShape,i=s[0],c=s[1],a=U();if(s!=null&&R.arraysEqual(e,s))return t?`
      vec4 ${n}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${r}TexShape[1], ${r}TexShape[0]);

        return ${a.texture2D}(${r}, uv);
      }
    `:`
      vec4 ${n}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${c}.0, ${i}.0);

        return ${a.texture2D}(${r}, uv);
      }
    `;if(t)return `
    vec4 ${n}(int row, int col) {
      ivec2 packedTexShape = ivec2(ceil(float(${r}TexShape[0]) / 2.0), ceil(float(${r}TexShape[1]) / 2.0));
      int valuesPerRow = int(ceil(float(${r}Shape[1]) / 2.0));
      vec2 uv = packedUVfrom2D(valuesPerRow, packedTexShape[0], packedTexShape[1], row, col);
      return ${a.texture2D}(${r}, uv);
    }
  `;let l=[Math.ceil(s[0]/2),Math.ceil(s[1]/2)],u=Math.ceil(e[1]/2);return `
    vec4 ${n}(int row, int col) {
      vec2 uv = packedUVfrom2D(${u}, ${l[0]}, ${l[1]}, row, col);
      return ${a.texture2D}(${r}, uv);
    }
  `}function Um(o,t){let e=o.shapeInfo.logicalShape,r=o.name,n="get"+r.charAt(0).toUpperCase()+r.slice(1),s=o.shapeInfo.texShape;if(s!=null&&R.arraysEqual(e,s)){if(t)return `
      float ${n}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${r}TexShape[1], ${r}TexShape[0]);
        return sampleTexture(${r}, uv);
      }
    `;let d=s[0],m=s[1];return `
    float ${n}(int row, int col) {
      vec2 uv = (vec2(col, row) + halfCR) / vec2(${m}.0, ${d}.0);
      return sampleTexture(${r}, uv);
    }
  `}let{newShape:i,keptDims:c}=R.squeezeShape(e),a=i;if(a.length<e.length){let d=tt(o,a),m=["row","col"];return `
      ${Je(d,t)}
      float ${n}(int row, int col) {
        return ${n}(${ot(m,c)});
      }
    `}if(o.shapeInfo.isUniform)return `
      float ${n}(int row, int col) {
        int index = round(dot(vec2(row, col), vec2(${e[1]}, 1)));
        ${et(o)}
      }
    `;let l=s[0],u=s[1],p=Oe(r);return u===1?t?`
      float ${n}(int row, int col) {
        float index = dot(vec3(row, col, ${p}), vec3(${r}Shape[1], 1, 1));
        vec2 uv = vec2(0.5, (index + 0.5) / float(${r}TexShape[0]));
        return sampleTexture(${r}, uv);
      }
    `:`
    float ${n}(int row, int col) {
      float index = dot(vec3(row, col, ${p}), vec3(${e[1]}, 1, 1));
      vec2 uv = vec2(0.5, (index + 0.5) / ${l}.0);
      return sampleTexture(${r}, uv);
    }
  `:l===1?t?`
      float ${n}(int row, int col) {
        float index = dot(vec3(row, col, ${p}), vec3(${r}Shape[1], 1, 1));
        vec2 uv = vec2((index + 0.5) / float(${r}TexShape[1]), 0.5);
        return sampleTexture(${r}, uv);
      }
    `:`
    float ${n}(int row, int col) {
      float index = dot(vec3(row, col, ${p}), vec3(${e[1]}, 1, 1));
      vec2 uv = vec2((index + 0.5) / ${u}.0, 0.5);
      return sampleTexture(${r}, uv);
    }
  `:t?`
      float ${n}(int row, int col) {
        // Explicitly use integer operations as dot() only works on floats.
        int index = row * ${r}Shape[1] + col + ${p};
        vec2 uv = uvFromFlat(${r}TexShape[0], ${r}TexShape[1], index);
        return sampleTexture(${r}, uv);
      }
    `:`
  float ${n}(int row, int col) {
    // Explicitly use integer operations as dot() only works on floats.
    int index = row * ${e[1]} + col + ${p};
    vec2 uv = uvFromFlat(${l}, ${u}, index);
    return sampleTexture(${r}, uv);
  }
`}function Vm(o,t){let e=o.shapeInfo.logicalShape,r=o.name,n="get"+r.charAt(0).toUpperCase()+r.slice(1),s=o.shapeInfo.texShape,i=[Math.ceil(s[0]/2),Math.ceil(s[1]/2)];if(e[0]===1){let d=e.slice(1),m=[1,2],f=tt(o,d),h=["b","row","col"];return `
        ${uc(f,t)}
        vec4 ${n}(int b, int row, int col) {
          return ${n}(${ot(h,m)});
        }
      `}let c=U();if(t)return `
    vec4 ${n}(int b, int row, int col) {
      ivec2 packedTexShape = ivec2(ceil(float(${r}TexShape[0]) / 2.0), ceil(float(${r}TexShape[1]) / 2.0));
      int valuesPerRow = int(ceil(float(${r}Shape[2]) / 2.0));
      int texelsInBatch = valuesPerRow * int(ceil(float(${r}Shape[1]) / 2.0));
      vec2 uv = packedUVfrom3D(
        packedTexShape[0], packedTexShape[1], texelsInBatch, valuesPerRow, b, row, col);
      return ${c.texture2D}(${r}, uv);
    }
  `;let a=i[0],l=i[1],u=Math.ceil(e[2]/2),p=u*Math.ceil(e[1]/2);return `
    vec4 ${n}(int b, int row, int col) {
      vec2 uv = packedUVfrom3D(
        ${a}, ${l}, ${p}, ${u}, b, row, col);
      return ${c.texture2D}(${r}, uv);
    }
  `}function Wm(o,t){let e=o.shapeInfo.logicalShape,r=o.name,n="get"+r.charAt(0).toUpperCase()+r.slice(1),s=e[1]*e[2],i=e[2],{newShape:c,keptDims:a}=R.squeezeShape(e),l=c;if(l.length<e.length){let h=tt(o,l),g=["row","col","depth"];return `
        ${Je(h,t)}
        float ${n}(int row, int col, int depth) {
          return ${n}(${ot(g,a)});
        }
      `}if(o.shapeInfo.isUniform)return `
      float ${n}(int row, int col, int depth) {
        int index = round(dot(vec3(row, col, depth),
                          vec3(${s}, ${i}, 1)));
        ${et(o)}
      }
    `;let u=o.shapeInfo.texShape,p=u[0],d=u[1],m=o.shapeInfo.flatOffset;if(d===s&&m==null)return t?`
      float ${n}(int row, int col, int depth) {
        int stride1 = ${r}Shape[2];
        float texR = float(row);
        float texC = dot(vec2(col, depth), vec2(stride1, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${r}TexShape[1], ${r}TexShape[0]);
        return sampleTexture(${r}, uv);
      }
    `:`
        float ${n}(int row, int col, int depth) {
          float texR = float(row);
          float texC = dot(vec2(col, depth), vec2(${i}, 1));
          vec2 uv = (vec2(texC, texR) + halfCR) /
                     vec2(${d}.0, ${p}.0);
          return sampleTexture(${r}, uv);
        }
      `;if(d===i&&m==null)return t?`
      float ${n}(int row, int col, int depth) {
        float texR = dot(vec2(row, col), vec2(${r}Shape[1], 1));
        float texC = float(depth);
        vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${r}TexShape[1], ${r}TexShape[0]);
        return sampleTexture(${r}, uv);
      }
    `:`
    float ${n}(int row, int col, int depth) {
      float texR = dot(vec2(row, col), vec2(${e[1]}, 1));
      float texC = float(depth);
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${d}.0, ${p}.0);
      return sampleTexture(${r}, uv);
    }
  `;let f=Oe(r);return t?`
    float ${n}(int row, int col, int depth) {
      // Explicitly use integer operations as dot() only works on floats.
      int stride0 = ${r}Shape[1] * ${r}Shape[2];
      int stride1 = ${r}Shape[2];
      int index = row * stride0 + col * stride1 + depth + ${f};
      vec2 uv = uvFromFlat(${r}TexShape[0], ${r}TexShape[1], index);
      return sampleTexture(${r}, uv);
    }
    `:`
      float ${n}(int row, int col, int depth) {
        // Explicitly use integer operations as dot() only works on floats.
        int index = row * ${s} + col * ${i} + depth + ${f};
        vec2 uv = uvFromFlat(${p}, ${d}, index);
        return sampleTexture(${r}, uv);
      }
  `}function Mm(o,t){let e=o.name,r="get"+e.charAt(0).toUpperCase()+e.slice(1),n=U();if(t)return `
    vec4 ${r}(int b2, int b, int row, int col) {
      int valuesPerRow = int(ceil(float(${e}Shape[3]) / 2.0));
      int texelsInBatch = valuesPerRow * int(ceil(float(${e}Shape[2]) / 2.0));
      int index = b * texelsInBatch + (row / 2) * valuesPerRow + (col / 2);
      texelsInBatch *= ${e}Shape[1];
      index = b2 * texelsInBatch + index;
      ivec2 packedTexShape = ivec2(ceil(float(${e}TexShape[0]) / 2.0), ceil(float(${e}TexShape[1]) / 2.0));
      int texR = index / packedTexShape[1];
      int texC = index - texR * packedTexShape[1];
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(packedTexShape[1], packedTexShape[0]); return ${n.texture2D}(${e}, uv);
    }
  `;let s=o.shapeInfo.logicalShape,i=s.length,c=o.shapeInfo.texShape,a=[Math.ceil(c[0]/2),Math.ceil(c[1]/2)],l=a[0],u=a[1],p=Math.ceil(s[i-1]/2),d=p*Math.ceil(s[i-2]/2),m="int b, int row, int col",f=`b * ${d} + (row / 2) * ${p} + (col / 2)`;for(let h=2;h<i-1;h++)m=`int b${h}, `+m,d*=s[i-h-1],f=`b${h} * ${d} + `+f;return `
    vec4 ${r}(${m}) {
      int index = ${f};
      int texR = index / ${u};
      int texC = index - texR * ${u};
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${u}, ${l});
      return ${n.texture2D}(${e}, uv);
    }
  `}function Gm(o,t){let e=o.shapeInfo.logicalShape,r=o.name,n="get"+r.charAt(0).toUpperCase()+r.slice(1),s=e[3],i=e[2]*s,c=e[1]*i,{newShape:a,keptDims:l}=R.squeezeShape(e);if(a.length<e.length){let C=tt(o,a),y=["row","col","depth","depth2"];return `
      ${Je(C,t)}
      float ${n}(int row, int col, int depth, int depth2) {
        return ${n}(${ot(y,l)});
      }
    `}if(o.shapeInfo.isUniform)return `
      float ${n}(int row, int col, int depth, int depth2) {
        int index = round(dot(vec4(row, col, depth, depth2),
                          vec4(${c}, ${i}, ${s}, 1)));
        ${et(o)}
      }
    `;let u=o.shapeInfo.flatOffset,p=o.shapeInfo.texShape,d=p[0],m=p[1],f=`int stride2 = ${r}Shape[3];`,h=`int stride1 = ${r}Shape[2] * stride2;`,g=`int stride0 = ${r}Shape[1] * stride1;`;if(m===c&&u==null)return t?`
      float ${n}(int row, int col, int depth, int depth2) {
        ${f}
        ${h}
        float texR = float(row);
        float texC =
            dot(vec3(col, depth, depth2),
                vec3(stride1, stride2, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${r}TexShape[1], ${r}TexShape[0]);
        return sampleTexture(${r}, uv);
      }
    `:`
      float ${n}(int row, int col, int depth, int depth2) {
        float texR = float(row);
        float texC =
            dot(vec3(col, depth, depth2),
                vec3(${i}, ${s}, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${m}.0, ${d}.0);
        return sampleTexture(${r}, uv);
      }
    `;if(m===s&&u==null)return t?`
      float ${n}(int row, int col, int depth, int depth2) {
        float texR = dot(vec3(row, col, depth),
                         vec3(${r}Shape[1] * ${r}Shape[2], ${r}Shape[2], 1));
        float texC = float(depth2);
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${r}TexShape[1], ${r}TexShape[0]);
        return sampleTexture(${r}, uv);
      }
    `:`
      float ${n}(int row, int col, int depth, int depth2) {
        float texR = dot(vec3(row, col, depth),
                         vec3(${e[1]*e[2]}, ${e[2]}, 1));
        float texC = float(depth2);
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${m}.0, ${d}.0);
        return sampleTexture(${r}, uv);
      }
    `;let x=Oe(r);return t?`
    float ${n}(int row, int col, int depth, int depth2) {
      // Explicitly use integer operations as dot() only works on floats.
      ${f}
      ${h}
      ${g}
      int index = row * stride0 + col * stride1 +
          depth * stride2 + depth2;
      vec2 uv = uvFromFlat(${r}TexShape[0], ${r}TexShape[1], index + ${x});
      return sampleTexture(${r}, uv);
    }
  `:`
    float ${n}(int row, int col, int depth, int depth2) {
      // Explicitly use integer operations as dot() only works on floats.
      int index = row * ${c} + col * ${i} +
          depth * ${s} + depth2;
      vec2 uv = uvFromFlat(${d}, ${m}, index + ${x});
      return sampleTexture(${r}, uv);
    }
  `}function zm(o){let t=o.shapeInfo.logicalShape,e=o.name,r="get"+e.charAt(0).toUpperCase()+e.slice(1),n=t[4],s=t[3]*n,i=t[2]*s,c=t[1]*i,{newShape:a,keptDims:l}=R.squeezeShape(t);if(a.length<t.length){let h=tt(o,a),g=["row","col","depth","depth2","depth3"];return `
      ${Je(h)}
      float ${r}(int row, int col, int depth, int depth2, int depth3) {
        return ${r}(${ot(g,l)});
      }
    `}if(o.shapeInfo.isUniform)return `
      float ${r}(int row, int col, int depth, int depth2, int depth3) {
        float index = dot(
          vec4(row, col, depth, depth2),
          vec4(${c}, ${i}, ${s}, ${n})) +
          depth3;
        ${et(o)}
      }
    `;let u=o.shapeInfo.flatOffset,p=o.shapeInfo.texShape,d=p[0],m=p[1];if(m===c&&u==null)return `
      float ${r}(int row, int col, int depth, int depth2, int depth3) {
        int texR = row;
        float texC = dot(vec4(col, depth, depth2, depth3),
                         vec4(${i}, ${s}, ${n}, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${m}.0, ${d}.0);
        return sampleTexture(${e}, uv);
      }
    `;if(m===n&&u==null)return `
      float ${r}(int row, int col, int depth, int depth2, int depth3) {
        float texR = dot(
          vec4(row, col, depth, depth2),
          vec4(${t[1]*t[2]*t[3]},
               ${t[2]*t[3]}, ${t[3]}, 1));
        int texC = depth3;
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${m}.0, ${d}.0);
        return sampleTexture(${e}, uv);
      }
    `;let f=Oe(e);return `
    float ${r}(int row, int col, int depth, int depth2, int depth3) {
      // Explicitly use integer operations as dot() only works on floats.
      int index = row * ${c} + col * ${i} + depth * ${s} +
          depth2 * ${n} + depth3 + ${f};
      vec2 uv = uvFromFlat(${d}, ${m}, index);
      return sampleTexture(${e}, uv);
    }
  `}function Hm(o){let t=o.shapeInfo.logicalShape,e=o.name,r="get"+e.charAt(0).toUpperCase()+e.slice(1),{newShape:n,keptDims:s}=R.squeezeShape(t);if(n.length<t.length){let g=tt(o,n),x=["row","col","depth","depth2","depth3","depth4"];return `
      ${Je(g)}
      float ${r}(int row, int col, int depth,
                    int depth2, int depth3, int depth4) {
        return ${r}(${ot(x,s)});
      }
    `}let i=t[5],c=t[4]*i,a=t[3]*c,l=t[2]*a,u=t[1]*l;if(o.shapeInfo.isUniform)return `
      float ${r}(int row, int col, int depth,
                  int depth2, int depth3, int depth4) {
        int index = round(dot(
          vec4(row, col, depth, depth2),
          vec4(${u}, ${l}, ${a}, ${c})) +
          dot(
            vec2(depth3, depth4),
            vec2(${i}, 1)));
        ${et(o)}
      }
    `;let p=o.shapeInfo.flatOffset,d=o.shapeInfo.texShape,m=d[0],f=d[1];if(f===u&&p==null)return `
      float ${r}(int row, int col, int depth,
                    int depth2, int depth3, int depth4) {
        int texR = row;
        float texC = dot(vec4(col, depth, depth2, depth3),
          vec4(${l}, ${a}, ${c}, ${i})) +
               float(depth4);
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${f}.0, ${m}.0);
        return sampleTexture(${e}, uv);
      }
    `;if(f===i&&p==null)return `
      float ${r}(int row, int col, int depth,
                    int depth2, int depth3, int depth4) {
        float texR = dot(vec4(row, col, depth, depth2),
          vec4(${t[1]*t[2]*t[3]*t[4]},
               ${t[2]*t[3]*t[4]},
               ${t[3]*t[4]},
               ${t[4]})) + float(depth3);
        int texC = depth4;
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${f}.0, ${m}.0);
        return sampleTexture(${e}, uv);
      }
    `;let h=Oe(e);return `
    float ${r}(int row, int col, int depth,
                  int depth2, int depth3, int depth4) {
      // Explicitly use integer operations as dot() only works on floats.
      int index = row * ${u} + col * ${l} + depth * ${a} +
          depth2 * ${c} + depth3 * ${i} + depth4 + ${h};
      vec2 uv = uvFromFlat(${m}, ${f}, index);
      return sampleTexture(${e}, uv);
    }
  `}function et(o){let t=o.name,e=R.sizeFromShape(o.shapeInfo.logicalShape);return e<2?`return ${t};`:`
    for (int i = 0; i < ${e}; i++) {
      if (i == index) {
        return ${t}[i];
      }
    }
  `}function Xm(o,t){let e=o.name,r=e.charAt(0).toUpperCase()+e.slice(1),n="get"+r+"AtOutCoords",s=o.shapeInfo.logicalShape.length,i=t.logicalShape.length,c=cc(o.shapeInfo.logicalShape,t.logicalShape),a=A(i),l=i-s,u,p=["x","y","z","w","u","v"];s===0?u="":i<2&&c.length>=1?u="coords = 0;":u=c.map(C=>`coords.${p[C+l]} = 0;`).join(`
`);let d="";i<2&&s>0?d="coords":d=o.shapeInfo.logicalShape.map((C,y)=>`coords.${p[y+l]}`).join(", ");let m="return outputValue;",h=R.sizeFromShape(o.shapeInfo.logicalShape)===1,x=R.sizeFromShape(t.logicalShape)===1;if(s===1&&!h&&!x)m=`
      return vec4(outputValue.xy, outputValue.xy);
    `;else if(h&&!x)i===1?m=`
        return vec4(outputValue.x, outputValue.x, 0., 0.);
      `:m=`
        return vec4(outputValue.x);
      `;else if(c.length){let C=s-2,y=s-1;c.indexOf(C)>-1&&c.indexOf(y)>-1?m="return vec4(outputValue.x);":c.indexOf(C)>-1?m="return vec4(outputValue.x, outputValue.y, outputValue.x, outputValue.y);":c.indexOf(y)>-1&&(m="return vec4(outputValue.xx, outputValue.zz);");}return `
    vec4 ${n}() {
      ${a} coords = getOutputCoords();
      ${u}
      vec4 outputValue = get${r}(${d});
      ${m}
    }
  `}function Km(o,t){let e=o.name,r=e.charAt(0).toUpperCase()+e.slice(1),n="get"+r+"AtOutCoords",s=t.texShape,i=o.shapeInfo.texShape,c=o.shapeInfo.logicalShape.length,a=t.logicalShape.length;if(!o.shapeInfo.isUniform&&c===a&&o.shapeInfo.flatOffset==null&&R.arraysEqual(i,s))return `
      float ${n}() {
        return sampleTexture(${e}, resultUV);
      }
    `;let l=A(a),u=cc(o.shapeInfo.logicalShape,t.logicalShape),p=a-c,d,m=["x","y","z","w","u","v"];c===0?d="":a<2&&u.length>=1?d="coords = 0;":d=u.map(h=>`coords.${m[h+p]} = 0;`).join(`
`);let f="";return a<2&&c>0?f="coords":f=o.shapeInfo.logicalShape.map((h,g)=>`coords.${m[g+p]}`).join(", "),`
    float ${n}() {
      ${l} coords = getOutputCoords();
      ${d}
      return get${r}(${f});
    }
  `}function A(o){if(o<=1)return "int";if(o===2)return "ivec2";if(o===3)return "ivec3";if(o===4)return "ivec4";if(o===5)return "ivec5";if(o===6)return "ivec6";throw Error(`GPU for rank ${o} is not yet supported`)}function Ot(o,t,e){let{newShape:r,keptDims:n}=R.squeezeShape(t),s=t.length,i=o&&s===3&&t[0]===1,c=i?t.slice(1):r,a=!o&&s>1&&!R.arraysEqual(t,e)&&r.length<s||i;return {useSqueezeShape:a,uniformShape:a?c:t,keptDims:n}}function tt(o,t){let e=JSON.parse(JSON.stringify(o));return e.shapeInfo.logicalShape=t,e}function ot(o,t){return t.map(e=>o[e]).join(", ")}function mc(o,t,e,r){let n=e.map((u,p)=>{let d={logicalShape:u.shape,texShape:u.isUniform?null:u.texData.texShape,isUniform:u.isUniform,isPacked:u.isUniform?false:u.texData.isPacked,flatOffset:null};return u.texData!=null&&u.texData.slice!=null&&u.texData.slice.flatOffset>0&&(d.flatOffset=u.texData.slice.flatOffset),{name:t.variableNames[p],shapeInfo:d}}),s=n.map(u=>u.shapeInfo),i={logicalShape:r.shape,texShape:r.texData.texShape,isUniform:false,isPacked:r.texData.isPacked,flatOffset:null},c=lc(n,i,t),a=Er(o.gl,c),l=o.createProgram(a);return O$1().get("ENGINE_COMPILE_ONLY")?{program:t,fragmentShader:a,source:c,webGLProgram:l,inShapeInfos:s,outShapeInfo:i,variablesLocations:null,customUniformLocations:null,infLoc:null,nanLoc:null,outShapeLocation:null,outShapeStridesLocation:null,outTexShapeLocation:null}:(o.buildVao(l),Object.assign({program:t,fragmentShader:a,source:c,webGLProgram:l,inShapeInfos:s,outShapeInfo:i},Kr(o,t,l)))}function Kr(o,t,e){let r=[],n=[],s,i,c,a=null,l=null;l=o.getUniformLocation(e,"NAN",false),O$1().getNumber("WEBGL_VERSION")===1&&(a=o.getUniformLocation(e,"INFINITY",false));let u=false;for(let p of t.variableNames){let d={name:p,uniform:o.getUniformLocation(e,p,u),offset:o.getUniformLocation(e,`offset${p}`,u)};t.enableShapeUniforms&&(d.shape=o.getUniformLocation(e,`${p}Shape`,u),d.texShape=o.getUniformLocation(e,`${p}TexShape`,u)),r.push(d);}if(t.enableShapeUniforms&&(s=o.getUniformLocation(e,"outShape",u),c=o.getUniformLocation(e,"outShapeStrides",u),i=o.getUniformLocation(e,"outTexShape",u)),t.customUniforms)for(let p of t.customUniforms)n.push(o.getUniformLocation(e,p.name,u));return {variablesLocations:r,customUniformLocations:n,infLoc:a,nanLoc:l,outShapeLocation:s,outShapeStridesLocation:c,outTexShapeLocation:i}}function dc(o,t){if(o.length!==t.length)throw Error(`Binary was compiled with ${o.length} inputs, but was executed with ${t.length} inputs`);o.forEach((e,r)=>{let n=e.logicalShape,s=t[r],i=s.shape;if(!R.arraysEqual(n,i))throw Error(`Binary was compiled with different shapes than the current args. Shapes ${n} and ${i} must match`);if(e.isUniform&&s.isUniform)return;let c=e.texShape,a=s.isUniform?null:s.texData.texShape;if(!R.arraysEqual(c,a))throw Error(`Binary was compiled with different texture shapes than the current args. Shape ${c} and ${a} must match`)});}function fc(o,t,e,r,n){t.program.enableShapeUniforms||(dc(t.inShapeInfos,e),dc([t.outShapeInfo],[r]));let s=r.texData.texture,i=r.texData.texShape;r.texData.isPacked?o.setOutputPackedMatrixTexture(s.texture,i[0],i[1]):o.setOutputMatrixTexture(s.texture,i[0],i[1]),o.setProgram(t.webGLProgram),o.bindVertexArray(t.webGLProgram.vao),O$1().getNumber("WEBGL_VERSION")===1&&t.infLoc!==null&&o.gl.uniform1f(t.infLoc,1/0),t.nanLoc!==null&&o.gl.uniform1f(t.nanLoc,NaN);for(let a=0;a<e.length;++a){let l=e[a],{uniform:u,offset:p,shape:d,texShape:m}=t.variablesLocations[a];if(d){let{uniformShape:f}=Ot(t.program.packedInputs,l.shape,l.texData.texShape);switch(f.length){case 1:o.gl.uniform1iv(d,new Int32Array(f));break;case 2:o.gl.uniform2iv(d,new Int32Array(f));break;case 3:o.gl.uniform3iv(d,new Int32Array(f));break;case 4:o.gl.uniform4iv(d,new Int32Array(f));break;}}if(m&&o.gl.uniform2i(m,l.texData.texShape[0],l.texData.texShape[1]),u!=null){if(l.isUniform){if(R.sizeFromShape(l.shape)<2)o.gl.uniform1f(u,l.uniformValues[0]);else {let f=l.uniformValues;f instanceof Float32Array||(f=new Float32Array(f)),o.gl.uniform1fv(u,f);}continue}l.texData.slice!=null&&p!=null&&o.gl.uniform1i(p,l.texData.slice.flatOffset),o.setInputMatrixTexture(l.texData.texture.texture,u,a);}}let c=t.outShapeLocation;if(c)switch(r.shape.length){case 1:o.gl.uniform1iv(c,new Int32Array(r.shape));break;case 2:o.gl.uniform2iv(c,new Int32Array(r.shape));break;case 3:o.gl.uniform3iv(c,new Int32Array(r.shape));break;case 4:o.gl.uniform4iv(c,new Int32Array(r.shape));break;}if(t.outShapeStridesLocation){let a=R.computeStrides(r.shape);switch(r.shape.length){case 2:o.gl.uniform1iv(t.outShapeStridesLocation,new Int32Array(a));break;case 3:o.gl.uniform2iv(t.outShapeStridesLocation,new Int32Array(a));break;case 4:o.gl.uniform3iv(t.outShapeStridesLocation,new Int32Array(a));break;}}if(t.outTexShapeLocation&&o.gl.uniform2i(t.outTexShapeLocation,r.texData.texShape[0],r.texData.texShape[1]),t.program.customUniforms&&n)for(let a=0;a<t.program.customUniforms.length;++a){let l=t.program.customUniforms[a],u=t.customUniformLocations[a],p=n[a];if(l.type==="float")o.gl.uniform1fv(u,p);else if(l.type==="vec2")o.gl.uniform2fv(u,p);else if(l.type==="vec3")o.gl.uniform3fv(u,p);else if(l.type==="vec4")o.gl.uniform4fv(u,p);else if(l.type==="int")o.gl.uniform1iv(u,p);else if(l.type==="ivec2")o.gl.uniform2iv(u,p);else if(l.type==="ivec3")o.gl.uniform3iv(u,p);else if(l.type==="ivec4")o.gl.uniform4iv(u,p);else throw Error(`uniform type ${l.type} is not supported yet.`)}o.executeProgram();}function hc(o,t,e){let r="";t.concat(e).forEach(i=>{let c=i.texData!=null&&i.texData.slice!=null&&i.texData.slice.flatOffset>0;if(o.enableShapeUniforms&&!i.isUniform){let a=i.texData.texShape,{useSqueezeShape:l,uniformShape:u,keptDims:p}=Ot(o.packedInputs,i.shape,a),d="",m="",f="";if(u.length===1&&o.packedInputs){let w=[Math.ceil(a[0]/2),Math.ceil(a[1]/2)];d=`${w[0]>1}_${w[1]>1}`;}else if(u.length===2&&!o.packedInputs)m=`${u[0]>1}_${u[1]>1}`;else if(u.length>2&&!o.packedInputs){let w=R.computeStrides(u);f=`${w[0]===a[1]}_${w[w.length-1]===a[1]}`;}let h=i.shape.length,g=u.length===2&&R.arraysEqual(i.shape,a),x=R.sizeFromShape(i.shape)===1,C=kp$1.getBroadcastDims(i.shape,e.shape),y=!o.packedInputs&&h===e.shape.length&&R.arraysEqual(a,e.texData.texShape),R$1=o.packedInputs||u.length>2?"":`${a[0]>1}_${a[1]>1}`;r+=`${h}_${y}_${l?p:""}_${u.length}_${x}_${C}_${g}_${d}_${m}_${f}_${R$1}_${c}`;}else {let a=i.isUniform?"uniform":i.texData.texShape;r+=`${i.shape}_${a}_${c}`;}});let n=o.userCode,s=o.constructor.name;return s+="_"+r+"_"+n+`${O$1().getNumber("WEBGL_VERSION")}`,s}function L(o){return O$1().getBool("WEBGL_USE_SHAPES_UNIFORMS")&&o<=4}var Lt=class{constructor(t){this.variableNames=["A"],this.packedInputs=false,this.packedOutput=true,this.outPackingScheme=Fe.DENSE,this.customUniforms=[{name:"texShape",type:"ivec2"}];let e=U();this.outputShape=t,this.enableShapeUniforms=L(this.outputShape.length),this.userCode=`
      ivec3 outCoordsFromFlatIndex(int index) {
        ${this.enableShapeUniforms?Pe(["r","c","d"],t):le(["r","c","d"],t)}
        return ivec3(r, c, d);
      }

      void main() {
        ivec2 resTexRC = ivec2(resultUV.yx * vec2(texShape[0], texShape[1]));
        int index = 4 * (resTexRC.x * texShape[1] + resTexRC.y);

        vec4 result = vec4(0.);

        for (int i=0; i<4; i++) {
          int flatIndex = index + i;
          ivec3 rc = outCoordsFromFlatIndex(flatIndex);
          result[i] = getA(rc.x, rc.y, rc.z);
        }

        ${e.output} = result;
      }
    `;}};var Bt=class{constructor(t){this.variableNames=["A"],this.packedInputs=true,this.packedOutput=true,this.outPackingScheme=Fe.DENSE,this.customUniforms=[{name:"texShape",type:"ivec2"}];let e=U();this.outputShape=t,this.enableShapeUniforms=L(this.outputShape.length),this.userCode=`
      ivec3 outCoordsFromFlatIndex(int index) {
        ${this.enableShapeUniforms?Pe(["r","c","d"],t):le(["r","c","d"],t)}
        return ivec3(r, c, d);
      }

      void main() {
        ivec2 resTexRC = ivec2(resultUV.yx * vec2(texShape[0], texShape[1]));
        int index = 4 * (resTexRC.x * texShape[1] + resTexRC.y);

        vec4 result = vec4(0.);

        for (int i=0; i<4; i++) {
          int flatIndex = index + i;
          ivec3 rc = outCoordsFromFlatIndex(flatIndex);
          result[i] = getChannel(getA(rc.x, rc.y, rc.z), vec2(rc.y, rc.z));
        }

        ${e.output} = result;
      }
    `;}};var Ut=class{constructor(t){this.variableNames=["A"],this.outTexUsage=K.DOWNLOAD;let e=U();this.outputShape=t,this.userCode=`
      ${Pt}

      void main() {
        float x = getAAtOutCoords();
        ${e.output} = encode_float(x);
      }
    `;}};var Vt=class{constructor(t){this.variableNames=["A"],this.packedInputs=true,this.packedOutput=false,this.outTexUsage=K.DOWNLOAD;let e=U();this.outputShape=t,this.userCode=`
      ${Pt}

      void main() {
        ivec3 coords = getOutputCoords();
        float x = getChannel(getAAtOutCoords(), vec2(coords.y, coords.z));
        ${e.output} = encode_float(x);
      }
    `;}};var Ym={R:0,G:1,B:2,A:3},Ct=class{constructor(t,e=false,r="RGBA"){this.variableNames=["A"],this.customUniforms=[{name:"texShape",type:"ivec2"}];let n=U();this.outputShape=t,this.enableShapeUniforms=L(this.outputShape.length);let s="result";e&&(s="floor(result * 255. + 0.5)");let i="";for(let c=0;c<r.length;c++){let a=r[c];i+=`
          if(offset == ${c}) {
            result = values[${Ym[a]}];
          }`;}this.userCode=`
      ${this.enableShapeUniforms?Qe():Ye(t)}

      void main() {
        ivec3 coords = getOutputCoords();
        int flatIndex = getFlatIndex(coords);
        float result = 0.;
        int offset = imod(flatIndex, ${r.length});

        flatIndex = idiv(flatIndex, ${r.length}, 1.);

        int r = flatIndex / texShape[1];
        if (r < texShape[0]) {
          int c = imod(flatIndex, texShape[1]);
          vec2 uv = (vec2(c, r) + halfCR) / vec2(texShape[1], texShape[0]);
          vec4 values = ${n.texture2D}(A, uv);
          ${i}
        }
        ${n.output} = vec4(${s}, 0., 0., 0.);
      }
    `;}};var Wt=class{constructor(t,e=false){this.variableNames=["A"],this.packedInputs=false,this.packedOutput=true,this.customUniforms=[{name:"texShape",type:"ivec2"}];let r=U();this.outputShape=t,this.enableShapeUniforms=L(this.outputShape.length);let n="",s="result";e&&(s="floor(result * 255. + 0.5)");for(let i=0;i<=1;i++)for(let c=0;c<=1;c++){let a=i*2+c;n+=`
          localCoords = coords;
          if(localCoords[2] + ${c} < ${this.enableShapeUniforms?"outShape[2]":`${t[2]}`}) {
          localCoords[2] += ${c};
          if (localCoords[1] + ${i} < ${this.enableShapeUniforms?"outShape[1]":`${t[1]}`}) {
            localCoords[1] += ${i};

            flatIndex = getFlatIndex(localCoords);
            offset = imod(flatIndex, 4);

            flatIndex = idiv(flatIndex, 4, 1.);

            int r = flatIndex / texShape[1];
            int c = imod(flatIndex, texShape[1]);
            vec2 uv = (vec2(c, r) + halfCR) / vec2(texShape[1], texShape[0]);
            values = ${r.texture2D}(A, uv);

            if (offset == 0) {
              result[${a}] = values[0];
            } else if (offset == 1) {
              result[${a}] = values[1];
            } else if (offset == 2) {
              result[${a}] = values[2];
            } else {
              result[${a}] = values[3];
            }
          }
        }
        `;}this.userCode=`
        ${this.enableShapeUniforms?Qe():Ye(t)}

        void main() {
          ivec3 coords = getOutputCoords();

          vec4 result = vec4(0.);
          int flatIndex, r, c, offset;
          ivec3 localCoords;
          vec2 uv;
          vec4 values;

          ${n}

          ${r.output} = ${s};
        }
    `;}};vS();var pn={};A$1(pn,{bindVertexProgramAttributeStreams:()=>on,createBufferFromOutputTexture:()=>sn,createFloat16MatrixTexture:()=>Zr,createFloat16PackedMatrixTexture:()=>tn,createFloat32MatrixTexture:()=>Qr,createIndexBuffer:()=>Yr,createPackedMatrixTexture:()=>en,createUnsignedBytesMatrixTexture:()=>Jr,createVertexBuffer:()=>jr,createVertexShader:()=>qr,downloadByteEncodedFloatMatrixFromOutputTexture:()=>cn,downloadFloat32MatrixFromBuffer:()=>an,downloadMatrixFromPackedOutputTexture:()=>un,downloadPackedMatrixFromBuffer:()=>ln,getInternalFormatForFloat16MatrixTexture:()=>Gt,getInternalFormatForFloat16PackedMatrixTexture:()=>Xt,getInternalFormatForFloat32MatrixTexture:()=>Mt,getInternalFormatForPackedMatrixTexture:()=>Ht,getInternalFormatForUnsignedBytesMatrixTexture:()=>zt,uploadDenseMatrixToTexture:()=>rn,uploadPixelDataToTexture:()=>nn});vS();function qr(o){let t=U(),e=`${t.version}
    precision highp float;
    ${t.attribute} vec3 clipSpacePos;
    ${t.attribute} vec2 uv;
    ${t.varyingVs} vec2 resultUV;

    void main() {
      gl_Position = vec4(clipSpacePos, 1);
      resultUV = uv;
    }`;return Nr(o,e)}function jr(o){let t=new Float32Array([-1,1,0,0,1,-1,-1,0,0,0,1,1,0,1,1,1,-1,0,1,0]);return Ar(o,t)}function Yr(o){let t=new Uint16Array([0,1,2,2,1,3]);return Fr(o,t)}function bt(o,t,e,r,n,s){Pr(t,e);let i=Dr(o),c=o.TEXTURE_2D;return I(o,()=>o.bindTexture(c,i)),I(o,()=>o.texParameteri(c,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE)),I(o,()=>o.texParameteri(c,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE)),I(o,()=>o.texParameteri(c,o.TEXTURE_MIN_FILTER,o.NEAREST)),I(o,()=>o.texParameteri(c,o.TEXTURE_MAG_FILTER,o.NEAREST)),O$1().getNumber("WEBGL_VERSION")===1?I(o,()=>o.texImage2D(c,0,r,t,e,0,n,s,null)):I(o,()=>o.texStorage2D(c,1,r,t,e)),I(o,()=>o.bindTexture(o.TEXTURE_2D,null)),{texture:i,texShape:[e,t]}}function Mt(o){return o.internalFormatFloat}function Qr(o,t,e,r){let[n,s]=De(t,e);return bt(o,n,s,Mt(r),r.textureFormatFloat,o.FLOAT)}function Gt(o){return o.internalFormatHalfFloat}function Zr(o,t,e,r){let[n,s]=De(t,e);return bt(o,n,s,Gt(r),r.textureFormatFloat,r.textureTypeHalfFloat)}function zt(o){return o.downloadTextureFormat}function Jr(o,t,e,r){let[n,s]=De(t,e);return bt(o,n,s,zt(r),o.RGBA,o.UNSIGNED_BYTE)}function Ht(o){return o.internalFormatPackedFloat}function en(o,t,e,r){let[n,s]=me(t,e);return bt(o,n,s,Ht(r),o.RGBA,o.FLOAT)}function Xt(o){return o.internalFormatPackedHalfFloat}function tn(o,t,e,r){let[n,s]=me(t,e);return bt(o,n,s,Xt(r),o.RGBA,r.textureTypeHalfFloat)}function on(o,t,e){return I(o,()=>o.bindBuffer(o.ARRAY_BUFFER,e)),At(o,t,"clipSpacePos",e,3,20,0)&&At(o,t,"uv",e,2,20,12)}function rn(o,t,e,r,n,s){I(o,()=>o.bindTexture(o.TEXTURE_2D,t));let i,c,a;n instanceof Uint8Array?(i=new Uint8Array(e*r*4),c=o.UNSIGNED_BYTE,a=o.RGBA):(i=new Float32Array(e*r*4),c=o.FLOAT,a=s.internalFormatPackedFloat),i.set(n),O$1().getNumber("WEBGL_VERSION")===2?I(o,()=>o.texSubImage2D(o.TEXTURE_2D,0,0,0,e,r,o.RGBA,c,i)):I(o,()=>o.texImage2D(o.TEXTURE_2D,0,a,e,r,0,o.RGBA,c,i)),I(o,()=>o.bindTexture(o.TEXTURE_2D,null));}function nn(o,t,e){I(o,()=>o.bindTexture(o.TEXTURE_2D,t)),e.data instanceof Uint8Array?O$1().getNumber("WEBGL_VERSION")===2?I(o,()=>o.texSubImage2D(o.TEXTURE_2D,0,0,0,e.width,e.height,o.RGBA,o.UNSIGNED_BYTE,e.data)):I(o,()=>o.texImage2D(o.TEXTURE_2D,0,o.RGBA,e.width,e.height,0,o.RGBA,o.UNSIGNED_BYTE,e.data)):O$1().getNumber("WEBGL_VERSION")===2?I(o,()=>o.texSubImage2D(o.TEXTURE_2D,0,0,0,o.RGBA,o.UNSIGNED_BYTE,e)):I(o,()=>o.texImage2D(o.TEXTURE_2D,0,o.RGBA,o.RGBA,o.UNSIGNED_BYTE,e)),I(o,()=>o.bindTexture(o.TEXTURE_2D,null));}function sn(o,t,e,r){let n=o.createBuffer();I(o,()=>o.bindBuffer(o.PIXEL_PACK_BUFFER,n));let c=4*4*t*e;return I(o,()=>o.bufferData(o.PIXEL_PACK_BUFFER,c,o.STREAM_READ)),I(o,()=>o.readPixels(0,0,e,t,o.RGBA,o.FLOAT,0)),I(o,()=>o.bindBuffer(o.PIXEL_PACK_BUFFER,null)),n}function an(o,t,e){let r=o,n=new Float32Array(e);return r.bindBuffer(r.PIXEL_PACK_BUFFER,t),r.getBufferSubData(r.PIXEL_PACK_BUFFER,0,n),r.bindBuffer(r.PIXEL_PACK_BUFFER,null),n}function cn(o,t,e,r){let[n,s]=De(t,e),i=4,c=new Uint8Array(tc(t*e,i));return I(o,()=>o.readPixels(0,0,n,s,r.downloadTextureFormat,o.UNSIGNED_BYTE,c)),new Float32Array(c.buffer)}function ln(o,t,e,r,n,s,i,c){let a=o,l=new Float32Array(oc(s,i));return a.bindBuffer(a.PIXEL_PACK_BUFFER,t),a.getBufferSubData(a.PIXEL_PACK_BUFFER,0,l),a.bindBuffer(a.PIXEL_PACK_BUFFER,null),l}function un(o,t,e){let r=new Float32Array(t*e*4);return I(o,()=>o.readPixels(0,0,e,t,o.RGBA,o.FLOAT,r)),r}var Le=class{constructor(t){this.outputTexture=null,this.program=null,this.disposed=false,this.itemsToPoll=[];let e=O$1().getNumber("WEBGL_VERSION");if(t!=null?(this.gl=t,Rr(e,t)):this.gl=J(e),t=this.gl,O$1().getNumber("WEBGL_VERSION")===2){let s=t;this.createVertexArray=()=>I(s,()=>s.createVertexArray()),this.bindVertexArray=i=>I(s,()=>s.bindVertexArray(i)),this.deleteVertexArray=i=>I(s,()=>s.deleteVertexArray(i)),this.getVertexArray=()=>I(s,()=>s.getParameter(s.VERTEX_ARRAY_BINDING));}else if(t!=null){let s=t.getExtension("OES_vertex_array_object");if(s==null)throw new Error("All WebGL1 implementations are expected to offer OES_vertex_array_object.");this.createVertexArray=()=>I(t,()=>s.createVertexArrayOES()),this.bindVertexArray=i=>I(t,()=>s.bindVertexArrayOES(i)),this.deleteVertexArray=i=>I(t,()=>s.deleteVertexArrayOES(i)),this.getVertexArray=()=>I(t,()=>t.getParameter(s.VERTEX_ARRAY_BINDING_OES));}let r="WEBGL_color_buffer_float",n="EXT_color_buffer_half_float";if(this.parallelCompilationExtension=this.gl.getExtension("KHR_parallel_shader_compile"),O$1().getNumber("WEBGL_VERSION")===1){let s="OES_texture_float",i="OES_texture_half_float";if(this.textureFloatExtension=Xe(this.gl,s),ee(this.gl,i))this.textureHalfFloatExtension=Xe(this.gl,i);else if(O$1().get("WEBGL_FORCE_F16_TEXTURES"))throw new Error("GL context does not support half float textures, yet the environment flag WEBGL_FORCE_F16_TEXTURES is set to true.");if(this.colorBufferFloatExtension=this.gl.getExtension(r),ee(this.gl,n))this.colorBufferHalfFloatExtension=Xe(this.gl,n);else if(O$1().get("WEBGL_FORCE_F16_TEXTURES"))throw new Error("GL context does not support color renderable half floats, yet the environment flag WEBGL_FORCE_F16_TEXTURES is set to true.")}else if(r="EXT_color_buffer_float",ee(this.gl,r))this.colorBufferFloatExtension=this.gl.getExtension(r);else if(ee(this.gl,n))this.colorBufferHalfFloatExtension=this.gl.getExtension(n);else throw new Error("GL context does not support color renderable floats");this.vertexBuffer=jr(this.gl),this.indexBuffer=Yr(this.gl),this.framebuffer=Or(this.gl),this.textureConfig=ht(this.gl,this.textureHalfFloatExtension);}get debug(){return O$1().getBool("DEBUG")}dispose(){if(this.disposed)return;this.program!=null&&console.warn("Disposing a GPGPUContext that still has a bound WebGLProgram. This is probably a resource leak, delete the program with GPGPUContext.deleteProgram before disposing."),this.outputTexture!=null&&console.warn("Disposing a GPGPUContext that still has a bound output matrix texture.  This is probably a resource leak, delete the output matrix texture with GPGPUContext.deleteMatrixTexture before disposing.");let t=this.gl;I(t,()=>t.finish()),I(t,()=>t.bindFramebuffer(t.FRAMEBUFFER,null)),I(t,()=>t.deleteFramebuffer(this.framebuffer)),I(t,()=>t.bindBuffer(t.ARRAY_BUFFER,null)),I(t,()=>t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,null)),I(t,()=>t.deleteBuffer(this.indexBuffer)),this.disposed=true;}createFloat32MatrixTexture(t,e){return this.throwIfDisposed(),Qr(this.gl,t,e,this.textureConfig)}createFloat16MatrixTexture(t,e){return this.throwIfDisposed(),Zr(this.gl,t,e,this.textureConfig)}createUnsignedBytesMatrixTexture(t,e){return this.throwIfDisposed(),Jr(this.gl,t,e,this.textureConfig)}uploadPixelDataToTexture(t,e){this.throwIfDisposed(),nn(this.gl,t,e);}uploadDenseMatrixToTexture(t,e,r,n){this.throwIfDisposed(),rn(this.gl,t,e,r,n,this.textureConfig);}createFloat16PackedMatrixTexture(t,e){return this.throwIfDisposed(),tn(this.gl,t,e,this.textureConfig)}createPackedMatrixTexture(t,e){return this.throwIfDisposed(),en(this.gl,t,e,this.textureConfig)}deleteMatrixTexture(t){this.throwIfDisposed(),this.outputTexture===t&&(Ft(this.gl,this.framebuffer),this.outputTexture=null),I(this.gl,()=>this.gl.deleteTexture(t));}downloadByteEncodedFloatMatrixFromOutputTexture(t,e,r){return this.downloadMatrixDriver(t,()=>cn(this.gl,e,r,this.textureConfig))}downloadPackedMatrixFromBuffer(t,e,r,n,s,i){return ln(this.gl,t,e,r,n,s,i,this.textureConfig)}downloadFloat32MatrixFromBuffer(t,e){return an(this.gl,t,e)}createBufferFromTexture(t,e,r){this.bindTextureToFrameBuffer(t);let n=sn(this.gl,e,r,this.textureConfig);return this.unbindTextureToFrameBuffer(),n}createAndWaitForFence(){let t=this.createFence(this.gl);return this.pollFence(t)}createFence(t){let e,r;if(O$1().getBool("WEBGL_FENCE_API_ENABLED")){let n=t,s=n.fenceSync(n.SYNC_GPU_COMMANDS_COMPLETE,0);t.flush(),r=()=>{let i=n.clientWaitSync(s,0,0);return i===n.ALREADY_SIGNALED||i===n.CONDITION_SATISFIED},e=s;}else O$1().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")>0?(e=this.beginQuery(),this.endQuery(),r=()=>this.isQueryAvailable(e,O$1().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"))):r=()=>true;return {query:e,isFencePassed:r}}downloadMatrixFromPackedTexture(t,e,r){return this.downloadMatrixDriver(t,()=>un(this.gl,e,r))}createProgram(t){this.throwIfDisposed();let e=this.gl;this.vertexShader==null&&(this.vertexShader=qr(e));let r=kr(e);I(e,()=>e.attachShader(r,this.vertexShader)),I(e,()=>e.attachShader(r,t)),_r(e,r);let n=Object.assign(r,{vao:this.createVertexArray()});return this.debug&&xt(e,n),n}buildVao(t){this.setProgram(t),this.bindVertexArray(t.vao);let e=this.gl;I(e,()=>e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.indexBuffer)),on(e,t,this.vertexBuffer);}deleteProgram(t){this.throwIfDisposed(),t===this.program&&(this.program=null),t!=null&&(I(this.gl,()=>this.gl.deleteProgram(t)),this.deleteVertexArray(t.vao));}setProgram(t){this.throwIfDisposed(),this.program=t,this.program!=null&&this.debug&&xt(this.gl,this.program),I(this.gl,()=>this.gl.useProgram(t));}getUniformLocation(t,e,r=true){return this.throwIfDisposed(),r?Lr(this.gl,t,e):Br(this.gl,t,e)}getAttributeLocation(t,e){return this.throwIfDisposed(),I(this.gl,()=>this.gl.getAttribLocation(t,e))}getUniformLocationNoThrow(t,e){return this.throwIfDisposed(),this.gl.getUniformLocation(t,e)}setInputMatrixTexture(t,e,r){this.throwIfDisposed(),this.throwIfNoProgram(),Ur(this.gl,t,e,r);}setOutputMatrixTexture(t,e,r){this.setOutputMatrixTextureDriver(t,r,e);}setOutputPackedMatrixTexture(t,e,r){this.throwIfDisposed();let[n,s]=me(e,r);this.setOutputMatrixTextureDriver(t,n,s);}setOutputMatrixWriteRegion(t,e,r,n){this.setOutputMatrixWriteRegionDriver(r,t,n,e);}setOutputPackedMatrixWriteRegion(t,e,r,n){throw new Error("setOutputPackedMatrixWriteRegion not implemented.")}debugValidate(){this.program!=null&&xt(this.gl,this.program),Ke(this.gl);}executeProgram(){this.throwIfDisposed(),this.throwIfNoProgram();let t=this.gl;if(this.debug){let e=this.getVertexArray();console.assert(e===this.program.vao,"VAO changed between setProgram and executeProgram!"),this.debugValidate();}I(t,()=>t.drawElements(t.TRIANGLES,6,t.UNSIGNED_SHORT,0));}blockUntilAllProgramsCompleted(){this.throwIfDisposed(),I(this.gl,()=>this.gl.finish());}getQueryTimerExtension(){return this.disjointQueryTimerExtension==null&&(this.disjointQueryTimerExtension=Xe(this.gl,O$1().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")===2?"EXT_disjoint_timer_query_webgl2":"EXT_disjoint_timer_query")),this.disjointQueryTimerExtension}getQueryTimerExtensionWebGL2(){return this.getQueryTimerExtension()}getQueryTimerExtensionWebGL1(){return this.getQueryTimerExtension()}beginQuery(){if(O$1().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")===2){let r=this.gl,n=this.getQueryTimerExtensionWebGL2(),s=r.createQuery();return r.beginQuery(n.TIME_ELAPSED_EXT,s),s}let t=this.getQueryTimerExtensionWebGL1(),e=t.createQueryEXT();return t.beginQueryEXT(t.TIME_ELAPSED_EXT,e),e}endQuery(){if(O$1().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")===2){let e=this.gl,r=this.getQueryTimerExtensionWebGL2();e.endQuery(r.TIME_ELAPSED_EXT);return}let t=this.getQueryTimerExtensionWebGL1();t.endQueryEXT(t.TIME_ELAPSED_EXT);}waitForQueryAndGetTime(t){return D(this,null,function*(){return yield R.repeatedTry(()=>this.disposed||this.isQueryAvailable(t,O$1().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"))),this.getQueryTime(t,O$1().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"))})}getQueryTime(t,e){if(e===0)return null;if(e===2){let r=this.gl;return r.getQueryParameter(t,r.QUERY_RESULT)/1e6}else {let r=this.getQueryTimerExtensionWebGL1();return r.getQueryObjectEXT(t,r.QUERY_RESULT_EXT)/1e6}}isQueryAvailable(t,e){if(e===0)return  true;if(e===2){let r=this.gl,n=this.getQueryTimerExtensionWebGL2(),s=r.getQueryParameter(t,r.QUERY_RESULT_AVAILABLE);return this.disjoint==null&&(this.disjoint=this.gl.getParameter(n.GPU_DISJOINT_EXT)),s&&!this.disjoint}else {let r=this.getQueryTimerExtensionWebGL1(),n=r.getQueryObjectEXT(t,r.QUERY_RESULT_AVAILABLE_EXT);return this.disjoint==null&&(this.disjoint=this.gl.getParameter(r.GPU_DISJOINT_EXT)),n&&!this.disjoint}}pollFence(t){return new Promise(e=>{this.addItemToPoll(()=>t.isFencePassed(),()=>e());})}pollItems(){let t=Qm(this.itemsToPoll.map(e=>e.isDoneFn));for(let e=0;e<=t;++e){let{resolveFn:r}=this.itemsToPoll[e];r();}this.itemsToPoll=this.itemsToPoll.slice(t+1);}addItemToPoll(t,e){if(this.itemsToPoll.push({isDoneFn:t,resolveFn:e}),this.itemsToPoll.length>1)return;let r;"setTimeoutCustom"in O$1().platform&&(r=O$1().platform.setTimeoutCustom.bind(O$1().platform)),R.repeatedTry(()=>(this.pollItems(),this.itemsToPoll.length===0),()=>0,null,r);}bindTextureToFrameBuffer(t){this.throwIfDisposed(),gt(this.gl,t,this.framebuffer),this.debug&&Ke(this.gl);}unbindTextureToFrameBuffer(){this.outputTexture!=null?(gt(this.gl,this.outputTexture,this.framebuffer),this.debug&&Ke(this.gl)):Ft(this.gl,this.framebuffer);}downloadMatrixDriver(t,e){this.bindTextureToFrameBuffer(t);let r=e();return this.unbindTextureToFrameBuffer(),r}setOutputMatrixTextureDriver(t,e,r){this.throwIfDisposed();let n=this.gl;gt(n,t,this.framebuffer),this.debug&&Ke(n),this.outputTexture=t,I(n,()=>n.viewport(0,0,e,r)),I(n,()=>n.scissor(0,0,e,r));}setOutputMatrixWriteRegionDriver(t,e,r,n){this.throwIfDisposed(),I(this.gl,()=>this.gl.scissor(t,e,r,n));}throwIfDisposed(){if(this.disposed)throw new Error("Attempted to use disposed GPGPUContext.")}throwIfNoProgram(){if(this.program==null)throw new Error("No GPU program is currently set.")}};function Qm(o){let t=0;for(;t<o.length&&o[t]();++t);return t-1}var{addImpl:xc,bincountImpl:Kt,bincountReduceImpl:gc,bitwiseAndImpl:Cc,castImpl:bc,ceilImpl:vc,concatImpl:$c,equalImpl:Sc,expImpl:yc,expm1Impl:Rc,floorImpl:Tc,gatherNdImpl:wc,gatherV2Impl:Ic,greaterImpl:Nc,greaterEqualImpl:Ec,lessImpl:kc,lessEqualImpl:_c,linSpaceImpl:Ac,logImpl:Fc,maxImpl:Dc,maximumImpl:Pc,minimumImpl:Oc,multiplyImpl:Lc,negImpl:Bc,notEqualImpl:Uc,prodImpl:Vc,raggedGatherImpl:Wc,raggedRangeImpl:Mc,raggedTensorToTensorImpl:Gc,rangeImpl:zc,rsqrtImpl:Hc,scatterImpl:Xc,sigmoidImpl:Kc,simpleAbsImpl:qt,sliceImpl:qc,sparseFillEmptyRowsImpl:jc,sparseReshapeImpl:Yc,sparseSegmentReductionImpl:jt,sqrtImpl:Qc,staticRegexReplaceImpl:Zc,stridedSliceImpl:Jc,stringNGramsImpl:el,stringSplitImpl:tl,stringToHashBucketFastImpl:ol,subImpl:rl,tileImpl:nl,topKImpl:sl,transposeImpl:Be,uniqueImpl:il}=wr$1;function dn(o,t){return ["x","y","z","w","u","v"].slice(0,t).map(e=>`${o}.${e}`)}function V(o,t){return t===1?[o]:dn(o,t)}function al(o,t){if(o===1)return "rc";let e="";for(let r=0;r<o;r++)e+=t[r],r<o-1&&(e+=",");return e}var Yt=class{constructor(t){if(this.variableNames=["A"],this.packedInputs=false,this.packedOutput=true,this.outputShape=t,this.rank=t.length,this.enableShapeUniforms=L(this.outputShape.length),this.rank===0)this.userCode=`
        void main() {
          setOutput(vec4(getA(), 0., 0., 0.));
        }
      `;else {let e=V("rc",this.rank),r=A(this.rank),n=this.getOutOfBoundsCondition(e),s=this.getSetup(e),i=this.getOutput(e);this.userCode=`
        void main() {
          ${r} rc = getOutputCoords();

          if(${n}) {
            setOutput(vec4(0));
          } else {
            ${s}

            setOutput(vec4(${i}));
          }
        }
      `;}}getSourceCoordsArr(t){let e=[];for(let r=0;r<=1;r++)for(let n=0;n<=1;n++){let s=`${r===0?"r":"rp1"}, ${n===0?"c":"cp1"}`;for(let i=2;i<this.rank;i++)s=`${t[t.length-1-i]},`+s;e.push(s);}return e}getOutOfBoundsCondition(t){if(this.rank===1)return `rc > ${this.enableShapeUniforms?"outShape":this.outputShape[0]}`;let e="";for(let r=this.rank-2;r<this.rank;r++)e+=`${t[r]} >= ${this.enableShapeUniforms?`outShape[${r}]`:this.outputShape[r]}`,r<this.rank-1&&(e+="||");return e}getSetup(t){if(this.rank===1)return "";let e=t.slice(-2),r=this.enableShapeUniforms?`outShape[${this.rank} - 1]`:this.outputShape[this.rank-1],n=this.enableShapeUniforms?`outShape[${this.rank} - 2]`:this.outputShape[this.rank-2];return `
      int r = ${e[0]};
      int c = ${e[1]};
      int rp1 = r + 1;
      int cp1 = c + 1;

      bool cEdge = cp1 >= ${r};
      bool rEdge = rp1 >= ${n};
    `}getOutput(t){let e=this.getSourceCoordsArr(t);return this.rank===1?`getA(rc), (rc + 1 >= ${this.enableShapeUniforms?"outShape":this.outputShape[0]} ? 0. : getA(rc + 1)), 0, 0`:`getA(${e[0]}),
            cEdge ? 0. : getA(${e[1]}),
            rEdge ? 0. : getA(${e[2]}),
            rEdge || cEdge ? 0. : getA(${e[3]})`}};var rt=class{constructor(t,e){this.variableNames=["A"],this.packedInputs=true,this.packedOutput=true,this.customUniforms=[{name:"inputShape",type:"ivec3"}],this.outputShape=t,this.enableShapeUniforms=L(this.outputShape.length);let r="";for(let n=0;n<4;n++){let s="thisRC = rc;";n%2===1&&(s+="thisRC.z += 1;"),n>1&&(s+="thisRC.y += 1;"),r+=`
        ${s}
        ${n>0?"if(thisRC.y < rows && thisRC.z < cols){":""}
          int flatIndex = getFlatIndex(thisRC);

          ivec3 inputRC = inputCoordsFromReshapedOutCoords(flatIndex);
          vec2 inputRCInnerDims = vec2(float(inputRC.y),float(inputRC.z));

          result[${n}] =
            getChannel(getA(inputRC.x, inputRC.y, inputRC.z), inputRCInnerDims);
        ${n>0?"}":""}
      `;}this.userCode=`
      ${Zm(e,this.enableShapeUniforms)}
      ${this.enableShapeUniforms?Qe():Ye(t)}

      void main() {
        ivec3 rc = getOutputCoords();

        vec4 result = vec4(0.);

        ivec3 thisRC;
        int rows = ${this.enableShapeUniforms?"outShape[1]":t[1]};
        int cols = ${this.enableShapeUniforms?"outShape[2]":t[2]};

        ${r}

        setOutput(result);
      }
    `;}};function Zm(o,t){return `
    ivec3 inputCoordsFromReshapedOutCoords(int index) {
      ${t?ac(["r","c","d"],"inputShape"):le(["r","c","d"],o)}
      return ivec3(r, c, d);
    }
  `}vS();var Qt=class{constructor(t){this.gpgpu=t,this.numUsedTextures=0,this.numFreeTextures=0,this._numBytesAllocated=0,this._numBytesFree=0,this.freeTextures={},this.usedTextures={},this.logEnabled=false;}acquireTexture(t,e,r){let n=ll(e,r),s=ul(t,n,r);s in this.freeTextures||(this.freeTextures[s]=[]),s in this.usedTextures||(this.usedTextures[s]=[]);let i=cl(t,n,this.gpgpu.gl,this.gpgpu.textureConfig,r);if(this.freeTextures[s].length>0){this.numFreeTextures--,this.numUsedTextures++,this._numBytesFree-=i,this.log();let a=this.freeTextures[s].pop();return this.usedTextures[s].push(a),a}let c;return n===X.PACKED_2X2_FLOAT32?c=this.gpgpu.createPackedMatrixTexture(t[0],t[1]):n===X.PACKED_2X2_FLOAT16?c=this.gpgpu.createFloat16PackedMatrixTexture(t[0],t[1]):n===X.UNPACKED_FLOAT32?c=this.gpgpu.createFloat32MatrixTexture(t[0],t[1]):n===X.UNPACKED_FLOAT16?c=this.gpgpu.createFloat16MatrixTexture(t[0],t[1]):n===X.PACKED_4X1_UNSIGNED_BYTE&&(c=this.gpgpu.createUnsignedBytesMatrixTexture(t[0],t[1])),this.usedTextures[s].push(c),this.numUsedTextures++,this._numBytesAllocated+=i,this.log(),c}releaseTexture(t,e,r,n){if(this.freeTextures==null)return;let s=ll(r,n),i=ul(e,s,n);i in this.freeTextures||(this.freeTextures[i]=[]);let c=cl(e,s,this.gpgpu.gl,this.gpgpu.textureConfig,n),a=O$1().getNumber("WEBGL_DELETE_TEXTURE_THRESHOLD");a!==-1&&this._numBytesAllocated>a?(this.gpgpu.deleteMatrixTexture(t.texture),this._numBytesAllocated-=c):(this.freeTextures[i].push(t),this.numFreeTextures++,this._numBytesFree+=c),this.numUsedTextures--;let l=this.usedTextures[i],u=l&&l.indexOf(t);if(u==null||u<0)throw new Error("Cannot release a texture that was never provided by this texture manager");l[u]=l[l.length-1],l.pop(),this.log();}log(){if(!this.logEnabled)return;let t=this.numFreeTextures+this.numUsedTextures;console.log("Free/Used",`${this.numFreeTextures} / ${this.numUsedTextures}`,`(${t})`);let e=this._numBytesFree/this._numBytesAllocated;console.log(`Bytes allocated: ${this._numBytesAllocated}`),console.log(`Bytes unused: ${this._numBytesFree} (${Math.round(100*e)}%)`);}get numBytesAllocated(){return this._numBytesAllocated}get numBytesFree(){return this._numBytesFree}getNumUsedTextures(){return this.numUsedTextures}getNumFreeTextures(){return this.numFreeTextures}dispose(){if(this.freeTextures!=null){for(let t in this.freeTextures)this.freeTextures[t].forEach(e=>{this.gpgpu.deleteMatrixTexture(e.texture);});for(let t in this.usedTextures)this.usedTextures[t].forEach(e=>{this.gpgpu.deleteMatrixTexture(e.texture);});this.freeTextures=null,this.usedTextures=null,this.numUsedTextures=0,this.numFreeTextures=0,this._numBytesAllocated=0,this._numBytesFree=0;}}};function Jm(o,t){let e=o;if(t===e.R32F)return 4;if(t===e.R16F)return 2;if(t===e.RGBA32F)return 16;if(t===o.RGBA)return 16;if(t===e.RGBA16F)return 8;if(t===e.RGBA8)return 4;throw new Error(`Unknown internal format ${t}`)}function cl(o,t,e,r,n){let s=ef(t,r),i;if(n){let[a,l]=me(o[0],o[1]);i=a*l;}else {let[a,l]=De(o[0],o[1]);i=a*l;}let c=Jm(e,s);return i*c}function ef(o,t){switch(o){case X.PACKED_2X2_FLOAT32:return Ht(t);case X.PACKED_2X2_FLOAT16:return Xt(t);case X.UNPACKED_FLOAT32:return Mt(t);case X.UNPACKED_FLOAT16:return Gt(t);case X.PACKED_4X1_UNSIGNED_BYTE:return zt(t);default:throw new Error(`Unknown physical texture type ${o}`)}}function tf(o){return O$1().getBool("WEBGL_RENDER_FLOAT32_ENABLED")?o?X.PACKED_2X2_FLOAT32:X.UNPACKED_FLOAT32:o?X.PACKED_2X2_FLOAT16:X.UNPACKED_FLOAT16}function ll(o,t){if(o===K.UPLOAD)return X.PACKED_2X2_FLOAT32;if(o===K.RENDER||o==null)return tf(t);if(o===K.DOWNLOAD||o===K.PIXELS)return X.PACKED_4X1_UNSIGNED_BYTE;throw new Error(`Unknown logical texture type ${o}`)}function ul(o,t,e){return `${o[0]}_${o[1]}_${t}_${e}`}var H=class{constructor(t,e){this.variableNames=["A"],this.outputShape=t,this.enableShapeUniforms=L(this.outputShape.length),this.userCode=`
      float unaryOperation(float x) {
        ${e}
      }

      void main() {
        float x = getAAtOutCoords();
        float y = unaryOperation(x);

        setOutput(y);
      }
    `;}},z="if (isnan(x)) return x;",pl="return x;",mn="return abs(x);";var dl="return (x >= 0.0) ? x : (exp(x) - 1.0);",ml=z+`
  return (x < 0.0) ? 0.0 : x;
`,fl=z+`
  return (x < 0.0) ? 0.0 : min(6.0, x);
`,fe="return x;",hl="return 1.0 / (1.0 + exp(-1.0 * x));";var gl="return x;",Cl=`
  vec4 result;

  result.r = (x.r >= 0.0) ? x.r : (exp(x.r) - 1.0);
  result.g = (x.g >= 0.0) ? x.g : (exp(x.g) - 1.0);
  result.b = (x.b >= 0.0) ? x.b : (exp(x.b) - 1.0);
  result.a = (x.a >= 0.0) ? x.a : (exp(x.a) - 1.0);

  return result;
`,bl=`
  vec4 result = x * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,vl=`
  vec4 result = min(x, vec4(6.)) * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,$l="return 1.0 / (1.0 + exp(-1.0 * x));",j=class{constructor(t,e){this.variableNames=["A"],this.packedInputs=true,this.packedOutput=true,this.outputShape=t,this.enableShapeUniforms=L(this.outputShape.length),this.userCode=`
      vec4 unaryOperation(vec4 x) {
        ${e}
      }

      void main() {
        vec4 x = getAAtOutCoords();
        vec4 y = unaryOperation(x);

        setOutput(y);
      }
    `;}};var Zt=class{constructor(t){this.variableNames=["A"],this.packedInputs=true,this.packedOutput=false,this.outputShape=t,this.enableShapeUniforms=L(this.outputShape.length);let e=t.length,r=V("rc",e),n=A(e),s=al(e,r),i=r.slice(-2),c=e<=1?"rc":`vec2(${i.join(",")})`;this.userCode=`
      void main() {
        ${n} rc = getOutputCoords();
        vec4 packedInput = getA(${s});

        setOutput(getChannel(packedInput, ${c}));
      }
    `;}};var rf=Sp$1.whereImpl,nf=1e-7,sf=1e-4,Jt={};function af(o){return o in Jt||(Jt[o]={}),Jt[o]}var cf=O$1().getNumber("CPU_HANDOFF_SIZE_THRESHOLD"),lf=600;function uf(){return O$1().global.screen==null?1024:O$1().global.screen.height*O$1().global.screen.width*window.devicePixelRatio*lf/1024/1024}var fn=(()=>{class o extends po$1{nextDataId(){return o.nextDataId++}constructor(e){if(super(),this.pendingRead=new WeakMap,this.pendingDisposal=new WeakSet,this.dataRefCount=new WeakMap,this.numBytesInGPU=0,this.uploadWaitMs=0,this.downloadWaitMs=0,this.lastGlFlushTime=0,this.warnedAboutMemory=false,this.pendingDeletes=0,this.disposed=false,!O$1().getBool("HAS_WEBGL"))throw new Error("WebGL is not supported on this device");let r;if(e!=null){if(e instanceof Le)r=e;else {let n=J(O$1().getNumber("WEBGL_VERSION"),e);r=new Le(n);}this.binaryCache={},this.gpgpuCreatedLocally=false;}else {let n=J(O$1().getNumber("WEBGL_VERSION"));r=new Le(n),this.binaryCache=af(O$1().getNumber("WEBGL_VERSION")),this.gpgpuCreatedLocally=true;}this.gpgpu=r,this.canvas=this.gpgpu.gl.canvas,this.textureManager=new Qt(this.gpgpu),this.numMBBeforeWarning=uf(),this.texData=new qn(this,Y0());}numDataIds(){return this.texData.numDataIds()-this.pendingDeletes}writeTexture(e,r,n,s,i,c){let a=this.makeTensorInfo(r,n),l=this.texData.get(a.dataId);l.isPacked=false,l.texture={texture:e,texShape:[s,i]},l.texShape=[s,i];let u=qe(r),p=new Ct(u,false,c),d=this.runWebGLProgram(p,[a],n,[[s,i]]);return d.shape=r,l.texture=null,this.disposeIntermediateTensorInfo(a),d.dataId}write(e,r,n){if((O$1().getBool("WEBGL_CHECK_NUMERICAL_PROBLEMS")||O$1().getBool("DEBUG"))&&this.checkNumericalProblems(e),n==="complex64"&&e!=null)throw new Error("Cannot write to a complex64 dtype. Please use tf.complex(real, imag).");let s={id:this.nextDataId()};return this.texData.set(s,{shape:r,dtype:n,values:e,usage:K.UPLOAD,refCount:1}),s}refCount(e){return this.texData.has(e)?this.texData.get(e).refCount:0}incRef(e){let r=this.texData.get(e);r.refCount++;}decRef(e){if(this.texData.has(e)){let r=this.texData.get(e);r.refCount--;}}move(e,r,n,s,i){if(O$1().getBool("DEBUG")&&this.checkNumericalProblems(r),s==="complex64")throw new Error("Cannot write to a complex64 dtype. Please use tf.complex(real, imag).");this.texData.set(e,{shape:n,dtype:s,values:r,usage:K.UPLOAD,refCount:i});}disposeIntermediateTensorInfo(e){this.disposeData(e.dataId);}readSync(e){let r=this.texData.get(e),{values:n,dtype:s,complexTensorInfos:i,slice:c,shape:a,isPacked:l}=r;if(c!=null){let m;l?m=new j(a,fe):m=new H(a,fe);let f=this.runWebGLProgram(m,[{dataId:e,shape:a,dtype:s}],s),h=this.readSync(f.dataId);return this.disposeIntermediateTensorInfo(f),h}if(n!=null)return this.convertAndCacheOnCPU(e);if(s==="string")return n;let u=this.activeTimers!=null,p;u&&(p=R.now());let d;if(s==="complex64"){let m=this.readSync(i.real.dataId),f=this.readSync(i.imag.dataId);d=kp$1.mergeRealAndImagArrays(m,f);}else d=this.getValuesFromTexture(e);return u&&(this.downloadWaitMs+=R.now()-p),this.convertAndCacheOnCPU(e,d)}read(e){return D(this,null,function*(){if(this.pendingRead.has(e)){let h=this.pendingRead.get(e);return new Promise(g=>h.push(g))}let r=this.texData.get(e),{values:n,shape:s,slice:i,dtype:c,complexTensorInfos:a,isPacked:l}=r;if(i!=null){let h;l?h=new j(s,fe):h=new H(s,fe);let g=this.runWebGLProgram(h,[{dataId:e,shape:s,dtype:c}],c),x=this.read(g.dataId);return this.disposeIntermediateTensorInfo(g),x}if(n!=null)return this.convertAndCacheOnCPU(e);if(O$1().getBool("DEBUG")&&!O$1().getBool("WEBGL_DOWNLOAD_FLOAT_ENABLED")&&O$1().getNumber("WEBGL_VERSION")===2)throw new Error("tensor.data() with WEBGL_DOWNLOAD_FLOAT_ENABLED=false and WEBGL_VERSION=2 not yet supported.");let u=null,p;if(c!=="complex64"&&O$1().get("WEBGL_BUFFER_SUPPORTED")){p=this.decode(e);let h=this.texData.get(p.dataId);u=this.gpgpu.createBufferFromTexture(h.texture.texture,...ft(s));}this.pendingRead.set(e,[]),c!=="complex64"&&(yield this.gpgpu.createAndWaitForFence());let d;if(c==="complex64"){let h=yield Promise.all([this.read(a.real.dataId),this.read(a.imag.dataId)]),g=h[0],x=h[1];d=kp$1.mergeRealAndImagArrays(g,x);}else if(u==null)d=this.getValuesFromTexture(e);else {let h=R.sizeFromShape(s);d=this.gpgpu.downloadFloat32MatrixFromBuffer(u,h);}if(p!=null&&this.disposeIntermediateTensorInfo(p),u!=null){let h=this.gpgpu.gl;I(h,()=>h.deleteBuffer(u));}let m=this.convertAndCacheOnCPU(e,d),f=this.pendingRead.get(e);return this.pendingRead.delete(e),f.forEach(h=>h(m)),this.pendingDisposal.has(e)&&(this.pendingDisposal.delete(e),this.disposeData(e)&&Y0().removeDataId(e,this),this.pendingDeletes--),m})}readToGPU(e,r={}){let n=this.texData.get(e),{values:s,shape:i,slice:c,dtype:a,isPacked:l,texture:u}=n;if(a==="complex64")throw new Error("Does not support reading texture for complex64 dtype.");if(c!=null){let f;l?f=new j(i,fe):f=new H(i,fe);let h=this.runWebGLProgram(f,[{dataId:e,shape:i,dtype:a}],a),g=this.readToGPU(h,r);return this.disposeIntermediateTensorInfo(h),g}if(u==null)throw s!=null?new Error("Data is not on GPU but on CPU."):new Error("There is no data on GPU or CPU.");let p=this.decode(e,r.customTexShape),d=Y0().makeTensorFromTensorInfo(p),m=this.texData.get(p.dataId);return Object.assign({tensorRef:d},m.texture)}bufferSync(e){let r=this.readSync(e.dataId);if(e.dtype==="string")try{let n=r.map(s=>R.decodeString(s));return Ct$1(e.shape,e.dtype,n)}catch(n){throw new Error("Failed to decode encoded string bytes into utf-8")}return Ct$1(e.shape,e.dtype,r)}checkNumericalProblems(e){if(e!=null)for(let r=0;r<e.length;r++){let n=e[r];if(!Ir(n))throw O$1().getBool("WEBGL_RENDER_FLOAT32_CAPABLE")?Error(`The value ${n} cannot be represented with your current settings. Consider enabling float32 rendering: 'tf.env().set('WEBGL_RENDER_FLOAT32_ENABLED', true);'`):Error(`The value ${n} cannot be represented on this device.`)}}getValuesFromTexture(e){let{shape:r,dtype:n,isPacked:s}=this.texData.get(e),i=R.sizeFromShape(r);if(O$1().getBool("WEBGL_DOWNLOAD_FLOAT_ENABLED")){let m=this.decode(e),f=this.texData.get(m.dataId),h=this.gpgpu.downloadMatrixFromPackedTexture(f.texture.texture,...ft(r)).subarray(0,i);return this.disposeIntermediateTensorInfo(m),h}let c=O$1().getBool("WEBGL_PACK")&&s===true,a=c?qe(r):r,l=c?new Vt(a):new Ut(a),u=this.runWebGLProgram(l,[{shape:a,dtype:n,dataId:e}],"float32"),p=this.texData.get(u.dataId),d=this.gpgpu.downloadByteEncodedFloatMatrixFromOutputTexture(p.texture.texture,p.texShape[0],p.texShape[1]).subarray(0,i);return this.disposeIntermediateTensorInfo(u),d}timerAvailable(){return O$1().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0}time(e){let r=this.activeTimers,n=[],s=false;this.programTimersStack==null?(this.programTimersStack=n,s=true):this.activeTimers.push(n),this.activeTimers=n,e();let i=R.flatten(this.activeTimers.map(l=>l.query)).filter(l=>l!=null),c=R.flatten(this.activeTimers.map(l=>l.name)).filter(l=>l!=null);this.activeTimers=r,s&&(this.programTimersStack=null);let a={uploadWaitMs:this.uploadWaitMs,downloadWaitMs:this.downloadWaitMs,kernelMs:null,wallMs:null};return D(this,null,function*(){if(O$1().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0){let l=yield Promise.all(i);a.kernelMs=R.sum(l),a.getExtraProfileInfo=()=>l.map((u,p)=>({name:c[p],ms:u})).map(u=>`${u.name}: ${u.ms}`).join(", ");}else a.kernelMs={error:"WebGL query timers are not supported in this environment."};return this.uploadWaitMs=0,this.downloadWaitMs=0,a})}memory(){return {unreliable:false,numBytesInGPU:this.numBytesInGPU,numBytesInGPUAllocated:this.textureManager.numBytesAllocated,numBytesInGPUFree:this.textureManager.numBytesFree}}startTimer(){return O$1().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0?this.gpgpu.beginQuery():{startMs:R.now(),endMs:null}}endTimer(e){return O$1().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0?(this.gpgpu.endQuery(),e):(e.endMs=R.now(),e)}getQueryTime(e){return D(this,null,function*(){if(O$1().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0)return this.gpgpu.waitForQueryAndGetTime(e);let r=e;return r.endMs-r.startMs})}disposeData(e,r=false){if(this.pendingDisposal.has(e))return  false;if(!this.texData.has(e))return  true;if(r?this.texData.get(e).refCount=0:this.texData.get(e).refCount--,!r&&this.texData.get(e).refCount>0)return  false;if(this.pendingRead.has(e))return this.pendingDisposal.add(e),this.pendingDeletes++,false;this.releaseGPUData(e);let{complexTensorInfos:n}=this.texData.get(e);return n!=null&&(this.disposeData(n.real.dataId,r),this.disposeData(n.imag.dataId,r)),this.texData.delete(e),true}releaseGPUData(e){let{texture:r,dtype:n,texShape:s,usage:i,isPacked:c,slice:a}=this.texData.get(e),l=a&&a.origDataId||e,u=this.dataRefCount.get(l);u>1?this.dataRefCount.set(l,u-1):(this.dataRefCount.delete(l),r!=null&&(this.numBytesInGPU-=this.computeBytes(s,n),this.textureManager.releaseTexture(r,s,i,c)));let p=this.texData.get(e);p.texture=null,p.texShape=null,p.isPacked=false,p.slice=null;}getTexture(e){return this.uploadToGPU(e),this.texData.get(e).texture.texture}getDataInfo(e){return this.texData.get(e)}shouldExecuteOnCPU(e,r=cf){return O$1().getBool("WEBGL_CPU_FORWARD")&&e.every(n=>this.texData.get(n.dataId).texture==null&&R.sizeFromShape(n.shape)<r)}getGPGPUContext(){return this.gpgpu}where(e){kp$1.warn("tf.where() in webgl locks the UI thread. Call tf.whereAsync() instead");let r=e.dataSync();return rf(e.shape,r)}packedUnaryOp(e,r,n){let s=new j(e.shape,r),i=this.compileAndRun(s,[e],n);return Y0().makeTensorFromTensorInfo(i)}abs(e){if(this.shouldExecuteOnCPU([e])&&e.dtype!=="complex64"){let s=qt(this.texData.get(e.dataId).values);return this.makeOutput(e.shape,e.dtype,s)}if(O$1().getBool("WEBGL_PACK_UNARY_OPERATIONS"))return this.packedUnaryOp(e,mn,e.dtype);let r=new H(e.shape,mn),n=this.compileAndRun(r,[e]);return Y0().makeTensorFromTensorInfo(n)}makeTensorInfo(e,r,n){let s;if(r==="string"&&n!=null&&n.length>0&&R.isString(n[0])){let i=n.map(c=>R.encodeString(c));s=this.write(i,e,r);}else s=this.write(n,e,r);return this.texData.get(s).usage=null,{dataId:s,shape:e,dtype:r}}makeOutput(e,r,n){return Y0().makeTensorFromTensorInfo(this.makeTensorInfo(e,r,n),this)}unpackTensor(e){let r=new Zt(e.shape);return this.runWebGLProgram(r,[e],e.dtype)}packTensor(e){let r=new Yt(e.shape);return this.runWebGLProgram(r,[e],e.dtype,null,true)}packedReshape(e,r){let n=[Ce(e.shape),...be(e.shape)],s={dtype:e.dtype,shape:n,dataId:e.dataId},i=[Ce(r),...be(r)],c=new rt(i,n),a=true,l=[n],u=this.runWebGLProgram(c,[s],e.dtype,l,a);return {dataId:u.dataId,shape:r,dtype:u.dtype}}decode(e,r){let n=this.texData.get(e),{isPacked:s,shape:i,dtype:c}=n;if(r!=null){let m=R.sizeFromShape(i),f=r[0]*r[1]*4;R.assert(m<=f,()=>"customTexShape is too small. Row * Column * 4 should be equal or larger than the size of the tensor data.");}let a=qe(i),l;s?l=new Bt(a):l=new Lt(a);let u=true,p=[r??ft(a)],d=this.runWebGLProgram(l,[{shape:a,dtype:c,dataId:e}],c,p,u,r);return {dtype:c,shape:i,dataId:d.dataId}}runWebGLProgram(e,r,n,s,i=false,c){let a=this.makeTensorInfo(e.outputShape,n),l=this.texData.get(a.dataId);if(e.packedOutput&&(l.isPacked=true),e.outPackingScheme===Fe.DENSE){let C=c??ft(e.outputShape);l.texShape=C.map(y=>y*2);}if(e.outTexUsage!=null&&(l.usage=e.outTexUsage),R.sizeFromShape(a.shape)===0)return l.values=R.getTypedArrayFromDType(a.dtype,0),a;let u=[],p=r.map(C=>{if(C.dtype==="complex64")throw new Error("GPGPUProgram does not support complex64 input. For complex64 dtypes, please separate the program into real and imaginary parts.");let y=this.texData.get(C.dataId);if(y.texture==null){if(!e.packedInputs&&R.sizeFromShape(C.shape)<=O$1().getNumber("WEBGL_SIZE_UPLOAD_UNIFORM"))return {shape:C.shape,texData:null,isUniform:true,uniformValues:y.values};e.packedInputs&&(y.isPacked=true,y.shape=C.shape);}if(this.uploadToGPU(C.dataId),!!y.isPacked!=!!e.packedInputs)C=y.isPacked?this.unpackTensor(C):this.packTensor(C),u.push(C),y=this.texData.get(C.dataId);else if(y.isPacked&&!Ie(y.shape,C.shape)){let R=C,w=C.shape;C.shape=y.shape,C=this.packedReshape(C,w),u.push(C),y=this.texData.get(C.dataId),R.shape=w;}return {shape:C.shape,texData:y,isUniform:false}});this.uploadToGPU(a.dataId);let d={shape:a.shape,texData:l,isUniform:false},m=hc(e,p,d),f=this.getAndSaveBinary(m,()=>mc(this.gpgpu,e,p,d)),h=this.activeTimers!=null,g;h&&(g=this.startTimer()),O$1().get("ENGINE_COMPILE_ONLY")||fc(this.gpgpu,f,p,d,s),u.forEach(C=>this.disposeIntermediateTensorInfo(C)),h&&(g=this.endTimer(g),this.activeTimers.push({name:e.constructor.name,query:this.getQueryTime(g)}));let x=O$1().getNumber("WEBGL_FLUSH_THRESHOLD");if(x>0){let C=R.now();C-this.lastGlFlushTime>x&&(this.gpgpu.gl.flush(),this.lastGlFlushTime=C);}if(!O$1().getBool("WEBGL_LAZILY_UNPACK")&&l.isPacked&&i===false){let C=this.unpackTensor(a);return this.disposeIntermediateTensorInfo(a),C}return a}compileAndRun(e,r,n,s,i=false){return n=n||r[0].dtype,this.runWebGLProgram(e,r,n,s,i)}getAndSaveBinary(e,r){return e in this.binaryCache||(this.binaryCache[e]=r()),this.binaryCache[e]}getTextureManager(){return this.textureManager}dispose(){this.disposed||(O$1().getBool("IS_TEST")||Object.keys(this.binaryCache).forEach(r=>{this.gpgpu.deleteProgram(this.binaryCache[r].webGLProgram),delete this.binaryCache[r];}),this.textureManager.dispose(),this.canvas!=null&&typeof HTMLCanvasElement<"u"&&this.canvas instanceof HTMLCanvasElement?this.canvas.remove():this.canvas=null,this.gpgpuCreatedLocally&&(this.gpgpu.program=null,this.gpgpu.dispose()),this.disposed=true);}floatPrecision(){return this.floatPrecisionValue==null&&(this.floatPrecisionValue=nt$1(()=>{if(!O$1().get("WEBGL_RENDER_FLOAT32_ENABLED")){let e=O$1().getBool("DEBUG");O$1().set("DEBUG",false);let r=this.abs(V$1(1e-8)).dataSync()[0];if(O$1().set("DEBUG",e),r>0)return 32}return 16})),this.floatPrecisionValue}epsilon(){return this.floatPrecision()===32?nf:sf}uploadToGPU(e){let r=this.texData.get(e),{shape:n,dtype:s,values:i,texture:c,usage:a,isPacked:l}=r;if(c!=null)return;let u=this.activeTimers!=null,p;u&&(p=R.now());let d=r.texShape;if(d==null&&(d=Vr(n,l),r.texShape=d),i!=null){let m=qe(n),f,h=d[1],g=d[0],x=i instanceof Uint8Array||i instanceof Uint8ClampedArray;(l||!x)&&([h,g]=me(d[0],d[1])),l?f=new Wt(m,x):f=new Ct(m,x);let C=x?[g,h]:d,y=this.makeTensorInfo(C,s),R$1=this.texData.get(y.dataId);x?R$1.usage=K.PIXELS:R$1.usage=K.UPLOAD,R$1.texShape=C,this.gpgpu.uploadDenseMatrixToTexture(this.getTexture(y.dataId),h,g,i);let w=[[g,h]],_=this.runWebGLProgram(f,[y],s,w,true),E=this.texData.get(_.dataId);r.texShape=E.texShape,r.isPacked=E.isPacked,r.usage=E.usage,O$1().get("ENGINE_COMPILE_ONLY")?this.disposeData(_.dataId):(r.texture=E.texture,r.values=null,this.texData.delete(_.dataId)),this.disposeIntermediateTensorInfo(y),u&&(this.uploadWaitMs+=R.now()-p);}else {let m=this.acquireTexture(d,a,s,l);r.texture=m;}}convertAndCacheOnCPU(e,r){let n=this.texData.get(e),{dtype:s}=n;return r!=null&&(n.values=pf(r,s)),n.values}acquireTexture(e,r,n,s){if(this.numBytesInGPU+=this.computeBytes(e,n),!this.warnedAboutMemory&&this.numBytesInGPU>this.numMBBeforeWarning*1024*1024){let i=(this.numBytesInGPU/1024/1024).toFixed(2);this.warnedAboutMemory=true,console.warn(`High memory usage in GPU: ${i} MB, most likely due to a memory leak`);}return this.textureManager.acquireTexture(e,r,s)}computeBytes(e,r){return e[0]*e[1]*R.bytesPerElement(r)}checkCompileCompletion(){for(let[,e]of Object.entries(this.binaryCache))this.checkCompletion_(e);}checkCompileCompletionAsync(){return D(this,null,function*(){let e=[];if(this.gpgpu.parallelCompilationExtension){for(let[,r]of Object.entries(this.binaryCache))e.push(this.checkCompletionAsync_(r));return Promise.all(e)}else {for(let[,r]of Object.entries(this.binaryCache)){let n=new Promise(s=>{try{this.checkCompletion_(r),s(!0);}catch(i){throw i}});e.push(n);}return Promise.all(e)}})}checkCompletionAsync_(e){return D(this,null,function*(){return this.gpgpu.gl.getProgramParameter(e.webGLProgram,this.gpgpu.parallelCompilationExtension.COMPLETION_STATUS_KHR)?this.checkCompletion_(e):(yield my(),this.checkCompletionAsync_(e))})}checkCompletion_(e){if(this.gpgpu.gl.getProgramParameter(e.webGLProgram,this.gpgpu.gl.LINK_STATUS)===false)throw console.log(this.gpgpu.gl.getProgramInfoLog(e.webGLProgram)),this.gpgpu.gl.getShaderParameter(e.fragmentShader,this.gpgpu.gl.COMPILE_STATUS)===false?(_t(e.source,this.gpgpu.gl.getShaderInfoLog(e.fragmentShader)),new Error("Failed to compile fragment shader.")):new Error("Failed to link vertex and fragment shaders.");return  true}getUniformLocations(){for(let e of Object.values(this.binaryCache)){this.gpgpu.buildVao(e.webGLProgram);let{variablesLocations:r,customUniformLocations:n,infLoc:s,nanLoc:i,outShapeLocation:c,outShapeStridesLocation:a,outTexShapeLocation:l}=Kr(this.gpgpu,e.program,e.webGLProgram);e.variablesLocations=r,e.customUniformLocations=n,e.infLoc=s,e.nanLoc=i,e.outShapeLocation=c,e.outShapeStridesLocation=a,e.outTexShapeLocation=l;}}createTensorFromGPUData(e,r,n){e.channels=e.channels||"RGBA";let{texture:s,height:i,width:c,channels:a}=e,l=Y0().backend;if(!l.gpgpu.gl.isTexture(s))throw new Error("The texture is invalid. Also, please make sure the texture and the TFJS WebGL backend are using the same canvas. If you want to use your own custom canvas, you have to create and use the custom TFJS WebGL backend created from the canvas through 'new tf.MathBackendWebGL(customCanvas)'.");let u=l.writeTexture(s,r,n,i,c,a);return Y0().makeTensorFromDataId(u,r,n,l)}}return o.nextDataId=0,o})();function pf(o,t){if(t==="float32"||t==="complex64")return o;if(t==="int32"||t==="bool"){let e=t==="int32"?new Int32Array(o.length):new Uint8Array(o.length);for(let r=0;r<e.length;++r)e[r]=Math.round(o[r]);return e}else throw new Error(`Unknown dtype ${t}`)}var df="4.22.0";vS();function Sl(){O$1().set("WEBGL_FORCE_F16_TEXTURES",true);}ls.isBrowser()&&a1("webgl",()=>new fn,2);var av={forceHalfFloat:Sl};vS();vS();vS();vS();vS();var nt=`
  if (isnan(a)) return a;
  if (isnan(b)) return b;
`;var Y=class{constructor(t,e,r){this.variableNames=["A","B"],this.outputShape=kp$1.assertAndGetBroadcastShape(e,r),this.enableShapeUniforms=L(this.outputShape.length),this.userCode=`
      float binaryOperation(float a, float b) {
        ${t}
      }

      void main() {
        float a = getAAtOutCoords();
        float b = getBAtOutCoords();
        setOutput(binaryOperation(a, b));
      }
    `;}};vS();var oe=`
  result.r = isNaN.r ? NAN : result.r;
  result.g = isNaN.g ? NAN : result.g;
  result.b = isNaN.b ? NAN : result.b;
  result.a = isNaN.a ? NAN : result.a;
`;var te=class{constructor(t,e,r,n=false){this.variableNames=["A","B"],this.supportsBroadcasting=true,this.packedInputs=true,this.packedOutput=true,this.outputShape=kp$1.assertAndGetBroadcastShape(e,r);let s=this.outputShape.length;this.enableShapeUniforms=L(s);let i="";if(n)if(s===0||R.sizeFromShape(this.outputShape)===1)i=`
          result.y = 0.;
          result.z = 0.;
          result.w = 0.;
        `;else if(i=`
          ${A(s)} coords = getOutputCoords();
        `,s===1)this.enableShapeUniforms?i+=`
            result.y = (coords + 1) >= outShape ? 0. : result.y;
            result.z = 0.;
            result.w = 0.;
          `:i+=`
            result.y = (coords + 1) >= ${this.outputShape[0]} ? 0. : result.y;
            result.z = 0.;
            result.w = 0.;
          `;else {let a=V("coords",s);this.enableShapeUniforms?i+=`
            bool nextRowOutOfBounds =
              (${a[s-2]} + 1) >= outShape[${s} - 2];
            bool nextColOutOfBounds =
              (${a[s-1]} + 1) >= outShape[${s} - 1];
            result.y = nextColOutOfBounds ? 0. : result.y;
            result.z = nextRowOutOfBounds ? 0. : result.z;
            result.w = nextColOutOfBounds || nextRowOutOfBounds ? 0. : result.w;
          `:i+=`
            bool nextRowOutOfBounds =
              (${a[s-2]} + 1) >= ${this.outputShape[s-2]};
            bool nextColOutOfBounds =
              (${a[s-1]} + 1) >= ${this.outputShape[s-1]};
            result.y = nextColOutOfBounds ? 0. : result.y;
            result.z = nextRowOutOfBounds ? 0. : result.z;
            result.w = nextColOutOfBounds || nextRowOutOfBounds ? 0. : result.w;
          `;}this.userCode=`
      vec4 binaryOperation(vec4 a, vec4 b) {
        ${t}
      }

      void main() {
        vec4 a = getAAtOutCoords();
        vec4 b = getBAtOutCoords();

        vec4 result = binaryOperation(a, b);
        ${i}

        setOutput(result);
      }
    `;}};vS();vS();function W(o){let{inputs:t,backend:e}=o,{x:r}=t;return e.incRef(r.dataId),{dataId:r.dataId,shape:r.shape,dtype:r.dtype}}var yl={kernelName:Qo$1,backendName:"webgl",kernelFunc:W};function Q(o){let{inputs:t,backend:e}=o,{real:r,imag:n}=t,s=e.makeTensorInfo(r.shape,"complex64"),i=e.texData.get(s.dataId),c=W({inputs:{x:r},backend:e}),a=W({inputs:{x:n},backend:e});return i.complexTensorInfos={real:c,imag:a},s}var Rl={kernelName:ha,backendName:"webgl",kernelFunc:Q};vS();var hn="return (a < 0.) ? b * a : a;",xn=`
  vec4 aLessThanZero = vec4(lessThan(a, vec4(0.)));
  return (aLessThanZero * (b * a)) + ((vec4(1.0) - aLessThanZero) * a);
`;function mf(o){let{inputs:t,backend:e,attrs:r}=o,{x:n}=t,{alpha:s}=r,i=e.makeTensorInfo([],"float32",R.createScalarValue(s,"float32")),c=O$1().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new te(xn,n.shape,i.shape):new Y(hn,n.shape,i.shape),a=e.runWebGLProgram(c,[n,i],"float32");return e.disposeIntermediateTensorInfo(i),a}var Tl={kernelName:Ya,backendName:"webgl",kernelFunc:mf};vS();var gn="return (a < 0.) ? b * a : a;",Cn=`
  vec4 aLessThanZero = vec4(lessThan(a, vec4(0.)));
  return (aLessThanZero * (b * a)) + ((vec4(1.0) - aLessThanZero) * a);
`;function ff(o){let{inputs:t,backend:e}=o,{x:r,alpha:n}=t,s=O$1().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new te(Cn,r.shape,n.shape):new Y(gn,r.shape,n.shape);return e.runWebGLProgram(s,[r,n],"float32")}var wl={kernelName:Tc$1,backendName:"webgl",kernelFunc:ff};var ie="if (isnan(x)) return x;";function N({opSnippet:o,packedOpSnippet:t,cpuKernelImpl:e,dtype:r}){return ({inputs:n,backend:s})=>{let{x:i}=n,c=s,a=r||i.dtype;if(c.shouldExecuteOnCPU([i])&&e!=null){let p=c.texData.get(i.dataId),d=e(p.values,a);return c.makeTensorInfo(i.shape,a,d)}let l=O$1().getBool("WEBGL_PACK_UNARY_OPERATIONS")&&t!=null,u;return l?u=new j(i.shape,t):u=new H(i.shape,o),c.runWebGLProgram(u,[i],a)}}function O({opSnippet:o,packedOpSnippet:t,checkOutOfBounds:e=false,supportsComplex:r=false,cpuKernelImpl:n,dtype:s}){return ({inputs:i,backend:c})=>{let{a,b:l}=i,u=c;if(r&&a.dtype==="complex64"){let f=u.texData.get(a.dataId),h=u.texData.get(l.dataId),[g,x]=[[f.complexTensorInfos.real,h.complexTensorInfos.real],[f.complexTensorInfos.imag,h.complexTensorInfos.imag]].map(y=>{let[R,w]=y,F={dataId:R.dataId,dtype:R.dtype,shape:a.shape},_={dataId:w.dataId,dtype:w.dtype,shape:l.shape},E=new Y(o,a.shape,l.shape);return u.runWebGLProgram(E,[F,_],Gr$1(R.dtype,w.dtype))}),C=Q({inputs:{real:g,imag:x},backend:u});return u.disposeIntermediateTensorInfo(g),u.disposeIntermediateTensorInfo(x),C}let p=s||Gr$1(a.dtype,l.dtype);if((a.dtype==="string"||l.dtype==="string"||u.shouldExecuteOnCPU([a,l]))&&n!=null){let f=u.texData.get(a.dataId).values,h=u.texData.get(l.dataId).values,g=a.dtype==="string"?kp$1.fromUint8ToStringArray(f):f,x=a.dtype==="string"?kp$1.fromUint8ToStringArray(h):h,[C,y]=n(a.shape,l.shape,g,x,p),R=u.makeTensorInfo(y,p),w=u.texData.get(R.dataId);return w.values=C,R}let d=O$1().getBool("WEBGL_PACK_BINARY_OPERATIONS")&&t!=null,m;return d?m=new te(t,a.shape,l.shape,e):m=new Y(o,a.shape,l.shape),u.runWebGLProgram(m,[a,l],p)}}function ve(o,t=false){if(o==="linear")return t?gl:pl;if(o==="relu")return t?bl:ml;if(o==="elu")return t?Cl:dl;if(o==="relu6")return t?vl:fl;if(o==="prelu")return t?Cn:gn;if(o==="leakyrelu")return t?xn:hn;if(o==="sigmoid")return t?$l:hl;throw new Error(`Activation ${o} has not been implemented for the WebGL backend.`)}var st=class{constructor(t,e,r,n=false,s=false,i=false,c=null,a=false,l=false){this.variableNames=["matrixA","matrixB"],this.packedInputs=true,this.packedOutput=true,this.outputShape=r,this.enableShapeUniforms=L(this.outputShape.length);let u=n?t[1]:t[2],p=Math.ceil(u/2),d=n?"i * 2, rc.y":"rc.y, i * 2",m=s?"rc.z, i * 2":"i * 2, rc.z",f=n?["a.xxyy","a.zzww"]:["a.xxzz","a.yyww"],h=s?["b.xzxz","b.ywyw"]:["b.xyxy","b.zwzw"],g="",x="";c&&(a?g=`vec4 activation(vec4 a) {
          vec4 b = getPreluActivationWeightsAtOutCoords();
          ${c}
        }`:l?g=`vec4 activation(vec4 a) {
          vec4 b = getLeakyreluAlphaAtOutCoords();
          ${c}
        }`:g=`vec4 activation(vec4 x) {
          ${c}
        }`,x="result = activation(result);");let C=i?"result += getBiasAtOutCoords();":"";i&&this.variableNames.push("bias"),a&&this.variableNames.push("preluActivationWeights"),l&&this.variableNames.push("leakyreluAlpha");let y="rc.x",R="rc.x";t[0]<e[0]?y=`imod(rc.x, ${t[0]})`:e[0]<t[0]&&(R=`imod(rc.x, ${e[0]})`),this.userCode=`
      ${g}
      // Don't use uniform for sharedDimensionPacked for performance.
      const float sharedDimension = ${p}.0;

      vec4 dot2x2ARowBCol(ivec3 rc) {
        vec4 result = vec4(0);
        int batchA = ${y};
        int batchB = ${R};
        for (int i = 0; i < ${p}; i++) {
          vec4 a = getMatrixA(batchA, ${d});
          vec4 b = getMatrixB(batchB, ${m});

          // These swizzled products need to be separately added.
          // See: https://github.com/tensorflow/tfjs/issues/1735
          result += (${f[0]} * ${h[0]});
          result += (${f[1]} * ${h[1]});
        }
        return result;
      }

      void main() {
        ivec3 rc = getOutputCoords();
        vec4 result = dot2x2ARowBCol(rc);

        ${C}

        ${x}

        setOutput(result);
      }
    `;}};vS();vS();var bn={REAL:"return areal * breal - aimag * bimag;",IMAG:"return areal * bimag + aimag * breal;"},vt=class{constructor(t,e,r){this.variableNames=["AReal","AImag","BReal","BImag"],this.outputShape=kp$1.assertAndGetBroadcastShape(e,r),this.userCode=`
      float binaryOpComplex(
          float areal, float aimag, float breal, float bimag) {
        ${t}
      }

      void main() {
        float areal = getARealAtOutCoords();
        float aimag = getAImagAtOutCoords();
        float breal = getBRealAtOutCoords();
        float bimag = getBImagAtOutCoords();
        setOutput(binaryOpComplex(areal, aimag, breal, bimag));
      }
    `;}};var Il="return a * b;";function $t(o){let{inputs:t,backend:e}=o,{a:r,b:n}=t,s=kp$1.upcastType(r.dtype,n.dtype);if(r.dtype==="complex64"){let c=e.texData.get(r.dataId),a=e.texData.get(n.dataId),l=new vt(bn.REAL,r.shape,n.shape),u=new vt(bn.IMAG,r.shape,n.shape),p=[{dataId:c.complexTensorInfos.real.dataId,dtype:c.complexTensorInfos.real.dtype,shape:r.shape},{dataId:c.complexTensorInfos.imag.dataId,dtype:c.complexTensorInfos.imag.dtype,shape:r.shape},{dataId:a.complexTensorInfos.real.dataId,dtype:a.complexTensorInfos.real.dtype,shape:n.shape},{dataId:a.complexTensorInfos.imag.dataId,dtype:a.complexTensorInfos.imag.dtype,shape:n.shape}],d=e.runWebGLProgram(l,p,"float32"),m=e.runWebGLProgram(u,p,"float32"),f=Q({inputs:{real:d,imag:m},backend:e});return e.disposeIntermediateTensorInfo(d),e.disposeIntermediateTensorInfo(m),f}if(e.shouldExecuteOnCPU([r,n])){let c=e.texData.get(r.dataId),a=e.texData.get(n.dataId),[l,u]=Lc(r.shape,n.shape,c.values,a.values,s),p=e.makeTensorInfo(u,s),d=e.texData.get(p.dataId);return d.values=l,p}let i;return O$1().getBool("WEBGL_PACK_BINARY_OPERATIONS")?i=new te(Il,r.shape,n.shape):i=new Y(Il,r.shape,n.shape),e.runWebGLProgram(i,[r,n],s)}var Nl={kernelName:hc$1,backendName:"webgl",kernelFunc:$t};vS();function El(o,t,e){let r=[Ce(o.shape),...be(o.shape)],n={dtype:o.dtype,shape:r,dataId:o.dataId},s=[Ce(t),...be(t)],i=new rt(s,r),c=true,a=[r],l=e.runWebGLProgram(i,[n],o.dtype,a,c);return {dataId:l.dataId,shape:t,dtype:l.dtype}}function T(o){let{inputs:t,backend:e,attrs:r}=o,{x:n}=t,{shape:s}=r,i=e,c=R.sizeFromShape(n.shape),a=R.inferFromImplicitShape(s,c),l=R.sizeFromShape(a);R.assert(c===l,()=>`The new shape (${a}) has ${l} elements and the old shape (${n.shape}) has ${c} elements. The new shape and old shape must have the same number of elements.`);let u=i.texData.get(n.dataId);return u.isPacked&&!Ie(n.shape,a)&&!(u.texture!==null&&Ie(u.shape,a))?El(n,a,i):(i.incRef(n.dataId),{dataId:n.dataId,shape:a,dtype:n.dtype})}var kl={kernelName:_c$1,backendName:"webgl",kernelFunc:T};vS();vS();vS();vS();var St=class{constructor(t,e){this.variableNames=["x"];let{windowSize:r,batchSize:n,inSize:s,outSize:i}=t;this.outputShape=[n,i];let c=Math.floor(r/4)*4,a=r%4,l="sumValue += dot(values, ones);";if(e!=null){let p=1/e;l=`sumValue += dot(values * ${R.isInt(p)?p.toPrecision(2):p}, ones);`;}let u="";s%r>0&&(u=`
        if (inIdx < 0 || inIdx >= ${s}) {
          return 0.0;
        }
      `),this.userCode=`
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float getValue(int batch, int inIdx) {
        ${u}
        return getX(batch, inIdx);
      }

      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = outIdx * ${r};

        float sumValue = 0.0;

        for (int i = 0; i < ${c}; i += 4) {
          int inIdx = inOffset + i;
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            getValue(batch, inIdx + 3)
          );

          ${l}
        }

        int inIdx = inOffset + ${c};
        if (${a===1}) {
          vec4 values = vec4(getValue(batch, inIdx), 0.0, 0.0, 0.0);

          ${l}
        } else if (${a===2}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1), 0.0, 0.0);

          ${l}
        } else if (${a===3}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2), 0.0);

          ${l}
        }
        setOutput(sumValue);
      }
    `;}};var eo=class{constructor(t,e){this.variableNames=["x"];let{windowSize:r,batchSize:n,inSize:s,outSize:i}=t;this.outputShape=[n,i];let c="0.0",a="";e==="prod"?c="1.0":e==="min"?(c="1.0 / 1e-20",a="min"):e==="max"&&(c="-1.0 / 1e-20",a="max");let l=`${e}(${e}(${e}(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])`;e==="sum"?l="sumValue":e==="prod"?l="prodValue":e==="all"?l="allValue":e==="any"&&(l="anyValue");let u=Math.floor(r/4)*4,p=r%4,d=`
      if (${e==="sum"}) {
        sumValue += dot(values, ones);
      } else if (${e==="prod"}) {
        vec2 tmp = vec2(values[0], values[1]) * vec2(values[2], values[3]);
        prodValue *= tmp[0] * tmp[1];
      } else {
        minMaxValue = ${a}(values, minMaxValue);
        if (${e==="min"} || ${e==="max"}) {
          minMaxValue = ${a}(values, minMaxValue);
          bvec4 isNaN = isnan(values);
          if (isNaN.r || isNaN.g || isNaN.b || isNaN.a) {
            minMaxValue = vec4(NAN);
          }
        }
      }
    `,m="vec4";e==="all"?(c="1.0",d=`
        bool reducedAllValue = all(values);
        float floatedReducedAllValue = float(reducedAllValue);
        allValue = float(allValue >= 1.0 && floatedReducedAllValue >= 1.0);
      `,m="bvec4"):e==="any"&&(c="0.0",d=`
        bool reducedAnyValue = any(values);
        float floatedReducedAnyValue = float(reducedAnyValue);
        anyValue = float(anyValue >= 1.0 || floatedReducedAnyValue >= 1.0);
      `,m="bvec4");let f="";s%r>0&&(f=`
        if (inIdx < 0 || inIdx >= ${s}) {
          return initializationValue;
        }
      `),this.userCode=`
      const float initializationValue = ${c};
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float getValue(int batch, int inIdx) {
        ${f}
        return getX(batch, inIdx);
      }

      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = outIdx * ${r};

        vec4 minMaxValue = vec4(${c});
        float prodValue = 1.0;
        float sumValue = 0.0;
        float allValue = 1.0;
        float anyValue = 0.0;

        for (int i = 0; i < ${u}; i += 4) {
          int inIdx = inOffset + i;
          ${m} values = ${m}(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            getValue(batch, inIdx + 3)
          );

          ${d}
        }

        int inIdx = inOffset + ${u};
        if (${p===1}) {
          ${m} values = ${m}(
            getValue(batch, inIdx),
            initializationValue,
            initializationValue,
            initializationValue
          );

          ${d}
        } else if (${p===2}) {
          ${m} values = ${m}(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            initializationValue,
            initializationValue
          );

          ${d}
        } else if (${p===3}) {
          ${m} values = ${m}(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            initializationValue
          );

          ${d}
        }
        setOutput(${l});
      }
    `;}};function xf(o){let t=[];for(;t.length===0||t[t.length-1].outSize!==1;){let e=t.length?t[t.length-1].outSize:o[1],r=kp$1.computeOptimalWindowSize(e);t.push({inSize:e,windowSize:r,outSize:Math.ceil(e/r)});}return t}function re(o,t,e,r){let n=xf(o.shape),s=o;for(let i=0;i<n.length;i++){let{inSize:c,windowSize:a,outSize:l}=n[i],u,p;e==="mean"?u=i===0?new St({windowSize:a,inSize:c,batchSize:o.shape[0],outSize:l},c):new St({windowSize:a,inSize:c,batchSize:o.shape[0],outSize:l}):u=new eo({windowSize:a,inSize:c,batchSize:o.shape[0],outSize:l},e),p=s,s=r.runWebGLProgram(u,[s],t),p.dataId!==o.dataId&&r.disposeIntermediateTensorInfo(p);}return s}vS();var to=class{constructor(t,e){this.variableNames=["A"];let r=new Array(t.length);for(let i=0;i<r.length;i++)r[i]=t[e[i]];this.outputShape=r,this.rank=r.length;let n=A(this.rank),s=gf(e);this.userCode=`
    void main() {
      ${n} resRC = getOutputCoords();
      setOutput(getA(${s}));
    }
    `;}};function gf(o){let t=o.length;if(t>6)throw Error(`Transpose for rank ${t} is not yet supported`);let e=["resRC.x","resRC.y","resRC.z","resRC.w","resRC.u","resRC.v"],r=new Array(t);for(let n=0;n<o.length;n++)r[o[n]]=e[n];return r.join()}var oo=class{constructor(t,e){this.variableNames=["A"],this.packedInputs=true,this.packedOutput=true;let r=new Array(t.length);for(let u=0;u<r.length;u++)r[u]=t[e[u]];if(this.outputShape=r,this.rank=r.length,this.rank>6)throw Error(`Packed transpose for rank ${this.rank} is not yet supported.`);let n=A(this.rank),s=dn("rc",this.rank),i=new Array(this.rank);for(let u=0;u<e.length;u++)i[e[u]]=s[u];let c=`vec2(${i.slice(-2).join()})`,a=`++${s[this.rank-1]} < ${r[this.rank-1]}`,l=`getChannel(getA(${i.join()}), ${c})`;this.userCode=`
    void main() {
      ${n} rc = getOutputCoords();
      vec4 result = vec4(0.);
      result[0] = ${l};
      if(${a}) {
        result[1] = ${l};
      }
      --${s[this.rank-1]};
      if(++${s[this.rank-2]} < ${r[this.rank-2]}) {
        result[2] = ${l};
        if(${a}) {
          result[3] = ${l};
        }
      }
      setOutput(result);
    }
    `;}};function Ne(o,t,e){let r=O$1().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new oo(o.shape,t):new to(o.shape,t);return e.runWebGLProgram(r,[o],o.dtype)}function _l(o,t,e,r){let n=t,s=o.shape.length,i=R.parseAxisParam(n,o.shape),c=i,a=kp$1.getAxesPermutation(c,s),l=a!=null,u=o;l&&(u=Ne(o,a,r),c=kp$1.getInnerMostAxes(c.length,s)),kp$1.assertAxesAreInnerMostDims("sum",c,s);let[p,d]=kp$1.computeOutAndReduceShapes(u.shape,c),m=p;e&&(m=kp$1.expandShapeToKeepDim(p,i));let f=R.sizeFromShape(d),g=R.sizeFromShape(o.shape)/f,x=T({inputs:{x:u},attrs:{shape:[g,f]},backend:r}),C=Dm$1(o.dtype),y=re(x,C,"sum",r),R$1=T({inputs:{x:y},attrs:{shape:m},backend:r});return r.disposeIntermediateTensorInfo(x),r.disposeIntermediateTensorInfo(y),l&&r.disposeIntermediateTensorInfo(u),R$1}function Ue(o){let{inputs:t,backend:e,attrs:r}=o,{x:n}=t,{axis:s,keepDims:i}=r;return _l(n,s,i,e)}var Al={kernelName:"Sum",backendName:"webgl",kernelFunc:Ue};vS();function B(o){let{inputs:t,backend:e,attrs:r}=o,{x:n}=t,{perm:s}=r,i=e,c=n.shape.length,a=new Array(c);for(let u=0;u<a.length;u++)a[u]=n.shape[s[u]];let l;if(i.shouldExecuteOnCPU([n])){let p=i.texData.get(n.dataId).values,d=Be(p,n.shape,n.dtype,s,a);l=i.makeTensorInfo(a,n.dtype);let m=i.texData.get(l.dataId);m.values=d;}else l=Ne(n,s,i);return l}var Fl={kernelName:en$1,backendName:"webgl",kernelFunc:B};var vn=1e3;function Ve({a:o,b:t,transposeA:e,transposeB:r,backend:n,bias:s=null,preluActivationWeights:i=null,leakyreluAlpha:c=0,activation:a=null}){let l=o.shape.length,u=t.shape.length,p=e?o.shape[l-2]:o.shape[l-1],d=r?t.shape[u-1]:t.shape[u-2],m=e?o.shape[l-1]:o.shape[l-2],f=r?t.shape[u-2]:t.shape[u-1],h=o.shape.slice(0,-2),g=t.shape.slice(0,-2),x=R.sizeFromShape(h),C=R.sizeFromShape(g),R$1=Vr$1.assertAndGetBroadcastShape(o.shape.slice(0,-2),t.shape.slice(0,-2)).concat([m,f]);R.assert(p===d,()=>`Error in matMul: inner shapes (${p}) and (${d}) of Tensors with shapes ${o.shape} and ${t.shape} and transposeA=${e} and transposeB=${r} must match.`);let w=e?[x,p,m]:[x,m,p],F=r?[C,f,d]:[C,d,f],_=T({inputs:{x:o},backend:n,attrs:{shape:w}}),E=T({inputs:{x:t},backend:n,attrs:{shape:F}}),P=[_,E],D=Math.max(x,C),M=e?_.shape[1]:_.shape[2],G=s!=null,de=i!=null,Z=a==="leakyrelu",ne=a!=null?ve(a,true):null,se=G||de||Z||ne!=null,ae;if((m===1||f===1)&&M>vn&&se===false){let ye=_,Ge=E;e&&(ye=B({inputs:{x:_},backend:n,attrs:{perm:[0,2,1]}}),P.push(ye)),r&&(Ge=B({inputs:{x:E},backend:n,attrs:{perm:[0,2,1]}}),P.push(Ge));let ze=f!==1,wt=f===1,Sr=ye;ze&&(Sr=T({inputs:{x:ye},backend:n,attrs:{shape:[D,M,1]}}),P.push(Sr));let Jd=f===1?2:1,yr=Ge;wt&&(yr=T({inputs:{x:Ge},backend:n,attrs:{shape:[D,1,M]}}),P.push(yr));let Pn=$t({inputs:{a:Sr,b:yr},backend:n});ae=Ue({inputs:{x:Pn},backend:n,attrs:{axis:Jd,keepDims:true}}),P.push(Pn);}else {let ye=Gr$1(o.dtype,t.dtype),Ge=new st(w,F,[D,m,f],e,r,G,ne,de,Z),ze=[_,E];if(s!=null&&ze.push(s),de&&ze.push(i),Z){let wt=n.makeTensorInfo([],"float32",R.createScalarValue(c,"float32"));ze.push(wt),P.push(wt);}ae=n.runWebGLProgram(Ge,ze,ye);}let q=T({inputs:{x:ae},backend:n,attrs:{shape:R$1}});P.push(ae);for(let ye of P)n.disposeIntermediateTensorInfo(ye);return q}function Cf(o){let{inputs:t,backend:e,attrs:r}=o,{a:n,b:s,bias:i,preluActivationWeights:c}=t,{transposeA:a,transposeB:l,activation:u,leakyreluAlpha:p}=r;return Ve({a:n,b:s,transposeA:a,transposeB:l,backend:e,bias:i,preluActivationWeights:c,leakyreluAlpha:p,activation:u})}var Dl={kernelName:Jn,backendName:"webgl",kernelFunc:Cf};vS();var Pl="return abs(x);";function bf(o){let{inputs:t,backend:e}=o,{x:r}=t;if(e.shouldExecuteOnCPU([r])&&r.dtype!=="complex64"){let s=e.texData.get(r.dataId),i=qt(s.values);return e.makeTensorInfo(r.shape,r.dtype,i)}let n;return O$1().getBool("WEBGL_PACK_UNARY_OPERATIONS")?n=new j(r.shape,Pl):n=new H(r.shape,Pl),e.runWebGLProgram(n,[r],r.dtype)}var Ol={kernelName:"Abs",backendName:"webgl",kernelFunc:bf};vS();var vf=z+`
  if (abs(x) > 1.) {
    return NAN;
  }
  return acos(x);
`,$f=N({opSnippet:vf}),Ll={kernelName:Xi,backendName:"webgl",kernelFunc:$f};vS();var Sf=z+`
  if (x < 1.0) return NAN;
return log(x + sqrt(x * x - 1.0));`,yf=N({opSnippet:Sf}),Bl={kernelName:Ji,backendName:"webgl",kernelFunc:yf};vS();var Ul="return a + b;",Rf=O({opSnippet:Ul,packedOpSnippet:Ul,supportsComplex:true,cpuKernelImpl:xc}),Vl={kernelName:"Add",backendName:"webgl",kernelFunc:Rf};vS();var ro=class{constructor(t,e){this.outputShape=[],this.outputShape=t,this.variableNames=e.map((s,i)=>`T${i}`);let r=[];this.variableNames.forEach(s=>{r.push(`float v${s} = get${s}AtOutCoords();`);});let n=this.variableNames.map(s=>`v${s}`).join(" + ");this.userCode=`
      void main() {
        ${r.join(`
        `)}

        float result = ${n};
        setOutput(result);
      }
    `;}};var no=class{constructor(t,e){this.outputShape=[],this.packedInputs=true,this.packedOutput=true,this.outputShape=t,this.variableNames=e.map((s,i)=>`T${i}`);let r=[];this.variableNames.forEach(s=>{r.push(`vec4 v${s} = get${s}AtOutCoords();`);});let n=this.variableNames.map(s=>`v${s}`).join(" + ");this.userCode=`
      void main() {
        ${r.join(`
        `)}

        vec4 result = ${n};
        setOutput(result);
      }
    `;}};function so(o){let{inputs:t,backend:e}=o,r=t;if(r.length===1)return W({inputs:{x:r[0]},backend:e});if(r.length>O$1().getNumber("WEBGL_MAX_TEXTURES_IN_SHADER")){let a=Math.floor(r.length/2),l=so({inputs:r.slice(0,a),backend:e}),u=so({inputs:r.slice(a),backend:e});return so({inputs:[l,u],backend:e})}let n=r.map(a=>a.dtype).reduce((a,l)=>Gr$1(a,l)),s=r.map(a=>a.shape),c=O$1().getBool("WEBGL_PACK")?new no(r[0].shape,s):new ro(r[0].shape,s);return e.runWebGLProgram(c,r,n)}var Wl={kernelName:Zi,backendName:"webgl",kernelFunc:so};vS();function Tf(o){let{inputs:t,backend:e,attrs:r}=o,{x:n}=t,{axis:s,keepDims:i}=r,c=n.shape.length,a=R.parseAxisParam(s,n.shape),l=a,u=kp$1.getAxesPermutation(l,c),p=n;u!=null&&(p=B({inputs:{x:n},backend:e,attrs:{perm:u}}),l=kp$1.getInnerMostAxes(l.length,c)),kp$1.assertAxesAreInnerMostDims("all",l,c);let[d,m]=kp$1.computeOutAndReduceShapes(p.shape,l),f=R.sizeFromShape(m),h=T({inputs:{x:p},backend:e,attrs:{shape:[-1,f]}}),g=re(h,h.dtype,"all",e),x;if(i){let C=kp$1.expandShapeToKeepDim(d,a);x=T({inputs:{x:g},backend:e,attrs:{shape:C}});}else x=T({inputs:{x:g},backend:e,attrs:{shape:d}});return e.disposeIntermediateTensorInfo(h),e.disposeIntermediateTensorInfo(g),u!=null&&e.disposeIntermediateTensorInfo(p),x}var Ml={kernelName:"All",backendName:"webgl",kernelFunc:Tf};vS();function wf(o){let{inputs:t,backend:e,attrs:r}=o,{x:n}=t,{axis:s,keepDims:i}=r,c=n.shape.length,a=R.parseAxisParam(s,n.shape),l=a,u=kp$1.getAxesPermutation(l,c),p=n;u!=null&&(p=B({inputs:{x:n},backend:e,attrs:{perm:u}}),l=kp$1.getInnerMostAxes(l.length,c)),kp$1.assertAxesAreInnerMostDims("any",l,c);let[d,m]=kp$1.computeOutAndReduceShapes(p.shape,l),f=R.sizeFromShape(m),h=T({inputs:{x:p},backend:e,attrs:{shape:[-1,f]}}),g=re(h,h.dtype,"any",e),x;if(i){let C=kp$1.expandShapeToKeepDim(d,a);x=T({inputs:{x:g},backend:e,attrs:{shape:C}});}else x=T({inputs:{x:g},backend:e,attrs:{shape:d}});return e.disposeIntermediateTensorInfo(h),e.disposeIntermediateTensorInfo(g),u!=null&&e.disposeIntermediateTensorInfo(p),x}var Gl={kernelName:"Any",backendName:"webgl",kernelFunc:wf};vS();vS();var io=class{constructor(t,e,r){this.variableNames=["A"];let{windowSize:n,batchSize:s,outSize:i}=t;r||this.variableNames.push("bestIndicesA"),this.outputShape=[s,i];let c=e==="max"?">":"<",a=r?"inOffset + i;":"round(getBestIndicesA(batch, inOffset + i));";this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = outIdx * ${n};

        int bestIndex = inOffset;
        float bestValue = getA(batch, bestIndex);

        for (int i = 0; i < ${n}; i++) {
          int inIdx = ${a};
          float candidate = getA(batch, inIdx);
          if (candidate ${c} bestValue) {
            bestValue = candidate;
            bestIndex = inIdx;
          }
        }
        setOutput(float(bestIndex));
      }
    `;}};vS();var ao=class{constructor(t,e,r,n){this.variableNames=["A"],this.packedInputs=true,this.packedOutput=true,R.assert(t.length>2,()=>`Packed arg${r.charAt(0).toUpperCase()+r.slice(1)} supports only inputs with rank above 2.`);let s=t[t.length-1],i=Math.ceil(s/e);this.outputShape=t.slice(0,-1),i>1&&this.outputShape.push(i),n||this.variableNames.push("bestIndicesA");let c=this.outputShape,a=c.length,l=A(a),u=V("coords",a),p,d;if(i===1){d=a+1;let E=A(d);p=`
        ${E} sourceLocR = ${E}(${u.join()}, 0);
        ++${u[a-1]};
        ${E} sourceLocG = ${E}(${u.join()}, 0);
        ++${u[a-2]};
        ${E} sourceLocA = ${E}(${u.join()}, 0);
        --${u[a-1]};
        ${E} sourceLocB = ${E}(${u.join()}, 0);
        --${u[a-2]};`;}else d=a,p=`
        ${l} sourceLocR = coords;
        ++${u[a-1]};
        ${l} sourceLocG = coords;
        ++${u[a-2]};
        ${l} sourceLocA = coords;
        --${u[a-1]};
        ${l} sourceLocB = coords;
        --${u[a-2]};`;let m=["x","y","z","w","u","v"].slice(0,d),f="."+m[d-1],h=m.map(E=>"int "+E),g=V("sourceLocR",d-1).concat("inIdx.r"),x=V("sourceLocG",d-1).concat("inIdx.g"),C=V("sourceLocB",d-1).concat("inIdx.b"),y=V("sourceLocA",d-1).concat("inIdx.a"),R$1=r==="max"?"greaterThan":"lessThan",w=n?"":`
          inIdx = round(vec4(getBestIndicesAChannel(${g.join()}),
                             getBestIndicesAChannel(${x.join()}),
                             getBestIndicesAChannel(${C.join()}),
                             getBestIndicesAChannel(${y.join()})));`,F=`vec4(
            getAChannel(${g.join()}),
            hasNextCol ? getAChannel(${x.join()}) : 0.,
            hasNextRow ? getAChannel(${C.join()}) : 0.,
            hasNextRow && hasNextCol ? getAChannel(${y.join()}) : 0.)`,_=n?"":`
      float getBestIndicesAChannel(${h.join()}) {
        return getChannel(getBestIndicesA(${m.join()}),
                                          vec2(${m.slice(-2).join()}));
      }`;this.userCode=`
      float getAChannel(${h.join()}) {
        return getChannel(getA(${m.join()}),
                               vec2(${m.slice(-2).join()}));
      }
      ${_}
      void main() {
        ${l} coords = getOutputCoords();
        bool hasNextCol = ${u[a-1]} < ${c[a-1]-1};
        bool hasNextRow = ${u[a-2]} < ${c[a-2]-1};
        ${p}
        ivec4 srcIdx = ivec4(sourceLocR${f}, sourceLocG${f},
          sourceLocB${f}, sourceLocA${f}) * ${e};
        ivec4 inIdx = srcIdx;
        vec4 bestIndex = vec4(inIdx);
        vec4 bestValue = ${F};

        for (int i = 0; i < ${e}; i++) {
          inIdx = srcIdx;
          ${w}
          vec4 candidate = ${F};
          bvec4 nan = isnan(candidate);
          bvec4 replace = bvec4(
            vec4(${R$1}(candidate, bestValue)) * (vec4(1.0) - vec4(nan)));

          bestValue = vec4(replace.x  ? candidate.x : bestValue.x,
                           replace.y  ? candidate.y : bestValue.y,
                           replace.z  ? candidate.z : bestValue.z,
                           replace.w  ? candidate.w : bestValue.w);
          bestIndex = mix(bestIndex, vec4(inIdx), vec4(replace));
          srcIdx++;
        }
        setOutput(bestIndex);
      }
    `;}};function zl(o,t,e,r=null){let n=t.shape[0],s=t.shape[1];r!=null&&(n=r.shape[0],s=r.shape[1]);let i=kp$1.computeOptimalWindowSize(s),c={windowSize:i,inSize:s,batchSize:n,outSize:Math.ceil(s/i)},a=new io(c,e,r==null),l=[t];r!=null&&l.push(r);let u=o.runWebGLProgram(a,l,"int32");if(u.shape[1]===1)return u;let p=zl(o,t,e,u);return o.disposeIntermediateTensorInfo(u),p}function Hl(o,t,e,r=null){let n=r!=null?r.shape:t.shape,s=n[n.length-1],i=kp$1.computeOptimalWindowSize(s),c=new ao(n,i,e,r==null),a=r==null?[t]:[t,r],l=o.runWebGLProgram(c,a,"int32");if(l.shape.length===t.shape.length){let u=Hl(o,t,e,l);return o.disposeIntermediateTensorInfo(l),u}return l}function co(o,t,e,r){let n=[e];if(kp$1.assertAxesAreInnerMostDims("arg"+r.charAt(0).toUpperCase()+r.slice(1),n,t.shape.length),!O$1().getBool("WEBGL_PACK_REDUCE")||t.shape.length<=2){let s=[],i=o.texData.get(t.dataId),c=i!==null&&i.isPacked,a=t;c&&(a=o.unpackTensor(t),s.push(a));let[l,u]=kp$1.computeOutAndReduceShapes(a.shape,n),p=R.sizeFromShape(u),d=T({inputs:{x:a},backend:o,attrs:{shape:[-1,p]}});s.push(d);let m=zl(o,d,r);s.push(m);let f=T({inputs:{x:m},backend:o,attrs:{shape:l}});return s.forEach(h=>o.disposeIntermediateTensorInfo(h)),f}return Hl(o,t,r)}function If(o){let{inputs:t,backend:e,attrs:r}=o,{x:n}=t,{axis:s}=r,i=R.parseAxisParam(s,n.shape),c=kp$1.getAxesPermutation(i,n.shape.length),a=n,l=[];c!=null&&(a=B({inputs:{x:n},backend:e,attrs:{perm:c}}),l.push(a),i=kp$1.getInnerMostAxes(i.length,a.shape.length)),kp$1.assertAxesAreInnerMostDims("argMax",[i[0]],a.shape.length);let u=co(e,a,i[0],"max");return l.forEach(p=>e.disposeIntermediateTensorInfo(p)),u}var Xl={kernelName:Yi,backendName:"webgl",kernelFunc:If};vS();function Nf(o){let{inputs:t,backend:e,attrs:r}=o,{x:n}=t,{axis:s}=r,i=R.parseAxisParam(s,n.shape),c=kp$1.getAxesPermutation(i,n.shape.length),a=n,l=[];c!=null&&(a=B({inputs:{x:n},backend:e,attrs:{perm:c}}),l.push(a),i=kp$1.getInnerMostAxes(i.length,a.shape.length)),kp$1.assertAxesAreInnerMostDims("argMin",[i[0]],a.shape.length);let u=co(e,a,i[0],"min");return l.forEach(p=>e.disposeIntermediateTensorInfo(p)),u}var Kl={kernelName:Qi,backendName:"webgl",kernelFunc:Nf};vS();var Ef=z+`
  if (abs(x) > 1.) {
    return NAN;
  }
  return asin(x);
`,kf=N({opSnippet:Ef}),ql={kernelName:ta,backendName:"webgl",kernelFunc:kf};vS();var _f=z+"return log(x + sqrt(x * x + 1.0));",Af=N({opSnippet:_f}),jl={kernelName:ea,backendName:"webgl",kernelFunc:Af};vS();var Ff=z+`
  return atan(x);
`,Df=N({opSnippet:Ff}),Yl={kernelName:ra,backendName:"webgl",kernelFunc:Df};vS();var Pf=nt+`
  return atan(a, b);
`,Of=`
  vec4 result = atan(a, b);
  bvec4 isNaNA = isnan(a);
  bvec4 isNaNB = isnan(b);
  bvec4 isNaN = bvec4(isNaNA.x || isNaNB.x, isNaNA.y || isNaNB.y, isNaNA.z || isNaNB.z, isNaNA.w || isNaNB.w);
  `+oe+`
  return result;
`,Lf=O({opSnippet:Pf,packedOpSnippet:Of}),Ql={kernelName:na,backendName:"webgl",kernelFunc:Lf};vS();var Bf=z+`
  if ((x < -1.0) || (x > 1.0)) return NAN;
return (log(1.0 + x) - log(1.0 - x)) / 2.0;`,Uf=N({opSnippet:Bf}),Zl={kernelName:oa,backendName:"webgl",kernelFunc:Uf};vS();var ue=class{constructor(t,e,r,n=false,s=false){if(this.variableNames=["x"],e==="avg"&&r)throw new Error("Cannot compute positions for average pool.");let i=t.filterWidth,c=t.strideHeight,a=t.strideWidth,l=t.dilationHeight,u=t.dilationWidth,p=t.effectiveFilterHeight,d=t.effectiveFilterWidth,m=t.padInfo.top,f=t.padInfo.left;this.outputShape=t.outShape;let h=e==="avg",g=`((batch  * ${t.inHeight} + xR) * ${t.inWidth} + xC) * ${t.inChannels} + d`,x=`(xR * ${t.inWidth} + xC) * ${t.inChannels} + d`,C="0.0";if(h||(C="-1.0 / 1e-20"),r){this.userCode=`
        const ivec2 strides = ivec2(${c}, ${a});
        const ivec2 pads = ivec2(${m}, ${f});

        void main() {
          ivec4 coords = getOutputCoords();
          int batch = coords[0];
          int d = coords[3];

          ivec2 xRCCorner = coords.yz * strides - pads;
          int xRCorner = xRCCorner.x;
          int xCCorner = xRCCorner.y;

          // max/min x(?, ?, d) to get y(yR, yC, d).
          // ? = to be determined
          float minMaxValue = 0.0;
          float minMaxValueFound = 0.0;
          int minMaxPosition = 0;
          float avgValue = 0.0;

          for (int wR = 0; wR < ${p};
              wR += ${l}) {
            int xR = xRCorner + wR;

            if (xR < 0 || xR >= ${t.inHeight}) {
              continue;
            }

            for (int wC = 0; wC < ${d};
                wC += ${u}) {
              int xC = xCCorner + wC;

              if (xC < 0 || xC >= ${t.inWidth}) {
                continue;
              }

              float value = getX(batch, xR, xC, d);

              // If a min / max value has already been found, use it. If not,
              // use the current value.
              float currMinMaxValue = mix(
                  value, minMaxValue, minMaxValueFound);
              if (value >= currMinMaxValue) {
                minMaxValue = value;
                minMaxValueFound = 1.0;
                minMaxPosition = ${n?s?g:x:`wR * ${d} + wC`};
              }
            }
          }
          setOutput(float(minMaxPosition));
        }
      `;return}let y="max",R=`${e}(${e}(${e}(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])`;e==="avg"&&(R="avgValue / max(count, 1.0)");let w=Math.floor(i/4)*4,F=i%4,_=`
      if (${h}) {
        avgValue += dot(values, ones);
      } else {
        minMaxValue = ${y}(values, minMaxValue);
      }
    `;this.userCode=`
      const ivec2 strides = ivec2(${c}, ${a});
      const ivec2 pads = ivec2(${m}, ${f});
      const float initializationValue = ${C};
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float count = 0.0;

      float getValue(int batch, int xR, int xC, int d) {
        if (xC < 0 || xC >= ${t.inWidth}) {
          return initializationValue;
        }
        count += 1.0;
        return getX(batch, xR, xC, d);
      }

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d = coords[3];

        ivec2 xRCCorner = coords.yz * strides - pads;
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        // max/min x(?, ?, d) to get y(yR, yC, d).
        // ? = to be determined
        vec4 minMaxValue = vec4(${C});
        float avgValue = 0.0;
        count = 0.0;

        for (int wR = 0; wR < ${p};
            wR += ${l}) {
          int xR = xRCorner + wR;

          if (xR < 0 || xR >= ${t.inHeight}) {
            continue;
          }

          for (int wC = 0; wC < ${w}; wC += 4) {
            int xC = xCCorner + wC * ${u};

            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              getValue(batch, xR, xC + ${u}, d),
              getValue(batch, xR, xC + 2 * ${u}, d),
              getValue(batch, xR, xC + 3 * ${u}, d)
            );

            ${_}
          }

          int xC = xCCorner + ${w};
          if (${F===1}) {
            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              initializationValue,
              initializationValue,
              initializationValue
            );

            ${_}
          } else if (${F===2}) {
            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              getValue(batch, xR, xC + ${u}, d),
              initializationValue,
              initializationValue
            );

            ${_}
          } else if (${F===3}) {
            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              getValue(batch, xR, xC + ${u}, d),
              getValue(batch, xR, xC + 2 * ${u}, d),
              initializationValue
            );

            ${_}
          }
        }
        setOutput(${R});
      }
    `;}},Ee=class{constructor(t,e,r,n=false,s=false){if(this.variableNames=["x"],e==="avg"&&r)throw new Error("Cannot compute positions for average pool.");let i=t.filterWidth,c=t.strideDepth,a=t.strideHeight,l=t.strideWidth,u=t.dilationDepth,p=t.dilationHeight,d=t.dilationWidth,m=t.effectiveFilterDepth,f=t.effectiveFilterHeight,h=t.effectiveFilterWidth,g=t.padInfo.front,x=t.padInfo.top,C=t.padInfo.left;this.outputShape=t.outShape;let y=e==="avg",R="0.0";if(y||(R="-1.0 / 1e-20"),r){this.userCode=`
        const ivec3 strides =
            ivec3(${c}, ${a}, ${l});
        const ivec3 pads = ivec3(${g}, ${x}, ${C});

        void main() {
          ivec5 coords = getOutputCoords();
          int batch = coords.x;
          int ch = coords.u;

          ivec3 xCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;
          int xDCorner = xCorner.x;
          int xRCorner = xCorner.y;
          int xCCorner = xCorner.z;

          // max/min x(?, ?, ?, ch) to get y(yD, yR, yC, ch).
          // ? = to be determined
          float minMaxValue = 0.0;
          float minMaxValueFound = 0.0;
          int minMaxPosition = 0;

          for (int wD = 0; wD < ${m};
              wD += ${u}) {
            int xD = xDCorner + wD;

            if (xD < 0 || xD >= ${t.inDepth}) {
              continue;
            }

            for (int wR = 0; wR < ${f};
                wR += ${p}) {
              int xR = xRCorner + wR;

              if (xR < 0 || xR >= ${t.inHeight}) {
                continue;
              }

              for (int wC = 0; wC < ${h};
                  wC += ${d}) {
                int xC = xCCorner + wC;

                if (xC < 0 || xC >= ${t.inWidth}) {
                  continue;
                }

                float value = getX(batch, xD, xR, xC, ch);

                // If a min / max value has already been found, use it. If not,
                // use the current value.
                float currMinMaxValue = mix(
                    value, minMaxValue, minMaxValueFound);
                if (value >= currMinMaxValue) {
                  minMaxValue = value;
                  minMaxValueFound = 1.0;
                  minMaxPosition = ${n?s?`(((batch * ${t.inDepth} + xD) * ${t.inHeight} + xR) * ${t.inWidth} + xC) * ${t.inChannels} + ch`:`((xD * ${t.inHeight} + xR) * ${t.inWidth} + xC) * ${t.inChannels} + ch`:`wD * ${f} * ${h} +
                      wR * ${h} + wC`};
                }
              }
            }
          }
          setOutput(float(minMaxPosition));
        }
      `;return}let w="max",F=`${e}(${e}(${e}(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])`;e==="avg"&&(F="avgValue / max(count, 1.0)");let _=Math.floor(i/4)*4,E=i%4,P=`
      if (${y}) {
        avgValue += dot(values, ones);
      } else {
        minMaxValue = ${w}(values, minMaxValue);
      }
    `;this.userCode=`
      const ivec3 strides =
        ivec3(${c}, ${a}, ${l});
      const ivec3 pads = ivec3(${g}, ${x}, ${C});
      const float initializationValue = ${R};
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float count = 0.0;

      float getValue(int batch, int xD, int xR, int xC, int ch) {
        if (xC < 0 || xC >= ${t.inWidth}) {
          return initializationValue;
        }
        count += 1.0;
        return getX(batch, xD, xR, xC, ch);
      }

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int ch = coords.u;

        ivec3 xCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;
        int xDCorner = xCorner.x;
        int xRCorner = xCorner.y;
        int xCCorner = xCorner.z;

        // max/min x(?, ?, ?, d) to get y(yD, yR, yC, ch).
        // ? = to be determined
        vec4 minMaxValue = vec4(${R});
        float avgValue = 0.0;
        count = 0.0;

        for (int wD = 0; wD < ${m};
            wD += ${u}) {
          int xD = xDCorner + wD;

          if (xD < 0 || xD >= ${t.inDepth}) {
            continue;
          }

          for (int wR = 0; wR < ${f};
            wR += ${p}) {
            int xR = xRCorner + wR;

            if (xR < 0 || xR >= ${t.inHeight}) {
              continue;
            }

            for (int wC = 0; wC < ${_}; wC += 4) {
              int xC = xCCorner + wC * ${d};

              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                getValue(batch, xD, xR, xC + ${d}, ch),
                getValue(batch, xD, xR, xC + 2 * ${d}, ch),
                getValue(batch, xD, xR, xC + 3 * ${d}, ch)
              );

              ${P}
            }

            int xC = xCCorner + ${_};
            if (${E===1}) {
              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                initializationValue,
                initializationValue,
                initializationValue
              );

              ${P}
            } else if (${E===2}) {
              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                getValue(batch, xD, xR, xC + ${d}, ch),
                initializationValue,
                initializationValue
              );

              ${P}
            } else if (${E===3}) {
              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                getValue(batch, xD, xR, xC + ${d}, ch),
                getValue(batch, xD, xR, xC + 2 * ${d}, ch),
                initializationValue
              );

              ${P}
            }
          }
        }
        setOutput(${F});
      }
    `;}};function Vf(o){let{inputs:t,backend:e,attrs:r}=o,{x:n}=t;ce(n,"avgPool");let{filterSize:s,strides:i,pad:c,dimRoundingMode:a}=r,l=1;R.assert(kp$1.eitherStridesOrDilationsAreOne(i,l),()=>`Error in avgPool: Either strides or dilations must be 1. Got strides ${i} and dilations '${l}'`);let u=kp$1.computePool2DInfo(n.shape,s,i,l,c,a);if(u.filterWidth===1&&u.filterHeight===1&&R.arraysEqual(u.inShape,u.outShape))return W({inputs:{x:n},backend:e});let p=new ue(u,"avg",false);return e.runWebGLProgram(p,[n],"float32")}var Jl={kernelName:sa,backendName:"webgl",kernelFunc:Vf};vS();function Wf(o){let{inputs:t,backend:e,attrs:r}=o,{x:n}=t,{filterSize:s,strides:i,pad:c,dimRoundingMode:a,dataFormat:l}=r,u=[1,1,1],p=kp$1.computePool3DInfo(n.shape,s,i,u,c,a,l),d=new Ee(p,"avg",false);return e.runWebGLProgram(d,[n],"float32")}var eu={kernelName:ia,backendName:"webgl",kernelFunc:Wf};vS();var lo=class{constructor(t){this.variableNames=["dy"],this.outputShape=t.inShape;let e=t.filterHeight,r=t.filterWidth,n=t.strideHeight,s=t.strideWidth,i=t.dilationHeight,c=t.dilationWidth,a=t.effectiveFilterHeight,l=t.effectiveFilterWidth,u=a-1-t.padInfo.top,p=l-1-t.padInfo.left,d=1/(e*r);this.userCode=`
      const ivec2 pads = ivec2(${u}, ${p});
      const float avgMultiplier = float(${d});

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];

        ivec2 dyRCCorner = coords.yz - pads;
        int dyRCorner = dyRCCorner.x;
        int dyCCorner = dyRCCorner.y;

        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${a};
            wR += ${i}) {
          float dyR = float(dyRCorner + wR) / ${n}.0;

          if (dyR < 0.0 || dyR >= ${t.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          for (int wC = 0; wC < ${l};
            wC+= ${c}) {
            float dyC = float(dyCCorner + wC) / ${s}.0;

            if (dyC < 0.0 || dyC >= ${t.outWidth}.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            float dyValue = getDy(b, idyR, idyC, d);

            dotProd += dyValue * avgMultiplier;
          }
        }
        setOutput(dotProd);
      }
    `;}},uo=class{constructor(t){this.variableNames=["dy"],this.outputShape=t.inShape;let e=t.filterDepth,r=t.filterHeight,n=t.filterWidth,s=t.strideDepth,i=t.strideHeight,c=t.strideWidth,a=t.dilationDepth,l=t.dilationHeight,u=t.dilationWidth,p=t.effectiveFilterDepth,d=t.effectiveFilterHeight,m=t.effectiveFilterWidth,f=p-1-t.padInfo.front,h=d-1-t.padInfo.top,g=m-1-t.padInfo.left,x=1/(e*r*n);this.userCode=`
      const ivec3 pads = ivec3(${f}, ${h}, ${g});
      const float avgMultiplier = float(${x});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int ch = coords.u;

        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;
        int dyDCorner = dyCorner.x;
        int dyRCorner = dyCorner.y;
        int dyCCorner = dyCorner.z;

        // Convolve dy(?, ?, ?, d) with pos mask(:, :, :, ch) to get
        // dx(xD, xR, xC, ch).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;

        for (int wD = 0; wD < ${p};
            wD += ${a}) {
          float dyD = float(dyDCorner + wD) / ${s}.0;

          if (dyD < 0.0 || dyD >= ${t.outDepth}.0 || fract(dyD) > 0.0) {
            continue;
          }
          int idyD = int(dyD);

          for (int wR = 0; wR < ${d};
              wR += ${l}) {
            float dyR = float(dyRCorner + wR) / ${i}.0;

            if (dyR < 0.0 || dyR >= ${t.outHeight}.0 ||
                fract(dyR) > 0.0) {
              continue;
            }
            int idyR = int(dyR);

            for (int wC = 0; wC < ${m};
                wC += ${u}) {
              float dyC = float(dyCCorner + wC) / ${c}.0;

              if (dyC < 0.0 || dyC >= ${t.outWidth}.0 ||
                  fract(dyC) > 0.0) {
                continue;
              }
              int idyC = int(dyC);

              float dyValue = getDy(batch, idyD, idyR, idyC, ch);

              dotProd += dyValue * avgMultiplier;
            }
          }
        }
        setOutput(dotProd);
      }
    `;}};function Mf(o){let{inputs:t,backend:e,attrs:r}=o,{dy:n,input:s}=t,i=s,{filterSize:c,strides:a,pad:l,dimRoundingMode:u}=r,p=[1,1,1],d=kp$1.computePool3DInfo(i.shape,c,a,p,l,u),m=new uo(d);return e.runWebGLProgram(m,[n],i.dtype)}var tu={kernelName:r0,backendName:"webgl",kernelFunc:Mf};vS();function Gf(o){let{inputs:t,backend:e,attrs:r}=o,{dy:n,input:s}=t,i=s;ce([n,s],"avgPoolGrad");let{filterSize:c,strides:a,pad:l}=r,u=kp$1.computePool2DInfo(i.shape,c,a,1,l),p=new lo(u);return e.runWebGLProgram(p,[n],i.dtype)}var ou={kernelName:e0,backendName:"webgl",kernelFunc:Gf};vS();function zf(o){let{inputs:t,backend:e,attrs:r}=o,{a:n,b:s}=t,{transposeA:i,transposeB:c}=r;return Ve({a:n,b:s,transposeA:i,transposeB:c,backend:e})}var ru={kernelName:aa,backendName:"webgl",kernelFunc:zf};vS();vS();var po=class{constructor(t,e,r,n,s,i){this.outputShape=[],this.variableNames=["x","mean","variance"],kp$1.assertAndGetBroadcastShape(t,e),kp$1.assertAndGetBroadcastShape(t,r);let c="0.0";n!=null&&(kp$1.assertAndGetBroadcastShape(t,n),this.variableNames.push("offset"),c="getOffsetAtOutCoords()");let a="1.0";s!=null&&(kp$1.assertAndGetBroadcastShape(t,s),this.variableNames.push("scale"),a="getScaleAtOutCoords()"),this.outputShape=t,this.userCode=`
      void main() {
        float x = getXAtOutCoords();
        float mean = getMeanAtOutCoords();
        float variance = getVarianceAtOutCoords();
        float offset = ${c};
        float scale = ${a};
        float inv = scale * inversesqrt(variance + float(${i}));
        setOutput(dot(vec3(x, -mean, offset), vec3(inv, inv, 1)));
      }
    `;}};vS();var mo=class{constructor(t,e,r,n,s,i){this.packedInputs=true,this.packedOutput=true,this.variableNames=["x","mean","variance"],kp$1.assertAndGetBroadcastShape(t,e),kp$1.assertAndGetBroadcastShape(t,r);let c="vec4(0.0)";n!=null&&(kp$1.assertAndGetBroadcastShape(t,n),this.variableNames.push("offset"),c="getOffsetAtOutCoords()");let a="vec4(1.0)";s!=null&&(kp$1.assertAndGetBroadcastShape(t,s),this.variableNames.push("scale"),a="getScaleAtOutCoords()"),this.outputShape=t,this.userCode=`
      void main() {
        vec4 offset = ${c};
        vec4 scale = ${a};

        vec4 x = getXAtOutCoords();
        vec4 mean = getMeanAtOutCoords();
        vec4 variance = getVarianceAtOutCoords();

        vec4 inv = scale * inversesqrt(variance + vec4(${i}));

        setOutput((x - mean) * inv + offset);
      }
    `;}};var Hf=({inputs:o,backend:t,attrs:e})=>{let{x:r,mean:n,variance:s,offset:i,scale:c}=o;R.assert(n.shape.length===s.shape.length,()=>"Batch normalization gradient requires mean and variance to have equal ranks."),R.assert(i==null||n.shape.length===i.shape.length,()=>"Batch normalization gradient requires mean and offset to have equal ranks."),R.assert(c==null||n.shape.length===c.shape.length,()=>"Batch normalization gradient requires mean and scale to have equal ranks.");let{varianceEpsilon:a}=e;a==null&&(a=.001);let l=[r,n,s],u=null;i!=null&&(u=i.shape,l.push(i));let p=null;c!=null&&(p=c.shape,l.push(c));let d=O$1().getBool("WEBGL_PACK_NORMALIZATION")?new mo(r.shape,n.shape,s.shape,u,p,a):new po(r.shape,n.shape,s.shape,u,p,a);return t.runWebGLProgram(d,l,l[0].dtype)},nu={kernelName:qa,backendName:"webgl",kernelFunc:Hf};vS();vS();var fo=class{constructor(t){this.variableNames=["source"],this.outputShape=t,this.rank=t.length;let e=A(this.rank);this.customUniforms=[{name:"start",arrayIndex:this.rank,type:"int"}];let r=Xf(this.rank),n,s=t.map((i,c)=>`sourceLoc.${$n[c]} = start[${c}] + coords.${$n[c]};`);n=`
        ${e} sourceLoc;
        ${e} coords = getOutputCoords();
        ${s.join(`
`)}
      `,this.userCode=`
      void main() {
        ${n}
        setOutput(getSource(${r}));
      }
    `;}},$n=["x","y","z","w","u","v"];function Xf(o){if(o===1)return "sourceLoc";if(o<=6)return $n.slice(0,o).map(t=>"sourceLoc."+t).join(",");throw Error(`Slicing for rank ${o} is not yet supported`)}var ho=class{constructor(t){this.variableNames=["source"],this.packedInputs=true,this.packedOutput=true,this.outputShape=t,this.rank=t.length,this.customUniforms=[{name:"start",arrayIndex:this.rank,type:"int"}];let e=A(this.rank),r=V("coords",this.rank),n=V("sourceLoc",this.rank),s=this.rank===1?"sourceLoc":`vec2(${n.slice(-2).join()})`,i=`getChannel(getSource(${n.join()}), ${s})`,c=`
      result.x = ${i};
      if (++${r[this.rank-1]} < ${t[this.rank-1]}) {
        ++${n[this.rank-1]};
        result.y = ${i};
        --${n[this.rank-1]};
      }
    `,a=this.rank===1?"":`
      --${r[this.rank-1]};
      if (++${r[this.rank-2]} < ${t[this.rank-2]}) {
        ++${n[this.rank-2]};
        result.z = ${i};
        if (++${r[this.rank-1]} < ${t[this.rank-1]}) {
          ++${n[this.rank-1]};
          result.w = ${i};
        }
      }
    `,l=this.rank<=4?`sourceLoc = coords +
            ${e}(${t.map((u,p)=>`start[${p}]`).join()});`:t.map((u,p)=>`${n[p]} = ${r[p]} + start[${p}];`).join(`
`);this.userCode=`
      void main() {
        ${e} coords = getOutputCoords();
        ${e} sourceLoc;
        ${l}
        vec4 result = vec4(0.);
        ${c}
        ${a}
        setOutput(result);
      }
    `;}};function Kf(o,t,e,r){let n=r.texData.get(o.dataId),s=r.makeTensorInfo(e,o.dtype),i=r.texData.get(s.dataId);Object.assign(i,n),i.refCount=1,i.shape=e,i.dtype=o.dtype;let c=Wn.computeFlatOffset(t,R.computeStrides(o.shape));n.slice&&(c+=n.slice.flatOffset),i.slice={flatOffset:c,origDataId:n.slice&&n.slice.origDataId||o.dataId};let a=r.dataRefCount.get(i.slice.origDataId)||1;return r.dataRefCount.set(i.slice.origDataId,a+1),s}function pe(o){let{inputs:t,backend:e,attrs:r}=o,{x:n}=t,{begin:s,size:i}=r,[c,a]=Wn.parseSliceParams(n,s,i);if(Wn.assertParamsValid(n,c,a),R.sizeFromShape(a)===0)return e.makeTensorInfo(a,n.dtype,[]);if(e.shouldExecuteOnCPU([n])||n.dtype==="string"){let p=e.texData.get(n.dataId),d=qc(p.values,c,a,n.shape,n.dtype);return e.makeTensorInfo(a,n.dtype,d)}let{isPacked:l}=e.texData.get(n.dataId),u=Wn.isSliceContinous(n.shape,c,a);if(l||!u){let p=O$1().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new ho(a):new fo(a),d=[c];return e.runWebGLProgram(p,[n],n.dtype,d)}return e.uploadToGPU(n.dataId),Kf(n,c,a,e)}var su={kernelName:zc$1,backendName:"webgl",kernelFunc:pe};var qf=o=>{let{inputs:t,backend:e,attrs:r}=o,{x:n}=t,{blockShape:s,crops:i}=r;R.assert(n.shape.length<=4,()=>"batchToSpaceND for rank > 4 with a WebGL backend not implemented yet");let c=s.reduce((C,y)=>C*y),a=kp$1.getReshaped(n.shape,s,c),l=kp$1.getPermuted(a.length,s.length),u=kp$1.getReshapedPermuted(n.shape,s,c),p=kp$1.getSliceBeginCoords(i,s.length),d=kp$1.getSliceSize(u,i,s.length),m=[],f=T({inputs:{x:n},backend:e,attrs:{shape:a}}),h=B({inputs:{x:f},backend:e,attrs:{perm:l}}),g=T({inputs:{x:h},backend:e,attrs:{shape:u}}),x=pe({inputs:{x:g},backend:e,attrs:{begin:p,size:d}});return m.push(f),m.push(h),m.push(g),m.forEach(C=>e.disposeIntermediateTensorInfo(C)),x},iu={kernelName:ca,backendName:"webgl",kernelFunc:qf};vS();function jf(o){let{inputs:t,backend:e,attrs:r}=o,{x:n,weights:s}=t,{size:i}=r,c=e.readSync(n.dataId),a=e.readSync(s.dataId),l=Kt(c,a,s.dtype,s.shape,i);return e.makeTensorInfo([i],s.dtype,l)}var au={kernelName:ua,backendName:"webgl",kernelFunc:jf};vS();var Yf=`
  int r = int(a.r) & int(b.r);
  int g = int(a.g) & int(b.g);
  int rb = int(a.b) & int(b.b);
  int ra = int(a.a) & int(b.a);
  return vec4(r, g, rb, ra);
`,Qf=`
  return float(int(a.r) & int(b.r));
`;function Zf(o){let{inputs:t,backend:e}=o,{a:r,b:n}=t,s=O$1().getBool("WEBGL_PACK_BINARY_OPERATIONS"),i=O$1().getNumber("WEBGL_VERSION");if(e.shouldExecuteOnCPU([r,n])||i===1){let a=e.texData.get(r.dataId).values,l=e.texData.get(n.dataId).values,[u,p]=Cc(r.shape,n.shape,a,l,r.dtype),d=e.makeTensorInfo(p,r.dtype),m=e.texData.get(d.dataId);return m.values=u,d}let c;return s?c=new te(Yf,r.shape,n.shape,false):c=new Y(Qf,r.shape,n.shape),e.runWebGLProgram(c,[r,n],r.dtype)}var cu={kernelName:la,backendName:"webgl",kernelFunc:Zf};vS();function Jf(o){let{inputs:t,backend:e}=o,{s0:r,s1:n}=t,s=e.readSync(r.dataId),i=e.readSync(n.dataId),c=kp$1.assertAndGetBroadcastShape(Array.from(s),Array.from(i));return e.makeTensorInfo([c.length],"int32",Int32Array.from(c))}var lu={kernelName:pa,backendName:"webgl",kernelFunc:Jf};vS();vS();vS();var eh="return float(a != b);",Sn=O({opSnippet:eh,cpuKernelImpl:Uc,dtype:"bool"}),uu={kernelName:dc$1,backendName:"webgl",kernelFunc:Sn};vS();function $e(o){let{inputs:t,backend:e}=o,{input:r}=t,n=e.texData.get(r.dataId);return W({inputs:{x:n.complexTensorInfos.real},backend:e})}var pu={kernelName:Ac$1,backendName:"webgl",kernelFunc:$e};var th="return float(int(x));";function du(o,t){let e=new H(o.shape,th),r=t.runWebGLProgram(e,[o],"int32");return {dataId:r.dataId,shape:r.shape,dtype:r.dtype}}function yn(o){let{inputs:t,backend:e,attrs:r}=o,{x:n}=t,{dtype:s}=r;if(s==="complex64"){if(n.dtype==="complex64")return W({inputs:{x:n},backend:e});let i=_e(n.shape),c=yn({inputs:{x:n},backend:e,attrs:{dtype:"float32"}}),a=Q({inputs:{real:c,imag:i},backend:e});return i.dispose(),e.disposeIntermediateTensorInfo(c),a}if(n.dtype==="complex64"){let i=$e({inputs:{input:n},backend:e}),c=yn({inputs:{x:i},backend:e,attrs:{dtype:s}});return e.disposeIntermediateTensorInfo(i),c}if(!R.hasEncodingLoss(n.dtype,s)){let i=W({inputs:{x:n},backend:e});return {dataId:i.dataId,shape:i.shape,dtype:s}}if(e.shouldExecuteOnCPU([n])){let i=e.texData.get(n.dataId).values,[c,a,l]=bc(i,n.shape,n.dtype,s);return e.makeTensorInfo(c,a,l)}if(s==="int32")return du(n,e);if(s==="bool"){let i=e.makeTensorInfo([],"bool",R.getTypedArrayFromDType("bool",1)),a=Sn({inputs:{a:n,b:i},backend:e});return e.disposeIntermediateTensorInfo(i),a}throw new Error(`Error in Cast: failed to cast ${n.dtype} to ${s}`)}var mu={kernelName:Yo$1,backendName:"webgl",kernelFunc:yn};vS();var fu="return ceil(x);",oh=N({opSnippet:fu,packedOpSnippet:fu,cpuKernelImpl:vc}),hu={kernelName:ma,backendName:"webgl",kernelFunc:oh};vS();var xo=class{constructor(t){this.variableNames=["A"],this.customUniforms=[{name:"minVal",type:"float"},{name:"maxVal",type:"float"}],this.outputShape=t,this.userCode=`

      void main() {
        float value = getAAtOutCoords();
        if (isnan(value)) {
          setOutput(value);
          return;
        }

        setOutput(clamp(value, minVal, maxVal));
      }
    `;}};var go=class{constructor(t){this.variableNames=["A"],this.packedInputs=true,this.packedOutput=true,this.customUniforms=[{name:"minVal",type:"float"},{name:"maxVal",type:"float"}],this.outputShape=t,this.userCode=`
      void main() {
        vec4 value = getAAtOutCoords();

        if (any(isnan(value))) {
          setOutput(value);
          return;
        }

        setOutput(clamp(value, vec4(minVal), vec4(maxVal)));
      }
    `;}};function rh(o){let{inputs:t,backend:e,attrs:r}=o,{x:n}=t,{clipValueMin:s,clipValueMax:i}=r,c;O$1().getBool("WEBGL_PACK_CLIP")?c=new go(n.shape):c=new xo(n.shape);let a=[[s],[i]];return e.runWebGLProgram(c,[n],n.dtype,a)}var xu={kernelName:fa,backendName:"webgl",kernelFunc:rh};vS();var Co=class{constructor(t){this.variableNames=["real","imag"],this.outputShape=t,this.userCode=`
      void main() {
        float re = abs(getRealAtOutCoords());
        float im = abs(getImagAtOutCoords());
        float mx = max(re, im);

        // sadly the length function in glsl is not underflow-safe
        // (at least not on Intel GPUs). So the safe solution is
        // to ensure underflow-safety in all cases.
        setOutput(
          mx == 0.0 ? 0.0 : mx * length(vec2(1, min(re, im)/mx))
        );
      }
    `;}};function gu(o,t){return {dataId:t.dataId,dtype:t.dtype,shape:o.shape}}function nh(o){let{inputs:t,backend:e}=o,{x:r}=t,n=e.texData.get(r.dataId),s=new Co(r.shape),i=[gu(r,n.complexTensorInfos.real),gu(r,n.complexTensorInfos.imag)];return e.runWebGLProgram(s,i,i[0].dtype)}var Cu={kernelName:da,backendName:"webgl",kernelFunc:nh};vS();vS();vS();var bo=class{constructor(t){this.outputShape=[],this.outputShape=kp$1.computeOutShape(t,1),this.variableNames=t.map((i,c)=>`T${c}`);let e=new Array(t.length-1);e[0]=t[0][1];for(let i=1;i<e.length;i++)e[i]=e[i-1]+t[i][1];let r=[`if (yC < ${e[0]}) setOutput(getT0(yR, yC));`];for(let i=1;i<e.length;i++){let c=e[i-1];r.push(`else if (yC < ${e[i]}) setOutput(getT${i}(yR, yC-${c}));`);}let n=e.length,s=e[e.length-1];r.push(`else setOutput(getT${n}(yR, yC-${s}));`),this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int yR = coords.x;
        int yC = coords.y;

        ${r.join(`
        `)}
      }
    `;}};vS();var $o=class{constructor(t,e){this.packedInputs=true,this.packedOutput=true,this.outputShape=[],this.outputShape=kp$1.computeOutShape(t,e);let r=this.outputShape,n=r.length,s=A(n),i=V("coords",n),c=["x","y","z","w","u","v"].slice(0,n);this.variableNames=t.map((h,g)=>`T${g}`);let a=new Array(t.length-1);a[0]=t[0][e];for(let h=1;h<a.length;h++)a[h]=a[h-1]+t[h][e];let l=c[e],u=c.slice(-2),p=c.join(),d=`if (${l} < ${a[0]}) {
        return getChannel(
            getT0(${p}), vec2(${u.join()}));
        }`;for(let h=1;h<a.length;h++){let g=a[h-1];d+=`
        if (${l} < ${a[h]}  && ${l} >= ${a[h-1]}) {
          return getChannel(
            getT${h}(${vo(c,l,g)}),
            vec2(${vo(u,l,g)}));
        }`;}let m=a.length,f=a[a.length-1];d+=`
        return getChannel(
          getT${m}(${vo(c,l,f)}),
          vec2(${vo(u,l,f)}));`,this.userCode=`
      float getValue(${c.map(h=>"int "+h)}) {
        ${d}
      }

      void main() {
        ${s} coords = getOutputCoords();
        vec4 result = vec4(getValue(${i}), 0., 0., 0.);

        ${i[n-1]} = ${i[n-1]} + 1;
        if (${i[n-1]} < ${r[n-1]}) {
          result.g = getValue(${i});
        }

        ${i[n-2]} = ${i[n-2]} + 1;
        if (${i[n-2]} < ${r[n-2]}) {
          result.a = getValue(${i});
        }

        ${i[n-1]} = ${i[n-1]} - 1;
        if (${i[n-2]} < ${r[n-2]} &&
            ${i[n-1]} < ${r[n-1]}) {
          result.b = getValue(${i});
        }
        setOutput(result);
      }
    `;}};function vo(o,t,e){let r=o.indexOf(t);return o.map((s,i)=>i===r?`${s} - ${e}`:s).join()}vS();function We(o){let{inputs:t,backend:e}=o,{input:r}=t,n=e.texData.get(r.dataId);return W({inputs:{x:n.complexTensorInfos.imag},backend:e})}var bu={kernelName:ja,backendName:"webgl",kernelFunc:We};function it(o,t,e){let r=o[0].dtype;if(r==="complex64"){let m=o.map(C=>$e({inputs:{input:C},backend:e})),f=o.map(C=>We({inputs:{input:C},backend:e})),h=it(m,t,e),g=it(f,t,e),x=Q({inputs:{real:h,imag:g},backend:e});return m.forEach(C=>e.disposeIntermediateTensorInfo(C)),f.forEach(C=>e.disposeIntermediateTensorInfo(C)),e.disposeIntermediateTensorInfo(h),e.disposeIntermediateTensorInfo(g),x}let n=e.shouldExecuteOnCPU(o);if(r==="string"&&(n=true),n){let m=o.map(R$1=>{let F=[-1,R.sizeFromShape(R$1.shape.slice(t))];return T({inputs:{x:R$1},backend:e,attrs:{shape:F}})}),f=m.map(R=>({vals:e.readSync(R.dataId),shape:R.shape})),h=kp$1.computeOutShape(m.map(R=>R.shape),1),g=m[0].shape[0]===1,x=$c(f,h,r,g),C=kp$1.computeOutShape(o.map(R=>R.shape),t),y=e.makeTensorInfo(C,r,x);return m.forEach(R=>e.disposeIntermediateTensorInfo(R)),y}let s=o.filter(m=>R.sizeFromShape(m.shape)>0),i=O$1().getBool("WEBGL_PACK_ARRAY_OPERATIONS")&&s[0].shape.length>1;if(s.length===1){let m=i?new H(o[0].shape,fe):new j(o[0].shape,fe);return e.runWebGLProgram(m,o,r)}let c=O$1().getNumber("WEBGL_MAX_TEXTURES_IN_SHADER");if(s.length>c){let m=[];for(let h=0;h<s.length;h+=c){let g=s.slice(h,h+c);m.push(it(g,t,e));}let f=it(m,t,e);for(let h of m)e.disposeIntermediateTensorInfo(h);return f}if(i){let m=new $o(s.map(f=>f.shape),t);return e.runWebGLProgram(m,s,r)}let{tensors2D:a,outShape:l}=sh(s,t,e),u=new bo(a.map(m=>m.shape)),p=e.runWebGLProgram(u,a,r);a.forEach(m=>e.disposeIntermediateTensorInfo(m));let d=T({inputs:{x:p},attrs:{shape:l},backend:e});return e.disposeIntermediateTensorInfo(p),d}function sh(o,t,e){let r=kp$1.computeOutShape(o.map(s=>s.shape),t);return {tensors2D:o.map(s=>T({inputs:{x:s},attrs:{shape:[-1,R.sizeFromShape(s.shape.slice(t))]},backend:e})),outShape:r}}function Rn(o){let{inputs:t,backend:e,attrs:r}=o,{axis:n}=r,s=R.parseAxisParam(n,t[0].shape)[0],i=t.map(l=>l.shape);kp$1.assertParamsConsistent(i,s);let c=kp$1.computeOutShape(t.map(l=>l.shape),s);if(R.sizeFromShape(c)===0)return e.makeTensorInfo(c,t[0].dtype,[]);let a=t.filter(l=>R.sizeFromShape(l.shape)>0);return a.length===1?W({inputs:{x:a[0]},backend:e}):it(a,s,e)}var vu={kernelName:ga,backendName:"webgl",kernelFunc:Rn};vS();var at=class{constructor(t,e=false,r=null,n=false,s=false){this.variableNames=["x","W"],this.outputShape=t.outShape;let i=t.padInfo.top,c=t.padInfo.left,a=t.strideHeight,l=t.strideWidth,u=t.dilationHeight,p=t.dilationWidth,d=t.filterHeight,m=t.filterWidth,f=Math.floor(t.inChannels/4)*4,h=t.inChannels%4,g=t.dataFormat==="channelsLast",x=g?1:2,C=g?2:3,y=g?3:1,R="",w="";r&&(n?R=`float activation(float a) {
          float b = getPreluActivationWeightsAtOutCoords();
          ${r}
        }`:s?R=`float activation(float a) {
          float b = getLeakyreluAlphaAtOutCoords();
          ${r}
        }`:R=`
          float activation(float x) {
            ${r}
          }
        `,w="result = activation(result);");let F=e?"result += getBiasAtOutCoords();":"";e&&this.variableNames.push("bias"),n&&this.variableNames.push("preluActivationWeights"),s&&this.variableNames.push("leakyreluAlpha"),this.userCode=`
      ${R}

      const ivec2 strides = ivec2(${a}, ${l});
      const ivec2 pads = ivec2(${i}, ${c});

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d2 = coords[${y}];

        ivec2 xRCCorner =
            ivec2(coords[${x}], coords[${C}]) * strides - pads;
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        // Convolve x(?, ?, d1) with w(:, :, d1, d2) to get y(yR, yC, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${d}; wR++) {
          int xR = xRCorner + wR * ${u};

          if (xR < 0 || xR >= ${t.inHeight}) {
            continue;
          }

          for (int wC = 0; wC < ${m}; wC++) {
            int xC = xCCorner + wC * ${p};

            if (xC < 0 || xC >= ${t.inWidth}) {
              continue;
            }

            for (int d1 = 0; d1 < ${f}; d1 += 4) {
              vec4 wValues = vec4(
                getW(wR, wC, d1, d2),
                getW(wR, wC, d1 + 1, d2),
                getW(wR, wC, d1 + 2, d2),
                getW(wR, wC, d1 + 3, d2)
              );

              if (${g}) {
                vec4 xValues = vec4(
                  getX(batch, xR, xC, d1),
                  getX(batch, xR, xC, d1 + 1),
                  getX(batch, xR, xC, d1 + 2),
                  getX(batch, xR, xC, d1 + 3)
                );
                dotProd += dot(xValues, wValues);
              } else {
                vec4 xValues = vec4(
                  getX(batch, d1, xR, xC),
                  getX(batch, d1 + 1, xR, xC),
                  getX(batch, d1 + 2, xR, xC),
                  getX(batch, d1 + 3, xR, xC)
                );
                dotProd += dot(xValues, wValues);
              }
            }

            if (${h===1}) {

              if (${g}) {
                dotProd +=
                    getX(batch, xR, xC, ${f}) *
                    getW(wR, wC, ${f}, d2);
              } else {
                dotProd +=
                    getX(batch, ${f}, xR, xC) *
                    getW(wR, wC, ${f}, d2);
              }

            } else if (${h===2}) {
              vec2 wValues = vec2(
                getW(wR, wC, ${f}, d2),
                getW(wR, wC, ${f} + 1, d2)
              );

              if (${g}) {
                vec2 xValues = vec2(
                  getX(batch, xR, xC, ${f}),
                  getX(batch, xR, xC, ${f} + 1)
                );
                dotProd += dot(xValues, wValues);
              } else {
                vec2 xValues = vec2(
                  getX(batch, ${f}, xR, xC),
                  getX(batch, ${f} + 1, xR, xC)
                );
                dotProd += dot(xValues, wValues);
              }

            } else if (${h===3}) {
              vec3 wValues = vec3(
                getW(wR, wC, ${f}, d2),
                getW(wR, wC, ${f} + 1, d2),
                getW(wR, wC, ${f} + 2, d2)
              );

              if (${g}) {
                vec3 xValues = vec3(
                  getX(batch, xR, xC, ${f}),
                  getX(batch, xR, xC, ${f} + 1),
                  getX(batch, xR, xC, ${f} + 2)
                );
                dotProd += dot(xValues, wValues);
              } else {
                vec3 xValues = vec3(
                  getX(batch, ${f}, xR, xC),
                  getX(batch, ${f} + 1, xR, xC),
                  getX(batch, ${f} + 2, xR, xC)
                );
                dotProd += dot(xValues, wValues);
              }

            }
          }
        }

        float result = dotProd;
        ${F}
        ${w}
        setOutput(result);
      }
    `;}},So=class{constructor(t){this.variableNames=["x","W"],this.outputShape=t.outShape;let e=t.padInfo.front,r=t.padInfo.top,n=t.padInfo.left,s=t.strideDepth,i=t.strideHeight,c=t.strideWidth,a=t.dilationDepth,l=t.dilationHeight,u=t.dilationWidth,p=t.filterDepth,d=t.filterHeight,m=t.filterWidth,f=Math.floor(t.inChannels/4)*4,h=t.inChannels%4;this.userCode=`
      const ivec3 strides = ivec3(${s}, ${i}, ${c});
      const ivec3 pads = ivec3(${e}, ${r}, ${n});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int d2 = coords.u;

        ivec3 xFRCCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;
        int xFCorner = xFRCCorner.x;
        int xRCorner = xFRCCorner.y;
        int xCCorner = xFRCCorner.z;

        // Convolve x(?, ?, ?, d1) with w(:, :, :, d1, d2) to get
        // y(yF, yR, yC, d2). ? = to be determined. : = across all
        // values in that axis.
        float dotProd = 0.0;
        for (int wF = 0; wF < ${p}; wF++) {
          int xF = xFCorner + wF * ${a};

          if (xF < 0 || xF >= ${t.inDepth}) {
            continue;
          }

          for (int wR = 0; wR < ${d}; wR++) {
            int xR = xRCorner + wR * ${l};

            if (xR < 0 || xR >= ${t.inHeight}) {
              continue;
            }

            for (int wC = 0; wC < ${m}; wC++) {
              int xC = xCCorner + wC * ${u};

              if (xC < 0 || xC >= ${t.inWidth}) {
                continue;
              }

              for (int d1 = 0; d1 < ${f}; d1 += 4) {
                vec4 xValues = vec4(
                  getX(batch, xF, xR, xC, d1),
                  getX(batch, xF, xR, xC, d1 + 1),
                  getX(batch, xF, xR, xC, d1 + 2),
                  getX(batch, xF, xR, xC, d1 + 3)
                );
                vec4 wValues = vec4(
                  getW(wF, wR, wC, d1, d2),
                  getW(wF, wR, wC, d1 + 1, d2),
                  getW(wF, wR, wC, d1 + 2, d2),
                  getW(wF, wR, wC, d1 + 3, d2)
                );

                dotProd += dot(xValues, wValues);
              }

              if (${h===1}) {
                dotProd +=
                  getX(batch, xF, xR, xC, ${f}) *
                  getW(wF, wR, wC, ${f}, d2);
              } else if (${h===2}) {
                vec2 xValues = vec2(
                  getX(batch, xF, xR, xC, ${f}),
                  getX(batch, xF, xR, xC, ${f} + 1)
                );
                vec2 wValues = vec2(
                  getW(wF, wR, wC, ${f}, d2),
                  getW(wF, wR, wC, ${f} + 1, d2)
                );
                dotProd += dot(xValues, wValues);
              } else if (${h===3}) {
                vec3 xValues = vec3(
                  getX(batch, xF, xR, xC, ${f}),
                  getX(batch, xF, xR, xC, ${f} + 1),
                  getX(batch, xF, xR, xC, ${f} + 2)
                );
                vec3 wValues = vec3(
                  getW(wF, wR, wC, ${f}, d2),
                  getW(wF, wR, wC, ${f} + 1, d2),
                  getW(wF, wR, wC, ${f} + 2, d2)
                );
                dotProd += dot(xValues, wValues);
              }
            }
          }
        }
        setOutput(dotProd);
      }
    `;}};vS();var ct=class{constructor(t,e=false,r=null,n=false,s=false){this.variableNames=["x","W"],this.packedInputs=true,this.packedOutput=true,this.customUniforms=[{name:"pads",type:"ivec2"},{name:"strides",type:"ivec2"},{name:"dilations",type:"ivec2"},{name:"inDims",type:"ivec2"}],this.outputShape=t.outShape,this.enableShapeUniforms=L(this.outputShape.length);let i=t.padInfo.left,c=t.strideWidth,a=t.dilationWidth,l=t.filterHeight,u=t.filterWidth,p=u,d=`
       int xR; int xC; int xCOffset;
       vec4 wTexel; vec4 previous; vec4 final;`;for(let g=0;g<u;g++)d+=`
           vec4 xTexelC${g*2};
           int xTexelC${g*2}Ready;
           vec4 xTexelC${g*2+1};
           int xTexelC${g*2+1}Ready;
           vec4 xC${g};`;d+=`
     for (int r = 0; r < ${l}; r++) {
      for (int d1 = 0; d1 < ${t.inChannels}; d1 += 2) {
       `;for(let g=0;g<u;g++)d+=`
           xTexelC${g*2} = vec4(0.0);
           xTexelC${g*2}Ready = 0;
           xTexelC${g*2+1} = vec4(0.0);
           xTexelC${g*2+1}Ready = 0;
           xC${g} = vec4(0.0);`;d+=`
         xR = xRCorner + r * dilations[0];
         if (xR >=0 && xR < inDims[0]) {
       `;for(let g=0;g<(p+1)/2;g++){let x=g*2;if(d+=`
           xC = xCCorner + ${x*a};
           `,c===1){if(x<u&&(i%2===1?(d+=`
                 xCOffset = xC + 1;
                 if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${x}Ready == 0) {
                   xTexelC${x} = getX(batch, xR, xCOffset, d1);

                   // Need to manually clear unused channels in case
                   // we're reading from recycled texture.
                   if (xCOffset + 1 >= inDims[1]) {
                     xTexelC${x}.zw = vec2(0.0);
                   }
                   xTexelC${x}Ready = 1;
                 }
               `,a===1&&x>0?d+=`
                 xC${x} = vec4(xTexelC${x-2}.zw, xTexelC${x}.xy);
                 `:d+=`
                   xCOffset = xC + 1 - 2;

                   if (xCOffset >= 0 && xCOffset < inDims[1]) {
                     previous = getX(batch, xR, xCOffset, d1);

                     // Need to manually clear unused channels in case
                     // we're reading from recycled texture.
                     if (xCOffset + 1 >= inDims[1]) {
                       previous.zw = vec2(0.0);
                     }

                     xC${x} = vec4(previous.zw, xTexelC${x}.xy);
                   } else {
                     xC${x} = vec4(0.0, 0.0, xTexelC${x}.xy);
                   }
                   `):d+=`
                 if (xC >= 0 && xC < inDims[1] && xTexelC${x}Ready == 0) {
                   xTexelC${x} = getX(batch, xR, xC, d1);
                   if (xC + 1 >= inDims[1]) {
                     xTexelC${x}.zw = vec2(0.0);
                   }
                   xTexelC${x}Ready = 1;
                 }

                 xC${x} = xTexelC${x};
                 `,x+1<u)){let C=i%2===0?R.nearestLargerEven(a):a;a%2===0&&i%2===1||a%2!==0&&i%2!==1?(d+=`
                   xCOffset = xC + imod(pads[1], 2) + ${C};

                   if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${x+1}Ready == 0) {
                     xTexelC${x+1} = getX(batch, xR, xCOffset, d1);

                     // Need to manually clear unused channels in case
                     // we're reading from recycled texture.
                     if (xCOffset + 1 >= inDims[1]) {
                       xTexelC${x+1}.zw = vec2(0.0);
                     }
                     xTexelC${x+1}Ready = 1;
                   }
                   `,a>1?d+=`
                     xCOffset -= 2;
                     if (xCOffset >= 0 && xCOffset < inDims[1]) {
                      previous = getX(batch, xR, xCOffset, d1);
                      xC${x+1} = vec4(previous.zw, xTexelC${x+1}.xy);
                     } else {
                      xC${x+1} = vec4(0.0, 0.0, xTexelC${x+1}.xy);
                     }
                     `:d+=`
                     xC${x+1} = vec4(xTexelC${x}.zw, xTexelC${x+1}.xy);
                     `):C===1?d+=`
                     xC${x+1} = xTexelC${x};
                     `:d+=`
                     xCOffset = xC + ${C};

                     if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${x+1}Ready == 0) {
                       xTexelC${x+1} = getX(batch, xR, xCOffset, d1);
                       if (xCOffset + 1 >= inDims[1]) {
                         xTexelC${x+1}.zw = vec2(0.0);
                       }
                       xTexelC${x+1}Ready = 1;
                     }

                     xC${x+1} = xTexelC${x+1};
                     `;}}else x<u&&(i%2===1?(d+=`
                 xCOffset = xC + 1 - strides[1];
                 if(xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${x}Ready == 0) {
                   xTexelC${x} = getX(batch, xR, xCOffset, d1);
                   // Need to manually clear unused channels in case
                   // we're reading from recycled texture.
                   if (xCOffset + 1 >= inDims[1]) {
                     xTexelC${x}.zw = vec2(0.0);
                   }
                   xTexelC${x}Ready = 1;
                 }

                 if(xC + 1 >= 0 && xC + 1 < inDims[1] && xTexelC${x+1}Ready == 0) {
                   xTexelC${x+1} = getX(batch, xR, xC + 1, d1);
                   // Need to manually clear unused channels in case
                   // we're reading from recycled texture.
                   if (xC + 2 >= inDims[1]) {
                     xTexelC${x+1}.zw = vec2(0.0);
                   }
                   xTexelC${x+1}Ready = 1;
                 }

                 xC${x} = vec4(xTexelC${x}.zw, xTexelC${x+1}.zw);
               `,x+1<u&&(d+=`
                   final = vec4(0.0);
                   xCOffset = xC + 1 + strides[1];
                   if(xCOffset >= 0 && xCOffset < inDims[1]) {
                     final = getX(batch, xR, xCOffset, d1);
                   }
                   xC${x+1} = vec4(xTexelC${x+1}.xy, final.xy);
                 `)):(d+=`
                 if(xC >= 0 && xC < inDims[1] && xTexelC${x}Ready == 0) {
                   xTexelC${x} = getX(batch, xR, xC, d1);
                   if (xC + 1 >= inDims[1]) {
                     xTexelC${x}.zw = vec2(0.0);
                   }
                   xTexelC${x}Ready = 1;
                 }

                 xCOffset = xC + strides[1];
                 if(xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${x+1}Ready == 0) {
                   xTexelC${x+1} = getX(batch, xR, xCOffset, d1);
                   if (xCOffset + 1 >= inDims[1]) {
                     xTexelC${x+1}.zw = vec2(0.);
                   }
                   xTexelC${x+1}Ready = 1;
                 }

                 xC${x} = vec4(
                   xTexelC${x}.xy, xTexelC${x+1}.xy);
               `,x+1<u&&(d+=`
                   xC${x+1} = vec4(xTexelC${x}.zw, xTexelC${x+1}.zw);
                 `)));x<u&&(d+=`
             wTexel = getW(r, ${x}, d1, d2);
             dotProd += xC${x}.xxzz * vec4(wTexel.xy, wTexel.xy);
             if(d1 + 1 < ${t.inChannels}) {
               dotProd += xC${x}.yyww * vec4(wTexel.zw, wTexel.zw);
             }
           `,x+1<u&&(d+=`
               wTexel = getW(r, ${x+1}, d1, d2);
               dotProd += xC${x+1}.xxzz * vec4(wTexel.xy, wTexel.xy);
               if(d1 + 1 < ${t.inChannels}) {
                 dotProd += xC${x+1}.yyww * vec4(wTexel.zw, wTexel.zw);
               }
             `));}d+=`
     }
   `,d+=`
     }
   `,d+=`
     }
   `;let m="",f="";r&&(n?m=`vec4 activation(vec4 a) {
           vec4 b = getPreluActivationWeightsAtOutCoords();
           ${r}
         }`:s?m=`vec4 activation(vec4 a) {
           vec4 b = getLeakyreluAlphaAtOutCoords();
           ${r}
         }`:m=`vec4 activation(vec4 x) {
           ${r}
         }`,f="result = activation(result);");let h=e?"result += getBiasAtOutCoords();":"";e&&this.variableNames.push("bias"),n&&this.variableNames.push("preluActivationWeights"),s&&this.variableNames.push("leakyreluAlpha"),this.userCode=`
       ${m}

       void main() {
         ivec4 coords = getOutputCoords();
         int batch = coords.x;
         ivec2 xRCCorner = coords.yz * strides - pads;
         int d2 = coords.w;
         int xRCorner = xRCCorner.x;
         int xCCorner = xRCCorner.y;

         //intialize dotProd with a small epsilon seems to reduce GPU accuracy loss.
         vec4 dotProd = vec4(0.000000000000001);

         ${d}

         vec4 result = dotProd - vec4(0.000000000000001);
         ${h}
         ${f}
         setOutput(result);
       }
     `;}};vS();var yo=class{constructor(t,e){this.variableNames=["A"],this.packedInputs=true,this.packedOutput=true,this.customUniforms=[{name:"inputShape",type:"ivec4"},{name:"pad",type:"ivec2"},{name:"stride",type:"ivec2"},{name:"dilation",type:"ivec2"},{name:"inChannels",type:"int"},{name:"itemsPerBlockRow",type:"int"},{name:"outWidth",type:"int"}],this.outputShape=t,this.enableShapeUniforms=L(this.outputShape.length);let{dataFormat:r}=e,n=U(),s=r==="channelsLast",i=s?1:2,c=s?2:3,a=this.enableShapeUniforms?"if(blockIndex < outShape[2] && pos < outShape[1]) {":`if(blockIndex < ${t[2]} && pos < ${t[1]}) {`,l="";for(let u=0;u<=1;u++)for(let p=0;p<=1;p++)l+=`
          blockIndex = rc.z + ${p};
          pos = rc.y + ${u};

          ${a}
            offsetY = int(blockIndex / outWidth) * stride[0] - pad[0];
            d0 = offsetY + dilation[0] * (pos / itemsPerBlockRow);

            if(d0 < inputShape[${i}] && d0 >= 0) {
              // Use custom imod instead mod. On Intel GPU, mod may generate
              // unexpected value.
              // https://github.com/tensorflow/tfjs/issues/5447
              offsetX = imod(blockIndex, outWidth) * stride[1] - pad[1];
              d1 = offsetX + dilation[1] * (imod(pos, itemsPerBlockRow) /
                  inChannels);

              if(d1 < inputShape[${c}] && d1 >= 0) {

                ch = imod(pos, inChannels);

                if (${s}) {
                  innerDims = vec2(d1, ch);
                  result[${u*2+p}] = getChannel(
                    getA(rc.x, d0, int(innerDims.x),
                    int(innerDims.y)), innerDims);
                } else {
                  innerDims = vec2(d0, d1);
                  result[${u*2+p}] = getChannel(
                    getA(rc.x, ch, int(innerDims.x),
                    int(innerDims.y)), innerDims);
                }
              }
            }
          }
        `;this.userCode=`
      void main() {
        ivec3 rc = getOutputCoords();

        vec4 result = vec4(0);

        int blockIndex, pos, offsetY, d0, offsetX, d1, ch;
        vec2 innerDims;

        ${l}

        ${n.output} = result;
      }
    `;}};function Ro(o,t){let e=o.length;return e>=3?t?[...o.slice(0,-3),o[e-3]*o[e-2],o[e-1]]:[...o.slice(0,-3),o[e-3],o[e-2]*o[e-1]]:!t&&e===1&&o[0]>1?[o[0],1]:null}function To({x:o,filter:t,convInfo:e,backend:r,bias:n=null,preluActivationWeights:s=null,leakyreluAlpha:i=0,activation:c=null}){let a=o.shape,l=r.texData.get(o.dataId),u=e.inChannels,p=a[0]*a[1]*a[2],d=e.outChannels,m=e.dataFormat==="channelsLast",f=false,h=false,g,x=[];if(s!=null){let R=Ro(s.shape,m);R!=null&&(s=T({inputs:{x:s},backend:r,attrs:{shape:R}}),x.push(s));}if(n!=null){let R=Ro(n.shape,m);R!=null&&(n=T({inputs:{x:n},backend:r,attrs:{shape:R}}),x.push(n));}if(!((p===1||d===1)&&u>vn)&&l.isPacked&&m&&l.texture!=null&&a[2]%2!==0&&R.arraysEqual(l.shape.slice(-3),a.slice(-3))){let R$1=a[0]*a[1]*(a[2]+1),w={dataId:o.dataId,shape:[1,R$1,e.inChannels],dtype:o.dtype},F=l.shape;l.shape=l.shape.slice(),l.shape[l.shape.length-2]++,R.assert(Ie(l.shape,w.shape),()=>`packed reshape ${l.shape} to ${w.shape} isn't free`);let _=T({inputs:{x:t},backend:r,attrs:{shape:[1,e.inChannels,e.outChannels]}});x.push(_);let E=Ve({a:w,b:_,backend:r,transposeA:f,transposeB:h,bias:n,activation:c,preluActivationWeights:s,leakyreluAlpha:i}),P=r.texData.get(E.dataId);R.assert(P.isPacked,()=>"batchMatMul result is expected to be packed"),l.shape=F,P.shape=e.outShape,g=W({inputs:{x:E},backend:r}),g.shape=e.outShape,x.push(E);}else {let R=e.outHeight*e.outWidth,w=T({inputs:{x:o},backend:r,attrs:{shape:m?[e.batchSize,R,e.inChannels]:[e.batchSize,e.inChannels,R]}}),F=T({inputs:{x:t},backend:r,attrs:{shape:[1,e.inChannels,e.outChannels]}}),_=Ve({a:m?w:F,b:m?F:w,transposeA:!m,transposeB:h,backend:r,bias:n,activation:c,preluActivationWeights:s,leakyreluAlpha:i});g=T({inputs:{x:_},backend:r,attrs:{shape:e.outShape}}),x.push(w),x.push(F),x.push(_);}for(let R of x)r.disposeIntermediateTensorInfo(R);return g}function wo({x:o,filter:t,convInfo:e,backend:r,bias:n=null,preluActivationWeights:s=null,leakyreluAlpha:i=0,activation:c=null}){let{filterWidth:a,filterHeight:l,inChannels:u,outWidth:p,outHeight:d,dataFormat:m}=e,f=m==="channelsLast",h=a*l*u,g=d*p,x=[e.batchSize,h,g],C=true,y=false,R$1=[];if(s!=null){let q=Ro(s.shape,f);q!=null&&(s=T({inputs:{x:s},backend:r,attrs:{shape:q}}),R$1.push(s));}if(n!=null){let q=Ro(n.shape,f);q!=null&&(n=T({inputs:{x:n},backend:r,attrs:{shape:q}}),R$1.push(n));}let w=T({inputs:{x:t},backend:r,attrs:{shape:[1,h,R.sizeFromShape(t.shape)/h]}});R$1.push(w);let F=new yo(x,e),_=[o.shape,[e.padInfo.top,e.padInfo.left],[e.strideHeight,e.strideWidth],[e.dilationHeight,e.dilationWidth],[e.inChannels],[e.filterWidth*e.inChannels],[e.outWidth]],E=r.runWebGLProgram(F,[o],"float32",_),P=T({inputs:{x:E},backend:r,attrs:{shape:x}});R$1.push(E),R$1.push(P);let D=n!=null,M=s!=null,G=c==="leakyrelu",de=c?ve(c,true):null,Z=new st(f?P.shape:w.shape,f?w.shape:P.shape,f?[e.batchSize,g,e.outChannels]:[e.batchSize,e.outChannels,g],C,y,D,de,M,G),ne=f?[P,w]:[w,P];if(n&&ne.push(n),M&&ne.push(s),G){let q=r.makeTensorInfo([],"float32",R.createScalarValue(i,"float32"));ne.push(q),R$1.push(q);}let se=r.runWebGLProgram(Z,ne,"float32"),ae=T({inputs:{x:se},backend:r,attrs:{shape:e.outShape}});R$1.push(se);for(let q of R$1)r.disposeIntermediateTensorInfo(q);return ae}function ih(o){let{inputs:t,backend:e,attrs:r}=o,{x:n,filter:s}=t,{strides:i,pad:c,dataFormat:a,dilations:l,dimRoundingMode:u}=r,p=kp$1.convertConv2DDataFormat(a),d=kp$1.computeConv2DInfo(n.shape,s.shape,i,l,c,u,false,p),m;if(d.filterHeight===1&&d.filterWidth===1&&d.dilationHeight===1&&d.dilationWidth===1&&d.strideHeight===1&&d.strideWidth===1&&(d.padInfo.type==="SAME"||d.padInfo.type==="VALID"))m=To({x:n,filter:s,convInfo:d,backend:e});else if(d.strideWidth<=2&&p==="channelsLast"&&O$1().getBool("WEBGL_EXP_CONV")){let h=new ct(d),g=[[d.padInfo.top,d.padInfo.left],[d.strideHeight,d.strideWidth],[d.dilationHeight,d.dilationWidth],[d.inHeight,d.inWidth]];m=e.runWebGLProgram(h,[n,s],"float32",g);}else if(O$1().getBool("WEBGL_CONV_IM2COL"))m=wo({x:n,filter:s,convInfo:d,backend:e});else {let h=new at(d);m=e.runWebGLProgram(h,[n,s],"float32");}let f=T({inputs:{x:m},backend:e,attrs:{shape:d.outShape}});return e.disposeIntermediateTensorInfo(m),f}var $u={kernelName:xa,backendName:"webgl",kernelFunc:ih};vS();var Io=class{constructor(t){this.variableNames=["x","dy"],this.outputShape=t.filterShape;let e=t.strideHeight,r=t.strideWidth,n=t.padInfo.top,s=t.padInfo.left,i=t.dataFormat==="channelsLast";this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int wR = coords.x;
        int wC = coords.y;
        int d1 = coords.z;
        int d2 = coords.w;

        // Convolve x(?, ?, d1) with dy(:, :, d2) to get dw(wR, wC, d1, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;

        for (int b = 0; b < ${t.batchSize}; b++) {
          for (int yR = 0; yR < ${t.outHeight}; yR++) {
            int xR = wR + yR * ${e} - ${n};

            if (xR < 0 || xR >= ${t.inHeight}) {
              continue;
            }

            for (int yC = 0; yC < ${t.outWidth}; yC++) {
              int xC = wC + yC * ${r} - ${s};

              if (xC < 0 || xC >= ${t.inWidth}) {
                continue;
              }

              ${i?`float dyValue = getDy(b, yR, yC, d2);
              float xValue = getX(b, xR, xC, d1);
              dotProd += (xValue * dyValue);`:`float dyValue = getDy(b, d2, yR, yC);
              float xValue = getX(b, d1, xR, xC);
              dotProd += (xValue * dyValue);`}
            }
          }
        }
        setOutput(dotProd);
      }
    `;}},No=class{constructor(t){this.variableNames=["dy","W"],this.outputShape=t.inShape;let e=t.filterHeight,r=t.filterWidth,n=t.strideHeight,s=t.strideWidth,i=t.dataFormat==="channelsLast",c=e-1-t.padInfo.top,a=r-1-t.padInfo.left,l=i?1:2,u=i?2:3,p=i?3:1;this.userCode=`
      const ivec2 pads = ivec2(${c}, ${a});

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d1 = coords[${p}];

        ivec2 dyCorner = ivec2(coords[${l}], coords[${u}]) - pads;
        int dyRCorner = dyCorner.x;
        int dyCCorner = dyCorner.y;

        // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${e}; wR++) {
          float dyR = float(dyRCorner + wR) / ${n}.0;

          if (dyR < 0.0 || dyR >= ${t.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          int wRPerm = ${e} - 1 - wR;

          for (int wC = 0; wC < ${r}; wC++) {
            float dyC = float(dyCCorner + wC) / ${s}.0;

            if (dyC < 0.0 || dyC >= ${t.outWidth}.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            int wCPerm = ${r} - 1 - wC;

            for (int d2 = 0; d2 < ${t.outChannels}; d2++) {

              if (${i}) {
                float xValue = getDy(batch, idyR, idyC, d2);
                float wValue = getW(wRPerm, wCPerm, d1, d2);
                dotProd += xValue * wValue;
              } else {
                float xValue = getDy(batch, d2, idyR, idyC);
                float wValue = getW(wRPerm, wCPerm, d1, d2);
                dotProd += xValue * wValue;
              }

            }
          }
        }
        setOutput(dotProd);
      }
    `;}},Eo=class{constructor(t){this.variableNames=["x","dy"],this.outputShape=t.filterShape;let e=t.strideDepth,r=t.strideHeight,n=t.strideWidth,s=t.padInfo.front,i=t.padInfo.top,c=t.padInfo.left;this.userCode=`
      void main() {
        ivec5 coords = getOutputCoords();
        int wF = coords.x;
        int wR = coords.y;
        int wC = coords.z;
        int d1 = coords.w;
        int d2 = coords.u;

        float dotProd = 0.0;

        for (int b = 0; b < ${t.batchSize}; b++) {
          for (int yF = 0; yF < ${t.outDepth}; yF++) {
            int xF = wF + yF * ${e} - ${s};

            if (xF < 0 || xF >= ${t.inDepth}) {
              continue;
            }

            for (int yR = 0; yR < ${t.outHeight}; yR++) {
              int xR = wR + yR * ${r} - ${i};

              if (xR < 0 || xR >= ${t.inHeight}) {
                continue;
              }

              for (int yC = 0; yC < ${t.outWidth}; yC++) {
                int xC = wC + yC * ${n} - ${c};

                if (xC < 0 || xC >= ${t.inWidth}) {
                  continue;
                }

                float dyValue = getDy(b, yF, yR, yC, d2);
                float xValue = getX(b, xF, xR, xC, d1);
                dotProd += (xValue * dyValue);
              }
            }
          }
        }
        setOutput(dotProd);
      }
    `;}},ko=class{constructor(t){this.variableNames=["dy","W"],this.outputShape=t.inShape;let e=t.filterDepth,r=t.filterHeight,n=t.filterWidth,s=t.strideDepth,i=t.strideHeight,c=t.strideWidth,a=e-1-t.padInfo.front,l=r-1-t.padInfo.top,u=n-1-t.padInfo.left;this.userCode=`
      const ivec3 pads = ivec3(${a}, ${l}, ${u});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int d1 = coords.u;


        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;
        int dyFCorner = dyCorner.x;
        int dyRCorner = dyCorner.y;
        int dyCCorner = dyCorner.z;

        float dotProd = 0.0;
        for (int wF = 0; wF < ${e}; wF++) {
          float dyF = float(dyFCorner + wF) / ${s}.0;

          if (dyF < 0.0 || dyF >= ${t.outDepth}.0 || fract(dyF) > 0.0) {
            continue;
          }
          int idyF = int(dyF);

          int wFPerm = ${e} - 1 - wF;

          for (int wR = 0; wR < ${r}; wR++) {
            float dyR = float(dyRCorner + wR) / ${i}.0;

            if (dyR < 0.0 || dyR >= ${t.outHeight}.0 ||
              fract(dyR) > 0.0) {
              continue;
            }
            int idyR = int(dyR);

            int wRPerm = ${r} - 1 - wR;

            for (int wC = 0; wC < ${n}; wC++) {
              float dyC = float(dyCCorner + wC) / ${c}.0;

              if (dyC < 0.0 || dyC >= ${t.outWidth}.0 ||
                  fract(dyC) > 0.0) {
                continue;
              }
              int idyC = int(dyC);

              int wCPerm = ${n} - 1 - wC;

              for (int d2 = 0; d2 < ${t.outChannels}; d2++) {
                float xValue = getDy(batch, idyF, idyR, idyC, d2);
                float wValue = getW(wFPerm, wRPerm, wCPerm, d1, d2);
                dotProd += xValue * wValue;
              }
            }
          }
        }
        setOutput(dotProd);
      }
    `;}};function ah(o){let{inputs:t,backend:e,attrs:r}=o,{x:n,dy:s}=t,{strides:i,pad:c,dataFormat:a,dimRoundingMode:l,filterShape:u}=r,p=kp$1.convertConv2DDataFormat(a),d=kp$1.computeConv2DInfo(n.shape,u,i,1,c,l,false,p),m=new Io(d);return e.runWebGLProgram(m,[n,s],"float32")}var Su={kernelName:ba,backendName:"webgl",kernelFunc:ah};vS();var _o=class{constructor(t){this.variableNames=["dy","W"],this.packedInputs=true,this.packedOutput=true,this.customUniforms=[{name:"strides",type:"vec2"}],this.outputShape=t.inShape,this.enableShapeUniforms=L(this.outputShape.length);let e=t.filterHeight,r=t.filterWidth,n=e-1-t.padInfo.top,s=r-1-t.padInfo.left;this.userCode=`
      const ivec2 pads = ivec2(${n}, ${s});

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d1 = coords[3];

        ivec2 dyCorner = ivec2(coords[1], coords[2]) - pads;
        int dyRCorner = dyCorner.x;
        int dyCCorner = dyCorner.y;

        vec4 result = vec4(0.);
        for (int wR = 0; wR < ${e}; wR++) {
          float dyR = float(dyRCorner + wR) / strides[0];
          if (dyR < 0.0 || dyR >= ${t.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);
          int wRPerm = ${e} - 1 - wR;

          for (int wC = 0; wC < ${r}; wC++) {
            int wCPerm = ${r} - 1 - wC;

            float dyC = float(dyCCorner + wC) / strides[1];
            bool idyCVal = (dyC >= 0.0) && (dyC < ${t.outWidth}.0)
              && (fract(dyC) == 0.0);
            int idyC = int(dyC);

            float dyC2 = float(dyCCorner + wC + 1) / strides[1];
            bool idyCVal2 = (dyC2 >= 0.0) && (dyC2 < ${t.outWidth}.0)
              && (fract(dyC2) == 0.0);
            int idyC2 = int(dyC2);

            if (idyCVal && idyCVal2) {
              for (int d2 = 0; d2 < ${t.outChannels}; d2 += 2) {
                vec4 wValue = getW(wRPerm, wCPerm, d1, d2);
                vec4 dySample = getDy(batch, idyR, idyC, d2);
                vec4 dySample2 = (idyC / 2 == idyC2 / 2) ?
                  dySample : getDy(batch, idyR, idyC2, d2);

                vec2 dyValue = mod(float(idyC), 2.) == 0. ?
                  dySample.xy : dySample.zw;
                result.xy += vec2(dot(dyValue, wValue.xy),
                  dot(dyValue, wValue.zw));

                dyValue = mod(float(idyC2), 2.) == 0. ?
                  dySample2.xy : dySample2.zw;
                result.zw += vec2(dot(dyValue, wValue.xy),
                  dot(dyValue, wValue.zw));
              }
            } else if (idyCVal) {
              for (int d2 = 0; d2 < ${t.outChannels}; d2 += 2) {
                vec4 wValue = getW(wRPerm, wCPerm, d1, d2);
                vec4 dySample = getDy(batch, idyR, idyC, d2);
                vec2 dyValue = mod(float(idyC), 2.) == 0. ?
                  dySample.xy : dySample.zw;
                result.xy += vec2(dot(dyValue, wValue.xy),
                  dot(dyValue, wValue.zw));
              }
            } else if (idyCVal2) {
              for (int d2 = 0; d2 < ${t.outChannels}; d2 += 2) {
                vec4 wValue = getW(wRPerm, wCPerm, d1, d2);
                vec4 dySample = getDy(batch, idyR, idyC2, d2);
                vec2 dyValue = mod(float(idyC2), 2.) == 0. ?
                  dySample.xy : dySample.zw;
                result.zw += vec2(dot(dyValue, wValue.xy),
                  dot(dyValue, wValue.zw));
              }
            }
          }
        }
        setOutput(result);
      }
    `;}};function ch(o){let{inputs:t,backend:e,attrs:r}=o,{dy:n,filter:s}=t,{inputShape:i,strides:c,pad:a,dataFormat:l,dimRoundingMode:u}=r,p=kp$1.convertConv2DDataFormat(l),d=kp$1.computeConv2DInfo(i,s.shape,c,1,a,u,false,p);if(O$1().getBool("WEBGL_PACK_CONV2DTRANSPOSE")&&p==="channelsLast"){let m=[[d.strideHeight,d.strideWidth]],f=new _o(d);return e.runWebGLProgram(f,[n,s],"float32",m)}else {let m=new No(d);return e.runWebGLProgram(m,[n,s],"float32")}}var yu={kernelName:wa,backendName:"webgl",kernelFunc:ch};vS();function lh(o){let{inputs:t,backend:e,attrs:r}=o,{x:n,filter:s}=t,{strides:i,pad:c,dilations:a}=r,l=kp$1.computeConv3DInfo(n.shape,s.shape,i,a,c),u=new So(l);return e.runWebGLProgram(u,[n,s],"float32")}var Ru={kernelName:ya,backendName:"webgl",kernelFunc:lh};vS();function uh(o){let{inputs:t,backend:e,attrs:r}=o,{x:n,dy:s}=t,{strides:i,pad:c,filterShape:a}=r,l=kp$1.computeConv3DInfo(n.shape,a,i,1,c),u=new Eo(l);return e.runWebGLProgram(u,[n,s],"float32")}var Tu={kernelName:n0,backendName:"webgl",kernelFunc:uh};vS();function ph(o){let{inputs:t,backend:e,attrs:r}=o,{dy:n,filter:s}=t,{pad:i,strides:c,inputShape:a}=r,l=kp$1.computeConv3DInfo(a,s.shape,c,1,i),u=new ko(l);return e.runWebGLProgram(u,[n,s],"float32")}var wu={kernelName:Ea,backendName:"webgl",kernelFunc:ph};vS();var dh=ie+`
  return cos(x);
`,mh=`
  vec4 result = cos(x);
  bvec4 isNaN = isnan(x);
  ${oe}
  return result;
`,fh=N({opSnippet:dh,packedOpSnippet:mh}),Iu={kernelName:"Cos",backendName:"webgl",kernelFunc:fh};vS();var hh=`
  float e2x = exp(-x);
  return (e2x + 1.0 / e2x) / 2.0;
`,xh=N({opSnippet:hh}),Nu={kernelName:va,backendName:"webgl",kernelFunc:xh};vS();var Ao=class{constructor(t,e,r,n,s){this.variableNames=["Image","Boxes","BoxInd"],this.outputShape=[];let[i,c,a,l]=t,[u]=e,[p,d]=r;this.outputShape=[u,p,d,l];let m=n==="bilinear"?1:0,[f,h]=[`${c-1}.0`,`${a-1}.0`],[g,x,C]=p>1?[`${(c-1)/(p-1)}`,"(y2-y1) * height_ratio",`y1*${f} + float(y)*(height_scale)`]:["0.0","0.0",`0.5 * (y1+y2) * ${f}`],[y,R,w]=d>1?[`${(a-1)/(d-1)}`,"(x2-x1) * width_ratio",`x1*${h} + float(x)*(width_scale)`]:["0.0","0.0",`0.5 * (x1+x2) * ${h}`];this.userCode=`
      const float height_ratio = float(${g});
      const float width_ratio = float(${y});
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int y = coords[1];
        int x = coords[2];
        int d = coords[3];

        // get box vals
        float y1 = getBoxes(b,0);
        float x1 = getBoxes(b,1);
        float y2 = getBoxes(b,2);
        float x2 = getBoxes(b,3);

        // get image in batch index
        int bInd = round(getBoxInd(b));
        if(bInd < 0 || bInd >= ${i}) {
          return;
        }

        float height_scale = ${x};
        float width_scale = ${R};

        float in_y = ${C};
        if( in_y < 0.0 || in_y > ${f} ) {
          setOutput(float(${s}));
          return;
        }
        float in_x = ${w};
        if( in_x < 0.0 || in_x > ${h} ) {
          setOutput(float(${s}));
          return;
        }

        vec2 sourceFracIndexCR = vec2(in_x,in_y);
        if(${m} == 1) {
          // Compute the four integer indices.
          ivec2 sourceFloorCR = ivec2(sourceFracIndexCR);
          ivec2 sourceCeilCR = ivec2(ceil(sourceFracIndexCR));

          float topLeft = getImage(b, sourceFloorCR.y, sourceFloorCR.x, d);
          float bottomLeft = getImage(b, sourceCeilCR.y, sourceFloorCR.x, d);
          float topRight = getImage(b, sourceFloorCR.y, sourceCeilCR.x, d);
          float bottomRight = getImage(b, sourceCeilCR.y, sourceCeilCR.x, d);

          vec2 fracCR = sourceFracIndexCR - vec2(sourceFloorCR);

          float top = topLeft + (topRight - topLeft) * fracCR.x;
          float bottom = bottomLeft + (bottomRight - bottomLeft) * fracCR.x;
          float newValue = top + (bottom - top) * fracCR.y;
          setOutput(newValue);
        } else {
          // Compute the coordinators of nearest neighbor point.
          ivec2 sourceNearestCR = ivec2(floor(
            sourceFracIndexCR + vec2(0.5,0.5)));
          float newValue = getImage(b, sourceNearestCR.y, sourceNearestCR.x, d);
          setOutput(newValue);
        }
      }
    `;}};var gh=o=>{let{inputs:t,backend:e,attrs:r}=o,{image:n,boxes:s,boxInd:i}=t,{cropSize:c,method:a,extrapolationValue:l}=r,u=new Ao(n.shape,s.shape,c,a,l);return e.runWebGLProgram(u,[n,s,i],"float32")},Eu={kernelName:ka,backendName:"webgl",kernelFunc:gh};vS();var lt=(function(o){return o.Prod="*",o.Sum="+",o})(lt||{}),yt=class{constructor(t,e,r,n){this.op=t,this.outputShape=e,this.variableNames=["x"],this.customUniforms=[{name:"index",type:"float"}];let s=this.outputShape.length,i=this.op===lt.Prod?"1.0":"0.0",c=r?i:`getX(${ku(s,"coords",this.op)})`,a=this.outputShape[this.outputShape.length-1],l="",u="";r?(l=n?`end != ${a-1}`:"end != 0",u=n?"end + 1":"end - 1"):(l=n?`end + pow2 < ${a}`:"end >= pow2",u=n?"end + pow2":"end - pow2"),this.userCode=`
      void main() {
        ${A(s)} coords = getOutputCoords();
        int end = ${_u(s,"coords",this.op)};
        float val = ${c};
        int pow2 = int(pow(2.0, index));
        if (${l}) {
          int idx = ${u};
          ${_u(s,"coords",this.op)} = idx;
          val ${this.op}= getX(${ku(s,"coords",this.op)});
        }
        setOutput(val);
      }
    `;}};function ku(o,t,e){if(o===1)return `${t}`;if(o===2)return `${t}.x, ${t}.y`;if(o===3)return `${t}.x, ${t}.y, ${t}.z`;if(o===4)return `${t}.x, ${t}.y, ${t}.z, ${t}.w`;throw new Error(`Cumulative ${e} for rank ${o} is not yet supported`)}function _u(o,t,e){if(o===1)return `${t}`;if(o===2)return `${t}.y`;if(o===3)return `${t}.z`;if(o===4)return `${t}.w`;throw new Error(`Cumulative ${e} for rank ${o} is not yet supported`)}vS();function Fo(o,t,e,r,n,s){let i=t.shape.length,c=kp$1.getAxesPermutation([r],i),a=t;c!=null&&(a=B({inputs:{x:t},backend:e,attrs:{perm:c}}));let l=kp$1.getInnerMostAxes(1,i)[0];if(l!==i-1)throw new Error(`WebGL cumprod shader expects an inner-most axis=${t.shape.length-1} but got axis=${r}`);let u=a.shape[l],p=W({inputs:{x:a},backend:e});for(let d=0;d<=Math.ceil(Math.log2(u))-1;d++){let m=new yt(o,a.shape,false,s),f=[[d]],h=p;p=e.runWebGLProgram(m,[p],p.dtype,f),e.disposeIntermediateTensorInfo(h);}if(n){let d=new yt(o,a.shape,n,s),m=p;p=e.runWebGLProgram(d,[p],p.dtype),e.disposeIntermediateTensorInfo(m);}if(c!=null){let d=kp$1.getUndoAxesPermutation(c),m=B({inputs:{x:p},backend:e,attrs:{perm:d}});return e.disposeIntermediateTensorInfo(p),e.disposeIntermediateTensorInfo(a),m}return p}function Ch(o){let{inputs:t,backend:e,attrs:r}=o,{x:n}=t,{axis:s,exclusive:i,reverse:c}=r;return Fo(lt.Prod,n,e,s,i,c)}var Au={kernelName:Ta,backendName:"webgl",kernelFunc:Ch};vS();function bh(o){let{inputs:t,backend:e,attrs:r}=o,{x:n}=t,{axis:s,exclusive:i,reverse:c}=r;return Fo(lt.Sum,n,e,s,i,c)}var Fu={kernelName:$a,backendName:"webgl",kernelFunc:bh};vS();function vh(o){let{inputs:t,backend:e,attrs:r}=o,{x:n,weights:s}=t,{size:i,binaryOutput:c}=r;if(n.shape.length===1){let a=e.readSync(n.dataId),l=e.readSync(s.dataId),u=Kt(a,l,s.dtype,s.shape,i);return e.makeTensorInfo([i],s.dtype,u)}else if(n.shape.length===2){let a=e.bufferSync(n),l=e.bufferSync(s),u=gc(a,l,i,c);return e.makeTensorInfo(u.shape,s.dtype,u.values)}throw new Error(`Error in denseBincount: input must be at most rank 2, but got rank${n.shape.length}.`)}var Du={kernelName:Sa,backendName:"webgl",kernelFunc:vh};vS();var Do=class{constructor(t,e,r){this.variableNames=["x"],this.outputShape=[],this.outputShape=t,this.blockSize=e,this.dataFormat=r,this.userCode=`
    void main() {
      ivec4 coords = getOutputCoords();
      int b = coords[0];
      int h = ${this.getHeightCoordString()};
      int w = ${this.getWidthCoordString()};
      int d = ${this.getDepthCoordString()};

      int in_h = h / ${e};
      int offset_h = imod(h, ${e});
      int in_w = w / ${e};
      int offset_w = imod(w, ${e});
      int offset_d = (offset_h * ${e} + offset_w) *
        ${this.getOutputDepthSize()};
      int in_d = d + offset_d;

      float result = ${this.getInputSamplingString()};
      setOutput(result);
    }
  `;}getHeightCoordString(){return this.dataFormat==="NHWC"?"coords[1]":"coords[2]"}getWidthCoordString(){return this.dataFormat==="NHWC"?"coords[2]":"coords[3]"}getDepthCoordString(){return this.dataFormat==="NHWC"?"coords[3]":"coords[1]"}getOutputDepthSize(){return this.dataFormat==="NHWC"?this.outputShape[3]:this.outputShape[1]}getInputSamplingString(){return this.dataFormat==="NHWC"?"getX(b, in_h, in_w, in_d)":"getX(b, in_d, in_h, in_w)"}};function $h(o){let{inputs:t,backend:e,attrs:r}=o,{x:n}=t,{blockSize:s,dataFormat:i}=r,c=n.shape[0],a=i==="NHWC"?n.shape[1]:n.shape[2],l=i==="NHWC"?n.shape[2]:n.shape[3],u=i==="NHWC"?n.shape[3]:n.shape[1],p=a*s,d=l*s,m=u/(s*s),f=i==="NHWC"?[c,p,d,m]:[c,m,p,d],h=new Do(f,s,i);return e.runWebGLProgram(h,[n],n.dtype)}var Pu={kernelName:Na,backendName:"webgl",kernelFunc:$h};vS();var ut=class{constructor(t,e=false,r=null,n=false,s=false){this.variableNames=["x","W"],this.customUniforms=[{name:"pads",type:"ivec2"},{name:"strides",type:"ivec2"},{name:"dilations",type:"ivec2"},{name:"inDims",type:"ivec2"}],this.outputShape=t.outShape,this.enableShapeUniforms=L(this.outputShape.length);let i=t.filterHeight,c=t.filterWidth,a=t.outChannels/t.inChannels,l="",u="";r&&(n?l=`float activation(float a) {
          float b = getPreluActivationWeightsAtOutCoords();
          ${r}
        }`:s?l=`float activation(float a) {
          float b = getLeakyreluAlphaAtOutCoords();
          ${r}
        }`:l=`
          float activation(float x) {
            ${r}
          }
        `,u="result = activation(result);");let p=e?"result += getBiasAtOutCoords();":"";e&&this.variableNames.push("bias"),n&&this.variableNames.push("preluActivationWeights"),s&&this.variableNames.push("leakyreluAlpha"),this.userCode=`
      ${l}

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords.x;
        ivec2 xRCCorner = coords.yz * strides - pads;
        int d2 = coords.w;
        int d1 = d2 / ${a};
        int q = d2 - d1 * ${a};

        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        // Convolve x(?, ?, d1) with w(:, :, d1, q) to get y(yR, yC, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        // TO DO(dsmilkov): Flatten the two for loops and vec4 the operations.
        for (int wR = 0; wR < ${i}; wR++) {
          int xR = xRCorner + wR * dilations[0];

          if (xR < 0 || xR >= inDims[0]) {
            continue;
          }

          for (int wC = 0; wC < ${c}; wC++) {
            int xC = xCCorner + wC * dilations[1];

            if (xC < 0 || xC >= inDims[1]) {
              continue;
            }

            float xVal = getX(batch, xR, xC, d1);
            float wVal = getW(wR, wC, d1, q);
            dotProd += xVal * wVal;
          }
        }

        float result = dotProd;
        ${p}
        ${u}
        setOutput(result);
      }
    `;}};vS();var pt=class{constructor(t,e=false,r=null,n=false,s=false){this.variableNames=["x","W"],this.packedInputs=true,this.packedOutput=true,this.customUniforms=[{name:"pads",type:"ivec2"},{name:"strides",type:"ivec2"},{name:"dilations",type:"ivec2"},{name:"inDims",type:"ivec2"}],this.outputShape=t.outShape,this.enableShapeUniforms=L(this.outputShape.length);let i=t.outChannels/t.inChannels,c=t.padInfo.left,a=t.strideWidth,l=t.dilationWidth,u=t.filterHeight,p=t.filterWidth,d=p,m=`
      int xR; int xC; int xCOffset;
      vec4 wTexel; vec4 previous; vec4 final;`;for(let x=0;x<p;x++)m+=`
          vec4 xTexelC${x*2};
          int xTexelC${x*2}Ready;
          vec4 xTexelC${x*2+1};
          int xTexelC${x*2+1}Ready;
          vec4 xC${x};`;m+=`
    for (int r = 0; r < ${u}; r++) {
      `;for(let x=0;x<p;x++)m+=`
          xTexelC${x*2} = vec4(0.0);
          xTexelC${x*2}Ready = 0;
          xTexelC${x*2+1} = vec4(0.0);
          xTexelC${x*2+1}Ready = 0;
          xC${x} = vec4(0.0);`;m+=`
        xR = xRCorner + r * dilations[0];
        if (xR >=0 && xR < inDims[0]) {
      `;for(let x=0;x<(d+1)/2;x++){let C=x*2;if(m+=`
          xC = xCCorner + ${C*l};
          `,a===1){if(C<p&&(c%2===1?(m+=`
                xCOffset = xC + 1;
                if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${C}Ready == 0) {
                  xTexelC${C} = getX(batch, xR, xCOffset, d1);

                  // Need to manually clear unused channels in case
                  // we're reading from recycled texture.
                  if (xCOffset + 1 >= inDims[1]) {
                    xTexelC${C}.zw = vec2(0.0);
                  }
                  xTexelC${C}Ready = 1;
                }
              `,l===1&&C>0?m+=`
                xC${C} = vec4(xTexelC${C-2}.zw, xTexelC${C}.xy);
                `:m+=`
                  xCOffset = xC + 1 - 2;

                  if (xCOffset >= 0 && xCOffset < inDims[1]) {
                    previous = getX(batch, xR, xCOffset, d1);

                    // Need to manually clear unused channels in case
                    // we're reading from recycled texture.
                    if (xCOffset + 1 >= inDims[1]) {
                      previous.zw = vec2(0.0);
                    }

                    xC${C} = vec4(previous.zw, xTexelC${C}.xy);
                  } else {
                    xC${C} = vec4(0.0, 0.0, xTexelC${C}.xy);
                  }
                  `):m+=`
                if (xC >= 0 && xC < inDims[1] && xTexelC${C}Ready == 0) {
                  xTexelC${C} = getX(batch, xR, xC, d1);
                  if (xC + 1 >= inDims[1]) {
                    xTexelC${C}.zw = vec2(0.0);
                  }
                  xTexelC${C}Ready = 1;
                }

                xC${C} = xTexelC${C};
                `,C+1<p)){let y=c%2===0?R.nearestLargerEven(l):l;l%2===0&&c%2===1||l%2!==0&&c%2!==1?(m+=`
                  xCOffset = xC + imod(pads[1], 2) + ${y};

                  if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${C+1}Ready == 0) {
                    xTexelC${C+1} = getX(batch, xR, xCOffset, d1);

                    // Need to manually clear unused channels in case
                    // we're reading from recycled texture.
                    if (xCOffset + 1 >= inDims[1]) {
                      xTexelC${C+1}.zw = vec2(0.0);
                    }
                    xTexelC${C+1}Ready = 1;
                  }
                  `,l>1?m+=`
                    xCOffset -= 2;
                    if (xCOffset >= 0 && xCOffset < inDims[1]) {
                     previous = getX(batch, xR, xCOffset, d1);
                     xC${C+1} = vec4(previous.zw, xTexelC${C+1}.xy);
                    } else {
                     xC${C+1} = vec4(0.0, 0.0, xTexelC${C+1}.xy);
                    }
                    `:m+=`
                    xC${C+1} = vec4(xTexelC${C}.zw, xTexelC${C+1}.xy);
                    `):y===1?m+=`
                    xC${C+1} = xTexelC${C};
                    `:m+=`
                    xCOffset = xC + ${y};

                    if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${C+1}Ready == 0) {
                      xTexelC${C+1} = getX(batch, xR, xCOffset, d1);
                      if (xCOffset + 1 >= inDims[1]) {
                        xTexelC${C+1}.zw = vec2(0.0);
                      }
                      xTexelC${C+1}Ready = 1;
                    }

                    xC${C+1} = xTexelC${C+1};
                    `;}}else C<p&&(c%2===1?(m+=`
                xCOffset = xC + 1 - strides[1];
                if(xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${C}Ready == 0) {
                  xTexelC${C} = getX(batch, xR, xCOffset, d1);
                  // Need to manually clear unused channels in case
                  // we're reading from recycled texture.
                  if (xCOffset + 1 >= inDims[1]) {
                    xTexelC${C}.zw = vec2(0.0);
                  }
                  xTexelC${C}Ready = 1;
                }

                if(xC + 1 >= 0 && xC + 1 < inDims[1] && xTexelC${C+1}Ready == 0) {
                  xTexelC${C+1} = getX(batch, xR, xC + 1, d1);
                  // Need to manually clear unused channels in case
                  // we're reading from recycled texture.
                  if (xC + 2 >= inDims[1]) {
                    xTexelC${C+1}.zw = vec2(0.0);
                  }
                  xTexelC${C+1}Ready = 1;
                }

                xC${C} = vec4(xTexelC${C}.zw, xTexelC${C+1}.zw);
              `,C+1<p&&(m+=`
                  final = vec4(0.0);
                  xCOffset = xC + 1 + strides[1];
                  if(xCOffset >= 0 && xCOffset < inDims[1]) {
                    final = getX(batch, xR, xCOffset, d1);
                  }
                  xC${C+1} = vec4(xTexelC${C+1}.xy, final.xy);
                `)):(m+=`
                if(xC >= 0 && xC < inDims[1] && xTexelC${C}Ready == 0) {
                  xTexelC${C} = getX(batch, xR, xC, d1);
                  if (xC + 1 >= inDims[1]) {
                    xTexelC${C}.zw = vec2(0.0);
                  }
                  xTexelC${C}Ready = 1;
                }

                xCOffset = xC + strides[1];
                if(xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${C+1}Ready == 0) {
                  xTexelC${C+1} = getX(batch, xR, xCOffset, d1);
                  if (xCOffset + 1 >= inDims[1]) {
                    xTexelC${C+1}.zw = vec2(0.);
                  }
                  xTexelC${C+1}Ready = 1;
                }

                xC${C} = vec4(
                  xTexelC${C}.xy, xTexelC${C+1}.xy);
              `,C+1<p&&(m+=`
                  xC${C+1} = vec4(xTexelC${C}.zw, xTexelC${C+1}.zw);
                `)));C<p&&(m+=`
            wTexel = getW(r, ${C}, d1, q);
            dotProd += xC${C} * vec4(wTexel.xz, wTexel.xz);
          `,C+1<p&&(m+=`
              wTexel = getW(r, ${C+1}, d1, q);
              dotProd += xC${C+1} * vec4(wTexel.xz, wTexel.xz);
            `));}m+=`
    }
  `,m+=`
      }
    `;let f="",h="";r&&(n?f=`vec4 activation(vec4 a) {
          vec4 b = getPreluActivationWeightsAtOutCoords();
          ${r}
        }`:s?f=`vec4 activation(vec4 a) {
          vec4 b = getLeakyreluAlphaAtOutCoords();
          ${r}
        }`:f=`vec4 activation(vec4 x) {
          ${r}
        }`,h="result = activation(result);");let g=e?"result += getBiasAtOutCoords();":"";e&&this.variableNames.push("bias"),n&&this.variableNames.push("preluActivationWeights"),s&&this.variableNames.push("leakyreluAlpha"),this.userCode=`
      ${f}

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords.x;
        ivec2 xRCCorner = coords.yz * strides - pads;
        int d2 = coords.w;
        int d1 = d2 / ${i};
        int q = d2 - d1 * ${i};
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        //intialize dotProd with a small epsilon seems to reduce GPU accuracy loss.
        vec4 dotProd = vec4(0.000000000000001);

        ${m}

        vec4 result = dotProd - vec4(0.000000000000001);
        ${g}
        ${h}
        setOutput(result);
      }
    `;}};function Sh(o){let{inputs:t,backend:e,attrs:r}=o,{x:n,filter:s}=t,{strides:i,pad:c,dilations:a,dimRoundingMode:l}=r,u=a;u==null&&(u=[1,1]),R.assert(kp$1.eitherStridesOrDilationsAreOne(i,u),()=>`Error in depthwiseConv2d: Either strides or dilations must be 1. Got strides ${i} and dilations '${u}'`);let p=kp$1.computeConv2DInfo(n.shape,s.shape,i,u,c,l,true),d;O$1().getBool("WEBGL_PACK_DEPTHWISECONV")&&p.strideWidth<=2&&p.outChannels/p.inChannels===1?d=new pt(p):d=new ut(p);let m=[[p.padInfo.top,p.padInfo.left],[p.strideHeight,p.strideWidth],[p.dilationHeight,p.dilationWidth],[p.inHeight,p.inWidth]];return e.runWebGLProgram(d,[n,s],"float32",m)}var Ou={kernelName:Ia,backendName:"webgl",kernelFunc:Sh};vS();var Po=class{constructor(t){this.variableNames=["x","dy"],this.outputShape=t.filterShape;let e=t.strideHeight,r=t.strideWidth,n=t.padInfo.top,s=t.padInfo.left,i=t.outChannels/t.inChannels;this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int wR = coords.x;
        int wC = coords.y;
        int d1 = coords.z;
        int dm = coords.w;
        int d2 = d1 * ${i} + dm;

        float dotProd = 0.0;

        // TO DO: Vec4 over the batch size
        for (int b = 0; b < ${t.batchSize}; b++) {
          for (int yR = 0; yR < ${t.outHeight}; yR++) {
            int xR = wR + yR * ${e} - ${n};

            if (xR < 0 || xR >= ${t.inHeight}) {
              continue;
            }

            for (int yC = 0; yC < ${t.outWidth}; yC++) {
              int xC = wC + yC * ${r} - ${s};

              if (xC < 0 || xC >= ${t.inWidth}) {
                continue;
              }

              float dyValue = getDy(b, yR, yC, d2);
              float xValue = getX(b, xR, xC, d1);
              dotProd += (xValue * dyValue);
            }
          }
        }
        setOutput(dotProd);
      }
    `;}},Oo=class{constructor(t){this.variableNames=["dy","W"],this.outputShape=t.inShape;let e=t.filterHeight,r=t.filterWidth,n=t.strideHeight,s=t.strideWidth,i=e-1-t.padInfo.top,c=r-1-t.padInfo.left,a=t.outChannels/t.inChannels;this.userCode=`
      const ivec2 pads = ivec2(${i}, ${c});

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d1 = coords[3];
        ivec2 dyCorner = coords.yz - pads;
        int dyRCorner = dyCorner.x;
        int dyCCorner = dyCorner.y;

        float dotProd = 0.0;

        for (int wR = 0; wR < ${e}; wR++) {
          float dyR = float(dyRCorner + wR) / ${n}.0;

          if (dyR < 0.0 || dyR >= ${t.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          int wRPerm = ${e} - 1 - wR;

          for (int wC = 0; wC < ${r}; wC++) {
            float dyC = float(dyCCorner + wC) / ${s}.0;

            if (dyC < 0.0 || dyC >= ${t.outWidth}.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            int wCPerm = ${r} - 1 - wC;

            // TO DO: Vec4 over the channelMul
            for (int dm = 0; dm < ${a}; dm++) {
              int d2 = d1 * ${a} + dm;
              float xValue = getDy(batch, idyR, idyC, d2);
              float wValue = getW(wRPerm, wCPerm, d1, dm);
              dotProd += xValue * wValue;
            }
          }
        }
        setOutput(dotProd);
      }
    `;}};function yh(o){let{inputs:t,backend:e,attrs:r}=o,{x:n,dy:s}=t,{strides:i,dilations:c,pad:a,dimRoundingMode:l,filterShape:u}=r,p=kp$1.computeConv2DInfo(n.shape,u,i,c,a,l,true),d=new Po(p);return e.runWebGLProgram(d,[n,s],"float32")}var Lu={kernelName:Aa,backendName:"webgl",kernelFunc:yh};vS();function Rh(o){let{inputs:t,backend:e,attrs:r}=o,{dy:n,filter:s}=t,{strides:i,dilations:c,pad:a,dimRoundingMode:l,inputShape:u}=r,p=kp$1.computeConv2DInfo(u,s.shape,i,c,a,l,true),d=new Oo(p);return e.runWebGLProgram(d,[n,s],"float32")}var Bu={kernelName:Da,backendName:"webgl",kernelFunc:Rh};vS();var Lo=class{constructor(t){this.variableNames=["X"],this.outputShape=[t,t],this.userCode=`
      void main() {
          ivec2 coords = getOutputCoords();
          float val = coords[0] == coords[1] ? getX(coords[0]) : 0.0;
          setOutput(val);
      }
    `;}};function Th(o){let{inputs:t,backend:e}=o,{x:r}=t,n=[...r.shape,...r.shape],s=R.sizeFromShape(r.shape),i=T({inputs:{x:r},backend:e,attrs:{shape:[s]}}),c=new Lo(s),a=e.runWebGLProgram(c,[i],i.dtype),l=T({inputs:{x:a},backend:e,attrs:{shape:n}});return e.disposeIntermediateTensorInfo(i),e.disposeIntermediateTensorInfo(a),l}var Uu={kernelName:Ma,backendName:"webgl",kernelFunc:Th};vS();var Bo=class{constructor(t){this.variableNames=["x","W"],this.outputShape=t.outShape;let{inHeight:e,inWidth:r,padInfo:n,strideHeight:s,strideWidth:i,filterHeight:c,filterWidth:a,dilationHeight:l,dilationWidth:u}=t,{top:p,left:d}=n;this.userCode=`
      const ivec2 strides = ivec2(${s}, ${i});
      const ivec2 pads = ivec2(${p}, ${d});
      const float neg_infinity = -3.4e38;

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords.x;
        int d1 = coords.w;
        ivec2 outTopLeftCorner =
            coords.yz * strides - pads;
        int hBeg = outTopLeftCorner.x;
        int wBeg = outTopLeftCorner.y;

        float curVal = neg_infinity;
        for (int h = 0; h < ${c}; h++) {
          int hIn = hBeg + h * ${l};

          if (hIn >= 0 && hIn < ${e}) {
            for (int w = 0; w < ${a}; w++) {
              int wIn = wBeg + w * ${u};

              if (wIn >= 0 && wIn < ${r}) {
                float xVal = getX(batch, hIn, wIn, d1);
                float wVal = getW(h, w, d1);

                float val = xVal + wVal;
                if (val > curVal) {
                  curVal = val;
                }
              }
            }
          }
        }

        float result = curVal;
        setOutput(result);
      }
    `;}};function wh(o){let{inputs:t,backend:e,attrs:r}=o,{x:n,filter:s}=t,{strides:i,pad:c,dilations:a}=r,l=kp$1.computeDilation2DInfo(n.shape,s.shape,i,c,"NHWC",a),u,p=new Bo(l);u=e.runWebGLProgram(p,[n,s],"float32");let d=T({inputs:{x:u},backend:e,attrs:{shape:l.outShape}});return e.disposeIntermediateTensorInfo(u),d}var Vu={kernelName:_a,backendName:"webgl",kernelFunc:wh};vS();function Ih(o){let{inputs:t,backend:e,attrs:r}=o,{equation:n}=r,s=t,{allDims:i,summedDims:c,idDims:a}=kp$1.decodeEinsumEquation(n,s.length);kp$1.checkEinsumDimSizes(i.length,a,s);let{path:l,steps:u}=kp$1.getEinsumComputePath(c,a),p=u.length,d=null,m=i.length,f=[];for(let h=0;h<p;++h){for(let g of u[h]){let{permutationIndices:x,expandDims:C}=kp$1.getEinsumPermutation(m,a[g]),y;kp$1.isIdentityPermutation(x)?y=s[g]:(y=B({inputs:{x:s[g]},backend:e,attrs:{perm:x}}),f.push(y));let R$1=y.shape.slice();for(let w=0;w<C.length;++w)R$1.splice(C[w],0,1);R.arraysEqual(y.shape,R$1)||(y=T({inputs:{x:y},backend:e,attrs:{shape:R$1}}),f.push(y)),d===null?d=y:(d=$t({inputs:{a:y,b:d},backend:e}),f.push(d));}h<p-1&&(l[h]>=0&&(d=Ue({inputs:{x:d},backend:e,attrs:{axis:l[h]-(i.length-m),keepDims:false}}),f.push(d)),m--);}for(let h of f)h!==d&&e.disposeIntermediateTensorInfo(h);return d}var Wu={kernelName:Ra,backendName:"webgl",kernelFunc:Ih};vS();var Nh="return (x >= 0.0) ? x : (exp(x) - 1.0);",Eh=`
  vec4 result;

  result.r = (x.r >= 0.0) ? x.r : (exp(x.r) - 1.0);
  result.g = (x.g >= 0.0) ? x.g : (exp(x.g) - 1.0);
  result.b = (x.b >= 0.0) ? x.b : (exp(x.b) - 1.0);
  result.a = (x.a >= 0.0) ? x.a : (exp(x.a) - 1.0);

  return result;
`,kh=N({opSnippet:Nh,packedOpSnippet:Eh}),Mu={kernelName:"Elu",backendName:"webgl",kernelFunc:kh};vS();var _h="return (b >= 0.0) ? a : a * (b + 1.0);",Ah=`
  vec4 bGTEZero = vec4(greaterThanEqual(b, vec4(0.)));
  return (bGTEZero * a) + ((vec4(1.0) - bGTEZero) * (a * (b + vec4(1.0))));
`,Fh=o=>{let{inputs:t,backend:e}=o,{dy:r,y:n}=t,s=O$1().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new te(Ah,r.shape,n.shape):new Y(_h,r.shape,n.shape);return e.runWebGLProgram(s,[r,n],r.dtype)},Gu={kernelName:a0,backendName:"webgl",kernelFunc:Fh};vS();var Dh=`
  return vec4(equal(a, b));
`,Ph="return float(a == b);",Oh=O({opSnippet:Ph,packedOpSnippet:Dh,dtype:"bool",cpuKernelImpl:Sc}),zu={kernelName:Ba,backendName:"webgl",kernelFunc:Oh};vS();var Lh=`
  // Error function is calculated approximately with elementary function.
  // See "Handbook of Mathematical Functions with Formulas,
  // Graphs, and Mathematical Tables", Abramowitz and Stegun.
  float p = ${kp$1.ERF_P};
  float a1 = ${kp$1.ERF_A1};
  float a2 = ${kp$1.ERF_A2};
  float a3 = ${kp$1.ERF_A3};
  float a4 = ${kp$1.ERF_A4};
  float a5 = ${kp$1.ERF_A5};

  float sign = sign(x);
  x = abs(x);
  float t = 1.0 / (1.0 + p * x);
  return sign * (1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*exp(-x*x));
`,Bh=N({opSnippet:Lh}),Hu={kernelName:"Erf",backendName:"webgl",kernelFunc:Bh};vS();var Uh=ie+`
  return exp(x);
`,Vh=`
  vec4 result = exp(x);
  bvec4 isNaN = isnan(x);
  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,Tn=N({opSnippet:Uh,packedOpSnippet:Vh,cpuKernelImpl:yc,dtype:"float32"}),Xu={kernelName:"Exp",backendName:"webgl",kernelFunc:Tn};vS();function Uo(o){let{inputs:t,attrs:e,backend:r}=o,{dim:n}=e,{input:s}=t,i=s.shape.length,c=s.shape.slice(),a=n;return n<0&&(R.assert(-(i+1)<=n,()=>`Axis must be in the interval [${-(i+1)}, ${i}]`),a=i+n+1),c.splice(a,0,1),T({inputs:{x:s},backend:r,attrs:{shape:c}})}var Ku={kernelName:Ga,backendName:"webgl",kernelFunc:Uo};vS();var qu="return exp(x) - 1.0;",Wh=N({opSnippet:qu,packedOpSnippet:qu,cpuKernelImpl:Rc}),ju={kernelName:Ca,backendName:"webgl",kernelFunc:Wh};vS();vS();var Rt=class{constructor(t,e,r){this.variableNames=["real","imag"];let n=e[1];this.outputShape=e;let s=r?`2.0 * ${Math.PI}`:`-2.0 * ${Math.PI}`,i=r?`${n}.0`:"1.0",c;if(t==="real")c="return real * expR - imag * expI;";else if(t==="imag")c="return real * expI + imag * expR;";else throw new Error(`FFT component must be either "real" or "imag", got ${t}.`);this.userCode=`
      const float exponentMultiplier = ${s};

      float unaryOpComplex(float real, float expR, float imag, float expI) {
        ${c}
      }

      float mulMatDFT(int batch, int index) {
        float indexRatio = float(index) / float(${n});
        float exponentMultiplierTimesIndexRatio =
            exponentMultiplier * indexRatio;

        float result = 0.0;

        for (int i = 0; i < ${n}; i++) {
          // x = (-2|2 * PI / N) * index * i;
          float x = exponentMultiplierTimesIndexRatio * float(i);
          float expR = cos(x);
          float expI = sin(x);
          float real = getReal(batch, i);
          float imag = getImag(batch, i);

          result +=
              unaryOpComplex(real, expR, imag, expI) / ${i};
        }

        return result;
      }

      void main() {
        ivec2 coords = getOutputCoords();
        setOutput(mulMatDFT(coords[0], coords[1]));
      }
    `;}};function Vo(o,t,e){let r=e.texData.get(o.dataId),n=R.sizeFromShape(o.shape),s=o.shape[o.shape.length-1],i=n/s,c=T({inputs:{x:o},backend:e,attrs:{shape:[i,s]}}),a=c.shape,l=new Rt("real",a,t),u=new Rt("imag",a,t),p=[{dataId:r.complexTensorInfos.real.dataId,dtype:r.complexTensorInfos.real.dtype,shape:a},{dataId:r.complexTensorInfos.imag.dataId,dtype:r.complexTensorInfos.imag.dtype,shape:a}],d=e.runWebGLProgram(l,p,"float32"),m=e.runWebGLProgram(u,p,"float32"),f=Q({inputs:{real:d,imag:m},backend:e});e.disposeIntermediateTensorInfo(d),e.disposeIntermediateTensorInfo(m);let h=T({inputs:{x:f},backend:e,attrs:{shape:o.shape}});return e.disposeIntermediateTensorInfo(c),e.disposeIntermediateTensorInfo(f),h}function Mh(o){let{inputs:t,backend:e}=o,{input:r}=t;return Vo(r,false,e)}var Yu={kernelName:"FFT",backendName:"webgl",kernelFunc:Mh};vS();var Wo=class{constructor(t,e){this.outputShape=[],this.customUniforms=[{name:"value",type:"float"}],this.variableNames=["x"],this.outputShape=t,this.userCode=`
      void main() {
        // Input can be obtained from uniform value.
        setOutput(value);
      }
    `;}};function Se(o){let{backend:t,attrs:e}=o,{shape:r,value:n}=e,{dtype:s}=e;if(s=s||R.inferDtype(n),s==="string"){let i=R.getArrayFromDType(s,R.sizeFromShape(r));return i.fill(n),t.makeTensorInfo(r,s,i)}else {let i=new Wo(r,n),c=[[n]];return t.runWebGLProgram(i,[],s,c)}}var Qu={kernelName:Oa,backendName:"webgl",kernelFunc:Se};vS();var Mo=class{constructor(t){this.variableNames=["Image"],this.outputShape=[];let e=t[2];this.outputShape=t,this.userCode=`
        void main() {
          ivec4 coords = getOutputCoords();
          int x = coords[2];

          int coordX = ${e} - x - 1;
          float outputValue;
          if(coordX >= 0 && coordX < ${e}) {
            outputValue = getImage(coords[0], coords[1], coordX, coords[3]);
          } else {
            outputValue = getImage(coords[0], coords[1], coords[2], coords[3]);
          }
          setOutput(outputValue);
        }
    `;}};var Zu={kernelName:Pa,backendName:"webgl",kernelFunc:({inputs:o,backend:t})=>{let{image:e}=o,r=t,n=new Mo(e.shape);return r.runWebGLProgram(n,[e],e.dtype)}};vS();var Ju="return floor(x);",Gh=N({opSnippet:Ju,packedOpSnippet:Ju,cpuKernelImpl:Tc}),ep={kernelName:La,backendName:"webgl",kernelFunc:Gh};vS();var zh=`
  float s = sign(a) * sign(b);
  int ia = round(a);
  int ib = round(b);
  if (ib != 0) {
    // Windows (D3D) wants guaranteed non-zero int division at compile-time.
    return float(idiv(ia, ib, s));
  } else {
    return NAN;
  }
`,Hh=`
  ivec4 ia = round(a);
  ivec4 ib = round(b);
  bvec4 cond = notEqual(ib, ivec4(0));
  ivec4 result = ivec4(0);
  vec4 s = sign(a) * sign(b);

  // Windows (D3D) wants guaranteed non-zero int division at compile-time.
  if (cond[0]) {
    result[0] = idiv(ia[0], ib[0], s[0]);
  }
  if (cond[1]) {
    result[1] = idiv(ia[1], ib[1], s[1]);
  }
  if (cond[2]) {
    result[2] = idiv(ia[2], ib[2], s[2]);
  }
  if (cond[3]) {
    result[3] = idiv(ia[3], ib[3], s[3]);
  }
  return vec4(result);
`,Xh=O({opSnippet:zh,packedOpSnippet:Hh,dtype:"int32"}),tp={kernelName:Wa,backendName:"webgl",kernelFunc:Xh};vS();vS();var Go=class{constructor(t){this.variableNames=["A"];let e=U(),[r,n]=t;this.outputShape=t,this.userCode=`
      void main() {
        ivec3 coords = getOutputCoords();
        int texR = coords[0];
        int texC = coords[1];
        int depth = coords[2];
        vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${n}.0, ${r}.0);

        vec4 values = ${e.texture2D}(A, uv);
        float value;
        if (depth == 0) {
          value = values.r;
        } else if (depth == 1) {
          value = values.g;
        } else if (depth == 2) {
          value = values.b;
        } else if (depth == 3) {
          value = values.a;
        }

        setOutput(floor(value * 255.0 + 0.5));
      }
    `;}};var zo=class{constructor(t){this.variableNames=["A"],this.packedInputs=false,this.packedOutput=true;let e=U(),[r,n]=t;this.outputShape=t,this.userCode=`
      void main() {
        ivec3 coords = getOutputCoords();
        int texR = coords[0];
        int texC = coords[1];
        int depth = coords[2];

        vec4 result = vec4(0.);

        for(int row=0; row<=1; row++) {
          for(int col=0; col<=1; col++) {
            texC = coords[1] + row;
            depth = coords[2] + col;

            vec2 uv = (vec2(texC, texR) + halfCR) /
                       vec2(${n}.0, ${r}.0);
            vec4 values = ${e.texture2D}(A, uv);
            float value;
            if (depth == 0) {
              value = values.r;
            } else if (depth == 1) {
              value = values.g;
            } else if (depth == 2) {
              value = values.b;
            } else if (depth == 3) {
              value = values.a;
            }

            result[row * 2 + col] = floor(value * 255.0 + 0.5);
          }
        }

        ${e.output} = result;
      }
    `;}};var op={kernelName:Xn,backendName:"webgl",kernelFunc:Kh},dt,wn=O$1().getBool("CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU");function Kh(o){let{inputs:t,backend:e,attrs:r}=o,{pixels:n}=t,{numChannels:s}=r,i=typeof HTMLVideoElement<"u"&&n instanceof HTMLVideoElement,c=typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement,[a,l]=i?[n.videoWidth,n.videoHeight]:[n.width,n.height],u=[l,a],p=[l,a,s];if(c||i){let h=O$1().getBool("CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU");(dt==null||h!==wn)&&(wn=h,dt=document.createElement("canvas").getContext("2d",{willReadFrequently:wn})),dt.canvas.width=a,dt.canvas.height=l,dt.drawImage(n,0,0,a,l),n=dt.canvas;}let d=e.makeTensorInfo(u,"int32");e.texData.get(d.dataId).usage=K.PIXELS,e.gpgpu.uploadPixelDataToTexture(e.getTexture(d.dataId),n);let m=O$1().getBool("WEBGL_PACK")?new zo(p):new Go(p),f=e.runWebGLProgram(m,[d],"int32");return e.disposeData(d.dataId),f}vS();function qh(o){let{inputs:t,backend:e,attrs:r}=o,{x:n,filter:s,bias:i,preluActivationWeights:c}=t,{strides:a,pad:l,dataFormat:u,dilations:p,dimRoundingMode:d,activation:m,leakyreluAlpha:f}=r,h=kp$1.convertConv2DDataFormat(u),g=kp$1.computeConv2DInfo(n.shape,s.shape,a,p,l,d,false,h),x,C=[],y=i!=null,R$1=c!=null,w=m==="leakyrelu",F=()=>{let E=[n,s],P=(D,M)=>{if(M==="NCHW"&&D.shape.length===1&&D.shape[0]!==1){let G=T({inputs:{x:D},backend:e,attrs:{shape:[D.shape[0],1,1]}});return C.push(G),G}return D};if(y&&E.push(P(i,u)),R$1&&E.push(P(c,u)),w){let D=e.makeTensorInfo([],"float32",R.createScalarValue(f,"float32"));E.push(D),C.push(D);}return E};if(g.filterHeight===1&&g.filterWidth===1&&g.dilationHeight===1&&g.dilationWidth===1&&g.strideHeight===1&&g.strideWidth===1&&(g.padInfo.type==="SAME"||g.padInfo.type==="VALID"))x=To({x:n,filter:s,convInfo:g,backend:e,bias:i,activation:m,preluActivationWeights:c,leakyreluAlpha:f});else if(g.strideWidth<=2&&h==="channelsLast"&&O$1().getBool("WEBGL_EXP_CONV")){let E=m?ve(m,true):null,P=new ct(g,y,E,R$1,w),D=[[g.padInfo.top,g.padInfo.left],[g.strideHeight,g.strideWidth],[g.dilationHeight,g.dilationWidth],[g.inHeight,g.inWidth]],M=F();x=e.runWebGLProgram(P,M,"float32",D);}else if(O$1().getBool("WEBGL_CONV_IM2COL"))x=wo({x:n,filter:s,convInfo:g,backend:e,bias:i,activation:m,preluActivationWeights:c,leakyreluAlpha:f});else {let E=m?ve(m,false):null,P=new at(g,y,E,R$1,w),D=F();x=e.runWebGLProgram(P,D,"float32");}let _=T({inputs:{x},backend:e,attrs:{shape:g.outShape}});return C.push(x),C.forEach(E=>e.disposeIntermediateTensorInfo(E)),_}var rp={kernelName:Zn,backendName:"webgl",kernelFunc:qh};vS();function jh(o){let{inputs:t,backend:e,attrs:r}=o,{x:n,filter:s,bias:i,preluActivationWeights:c}=t,{strides:a,pad:l,dilations:u,dimRoundingMode:p,activation:d,leakyreluAlpha:m}=r,f=[],h=u;h==null&&(h=[1,1]),R.assert(kp$1.eitherStridesOrDilationsAreOne(a,h),()=>`Error in depthwiseConv2d: Either strides or dilations must be 1. Got strides ${a} and dilations '${h}'`);let g=kp$1.computeConv2DInfo(n.shape,s.shape,a,h,l,p,true),x=O$1().getBool("WEBGL_PACK_DEPTHWISECONV")&&g.strideWidth<=2&&g.outChannels/g.inChannels===1,C=d?ve(d,x):null,y=[n,s],R$1=i!=null,w=c!=null,F=d==="leakyrelu";if(R$1&&y.push(i),w&&y.push(c),F){let D=e.makeTensorInfo([],"float32",R.createScalarValue(m,"float32"));y.push(D),f.push(D);}let _;x?_=new pt(g,R$1,C,w,F):_=new ut(g,R$1,C,w,F);let E=[[g.padInfo.top,g.padInfo.left],[g.strideHeight,g.strideWidth],[g.dilationHeight,g.dilationWidth],[g.inHeight,g.inWidth]],P=e.runWebGLProgram(_,y,"float32",E);return f.forEach(D=>e.disposeIntermediateTensorInfo(D)),P}var np={kernelName:Yn,backendName:"webgl",kernelFunc:jh};vS();var Ho=class{constructor(t,e,r,n){this.sliceDim=t,this.strides=e,this.paramsShape=n,this.variableNames=["x","indices"],this.outputShape=r;let s=A(r.length),i=`
    int index;`;for(let c=0;c<this.sliceDim;c++)i+=`
          index = round(getIndices(coords[0], ${c}));
          out_of_bounds = out_of_bounds || index < 0;
          out_of_bounds = out_of_bounds || index >= ${this.paramsShape[c]};
          flattenIndex += index * ${this.strides[c]};`;this.userCode=`
         void main() {
          ${s} coords = getOutputCoords();
          int flattenIndex = 0;
          bool out_of_bounds = false;

          ${i}

          setOutput(out_of_bounds ? 0.0 : getX(flattenIndex, coords[1]));
        }
      `;}};function Yh(o){let{inputs:t,backend:e}=o,{params:r,indices:n}=t,s=n.shape,i=s[s.length-1],c=R.sizeFromShape(r.shape),[a,l,u,p]=kp$1.prepareAndValidate(r,n),d=T({inputs:{x:n},backend:e,attrs:{shape:[l,i]}}),m=T({inputs:{x:r},backend:e,attrs:{shape:[R.sizeFromShape(r.shape)/u,u]}});if(e.shouldExecuteOnCPU([r,n])||r.dtype==="string"){let x=e.readSync(n.dataId),C=e.bufferSync(r),y=wc(x,C,r.dtype,l,i,u,p,r.shape,c);return e.makeTensorInfo(a,r.dtype,y.values)}let f=new Ho(i,p,[l,u],r.shape),h=e.runWebGLProgram(f,[m,d],m.dtype),g=T({inputs:{x:h},backend:e,attrs:{shape:a}});return e.disposeIntermediateTensorInfo(d),e.disposeIntermediateTensorInfo(m),e.disposeIntermediateTensorInfo(h),g}var sp={kernelName:za,backendName:"webgl",kernelFunc:Yh};vS();var Xo=class{constructor(t,e){this.variableNames=["A","indices"],this.outputShape=e,this.rank=e.length;let r=A(this.rank),n=Qh(t);this.userCode=`
      void main() {
        ${r} resRC = getOutputCoords();
        int index = int(getIndices(resRC.x, resRC.z));
        float inBounds = (index >= 0) && (index < ${t[2]}) ? 1.0 : 0.0;
        setOutput(inBounds * getA(${n}));
      }
    `;}};function Qh(o,t){let e=["resRC.x","resRC.y","resRC.z","resRC.w"],r=[];for(let n=0;n<o.length;n++)n===2?r.push("index"):r.push(`${e[n]}`);return r.join()}function In(o){let{inputs:t,backend:e,attrs:r}=o,{x:n,indices:s}=t,{axis:i,batchDims:c}=r,a=R.parseAxisParam(i,n.shape)[0];if(O$1().get("DEBUG")){let C=e.readSync(s.dataId),y=n.shape[a];for(let R$1=0;R$1<C.length;++R$1){let w=C[R$1];R.assert(w<=y-1&&w>=0,()=>`GatherV2: the index value ${w} is not in [0, ${y-1}]`);}}let l=kp$1.segment_util.collectGatherOpShapeInfo(n,s,a,c),u=R.sizeFromShape(s.shape),p=[],d=T({inputs:{x:n},backend:e,attrs:{shape:[l.batchSize,l.outerSize,l.dimSize,l.sliceSize]}}),m=T({inputs:{x:s},backend:e,attrs:{shape:[l.batchSize,u/l.batchSize]}});p.push(d),p.push(m);let f=[l.batchSize,l.outerSize,u/l.batchSize,l.sliceSize];if(e.shouldExecuteOnCPU([n,s])||n.dtype==="string"){let C=e.bufferSync(m),y=e.bufferSync(d),R=Ic(y,C,f);return p.forEach(w=>e.disposeIntermediateTensorInfo(w)),e.makeTensorInfo(l.outputShape,R.dtype,R.values)}let h=new Xo(d.shape,f),g=e.runWebGLProgram(h,[d,m],d.dtype);p.push(g);let x=T({inputs:{x:g},backend:e,attrs:{shape:l.outputShape}});return p.forEach(C=>e.disposeIntermediateTensorInfo(C)),x}var ip={kernelName:Ua,backendName:"webgl",kernelFunc:In};vS();var Zh="return float(a > b);",Jh=`
  return vec4(greaterThan(a, b));
`,ex=O({opSnippet:Zh,packedOpSnippet:Jh,cpuKernelImpl:Nc,dtype:"bool"}),ap={kernelName:Ka,backendName:"webgl",kernelFunc:ex};vS();var tx="return float(a >= b);",ox=`
  return vec4(greaterThanEqual(a, b));
`,rx=O({opSnippet:tx,packedOpSnippet:ox,dtype:"bool",cpuKernelImpl:Ec}),cp={kernelName:Va,backendName:"webgl",kernelFunc:rx};vS();function nx(o){let{inputs:t,backend:e}=o,{input:r}=t;return Vo(r,true,e)}var lp={kernelName:Ha,backendName:"webgl",kernelFunc:nx};vS();var sx="return float(!isnan(x) && !isinf(x));",ix=N({opSnippet:sx,dtype:"bool"}),up={kernelName:Xa,backendName:"webgl",kernelFunc:ix};vS();var ax="return float(isinf(x));",cx=N({opSnippet:ax,dtype:"bool"}),pp={kernelName:Ja,backendName:"webgl",kernelFunc:cx};vS();var lx="return float(isnan(x));",ux=N({opSnippet:lx,dtype:"bool"}),dp={kernelName:Za,backendName:"webgl",kernelFunc:ux};vS();var px="return float(a < b);",dx=`
  return vec4(lessThan(a, b));
`,mx=O({opSnippet:px,packedOpSnippet:dx,cpuKernelImpl:kc,dtype:"bool"}),mp={kernelName:Qa,backendName:"webgl",kernelFunc:mx};vS();var fx="return float(a <= b);",hx=`
  return vec4(lessThanEqual(a, b));
`,xx=O({opSnippet:fx,packedOpSnippet:hx,cpuKernelImpl:_c,dtype:"bool"}),fp={kernelName:tc$1,backendName:"webgl",kernelFunc:xx};vS();function gx(o){let{backend:t,attrs:e}=o,{start:r,stop:n,num:s}=e,i=Ac(r,n,s);return t.makeTensorInfo([i.length],"float32",i)}var hp={kernelName:ec,backendName:"webgl",kernelFunc:gx};vS();var Cx=ie+`
  return x < 0.0 ? 0./0. : log(x);
`,bx=`
  vec4 result = log(x);
  bvec4 isNaN = isnan(x);
  result.r = isNaN.r ? x.r : (x.r < 0.0 ? 0./0. : result.r);
  result.g = isNaN.g ? x.g : (x.g < 0.0 ? 0./0. : result.g);
  result.b = isNaN.b ? x.b : (x.b < 0.0 ? 0./0. : result.b);
  result.a = isNaN.a ? x.a : (x.a < 0.0 ? 0./0. : result.a);
  return result;
`,vx=N({opSnippet:Cx,packedOpSnippet:bx,cpuKernelImpl:Fc}),xp={kernelName:"Log",backendName:"webgl",kernelFunc:vx};vS();var $x=ie+`
  return log(1.0 + x);
`,Sx=N({opSnippet:$x}),gp={kernelName:rc$1,backendName:"webgl",kernelFunc:Sx};vS();var yx="return float(a >= 1.0 && b >= 1.0);",Rx=`
  return vec4(
    vec4(greaterThanEqual(a, vec4(1.0))) *
    vec4(greaterThanEqual(b, vec4(1.0))));
`,Tx=O({opSnippet:yx,packedOpSnippet:Rx,dtype:"bool"}),Cp={kernelName:oc$1,backendName:"webgl",kernelFunc:Tx};vS();var wx="return float(!(x >= 1.0));",Ix=N({opSnippet:wx}),bp={kernelName:nc$1,backendName:"webgl",kernelFunc:Ix};vS();var Nx="return float(a >= 1.0 || b >= 1.0);",Ex=`
  return min(
    vec4(greaterThanEqual(a, vec4(1.0))) +
    vec4(greaterThanEqual(b, vec4(1.0))),
    vec4(1.0));
`,kx=O({opSnippet:Nx,packedOpSnippet:Ex,dtype:"bool"}),vp={kernelName:sc$1,backendName:"webgl",kernelFunc:kx};vS();var Ko=class{constructor(t,e,r,n,s){this.variableNames=["x"],this.outputShape=[];let i=e,c=t[3]-1;this.outputShape=t;let a,l=`float(${r}) + float(${n}) * sum`;s===.5?a=`inversesqrt(${l})`:s===1?a=`1.0/(${l})`:a=`exp(log(${l}) * float(-${s}));`,this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int r = coords[1];
        int c = coords[2];
        int d = coords[3];
        float x = getX(b, r, c, d);
        float sum = 0.0;
        for (int j = -${i}; j <= ${i}; j++) {
          int idx = d + j;
          if (idx >= 0 && idx <=  ${c}) {
            float z = getX(b, r, c, idx);
            sum += z * z;
          }
        }
        float val = x * ${a};
        setOutput(val);
      }
    `;}};var qo=class{constructor(t,e,r,n,s){this.variableNames=["x"],this.outputShape=[],this.packedInputs=true,this.packedOutput=true;let i=e,c=t[3]-1;this.outputShape=t;let a,l=`float(${r}) + float(${n}) * sum`;s===.5?a=`inversesqrt(${l})`:s===1?a=`1.0/(${l})`:a=`exp(log(${l}) * float(-${s}));`,this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords.x;
        int r = coords.y;
        int c = coords.z;
        int d = coords.w;

        bool hasNextCol = d < ${this.outputShape[3]};
        bool hasNextRow = c < ${this.outputShape[2]};

        vec4 sum = vec4(0.);
        vec4 xFragAtOutputCoords = getX(b, r, c, d);

        vec4 xAtOutputCoords = vec4(
          getChannel(xFragAtOutputCoords, vec2(c, d)),
          hasNextCol ?
            getChannel(xFragAtOutputCoords, vec2(c, d + 1)) : 0.0,
          hasNextRow ?
            getChannel(xFragAtOutputCoords , vec2(c + 1, d)) : 0.0,
          (hasNextRow && hasNextCol) ?
            getChannel(xFragAtOutputCoords, vec2(c + 1, d + 1)) : 0.0
        );

        int firstChannel = d - ${i};
        vec2 cache = vec2(0.);
        if(firstChannel >= 0){
          vec4 firstChannelFrag = getX(b, r, c, firstChannel);
          cache.x = getChannel(firstChannelFrag, vec2(c, firstChannel));
            if(hasNextRow){
              cache.y = getChannel(firstChannelFrag, vec2(c + 1, firstChannel));
            }
        }

        ivec2 depth = ivec2(d, d + 1);
        for (int j = - ${i}; j <= ${i}; j++) {
          ivec2 idx = depth + j;
          bvec2 aboveLowerBound = greaterThanEqual(idx, ivec2(0));
          bvec2 belowUpperBound = lessThanEqual(idx, ivec2(${c}));

          bool depthInRange = aboveLowerBound.x && belowUpperBound.x;
          bool depthPlusOneInRange = aboveLowerBound.y && belowUpperBound.y;

          if(depthInRange || depthPlusOneInRange){
            vec4 z = vec4(0.);
            vec4 xFragAtCurrentDepth;
            z.xz = cache.xy;
            if(depthPlusOneInRange && hasNextCol){
              xFragAtCurrentDepth = idx.y != d ?
                getX(b, r, c, idx.y) : xFragAtOutputCoords;
              z.y = getChannel(xFragAtCurrentDepth, vec2(c, idx.y));
              if(hasNextRow){
                z.w = getChannel(xFragAtCurrentDepth, vec2(c + 1, idx.y));
              }
            }
            cache.xy = z.yw;
            sum += z * z;
          }
        }
        vec4 result = xAtOutputCoords * ${a};
        setOutput(result);
      }
    `;}};var _x=o=>{let{inputs:t,backend:e,attrs:r}=o,{x:n}=t,{depthRadius:s,bias:i,alpha:c,beta:a}=r,l=O$1().getBool("WEBGL_PACK_NORMALIZATION")?new qo(n.shape,s,i,c,a):new Ko(n.shape,s,i,c,a);return e.runWebGLProgram(l,[n],n.dtype)},$p={kernelName:"LRN",backendName:"webgl",kernelFunc:_x};vS();var jo=class{constructor(t,e,r,n,s){this.variableNames=["inputImage","outputImage","dy"],this.outputShape=[],this.outputShape=t,this.depth=t[3],this.depthRadius=e,this.bias=r,this.alpha=n,this.beta=s,this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int r = coords[1];
        int c = coords[2];

        float result = 0.0;
        for (int d = 0; d < ${this.depth}; ++d) {
          int depthBegin = int(max(0.0, float(d - ${e})));
          int depthEnd = int(min(float(${this.depth}),
              float(d + ${e} + 1)));

          const int MIN_DEPTH_BEGIN = 0;
          const int MAX_DEPTH_END = ${this.depth};

          float norm = 0.0;
          for (int k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; ++k) {
            if (k < depthBegin){
              continue;
            }
            else if (k >= depthBegin && k < depthEnd) {
              norm += getInputImage(b, r, c, k) * getInputImage(b, r, c, k);
            }
            else {
              break;
            }
          }

          norm = float(${n}) * norm + float(${r});

          for(int k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; ++k){
            if (k < depthBegin){
              continue;
            }
            else if (k >= depthBegin && k < depthEnd){
              float dyi = -2.0 * float(${n})
                * float(${s})
                * getInputImage(b, r, c, k) * getOutputImage(b, r, c, d)
                / norm;
              if (k == d) {
                dyi += pow(norm, -1.0 * ${s});
              }
              if (k == coords[3]) {
                dyi *= getDy(b, r, c, d);
                result += dyi;
              }
            }
            else {
              break;
            }
          }
      }
      setOutput(result);
      }
    `;}};var Ax=o=>{let{inputs:t,backend:e,attrs:r}=o,{x:n,y:s,dy:i}=t,{depthRadius:c,bias:a,alpha:l,beta:u}=r,p=new jo(n.shape,c,a,l,u);return e.runWebGLProgram(p,[n,s,i],n.dtype)},Sp={kernelName:p0,backendName:"webgl",kernelFunc:Ax};vS();vS();vS();function yp(o,t,e,r){let n=R.sizeFromShape(t),i=R.sizeFromShape(o.shape)/n,c=T({inputs:{x:o},attrs:{shape:[i,n]},backend:r}),a=re(c,o.dtype,"max",r),l=T({inputs:{x:a},attrs:{shape:e},backend:r});return r.disposeIntermediateTensorInfo(c),r.disposeIntermediateTensorInfo(a),l}function Nn(o){let{inputs:t,backend:e,attrs:r}=o,{x:n}=t,{reductionIndices:s,keepDims:i}=r,c=n.shape.length,a=R.parseAxisParam(s,n.shape),l=a,u=kp$1.getAxesPermutation(l,c),p=u!=null,d=e.shouldExecuteOnCPU([n]),m=n;if(p){if(d){let y=e.texData.get(m.dataId).values,R=new Array(c);for(let _=0;_<R.length;_++)R[_]=n.shape[u[_]];let w=Be(y,n.shape,n.dtype,u,R);m=e.makeTensorInfo(R,n.dtype);let F=e.texData.get(m.dataId);F.values=w;}else m=Ne(n,u,e);l=kp$1.getInnerMostAxes(l.length,c);}kp$1.assertAxesAreInnerMostDims("max",l,c);let[f,h]=kp$1.computeOutAndReduceShapes(m.shape,l),g=f;i&&(g=kp$1.expandShapeToKeepDim(f,a));let x;if(d){let y=e.texData.get(m.dataId).values,R$1=Dc(y,R.sizeFromShape(h),g,n.dtype);x=e.makeTensorInfo(g,n.dtype);let w=e.texData.get(x.dataId);w.values=R$1;}else x=yp(m,h,g,e);return p&&e.disposeIntermediateTensorInfo(m),x}var Rp={kernelName:"Max",backendName:"webgl",kernelFunc:Nn};vS();var Fx=nt+`
  return max(a, b);
`,Dx=`
  vec4 result = vec4(max(a, b));
  bvec4 isNaNA = isnan(a);
  bvec4 isNaNB = isnan(b);
  bvec4 isNaN = bvec4(isNaNA.x || isNaNB.x, isNaNA.y || isNaNB.y, isNaNA.z || isNaNB.z, isNaNA.w || isNaNB.w);
  `+oe+`
  return result;
`,Px=O({opSnippet:Fx,packedOpSnippet:Dx,cpuKernelImpl:Pc}),Tp={kernelName:ic$1,backendName:"webgl",kernelFunc:Px};vS();function Ox(o){let{inputs:t,backend:e,attrs:r}=o,{x:n}=t;ce(n,"maxPool");let{filterSize:s,strides:i,pad:c,dimRoundingMode:a}=r,l=1;R.assert(kp$1.eitherStridesOrDilationsAreOne(i,l),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${i} and dilations '${l}'`);let u=kp$1.computePool2DInfo(n.shape,s,i,l,c,a);if(u.filterWidth===1&&u.filterHeight===1&&R.arraysEqual(u.inShape,u.outShape))return W({inputs:{x:n},backend:e});let p=new ue(u,"max",false);return e.runWebGLProgram(p,[n],n.dtype)}var wp={kernelName:ac$1,backendName:"webgl",kernelFunc:Ox};vS();function Lx(o){let{inputs:t,backend:e,attrs:r}=o,{x:n}=t,{filterSize:s,strides:i,pad:c,dataFormat:a,dimRoundingMode:l}=r,u=[1,1,1],p=kp$1.computePool3DInfo(n.shape,s,i,u,c,l,a),d=new Ee(p,"max",false);return e.runWebGLProgram(d,[n],n.dtype)}var Ip={kernelName:cc$1,backendName:"webgl",kernelFunc:Lx};vS();var Yo=class{constructor(t){this.variableNames=["dy","maxPos"],this.outputShape=t.inShape;let e=t.strideHeight,r=t.strideWidth,n=t.dilationHeight,s=t.effectiveFilterHeight,i=t.effectiveFilterWidth,c=s-1-t.padInfo.top,a=i-1-t.padInfo.left,l=s*i-1;this.userCode=`
      const ivec2 pads = ivec2(${c}, ${a});

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];

        ivec2 dyRCCorner = coords.yz - pads;
        int dyRCorner = dyRCCorner.x;
        int dyCCorner = dyRCCorner.y;

        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${s};
          wR += ${n}) {
          float dyR = float(dyRCorner + wR) / ${e}.0;

          if (dyR < 0.0 || dyR >= ${t.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          for (int wC = 0; wC < ${i}; wC++) {
            float dyC = float(dyCCorner + wC) / ${r}.0;

            if (dyC < 0.0 || dyC >= ${t.outWidth}.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            float dyValue = getDy(b, idyR, idyC, d);
            int maxPosValue = ${l} - int(getMaxPos(b, idyR, idyC, d));

            // Get the current value, check it against the value from the
            // position matrix.
            int curPosValue = wR * ${i} + wC;
            float mask = float(maxPosValue == curPosValue ? 1.0 : 0.0);

            dotProd += dyValue * mask;
          }
        }
        setOutput(dotProd);
      }
    `;}},Qo=class{constructor(t){this.variableNames=["dy","maxPos"],this.outputShape=t.inShape;let e=t.strideDepth,r=t.strideHeight,n=t.strideWidth,s=t.dilationDepth,i=t.dilationHeight,c=t.dilationWidth,a=t.effectiveFilterDepth,l=t.effectiveFilterHeight,u=t.effectiveFilterWidth,p=a-1-t.padInfo.front,d=l-1-t.padInfo.top,m=u-1-t.padInfo.left,f=a*l*u-1;this.userCode=`
      const ivec3 pads = ivec3(${p}, ${d}, ${m});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int ch = coords.u;

        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;
        int dyDCorner = dyCorner.x;
        int dyRCorner = dyCorner.y;
        int dyCCorner = dyCorner.z;

        // Convolve dy(?, ?, ?, ch) with pos mask(:, :, :, d) to get
        // dx(xD, xR, xC, ch).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;

        for (int wD = 0; wD < ${a};
           wD += ${s}) {
          float dyD = float(dyDCorner + wD) / ${e}.0;

          if (dyD < 0.0 || dyD >= ${t.outDepth}.0 || fract(dyD) > 0.0) {
            continue;
          }
          int idyD = int(dyD);

          for (int wR = 0; wR < ${l};
              wR += ${i}) {
            float dyR = float(dyRCorner + wR) / ${r}.0;

            if (dyR < 0.0 || dyR >= ${t.outHeight}.0 ||
                fract(dyR) > 0.0) {
              continue;
            }
            int idyR = int(dyR);

            for (int wC = 0; wC < ${u};
                wC += ${c}) {
              float dyC = float(dyCCorner + wC) / ${n}.0;

              if (dyC < 0.0 || dyC >= ${t.outWidth}.0 ||
                  fract(dyC) > 0.0) {
                continue;
              }
              int idyC = int(dyC);

              float dyValue = getDy(batch, idyD, idyR, idyC, ch);
              int maxPosValue = ${f} -
                  int(getMaxPos(batch, idyD, idyR, idyC, ch));

              // Get the current value, check it against the value from the
              // position matrix.
              int curPosValue =
                  wD * ${l} * ${u} +
                  wR * ${u} + wC;
              float mask = float(maxPosValue == curPosValue ? 1.0 : 0.0);

              dotProd += dyValue * mask;
            }
          }
        }
        setOutput(dotProd);
      }
    `;}};function Bx(o){let{inputs:t,backend:e,attrs:r}=o,{dy:n,input:s}=t,i=s,{filterSize:c,strides:a,pad:l,dimRoundingMode:u}=r,p=[1,1,1],d=kp$1.computePool3DInfo(i.shape,c,a,p,l,u),m=new Ee(d,"max",true),f=e.runWebGLProgram(m,[i],i.dtype),h=new Qo(d),g=e.runWebGLProgram(h,[n,f],i.dtype);return e.disposeIntermediateTensorInfo(f),g}var Np={kernelName:h0,backendName:"webgl",kernelFunc:Bx};vS();function Ux(o){let{inputs:t,backend:e,attrs:r}=o,{dy:n,input:s,output:i}=t,c=s;ce([s,i],"maxPoolGrad");let{filterSize:a,strides:l,pad:u,dimRoundingMode:p}=r,d=kp$1.computePool2DInfo(c.shape,a,l,1,u,p),m=true,f=new ue(d,"max",m),h=e.runWebGLProgram(f,[c],c.dtype),g=new Yo(d),x=e.runWebGLProgram(g,[n,h],c.dtype);return e.disposeIntermediateTensorInfo(h),x}var Ep={kernelName:f0,backendName:"webgl",kernelFunc:Ux};vS();vS();function kp(o,t,e,r){let n=new ue(e,"max",false),s=r.runWebGLProgram(n,[o],"float32");n=new ue(e,"max",true,true,t);let i=r.runWebGLProgram(n,[o],"float32");return [s,i]}var _p={kernelName:uc$1,backendName:"webgl",kernelFunc:({inputs:o,attrs:t,backend:e})=>{let{x:r}=o,{filterSize:n,strides:s,pad:i,includeBatchInIndex:c}=t,a=e;R.assert(r.shape.length===4,()=>`Error in maxPool: input must be rank 4 but got rank ${r.shape.length}.`);let l=[1,1];R.assert(kp$1.eitherStridesOrDilationsAreOne(s,l),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${s} and dilations '${l}'`);let u=kp$1.computePool2DInfo(r.shape,n,s,l,i),[p,d]=kp(r,c,u,a);return [p,d]}};vS();vS();function Ap(o,t,e,r){let n=R.sizeFromShape(t),i=R.sizeFromShape(o.shape)/n,c=T({inputs:{x:o},attrs:{shape:[i,n]},backend:r}),a=re(c,"float32","mean",r),l=T({inputs:{x:a},attrs:{shape:e},backend:r});return r.disposeIntermediateTensorInfo(c),r.disposeIntermediateTensorInfo(a),l}var Fp={kernelName:lc$1,backendName:"webgl",kernelFunc:({inputs:o,attrs:t,backend:e})=>{let{x:r}=o,{keepDims:n,axis:s}=t,i=e,c=r.shape.length,a=R.parseAxisParam(s,r.shape),l=a,u=kp$1.getAxesPermutation(l,c),p=u!=null,d=i.shouldExecuteOnCPU([r]),m=[],f=r;if(p){if(d){let R=i.texData.get(f.dataId).values,w=new Array(c);for(let E=0;E<w.length;E++)w[E]=r.shape[u[E]];let F=Be(R,r.shape,r.dtype,u,w);f=i.makeTensorInfo(w,r.dtype);let _=i.texData.get(f.dataId);_.values=F;}else f=Ne(r,u,i);m.push(f),l=kp$1.getInnerMostAxes(l.length,c);}kp$1.assertAxesAreInnerMostDims("sum",l,c);let[h,g]=kp$1.computeOutAndReduceShapes(f.shape,l),x=h;n&&(x=kp$1.expandShapeToKeepDim(h,a));let C=Ap(f,g,x,i);for(let y of m)i.disposeIntermediateTensorInfo(y);return C}};vS();function Vx(o){let{inputs:t,backend:e,attrs:r}=o,{x:n}=t,{axis:s,keepDims:i}=r,c=n.shape.length,a=R.parseAxisParam(s,n.shape),l=a,u=kp$1.getAxesPermutation(l,c),p=n;u!=null&&(p=B({inputs:{x:n},backend:e,attrs:{perm:u}}),l=kp$1.getInnerMostAxes(l.length,n.shape.length)),kp$1.assertAxesAreInnerMostDims("min",l,c);let[d,m]=kp$1.computeOutAndReduceShapes(p.shape,l),f=R.sizeFromShape(m),h=T({inputs:{x:p},backend:e,attrs:{shape:[-1,f]}}),g=re(h,h.dtype,"min",e),x;if(i){let C=kp$1.expandShapeToKeepDim(d,a);x=T({inputs:{x:g},backend:e,attrs:{shape:C}});}else x=T({inputs:{x:g},backend:e,attrs:{shape:d}});return e.disposeIntermediateTensorInfo(h),e.disposeIntermediateTensorInfo(g),u!=null&&e.disposeIntermediateTensorInfo(p),x}var Dp={kernelName:"Min",backendName:"webgl",kernelFunc:Vx};vS();var Wx=nt+`
  return min(a, b);
`,Mx=`
  vec4 result = vec4(min(a, b));
  bvec4 isNaNA = isnan(a);
  bvec4 isNaNB = isnan(b);
  bvec4 isNaN = bvec4(isNaNA.x || isNaNB.x, isNaNA.y || isNaNB.y, isNaNA.z || isNaNB.z, isNaNA.w || isNaNB.w);
  `+oe+`
  return result;
`,Gx=O({opSnippet:Wx,packedOpSnippet:Mx,cpuKernelImpl:Oc}),Pp={kernelName:pc$1,backendName:"webgl",kernelFunc:Gx};vS();var Zo=class{constructor(t,e,r){this.variableNames=["x"],this.outputShape=e.map((u,p)=>u[0]+t[p]+u[1]);let n=t.length,s=A(n),i=e.map(u=>u[0]).join(","),c=e.map((u,p)=>u[0]+t[p]).join(","),a=["coords[0]","coords[1]","coords[2]","coords[3]"].slice(0,n),l=r==="reflect"?0:1;if(n===1){this.userCode=`
        int start = ${i};
        int end = ${c};

        void main() {
          int outC = getOutputCoords();
          if (outC < start) {
            outC = start * 2 - outC - ${l};
          } else if(outC >= end) {
            outC = (end - 1) * 2 - outC + ${l};
          }
          setOutput(getX(outC - start));
        }
      `;return}this.userCode=`
      ${s} start = ${s}(${i});
      ${s} end = ${s}(${c});

      void main() {
        ${s} outC = getOutputCoords();
        for (int i = 0; i < ${n}; i++) {
          if (outC[i] < start[i]) {
            outC[i] = start[i] * 2 - outC[i] - ${l};
          } else if(outC[i] >= end[i]) {
            outC[i] = (end[i] - 1) * 2 - outC[i] + ${l};
          }
        }
        ${s} coords = outC - start;
        setOutput(getX(${a}));
      }
    `;}};var Jo=class{constructor(t,e,r){this.variableNames=["x"],this.packedInputs=true,this.packedOutput=true,this.outputShape=e.map((f,h)=>f[0]+t[h]+f[1]);let n=t.length,s=A(n),i=e.map(f=>f[0]).join(","),c=e.map((f,h)=>f[0]+t[h]).join(","),a=V("rc",n),l=V("source",n),u=`${a[n-1]} < ${this.outputShape[n-1]}`,p=n===1?"source":`vec2(${l.slice(-2).join()})`,d=r==="reflect"?0:1,m="";if(n===1){let f=`
        ${s} source = rc;
        if (source < start) {
          source = start * 2 - source - ${d};
        } else if (source >= end) {
          source = (end - 1) * 2 - source + ${d};
        }
        source -= start;
      `;m=`
        ${s} rc = outputLoc;
        ${f}
        result[0] = getChannel(getX(${l.join()}), ${p});
        ${a[n-1]} += 1;
        if(${u}) {
          ${f}
          result[1] = getChannel(getX(${l.join()}), ${p});
        }
      `;}else {let f=`
        ${s} source = rc;
        ${s} lt = ${s}(lessThan(source, start));
        ${s} gte = ${s}(greaterThanEqual(source, end));
        ${s} orig = 1 - (lt + gte);
        source = orig * source +
                lt * (start * 2 - source - ${d}) +
                gte * ((end - 1) * 2 - source + ${d});
        source -= start;
      `;m=`
        ${s} rc = outputLoc;
        ${f}
        result[0] = getChannel(getX(${l.join()}), ${p});
        ${a[n-1]} += 1;
        if(${u}) {
          ${f}
          result[1] = getChannel(getX(${l.join()}), ${p});
        }
        rc = outputLoc;
        ${a[n-2]} += 1;
        if(${a[n-2]} < ${this.outputShape[n-2]}) {
          ${f}
          result[2] = getChannel(getX(${l.join()}), ${p});
          ${a[n-1]} += 1;
          if(${u}) {
            ${f}
            result[3] = getChannel(getX(${l.join()}), ${p});
          }
        }
      `;}this.userCode=`
      const ${s} start = ${s}(${i});
      const ${s} end = ${s}(${c});

      void main() {
        ${s} outputLoc = getOutputCoords();
        vec4 result = vec4(0.);
        ${m}
        setOutput(result);
      }
    `;}};var zx=({inputs:o,backend:t,attrs:e})=>{let{x:r}=o,{paddings:n,mode:s}=e,i=O$1().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new Jo(r.shape,n,s):new Zo(r.shape,n,s);return t.runWebGLProgram(i,[r],r.dtype)},Op={kernelName:mc$1,backendName:"webgl",kernelFunc:zx};vS();var Hx=`if (b == 0.0) return NAN;
  return mod(a, b);`,Xx=`
  vec4 result = mod(a, b);
  bvec4 isNaN = equal(b, vec4(0.0));
  `+oe+`
  return result;
`,Kx=O({opSnippet:Hx,packedOpSnippet:Xx}),Lp={kernelName:"Mod",backendName:"webgl",kernelFunc:Kx};vS();var er=class{constructor(t,e,r){this.variableNames=["probs"],this.customUniforms=[{name:"seed",type:"float"}],this.outputShape=[t,r],this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];

        float r = random(seed);
        float cdf = 0.0;

        for (int i = 0; i < ${e-1}; i++) {
          cdf += getProbs(batch, i);

          if (r < cdf) {
            setOutput(float(i));
            return;
          }
        }

        // If no other event happened, last event happened.
        setOutput(float(${e-1}));
      }
    `;}};vS();vS();var qx=`
if (a == b) {
  return 1.0;
};
return a / b;`,jx=`
  // vec4 one = vec4(equal(a, b));
  // return one + (vec4(1.0) - one) * a / b;
  vec4 result = a / b;
  if(a.x == b.x) {
    result.x = 1.;
  }
  if(a.y == b.y) {
    result.y = 1.;
  }
  if(a.z == b.z) {
    result.z = 1.;
  }
  if(a.w == b.w) {
    result.w = 1.;
  }

  return result;
`,En=O({opSnippet:qx,packedOpSnippet:jx,checkOutOfBounds:true}),Bp={kernelName:Fa,backendName:"webgl",kernelFunc:En};vS();var Up="return a - b;",kn=O({opSnippet:Up,packedOpSnippet:Up,supportsComplex:true,cpuKernelImpl:rl}),Vp={kernelName:"Sub",backendName:"webgl",kernelFunc:kn};function _n(o){let{inputs:t,backend:e,attrs:r}=o,{logits:n}=t,{dim:s}=r,i=R.parseAxisParam([s],n.shape),c=Nn({inputs:{x:n},backend:e,attrs:{reductionIndices:i,keepDims:false}}),a=kp$1.expandShapeToKeepDim(c.shape,i),l=T({inputs:{x:c},backend:e,attrs:{shape:a}}),u=kn({inputs:{a:n,b:l},backend:e}),p=Tn({inputs:{x:u},backend:e}),d=Ue({inputs:{x:p},backend:e,attrs:{axis:i,keepDims:false}}),m=T({inputs:{x:d},backend:e,attrs:{shape:a}}),f=En({inputs:{a:p,b:m},backend:e});return e.disposeIntermediateTensorInfo(c),e.disposeIntermediateTensorInfo(l),e.disposeIntermediateTensorInfo(u),e.disposeIntermediateTensorInfo(p),e.disposeIntermediateTensorInfo(d),e.disposeIntermediateTensorInfo(m),f}var Wp={kernelName:Yc$1,backendName:"webgl",kernelFunc:_n};function Yx(o){let{inputs:t,backend:e,attrs:r}=o,{logits:n}=t,{numSamples:s,seed:i,normalized:c}=r,a=c?n:_n({inputs:{logits:n},backend:e,attrs:{dim:n.shape.length-1}}),l=a.shape[0],u=a.shape[1],p=new er(l,u,s),d=[[i]],m=e.runWebGLProgram(p,[a],"int32",d);return c||e.disposeIntermediateTensorInfo(a),m}var Mp={kernelName:fc$1,backendName:"webgl",kernelFunc:Yx};vS();var Qx=z+`
  return -x;
`,Zx=`
  vec4 result = -x;
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`;function Jx(o){let{inputs:t,backend:e}=o,{x:r}=t;if(e.shouldExecuteOnCPU([r])){let s=e.texData.get(r.dataId),[i,c]=Bc(s.values,r.shape,r.dtype);return e.makeTensorInfo(c,r.dtype,i)}let n;return O$1().getBool("WEBGL_PACK_UNARY_OPERATIONS")?n=new j(r.shape,Zx):n=new H(r.shape,Qx),e.runWebGLProgram(n,[r],r.dtype)}var Gp={kernelName:"Neg",backendName:"webgl",kernelFunc:Jx};vS();var eg=Sp$1.nonMaxSuppressionV3Impl;function tg(o){kp$1.warn("tf.nonMaxSuppression() in webgl locks the UI thread. Call tf.nonMaxSuppressionAsync() instead");let{inputs:t,backend:e,attrs:r}=o,{boxes:n,scores:s}=t,{maxOutputSize:i,iouThreshold:c,scoreThreshold:a}=r,l=e.readSync(n.dataId),u=e.readSync(s.dataId),{selectedIndices:p}=eg(l,u,i,c,a);return e.makeTensorInfo([p.length],"int32",new Int32Array(p))}var zp={kernelName:gc$1,backendName:"webgl",kernelFunc:tg};vS();var og=Sp$1.nonMaxSuppressionV4Impl;function rg(o){kp$1.warn("tf.nonMaxSuppression() in webgl locks the UI thread. Call tf.nonMaxSuppressionAsync() instead");let{inputs:t,backend:e,attrs:r}=o,{boxes:n,scores:s}=t,{maxOutputSize:i,iouThreshold:c,scoreThreshold:a,padToMaxOutputSize:l}=r,u=e.readSync(n.dataId),p=e.readSync(s.dataId),{selectedIndices:d,validOutputs:m}=og(u,p,i,c,a,l);return [e.makeTensorInfo([d.length],"int32",new Int32Array(d)),e.makeTensorInfo([],"int32",new Int32Array([m]))]}var Hp={kernelName:xc$1,backendName:"webgl",kernelFunc:rg};vS();var ng=Sp$1.nonMaxSuppressionV5Impl;function sg(o){kp$1.warn("tf.nonMaxSuppression() in webgl locks the UI thread. Call tf.nonMaxSuppressionAsync() instead");let{inputs:t,backend:e,attrs:r}=o,{boxes:n,scores:s}=t,{maxOutputSize:i,iouThreshold:c,scoreThreshold:a,softNmsSigma:l}=r,u=e.readSync(n.dataId),p=e.readSync(s.dataId),d=i,m=c,f=a,h=l,{selectedIndices:g,selectedScores:x}=ng(u,p,d,m,f,h);return [e.makeTensorInfo([g.length],"int32",new Int32Array(g)),e.makeTensorInfo([x.length],"float32",new Float32Array(x))]}var Xp={kernelName:bc$1,backendName:"webgl",kernelFunc:sg};vS();var tr=class{constructor(t,e,r,n){this.variableNames=["indices"],this.outputShape=[t,e],this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int index = round(getIndices(coords.x));
        setOutput(mix(float(${n}), float(${r}),
                      float(index == coords.y)));
      }
    `;}};var ig=o=>{let{inputs:t,backend:e,attrs:r}=o,{indices:n}=t,{dtype:s,depth:i,onValue:c,offValue:a}=r,l=R.sizeFromShape(n.shape),u=new tr(l,i,c,a),p=T({inputs:{x:n},backend:e,attrs:{shape:[l]}}),d=e.runWebGLProgram(u,[p],s);e.disposeIntermediateTensorInfo(p);let m=[...n.shape,i],f=T({inputs:{x:d},backend:e,attrs:{shape:m}});return e.disposeIntermediateTensorInfo(d),f},Kp={kernelName:yc$1,backendName:"webgl",kernelFunc:ig};vS();vS();function Tt(o){let{inputs:t,backend:e}=o,{x:r}=t;if(r.dtype==="complex64"){let n=$e({inputs:{input:r},backend:e}),s=Tt({inputs:{x:n},backend:e}),i=We({inputs:{input:r},backend:e}),c=Tt({inputs:{x:i},backend:e}),a=Q({inputs:{real:s,imag:c},backend:e});return e.disposeIntermediateTensorInfo(n),e.disposeIntermediateTensorInfo(s),e.disposeIntermediateTensorInfo(i),e.disposeIntermediateTensorInfo(c),a}else return Se({attrs:{shape:r.shape,dtype:r.dtype,value:r.dtype==="string"?"":0},backend:e})}var qp={kernelName:gu$1,backendName:"webgl",kernelFunc:Tt};function jp(o){let{inputs:t,backend:e}=o,{x:r}=t;if(r.dtype==="string")throw new Error("onesLike is not supported under string dtype");if(r.dtype==="complex64"){let n=$e({inputs:{input:r},backend:e}),s=jp({inputs:{x:n},backend:e}),i=We({inputs:{input:r},backend:e}),c=Tt({inputs:{x:i},backend:e}),a=Q({inputs:{real:s,imag:c},backend:e});return e.disposeIntermediateTensorInfo(n),e.disposeIntermediateTensorInfo(s),e.disposeIntermediateTensorInfo(i),e.disposeIntermediateTensorInfo(c),a}else return Se({attrs:{shape:r.shape,dtype:r.dtype,value:1},backend:e})}var Yp={kernelName:wc$1,backendName:"webgl",kernelFunc:jp};vS();function ag(o){let{inputs:t,backend:e,attrs:r}=o,{axis:n}=r;if(t.length===1)return Uo({inputs:{input:t[0]},backend:e,attrs:{dim:n}});let s=t[0].shape,i=t[0].dtype;t.forEach(u=>{R.assertShapesMatch(s,u.shape,"All tensors passed to stack must have matching shapes"),R.assert(i===u.dtype,()=>"All tensors passed to stack must have matching dtypes");});let c=[],a=t.map(u=>{let p=Uo({inputs:{input:u},backend:e,attrs:{dim:n}});return c.push(p),p}),l=Rn({inputs:a,backend:e,attrs:{axis:n}});return c.forEach(u=>e.disposeIntermediateTensorInfo(u)),l}var Qp={kernelName:Ec$1,backendName:"webgl",kernelFunc:ag};vS();var or=class{constructor(t,e,r){this.variableNames=["x"],this.customUniforms=[{name:"value",type:"float"}],this.outputShape=e.map((l,u)=>l[0]+t[u]+l[1]);let n=t.length,s=A(n),i=e.map(l=>l[0]).join(","),c=e.map((l,u)=>l[0]+t[u]).join(","),a=["coords[0]","coords[1]","coords[2]","coords[3]"].slice(0,n);if(n===1){this.userCode=`
        int start = ${i};
        int end = ${c};

        void main() {
          int outC = getOutputCoords();
          if (outC < start || outC >= end) {
            setOutput(value);
          } else {
            setOutput(getX(outC - start));
          }
        }
      `;return}this.userCode=`
      ${s} start = ${s}(${i});
      ${s} end = ${s}(${c});

      void main() {
        ${s} outC = getOutputCoords();
        if (any(lessThan(outC, start)) || any(greaterThanEqual(outC, end))) {
          setOutput(value);
        } else {
          ${s} coords = outC - start;
          setOutput(getX(${a}));
        }
      }
    `;}};var rr=class{constructor(t,e,r){this.variableNames=["x"],this.packedInputs=true,this.packedOutput=true,this.customUniforms=[{name:"value",type:"float"}],this.outputShape=e.map((h,g)=>h[0]+t[g]+h[1]);let n=t.length,s=A(n),i=e.map(h=>h[0]).join(","),c=e.map((h,g)=>h[0]+t[g]).join(","),a=V("rc",n),l=V("source",n),u=`${a[n-1]} < ${this.outputShape[n-1]}`,p=n===1?"source":`vec2(${l.slice(-2).join()})`,d=[`${s} rc = outputLoc;`,`${a[n-1]} += 1;
       if(${u}) {
      `,n===1?"":`}
       rc = outputLoc;
       ${a[n-2]} += 1;
       if(${a[n-2]} < ${this.outputShape[n-2]}) {`,n===1?"":`  ${a[n-1]} += 1;
         if(${u}) {`],m=n===1?"rc < start || rc >= end":"any(lessThan(rc, start)) || any(greaterThanEqual(rc, end))",f="";for(let h=0,g=n===1?2:4;h<g;h++)f+=`
        ${d[h]}
        if (${m}) {
          result[${h}] = float(value);
        } else {
          ${s} source = rc - start;
          result[${h}] = getChannel(getX(${l.join()}), ${p});
        }
      `;f+=n===1?"} ":"}}",this.userCode=`
      const ${s} start = ${s}(${i});
      const ${s} end = ${s}(${c});

      void main() {
        ${s} outputLoc = getOutputCoords();
        vec4 result = vec4(0.);
        ${f}
        setOutput(result);
      }
    `;}};var An=o=>{let{inputs:t,backend:e,attrs:r}=o,{x:n}=t,{paddings:s,constantValue:i}=r;if(R.sizeFromShape(n.shape)===0){let l=s.map((u,p)=>u[0]+n.shape[p]+u[1]);return Se({backend:e,attrs:{shape:l,value:i,dtype:n.dtype}})}let c=O$1().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new rr(n.shape,s,i):new or(n.shape,s,i),a=[[i]];return e.runWebGLProgram(c,[n],n.dtype,a)},Zp={kernelName:vc$1,backendName:"webgl",kernelFunc:An};vS();var cg=`
  if(a < 0.0 && floor(b) < b){
    return NAN;
  }
  if (b == 0.0) {
    return 1.0;
  }
  return (round(mod(b, 2.0)) != 1) ?
      pow(abs(a), b) : sign(a) * pow(abs(a), b);
`,lg=`
  // isModRound1 has 1 for components with round(mod(b, 2.0)) == 1, 0 otherwise.
  vec4 isModRound1 = vec4(equal(round(mod(b, 2.0)), ivec4(1)));
  vec4 multiplier = sign(a) * isModRound1 + (vec4(1.0) - isModRound1);
  vec4 result = multiplier * pow(abs(a), b);

  // Ensure that a^0 = 1, including 0^0 = 1 as this correspond to TF and JS
  bvec4 isExpZero = equal(b, vec4(0.0));
  result.r = isExpZero.r ? 1.0 : result.r;
  result.g = isExpZero.g ? 1.0 : result.g;
  result.b = isExpZero.b ? 1.0 : result.b;
  result.a = isExpZero.a ? 1.0 : result.a;

  bvec4 isNaN1 = lessThan(a, vec4(0.0));
  bvec4 isNaN2 = lessThan(floor(b), b);
  bvec4 isNaN = bvec4(isNaN1.x && isNaN2.x, isNaN1.y && isNaN2.y, isNaN1.z && isNaN2.z, isNaN1.w && isNaN2.w);
  `+oe+`
  return result;
`,ug=O({opSnippet:cg,packedOpSnippet:lg}),Jp={kernelName:"Pow",backendName:"webgl",kernelFunc:ug};vS();function pg(o){let{inputs:t,backend:e,attrs:r}=o,{x:n}=t,{axis:s,keepDims:i}=r,c=n.shape.length,a=[],l=R.parseAxisParam(s,n.shape),u=l,p=kp$1.getAxesPermutation(u,c),d=n;p!=null&&(d=B({inputs:{x:n},backend:e,attrs:{perm:p}}),u=kp$1.getInnerMostAxes(u.length,c),a.push(d)),kp$1.assertAxesAreInnerMostDims("prod",u,c);let m;if(e.shouldExecuteOnCPU([d])){let f=e.texData.get(d.dataId).values,{outVals:h,outShape:g,outDtype:x}=Vc(d.shape,d.dtype,f,u);m=e.makeTensorInfo(g,x,h);}else {let[f,h]=kp$1.computeOutAndReduceShapes(d.shape,u),g=R.sizeFromShape(h),x=T({inputs:{x:d},backend:e,attrs:{shape:[-1,g]}}),C=Dm$1(n.dtype),y=re(x,C,"prod",e);m=T({inputs:{x:y},backend:e,attrs:{shape:f}}),a.push(x),a.push(y);}if(i){a.push(m);let f=kp$1.expandShapeToKeepDim(m.shape,l);m=T({inputs:{x:m},backend:e,attrs:{shape:f}});}return a.forEach(f=>e.disposeIntermediateTensorInfo(f)),m}var ed={kernelName:$c$1,backendName:"webgl",kernelFunc:pg};vS();function dg(o){let{inputs:t,backend:e,attrs:r}=o,{paramsNestedSplits:n,paramsDenseValues:s,indices:i}=t,{outputRaggedRank:c}=r,a=n.map(x=>e.readSync(x.dataId)),l=n.map(x=>x.shape),u=e.readSync(s.dataId),p=e.readSync(i.dataId),[d,m,f]=Wc(a,l,u,s.shape,s.dtype,p,i.shape,c),h=d.map(x=>e.makeTensorInfo([x.length],"int32",x)),g=e.makeTensorInfo(f,s.dtype,m);return h.concat([g])}var td={kernelName:kc$1,backendName:"webgl",kernelFunc:dg};vS();function mg(o){let{inputs:t,backend:e}=o,{starts:r,limits:n,deltas:s}=t,i=e.readSync(r.dataId),c=e.readSync(n.dataId),a=e.readSync(s.dataId),[l,u]=Mc(i,r.shape,r.dtype,c,n.shape,a,s.shape),p=e.makeTensorInfo([l.length],"int32",l),d=e.makeTensorInfo([u.length],r.dtype,u);return [p,d]}var od={kernelName:Sc$1,backendName:"webgl",kernelFunc:mg};vS();function fg(o){let{inputs:t,backend:e,attrs:r}=o,{shape:n,values:s,defaultValue:i,rowPartitionTensors:c}=t,{rowPartitionTypes:a}=r,l=e.readSync(n.dataId),u=e.readSync(s.dataId),p=e.readSync(i.dataId),d=c.map(g=>e.readSync(g.dataId)),m=c.map(g=>g.shape),[f,h]=Gc(l,n.shape,u,s.shape,s.dtype,p,i.shape,d,m,a);return e.makeTensorInfo(f,s.dtype,h)}var rd={kernelName:Nc$1,backendName:"webgl",kernelFunc:fg};vS();var Fn=o=>{let{backend:t,attrs:e}=o,{start:r,stop:n,step:s,dtype:i}=e,c=zc(r,n,s,i);return t.makeTensorInfo([c.length],i,c)},nd={kernelName:Ic$1,backendName:"webgl",kernelFunc:Fn};vS();var hg="return 1.0 / x;",xg=N({opSnippet:hg}),sd={kernelName:Dc$1,backendName:"webgl",kernelFunc:xg};vS();var gg=z+`
  return (x < 0.0) ? 0.0 : x;
`,Cg=`
  vec4 result = x * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,bg=N({opSnippet:gg,packedOpSnippet:Cg}),id={kernelName:Mc$1,backendName:"webgl",kernelFunc:bg};vS();var vg=z+`
  return (x < 0.0) ? 0.0 : min(6.0, x);
`,$g=`
  vec4 result = min(x, vec4(6.)) * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,Sg=N({opSnippet:vg,packedOpSnippet:$g}),ad={kernelName:Bc$1,backendName:"webgl",kernelFunc:Sg};vS();var nr=class{constructor(t,e,r,n,s){this.variableNames=["A"],this.outputShape=[];let[i,c,a,l]=t;this.outputShape=[i,e,r,l];let u=[n&&e>1?c-1:c,n&&r>1?a-1:a],p=[n&&e>1?e-1:e,n&&r>1?r-1:r],d;s?d="(vec2(yRC) + vec2(0.5)) * effectiveInputOverOutputRatioRC - vec2(0.5)":d="vec2(yRC) * effectiveInputOverOutputRatioRC",this.userCode=`
      const vec2 effectiveInputOverOutputRatioRC = vec2(
          ${u[0]/p[0]},
          ${u[1]/p[1]});
      const vec2 inputShapeRC = vec2(${c}.0, ${a}.0);

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        ivec2 yRC = coords.yz;

        // Fractional source index.
        vec2 sourceFracIndexRC = ${d};

        // Compute the four integer indices.
        ivec2 sourceFloorRC = ivec2(max(sourceFracIndexRC, vec2(0.0)));
        ivec2 sourceCeilRC = ivec2(
          min(inputShapeRC - 1.0, ceil(sourceFracIndexRC)));

        float topLeft = getA(b, sourceFloorRC.x, sourceFloorRC.y, d);
        float bottomLeft = getA(b, sourceCeilRC.x, sourceFloorRC.y, d);
        float topRight = getA(b, sourceFloorRC.x, sourceCeilRC.y, d);
        float bottomRight = getA(b, sourceCeilRC.x, sourceCeilRC.y, d);

        vec2 fracRC = sourceFracIndexRC - vec2(sourceFloorRC);

        float top = topLeft + (topRight - topLeft) * fracRC.y;
        float bottom = bottomLeft + (bottomRight - bottomLeft) * fracRC.y;
        float newValue = top + (bottom - top) * fracRC.x;

        setOutput(newValue);
      }
    `;}};var sr=class{constructor(t,e,r,n,s){this.variableNames=["A"],this.packedInputs=true,this.packedOutput=true,this.outputShape=[];let[i,c,a,l]=t;this.outputShape=[i,e,r,l];let u=[n&&e>1?c-1:c,n&&r>1?a-1:a],p=[n&&e>1?e-1:e,n&&r>1?r-1:r],d;s?d="(vec3(yRC) + vec3(0.5)) * effectiveInputOverOutputRatioRC - vec3(0.5)":d="vec3(yRC) * effectiveInputOverOutputRatioRC",this.userCode=`
      const vec3 effectiveInputOverOutputRatioRC = vec3(
          ${u[0]/p[0]},
          ${u[1]/p[1]},
          ${u[1]/p[1]});
      const vec3 inputShapeRC = vec3(${c}.0, ${a}.0,
                                     ${a}.0);

      float getAValue(int b, int r, int c, int d) {
        return getChannel(getA(b, r, c, d), vec2(c, d));
      }

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        // Calculate values for next column in yRC.z.
        ivec3 yRC = coords.yzz + ivec3(0, 0, 1);

        // Fractional source index.
        vec3 sourceFracIndexRC = ${d};

        // Compute the four integer indices.
        ivec3 sourceFloorRC = ivec3(max(sourceFracIndexRC, vec3(0.0)));
        ivec3 sourceCeilRC = ivec3(
          min(inputShapeRC - 1.0, ceil(sourceFracIndexRC)));

        // Should we calculate next column and row elements in 2x2 packed cell.
        bool hasNextCol = d < ${l-1};
        bool hasNextRow = coords.z < ${r-1};

        // In parallel, construct four corners for all four components in
        // packed 2x2 cell.
        vec4 topLeft = vec4(
          getAValue(b, sourceFloorRC.x, sourceFloorRC.y, d),
          hasNextCol ? getAValue(b, sourceFloorRC.x, sourceFloorRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceFloorRC.x, sourceFloorRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceFloorRC.x, sourceFloorRC.z, d + 1) : 0.0);

        vec4 bottomLeft = vec4(
          getAValue(b, sourceCeilRC.x, sourceFloorRC.y, d),
          hasNextCol ? getAValue(b, sourceCeilRC.x, sourceFloorRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceCeilRC.x, sourceFloorRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceCeilRC.x, sourceFloorRC.z, d + 1) : 0.0);

        vec4 topRight = vec4(
          getAValue(b, sourceFloorRC.x, sourceCeilRC.y, d),
          hasNextCol ? getAValue(b, sourceFloorRC.x, sourceCeilRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceFloorRC.x, sourceCeilRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceFloorRC.x, sourceCeilRC.z, d + 1) : 0.0);

        vec4 bottomRight = vec4(
          getAValue(b, sourceCeilRC.x, sourceCeilRC.y, d),
          hasNextCol ? getAValue(b, sourceCeilRC.x, sourceCeilRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceCeilRC.x, sourceCeilRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceCeilRC.x, sourceCeilRC.z, d + 1) : 0.0);

        vec3 fracRC = sourceFracIndexRC - vec3(sourceFloorRC);

        vec4 top = mix(topLeft, topRight, fracRC.yyzz);
        vec4 bottom = mix(bottomLeft, bottomRight, fracRC.yyzz);
        vec4 newValue = mix(top, bottom, fracRC.x);

        setOutput(newValue);
      }
    `;}};function yg(o){let{inputs:t,backend:e,attrs:r}=o,{images:n}=t,{alignCorners:s,halfPixelCenters:i,size:c}=r,[a,l]=c,u=O$1().getBool("WEBGL_PACK_IMAGE_OPERATIONS")?new sr(n.shape,a,l,s,i):new nr(n.shape,a,l,s,i);return e.runWebGLProgram(u,[n],"float32")}var cd={kernelName:Rc$1,backendName:"webgl",kernelFunc:yg};vS();var ir=class{constructor(t,e,r){this.variableNames=["dy"],this.outputShape=[],this.outputShape=e;let[,n,s]=e,[,i,c]=t,a=[r&&i>1?n-1:n,r&&c>1?s-1:s],l=[r&&i>1?i-1:i,r&&c>1?c-1:c],u=a[0]/l[0],p=a[1]/l[1],d=1/u,m=1/p,f=Math.ceil(d)*2+2,h=Math.ceil(m)*2+2;this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        int r = coords[1];
        int c = coords[2];

        float accumulator = 0.0;

        const float heightScale = float(${u});
        const float widthScale = float(${p});

        const float invHeightScale = float(${d});
        const float invWidthScale = float(${m});

        const int winHeight = int(${f});
        const int winWidth = int(${h});

        // Compute bounds for where in dy we will look
        float startRLerp = floor(float(r) * invHeightScale);
        int startDyR = int(startRLerp - float(winHeight / 2));

        float startCLerp = floor(float(c) * invWidthScale);
        int startDyC = int(startCLerp - float(winWidth / 2));

        // Loop over dy
        for (int dyROffset = 0; dyROffset < winHeight; dyROffset++) {
          int dyR = dyROffset + startDyR;

          // Guard against the window exceeding the bounds of dy
          if (dyR < 0 || dyR >= ${i}) {
            continue;
          }

          for (int dyCOffset = 0; dyCOffset < winWidth; dyCOffset++) {
            int dyC = dyCOffset + startDyC;

            // Guard against the window exceeding the bounds of dy
            if (dyC < 0 || dyC >= ${c}) {
              continue;
            }

            float dxR = float(dyR) * heightScale;
            int topDxRIndex = int(floor(dxR));
            int bottomDxRIndex = int(min(ceil(dxR), ${n-1}.0));
            float dxRLerp = dxR - float(topDxRIndex);
            float inverseDxRLerp = 1.0 - dxRLerp;

            float dxC = float(dyC) * widthScale;
            int leftDxCIndex = int(floor(dxC));
            int rightDxCIndex = int(min(ceil(dxC), ${s-1}.0));
            float dxCLerp = dxC - float(leftDxCIndex);
            float inverseDxCLerp = 1.0 - dxCLerp;

            if (r == topDxRIndex && c == leftDxCIndex) {
              // topLeft
              accumulator +=
                getDy(b, dyR, dyC, d) * inverseDxRLerp * inverseDxCLerp;
            }

            if (r == topDxRIndex && c == rightDxCIndex) {
              // topRight
              accumulator += getDy(b, dyR, dyC, d) * inverseDxRLerp * dxCLerp;
            }

            if (r == bottomDxRIndex && c == leftDxCIndex) {
              // bottomLeft
              accumulator += getDy(b, dyR, dyC, d) * dxRLerp * inverseDxCLerp;
            }

            if (r == bottomDxRIndex && c == rightDxCIndex) {
              // bottomRight
              accumulator += getDy(b, dyR, dyC, d) * dxRLerp * dxCLerp;
            }
          }
        }
        // End loop over dy

        setOutput(accumulator);
      }
    `;}};function Rg(o){let{inputs:t,backend:e,attrs:r}=o,{images:n,dy:s}=t,{alignCorners:i}=r,c=new ir(s.shape,n.shape,i);return e.runWebGLProgram(c,[s],s.dtype)}var ld={kernelName:x0,backendName:"webgl",kernelFunc:Rg};vS();var ar=class{constructor(t,e,r,n,s){this.variableNames=["A"],this.outputShape=[];let[i,c,a,l]=t;this.outputShape=[i,e,r,l];let u=[n&&e>1?c-1:c,n&&r>1?a-1:a],p=[n&&e>1?e-1:e,n&&r>1?r-1:r],d=n?"0.5":"0.0",m;s?m="max((vec2(yRC) + vec2(0.5)) * effectiveInputOverOutputRatioRC, vec2(0.0))":m="vec2(yRC) * effectiveInputOverOutputRatioRC",this.userCode=`
      const vec2 effectiveInputOverOutputRatioRC = vec2(
          ${u[0]/p[0]},
          ${u[1]/p[1]});
      const vec2 inputShapeRC = vec2(${c}.0, ${a}.0);

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        ivec2 yRC = coords.yz;

        // Fractional source index.
        vec2 sourceFracIndexRC = ${m};

        // Compute the coordinators of nearest neighbor point.
        ivec2 sourceNearestRC = ivec2(
          min(inputShapeRC - 1.0, floor(sourceFracIndexRC + ${d})));
        float newValue = getA(b, sourceNearestRC.x, sourceNearestRC.y, d);

        setOutput(newValue);
      }
    `;}};var cr=class{constructor(t,e,r,n,s){this.variableNames=["A"],this.packedInputs=true,this.packedOutput=true,this.outputShape=[];let[i,c,a,l]=t;this.outputShape=[i,e,r,l];let u=[n&&e>1?c-1:c,n&&r>1?a-1:a],p=[n&&e>1?e-1:e,n&&r>1?r-1:r],d=n?"0.5":"0.0",m;s?m="max((vec3(yRC) + vec3(0.5)) * effectiveInputOverOutputRatioRC, vec3(0.0))":m="vec3(yRC) * effectiveInputOverOutputRatioRC",this.userCode=`
      const vec3 effectiveInputOverOutputRatioRC = vec3(
          ${u[0]/p[0]},
          ${u[1]/p[1]},
          ${u[1]/p[1]});
      const vec3 inputShapeRC = vec3(${c}.0, ${a}.0,
                                     ${a}.0);

      float getAValue(int b, int r, int c, int d) {
        return getChannel(getA(b, r, c, d), vec2(c, d));
      }

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        // Calculate values for next column in yRC.z.
        ivec3 yRC = coords.yzz + ivec3(0, 0, 1);

        // Fractional source index.
        vec3 sourceFracIndexRC = ${m};

        // Compute the coordinators of nearest neighbor point.
        ivec3 sourceNearestRC = ivec3(
          min(inputShapeRC - 1.0, floor(sourceFracIndexRC + ${d})));

        // Should we calculate next column and row elements in 2x2 packed cell.
        bool hasNextCol = d < ${l-1};
        bool hasNextRow = coords.z < ${r-1};

        vec4 newValue = vec4(
          getAValue(b, sourceNearestRC.x, sourceNearestRC.y, d),
          hasNextCol ? getAValue(b, sourceNearestRC.x, sourceNearestRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceNearestRC.x, sourceNearestRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceNearestRC.x, sourceNearestRC.z, d + 1) : 0.0);

        setOutput(newValue);
      }
    `;}};function Tg(o){let{inputs:t,backend:e,attrs:r}=o,{images:n}=t,{alignCorners:s,halfPixelCenters:i,size:c}=r,[a,l]=c,u=O$1().getBool("WEBGL_PACK_IMAGE_OPERATIONS")?new cr(n.shape,a,l,s,i):new ar(n.shape,a,l,s,i);return e.runWebGLProgram(u,[n],n.dtype)}var ud={kernelName:Fc$1,backendName:"webgl",kernelFunc:Tg};vS();var lr=class{constructor(t,e,r){this.variableNames=["dy"],this.outputShape=[],this.outputShape=e;let[,n,s]=e,[,i,c]=t,a=[r&&i>1?n-1:n,r&&c>1?s-1:s],l=[r&&i>1?i-1:i,r&&c>1?c-1:c],u=a[0]/l[0],p=a[1]/l[1],d=1/u,m=1/p,f=Math.ceil(d)*2+2,h=Math.ceil(m)*2+2;this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        int r = coords[1];
        int c = coords[2];

        float accumulator = 0.0;

        const float heightScale = float(${u});
        const float widthScale = float(${p});

        const float invHeightScale = float(${d});
        const float invWidthScale = float(${m});

        const int winHeight = int(${f});
        const int winWidth = int(${h});

        // Compute bounds for where in dy we will look
        float startRLerp = floor(float(r) * invHeightScale);
        int startDyR = int(floor(startRLerp - float(winHeight / 2)));

        float startCLerp = floor(float(c) * invWidthScale);
        int startDyC = int(floor(startCLerp - float(winWidth / 2)));

        // Loop over dy
        for (int dyROffset = 0; dyROffset < winHeight; dyROffset++) {
          int dyR = dyROffset + startDyR;

          // Guard against the window exceeding the bounds of dy
          if (dyR < 0 || dyR >= ${i}) {
            continue;
          }

          for (int dyCOffset = 0; dyCOffset < winWidth; dyCOffset++) {
            int dyC = dyCOffset + startDyC;

            // Guard against the window exceeding the bounds of dy
            if (dyC < 0 || dyC >= ${c}) {
              continue;
            }

            float sourceFracRow =
              float(${a[0]}) *
                (float(dyR) / float(${l[0]}));

            float sourceFracCol =
                float(${a[1]}) *
                  (float(dyC) / float(${l[1]}));

            int sourceNearestRow = int(min(
                float(int(${n}) - 1),
                ${r} ? float(round(sourceFracRow)) :
                                  float(floor(sourceFracRow))));

            int sourceNearestCol = int(min(
                float(int(${s}) - 1),
                ${r} ? float(round(sourceFracCol)) :
                                  float(floor(sourceFracCol))));

            if (r == sourceNearestRow && c == sourceNearestCol) {
              accumulator += getDy(b, dyR, dyC, d);
            }
          }
        }
        // End loop over dy

        setOutput(accumulator);
      }
    `;}};function wg(o){let{inputs:t,backend:e,attrs:r}=o,{images:n,dy:s}=t,{alignCorners:i}=r,c=new lr(s.shape,n.shape,i);return e.runWebGLProgram(c,[s],s.dtype)}var pd={kernelName:g0,backendName:"webgl",kernelFunc:wg};vS();var ur=class{constructor(t,e){this.variableNames=["x"];let r=t.length;if(r>4)throw new Error(`WebGL backend: Reverse of rank-${r} tensor is not yet supported`);if(this.outputShape=t,r===1){this.userCode=`
        void main() {
          int coord = getOutputCoords();
          setOutput(getX(${t[0]} - coord - 1));
        }
      `;return}let n=c=>e.indexOf(c)!==-1&&t[c]!==1?`${t[c]} - coords[${c}] - 1`:`coords[${c}]`,s=t.map((c,a)=>n(a)).join(","),i=A(r);this.userCode=`
      void main() {
        ${i} coords = getOutputCoords();
        setOutput(getX(${s}));
      }
    `;}};var pr=class{constructor(t,e){this.variableNames=["x"],this.packedInputs=true,this.packedOutput=true;let r=t.length;if(r>4)throw new Error(`WebGL backend: Reverse of rank-${r} tensor is not yet supported`);this.outputShape=t;let n=V("rc",r),s=`${n[r-1]} + 1 < ${this.outputShape[r-1]}`,i=`${n[r-2]} + 1 < ${this.outputShape[r-2]}`,c=A(r);r===1?this.userCode=`
        void main(){
          int rc = getOutputCoords();
          vec4 result = vec4(0.);
          result.r = getChannel(getX(${t[0]} - rc - 1),
            ${t[0]} - rc - 1);
          if(${s}){
              result.g = getChannel(getX(${t[0]} - (rc  + 1) - 1),
                ${t[0]} - (rc  + 1) - 1);
          }
          setOutput(result);
        }
      `:this.userCode=`
        void main() {
          ${c} rc = getOutputCoords();
          vec4 result = vec4(0.);
          result.r = ${a(n.slice())};
          if(${s}){
            result.g = ${l(n.slice())};
          }
          if(${i}) {
            result.b = ${u(n.slice())};
            if(${s}) {
              result.a = ${p(n.slice())};
            }
          }
          setOutput(result);
        }
    `;function a(f){return d(f)}function l(f){return f[r-1]="("+f[r-1]+" + 1)",d(f)}function u(f){return f[r-2]="("+f[r-2]+" + 1)",d(f)}function p(f){return f[r-1]="("+f[r-1]+" + 1)",f[r-2]="("+f[r-2]+" + 1)",d(f)}function d(f){let h=t.map((C,y)=>m(y,f)),g=h.join(","),x=h.slice(-2).join(",");return `getChannel(getX(${g}), vec2(${x}))`}function m(f,h){return e.indexOf(f)!==-1&&t[f]!==1?`${t[f]} - ${h[f]} - 1`:`${h[f]}`}}};function Ig(o){let{inputs:t,backend:e,attrs:r}=o,{x:n}=t,{dims:s}=r,i=n.shape.length,c=R.parseAxisParam(s,n.shape);if(i===0)return W({inputs:{x:n},backend:e});let a=O$1().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new pr(n.shape,c):new ur(n.shape,c);return e.runWebGLProgram(a,[n],n.dtype)}var dd={kernelName:Gc$1,backendName:"webgl",kernelFunc:Ig};vS();vS();var dr=class{constructor(t,e){this.variableNames=["Image"],this.outputShape=[],this.customUniforms=[{name:"params",type:"vec4"}];let r=t[1],n=t[2];this.outputShape=t;let s="";typeof e=="number"?s=`float outputValue = ${e.toFixed(2)};`:s=`
        vec3 fill = vec3(${e.join(",")});
        float outputValue = fill[coords[3]];`,this.userCode=`
        void main() {
          ivec4 coords = getOutputCoords();
          int x = coords[2];
          int y = coords[1];
          float coordXFloat = (float(x) - params[0]) * params[3] -
            (float(y) - params[1]) * params[2];
          float coordYFloat = (float(x) - params[0]) * params[2] +
            (float(y) - params[1]) * params[3];
          int coordX = int(round(coordXFloat + params[0]));
          int coordY = int(round(coordYFloat + params[1]));
          ${s}
          if(coordX >= 0 && coordX < ${n} && coordY >= 0 && coordY < ${r}) {
            outputValue = getImage(coords[0], coordY, coordX, coords[3]);
          }
          setOutput(outputValue);
        }
    `;}};var md={kernelName:bu$1,backendName:"webgl",kernelFunc:({inputs:o,attrs:t,backend:e})=>{let{image:r}=o,{radians:n,fillValue:s,center:i}=t,c=e,a=new dr(r.shape,s),[l,u]=kp$1.getImageCenter(i,r.shape[1],r.shape[2]),p=[[l,u,Math.sin(n),Math.cos(n)]];return c.runWebGLProgram(a,[r],r.dtype,p)}};vS();var Ng=`
  // OpenGL ES does not support round function.
  // The algorithm is based on banker's rounding.
  float base = floor(x);
  if ((x - base) < 0.5) {
    return floor(x);
  } else if ((x - base) > 0.5) {
    return ceil(x);
  } else {
    if (mod(base, 2.0) == 0.0) {
      return base;
    } else {
      return base + 1.0;
    }
  }
`,Eg=N({opSnippet:Ng}),fd={kernelName:Cc$1,backendName:"webgl",kernelFunc:Eg};vS();var kg="return inversesqrt(x);",_g=N({opSnippet:kg,cpuKernelImpl:Hc}),hd={kernelName:Oc$1,backendName:"webgl",kernelFunc:_g};vS();var ke=class{constructor(t,e,r,n,s,i,c=true,a=false){this.variableNames=["updates","indices","defaultValue"],this.outputShape=i;let l=A(s.length),u=A(i.length),p="";r===1?p="i":r===2&&(p="i, j");let d=`getIndices(${p})`,m="";n===1?m="i":n===2&&(m="i, coords[1]");let f=`getUpdates(${m})`,h="";a&&(h="coords[0], coords[1]");let g=`getDefaultValue(${h})`,x=e>1?"strides[j]":"strides";this.userCode=`
        ${l} strides = ${l}(${s});

        void main() {
          ${u} coords = getOutputCoords();
          float sum = 0.0;
          bool found = false;
          for (int i = 0; i < ${t}; i++) {
            int flattenedIndex = 0;
            for (int j = 0; j < ${e}; j++) {
              int index = round(${d});
              flattenedIndex += index * ${x};
            }
            if (flattenedIndex == coords[0]) {
              sum += ${f};
              found = true;
            }
          }
          setOutput(mix(${g}, sum, float(found)));
        }
      `;}};var mr=class{constructor(t,e,r,n,s,i,c=true,a=false){this.variableNames=["updates","indices","defaultValue"],this.packedInputs=true,this.packedOutput=true,this.outputShape=i;let l=A(s.length),u=A(i.length),p="";r===1?p="i":r===2&&(p="i, j");let d=`getIndices(${p})`,m="";n===1?m="i":n===2&&(m="i, coords[1]");let f=`getUpdates(${m})`,h="";a&&(h="coords[0], coords[1]");let g=`getDefaultValue(${h})`,x=e>1?"strides[j]":"strides",C=e>1?"strides[j + 1]":"strides";this.userCode=`
        ${l} strides = ${l}(${s});

        void main() {
          ${u} coords = getOutputCoords();
          vec4 sum = vec4(0.);
          vec4 found = vec4(0.);
          for (int i = 0; i < ${t}; i+=2) {
            ivec2 flattenedIndex = ivec2(0);
            for (int j = 0; j < ${e}; j+=2) {
              ivec4 index = round(${d});
              flattenedIndex += index.xz * ${x};
              if (j + 1 < ${e}) {
                flattenedIndex += index.yw * ${C};
              }
            }
            if (flattenedIndex[0] == coords[0] || flattenedIndex[1] == coords[0] ||
                flattenedIndex[0] == coords[0] + 1 || flattenedIndex[1] == coords[0] + 1) {
              vec4 updVals = ${f};
              if (flattenedIndex[0] == coords[0]) {
                sum.xy += updVals.xy;
                found.xy = vec2(1.);
              } else if (flattenedIndex[0] == coords[0] + 1) {
                sum.zw += updVals.xy;
                found.zw = vec2(1.);
              }
              if (flattenedIndex[1] == coords[0]) {
                sum.xy += updVals.zw;
                found.xy = vec2(1.);
              } else if (flattenedIndex[1] == coords[0] + 1) {
                sum.zw += updVals.zw;
                found.zw = vec2(1.);
              }
            }
          }
          setOutput(mix(${g}, sum, found));
        }
      `;}};function Ag(o){let{inputs:t,backend:e,attrs:r}=o,{indices:n,updates:s}=t,{shape:i}=r,{sliceRank:c,numUpdates:a,sliceSize:l,strides:u,outputSize:p}=kp$1.calculateShapes(s,n,i),d=[p/l,l];if(p===0)return e.makeTensorInfo(i,n.dtype);let m=T({inputs:{x:n},backend:e,attrs:{shape:[a,c]}}),f=T({inputs:{x:s},backend:e,attrs:{shape:[a,l]}}),h=e.makeTensorInfo([],"float32",new Float32Array([0])),g;O$1().getBool("WEBGL_PACK")?g=new mr(a,c,m.shape.length,f.shape.length,u,d):g=new ke(a,c,m.shape.length,f.shape.length,u,d);let x=e.runWebGLProgram(g,[f,m,h],f.dtype),C=T({inputs:{x},backend:e,attrs:{shape:i}});return e.disposeIntermediateTensorInfo(m),e.disposeIntermediateTensorInfo(f),e.disposeIntermediateTensorInfo(x),e.disposeIntermediateTensorInfo(h),C}var xd={kernelName:Pc$1,backendName:"webgl",kernelFunc:Ag};vS();vS();var fr=class{constructor(t,e,r,n){this.variableNames=["sortedSequence","values"],this.customUniforms=[{name:"numInputs",type:"int"}],this.outputShape=[t,r];let s="while (left < right) {",i=`for (int i = 0; i < ${Math.ceil(Math.log2(e+1))}; ++i) { if (left >= right) break;`,c=O$1().getNumber("WEBGL_VERSION")===2?s:i,a=n==="left"?"<":"<=";this.userCode=`
       int findBound(int batch, float value) {
         int left = 0;
         int right = numInputs;
         int mid;
         ${c}
           mid = (left + right) / 2;
           if (getSortedSequence(batch, mid) ${a} value) {
             left = mid + 1;
           } else {
             right = mid;
           }
         }
         return right;
       }

       void main() {
         ivec2 coords = getOutputCoords();
         int batch = coords[0];
         int valueIndex = coords[1];

         float value = getValues(batch, valueIndex);

         setOutput(float(findBound(batch, value)));
       }
     `;}};function Fg(o){let{inputs:t,backend:e,attrs:r}=o,{sortedSequence:n,values:s}=t,{side:i}=r,c=new fr(n.shape[0],n.shape[1],s.shape[1],i),a=[[n.shape[1]]];return e.runWebGLProgram(c,[n,s],"int32",a)}var gd={kernelName:Wc$1,backendName:"webgl",kernelFunc:Fg};vS();var hr=class{constructor(t,e,r){this.variableNames=["c","a","b"],this.outputShape=e;let n,s;if(r>4)throw Error(`Where for rank ${r} is not yet supported`);if(r===1)s="resRC",n="resRC";else {let c=["resRC.x","resRC.y","resRC.z","resRC.w"],a=[],l=[];for(let u=0;u<e.length;u++)l.push(`${c[u]}`),u<t&&a.push(`${c[u]}`);n=a.join(),s=l.join();}let i=A(r);this.userCode=`
      void main() {
        ${i} resRC = getOutputCoords();
        float cVal = getC(${n});
        if (cVal >= 1.0) {
          setOutput(getA(${s}));
        } else {
          setOutput(getB(${s}));
        }
      }
    `;}};function Dg(o){let{inputs:t,backend:e}=o,{condition:r,t:n,e:s}=t,i=new hr(r.shape.length,n.shape,n.shape.length);return e.runWebGLProgram(i,[r,n,s],Gr$1(n.dtype,s.dtype))}var Cd={kernelName:qc$1,backendName:"webgl",kernelFunc:Dg};vS();var Pg=`
  // Stable and Attracting Fixed Point (0, 1) for Normalized Weights.
  // see: https://arxiv.org/abs/1706.02515
  float scaleAlpha = ${kp$1.SELU_SCALEALPHA};
  float scale = ${kp$1.SELU_SCALE};
  return (x >= 0.0) ? scale * x : scaleAlpha * (exp(x) - 1.0);
`,Og=N({opSnippet:Pg}),bd={kernelName:Uc$1,backendName:"webgl",kernelFunc:Og};vS();var Lg=ie+`
  return 1.0 / (1.0 + exp(-1.0 * x));
`,Bg=`
  vec4 result = 1.0 / (1.0 + exp(-1.0 * x));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,Ug=N({opSnippet:Lg,packedOpSnippet:Bg,cpuKernelImpl:Kc}),vd={kernelName:Hc$1,backendName:"webgl",kernelFunc:Ug};vS();var Vg=`
  if (isnan(x)) { return 0.0; }
  return sign(x);
`,Wg=N({opSnippet:Vg}),$d={kernelName:Vc$1,backendName:"webgl",kernelFunc:Wg};vS();var Mg=ie+`
  return sin(x);
`,Gg=`
  vec4 result = sin(x);
  bvec4 isNaN = isnan(x);
  ${oe}
  return result;
`,zg=N({opSnippet:Mg,packedOpSnippet:Gg}),Sd={kernelName:"Sin",backendName:"webgl",kernelFunc:zg};vS();var Hg=`
  float e2x = exp(x);
  return (e2x - 1.0 / e2x) / 2.0;
`,Xg=N({opSnippet:Hg}),yd={kernelName:Kc$1,backendName:"webgl",kernelFunc:Xg};vS();var Kg=`
  float epsilon = 1.1920928955078125e-7;
  float threshold = log(epsilon) + 2.0;

  bool too_large = x > -threshold;
  bool too_small = x < threshold;

  float result;
  float exp_x = exp(x);

  if (too_large){
    result = x;
  }
  else if (too_small){
    result = exp_x;
  }
  else{
    result = log(exp_x + 1.0);
  }
  return result;
`,qg=N({opSnippet:Kg}),Rd={kernelName:jc$1,backendName:"webgl",kernelFunc:qg};vS();var jg=o=>{let{inputs:t,backend:e,attrs:r}=o,{x:n}=t,{blockShape:s,paddings:i}=r;R.assert(n.shape.length<=4,()=>"spaceToBatchND for rank > 4 with a WebGL backend not implemented yet");let c=s.reduce((x,C)=>x*C),a=[[0,0]];a.push(...i);for(let x=1+s.length;x<n.shape.length;++x)a.push([0,0]);let l=[],u=An({inputs:{x:n},backend:e,attrs:{paddings:a,constantValue:0}}),p=kp$1.getReshaped(u.shape,s,c,false),d=kp$1.getPermuted(p.length,s.length,false),m=kp$1.getReshapedPermuted(u.shape,s,c,false),f=T({inputs:{x:u},backend:e,attrs:{shape:p}}),h=B({inputs:{x:f},backend:e,attrs:{perm:d}}),g=T({inputs:{x:h},backend:e,attrs:{shape:m}});return l.push(u),l.push(f),l.push(h),l.forEach(x=>e.disposeIntermediateTensorInfo(x)),g},Td={kernelName:Jc$1,backendName:"webgl",kernelFunc:jg};vS();function Yg(o){let{inputs:t,backend:e}=o,{indices:r,values:n,denseShape:s,defaultValue:i}=t;if(s.shape.length!==1)throw new Error(`Dense shape must be a vector, saw:
         ${s.shape}`);if(r.shape.length!==2)throw new Error(`Indices must be a matrix, saw:
         ${r.shape}`);if(n.shape.length!==1)throw new Error(`Values must be a vector, saw:
         ${n.shape}`);if(i.shape.length!==0)throw new Error(`Default value must be a scalar, saw:
        ${i.shape}`);let c=e.readSync(r.dataId),a=e.readSync(n.dataId),l=e.readSync(s.dataId),u=e.readSync(i.dataId)[0],[p,d,m,f,h]=jc(c,r.shape,r.dtype,a,n.dtype,l,u);return [e.makeTensorInfo(d,r.dtype,p),e.makeTensorInfo([d[0]],n.dtype,m),e.makeTensorInfo([f.length],"bool",new Uint8Array(f.map(g=>Number(g)))),e.makeTensorInfo([h.length],r.dtype,new Int32Array(h))]}var wd={kernelName:Qc$1,backendName:"webgl",kernelFunc:Yg};vS();function Qg(o){let{inputs:t,backend:e}=o,{inputIndices:r,inputShape:n,newShape:s}=t;if(r.shape.length!==2)throw new Error(`Input indices should be a matrix but received shape ${r.shape}`);if(n.shape.length!==1)throw new Error(`Input shape should be a vector but received shape ${n.shape}`);if(s.shape.length!==1)throw new Error(`Target shape should be a vector but received shape ${s.shape}`);let i=Array.from(e.readSync(n.dataId)),c=e.readSync(r.dataId),a=Array.from(e.readSync(s.dataId)),[l,u,p]=Yc(c,r.shape,r.dtype,i,a);return [e.makeTensorInfo(u,r.dtype,l),e.makeTensorInfo([p.length],s.dtype,new Int32Array(p))]}var Id={kernelName:tu$1,backendName:"webgl",kernelFunc:Qg};vS();function Zg(o){let{inputs:t,backend:e}=o,{data:r,indices:n,segmentIds:s}=t;if(r.shape.length<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(n.shape.length!==1)throw new Error(`Indices should be a vector but received shape
              ${n.shape}`);if(s.shape.length!==1)throw new Error(`Segment ids should be a vector but received shape
              ${s.shape}`);let i=e.readSync(r.dataId),c=e.readSync(n.dataId),a=e.readSync(s.dataId),[l,u]=jt(i,r.shape,r.dtype,c,a,true);return e.makeTensorInfo(u,r.dtype,l)}var Nd={kernelName:eu$1,backendName:"webgl",kernelFunc:Zg};vS();function Jg(o){let{inputs:t,backend:e}=o,{data:r,indices:n,segmentIds:s}=t;if(r.shape.length<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(n.shape.length!==1)throw new Error(`Indices should be a vector but received shape
             ${n.shape}`);if(s.shape.length!==1)throw new Error(`Segment ids should be a vector but received shape
             ${s.shape}`);let i=e.readSync(r.dataId),c=e.readSync(n.dataId),a=e.readSync(s.dataId),[l,u]=jt(i,r.shape,r.dtype,c,a);return e.makeTensorInfo(u,r.dtype,l)}var Ed={kernelName:ru$1,backendName:"webgl",kernelFunc:Jg};vS();function eC(o){let{inputs:t,backend:e,attrs:r}=o,{sparseIndices:n,sparseValues:s,defaultValue:i}=t,{outputShape:c}=r,{sliceRank:a,numUpdates:l,sliceSize:u,strides:p,outputSize:d}=kp$1.calculateShapes(s,n,c),m=false;if(s.dtype==="string"){let x=e.bufferSync(n),C=e.bufferSync(s),y=R.decodeString(e.readSync(i.dataId)[0]),R$1=Xc(x,C,c,d,u,l,a,p,y,m);return e.makeTensorInfo(c,R$1.dtype,R$1.values)}let f=new ke(l,a,n.shape.length,s.shape.length,p,[d,1],m),h=e.runWebGLProgram(f,[s,n,i],s.dtype),g=T({inputs:{x:h},backend:e,attrs:{shape:c}});return e.disposeIntermediateTensorInfo(h),g}var kd={kernelName:ou$1,backendName:"webgl",kernelFunc:eC};vS();function tC(o){let{inputs:t,backend:e,attrs:r}=o,{x:n}=t,{numOrSizeSplits:s,axis:i}=r,c=R.parseAxisParam(i,n.shape)[0],a=kp$1.prepareSplitSize(n,s,c),l=n.shape.length,u=new Array(l).fill(0),p=n.shape.slice();return a.map(d=>{let m=[...p];m[c]=d;let f=pe({inputs:{x:n},backend:e,attrs:{begin:u,size:m}});return u[c]+=d,f})}var _d={kernelName:Zc$1,backendName:"webgl",kernelFunc:tC};vS();var Ad="return sqrt(x);",oC=N({opSnippet:Ad,packedOpSnippet:Ad,cpuKernelImpl:Qc}),Fd={kernelName:Xc$1,backendName:"webgl",kernelFunc:oC};vS();var rC="return x * x;",nC=N({opSnippet:rC}),Dd={kernelName:b0,backendName:"webgl",kernelFunc:nC};vS();var Pd="return (a - b) * (a - b);",sC=O({opSnippet:Pd,packedOpSnippet:Pd}),Od={kernelName:nu$1,backendName:"webgl",kernelFunc:sC};vS();function iC(o){let{inputs:t,backend:e,attrs:r}=o,{x:n}=t;if(n.dtype!=="string")throw new Error("Input must be of datatype string");let s=e.readSync(n.dataId),i=kp$1.fromUint8ToStringArray(s),c=Zc(i,"string",r);return e.makeTensorInfo(n.shape,"string",c)}var Ld={kernelName:su$1,backendName:"webgl",kernelFunc:iC};vS();function aC({inputs:o,attrs:t,backend:e}){let{x:r}=o,n=z+`
    return x > 0.0 ? 1.0 : float(${t.alpha});
  `,s=new H(r.shape,n);return e.runWebGLProgram(s,[r],r.dtype)}var Bd={kernelName:xu$1,backendName:"webgl",kernelFunc:aC};vS();var xr=class{constructor(t,e,r){this.variableNames=["x"],this.outputShape=r;let n=r.length,s=A(r.length),i=A(r.length),c="";if(n===1)c="coords * strides + begin";else {let a=0;c=r.map((l,u)=>(a++,r.length===1?`coords * strides[${u}] + begin[${u}]`:`coords[${a-1}] * strides[${u}] + begin[${u}]`)).join(",");}this.userCode=`
      ${s} begin = ${s}(${t});
      ${s} strides = ${s}(${e});

      void main() {
        ${i} coords = getOutputCoords();
        setOutput(getX(${c}));
      }
    `;}};function cC(o){let{inputs:t,backend:e,attrs:r}=o,{x:n}=t,{begin:s,end:i,strides:c,beginMask:a,endMask:l,ellipsisMask:u,newAxisMask:p,shrinkAxisMask:d}=r,{finalShapeSparse:m,finalShape:f,isIdentity:h,sliceDim0:g,isSimpleSlice:x,begin:C,end:y,strides:R$1}=Wn.sliceInfo(n.shape,s,i,c,a,l,u,p,d),w;if(h)w=T({inputs:{x:n},backend:e,attrs:{shape:f}});else if(g||x){R.assert(n.shape.length>=1,()=>`Input must have rank at least 1, got: ${n.shape.length}`);let _=Wn.computeOutShape(C,y,R$1),E=pe({inputs:{x:n},backend:e,attrs:{begin:C,size:_}});w=T({inputs:{x:E},backend:e,attrs:{shape:f}}),e.disposeIntermediateTensorInfo(E);}else if(e.shouldExecuteOnCPU([n])){let E=e.readSync(n.dataId),P=Ct$1(n.shape,n.dtype,E),D=Jc(m,P,R$1,C);w=e.makeTensorInfo(f,n.dtype,D.values);}else {let E=new xr(C,R$1,m);w=e.runWebGLProgram(E,[n],n.dtype);}let F=T({inputs:{x:w},backend:e,attrs:{shape:f}});return e.disposeIntermediateTensorInfo(w),F}var Ud={kernelName:iu$1,backendName:"webgl",kernelFunc:cC};vS();function lC(o){let{inputs:t,backend:e,attrs:r}=o,{separator:n,nGramWidths:s,leftPad:i,rightPad:c,padWidth:a,preserveShortSequences:l}=r,{data:u,dataSplits:p}=t,d=e.readSync(u.dataId),m=e.readSync(p.dataId),[f,h]=el(d,m,n,s,i,c,a,l);return [e.makeTensorInfo([f.length],"string",f),e.makeTensorInfo(p.shape,"int32",h)]}var Vd={kernelName:au$1,backendName:"webgl",kernelFunc:lC};vS();function uC(o){let{inputs:t,backend:e,attrs:r}=o,{skipEmpty:n}=r,{input:s,delimiter:i}=t;if(s.dtype!=="string")throw new Error("Input must be of datatype string");if(s.shape.length!==1)throw new Error(`Input must be a vector, got shape: ${s.shape}`);if(i.shape.length!==0)throw new Error(`Delimiter must be a scalar, got shape: ${i.shape}`);let c=e.readSync(s.dataId),a=e.readSync(i.dataId)[0],[l,u,p]=tl(c,a,n),d=u.length;return [e.makeTensorInfo([d,2],"int32",l),e.makeTensorInfo([d],"string",u),e.makeTensorInfo([2],"int32",new Int32Array(p))]}var Wd={kernelName:cu$1,backendName:"webgl",kernelFunc:uC};vS();function pC(o){let{inputs:t,backend:e,attrs:r}=o,{numBuckets:n}=r,{input:s}=t;if(s.dtype!=="string")throw new Error("Input must be of datatype string");if(n<=0)throw new Error("Number of buckets must be at least 1");let i=e.readSync(s.dataId),c=ol(i,n);return e.makeTensorInfo(s.shape,"int32",c)}var Md={kernelName:uu$1,backendName:"webgl",kernelFunc:pC};vS();var dC="return tan(x);",mC=N({opSnippet:dC}),Gd={kernelName:"Tan",backendName:"webgl",kernelFunc:mC};vS();var fC=`
  float e2x = exp(-2.0 * abs(x));
  return sign(x) * (1.0 - e2x) / (1.0 + e2x);
`,hC=N({opSnippet:fC}),zd={kernelName:lu$1,backendName:"webgl",kernelFunc:hC};vS();function xC(o){let {inputs:t,backend:e,attrs:r}=o,{tensor:n,indices:s,updates:i}=t,{sliceRank:c,numUpdates:a,sliceSize:l,strides:u,outputSize:p}=kp$1.calculateShapes(i,s,n.shape),d=[p/l,l];if(p===0)return e.makeTensorInfo(n.shape,s.dtype);let m=T({inputs:{x:s},backend:e,attrs:{shape:[a,c]}}),f=T({inputs:{x:i},backend:e,attrs:{shape:[a,l]}}),h=T({inputs:{x:n},backend:e,attrs:{shape:d}}),g=new ke(a,c,m.shape.length,f.shape.length,u,d,false,true),x=e.runWebGLProgram(g,[f,m,h],h.dtype),C=T({inputs:{x},backend:e,attrs:{shape:n.shape}});return e.disposeIntermediateTensorInfo(m),e.disposeIntermediateTensorInfo(f),e.disposeIntermediateTensorInfo(h),e.disposeIntermediateTensorInfo(x),C}var Hd={kernelName:Lc$1,backendName:"webgl",kernelFunc:xC};vS();var gr=class{constructor(t,e){this.variableNames=["A"];let r=new Array(t.length);for(let i=0;i<r.length;i++)r[i]=t[i]*e[i];this.outputShape=r,this.rank=r.length;let n=A(this.rank),s=gC(t);this.userCode=`
      void main() {
        ${n} resRC = getOutputCoords();
        setOutput(getA(${s}));
      }
    `;}};function gC(o){let t=o.length;if(t>5)throw Error(`Tile for rank ${t} is not yet supported`);if(t===1)return `imod(resRC, ${o[0]})`;let e=["resRC.x","resRC.y","resRC.z","resRC.w","resRC.u"],r=[];for(let n=0;n<o.length;n++)r.push(`imod(${e[n]}, ${o[n]})`);return r.join()}function Dn(o){let{inputs:t,backend:e,attrs:r}=o,{x:n}=t,{reps:s}=r;if(n.dtype==="string"||n.shape.length>5){let a=e.readSync(n.dataId),l=n.dtype==="string"?a.map(d=>R.decodeString(d)):a,u=Ct$1(n.shape,n.dtype,l),p=nl(u,s);return e.makeTensorInfo(p.shape,p.dtype,p.values)}let i=new gr(n.shape,s);return e.runWebGLProgram(i,[n],n.dtype)}var Xd={kernelName:tn$1,backendName:"webgl",kernelFunc:Dn};vS();var Cr=class{constructor(t){this.variableNames=["x","indices"],this.customUniforms=[{name:"n",type:"int"},{name:"firstPass",type:"int"},{name:"negativeInf",type:"float"},{name:"dir",type:"int"},{name:"inc",type:"int"}],this.outputShape=t,this.userCode=`
       void main() {
         ivec2 coords = getOutputCoords();
         int batch = coords[0];
         int elemIdx = coords[1];

         // We compare elements pair-wise within a group of size 2 * inc.
         // The comparing rule for each group alternates between ascending
         // and descending. Within each group, we compare each pair at
         // positions i and i+inc. To decide whether an element at position i
         // is x0 or x1, we mod it by 2 * inc, if the result is smaller than
         // inc, it is in the first half of the group, we denote it as x0,
         // otherwise we denote it as x1.
         // For example, as shown in the Bitonic top K paper referenced above,
         // Figure5(a) shows that element[1] is in the
         // second half of the group when group size is 2, but it is in the
         // first half of the group when group size is 4.

         bool isFirstInPair = imod(elemIdx, 2 * inc) < inc;
         int i = isFirstInPair ? elemIdx : elemIdx - inc;

         int i0 = firstPass == 1 ? i : int(getIndices(batch, i));
         int i1 = firstPass == 1 ? i + inc : int(getIndices(batch, i + inc));
         float x0 = i0 < n ? getX(batch, i0) : negativeInf;
         float x1 = i1 < n ? getX(batch, i1) : negativeInf;

         // Denotes which direction indices are in (ascending or descending).
         bool reverse = imod(elemIdx, 2 * dir) >= dir;
         bool isGreater = x0 > x1 || (x0 == x1 && i1 > i0);
         if (reverse == isGreater) { // Elements in opposite order of direction
           int iTemp = i0;
           i0 = i1;
           i1 = iTemp;
         }
         if (isFirstInPair) {
            setOutput(float(i0));
         } else {
            setOutput(float(i1));
         }
       }
     `;}},br=class{constructor(t){this.variableNames=["x","indices"],this.customUniforms=[{name:"n",type:"int"},{name:"firstPass",type:"int"},{name:"k",type:"int"}],this.outputShape=t,this.userCode=`
    void main() {
         // Takes max of indices (0, k), (1, k + 1), (2, k + 2) ...
         ivec2 coords = getOutputCoords();
         int batch = coords[0];
         int elemIdx = coords[1];

         // The output size is half of the previous size.
         // If the previous sequence is | | | | _ _ _ _  | | | |  _ _ _ _ (k=4),
         // we only need to output the indices at positions |, the indices at
         // positions _ can be thrown away, see Figure5(b) After Phase 2
         // (Merge phase) in the Bitonic Top K paper referenced above.
         // For example, the paper shows we only need to output the orange bars.
         // The output sequence should look like this | | | | | | | |.
         // Because the sequence is halved, to map the output index back
         // to the previous sequence to find the corresponding value,
         // we need to double the index. When we double the index,
         // we basically interpolate a position, so 2i looks like
         // | _ | _ | _ | _ | _ | _ | _. We move the | to the first k position
         // of each 2k positions by - elemIdx % k. E.g. for output at
         // index 4,5,6,7, we want to get the corresponding element at
         // original index 8,9,10,11, for output at index 8,9,10,11,
         // we want to get the corresponding element at original index
         // 16,17,18,19, so on and so forth.

         int i = elemIdx < k ? elemIdx : (elemIdx * 2 - imod(elemIdx, k));
         int i0 = firstPass == 1 ? i : int(getIndices(batch, i));
         int i1 = firstPass == 1 ? i + k : int(getIndices(batch, i + k));

         float x0 = getX(batch, i0);
         float x1 = i1 < n ? getX(batch, i1) : x0;

         setOutput(x0 >= x1 ? float(i0) : float(i1));
       }
     `;}};function Me(o,t){t!==null&&o.disposeIntermediateTensorInfo(t);}function Kd(o){let t=1;for(;t<o;)t*=2;return t}function CC(o){let{inputs:t,backend:e,attrs:r}=o,{x:n}=t,{k:s,sorted:i}=r,c=O$1().getNumber("TOPK_LAST_DIM_CPU_HANDOFF_SIZE_THRESHOLD"),a=O$1().getNumber("TOPK_K_CPU_HANDOFF_THRESHOLD"),l=n.shape,u=l[l.length-1];if(e.shouldExecuteOnCPU([n])||u<c||s>a){let D=e.readSync(n.dataId),[M,G]=sl(D,l,n.dtype,s,i);return [e.makeTensorInfo(M.shape,M.dtype,M.values),e.makeTensorInfo(G.shape,G.dtype,G.values)]}if(s===0)return l[l.length-1]=0,[e.makeTensorInfo(l,n.dtype,[]),e.makeTensorInfo(l,"int32",[])];if(u===1)return [n,Se({attrs:{shape:l,dtype:"int32",value:0},backend:e})];let p=e.texData.get(n.dataId),d=p!==null&&p.isPacked,m=d?e.unpackTensor(n):n,h=R.sizeFromShape(l)/u,g=T({inputs:{x:m},attrs:{shape:[h,u]},backend:e});d&&Me(e,m);let x=Kd(s),C=Kd(u),y=null,R$1=()=>y===null?[g,g]:[g,y],w=(D,M,G)=>{let de=R$1(),Z=new Cr(G),se=[[u],[y===null?1:0],[Number.NEGATIVE_INFINITY],[D],[M]],ae=y;y=e.runWebGLProgram(Z,de,"int32",se),Me(e,ae);};for(let D=1;D<x;D*=2){let M=D*2;for(let G=D;G>=1;G/=2)w(M,G,[h,C]);}for(let D=C;D>x;D/=2){let M=R$1(),G=new br([h,D/2]),Z=[[u],[y===null?1:0],[x]],ne=y;y=e.runWebGLProgram(G,M,"int32",Z),Me(e,ne);let se=x/2,ae=se*2;for(let q=se;q>=1;q/=2)w(ae,q,y.shape);}let F=y;y=pe({inputs:{x:y},backend:e,attrs:{begin:0,size:[h,s]}}),Me(e,F);let _=In({inputs:{x:g,indices:y},backend:e,attrs:{axis:1,batchDims:1}});Me(e,g);let E=l.slice(0,-1);E.push(s),F=y,y=T({inputs:{x:y},attrs:{shape:E},backend:e}),Me(e,F);let P=_;return _=T({inputs:{x:_},attrs:{shape:E},backend:e}),Me(e,P),[_,y]}var qd={kernelName:pu$1,backendName:"webgl",kernelFunc:CC};vS();var vr=class{constructor(t,e,r,n,s,i){this.variableNames=["Image","Transforms"],this.outputShape=i;let c=r==="nearest"?1:2,a;switch(n){case "constant":a=1;break;case "reflect":a=2;break;case "wrap":a=3;break;case "nearest":a=4;break;default:a=1;break}this.userCode=`
            float mapCoord(float outCoord, float len) {
              float inCoord = outCoord;
              if(${a} == 2) {
                if (inCoord < 0.0) {
                  if (len <= 1.0) {
                    inCoord = 0.0;
                  } else {
                    float sz2 = 2.0 * len;
                    if (inCoord < sz2) {
                      inCoord = sz2 * float(int(float(-inCoord / sz2))) +
                      inCoord;
                    }
                    inCoord = inCoord < -len ? inCoord + sz2 : -inCoord - 1.0;
                  }
                } else if (inCoord > len - 1.0) {
                  if (len <= 1.0) {
                    inCoord = 0.0;
                  } else {
                    float sz2 = 2.0 * len;
                    inCoord -= sz2 * float(int(float(inCoord / sz2)));
                    if (inCoord >= len) {
                      inCoord = sz2 - inCoord - 1.0;
                    }
                  }
                }
                return clamp(inCoord, 0.0, len - 1.0);
              } else if (${a} == 3) {
                if (inCoord < 0.0) {
                  if (len <= 1.0) {
                    inCoord = 0.0;
                  } else {
                    float sz = len - 1.0;
                    inCoord += len * (float(int(float(-inCoord / sz))) + 1.0);
                  }
                } else if (inCoord > len - 1.0) {
                  if (len <= 1.0) {
                    inCoord = 0.0;
                  } else {
                    float sz = len - 1.0;
                    inCoord -= len * float(int(float(inCoord / sz)));
                  }
                }
                return clamp(inCoord, 0.0, len - 1.0);
              } else if (${a} == 4) {
                return clamp(outCoord, 0.0, len - 1.0);
              } else {
                return outCoord;
              }
            }

            float readWithFillValue(int batch, int coordY, int coordX,
              int channel) {
              float outputValue;
              if (0 <= coordY && coordY < ${t} && 0 <= coordX && coordX < ${e}) {
                  outputValue = getImage(batch, coordY, coordX, channel);
              } else {
                outputValue = float(${s});
              }
              return outputValue;
            }

            void main() {
              ivec4 coords = getOutputCoords();
              float outputValue;
              int batch = coords[0];
              int x = coords[2];
              int y = coords[1];
              int channel = coords[3];
              float xf = float(x);
              float yf = float(y);
              float a1 = getTransforms(batch, 0);
              float a2 = getTransforms(batch, 1);
              float a3 = getTransforms(batch, 2);
              float b1 = getTransforms(batch, 3);
              float b2 = getTransforms(batch, 4);
              float b3 = getTransforms(batch, 5);
              float c1 = getTransforms(batch, 6);
              float c2 = getTransforms(batch, 7);
              float projection = c1 * xf + c2 * yf + 1.0;
              if (projection == 0.0) {
                outputValue = float(${s});
              } else {
                float inX = (a1 * xf + a2 * yf + a3) / projection;
                float inY = (b1 * xf + b2 * yf + b3) / projection;
                float mapX = mapCoord(inX, float(${e}));
                float mapY = mapCoord(inY, float(${t}));

                if (${c} == 1) {
                  int coordY = int(round(mapY));
                  int coordX = int(round(mapX));
                  outputValue = readWithFillValue(batch, coordY, coordX,
                    channel);
                } else {
                  float yFloor = floor(mapY);
                  float xFloor = floor(mapX);
                  float yCeil = yFloor + 1.0;
                  float xCeil = xFloor + 1.0;
                  float valueYFloor = (xCeil - mapX) *
                  readWithFillValue(batch, int(yFloor), int(xFloor), channel) +
                  (mapX - xFloor) *
                  readWithFillValue(batch, int(yFloor), int(xCeil), channel);
                  float valueYCeil = (xCeil - mapX) *
                  readWithFillValue(batch, int(yCeil), int(xFloor), channel) +
                  (mapX - xFloor) *
                  readWithFillValue(batch, int(yCeil), int(xCeil), channel);
                  outputValue = (yCeil - mapY) * valueYFloor +
                  (mapY - yFloor) * valueYCeil;
                }
              }
              setOutput(outputValue);
            }
        `;}};function bC(o){let{inputs:t,backend:e,attrs:r}=o,{image:n,transforms:s}=t,{interpolation:i,fillMode:c,fillValue:a,outputShape:l}=r,[u,p,d,m]=n.shape,[f,h]=l??[p,d],g=[u,f,h,m],x=new vr(p,d,i,c,a,g);return e.runWebGLProgram(x,[n,s],"float32")}var jd={kernelName:mu$1,backendName:"webgl",kernelFunc:bC};vS();function vC(o){let{inputs:t,attrs:e,backend:r}=o,{axis:n}=e,{x:s}=t;ce(s,"unique"),console.warn("WARNING: ","UI might be locked temporarily as data is being downloaded");let i=r.readSync(s.dataId),{outputValues:c,outputShape:a,indices:l}=il(i,n,s.shape,s.dtype);return [r.makeTensorInfo(a,s.dtype,c),r.makeTensorInfo([l.length],"int32",l)]}var Yd={kernelName:fu$1,backendName:"webgl",kernelFunc:vC};vS();function $C(o){let{inputs:t,backend:e,attrs:r}=o,{value:n}=t,{axis:s}=r;s<0&&(s+=n.shape.length);let i=n,c=i.shape.length,a=n.shape[s],l=new Array(c-1),u=0;for(let h=0;h<c;h++)h!==s&&(l[u++]=i.shape[h]);let p=[],d=new Array(c).fill(0),m=i.shape.slice();m[s]=1;let f=new Array(a);for(let h=0;h<f.length;h++){d[s]=h;let g=pe({inputs:{x:i},backend:e,attrs:{begin:d,size:m}}),x=T({inputs:{x:g},backend:e,attrs:{shape:l}});f[h]=x,p.push(g);}return p.forEach(h=>e.disposeIntermediateTensorInfo(h)),f}var Qd={kernelName:hu$1,backendName:"webgl",kernelFunc:$C};vS();var $r=class{constructor(t,e){this.variableNames=["x","segmentIds"];let r=t.windowSize,n=t.batchSize,s=t.inSize,i=t.numSegments,c=i*Math.ceil(s/r);this.outputShape=[n,c];let a="0.0",l="sumValue",u=Math.floor(r/4)*4,p=r%4,d=`
        sumValue += dot(values, segFilter);
    `,m="";s%r>0&&(m=`
        if (inIdx < 0 || inIdx >= ${s}) {
          return initializationValue;
        }
      `);let f="";s%r>0&&(f=`
        if (inIdx < 0 || inIdx >= ${s}) {
          return -1.0;
        }
      `),this.userCode=`
      const float initializationValue = ${a};

      float getValue(int batch, int inIdx) {
        ${m}
        return getX(batch, inIdx);
      }

      float getSegmentIdAtIndex(int inIdx) {
        ${f}
        return getSegmentIds(inIdx);
      }

      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = int(floor(float(outIdx) / float(
          ${i})) * float(${r}));
        int currentSeg = int(mod(float(outIdx), float(${i})));

        float sumValue = 0.0;

        for (int i = 0; i < ${u}; i += 4) {
          int inIdx = inOffset + i;
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            getValue(batch, inIdx + 3)
          );

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 2)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 3)) == currentSeg ? 1 : 0
          );

          ${d}
        }

        int inIdx = inOffset + ${u};
        if (${p===1}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            initializationValue,
            initializationValue,
            initializationValue
          );

          int inIdxSeg = int(getSegmentIdAtIndex(inIdx));

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            0,
            0,
            0
          );

          ${d}
        } else if (${p===2}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            initializationValue,
            initializationValue
          );

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,
              0,
              0
          );

          ${d}
        } else if (${p===3}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            initializationValue
          );

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 2)) == currentSeg ? 1 : 0,
            0
          );

          ${d}
        }
        setOutput(${l});
      }
    `;}};function SC(o){let{inputs:t,backend:e,attrs:r}=o,{x:n,segmentIds:s}=t,{numSegments:i}=r,c=n.shape.length,a=[],l=0,u=kp$1.getAxesPermutation([l],c),p=n;u!=null&&(p=B({inputs:{x:n},backend:e,attrs:{perm:u}}),a.push(p),l=kp$1.getInnerMostAxes(1,c)[0]);let d=kp$1.segment_util.computeOutShape(p.shape,l,i),m=R.sizeFromShape([p.shape[l]]),f=T({inputs:{x:p},backend:e,attrs:{shape:[-1,m]}});a.push(f);let h=Dm$1(n.dtype),g=(R,w,F,_,E)=>{let P=R.shape[0],D=R.shape[1],M=kp$1.segment_util.segOpComputeOptimalWindowSize(D,E),G={windowSize:M,inSize:D,batchSize:P,numSegments:E},de=new $r(G,w),Z=e.compileAndRun(de,[R,F],_);if(a.push(Z),Z.shape[1]===E)return Z;let ne=Fn({backend:e,attrs:{start:0,stop:E,step:1,dtype:"float32"}}),se=Dn({inputs:{x:ne},backend:e,attrs:{reps:[D/M]}});return a.push(ne),a.push(se),g(Z,w,se,_,E)},x=g(f,"unsortedSegmentSum",s,h,i),C=T({inputs:{x},backend:e,attrs:{shape:d}}),y=C;if(u!=null){a.push(C);let R=kp$1.getUndoAxesPermutation(u);y=B({inputs:{x:y},backend:e,attrs:{perm:R}});}return a.forEach(R=>e.disposeIntermediateTensorInfo(R)),y}var Zd={kernelName:du$1,backendName:"webgl",kernelFunc:SC};var yC=[Dl,Ol,Ll,Bl,Vl,Wl,Ml,Gl,Xl,Kl,ql,jl,Yl,Ql,Zl,Jl,eu,tu,ou,ru,nu,iu,au,cu,lu,mu,hu,xu,Rl,Cu,vu,$u,Su,yu,Ru,Tu,wu,Iu,Nu,Eu,Au,Fu,Du,Pu,Ou,Lu,Bu,Uu,Vu,Wu,Mu,Gu,zu,Hu,Xu,Ku,ju,Yu,Qu,Zu,ep,tp,op,rp,np,sp,ip,ap,cp,yl,lp,bu,up,pp,dp,Tl,mp,fp,hp,xp,gp,Cp,bp,vp,$p,Sp,Rp,Tp,wp,Ip,Np,Ep,_p,Fp,Dp,Pp,Op,Lp,Mp,Nl,Gp,zp,Hp,Xp,uu,Kp,Yp,Qp,Zp,Jp,wl,ed,td,od,rd,nd,pu,Bp,sd,id,ad,kl,cd,ld,ud,pd,dd,md,fd,hd,xd,gd,Cd,bd,vd,$d,Sd,yd,su,Wp,Rd,Td,wd,Id,Nd,Ed,kd,_d,Fd,Dd,Od,Ld,Bd,Ud,Vd,Wd,Md,Vp,Al,Gd,zd,Hd,Xd,qd,jd,Fl,Yd,Qd,Zd,qp];for(let o of yC)Qp$1(o);export{Le as GPGPUContext,fn as MathBackendWebGL,Sl as forceHalfFloat,pn as gpgpu_util,Rr as setWebGLContext,df as version_webgl,av as webgl,je as webgl_util};