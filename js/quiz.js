(function () {
  const questions = [
    { q:'What does Nmap primarily do?', opts:['Encrypt network traffic','Discover hosts and services on networks','Patch operating systems','Block malware'], a:1, exp:'Nmap is used for network discovery and security auditing (host discovery, port scanning, service detection, etc.).', level:'Beginner' },
    { q:'Which flag performs host discovery without port scanning?', opts:['-sS','-sn','-sV','-O'], a:1, exp:'-sn tells Nmap to skip port scanning and only determine which hosts are up.', level:'Beginner' },
    { q:'What does an "open" port state mean?', opts:['A firewall is blocking probes','No application is listening','An application is accepting connections/packets','The host is down'], a:2, exp:'Open means a service is actively accepting connections or packets on that port.', level:'Beginner' },
    { q:'What does a "closed" port state mean?', opts:['Probe blocked by filter','Reachable but no service listening','Service is encrypted','Port is hidden'], a:1, exp:'Closed ports respond but have no application listening.', level:'Beginner' },
    { q:'What does a "filtered" port state indicate?', opts:['Port is definitely open','Port is definitely closed','A filter prevents determining state','Service version was found'], a:2, exp:'Filtered means Nmap cannot determine whether the port is open because packet filtering prevented its probes from reaching the port.', level:'Beginner' },
    { q:'Which command scans localhost with default settings?', opts:['nmap -sn localhost','nmap 127.0.0.1','nmap -O -sn 127.0.0.1','nmap --script vuln 127.0.0.1'], a:1, exp:'nmap 127.0.0.1 runs a default scan against the local machine.', level:'Beginner' },
    { q:'Which flag specifies ports to scan?', opts:['-T','-p','-oN','-iL'], a:1, exp:'-p selects ports (e.g., -p 22,80,443 or -p 1-1000).', level:'Beginner' },
    { q:'What does -sV enable?', opts:['OS detection','Service/version detection','UDP scanning only','IPv6 scanning'], a:1, exp:'-sV probes open ports to determine service and version information.', level:'Beginner' },
    { q:'What is the safest practice before scanning a network?', opts:['Scan at night','Use -T5 for speed','Obtain explicit authorization','Disable logging'], a:2, exp:'You must have permission to assess systems you do not own; unauthorized scanning can be illegal and disruptive.', level:'Beginner' },
    { q:'Which output option saves all major formats at once?', opts:['-oN','-oX','-oG','-oA'], a:3, exp:'-oA saves normal, XML, and grepable outputs with a common basename.', level:'Beginner' },

    { q:'Which flag performs a TCP SYN scan?', opts:['-sT','-sU','-sS','-sA'], a:2, exp:'-sS is the TCP SYN (half-open) scan type.', level:'Intermediate' },
    { q:'Which flag performs a TCP connect scan?', opts:['-sS','-sT','-sF','-sn'], a:1, exp:'-sT uses the system connect call to establish full TCP connections.', level:'Intermediate' },
    { q:'Which scan type is used for UDP port scanning?', opts:['-sU','-sA','-sX','-sN'], a:0, exp:'-sU scans UDP ports.', level:'Intermediate' },
    { q:'What is -O used for?', opts:['Output formatting','OS detection','Open port filtering','Offline mode'], a:1, exp:'-O enables OS fingerprinting based on network behavior.', level:'Intermediate' },
    { q:'What does --top-ports 100 do?', opts:['Scans ports above 10000','Scans 100 random ports','Scans the 100 most common ports','Scans all ports and shows top 100'], a:2, exp:'--top-ports N scans Nmap’s N most common ports.', level:'Intermediate' },
    { q:'Which timing template is the default?', opts:['-T0','-T2','-T3','-T4'], a:2, exp:'-T3 is Normal, the default timing template.', level:'Intermediate' },
    { q:'What trade-off is associated with faster timing (e.g., -T5)?', opts:['Always more accurate','Lower network impact','Potentially reduced reliability/missed ports','Disables service detection'], a:2, exp:'Very fast scans can miss ports or be less reliable, and may increase network impact.', level:'Intermediate' },
    { q:'What does -sC do?', opts:['Clears cache','Runs default NSE scripts','Scans only closed ports','Enables CIDR mode'], a:1, exp:'-sC is equivalent to --script=default and runs default NSE scripts.', level:'Intermediate' },
    { q:'What does -p- mean?', opts:['Scan privileged ports only','Scan ports 1-1024','Scan all 65535 TCP ports','Disable port scanning'], a:2, exp:'-p- tells Nmap to scan all TCP ports (1-65535).', level:'Intermediate' },
    { q:'Why can UDP scan results be reported as open|filtered?', opts:['UDP is always encrypted','UDP responses can be ambiguous when no reply is received','Nmap cannot scan UDP','The host is offline'], a:1, exp:'Lack of response can mean open (dropped by app) or filtered by firewall, so Nmap may report open|filtered.', level:'Intermediate' },

    { q:'What is the purpose of a TCP ACK scan (-sA)?', opts:['Detect service versions','Map firewall filtering behavior','Discover hostnames','Enumerate UDP services'], a:1, exp:'ACK scans help determine whether ports are filtered or unfiltered, aiding firewall rule analysis.', level:'Advanced' },
    { q:'Which statement about NSE "vuln" scripts is most accurate?', opts:['Always safe on production','Require explicit authorization and careful isolation','Replace OS detection','Only work on localhost'], a:1, exp:'Vulnerability-related scripts can be intrusive/disruptive and must only be used with permission in controlled labs.', level:'Advanced' },
    { q:'What does --reason provide?', opts:['Faster scans','The reason Nmap assigned port states','Encryption keys','Automatic exploitation'], a:1, exp:'--reason shows why Nmap classified a port as open/closed/filtered (e.g., syn-ack, reset).', level:'Advanced' },
    { q:'Which option requests packet fragmentation?', opts:['-D','-f','--mtu 1500 only','-g'], a:1, exp:'-f enables packet fragmentation (an educational concept in this platform; use only in authorized labs).', level:'Advanced' },
    { q:'What is a limitation of OS detection?', opts:['It always identifies exact patch level','It is probabilistic and depends on responses','It works without any open/closed ports optimally','It replaces service detection'], a:1, exp:'OS fingerprinting provides guesses/matches based on signatures and network behavior; accuracy varies.', level:'Advanced' },
    { q:'Which command combination is best for comprehensive reporting in one step?', opts:['-oN only','-oG only','-oA basename','-v only'], a:2, exp:'-oA saves normal, XML, and grepable formats using a common basename.', level:'Advanced' },
    { q:'What does -6 indicate?', opts:['Scan 6 ports','IPv6 scanning mode','Version 6 detection','6 retries'], a:1, exp:'-6 enables IPv6 scanning.', level:'Advanced' },
    { q:'Why might -p- be used cautiously?', opts:['It disables host discovery','It scans all TCP ports and can take significant time','It only works on UDP','It deletes output files'], a:1, exp:'Scanning all 65535 ports increases time and network load; use when thorough coverage is needed and authorized.', level:'Advanced' },
    { q:'What is the key difference between network discovery and vulnerability exploitation?', opts:['They are identical','Discovery identifies assets/services; exploitation attempts to abuse weaknesses','Exploitation is always legal','Discovery requires exploits'], a:1, exp:'Discovery/enumeration maps exposure; exploitation goes further to leverage vulnerabilities and requires strict authorization and scope.', level:'Advanced' },
    { q:'Which approach best supports responsible disclosure after an authorized assessment?', opts:['Publicly post findings immediately','Ignore findings','Report clearly to the owner with evidence and remediation guidance','Sell access'], a:2, exp:'Responsible disclosure involves reporting issues to the system owner through agreed channels with actionable details.', level:'Advanced' }
  ];

  let current = 0;
  let selectedLevel = 'all';

  function init() {
    renderLevels();
    renderQuestion();
    renderStats();
    document.getElementById('quiz-reset')?.addEventListener('click', () => {
      StorageAPI.saveQuiz({ answers: {}, score: 0, completed: {} });
      StorageAPI.setQuizProgress(0);
      current = 0; renderQuestion(); renderStats();
      StorageAPI.toast('Quiz progress reset');
    });
  }

  function filteredQuestions() {
    if (selectedLevel === 'all') return questions.map((q,i)=>({q,i}));
    return questions.map((q,i)=>({q,i})).filter(x=>x.q.level===selectedLevel);
  }

  function renderLevels() {
    const c = document.getElementById('quiz-levels'); if(!c) return;
    const levels = ['all','Beginner','Intermediate','Advanced'];
    c.innerHTML = `<p class="muted small">Filter by difficulty</p><div class="level-pills">` +
      levels.map(l=>`<button class="chip ${l==='all'?'active':''}" data-qlevel="${l}">${l==='all'?'All':l}</button>`).join('') + `</div>`;
    c.querySelectorAll('[data-qlevel]').forEach(b=>b.addEventListener('click',()=>{
      c.querySelectorAll('[data-qlevel]').forEach(x=>x.classList.remove('active'));
      b.classList.add('active'); selectedLevel = b.dataset.qlevel; current = 0; renderQuestion();
    }));
  }

  function renderQuestion() {
    const card = document.getElementById('quiz-card'); if(!card) return;
    const list = filteredQuestions();
    if (!list.length) { card.innerHTML = '<p class="muted">No questions for this level.</p>'; return; }
    if (current >= list.length) current = 0;
    const { q, i } = list[current];
    const data = StorageAPI.getQuiz();
    const ans = data.answers[i];
    card.innerHTML = `
      <div class="lib-meta"><span class="tag level">${q.level}</span><span class="tag">Question ${current+1} / ${list.length}</span></div>
      <div class="quiz-q">${esc(q.q)}</div>
      <div class="quiz-options">
        ${q.opts.map((o,idx)=>`<button class="quiz-opt ${ans!==undefined?(idx===q.a?'correct':(idx===ans?'wrong':'')) : ''}" data-idx="${idx}" ${ans!==undefined?'disabled':''}>${esc(o)}</button>`).join('')}
      </div>
      ${ans!==undefined ? `<div class="quiz-feedback ${ans===q.a?'notice':'notice notice-danger'}" style="margin-top:.75rem"><strong>${ans===q.a?'Correct.':'Incorrect.'}</strong> ${esc(q.exp)}</div>` : ''}
      <div class="quiz-nav">
        <button class="btn btn-sm btn-ghost" id="q-prev">Previous</button>
        <button class="btn btn-sm btn-primary" id="q-next">Next</button>
      </div>`;
    card.querySelectorAll('.quiz-opt').forEach(btn=>btn.addEventListener('click',()=>{
      if (data.answers[i] !== undefined) return;
      const choice = +btn.dataset.idx;
      data.answers[i] = choice;
      // recompute score
      let score = 0; let answered = 0;
      questions.forEach((qq,qi)=>{ if (data.answers[qi]!==undefined){ answered++; if(data.answers[qi]===qq.a) score++; }});
      data.score = score;
      StorageAPI.saveQuiz(data);
      StorageAPI.setQuizProgress(answered);
      renderQuestion(); renderStats();
    }));
    document.getElementById('q-prev')?.addEventListener('click',()=>{ current = (current - 1 + list.length) % list.length; renderQuestion(); });
    document.getElementById('q-next')?.addEventListener('click',()=>{ current = (current + 1) % list.length; renderQuestion(); });
  }

  function renderStats() {
    const el = document.getElementById('quiz-stats'); if(!el) return;
    const data = StorageAPI.getQuiz();
    const answered = Object.keys(data.answers).length;
    const score = questions.reduce((s,q,i)=>s + (data.answers[i]===q.a?1:0), 0);
    const pct = answered ? Math.round((score/answered)*100) : 0;
    const byLevel = {Beginner:{t:0,c:0},Intermediate:{t:0,c:0},Advanced:{t:0,c:0}};
    questions.forEach((q,i)=>{ byLevel[q.level].t++; if (data.answers[i]===q.a) byLevel[q.level].c++; });
    el.innerHTML = `
      <div class="stat-row"><span>Answered</span><strong>${answered} / ${questions.length}</strong></div>
      <div class="stat-row"><span>Correct</span><strong>${score}</strong></div>
      <div class="stat-row"><span>Accuracy</span><strong>${pct}%</strong></div>
      <div class="stat-row"><span>Beginner</span><strong>${byLevel.Beginner.c}/${byLevel.Beginner.t}</strong></div>
      <div class="stat-row"><span>Intermediate</span><strong>${byLevel.Intermediate.c}/${byLevel.Intermediate.t}</strong></div>
      <div class="stat-row"><span>Advanced</span><strong>${byLevel.Advanced.c}/${byLevel.Advanced.t}</strong></div>`;
  }

  function esc(s){ return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m])); }
  window.Quiz = { init, questions };
})();