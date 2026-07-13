(async()=>{
  const res=await fetch('./src/v34.js?v=34-base',{cache:'no-store'});
  let src=await res.text();
  src=src.replaceAll('PetForm V34','PetForm V35');
  src=src.replaceAll('真实模型试衣间','贴合服装试衣间');
  src=src.replace("const MODEL_URL='./assets/models/corgi_HP.obj?v=34';","const MODEL_URL='./assets/models/corgi_HP.obj?v=35';");
  src=src.replace("const state={cloth:'none',scene:'studio'};","const state={cloth:'none',scene:'studio'};let modelSize=new THREE.Vector3(.421,.744,.999);");
  const oldFit="function fitObject(obj){obj.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(obj),c=box.getCenter(new THREE.Vector3()),s=box.getSize(new THREE.Vector3());obj.position.sub(c);modelGroup.position.set(0,0,0);stageGroup.position.set(-.55,1.54,0);stageGroup.rotation.y=.35;const sc=2.72/Math.max(s.x,s.y*1.12,s.z);stageGroup.scale.setScalar(sc);clothesGroup.position.set(0,0,0);makeCloth();$('#badge').textContent='柯基 OBJ · 已加载真实模型'}";
  const newFit="function fitObject(obj){obj.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(obj),c=box.getCenter(new THREE.Vector3()),s=box.getSize(new THREE.Vector3());modelSize=s.clone();obj.position.sub(c);modelGroup.position.set(0,0,0);stageGroup.position.set(-.55,1.54,0);stageGroup.rotation.y=.35;const sc=2.72/Math.max(s.x,s.y*1.12,s.z);stageGroup.scale.setScalar(sc);clothesGroup.position.set(0,0,0);makeCloth();$('#badge').textContent='柯基 OBJ · 贴合服装'}";
  const oldCloth="function makeCloth(){clothesGroup.clear();if(state.cloth==='none')return;const color=cloths[state.cloth][1],m=new THREE.MeshPhysicalMaterial({color,roughness:state.cloth==='rain'?.28:.58,clearcoat:state.cloth==='rain'?.7:.12,side:THREE.DoubleSide});if(state.cloth==='harness'){const a=new THREE.Mesh(new THREE.TorusGeometry(.46,.025,10,72),m);a.position.set(.16,.04,0);a.rotation.y=Math.PI/2;a.scale.set(1,.36,.82);clothesGroup.add(a);const b=a.clone();b.position.x=-.38;clothesGroup.add(b);const strap=new THREE.Mesh(new THREE.CapsuleGeometry(.025,1.18,6,12),m);strap.position.set(-.12,.18,.36);strap.rotation.z=Math.PI/2;clothesGroup.add(strap);return}const shell=new THREE.Mesh(new THREE.SphereGeometry(1,48,24),m);shell.position.set(-.1,.1,0);shell.scale.set(.9,.36,.42);clothesGroup.add(shell);const collar=new THREE.Mesh(new THREE.TorusGeometry(.28,.028,12,72),mat(0x2b2926));collar.position.set(.62,.33,0);collar.rotation.y=Math.PI/2;collar.scale.set(1,.35,1);clothesGroup.add(collar);if(state.cloth==='puffer'){for(let i=-3;i<=3;i++){const rib=new THREE.Mesh(new THREE.CapsuleGeometry(.018,.78,6,10),mat(0x87352f));rib.position.set(i*.19,.16,.38);rib.rotation.z=Math.PI/2;clothesGroup.add(rib)}}if(state.cloth==='tee'){const sleeveL=new THREE.Mesh(new THREE.SphereGeometry(.18,24,12),m);sleeveL.position.set(.28,-.18,.36);sleeveL.scale.set(.7,.5,.35);clothesGroup.add(sleeveL);const sleeveR=sleeveL.clone();sleeveR.position.z=-.36;clothesGroup.add(sleeveR)}}";
  const newCloth=`function makeCloth(){
    clothesGroup.clear();
    if(state.cloth==='none')return;
    const sx=modelSize?.x||.421,sy=modelSize?.y||.744,sz=modelSize?.z||.999;
    const color=cloths[state.cloth][1];
    const clothMat=new THREE.MeshPhysicalMaterial({color,roughness:state.cloth==='rain'?.22:.54,clearcoat:state.cloth==='rain'?.82:.18,metalness:0,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1});
    const seamMat=new THREE.MeshStandardMaterial({color:0x2f2b27,roughness:.7,side:THREE.DoubleSide});
    const stitchMat=new THREE.MeshStandardMaterial({color:0xfffffff,roughness:.65,transparent:true,opacity:.74});
    const torso={x:sx*1.08,y:sy*.47,z:sz*.56,cy:sy*.02,cz:-sz*.015};
    function shellGeo(width,height,length,cover=2.28){
      const segZ=38,segA=40,pos=[],norm=[],uv=[],idx=[];
      for(let iz=0;iz<=segZ;iz++){
        const t=iz/segZ,zz=(t-.5)*length;
        const chest=.11*Math.exp(-Math.pow((t-.28)/.18,2)),rump=.045*Math.exp(-Math.pow((t-.76)/.2,2));
        const taper=.86+.10*Math.sin(Math.PI*t)+chest+rump;
        for(let ia=0;ia<=segA;ia++){
          const u=ia/segA,a=-cover+cover*2*u;
          const side=Math.abs(Math.sin(a));
          const rx=width*(.47+.035*side)*taper,ry=height*(.39+.02*side)*(.96+.06*Math.sin(Math.PI*t));
          const x=Math.sin(a)*rx,y=Math.cos(a)*ry+torso.cy;
          pos.push(x,y,zz+torso.cz);
          norm.push(Math.sin(a),Math.cos(a),0);
          uv.push(u,t);
        }
      }
      const row=segA+1;
      for(let iz=0;iz<segZ;iz++)for(let ia=0;ia<segA;ia++){const a=iz*row+ia,b=a+1,c=a+row,d=c+1;idx.push(a,c,b,b,c,d)}
      const g=new THREE.BufferGeometry();
      g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
      g.setAttribute('normal',new THREE.Float32BufferAttribute(norm,3));
      g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
      g.setIndex(idx);g.computeVertexNormals();return g
    }
    function addShell(width=torso.x,height=torso.y,length=torso.z){const mesh=new THREE.Mesh(shellGeo(width,height,length),clothMat);mesh.castShadow=true;mesh.receiveShadow=true;clothesGroup.add(mesh);return mesh}
    function addRing(z,rx,ry,material=seamMat,thick=.011){const ring=new THREE.Mesh(new THREE.TorusGeometry(1,thick,10,96),material);ring.scale.set(rx,ry,1);ring.position.set(0,torso.cy,z);ring.castShadow=true;clothesGroup.add(ring);return ring}
    function addBackSeam(z){const seam=new THREE.Mesh(new THREE.CapsuleGeometry(.008,torso.z*.9,5,8),seamMat);seam.position.set(0,torso.cy+torso.y*.41,z||torso.cz);seam.rotation.x=Math.PI/2;clothesGroup.add(seam)}
    if(state.cloth==='harness'){
      const front=addRing(torso.cz+torso.z*.25,torso.x*.48,torso.y*.34,seamMat,.012);
      const back=addRing(torso.cz-torso.z*.28,torso.x*.43,torso.y*.30,seamMat,.012);
      [front,back].forEach(r=>r.material=clothMat);
      for(const x of [-torso.x*.34,torso.x*.34]){const strap=new THREE.Mesh(new THREE.CapsuleGeometry(.012,torso.z*.62,6,12),clothMat);strap.position.set(x,torso.cy+torso.y*.26,torso.cz-torso.z*.02);strap.rotation.x=Math.PI/2;clothesGroup.add(strap)}
      const chest=new THREE.Mesh(new THREE.CapsuleGeometry(.014,torso.x*.72,6,12),clothMat);chest.position.set(0,torso.cy-torso.y*.18,torso.cz+torso.z*.22);chest.rotation.z=Math.PI/2;clothesGroup.add(chest);return
    }
    if(state.cloth==='tee'){addShell(torso.x*.98,torso.y*.91,torso.z*.45);addRing(torso.cz+torso.z*.25,torso.x*.36,torso.y*.26,seamMat,.009);addRing(torso.cz-torso.z*.25,torso.x*.42,torso.y*.29,seamMat,.008)}
    else if(state.cloth==='vest'){addShell(torso.x*1.03,torso.y*.95,torso.z*.50);addBackSeam();addRing(torso.cz+torso.z*.27,torso.x*.38,torso.y*.27,seamMat,.011);addRing(torso.cz-torso.z*.28,torso.x*.43,torso.y*.30,seamMat,.01)}
    else if(state.cloth==='rain'){addShell(torso.x*1.09,torso.y*1.01,torso.z*.64);const hood=new THREE.Mesh(shellGeo(torso.x*.54,torso.y*.48,torso.z*.18,2.12),clothMat);hood.position.set(0,torso.y*.10,torso.z*.37);clothesGroup.add(hood);addRing(torso.cz+torso.z*.32,torso.x*.39,torso.y*.29,seamMat,.01)}
    else if(state.cloth==='puffer'){addShell(torso.x*1.08,torso.y*1.03,torso.z*.58);for(let i=-3;i<=3;i++){const z=torso.cz+i*torso.z*.075;const rib=addRing(z,torso.x*(.43+.018*Math.cos(i)),torso.y*.31,seamMat,.006);rib.material=new THREE.MeshStandardMaterial({color:0x7c332e,roughness:.62})}}
    for(const x of [-torso.x*.49,torso.x*.49]){const fold=new THREE.Mesh(new THREE.CapsuleGeometry(.006,torso.z*.38,5,8),stitchMat);fold.position.set(x,torso.cy-torso.y*.10,torso.cz);fold.rotation.x=Math.PI/2;clothesGroup.add(fold)}
  }`;
  if(!src.includes(oldCloth)||!src.includes(oldFit))throw new Error('V35 patch failed: base snippets changed');
  src=src.replace(oldCloth,newCloth).replace(oldFit,newFit);
  new Function(src)();
})().catch(e=>{document.querySelector('#app').innerHTML='<main style="min-height:100vh;display:grid;place-items:center;padding:24px;font-family:system-ui;color:#333;background:#f7f4ed;text-align:center">V35 加载失败<br><small>'+String(e.message||e)+'</small></main>'});
