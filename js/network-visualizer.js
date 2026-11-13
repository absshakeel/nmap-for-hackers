(function () {
  const discoveryDevices = [
    { id: 'attacker', label: 'Attacker', sub: 'Analyst Workstation', x: 60, y: 180, type: 'host', props: { IP: '192.168.1.50', Role: 'Authorized analyst', Ports: 'N/A', Note: 'Initiates scans in authorized labs' } },
    { id: 'router', label: 'Router', sub: '192.168.1.1', x: 200, y: 180, type: 'router', props: { IP: '192.168.1.1', Open: '22/tcp (ssh), 80/tcp (http)', Closed: '23/tcp', Filtered: '161/udp', State: 'Up' } },
    { id: 'firewall', label: 'Firewall', sub: '192.168.1.5', x: 330, y: 100, type: 'firewall', props: { IP: '192.168.1.5', Open: '443/tcp (https-mgmt)', Closed: 'None observed', Filtered: '22/tcp, 3389/tcp', State: 'Up (simulated)' } },
    { id: 'server', label: 'Target Server', sub: '192.168.1.10', x: 360, y: 220, type: 'server', props: { IP: '192.168.1.10', Open: '22/tcp, 80/tcp, 443/tcp', Closed: '21/tcp', Filtered: '3306/tcp', State: 'Up' } },
    { id: 'client', label: 'Workstation', sub: '192.168.1.30', x: 470, y: 140, type: 'host', props: { IP: '192.168.1.30', Open: 'None', Closed: 'All scanned', Filtered: 'None', State: 'Up (simulated)' } }
  ];
  const discoveryLinks = [
    ['attacker','router'], ['router','firewall'], ['router','server'], ['firewall','client']
  ];

  const vizDevices = [
    { id: 'r1', label: 'Router', ip: '192.168.1.1', x: 260, y: 60, w: 120, h: 46, type: 'router', open: ['22/tcp ssh','80/tcp http'], filtered: [], closed: ['23/tcp'], services: ['SSH mgmt','HTTP admin (lab)'] },
    { id: 'web', label: 'Web Server', ip: '192.168.1.10', x: 60, y: 180, w: 140, h: 50, type: 'server', open: ['80/tcp http','443/tcp https'], filtered: ['22/tcp'], closed: [], services: ['nginx','TLS'] },
    { id: 'db', label: 'Database Server', ip: '192.168.1.20', x: 230, y: 220, w: 150, h: 50, type: 'server', open: ['5432/tcp postgresql'], filtered: ['3306/tcp mysql'], closed: ['21/tcp'], services: ['PostgreSQL (authorized lab)'] },
    { id: 'ws', label: 'Workstation', ip: '192.168.1.30', x: 420, y: 170, w: 140, h: 50, type: 'host', open: [], filtered: [], closed: ['All common scanned'], services: ['User endpoint'] },
    { id: 'dns', label: 'DNS Server', ip: '192.168.1.40', x: 430, y: 60, w: 130, h: 46, type: 'server', open: ['53/tcp domain','53/udp domain'], filtered: [], closed: [], services: ['DNS resolver'] }
  ];
  const vizLinks = [['r1','web'],['r1','db'],['r1','ws'],['r1','dns'],['web','db']];

  function svgEl(tag, attrs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  }

  function renderDiscovery() {
    const wrap = document.getElementById('discovery-svg-wrap');
    const panel = document.getElementById('discovery-device-panel');
    if (!wrap) return;
    wrap.innerHTML = '';
    const svg = svgEl('svg', { viewBox: '0 0 560 320', width: '100%', height: '360' });
    const bg = svgEl('rect', { x:0,y:0,width:560,height:320,fill:'#0b1324' }); svg.appendChild(bg);
    const gLinks = svgEl('g', { stroke:'#273449', 'stroke-width':2 });
    discoveryLinks.forEach(([a,b]) => {
      const da = discoveryDevices.find(d=>d.id===a), db = discoveryDevices.find(d=>d.id===b);
      const line = svgEl('line', { x1:da.x, y1:da.y, x2:db.x, y2:db.y, 'data-link': a+'-'+b });
      gLinks.appendChild(line);
    });
    svg.appendChild(gLinks);
    const packet = svgEl('circle', { cx:60, cy:180, r:5, class:'packet', opacity:'0' });
    packet.id = 'discovery-packet'; svg.appendChild(packet);

    discoveryDevices.forEach(d => {
      const g = svgEl('g', { class:'node', 'data-id': d.id, tabindex:'0', role:'button' });
      const ring = svgEl('circle', { cx:d.x, cy:d.y, r:26, class:'highlight-ring', id:'ring-'+d.id });
      g.appendChild(ring);
      let shape;
      if (d.type === 'router') {
        shape = svgEl('rect', { x:d.x-28, y:d.y-20, width:56, height:40, rx:8, fill:'#141d2f', stroke:'#60a5fa' });
      } else if (d.type === 'firewall') {
        shape = svgEl('rect', { x:d.x-32, y:d.y-22, width:64, height:44, rx:8, fill:'#141d2f', stroke:'#fbbf24' });
      } else if (d.type === 'server') {
        shape = svgEl('rect', { x:d.x-34, y:d.y-22, width:68, height:44, rx:8, fill:'#141d2f', stroke:'#2dd4bf' });
      } else {
        shape = svgEl('circle', { cx:d.x, cy:d.y, r:24, fill:'#141d2f', stroke:'#2dd4bf' });
      }
      g.appendChild(shape);
      const t = svgEl('text', { x:d.x, y:d.y+4, 'text-anchor':'middle', class:'label' }); t.textContent = d.label; g.appendChild(t);
      const t2 = svgEl('text', { x:d.x, y:d.y+34, 'text-anchor':'middle', class:'label sublabel' }); t2.textContent = d.sub; g.appendChild(t2);
      g.addEventListener('click', () => selectDiscovery(d.id));
      g.addEventListener('keydown', (e)=>{ if(e.key==='Enter'||e.key===' ') {e.preventDefault(); selectDiscovery(d.id);} });
      svg.appendChild(g);
    });
    wrap.appendChild(svg);

    function selectDiscovery(id) {
      const d = discoveryDevices.find(x=>x.id===id);
      if (!d || !panel) return;
      wrap.querySelectorAll('.highlight-ring').forEach(r=>r.classList.remove('active'));
      const ring = wrap.querySelector('#ring-'+id); if (ring) ring.classList.add('active');
      panel.innerHTML = `<h3>${d.label}</h3><p class="muted">${d.sub}</p>` +
        Object.entries(d.props).map(([k,v])=>`<div class="prop"><span>${k}</span><span>${v}</span></div>`).join('');
    }
    selectDiscovery('server');

    let animTimer = null;
    document.getElementById('discovery-play')?.addEventListener('click', () => {
      if (animTimer) clearInterval(animTimer);
      const seq = ['attacker','router','firewall','server','client'];
      let i = 0;
      packet.setAttribute('opacity','1');
      animTimer = setInterval(() => {
        const d = discoveryDevices.find(x=>x.id===seq[i]);
        packet.setAttribute('cx', d.x); packet.setAttribute('cy', d.y);
        selectDiscovery(d.id);
        i++;
        if (i >= seq.length) { clearInterval(animTimer); animTimer=null; setTimeout(()=>packet.setAttribute('opacity','0'), 400); }
      }, 900);
    });
    document.getElementById('discovery-reset')?.addEventListener('click', () => {
      if (animTimer) clearInterval(animTimer);
      packet.setAttribute('opacity','0'); selectDiscovery('server');
    });
  }

  function renderVisualizer() {
    const wrap = document.getElementById('viz-svg-wrap');
    const panel = document.getElementById('viz-device-panel');
    const filterSel = document.getElementById('viz-filter');
    if (!wrap) return;

    function deviceVisible(d) {
      const f = filterSel ? filterSel.value : 'all';
      if (f === 'all') return true;
      if (f === 'open') return d.open.length > 0;
      if (f === 'filtered') return d.filtered.length > 0;
      if (f === 'server') return d.type === 'server' || d.type === 'router';
      return true;
    }

    function draw() {
      wrap.innerHTML = '';
      const svg = svgEl('svg', { viewBox: '0 0 620 320', width: '100%', height: '360' });
      svg.appendChild(svgEl('rect', { x:0,y:0,width:620,height:320,fill:'#0b1324' }));
      const gLinks = svgEl('g', { stroke:'#273449', 'stroke-width':2 });
      vizLinks.forEach(([a,b]) => {
        const da = vizDevices.find(d=>d.id===a), db = vizDevices.find(d=>d.id===b);
        if (!deviceVisible(da) || !deviceVisible(db)) return;
        const ax = da.x + da.w/2, ay = da.y + da.h/2, bx = db.x + db.w/2, by = db.y + db.h/2;
        gLinks.appendChild(svgEl('line', { x1:ax, y1:ay, x2:bx, y2:by, class:'viz-link', 'data-link':a+'-'+b }));
      });
      svg.appendChild(gLinks);
      const packet = svgEl('circle', { cx:260, cy:80, r:6, class:'packet', opacity:'0', id:'viz-packet' });
      svg.appendChild(packet);

      vizDevices.forEach(d => {
        if (!deviceVisible(d)) return;
        const g = svgEl('g', { class:'node', 'data-id': d.id, tabindex:'0' });
        const stroke = d.open.length ? '#2dd4bf' : (d.filtered.length ? '#fbbf24' : '#94a3b8');
        const rect = svgEl('rect', { x:d.x, y:d.y, width:d.w, height:d.h, rx:10, fill:'#141d2f', stroke: stroke, 'stroke-width':2 });
        g.appendChild(rect);
        const t1 = svgEl('text', { x:d.x + d.w/2, y:d.y + 20, 'text-anchor':'middle', class:'label' }); t1.textContent = d.label; g.appendChild(t1);
        const t2 = svgEl('text', { x:d.x + d.w/2, y:d.y + 36, 'text-anchor':'middle', class:'label sublabel' }); t2.textContent = d.ip; g.appendChild(t2);
        g.addEventListener('click', ()=>selectViz(d.id));
        g.addEventListener('keydown',(e)=>{ if(e.key==='Enter'||e.key===' ') {e.preventDefault(); selectViz(d.id);} });
        svg.appendChild(g);
      });
      wrap.appendChild(svg);
    }

    function selectViz(id, statusText) {
      const d = vizDevices.find(x=>x.id===id); if (!d || !panel) return;
      wrap.querySelectorAll('.node').forEach(n => n.classList.toggle('node-active', n.getAttribute('data-id') === id));
      panel.innerHTML = `<h3>${d.label}</h3>
        <div class="prop"><span>IP Address</span><span>${d.ip}</span></div>
        <div class="prop"><span>Type</span><span>${d.type}</span></div>
        <div class="prop"><span>Open ports</span><span>${d.open.length?d.open.join(', '):'None (simulated)'}</span></div>
        <div class="prop"><span>Filtered</span><span>${d.filtered.length?d.filtered.join(', '):'None'}</span></div>
        <div class="prop"><span>Closed/notes</span><span>${d.closed.join(', ')||'N/A'}</span></div>
        <div class="prop"><span>Services</span><span>${d.services.join(', ')}</span></div>
        <div class="prop"><span>Connections</span><span>${vizLinks.filter(l=>l.includes(id)).map(l=>l.find(x=>x!==id)).map(x=>vizDevices.find(v=>v.id===x)?.label).join(', ')}</span></div>
        <p class="viz-status" id="viz-status">${statusText || 'Simulation only. Select a device or play discovery to inspect details.'}</p>`;
    }

    draw();
    selectViz('web', 'Ready. Click "Play Discovery Animation" to simulate host discovery across the network.');
    filterSel?.addEventListener('change', () => { draw(); selectViz('web', 'View updated. Select a device for details.'); });
    let anim = null;
    document.getElementById('viz-play')?.addEventListener('click', () => {
      if (anim) clearInterval(anim);
      const seq = ['r1','web','db','dns','ws'].filter(id => deviceVisible(vizDevices.find(x=>x.id===id)));
      let i = 0;
      const packet = wrap.querySelector('#viz-packet');
      if (!packet || seq.length === 0) return;
      packet.setAttribute('opacity','1');
      const step = () => {
        const d = vizDevices.find(x=>x.id===seq[i]);
        if (d) {
          packet.setAttribute('cx', d.x + d.w/2);
          packet.setAttribute('cy', d.y + d.h/2);
          selectViz(d.id, `Scanning ${d.label} (${d.ip})… simulated discovery step ${i+1} of ${seq.length}.`);
        }
        i++;
        if (i >= seq.length) {
          clearInterval(anim); anim = null;
          setTimeout(() => {
            packet.setAttribute('opacity','0');
            selectViz(seq[seq.length-1], 'Discovery simulation complete. Select a device to review ports and services.');
          }, 700);
        }
      };
      step();
      anim = setInterval(step, 1100);
    });
    document.getElementById('viz-reset')?.addEventListener('click', ()=>{ if(anim) clearInterval(anim); draw(); selectViz('web', 'Reset complete. Ready to simulate discovery.'); });
  }

  window.NetworkVisualizer = { renderDiscovery, renderVisualizer };
})();
