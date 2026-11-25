/* Hydrate an approved, checksum-pinned static MONOFORM release. This runs at
   build time only. The finished site serves the complete demo on its own origin. */
import {createHash} from 'node:crypto';
import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const manifest=JSON.parse(await readFile(path.join(here,'monoform-demo-104.json'),'utf8'));
const out=path.join(root,'our-work','monoform','demo');
const staging=process.env.MONOFORM_RELEASE_DIR;
const origin='https://monoform-m01-studio.briankeithrogers8290.chatgpt.site/';
const hash=b=>createHash('sha256').update(b).digest('hex');
const curl=promisify(execFile);
function normalize(key,bytes){
 // These declarations belonged to excluded pre-release variants. The active
 // 104 film does not use them, including its reduced-motion layout.
 if(key==='flight.css'){
  return Buffer.from(bytes.toString().replace(/url\(['"]?assets\/(?:flight-cloudbank\.webp\?v=2|baffle-aperture-mask(?:-phone)?\.svg)['"]?\)/g,'none'));
 }
 if(key==='store-home.js')return Buffer.from(bytes.toString().replace('legacy.before(shelf);legacy.hidden=true;', "const marker=document.getElementById('lineup');if(marker)marker.replaceWith(shelf);else legacy.before(shelf);legacy.hidden=true;"));
 return bytes;
}
let index=0;
async function worker(){
 while(index<manifest.length){
  const {file,source,served}=manifest[index++];
  if(!/^[a-zA-Z0-9_./-]+$/.test(file)||file.split('/').includes('..'))throw Error('Invalid release path');
  const dest=path.join(out,file);
  const existing=await readFile(dest).catch(()=>null);
  if(existing&&hash(existing)===served)continue;
  const bytes=staging?await readFile(path.join(staging,file)):(await curl('curl',['--fail','--silent','--show-error','--max-time','35','--retry','2',new URL(file,origin).href],{encoding:'buffer',maxBuffer:4*1024*1024})).stdout;
  if(hash(bytes)!==source)throw Error('Approve a fresh MONOFORM release before refreshing '+file);
  const cooked=normalize(file,bytes);
  if(hash(cooked)!==served)throw Error('Unexpected processed MONOFORM file '+file);
  await mkdir(path.dirname(dest),{recursive:true});
  const tmp=dest+'.tmp'; await writeFile(tmp,cooked);await rename(tmp,dest);
 }
}
await Promise.all(Array.from({length:7},worker));
console.log('Verified '+manifest.length+' pinned MONOFORM demo files.');
