/* JavaScript puro: filtros, pesquisa, player em modal, tema, scroll, cópia e animações. */
(() => {
'use strict';
const FALLBACK = JSON.parse(document.getElementById('fallback-projects').textContent);
const posters = {'5Wk94Rj6l_c':'pokemon.svg','VSvw_f1H7KU':'fc27.svg','qlpf7iXkWCM':'cristiano.svg','_gOeTNcv9e4':'projeto04.svg'};
const grid=document.getElementById('project-grid');
const search=document.getElementById('project-search');
const chips=[...document.querySelectorAll('[data-filter]')];
const modal=document.getElementById('video-modal');
const modalPlayer=document.getElementById('modal-player');
const modalClose=document.getElementById('modal-close');
const modalTitle=document.getElementById('modal-title');
const modalYoutube=document.getElementById('modal-youtube');
const themeButton=document.getElementById('theme-toggle');
let projects=FALLBACK.slice(), filter='todos', lastFocus=null, toastTimeout;
const safeText=(value)=>String(value??'');
const watchUrl=id=>`https://www.youtube.com/watch?v=${encodeURIComponent(id)}`;
function notify(message){const t=document.getElementById('toast');t.textContent=message;t.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>t.classList.remove('show'),2600);}
async function copyText(value){try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(value);}else{const node=document.createElement('textarea');node.value=value;node.style.position='fixed';node.style.opacity='0';document.body.append(node);node.select();const ok=document.execCommand('copy');node.remove();if(!ok)throw new Error('copy failed');}notify('Copiado para a área de transferência.');}catch{notify('Não foi possível copiar. Selecione o texto manualmente.');}}
function card(p){
 const box=document.createElement('article'); box.className='project';
 const poster=document.createElement('div'); poster.className='poster';
 const img=document.createElement('img');img.loading='lazy';img.alt=`Capa do vídeo: ${safeText(p.title)}`;img.src=`assets/img/${posters[p.youtubeId]||'projeto04.svg'}`;poster.append(img);
 const play=document.createElement('button');play.className='play';play.type='button';play.textContent='▶';play.setAttribute('aria-label',`Assistir: ${p.title}`);play.addEventListener('click',()=>openVideo(p));poster.append(play);
 const body=document.createElement('div');body.className='project-body';const kicker=document.createElement('div');kicker.className='project-kicker';
 const tag=document.createElement('span');tag.textContent=`PROJETO ${String(p.id).padStart(2,'0')}`;const category=document.createElement('span');category.textContent=p.categoryLabel;kicker.append(tag,category);body.append(kicker);
 const title=document.createElement('h3');title.textContent=p.title;body.append(title);
 if(p.status==='pendente'){const note=document.createElement('p');note.className='pending';note.textContent='Título do vídeo ainda não confirmado';body.append(note);}
 const bottom=document.createElement('div');bottom.className='project-bottom';const a=document.createElement('a');a.href=watchUrl(p.youtubeId);a.target='_blank';a.rel='noopener noreferrer';a.textContent='ABRIR NO YOUTUBE ↗';a.className='youtube-link';
 const copy=document.createElement('button');copy.className='copy-link';copy.type='button';copy.textContent='Copiar link';copy.addEventListener('click',()=>copyText(watchUrl(p.youtubeId)));bottom.append(a,copy);body.append(bottom);box.append(poster,body);return box;
}
function render(){const term=search.value.toLocaleLowerCase('pt-BR').trim();let visible=projects.filter(p=>(filter==='todos'||p.category===filter)&&[p.title,p.categoryLabel].some(t=>t.toLocaleLowerCase('pt-BR').includes(term)));
 grid.replaceChildren(...visible.map(card)); document.getElementById('empty-results').hidden=visible.length!==0;document.getElementById('project-count').textContent=String(projects.length).padStart(2,'0');}
chips.forEach(chip=>chip.addEventListener('click',()=>{filter=chip.dataset.filter;chips.forEach(b=>b.setAttribute('aria-pressed',String(b===chip)));render();}));
search.addEventListener('input',render);
function openVideo(p){lastFocus=document.activeElement;modalTitle.textContent=p.title;modalYoutube.href=watchUrl(p.youtubeId);modalPlayer.replaceChildren();const iframe=document.createElement('iframe');iframe.src=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(p.youtubeId)}?autoplay=1&rel=0`;iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';iframe.allowFullscreen=true;iframe.title=`Vídeo do YouTube: ${p.title}`;iframe.referrerPolicy='strict-origin-when-cross-origin';modalPlayer.append(iframe);modal.hidden=false;document.body.classList.add('modal-open');modalClose.focus();}
function closeVideo(){modal.hidden=true;modalPlayer.replaceChildren();document.body.classList.remove('modal-open');lastFocus?.focus?.();}
modalClose.addEventListener('click',closeVideo);modal.addEventListener('click',e=>{if(e.target===modal)closeVideo();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)closeVideo();});
document.getElementById('random-project').addEventListener('click',()=>{if(!projects.length)return;openVideo(projects[Math.floor(Math.random()*projects.length)]);});
document.getElementById('copy-whatsapp').addEventListener('click',()=>copyText('22996003777'));
document.getElementById('year').textContent=String(new Date().getFullYear());
function applyTheme(theme){document.documentElement.dataset.theme=theme;themeButton.textContent=theme==='dark'?'☀':'☾';themeButton.title=theme==='dark'?'Ativar tema claro':'Ativar tema escuro';}
let theme='dark';try{theme=localStorage.getItem('kauan-theme')||'dark';}catch{}applyTheme(theme==='light'?'light':'dark');
themeButton.addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='dark'?'light':'dark';applyTheme(next);try{localStorage.setItem('kauan-theme',next);}catch{}});
const progress=document.getElementById('scroll-progress');let scrollPending=false;function progressUpdate(){const max=document.documentElement.scrollHeight-window.innerHeight;progress.style.width=(max>0?(window.scrollY/max)*100:0)+'%';scrollPending=false;}window.addEventListener('scroll',()=>{if(!scrollPending){scrollPending=true;requestAnimationFrame(progressUpdate);}},{passive:true});progressUpdate();
const reveals=[...document.querySelectorAll('.reveal')];if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.08});reveals.forEach(node=>observer.observe(node));}else reveals.forEach(node=>node.classList.add('is-visible'));
render();
// Quando rodando com o servidor Java, os dados também podem vir de /api/projects.
if(location.protocol.startsWith('http')){fetch('/api/projects',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('fallback');return r.json();}).then(data=>{if(Array.isArray(data)&&data.length&&data.every(x=>typeof x.youtubeId==='string'&&typeof x.title==='string')){projects=data;render();}}).catch(()=>{});}
// Tenta obter o título real do 4º projeto online sem bloquear o site se a API externa estiver indisponível.
async function updateFourthTitle(){if(!navigator.onLine)return;const fourth=projects.find(p=>p.youtubeId==='_gOeTNcv9e4');if(!fourth||fourth.status!=='pendente')return;try{const url='https://noembed.com/embed?url='+encodeURIComponent(watchUrl(fourth.youtubeId));const controller=new AbortController();const id=setTimeout(()=>controller.abort(),3500);const response=await fetch(url,{signal:controller.signal});clearTimeout(id);if(!response.ok)return;const data=await response.json();if(typeof data.title==='string'&&data.title.trim()&&!data.error){fourth.title=data.title.trim();fourth.status='confirmado';render();}}catch{ /* projeto continua identificado pelo ID, sem inventar título */ }}
updateFourthTitle();
})();
