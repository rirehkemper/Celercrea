/* CelerCrea / responsive navigation, contact handling and Glitch. */
(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const menu=$('menuToggle'),nav=$('mainNav'),year=$('year');
  if(year)year.textContent=String(new Date().getFullYear());
  function closeNav(){
    if(!menu||!nav)return;
    nav.removeAttribute('data-open');
    menu.setAttribute('aria-expanded','false');
    menu.setAttribute('aria-label','Open navigation');
  }
  if(menu&&nav){
    menu.addEventListener('click',()=>{
      const expanded=menu.getAttribute('aria-expanded')==='true';
      menu.setAttribute('aria-expanded',String(!expanded));
      menu.setAttribute('aria-label',expanded?'Open navigation':'Close navigation');
      if(expanded)nav.removeAttribute('data-open');else nav.setAttribute('data-open','true');
    });
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeNav));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeNav();});
    window.addEventListener('resize',()=>{if(window.innerWidth>700)closeNav();});
  }

  const form=$('contactForm'),formBtn=$('contactBtn'),formStatus=$('formStatus');
  if(form&&formBtn&&formStatus){
    const show=(message,type='')=>{formStatus.textContent=message;formStatus.dataset.status=type;};
    form.addEventListener('submit',async event=>{
      event.preventDefault();
      if(formBtn.disabled)return;
      const value=name=>String(form.elements.namedItem(name).value||'').trim();
      const name=value('name'),email=value('email'),type=value('type'),message=value('message'),company=value('company');
      if(!name||!email||!message){show('Please complete your name, email, and project details.','error');return;}
      formBtn.disabled=true;formBtn.setAttribute('aria-busy','true');show('Sending your inquiry…');
      const controller=new AbortController();
      const timer=setTimeout(()=>controller.abort(),15000);
      try{
        const response=await fetch('/api/contact',{
          method:'POST',headers:{'Content-Type':'application/json'},
          body:JSON.stringify({name,email,type,message,company}),signal:controller.signal
        });
        const data=await response.json().catch(()=>null);
        if(!response.ok||!data||!data.ok)throw new Error('Delivery could not be confirmed. Please try again.');
        show("Message sent. Thanks for reaching out — I'll follow up by email.",'success');
        form.reset();
      }catch(error){
        show(error.name==='AbortError'?'The request timed out. Please try again.':error.message||'Unable to send. Please try again.','error');
      }finally{clearTimeout(timer);formBtn.disabled=false;formBtn.removeAttribute('aria-busy');}
    });
  }

  const peek=$('glitchPeek'),side=peek&&peek.closest('.hero-side'),bubble=$('glitchTooltip');
  const runner=$('runnerTrack'),summon=$('summonGlitch'),dismiss=$('dismissGlitch');
  if(!peek||!side||!bubble||!runner||!summon||!dismiss)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const hideKey='cc-glitch-hidden-v2',runKey='cc-glitch-ran-v2';
  const read=k=>{try{return sessionStorage.getItem(k);}catch(_){return null;}};
  const save=(k,v)=>{try{sessionStorage.setItem(k,v);}catch(_){}};
  const clear=k=>{try{sessionStorage.removeItem(k);}catch(_){}};
  let hidden=read(hideKey)==='1',ran=read(runKey)==='1',bubbleTimer=0;
  let index=0;
  const phrases=[
    'Psst. The gremlin is in the details.',
    'Have you tried turning your chaos into a ticket?',
    'No bugs. Just undocumented features.',
    "Don't worry. Allen handles the serious stuff.",
    'I live in the edge cases.',
    'Build serious. Stay curious.'
  ];
  function hideBubble(){bubble.classList.remove('is-visible');}
  function reveal(){
    if(hidden)return;
    side.classList.remove('is-dismissed');
    peek.classList.add('is-visible');
    dismiss.hidden=false;
  }
  function speak(text){
    reveal();
    bubble.textContent=text;
    bubble.classList.add('is-visible');
    clearTimeout(bubbleTimer);
    bubbleTimer=setTimeout(hideBubble,4700);
  }
  function setHidden(){
    hidden=true;save(hideKey,'1');
    peek.classList.remove('is-visible');
    side.classList.add('is-dismissed');
    dismiss.hidden=true;
    hideBubble();
  }
  peek.addEventListener('click',()=>speak(phrases[(index++)%phrases.length]));
  dismiss.addEventListener('click',setHidden);
  summon.addEventListener('click',()=>{
    hidden=false;clear(hideKey);
    document.querySelector('.hero').scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'start'});
    speak('You rang? Glitch reporting for questionable mischief.');
  });
  document.addEventListener('keydown',event=>{if(event.key==='Escape')hideBubble();});
  if(hidden){setHidden();}
  else if(reduced.matches){reveal();}
  else setTimeout(()=>{if(!document.hidden)reveal();},1250);

  // One session-scoped sprint, only as the CTA enters view. Never during contact.
  const cta=document.querySelector('.cta-band'),contact=$('contact');
  function canRun(){
    if(hidden||ran||reduced.matches||window.innerWidth<760||document.hidden)return false;
    if(document.activeElement&&contact.contains(document.activeElement))return false;
    const r=contact.getBoundingClientRect();
    return !(r.top<window.innerHeight-70&&r.bottom>70);
  }
  function startRun(){
    if(!canRun())return;
    ran=true;save(runKey,'1');
    runner.classList.add('is-running');
    runner.addEventListener('animationend',()=>runner.classList.remove('is-running'),{once:true});
  }
  if(cta && 'IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      if(entries.some(e=>e.isIntersecting)){
        observer.disconnect();
        setTimeout(startRun,1800);
      }
    },{threshold:.35});
    observer.observe(cta);
  }
})();