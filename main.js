/* ============================================================
   ARNICO MARKETING — main.js
   Navbar · Mobile Menu · Dropdowns · Scroll Animations
   Counters · Testimonial Slider · Contact Form · Web3Forms
   ============================================================ */

/* 1. STICKY NAVBAR */
(function(){
  const nav = document.getElementById('navbar');
  if(!nav) return;
  window.addEventListener('scroll', ()=>{
    nav.classList.toggle('glass-nav', window.scrollY > 60);
  },{passive:true});
})();

/* 2. MOBILE MENU */
(function(){
  const toggle = document.getElementById('menu-toggle');
  const menu   = document.getElementById('mobile-menu');
  const icon   = document.getElementById('menu-icon');
  if(!toggle) return;
  toggle.addEventListener('click',()=>{
    menu.classList.toggle('open');
    const open = menu.classList.contains('open');
    icon.innerHTML = open
      ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>'
      : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
  });
})();

/* 3. DESKTOP DROPDOWNS */
(function(){
  document.querySelectorAll('[data-dd]').forEach(trigger=>{
    const menu = document.getElementById(trigger.dataset.dd);
    if(!menu) return;
    let t;
    trigger.addEventListener('mouseenter',()=>{ clearTimeout(t); menu.classList.add('open'); });
    trigger.addEventListener('mouseleave',()=>{ t=setTimeout(()=>menu.classList.remove('open'),180); });
    menu.addEventListener('mouseenter',()=>clearTimeout(t));
    menu.addEventListener('mouseleave',()=>{ t=setTimeout(()=>menu.classList.remove('open'),180); });
  });
})();

/* 4. MOBILE SERVICES ACCORDION */
(function(){
  const btn = document.getElementById('mob-svc-btn');
  const sub = document.getElementById('mob-svc-sub');
  const arr = document.getElementById('mob-svc-arr');
  if(!btn) return;
  btn.addEventListener('click',()=>{
    sub.classList.toggle('open');
    if(arr) arr.style.transform = sub.classList.contains('open') ? 'rotate(180deg)' : '';
  });
})();

/* 5. SMOOTH SCROLL */
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const t = document.querySelector(a.getAttribute('href'));
      if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth',block:'start'}); }
    });
  });
});

/* 6. INTERSECTION OBSERVER — fade-up / fade-in */
(function(){
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        en.target.classList.add('visible');
        if(en.target.dataset.counter !== undefined) startCounter(en.target);
        en.target.querySelectorAll('.progress-fill[data-w]').forEach((b,i)=>{
          setTimeout(()=>{ b.style.width = b.dataset.w+'%'; }, i*200+400);
        });
        obs.unobserve(en.target);
      }
    });
  },{threshold:0.13,rootMargin:'0px 0px -50px 0px'});
  document.querySelectorAll('.fade-up,.fade-in,[data-counter]').forEach(el=>obs.observe(el));
})();

/* 7. ANIMATED COUNTERS */
function startCounter(el){
  const target = +el.dataset.counter;
  const suffix = el.dataset.suffix||'';
  const prefix = el.dataset.prefix||'';
  let start; const dur=2000;
  const ease = t=>1-Math.pow(1-t,3);
  function tick(now){
    if(!start) start=now;
    const p = Math.min((now-start)/dur,1);
    el.textContent = prefix+Math.round(ease(p)*target).toLocaleString()+suffix;
    if(p<1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* 8. TESTIMONIALS SLIDER */
(function(){
  const track = document.getElementById('testi-track');
  const prev  = document.getElementById('testi-prev');
  const next  = document.getElementById('testi-next');
  if(!track) return;
  const cards = track.querySelectorAll('.testimonial-card');
  let idx=0;
  function ipv(){ return window.innerWidth<768?1:window.innerWidth<1024?2:3; }
  function max(){ return Math.max(0, cards.length - ipv()); }
  function go(i){
    idx = Math.max(0,Math.min(i,max()));
    const w = cards[0].offsetWidth + 28;
    track.style.transform = `translateX(-${idx*w}px)`;
    document.querySelectorAll('.testi-dot').forEach((d,di)=>{
      d.classList.toggle('opacity-100',di===idx);
      d.classList.toggle('opacity-25',di!==idx);
    });
  }
  if(prev) prev.addEventListener('click',()=>go(idx-1));
  if(next) next.addEventListener('click',()=>go(idx+1));
  document.querySelectorAll('.testi-dot').forEach((d,i)=>d.addEventListener('click',()=>go(i)));
  let ap = setInterval(()=>go(idx+1>max()?0:idx+1),5200);
  track.addEventListener('mouseenter',()=>clearInterval(ap));
  track.addEventListener('mouseleave',()=>{ ap=setInterval(()=>go(idx+1>max()?0:idx+1),5200); });
  window.addEventListener('resize',()=>go(0));
})();

/* 9. MARQUEE CLONE */
(function(){
  const t = document.getElementById('marquee-track');
  if(!t) return;
  t.innerHTML += t.innerHTML;
})();

/* 10. CONTACT FORM — Web3Forms (access key configured ✓) */
(function(){
  const form = document.getElementById('contact-form');
  if(!form) return;

  const WEB3FORMS_KEY = '60c427af-1ed3-4fbc-a682-b24c869c9eb0';

  form.addEventListener('submit', async e => {
    e.preventDefault();
    clearErrs();

    /* — validate required fields — */
    const nm = field('#name');
    const em = field('#email');
    const mg = field('#message');
    let ok = true;
    if(!nm)                  { showErr('name-err',  'Please enter your name');                ok = false; }
    if(!validEmail(em))      { showErr('email-err', 'Please enter a valid email address');    ok = false; }
    if(!mg || mg.length < 10){ showErr('msg-err',   'Please describe your goals (min 10 characters)'); ok = false; }
    if(!ok) return;

    /* — loading state — */
    const btn  = document.getElementById('submit-btn');
    const bTxt = document.getElementById('btn-text');
    const bSp  = document.getElementById('btn-spin');
    const succ = document.getElementById('form-success');
    const fail = document.getElementById('form-error');
    toggleMsg(succ, false);
    toggleMsg(fail, false);
    const origLabel = bTxt ? bTxt.textContent : '';
    if(bTxt) bTxt.textContent = 'Sending…';
    if(bSp)  bSp.classList.remove('hidden');
    if(btn)  btn.disabled = true;

    /* — build FormData (matches user's snippet) — */
    const formData = new FormData(form);
    formData.append('access_key', WEB3FORMS_KEY);
    formData.append('subject',    `New Inquiry from ${nm} — Arnico Marketing`);
    formData.append('from_name',  'Arnico Marketing Website');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body:   formData
      });
      const data = await response.json();

      if(response.ok && data.success){
        toggleMsg(succ, true);   // show styled success banner
        form.reset();
      } else {
        console.warn('Web3Forms:', data.message);
        toggleMsg(fail, true);   // show styled error banner
      }

    } catch(err) {
      console.error('Network error:', err);
      /* last-resort: open mail client with all fields pre-filled */
      mailtoFallback();
      toggleMsg(succ, true);
      form.reset();

    } finally {
      if(bTxt) bTxt.textContent = origLabel;
      if(bSp)  bSp.classList.add('hidden');
      if(btn)  btn.disabled = false;
    }
  });

  /* ── helpers ── */
  function field(sel){
    const el = form.querySelector(sel);
    return el ? el.value.trim() : '';
  }
  function validEmail(e){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }
  function showErr(id, msg){
    const el  = document.getElementById(id);
    const inp = document.getElementById(id.replace('-err', ''));
    if(el)  { el.textContent = msg; el.classList.remove('hidden'); }
    if(inp) inp.classList.add('error');
  }
  function clearErrs(){
    document.querySelectorAll('.field-err').forEach(e => {
      e.textContent = ''; e.classList.add('hidden');
    });
    document.querySelectorAll('.form-input').forEach(e => e.classList.remove('error'));
  }
  function toggleMsg(el, show){
    if(el) el.classList.toggle('hidden', !show);
  }
  function mailtoFallback(){
    const nm = field('#name'),   em = field('#email'),
          ph = field('#phone'),  co = field('#company'),
          sv = field('#service'),bg = field('#budget'),
          mg = field('#message');
    const s = encodeURIComponent(`New Inquiry from ${nm} — Arnico Marketing`);
    const b = encodeURIComponent(
      `Name:    ${nm}\nEmail:   ${em}\nPhone:   ${ph||'—'}\nCompany: ${co||'—'}\n` +
      `Service: ${sv||'—'}\nBudget:  ${bg||'—'}\n\nMessage:\n${mg}`
    );
    window.open(`mailto:arnicomarketing@gmail.com?subject=${s}&body=${b}`);
  }
})();

/* 11. FILTER BUTTONS (Case Studies / Blog) */
(function(){
  const btns = document.querySelectorAll('[data-filter]');
  if(!btns.length) return;
  btns.forEach(btn=>{
    btn.addEventListener('click',()=>{
      const f=btn.dataset.filter;
      btns.forEach(b=>{
        b.classList.remove('bg-white','text-black');
        b.classList.add('border-white/10','text-gray-500');
      });
      btn.classList.add('bg-white','text-black');
      btn.classList.remove('border-white/10','text-gray-500');
      document.querySelectorAll('[data-cat]').forEach(el=>{
        const show = f==='all'||el.dataset.cat===f;
        el.style.transition='opacity .3s,transform .3s';
        el.style.opacity = show?'1':'0';
        el.style.transform = show?'scale(1)':'scale(.96)';
        el.style.pointerEvents = show?'':'none';
      });
    });
  });
})();

/* 12. BACK TO TOP */
(function(){
  const btn=document.getElementById('back-to-top');
  if(!btn) return;
  window.addEventListener('scroll',()=>btn.classList.toggle('show',window.scrollY>500),{passive:true});
  btn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
})();

/* 13. ACTIVE NAV */
(function(){
  const page=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav-link').forEach(a=>{
    if(a.getAttribute('href')===page) a.classList.add('active');
  });
})();
