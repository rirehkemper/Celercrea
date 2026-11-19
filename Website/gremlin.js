/* Glitch: CelerCrea's opt-out mascot personality layer.
   Auto-appearances are disabled under prefers-reduced-motion.
   No analytics, external requests, tracking cookies, or layout shifts. */
(function(){
  "use strict";

  var dock=document.getElementById("gremlinDock");
  var layer=document.getElementById("gremlinLayer");
  var button=document.getElementById("gremlinButton");
  var dismiss=document.getElementById("gremlinDismiss");
  var bubble=document.getElementById("gremlinBubble");
  var summon=document.getElementById("gremlinSummon");
  var contact=document.getElementById("contact");
  if(!dock||!layer||!button||!dismiss||!bubble||!summon)return;

  var motion=window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : {matches:false};
  var hiddenKey="cc-glitch-hidden-v1";
  var runKey="cc-glitch-run-v1";
  var dismissed=read(hiddenKey)==="1";
  var ran=read(runKey)==="1";
  var running=false;
  var hideTimer=0;
  var bubbleTimer=0;
  var loopTimer=0;
  var runTimer=0;
  var runnerTimeout=0;
  var lineIndex=0;
  var lines=[
    "Psst. I checked the cables. Probably.",
    "I live in the edge cases.",
    "Have you tried turning your chaos into a ticket?",
    "No bugs. Just undocumented features.",
    "The neon is a feature, not a bug.",
    "Need a human? Allen's better at this part."
  ];

  function read(key){
    try{return window.sessionStorage.getItem(key);}catch(error){return null;}
  }
  function write(key,value){
    try{window.sessionStorage.setItem(key,value);}catch(error){}
  }
  function forget(key){
    try{window.sessionStorage.removeItem(key);}catch(error){}
  }
  function contactVisible(){
    if(!contact)return false;
    if(contact.contains(document.activeElement))return true;
    var rect=contact.getBoundingClientRect();
    return rect.top<window.innerHeight-75&&rect.bottom>90;
  }
  function clearBubble(){
    window.clearTimeout(bubbleTimer);
    layer.classList.remove("is-speaking");
  }
  function hidePeek(){
    window.clearTimeout(hideTimer);
    clearBubble();
    dock.classList.remove("is-peeking");
    dock.inert=true;
  }
  function peek(manual){
    if(running || dismissed || (!manual&&(motion.matches||document.hidden||contactVisible())))return false;
    dock.inert=false;
    dock.classList.add("is-peeking");
    window.clearTimeout(hideTimer);
    hideTimer=window.setTimeout(hidePeek,manual?11000:8000);
    return true;
  }
  function talk(line){
    if(!peek(true))return;
    bubble.textContent=line;
    layer.classList.add("is-speaking");
    window.clearTimeout(bubbleTimer);
    bubbleTimer=window.setTimeout(clearBubble,4800);
  }
  function nextLine(){
    var line=lines[lineIndex%lines.length];
    lineIndex++;
    return line;
  }
  function schedulePeeks(delay){
    window.clearTimeout(loopTimer);
    loopTimer=window.setTimeout(function(){
      if(!dismissed && !running)peek(false);
      if(!dismissed)schedulePeeks(49000);
    },delay);
  }
  function finishRun(){
    if(!running)return;
    running=false;
    window.clearTimeout(runnerTimeout);
    dock.classList.remove("is-running");
    dock.inert=true;
  }
  function tryRun(){
    if(dismissed||ran||running||motion.matches||window.innerWidth<760)return;
    if(document.hidden||contactVisible()){
      runTimer=window.setTimeout(tryRun,10000);
      return;
    }
    ran=true;
    write(runKey,"1");
    hidePeek();
    running=true;
    dock.classList.add("is-running");
    dock.inert=true;
    dock.addEventListener("animationend",function onEnd(event){
      if(event.animationName!=="gremlin-sprint")return;
      dock.removeEventListener("animationend",onEnd);
      finishRun();
    });
    runnerTimeout=window.setTimeout(finishRun,4900);
  }
  button.addEventListener("click",function(){
    if(dismissed||running)return;
    talk(nextLine());
  });
  dismiss.addEventListener("click",function(event){
    event.stopPropagation();
    dismissed=true;
    write(hiddenKey,"1");
    window.clearTimeout(loopTimer);
    window.clearTimeout(runTimer);
    hidePeek();
  });
  summon.addEventListener("click",function(){
    if(running)return;
    dismissed=false;
    forget(hiddenKey);
    talk("You rang? Glitch reporting for questionable mischief.");
    if(!motion.matches)schedulePeeks(49000);
  });
  document.addEventListener("keydown",function(event){
    if(event.key==="Escape" && layer.classList.contains("is-speaking"))clearBubble();
  });
  document.addEventListener("visibilitychange",function(){
    if(document.hidden)hidePeek();
  });
  window.addEventListener("scroll",function(){
    if(contactVisible()&&dock.classList.contains("is-peeking"))hidePeek();
  },{passive:true});
  if(motion.addEventListener){
    motion.addEventListener("change",function(){
      if(motion.matches){
        hidePeek();
        finishRun();
        window.clearTimeout(loopTimer);
        window.clearTimeout(runTimer);
      }else if(!dismissed){
        schedulePeeks(5000);
        if(!ran)runTimer=window.setTimeout(tryRun,20000);
      }
    });
  }
  dock.inert=true;
  if(!dismissed && !motion.matches){
    schedulePeeks(5500);
    if(!ran)runTimer=window.setTimeout(tryRun,19000);
  }
})();
