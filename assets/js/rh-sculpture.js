(() => {
  'use strict';
  const canvas=document.querySelector('[data-rh-sculpture]');if(!canvas)return;
  const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)'),mask=new Image();
  const make=(w,h)=>Object.assign(document.createElement('canvas'),{width:w,height:h});
  const clamp=n=>Math.max(0,Math.min(1,n));const smooth=n=>{n=clamp(n);return n*n*(3-2*n);};
  let studio,lastYaw=0;

  function makeStudio(sourceAlpha,shapeWidth,shapeHeight){
    const surfaceCanvas=document.createElement('canvas');
    const gl=surfaceCanvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false,preserveDrawingBuffer:true});
    if(!gl)return null;
    const pad=24,tw=shapeWidth+pad*2,th=shapeHeight+pad*2,units=2/shapeHeight;
    const inside=new Uint8Array(tw*th);
    for(let y=0;y<shapeHeight;y++)for(let x=0;x<shapeWidth;x++)inside[(y+pad)*tw+x+pad]=sourceAlpha[y*shapeWidth+x]>=128?1:0;
    function field(target){
      const d=new Float32Array(tw*th);for(let i=0;i<d.length;i++)d[i]=inside[i]===target?10000:0;
      for(let y=0;y<th;y++)for(let x=0;x<tw;x++){const i=y*tw+x;if(!d[i])continue;d[i]=Math.min(d[i],x?d[i-1]+1:10000,y?d[i-tw]+1:10000,x&&y?d[i-tw-1]+1.414:10000);}
      for(let y=th-1;y>=0;y--)for(let x=tw-1;x>=0;x--){const i=y*tw+x;if(!d[i])continue;d[i]=Math.min(d[i],x<tw-1?d[i+1]+1:10000,y<th-1?d[i+tw]+1:10000,x<tw-1&&y<th-1?d[i+tw+1]+1.414:10000);}
      return d;
    }
    const di=field(1),dout=field(0),pixels=new Uint8Array(tw*th*4);
    for(let i=0;i<inside.length;i++){
      const sd=(inside[i]?-(di[i]-.5):dout[i]-.5)*units;
      const value=Math.round(Math.max(0,Math.min(1,.5+sd/4))*65535);
      pixels[i*4]=value>>8;pixels[i*4+1]=value&255;pixels[i*4+3]=255;
    }
    const vert='attribute vec2 aPosition;void main(){gl_Position=vec4(aPosition,0.,1.);}';
    const frag=`
precision highp float;
uniform vec2 uResolution,uSize;
uniform sampler2D uField;
uniform float uYaw,uFinish;
mat3 rx(float a){float c=cos(a),s=sin(a);return mat3(1.,0.,0.,0.,c,s,0.,-s,c);}
mat3 ry(float a){float c=cos(a),s=sin(a);return mat3(c,0.,-s,0.,1.,0.,s,0.,c);}
mat3 rz(float a){float c=cos(a),s=sin(a);return mat3(c,s,0.,-s,c,0.,0.,0.,1.);}
float mapShape(vec3 p){
 vec2 uv=vec2(.5+p.x/uSize.x,.5-p.y/uSize.y);
 vec2 rg=texture2D(uField,clamp(uv,0.,1.)).rg*255.;
 float d=(dot(rg,vec2(256.,1.))/65535.-.5)*4.;
 vec2 overflow=max(abs(p.xy)-uSize*.5,0.);d+=length(overflow);
 float bevel=.039,halfDepth=.16+.03*uFinish;
 vec2 q=vec2(d+bevel,abs(p.z)-halfDepth+bevel);
 return min(max(q.x,q.y),0.)+length(max(q,0.))-bevel;
}
vec3 normalAt(vec3 p){
 float e=.009;vec2 k=vec2(1.,-1.);
 return normalize(k.xyy*mapShape(p+k.xyy*e)+k.yyx*mapShape(p+k.yyx*e)+k.yxy*mapShape(p+k.yxy*e)+k.xxx*mapShape(p+k.xxx*e));
}
float occlusion(vec3 p,vec3 n){
 float o=0.,w=1.;for(int i=1;i<=4;i++){float h=float(i)*.035;o+=max(0.,h-mapShape(p+n*h))*w;w*=.55;}
 return clamp(1.-o*3.2,.58,1.);
}
vec3 studio(vec3 r){
 float front=max(r.z,.08);vec2 s=r.xy/front;
 float left=exp(-pow(abs((s.x+.48)/.36),4.)-pow(abs((s.y-.35)/1.5),4.));
 float right=exp(-pow(abs((s.x-.72)/.18),4.)-pow(abs((s.y-.05)/1.0),4.));
 float top=exp(-pow(abs(s.x/.95),4.)-pow(abs((s.y-.95)/.28),4.));
 return vec3(.06,.07,.06)+left*vec3(3.4,3.1,2.6)+right*vec3(1.7,1.85,1.9)+top*vec3(1.4,1.25,1.0);
}
vec3 light(vec3 n,vec3 v,vec3 l,vec3 radiance,vec3 f0,float rough){
 vec3 h=normalize(v+l);float nl=max(dot(n,l),0.),nv=max(dot(n,v),.001),nh=max(dot(n,h),0.),vh=max(dot(v,h),0.);
 float a=rough*rough,a2=a*a,den=nh*nh*(a2-1.)+1.;
 float D=a2/(3.14159*den*den+.0001),k=(rough+1.)*(rough+1.)/8.;
 float G=(nv/(nv*(1.-k)+k))*(nl/(nl*(1.-k)+k));
 vec3 F=f0+(1.-f0)*pow(1.-vh,5.);
 return radiance*nl*(F*D*G/(4.*nv*max(nl,.001))+.055*f0);
}
void main(){
 vec2 uv=(gl_FragCoord.xy-uResolution*.5)/uResolution.y;uv-=vec2(-0.0019915,0.0264492);
 mat3 rotation=ry(uYaw)*rx(.10),inverse=rx(-.10)*ry(-uYaw);
 vec3 ro=vec3(0.,0.,5.4),rd=normalize(vec3(uv*4.3272162,-5.4));
 vec3 o=inverse*ro,d=inverse*rd;
 vec3 extent=vec3(uSize*.5,.23),m=1./d,near=(-extent-o)*m,far=(extent-o)*m;
 vec3 lo=min(near,far),hi=max(near,far);
 float entry=max(max(lo.x,lo.y),lo.z),exit=min(min(hi.x,hi.y),hi.z);
 float shadow=exp(-pow((uv.x+.002)/.17,2.)-pow((uv.y+.265)/.024,2.))*.27;
 if(exit<max(entry,0.)){gl_FragColor=vec4(0.,0.,0.,shadow);return;}
 float t=max(entry,0.),closest=10.;bool hit=false;vec3 p;
 for(int i=0;i<80;i++){
  p=o+d*t;float dist=mapShape(p);closest=min(closest,dist);
  if(dist<.0015){hit=true;break;}t+=max(dist*.85,.001);if(t>exit)break;
 }
 if(!hit){gl_FragColor=vec4(0.,0.,0.,shadow);return;}
 vec3 localNormal=normalAt(p),n=rotation*localNormal,v=-rd;
 float ao=occlusion(p,localNormal),faceWeight=pow(abs(localNormal.z),10.);
 float rough=mix(.42,mix(.24,.34,faceWeight),uFinish);
 vec3 f0=vec3(.02);
 vec3 reflected=studio(reflect(rd,n));
 vec3 color=(vec3(.0022)+f0*reflected*mix(.42,.055,faceWeight))*ao;
 color+=light(n,v,normalize(vec3(-2.,3.2,4.)),vec3(3.5,3.1,2.5),f0,rough)*mix(.9,.12,faceWeight)*ao;
 color+=light(n,v,normalize(vec3(2.6,.4,2.)),vec3(.8,.9,1.),f0,rough)*mix(.9,.12,faceWeight)*ao;


 color+=vec3(.014)*(1.-faceWeight)*(.35+.65*max(dot(n,normalize(vec3(2.6,1.2,2.))),0.))*ao;
 color=vec3(1.)-exp(-color*1.3);color=pow(color,vec3(1./2.2));color=vec3(dot(color,vec3(.2126,.7152,.0722)));color=mix(color,min(color,vec3(.105)),faceWeight);
 gl_FragColor=vec4(color,1.);
}`;
    function shader(type,src){const sh=gl.createShader(type);gl.shaderSource(sh,src);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(sh));return sh;}
    try{
      const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vert));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,frag));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));gl.useProgram(program);
      const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
      const attribute=gl.getAttribLocation(program,'aPosition');gl.enableVertexAttribArray(attribute);gl.vertexAttribPointer(attribute,2,gl.FLOAT,false,0,0);
      const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,tw,th,0,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      const resolution=gl.getUniformLocation(program,'uResolution'),yawUniform=gl.getUniformLocation(program,'uYaw'),finish=gl.getUniformLocation(program,'uFinish');
      gl.uniform2f(gl.getUniformLocation(program,'uSize'),tw*units,th*units);gl.uniform1i(gl.getUniformLocation(program,'uField'),0);
      return {canvas:surfaceCanvas,render(w,h,form,yaw){if(surfaceCanvas.width!==w||surfaceCanvas.height!==h){surfaceCanvas.width=w;surfaceCanvas.height=h;}gl.viewport(0,0,w,h);gl.uniform2f(resolution,w,h);gl.uniform1f(yawUniform,yaw);gl.uniform1f(finish,form);gl.drawArrays(gl.TRIANGLES,0,6);}};
    }catch(error){console.warn('RH studio renderer unavailable; using the static-compatible canvas treatment.',error);return null;}
  }

  let underface,front,side,fc,sc,face,edge,alpha,distance,base,width=0,height=656,maxDistance=0,progress=0,started=false,frame=0,lastPaint=0,paintedForm=-1;
  function fit(){const d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(canvas.clientWidth*d);canvas.height=Math.round(canvas.clientHeight*d);}
  function surface(form){
    // Continuous inward formation from the authentic contour, never separate chunks.
    const reach=6.4+form*(maxDistance+4),data=face.data,sd=edge.data;
    for(let p=0;p<alpha.length;p++){
      const i=p*4;if(!alpha[p]){data[i+3]=sd[i+3]=0;continue;}
      const coverage=clamp(reach-distance[p]+.7),a=Math.round(alpha[p]*coverage);
      const edgeLight=form<.995?Math.max(0,1-Math.abs(distance[p]-reach+.55)/1.25)*.28:0;
      data[i]=base[i]+(65-base[i])*edgeLight;data[i+1]=base[i+1]+(65-base[i+1])*edgeLight;data[i+2]=base[i+2]+(65-base[i+2])*edgeLight;data[i+3]=sd[i+3]=a;
    }
    fc.putImageData(face,0,0);sc.putImageData(edge,0,0);
  }
  function draw(t,yaw=0){
    if(!front)return;progress=t;lastYaw=yaw;
    const ms=t*4500,form=reduce.matches?1:smooth((ms-250)/2300),depth=3+form*27;if(!studio&&form!==paintedForm){surface(form);paintedForm=form;}
    if(studio){const quality=Math.min(1.5,1400/canvas.width);studio.render(Math.round(canvas.width*quality),Math.round(canvas.height*quality),form,yaw);ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);ctx.imageSmoothingQuality='high';ctx.drawImage(studio.canvas,0,0,canvas.width,canvas.height);}else{
    ctx.setTransform(canvas.width/640,0,0,canvas.height/560,0,0);ctx.clearRect(0,0,640,560);
    const light=ctx.createRadialGradient(344,244,15,344,244,276);light.addColorStop(0,'rgba(188,164,108,.065)');light.addColorStop(1,'rgba(188,164,108,0)');ctx.fillStyle=light;ctx.fillRect(0,0,640,560);
    ctx.save();ctx.translate(319,428);ctx.scale(1,.12);const shadow=ctx.createRadialGradient(0,0,8,0,0,190);shadow.addColorStop(0,'rgba(0,0,0,.52)');shadow.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=shadow;ctx.fillRect(-200,-200,400,400);ctx.restore();
    ctx.save();ctx.translate(318.88475,267.73228);ctx.scale(Math.cos(yaw),1);ctx.scale(0.4088674,0.4088674);ctx.translate(-width/2,-height/2);
    for(let z=Math.ceil(depth);z>0;z--)ctx.drawImage(side,-z*(.66+Math.sin(yaw)*1.5),z*.72);
    ctx.drawImage(underface,0,0);ctx.drawImage(front,0,0);ctx.restore();
    }
    canvas.dataset.state=reduce.matches||t>=1?'assembled':studio?'material-reveal':ms<700?'contour':'forming';canvas.dataset.motion=reduce.matches?'reduced':t>=1?'settled':'finite';canvas.dataset.loopActive=String(!reduce.matches&&t<1);canvas.dataset.yaw=String(yaw);canvas.dataset.formation=String(form);
  }
  function animate(start){const tick=now=>{
    if(reduce.matches){frame=0;draw(1,0);return;}
    const t=Math.min(1,(now-start)/4500),yaw=.12*Math.pow(Math.sin(Math.PI*t),2);
    if(now-lastPaint>30||t===1){draw(t,t===1?0:yaw);lastPaint=now;}
    if(t<1)frame=requestAnimationFrame(tick);else frame=0;
  };frame=requestAnimationFrame(tick);}
  mask.onload=()=>{
    const src=make(mask.width,mask.height),sx=src.getContext('2d');sx.drawImage(mask,0,0);const source=sx.getImageData(0,0,mask.width,mask.height).data;let x0=mask.width,y0=mask.height,x1=0,y1=0;
    for(let y=0;y<mask.height;y++)for(let x=0;x<mask.width;x++)if(source[(y*mask.width+x)*4+3]){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
    width=Math.round((x1-x0+1)*height/(y1-y0+1));const shape=make(width,height),ax=shape.getContext('2d');ax.imageSmoothingQuality='high';ax.drawImage(mask,x0,y0,x1-x0+1,y1-y0+1,0,0,width,height);const ink=ax.getImageData(0,0,width,height).data;
    alpha=new Uint8Array(width*height);distance=new Float32Array(width*height);
    for(let p=0;p<alpha.length;p++){alpha[p]=ink[p*4+3];distance[p]=alpha[p]?10000:0;}
    // Distance to the existing boundary controls growth strictly inside the source silhouette.
    for(let y=0;y<height;y++)for(let x=0;x<width;x++){const p=y*width+x;if(!alpha[p])continue;distance[p]=Math.min(distance[p],x?distance[p-1]+1:1,y?distance[p-width]+1:1,x&&y?distance[p-width-1]+1.414:1);}
    for(let y=height-1;y>=0;y--)for(let x=width-1;x>=0;x--){const p=y*width+x;if(!alpha[p])continue;distance[p]=Math.min(distance[p],x<width-1?distance[p+1]+1:1,y<height-1?distance[p+width]+1:1,x<width-1&&y<height-1?distance[p+width+1]+1.414:1);maxDistance=Math.max(maxDistance,distance[p]);}
    front=make(width,height);side=make(width,height);fc=front.getContext('2d');sc=side.getContext('2d');face=fc.createImageData(width,height);edge=sc.createImageData(width,height);base=new Uint8ClampedArray(face.data.length);
    let seed=41;
    for(let y=0;y<height;y++)for(let x=0;x<width;x++){
      const p=y*width+x,i=p*4;seed=(seed*1664525+1013904223)>>>0;
      const slope=.28*x/width+.46*y/height,brush=Math.sin(y*2.1)*1.25+((seed>>>24)/255-.5)*3.5;
      let bevel=0;if(alpha[p]&&distance[p]<2.3){const l=distance[p-1]||0,r=distance[p+1]||0,u=distance[p-width]||0,d=distance[p+width]||0;bevel=Math.max(-.5,Math.min(1,((r-l)*-.6+(d-u)*-.8)))*17;}
      base[i]=base[i+1]=base[i+2]=14+slope*3+brush*.2+bevel*.3;
      edge.data[i]=edge.data[i+1]=edge.data[i+2]=24;
    }
    underface=make(width,height);const ux=underface.getContext('2d'),ud=ux.createImageData(width,height);for(let p=0;p<alpha.length;p++){const i=p*4;ud.data[i]=ud.data[i+1]=ud.data[i+2]=14;ud.data[i+3]=alpha[p];}ux.putImageData(ud,0,0);
    studio=makeStudio(alpha,width,height);canvas.dataset.renderer=studio?'webgl-extruded-studio':'canvas-fallback';if(studio)studio.canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();studio=null;paintedForm=-1;canvas.dataset.renderer='canvas-fallback';draw(progress,lastYaw);});
    canvas.dataset.sourceGeometry='original-mask';canvas.dataset.construction='continuous-inward-surface';fit();
    if(reduce.matches){started=true;draw(1);}else{draw(0);const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)&&!started){started=true;observer.disconnect();animate(performance.now());}},{threshold:.55});observer.observe(canvas);}
    new ResizeObserver(()=>{fit();draw(progress,lastYaw);}).observe(canvas);reduce.addEventListener('change',()=>{cancelAnimationFrame(frame);frame=0;started=true;draw(1,0);});
  };
  mask.onerror=()=>{canvas.dataset.state='unavailable';};mask.src=canvas.dataset.mask;
})();
