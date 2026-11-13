(function () {
  const scanTypes = [
    { id: 'sS', flag: '-sS', name: 'TCP SYN Scan', desc: 'Half-open TCP scan', note: 'Sends SYN and analyzes responses without completing full handshake in typical use. Often requires privileges in real environments.' },
    { id: 'sT', flag: '-sT', name: 'TCP Connect Scan', desc: 'Full TCP connection', note: 'Uses the OS connect() call to complete TCP handshakes. Widely available without raw socket privileges.' },
    { id: 'sU', flag: '-sU', name: 'UDP Scan', desc: 'UDP port scanning', note: 'Sends UDP probes; slower and can be ambiguous (open|filtered). Important for DNS/SNMP/NTP audits.' },
    { id: 'sA', flag: '-sA', name: 'TCP ACK Scan', desc: 'Firewall rule analysis', note: 'Helps map filtered vs unfiltered ports; does not determine open ports.' },
    { id: 'sF', flag: '-sF', name: 'FIN Scan', desc: 'FIN-based probing', note: 'Sends FIN packets; behavior varies by stack/firewall. Educational for understanding TCP responses.' },
    { id: 'sN', flag: '-sN', name: 'NULL Scan', desc: 'TCP probe without flags', note: 'Sends packets with no flags set; response interpretation depends on target/firewall behavior.' },
    { id: 'sX', flag: '-sX', name: 'Xmas Scan', desc: 'TCP Xmas probing', note: 'Sets FIN, PSH, URG flags; useful for learning how different systems handle unusual packets.' },
    { id: 'sn', flag: '-sn', name: 'Ping Scan', desc: 'Host discovery without port scanning', note: 'Finds live hosts only. Incompatible with port scan flags and port selection in typical usage.' },
    { id: 'sT2', flag: '-sT', name: 'TCP Port Scan', desc: 'TCP connection-based scanning', note: 'Connection-oriented TCP scan (same flag as connect scan) emphasized for straightforward port enumeration.' }
  ];
  const portPresets = [
    { id: 'default', label: 'Default ports', flag: '', desc: 'Nmap default (top ~1000 TCP ports for common scans)' },
    { id: 'top100', label: 'Top 100 ports', flag: '--top-ports 100', desc: 'Scan 100 most common ports' },
    { id: 'top1000', label: 'Top 1000 ports', flag: '--top-ports 1000', desc: 'Scan 1000 most common ports' },
    { id: 'all', label: 'All TCP ports', flag: '-p-', desc: 'Scan 1-65535' }
  ];
  const timings = [
    { id: 'T0', flag: '-T0', name: 'Paranoid', desc: 'Very slow, IDS-evasion oriented timing' },
    { id: 'T1', flag: '-T1', name: 'Sneaky', desc: 'Slow timing' },
    { id: 'T2', flag: '-T2', name: 'Polite', desc: 'Reduced bandwidth/target impact' },
    { id: 'T3', flag: '-T3', name: 'Normal', desc: 'Default balance' },
    { id: 'T4', flag: '-T4', name: 'Aggressive', desc: 'Faster, assumes reliable network' },
    { id: 'T5', flag: '-T5', name: 'Insane', desc: 'Very fast, may miss ports' }
  ];

  const state = { scan: null, portPreset: 'default', timing: 'T3' };

  function init() {
    renderScanCards();
    renderPortCards();
    renderTimingCards();
    bindInputs();
    initQuickControls();
    update();
  }

  function initQuickControls() {
    const advToggle = document.getElementById('builder-show-advanced');
    function applyAdvancedVisibility() {
      const show = advToggle && advToggle.checked;
      document.querySelectorAll('#builder-options .builder-advanced').forEach(el => {
        el.classList.toggle('builder-advanced-hidden', !show);
      });
    }
    if (advToggle) {
      advToggle.checked = false;
      advToggle.addEventListener('change', applyAdvancedVisibility);
    }
    applyAdvancedVisibility();

    document.querySelectorAll('[data-builder-preset]').forEach(btn => {
      btn.addEventListener('click', () => applyPreset(btn.dataset.builderPreset));
    });
  }

  function applyPreset(name) {
    resetBuilder();
    const target = document.getElementById('target-value');
    if (target && !target.value.trim()) target.value = '192.168.1.10';
    if (name === 'basic') {
      state.scan = 'sS'; state.portPreset = 'top100'; state.timing = 'T3';
    } else if (name === 'discovery') {
      state.scan = 'sn'; state.portPreset = 'default'; state.timing = 'T3';
    } else if (name === 'service') {
      state.scan = 'sS'; state.portPreset = 'top100'; state.timing = 'T4';
      document.getElementById('opt-sv').checked = true;
      document.getElementById('opt-version-intensity').disabled = false;
      document.getElementById('opt-reason').checked = true;
    } else if (name === 'fulltcp') {
      state.scan = 'sS'; state.portPreset = 'default'; state.timing = 'T4';
      document.getElementById('port-custom').value = '1-1000';
      document.getElementById('opt-reason').checked = true;
    } else if (name === 'udp') {
      state.scan = 'sU'; state.portPreset = 'top100'; state.timing = 'T3';
      document.getElementById('opt-reason').checked = true;
    }
    syncCards();
    update();
    StorageAPI && StorageAPI.toast && StorageAPI.toast('Preset applied');
  }

  function renderScanCards() {
    const c = document.getElementById('scan-type-cards'); if (!c) return;
    c.innerHTML = scanTypes.map(s => `<div class="opt-card" data-scan="${s.id}" tabindex="0" role="button" aria-pressed="false">
      <div class="flag">${s.flag}</div><div class="name">${s.name}</div><div class="desc">${s.desc}</div></div>`).join('');
    c.querySelectorAll('.opt-card').forEach(card => {
      const handler = () => { state.scan = state.scan === card.dataset.scan ? null : card.dataset.scan; syncCards(); update(); };
      card.addEventListener('click', handler);
      card.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){ e.preventDefault(); handler(); }});
    });
  }
  function renderPortCards() {
    const c = document.getElementById('port-preset-cards'); if (!c) return;
    c.innerHTML = portPresets.map(p => `<div class="opt-card ${p.id==='default'?'selected':''}" data-port="${p.id}" tabindex="0" role="button">
      <div class="name">${p.label}</div><div class="desc">${p.desc}</div></div>`).join('');
    c.querySelectorAll('.opt-card').forEach(card => {
      const handler = () => { state.portPreset = card.dataset.port; if (state.portPreset !== 'default') document.getElementById('port-custom').value = ''; syncCards(); update(); };
      card.addEventListener('click', handler);
      card.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){ e.preventDefault(); handler(); }});
    });
  }
  function renderTimingCards() {
    const c = document.getElementById('timing-cards'); if (!c) return;
    c.innerHTML = timings.map(t => `<div class="opt-card ${t.id==='T3'?'selected':''}" data-timing="${t.id}" tabindex="0" role="button">
      <div class="flag">${t.flag}</div><div class="name">${t.name}</div><div class="desc">${t.desc}</div></div>`).join('');
    c.querySelectorAll('.opt-card').forEach(card => {
      const handler = () => { state.timing = card.dataset.timing; syncCards(); update(); };
      card.addEventListener('click', handler);
      card.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){ e.preventDefault(); handler(); }});
    });
  }
  function syncCards() {
    document.querySelectorAll('#scan-type-cards .opt-card').forEach(c => c.classList.toggle('selected', c.dataset.scan === state.scan));
    document.querySelectorAll('#port-preset-cards .opt-card').forEach(c => c.classList.toggle('selected', c.dataset.port === state.portPreset));
    document.querySelectorAll('#timing-cards .opt-card').forEach(c => c.classList.toggle('selected', c.dataset.timing === state.timing));
  }

  function bindInputs() {
    const ids = ['target-type','target-value','port-custom','opt-sv','opt-version-intensity','opt-version-all','opt-o','opt-osscan-limit','opt-osscan-guess','opt-on','opt-ox','opt-og','opt-oa','opt-v','opt-vv','opt-reason','opt-output-name','opt-sc','opt-script','opt-script-help','opt-f','opt-mtu','opt-decoy','opt-source-port'];
    ids.forEach(id => { const el = document.getElementById(id); if (el) el.addEventListener('input', update); if (el) el.addEventListener('change', update); });
    document.getElementById('opt-sv').addEventListener('change', () => {
      const on = document.getElementById('opt-sv').checked;
      document.getElementById('opt-version-intensity').disabled = !on;
      if (on) document.getElementById('opt-version-all').checked = false;
    });
    document.getElementById('opt-version-all').addEventListener('change', () => {
      if (document.getElementById('opt-version-all').checked) {
        document.getElementById('opt-sv').checked = true;
        document.getElementById('opt-version-intensity').disabled = false;
        document.getElementById('opt-version-intensity').value = 9;
        document.getElementById('version-intensity-val').textContent = '9';
      }
    });
    document.getElementById('opt-version-intensity').addEventListener('input', (e)=>{ document.getElementById('version-intensity-val').textContent = e.target.value; });
    document.getElementById('port-custom').addEventListener('input', () => { if (document.getElementById('port-custom').value.trim()) { state.portPreset = 'default'; syncCards(); } });
    document.getElementById('copy-command').addEventListener('click', () => { StorageAPI.copyText(currentCommand()); StorageAPI.addHistory(currentCommand()); renderHistory(); });
    document.getElementById('bookmark-command').addEventListener('click', () => { StorageAPI.addBookmark(currentCommand()); StorageAPI.toast('Command bookmarked'); window.CommandLibrary && CommandLibrary.renderBookmarks(); });
    document.getElementById('reset-builder').addEventListener('click', resetBuilder);
    document.getElementById('clear-builder').addEventListener('click', clearBuilder);
  }

  function getTarget() {
    const type = document.getElementById('target-type').value;
    const val = document.getElementById('target-value').value.trim();
    return { type, val };
  }

  function validateTarget() {
    const { type, val } = getTarget();
    const el = document.getElementById('target-validation');
    if (!val) { el.textContent = 'Target is required.'; el.className = 'validation-msg error'; return { ok:false, msg:'Target is required.' }; }
    const ipv4 = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;
    const host = /^[a-zA-Z0-9.-]+$/;
    const cidr = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}\/([0-9]|[12][0-9]|3[0-2])$/;
    const range = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}(-\d{1,3}|\.\d{1,3}-\d{1,3})?$/;
    let ok = true, msg = 'Target looks valid.';
    if (type === 'single' && !ipv4.test(val)) { ok = false; msg = 'Enter a valid IPv4 address (e.g. 192.168.1.10).'; }
    if (type === 'hostname' && !host.test(val)) { ok = false; msg = 'Enter a valid hostname.'; }
    if (type === 'cidr' && !cidr.test(val)) { ok = false; msg = 'Enter a valid CIDR (e.g. 192.168.1.0/24).'; }
    if (type === 'range' && !range.test(val) && !val.includes('-')) { ok = false; msg = 'Enter a valid IP range (e.g. 192.168.1.1-50).'; }
    if (type === 'file' && /\s/.test(val)) { ok = false; msg = 'Input file path should not contain spaces for this builder.'; }
    if (type === 'multiple' && val.length < 3) { ok = false; msg = 'Enter multiple targets separated by spaces.'; }
    el.textContent = msg; el.className = 'validation-msg ' + (ok ? 'ok' : 'error');
    return { ok, msg };
  }

  function build() {
    const parts = ['nmap'];
    const warnings = [];
    const explanations = [];
    const { type, val } = getTarget();
    const scan = scanTypes.find(s => s.id === state.scan);
    const timing = timings.find(t => t.id === state.timing);

    // scan type
    if (scan) {
      if (scan.id === 'sT2') parts.push('-sT'); else parts.push(scan.flag);
      explanations.push(`<strong>${scan.flag}</strong>: ${scan.name} — ${scan.desc}. ${scan.note}`);
      if (scan.flag === '-sn') explanations.push('<strong>-sn</strong> performs host discovery only (no port scan).');
    }

    // ports
    const customPort = document.getElementById('port-custom').value.trim();
    const preset = portPresets.find(p => p.id === state.portPreset);
    if (scan && scan.flag === '-sn') {
      if (customPort || (preset && preset.flag)) warnings.push({ msg: 'Ping scan (-sn) does not perform port scanning; port options are usually not applicable.', danger: false });
    } else {
      if (customPort) {
        if (/^-p/.test(customPort) || /^--top-ports/.test(customPort)) parts.push(customPort);
        else if (/^\d/.test(customPort)) parts.push('-p', customPort);
        else parts.push(customPort);
        explanations.push(`<strong>Port selection</strong>: ${escapeHtml(customPort)} — scans specified ports/range.`);
      } else if (preset && preset.flag) {
        parts.push(preset.flag);
        explanations.push(`<strong>${preset.flag || 'Default ports'}</strong>: ${preset.desc}.`);
      }
    }

    // service/version
    const sv = document.getElementById('opt-sv').checked;
    const vall = document.getElementById('opt-version-all').checked;
    const vint = document.getElementById('opt-version-intensity').value;
    if (sv || vall) {
      parts.push('-sV');
      explanations.push('<strong>-sV</strong>: Service/version detection — probes services to identify software and versions.');
      if (vall) { parts.push('--version-all'); explanations.push('<strong>--version-all</strong>: Use all version detection probes (intensity 9).'); }
      else if (vint && vint !== '7') { parts.push('--version-intensity', vint); explanations.push(`<strong>--version-intensity ${vint}</strong>: Adjusts probe thoroughness (0-9).`); }
    }

    // OS
    if (document.getElementById('opt-o').checked) { parts.push('-O'); explanations.push('<strong>-O</strong>: OS detection via TCP/IP fingerprinting (probabilistic).'); }
    if (document.getElementById('opt-osscan-limit').checked) { parts.push('--osscan-limit'); explanations.push('<strong>--osscan-limit</strong>: Limit OS detection to promising targets.'); }
    if (document.getElementById('opt-osscan-guess').checked) { parts.push('--osscan-guess'); explanations.push('<strong>--osscan-guess</strong>: Guess OS more aggressively when uncertain.'); }

    // timing
    if (timing && timing.id !== 'T3') { parts.push(timing.flag); explanations.push(`<strong>${timing.flag}</strong>: ${timing.name} — ${timing.desc}.`); }
    else if (timing) explanations.push('<strong>-T3</strong> (default): Normal timing balance between speed and reliability.');

    // output
    const outBase = (document.getElementById('opt-output-name').value.trim() || 'scan_results').replace(/[^a-zA-Z0-9._-]/g,'_');
    if (document.getElementById('opt-oa').checked) { parts.push('-oA', outBase); explanations.push(`<strong>-oA ${outBase}</strong>: Save normal, XML, and grepable output.`); }
    else {
      if (document.getElementById('opt-on').checked) { parts.push('-oN', outBase + '.txt'); explanations.push(`<strong>-oN</strong>: Save normal output.`); }
      if (document.getElementById('opt-ox').checked) { parts.push('-oX', outBase + '.xml'); explanations.push(`<strong>-oX</strong>: Save XML output.`); }
      if (document.getElementById('opt-og').checked) { parts.push('-oG', outBase + '.gnmap'); explanations.push(`<strong>-oG</strong>: Save grepable output.`); }
    }
    if (document.getElementById('opt-vv').checked) { parts.push('-vv'); explanations.push('<strong>-vv</strong>: Increase verbosity level.'); }
    else if (document.getElementById('opt-v').checked) { parts.push('-v'); explanations.push('<strong>-v</strong>: Verbose output.'); }
    if (document.getElementById('opt-reason').checked) { parts.push('--reason'); explanations.push('<strong>--reason</strong>: Display reason for each port state.'); }

    // NSE
    if (document.getElementById('opt-sc').checked) { parts.push('-sC'); explanations.push('<strong>-sC</strong>: Run default NSE scripts (equivalent to --script=default).'); }
    const script = document.getElementById('opt-script').value;
    if (script) {
      parts.push('--script', script);
      explanations.push(`<strong>--script ${script}</strong>: Run scripts from the selected category/example.`);
      if (script === 'vuln') warnings.push({ msg: 'Category "vuln" can be intrusive and should only be used with explicit authorization in isolated labs.', danger: true });
    }
    if (document.getElementById('opt-script-help').checked) { parts.push('--script-help'); explanations.push('<strong>--script-help</strong>: Show help/documentation for scripts (learning/reference).'); }

    // Evasion concepts (educational)
    if (document.getElementById('opt-f').checked) { parts.push('-f'); explanations.push('<strong>-f</strong>: Fragment packets (educational/defensive understanding; authorized labs only).'); warnings.push({ msg: 'Fragmentation/evasion options are shown for defensive education. Do not use to bypass controls on unauthorized networks.', danger: false }); }
    const mtu = document.getElementById('opt-mtu').value.trim();
    if (mtu) { parts.push('--mtu', mtu); explanations.push(`<strong>--mtu ${escapeHtml(mtu)}</strong>: Specify custom MTU for fragmentation (multiple of 8).`); }
    const decoy = document.getElementById('opt-decoy').value.trim();
    if (decoy) { parts.push('-D', decoy); explanations.push(`<strong>-D ${escapeHtml(decoy)}</strong>: Decoy scan concept for understanding log attribution (authorized labs only).`); }
    const sport = document.getElementById('opt-source-port').value.trim();
    if (sport) { parts.push('--source-port', sport); explanations.push(`<strong>--source-port ${escapeHtml(sport)}</strong>: Set source port for probes (firewall behavior analysis concept).`); }

    // incompatibilities
    if (scan && scan.flag === '-sn' && (sv || vall || document.getElementById('opt-o').checked)) {
      warnings.push({ msg: 'Combining host discovery (-sn) with version/OS detection is not typical; -sn skips port scanning.', danger: false });
    }
    if (scan && scan.flag === '-sU' && !customPort && (!preset || preset.id === 'default') ) {
      warnings.push({ msg: 'UDP scans over many ports can be slow. Consider --top-ports or specific ports for learning labs.', danger: false });
    }
    if (document.getElementById('opt-v').checked && document.getElementById('opt-vv').checked) {
      warnings.push({ msg: 'Both -v and -vv selected; -vv already implies increased verbosity.', danger: false });
    }

    // target
    const v = validateTarget();
    if (v.ok) {
      if (type === 'file') { parts.push('-iL', val); explanations.push(`<strong>-iL ${escapeHtml(val)}</strong>: Read targets from an input file.`); }
      else { parts.push(val); explanations.push(`<strong>Target</strong>: ${escapeHtml(val)} (${type}).`); }
    } else {
      parts.push('<target>');
    }

    return { cmd: parts.join(' '), warnings, explanations };
  }

  let _cmd = 'nmap';
  function currentCommand() { return _cmd; }
  function update() {
    const res = build();
    _cmd = res.cmd;
    document.getElementById('generated-command').textContent = res.cmd;
    const warnEl = document.getElementById('builder-warnings');
    warnEl.innerHTML = res.warnings.map(w => `<div class="warning-item ${w.danger?'danger':''}">${w.msg}</div>`).join('');
    const expEl = document.getElementById('explanation-content');
    expEl.innerHTML = res.explanations.length ? `<ul>${res.explanations.map(e=>`<li>${e}</li>`).join('')}</ul>` : '<p class="muted">Select options to see flag explanations.</p>';
  }

  function renderHistory() {
    const list = document.getElementById('command-history'); if (!list) return;
    const items = StorageAPI.getHistory();
    list.innerHTML = items.length ? items.map(c => `<li><span>${escapeHtml(c)}</span><button class="btn btn-sm btn-ghost" data-cmd="${escapeAttr(c)}">Copy</button></li>`).join('') : '<li class="muted">No history yet. Copy a generated command to save it.</li>';
    list.querySelectorAll('button').forEach(b => b.addEventListener('click', () => StorageAPI.copyText(b.dataset.cmd)));
  }

  function resetBuilder() {
    state.scan = null; state.portPreset = 'default'; state.timing = 'T3';
    document.getElementById('target-type').value = 'single';
    document.getElementById('target-value').value = '192.168.1.10';
    document.getElementById('port-custom').value = '';
    ['opt-sv','opt-version-all','opt-o','opt-osscan-limit','opt-osscan-guess','opt-on','opt-ox','opt-og','opt-oa','opt-v','opt-vv','opt-reason','opt-sc','opt-script-help','opt-f'].forEach(id=>{ const el=document.getElementById(id); if(el) el.checked=false; });
    document.getElementById('opt-version-intensity').value = 7; document.getElementById('opt-version-intensity').disabled = true; document.getElementById('version-intensity-val').textContent='7';
    ['opt-output-name','opt-mtu','opt-decoy','opt-source-port'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
    document.getElementById('opt-script').value = '';
    syncCards(); update();
  }
  function clearBuilder() {
    resetBuilder();
    document.getElementById('target-value').value = '';
    state.timing = null; syncCards(); update();
  }

  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m])); }
  function escapeAttr(s){ return escapeHtml(s).replace(/"/g,'&quot;'); }

  window.CommandBuilder = { init, renderHistory, currentCommand };
})();