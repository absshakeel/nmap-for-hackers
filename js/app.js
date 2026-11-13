(function () {
  const stages = [
    { id:'s1', num:'01', title:'Target identification', what:'Defining which host(s), range, or network to assess.', why:'Scoping ensures scans are authorized, focused, and relevant to the objective.', how:'Nmap accepts IPs, hostnames, CIDR ranges, ranges, and input lists (-iL).', cmds:['nmap 192.168.1.10','nmap 192.168.1.0/24','nmap -iL targets.txt'], examples:['Single host: nmap 192.168.1.10','Subnet (authorized lab): nmap 192.168.1.0/24'], mistakes:['Scanning without permission','Using overly broad ranges unintentionally','Typos in target addresses'] },
    { id:'s2', num:'02', title:'Host discovery', what:'Determining which systems are online/reachable.', why:'Avoids wasting time scanning offline hosts and helps build asset inventory.', how:'Uses probes (ICMP, TCP/ARP in local contexts) depending on options and environment; -sn skips port scan.', cmds:['nmap -sn 192.168.1.0/24','nmap -Pn 192.168.1.10'], examples:['Ping scan: nmap -sn 192.168.1.0/24'], mistakes:['Assuming no response means host is down (filters may block probes)','Forgetting -Pn when discovery is blocked but ports may be reachable'] },
    { id:'s3', num:'03', title:'Port scanning', what:'Checking network ports to determine their states.', why:'Identifies exposed entry points and services.', how:'Sends probes using scan methods like SYN (-sS), connect (-sT), UDP (-sU), etc., interpreting responses.', cmds:['nmap -sS 192.168.1.10','nmap -sT -p 1-1000 192.168.1.10','nmap -sU --top-ports 20 192.168.1.10'], examples:['Common ports: nmap -p 22,80,443 192.168.1.10'], mistakes:['Confusing filtered with closed','Scanning all ports without considering time/impact'] },
    { id:'s4', num:'04', title:'Service detection', what:'Identifying which service is running on open ports.', why:'Knowing the service guides configuration review and risk assessment.', how:'After finding open ports, Nmap can send protocol-specific probes.', cmds:['nmap -sV 192.168.1.10','nmap -sV --version-intensity 5 192.168.1.10'], examples:['Detect services: nmap -sV -p 22,80,443 192.168.1.10'], mistakes:['Relying only on port numbers to infer services','Running high intensity probes without considering impact'] },
    { id:'s5', num:'05', title:'Version detection', what:'Determining software product and version details.', why:'Supports asset inventory, patch validation, and exposure analysis.', how:'Extends service detection with deeper probes and matching (-sV with intensity controls).', cmds:['nmap -sV --version-all 192.168.1.10'], examples:['Aggressive versioning: nmap -sV --version-intensity 9 192.168.1.10'], mistakes:['Treating version banners as guaranteed truth','Ignoring that some services limit fingerprinting'] },
    { id:'s6', num:'06', title:'OS fingerprinting', what:'Estimating the target operating system.', why:'Helps contextualize findings and expected behavior.', how:'Compares TCP/IP stack responses to signature database (-O); results are probabilistic.', cmds:['nmap -O 192.168.1.10','nmap -O --osscan-guess 192.168.1.10'], examples:['OS detect: nmap -O 192.168.1.10'], mistakes:['Assuming 100% accuracy','Running without enough open/closed ports for good fingerprints'] },
    { id:'s7', num:'07', title:'Script scanning', what:'Using NSE scripts to gather additional information.', why:'Automates checks for discovery, configuration details, and (in authorized labs) vulnerabilities.', how:'Nmap Scripting Engine runs scripts via -sC or --script categories/names.', cmds:['nmap -sC 192.168.1.10','nmap --script safe 192.168.1.10','nmap --script discovery 192.168.1.10'], examples:['Default scripts: nmap -sC -sV 192.168.1.10'], mistakes:['Running intrusive/vuln scripts without explicit authorization','Not understanding script behavior before use'] },
    { id:'s8', num:'08', title:'Results analysis', what:'Interpreting scan output to make informed decisions.', why:'Accurate interpretation drives remediation, hardening, and reporting.', how:'Review host state, port states, reasons, services, and save outputs (-oN/-oX/-oG/-oA).', cmds:['nmap --reason 192.168.1.10','nmap -oA scan_results 192.168.1.10'], examples:['Save all formats: nmap -sV -oA audit 192.168.1.10'], mistakes:['Confusing open/closed/filtered','Ignoring context like latency, filters, and false positives'] }
  ];

  function renderFundamentals() {
    const grid = document.getElementById('stages-grid');
    const detail = document.getElementById('stage-detail');
    if (!grid || !detail) return;
    grid.innerHTML = stages.map(s => `
      <div class="card stage-card" data-id="${s.id}" tabindex="0" role="button">
        <div class="stage-num">${s.num}</div>
        <h3>${s.title}</h3>
        <p class="muted small">${s.what}</p>
      </div>`).join('');

    function select(id) {
      const s = stages.find(x=>x.id===id); if(!s) return;
      grid.querySelectorAll('.stage-card').forEach(c=>c.classList.toggle('active', c.dataset.id===id));
      detail.innerHTML = `
        <div class="stage-num">${s.num}</div>
        <h3>${s.title}</h3>
        <div class="detail-block"><h4>What it does</h4><p class="muted">${s.what}</p></div>
        <div class="detail-block"><h4>Why it is useful</h4><p class="muted">${s.why}</p></div>
        <div class="detail-block"><h4>How Nmap performs it</h4><p class="muted">${s.how}</p></div>
        <div class="detail-block"><h4>Relevant commands</h4><div>${s.cmds.map(c=>`<span class="cmd-chip">${esc(c)}</span>`).join('')}</div></div>
        <div class="detail-block"><h4>Practical examples</h4><ul>${s.examples.map(e=>`<li>${esc(e)}</li>`).join('')}</ul></div>
        <div class="detail-block"><h4>Common mistakes</h4><ul>${s.mistakes.map(m=>`<li>${esc(m)}</li>`).join('')}</ul></div>`;
      StorageAPI.markStage(id);
    }
    grid.querySelectorAll('.stage-card').forEach(c=>{
      c.addEventListener('click',()=>select(c.dataset.id));
      c.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' ') { e.preventDefault(); select(c.dataset.id); }});
    });
    select(stages[0].id);
  }

  function heroTerminal() {
    const el = document.querySelector('#hero-terminal code'); if(!el) return;
    const lines = [
      '$ nmap -sn 192.168.1.0/24',
      'Nmap scan report for 192.168.1.10',
      'Host is up (0.0021s latency).',
      '$ nmap -sV -p 22,80,443 192.168.1.10',
      '22/tcp  open  ssh     OpenSSH 8.9p1',
      '80/tcp  open  http    nginx 1.22.1',
      '443/tcp open  https   nginx 1.22.1',
      '$ # Commands generated for learning - never auto-executed'
    ];
    let i=0, j=0, out='';
    function tick(){
      if (i >= lines.length) { setTimeout(()=>{ i=0;j=0;out=''; tick(); }, 2200); return; }
      const line = lines[i];
      out += line[j] || '';
      j++;
      if (j > line.length) { out += '\n'; i++; j=0; setTimeout(tick, 350); }
      else { setTimeout(tick, 18); }
      el.textContent = out;
    }
    tick();
  }

  function setupNav() {
    const menu = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      document.body.appendChild(overlay);
    }
    const setSidebar = (open) => {
      sidebar?.classList.toggle('open', open);
      overlay.classList.toggle('show', open);
      menu?.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    menu?.addEventListener('click', () => setSidebar(!sidebar.classList.contains('open')));
    overlay.addEventListener('click', () => setSidebar(false));
    document.querySelectorAll('.nav-link').forEach(a => a.addEventListener('click', () => {
      if (window.innerWidth <= 900) setSidebar(false);
    }));
    const links = Array.from(document.querySelectorAll('.nav-link'));
    const sections = links.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });
    sections.forEach(s => obs.observe(s));
  }

  function setupBookmarksDrawer() {
    const panel = document.getElementById('bookmarks-panel');
    const open = () => { panel.classList.add('open'); panel.setAttribute('aria-hidden','false'); CommandLibrary.renderBookmarks(); };
    const close = () => { panel.classList.remove('open'); panel.setAttribute('aria-hidden','true'); };
    document.getElementById('bookmarks-toggle')?.addEventListener('click', open);
    document.getElementById('bookmarks-close')?.addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  function setupBackToTop() {
    const btn = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => { btn.classList.toggle('show', window.scrollY > 400); });
    btn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  function setupModal() {
    const modal = document.getElementById('detail-modal');
    const body = document.getElementById('modal-body');
    const title = document.getElementById('modal-title');
    if (!modal) return;
    function close() { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
    function open(data) {
      title.textContent = data.title || 'Details';
      body.innerHTML = data.html || '';
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      modal.querySelectorAll('[data-copy]').forEach(b => b.addEventListener('click', () => StorageAPI.copyText(b.getAttribute('data-copy'))));
    }
    modal.addEventListener('click', (e) => { if (e.target.closest('[data-close-modal]') || e.target.id === 'modal-close') close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });
    window.openDetailModal = open;
    window.closeDetailModal = close;
  }

  function setupSearch() {
    const input = document.getElementById('global-search');
    const results = document.getElementById('search-results');
    if (!input || !results) return;

    function buildIndex() {
      const idx = [];
      stages.forEach(s => idx.push({ title: s.title, meta: 'Fundamental', href: '#fundamentals', text: s.what+' '+s.cmds.join(' ') }));
      const refItems = (CommandLibrary.allReference || CommandLibrary.commands || []);
      refItems.forEach(c => idx.push({ title: c.cmd, meta: 'Command · ' + (c.cat || c.category || 'Reference'), href: '#command-reference', text: (c.exp || c.easy || '') + ' ' + (c.remember || '') }));
      Labs.labs.forEach(l => idx.push({ title: l.title, meta: 'Lab · ' + l.level, href: '#labs', text: l.objective+' '+l.command }));
      Quiz.questions.forEach(q => idx.push({ title: q.q, meta: 'Quiz · ' + q.level, href: '#quiz', text: q.exp }));
      idx.push({ title: 'Interactive Nmap Command Builder', meta: 'Tool', href: '#command-builder', text: 'generate command flags scan' });
      idx.push({ title: 'Output Analyzer', meta: 'Tool', href: '#output-analyzer', text: 'open closed filtered simulated' });
      idx.push({ title: 'Command Reference', meta: 'Reference', href: '#command-reference', text: 'cheat sheet library commands flags search target copy details' });
      idx.push({ title: 'Network Visualizer', meta: 'Diagram', href: '#visualizer', text: 'topology network diagram discovery hosts ports services simulation' });
      return idx;
    }
    const index = buildIndex();

    function render(q) {
      const term = q.toLowerCase().trim();
      if (!term) { results.classList.remove('open'); results.innerHTML=''; return; }
      const hits = index.filter(i => (i.title+' '+i.meta+' '+i.text).toLowerCase().includes(term)).slice(0, 8);
      if (!hits.length) { results.innerHTML = '<div class="search-item muted">No results found.</div>'; results.classList.add('open'); return; }
      results.innerHTML = hits.map(h => `<div class="search-item" data-href="${h.href}"><div class="s-title">${esc(h.title)}</div><div class="s-meta">${esc(h.meta)}</div></div>`).join('');
      results.classList.add('open');
      results.querySelectorAll('.search-item[data-href]').forEach(it => it.addEventListener('click', () => {
        location.hash = it.dataset.href;
        results.classList.remove('open'); input.value='';
      }));
    }
    input.addEventListener('input', () => render(input.value));
    document.addEventListener('click', (e) => { if (!e.target.closest('.search-wrap')) results.classList.remove('open'); });
    input.addEventListener('keydown', (e) => { if (e.key === 'Escape') { results.classList.remove('open'); input.blur(); } });
  }

  function esc(s){ return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m])); }

  document.addEventListener('DOMContentLoaded', () => {
    try {
      StorageAPI.updateGlobalProgress();
      renderFundamentals();
      heroTerminal();
      if (NetworkVisualizer.renderVisualizer) NetworkVisualizer.renderVisualizer();
      if (NetworkVisualizer.renderDiscovery) NetworkVisualizer.renderDiscovery();
      OutputAnalyzer.render();
      if (CommandLibrary.renderCommandReference) CommandLibrary.renderCommandReference();
      else { CommandLibrary.renderLibrary && CommandLibrary.renderLibrary(); CommandLibrary.renderCheatsheet && CommandLibrary.renderCheatsheet(); }
      CommandLibrary.renderBookmarks();
      CommandBuilder.init();
      CommandBuilder.renderHistory();
      Labs.init();
      Quiz.init();
      setupNav();
      setupBookmarksDrawer();
      setupBackToTop();
      setupModal();
      setupSearch();
    } catch (e) {
      console.error('Initialization error', e);
    }
  });
})();