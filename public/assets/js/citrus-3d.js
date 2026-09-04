(() => {
  'use strict';

  const TAU = Math.PI * 2;
  const DPR_CAP = 1.8;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const mat4 = {
    identity() { return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]); },
    multiply(a,b) {
      const o = new Float32Array(16);
      for(let c=0;c<4;c++) for(let r=0;r<4;r++) o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];
      return o;
    },
    perspective(fovy, aspect, near, far) {
      const f=1/Math.tan(fovy/2), nf=1/(near-far);
      return new Float32Array([f/aspect,0,0,0, 0,f,0,0, 0,0,(far+near)*nf,-1, 0,0,(2*far*near)*nf,0]);
    },
    translate(x,y,z) { const m=mat4.identity(); m[12]=x;m[13]=y;m[14]=z;return m; },
    rotateX(a) { const c=Math.cos(a),s=Math.sin(a); return new Float32Array([1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1]); },
    rotateY(a) { const c=Math.cos(a),s=Math.sin(a); return new Float32Array([c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1]); },
    scale(x,y,z) { return new Float32Array([x,0,0,0, 0,y,0,0, 0,0,z,0, 0,0,0,1]); }
  };

  function norm(x,y,z){const l=Math.hypot(x,y,z)||1;return [x/l,y/l,z/l];}

  function addSphere(out, cx,cy,cz, rx,ry,rz, seg=10, rings=7) {
    const base=out.positions.length/3;
    for(let r=0;r<=rings;r++){
      const v=r/rings, ph=v*Math.PI, sp=Math.sin(ph), cp=Math.cos(ph);
      for(let s=0;s<=seg;s++){
        const u=s/seg*TAU, su=Math.sin(u), cu=Math.cos(u);
        const x=sp*cu,y=cp,z=sp*su;
        out.positions.push(cx+x*rx,cy+y*ry,cz+z*rz);
        out.normals.push(x,y,z);
      }
    }
    for(let r=0;r<rings;r++) for(let s=0;s<seg;s++){
      const a=base+r*(seg+1)+s,b=a+1,c=a+(seg+1),d=c+1;
      out.indices.push(a,c,b,b,c,d);
    }
  }

  function addCylinder(out, a,b,r1,r2, seg=7){
    const [ax,ay,az]=a,[bx,by,bz]=b;
    const dx=bx-ax,dy=by-ay,dz=bz-az, len=Math.hypot(dx,dy,dz)||1;
    const [ux,uy,uz]=norm(dx,dy,dz);
    const ref=Math.abs(uy)<.9?[0,1,0]:[1,0,0];
    let nx=uy*ref[2]-uz*ref[1], ny=uz*ref[0]-ux*ref[2], nz=ux*ref[1]-uy*ref[0];
    [nx,ny,nz]=norm(nx,ny,nz);
    const tx=uy*nz-uz*ny, ty=uz*nx-ux*nz, tz=ux*ny-uy*nx;
    const base=out.positions.length/3;
    for(const [p,r] of [[[ax,ay,az],r1],[[bx,by,bz],r2]]) for(let s=0;s<seg;s++){
      const q=s/seg*TAU, cq=Math.cos(q),sq=Math.sin(q);
      const ox=(nx*cq+tx*sq)*r, oy=(ny*cq+ty*sq)*r, oz=(nz*cq+tz*sq)*r;
      out.positions.push(p[0]+ox,p[1]+oy,p[2]+oz);
      out.normals.push(nx*cq+tx*sq,ny*cq+ty*sq,nz*cq+tz*sq);
    }
    for(let s=0;s<seg;s++){const n=(s+1)%seg,a=base+s,b=base+n,c=base+seg+s,d=base+seg+n;out.indices.push(a,c,b,b,c,d);}
    return len;
  }

  function makeGeometry(family){
    const out={positions:[],normals:[],indices:[],groups:[]};
    const trunk=[[0,-2.65,0],[0,-1.7,0.04],[0.05,-.8,0.02],[0.02,0.1,-.02]];
    for(let i=0;i<trunk.length-1;i++) addCylinder(out,trunk[i],trunk[i+1],.23-i*.035,.19-i*.035,9);

    const branches=[
      [[0,.05,0],[ -.55,.75,.18],[-1.25,1.25,.1],[-1.85,1.55,.25]],
      [[0,.08,.01],[ .62,.78,-.15],[1.25,1.25,-.05],[1.78,1.58,.16]],
      [[0.03,.35,0],[ -.22,1.0,-.38],[-.35,1.65,-.5],[-.55,2.1,-.35]],
      [[.06,.36,0],[ .28,1.08,.38],[.42,1.72,.45],[.62,2.12,.25]],
      [[-.45,.78,.16],[-.98,1.18,.55],[-1.3,1.72,.75]],
      [[.56,.82,-.14],[1.0,1.16,-.58],[1.22,1.7,-.68]]
    ];
    branches.forEach((pts,bi)=>{
      for(let i=0;i<pts.length-1;i++) addCylinder(out,pts[i],pts[i+1],.105-i*.018,.088-i*.016,6);
      const tip=pts[pts.length-1];
      for(let j=0;j<4;j++){
        const ang=(j/4)*TAU+bi*.7, q=[tip[0]+Math.cos(ang)*.28,tip[1]+.08+(j%2)*.12,tip[2]+Math.sin(ang)*.3];
        addCylinder(out,tip,q,.055,.032,5);
      }
    });

    const leafPts=[[-1.95,1.6,.35],[-1.45,2.0,.05],[-1.0,2.25,.48],[-.42,2.18,-.36],[.12,2.35,.38],[.72,2.22,.05],[1.35,1.72,.4],[1.82,1.62,-.05],[-.95,1.55,-.8],[.55,1.6,.82]];
    leafPts.forEach((p,i)=>addSphere(out,p[0],p[1],p[2],.48,.2,.72,8,5));

    const fruitCount = family==='orange'?10:family==='mandarina'?12:9;
    const fruitPts=[];
    for(let i=0;i<fruitCount;i++){
      const a=i/fruitCount*TAU + (family==='mandarina'?.25:0), ring=i%3;
      fruitPts.push([Math.cos(a)*(1.25+.12*ring), .95+(i%4)*.32, Math.sin(a)*(0.65+.08*ring)-.05]);
    }
    fruitPts.push([-1.18,1.1,.8],[1.18,1.15,-.8],[.1,1.85,.7]);
    const fruitStart=out.positions.length/3;
    fruitPts.forEach((p,i)=>addSphere(out,p[0],p[1],p[2],family==='mandarina'?.22:.26,family==='mandarina'?.19:.24,family==='mandarina'?.22:.26,10,7));
    out.groups.push({start:fruitStart*1.0,count:out.indices.length});
    return out;
  }

  function shader(gl,type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;}

  function mount(root){
    if(!root || root.dataset.citrus3dMounted==='1') return;
    const old=root.querySelector('svg');
    if(!old) return;
    root.dataset.citrus3dMounted='1';
    const canvas=document.createElement('canvas');
    canvas.className='citrus-3d'; canvas.setAttribute('aria-label','3D citrus orange tree'); canvas.setAttribute('role','img');
    old.replaceWith(canvas);
    const gl=canvas.getContext('webgl',{antialias:true,alpha:true,preserveDrawingBuffer:false});
    if(!gl){root.classList.add('is-3d-fallback');return;}

    const vs=`attribute vec3 aPosition;attribute vec3 aNormal;uniform mat4 uMVP;uniform mat4 uModel;varying vec3 vNormal;varying vec3 vWorld;void main(){vec4 w=uModel*vec4(aPosition,1.0);vWorld=w.xyz;vNormal=mat3(uModel)*aNormal;gl_Position=uMVP*vec4(aPosition,1.0);}`;
    const fs=`precision mediump float;uniform vec3 uBase;uniform vec3 uLight;varying vec3 vNormal;varying vec3 vWorld;void main(){vec3 n=normalize(vNormal);float l=max(dot(n,normalize(uLight-vWorld)),0.0);float rim=pow(1.0-max(dot(n,vec3(0.,0.,1.)),0.0),2.0)*.14;vec3 c=uBase*(.48+.6*l+rim);gl_FragColor=vec4(c,1.0);}`;
    let program;
    try{program=gl.createProgram();gl.attachShader(program,shader(gl,gl.VERTEX_SHADER,vs));gl.attachShader(program,shader(gl,gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);}catch(e){root.classList.add('is-3d-fallback');return;}
    gl.useProgram(program);
    const loc={pos:gl.getAttribLocation(program,'aPosition'),normal:gl.getAttribLocation(program,'aNormal'),mvp:gl.getUniformLocation(program,'uMVP'),model:gl.getUniformLocation(program,'uModel'),base:gl.getUniformLocation(program,'uBase'),light:gl.getUniformLocation(program,'uLight')};
    let currentFamily=(root.closest('.citrus-orchard')?.querySelector('.citrus-sign')?.textContent||'').toLowerCase().includes('mand')?'mandarina':'orange';
    const meshCache={};
    let mesh=meshCache[currentFamily]||(meshCache[currentFamily]=makeGeometry(currentFamily));
    const vb=gl.createBuffer(), nb=gl.createBuffer(), ib=gl.createBuffer();
    let faceCount=mesh.indices.length;
    function upload(m){mesh=m;faceCount=m.indices.length;gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(m.positions),gl.STATIC_DRAW);gl.enableVertexAttribArray(loc.pos);gl.vertexAttribPointer(loc.pos,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,nb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(m.normals),gl.STATIC_DRAW);gl.enableVertexAttribArray(loc.normal);gl.vertexAttribPointer(loc.normal,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(m.indices),gl.STATIC_DRAW);}
    upload(mesh);
    const palette={orange:[.72,.34,.09],mandarina:[.82,.45,.12],clementina:[.76,.38,.10]};
    let targetX=.12,targetY=-.16,rx=.12,ry=-.16,down=false,lastX=0,lastY=0;
    canvas.addEventListener('pointerdown',e=>{down=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture?.(e.pointerId);});
    canvas.addEventListener('pointerup',()=>{down=false;});
    canvas.addEventListener('pointercancel',()=>{down=false;});
    canvas.addEventListener('pointermove',e=>{if(!down)return;targetY+= (e.clientX-lastX)*.006;targetX=clamp(targetX+(e.clientY-lastY)*.004,-.32,.32);lastX=e.clientX;lastY=e.clientY;});
    canvas.addEventListener('pointerleave',()=>{down=false;});
    const observer=new MutationObserver(()=>{const sign=root.querySelector('.citrus-sign');const txt=(sign?.textContent||'').toLowerCase();const fam=txt.includes('mand')?'mandarina':txt.includes('clement')?'clementina':'orange';if(fam!==currentFamily){currentFamily=fam;upload(meshCache[fam]||(meshCache[fam]=makeGeometry(fam)));}});
    observer.observe(root,{subtree:true,childList:true,characterData:true});
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){root.classList.add('is-3d-visible');}}),{threshold:.15});io.observe(root);
    const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    function resize(){const r=canvas.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,DPR_CAP);canvas.width=Math.max(1,Math.round(r.width*d));canvas.height=Math.max(1,Math.round(r.height*d));gl.viewport(0,0,canvas.width,canvas.height);}
    const ro=new ResizeObserver(resize);ro.observe(canvas);resize();
    gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);gl.clearColor(0,0,0,0);
    function frame(t){
      const still=reduced?0:t*.00009;
      ry += (targetY-ry)*.045; rx += (targetX-rx)*.045;
      const p=mat4.perspective(.56,canvas.width/canvas.height,.1,30);
      const view=mat4.translate(0,-.05,-7.1);
      const model=mat4.multiply(mat4.rotateY(ry+still),mat4.rotateX(rx));
      const mvp=mat4.multiply(p,mat4.multiply(view,model));
      gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(program);gl.uniformMatrix4fv(loc.mvp,false,mvp);gl.uniformMatrix4fv(loc.model,false,model);gl.uniform3f(loc.light,-3,5,4);
      const posCount=mesh.positions.length/3; const trunkEnd=Math.floor(posCount*.56); gl.uniform3fv(loc.base,new Float32Array([.24,.18,.10])); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.drawElements(gl.TRIANGLES,Math.floor(faceCount*.44),gl.UNSIGNED_SHORT,0);
      gl.uniform3fv(loc.base,new Float32Array([.23,.38,.22])); gl.drawElements(gl.TRIANGLES,Math.floor(faceCount*.27),gl.UNSIGNED_SHORT,Math.floor(faceCount*.44/2)*2);
      gl.uniform3fv(loc.base,new Float32Array(palette[currentFamily])); gl.drawElements(gl.TRIANGLES,faceCount-Math.floor(faceCount*.71),gl.UNSIGNED_SHORT,Math.floor(faceCount*.71/2)*2);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function scan(){document.querySelectorAll('.citrus-botanical').forEach(mount);}
  window.addEventListener('load',scan,{once:true});
  new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});
})();
