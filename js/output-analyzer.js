(function () {
  const samples = [
    {
      name: 'Web & DB host (mixed states, with versions)',
      summary: 'Typical server with web services open, DB port filtered by firewall, and service versions detected.',
      lines: [
        { t: 'Starting Nmap 7.94 ( https://nmap.org ) at 2026-11-13 10:00 (simulated)', type: 'meta', detail: 'Nmap prints version and start time. Useful for reporting and reproducibility.' },
        { t: 'Nmap scan report for web01.lab.local (192.168.1.10)', type: 'meta', key: 'host', detail: 'Target hostname and resolved IP address. Confirms what was actually scanned.' },
        { t: 'Host is up (0.0021s latency).', type: 'meta', key: 'up', detail: 'Host discovery found the target reachable. Latency is round-trip time (RTT) to the host.' },
        { t: 'Not shown: 996 closed tcp ports (reset)', type: 'meta', detail: 'Nmap summarizes uninteresting ports. "reset" means closed ports replied with TCP RST.' },
        { t: 'PORT     STATE    SERVICE  VERSION', type: 'meta', detail: 'Column headers: port/protocol, state, guessed service name, and detected version (from -sV).' },
        { t: '22/tcp   open     ssh      OpenSSH 8.9p1 Ubuntu 3ubuntu0.6', type: 'port', port: 22, proto: 'tcp', state: 'open', service: 'ssh', reason: 'syn-ack', detail: 'SSH is open. Version suggests Ubuntu OpenSSH package. Open = app is listening. Reason syn-ack means TCP handshake step 2 was received.' },
        { t: '80/tcp   open     http     nginx 1.22.1', type: 'port', port: 80, proto: 'tcp', state: 'open', service: 'http', reason: 'syn-ack', detail: 'HTTP web server is open. Service/version detection identified nginx 1.22.1 from protocol responses.' },
        { t: '443/tcp  open     https    nginx 1.22.1 (TLS 1.3)', type: 'port', port: 443, proto: 'tcp', state: 'open', service: 'https', reason: 'syn-ack', detail: 'HTTPS is open with TLS. Open web ports are common but should be reviewed for secure configuration.' },
        { t: '3306/tcp filtered mysql', type: 'port', port: 3306, proto: 'tcp', state: 'filtered', service: 'mysql', reason: 'no-response', detail: 'MySQL port is filtered: probes were dropped/blocked. Nmap cannot tell if MySQL is running behind a firewall.' },
        { t: 'MAC Address: 00:11:22:33:44:55 (Fictional Vendor)', type: 'meta', detail: 'On local networks, Nmap may show MAC address and vendor guess from ARP layer.' },
        { t: 'Device type: general purpose', type: 'meta', detail: 'OS detection hint category based on fingerprint behavior.' },
        { t: 'OS details: Linux 5.4 - 5.15 (simulated guess)', type: 'meta', key: 'os', detail: 'Probabilistic OS fingerprint match. Treat as estimate, not proof.' },
        { t: 'Network Distance: 1 hop', type: 'meta', detail: 'Estimated network hops to target (1 hop usually means same local segment).' },
        { t: 'Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel', type: 'meta', detail: 'Additional metadata inferred from services/OS; CPE is a standardized naming format.' },
        { t: 'Nmap done: 1 IP address (1 host up) scanned in 5.42 seconds (simulated)', type: 'meta', detail: 'Scan summary: hosts scanned/up and total elapsed time.' }
      ]
    },
    {
      name: 'Host discovery scan (-sn) results',
      summary: 'Ping/host discovery across a subnet: shows which hosts are up without port scanning.',
      lines: [
        { t: 'Starting Nmap 7.94 at 2026-11-13 10:05 (simulated)', type: 'meta', detail: 'Start of a host discovery run.' },
        { t: 'Nmap scan report for 192.168.1.1', type: 'meta', key: 'host', detail: 'First responsive host (often gateway/router).' },
        { t: 'Host is up (0.0012s latency).', type: 'meta', key: 'up', detail: 'Responded to discovery probes (e.g. ARP/ICMP/TCP depending on network/options).' },
        { t: 'MAC Address: AA:BB:CC:00:11:22 (Fictional Router Vendor)', type: 'meta', detail: 'Local LAN discovery often reveals MAC/vendor.' },
        { t: 'Nmap scan report for 192.168.1.10', type: 'meta', key: 'host', detail: 'Another live host found in the subnet.' },
        { t: 'Host is up (0.0021s latency).', type: 'meta', key: 'up', detail: 'Latency differences can reflect device/network path but are not precise distance measures.' },
        { t: 'Nmap scan report for 192.168.1.20', type: 'meta', key: 'host', detail: 'Third live host.' },
        { t: 'Host is up (0.0038s latency).', type: 'meta', key: 'up', detail: 'Host responded; no ports scanned with -sn.' },
        { t: 'Nmap done: 256 IP addresses (3 hosts up) scanned in 2.10 seconds (simulated)', type: 'meta', detail: 'Summary shows subnet size scanned and how many hosts responded as up.' }
      ]
    },
    {
      name: 'TCP SYN scan with --reason (-sS --reason)',
      summary: 'Shows port states and the exact reason Nmap chose each state (syn-ack, reset, no-response).',
      lines: [
        { t: 'Nmap scan report for 192.168.1.10', type: 'meta', key: 'host', detail: 'Target host.' },
        { t: 'Host is up, received arp-response (0.0019s latency).', type: 'meta', key: 'up', detail: 'Host considered up because of ARP response on local network.' },
        { t: 'PORT     STATE    SERVICE REASON', type: 'meta', detail: 'With --reason, Nmap adds why it assigned each state.' },
        { t: '22/tcp   open     ssh     syn-ack ttl 64', type: 'port', port: 22, proto: 'tcp', state: 'open', service: 'ssh', reason: 'syn-ack', detail: 'Received SYN/ACK in response to SYN probe: port is accepting connections (open).' },
        { t: '25/tcp   closed   smtp    reset ttl 64', type: 'port', port: 25, proto: 'tcp', state: 'closed', service: 'smtp', reason: 'reset', detail: 'Received RST: host reachable but no service listening on port 25 (closed).' },
        { t: '80/tcp   open     http    syn-ack ttl 64', type: 'port', port: 80, proto: 'tcp', state: 'open', service: 'http', reason: 'syn-ack', detail: 'Web service responded positively to handshake initiation.' },
        { t: '443/tcp  open     https   syn-ack ttl 64', type: 'port', port: 443, proto: 'tcp', state: 'open', service: 'https', reason: 'syn-ack', detail: 'HTTPS service open.' },
        { t: '3306/tcp filtered mysql   no-response', type: 'port', port: 3306, proto: 'tcp', state: 'filtered', service: 'mysql', reason: 'no-response', detail: 'No reply received; packets likely dropped by firewall/filter.' },
        { t: '8080/tcp filtered http-proxy no-response', type: 'port', port: 8080, proto: 'tcp', state: 'filtered', service: 'http-proxy', reason: 'no-response', detail: 'Filtered state indicates uncertainty caused by lack of response.' }
      ]
    },
    {
      name: 'UDP scan (open, closed, open|filtered)',
      summary: 'UDP results are often less certain than TCP because many services do not reply.',
      lines: [
        { t: 'Nmap scan report for 192.168.1.40', type: 'meta', key: 'host', detail: 'UDP scan target (e.g. DNS server).' },
        { t: 'Host is up (0.0040s latency).', type: 'meta', key: 'up', detail: 'Host reachable.' },
        { t: 'PORT    STATE         SERVICE  REASON', type: 'meta', detail: 'UDP states include open, closed, and open|filtered.' },
        { t: '53/udp  open          domain   udp-response', type: 'port', port: 53, proto: 'udp', state: 'open', service: 'domain', reason: 'udp-response', detail: 'Received a UDP response, indicating a DNS service is listening and responding.' },
        { t: '67/udp  open|filtered dhcps    no-response', type: 'port', port: 67, proto: 'udp', state: 'open|filtered', service: 'dhcps', reason: 'no-response', detail: 'No response: could be open (ignored probe) or filtered by firewall. UDP ambiguity is common.' },
        { t: '123/udp open          ntp      udp-response', type: 'port', port: 123, proto: 'udp', state: 'open', service: 'ntp', reason: 'udp-response', detail: 'NTP service responded to probe.' },
        { t: '161/udp closed        snmp     port-unreach', type: 'port', port: 161, proto: 'udp', state: 'closed', service: 'snmp', reason: 'port-unreach', detail: 'ICMP Port Unreachable indicates no UDP service listening (closed).' },
        { t: '500/udp open|filtered isakmp   no-response', type: 'port', port: 500, proto: 'udp', state: 'open|filtered', service: 'isakmp', reason: 'no-response', detail: 'Ambiguous: may require service-specific probes or different vantage in authorized testing.' }
      ]
    },
    {
      name: 'Service & version detection (-sV)',
      summary: 'Focuses on identifying what software and version is running on open ports.',
      lines: [
        { t: 'Nmap scan report for 192.168.1.10', type: 'meta', key: 'host', detail: 'Target host for version detection.' },
        { t: 'Host is up (0.0020s latency).', type: 'meta', key: 'up', detail: 'Host reachable.' },
        { t: 'PORT    STATE SERVICE  VERSION', type: 'meta', detail: '-sV adds VERSION column with best-effort product info.' },
        { t: '21/tcp  open  ftp      vsftpd 3.0.5', type: 'port', port: 21, proto: 'tcp', state: 'open', service: 'ftp', detail: 'FTP service identified as vsftpd 3.0.5. Version strings help with inventory and patch checks.' },
        { t: '22/tcp  open  ssh      OpenSSH 8.9p1 Ubuntu 3ubuntu0.6 (Ubuntu Linux; protocol 2.0)', type: 'port', port: 22, proto: 'tcp', state: 'open', service: 'ssh', detail: 'Detailed banner/protocol info extracted by service probes.' },
        { t: '80/tcp  open  http     Apache httpd 2.4.52 ((Ubuntu))', type: 'port', port: 80, proto: 'tcp', state: 'open', service: 'http', detail: 'HTTP server identified; headers/responses can reveal software details.' },
        { t: '443/tcp open  ssl/http Apache httpd 2.4.52', type: 'port', port: 443, proto: 'tcp', state: 'open', service: 'https', detail: 'TLS service also fingerprinted as Apache httpd.' },
        { t: 'Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel', type: 'meta', detail: 'Aggregated service information and platform hints.' }
      ]
    },
    {
      name: 'OS detection sample (-O)',
      summary: 'Shows a typical OS fingerprinting output with confidence/guess language.',
      lines: [
        { t: 'Nmap scan report for 192.168.1.10', type: 'meta', key: 'host', detail: 'Target host.' },
        { t: 'Host is up (0.0023s latency).', type: 'meta', key: 'up', detail: 'Host reachable.' },
        { t: 'PORT   STATE SERVICE', type: 'meta', detail: 'OS detection often runs alongside port scan results.' },
        { t: '22/tcp open  ssh', type: 'port', port: 22, proto: 'tcp', state: 'open', service: 'ssh', detail: 'An open port provides useful fingerprint data.' },
        { t: '80/tcp open  http', type: 'port', port: 80, proto: 'tcp', state: 'open', service: 'http', detail: 'Multiple open ports can improve OS guessing.' },
        { t: '999/tcp closed abyss', type: 'port', port: 999, proto: 'tcp', state: 'closed', service: 'abyss', detail: 'A closed port also helps fingerprinting (responses differ by OS/stack).' },
        { t: 'Device type: general purpose', type: 'meta', detail: 'High-level device category.' },
        { t: 'Running: Linux 5.X', type: 'meta', key: 'os', detail: 'OS family/version range guess.' },
        { t: 'OS CPE: cpe:/o:linux:linux_kernel:5', type: 'meta', key: 'os', detail: 'CPE identifier for guessed OS.' },
        { t: 'OS details: Linux 5.4 - 5.15 (95%)', type: 'meta', key: 'os', detail: 'Confidence percentage is an estimate; do not treat as certainty.' },
        { t: 'Network Distance: 1 hop', type: 'meta', detail: 'Distance estimate.' }
      ]
    },
    {
      name: 'Filtered firewall-heavy host',
      summary: 'Demonstrates how heavy filtering looks: host up but most probes blocked.',
      lines: [
        { t: 'Nmap scan report for 192.168.1.50', type: 'meta', key: 'host', detail: 'Protected host behind firewall/filtering.' },
        { t: 'Host is up (0.015s latency).', type: 'meta', key: 'up', detail: 'Host responds enough to confirm it is online.' },
        { t: 'All 1000 scanned ports on 192.168.1.50 are in ignored states.', type: 'meta', detail: 'Nmap summarizes when all ports are filtered/ignored.' },
        { t: 'Not shown: 1000 filtered tcp ports (no-response)', type: 'meta', detail: 'No responses received; typical of strict firewall rules dropping probes.' },
        { t: 'PORT    STATE    SERVICE REASON', type: 'meta', detail: 'If shown with --reason, reasons would indicate no-response/admin-prohibited etc.' },
        { t: '443/tcp open     https   syn-ack', type: 'port', port: 443, proto: 'tcp', state: 'open', service: 'https', reason: 'syn-ack', detail: 'Only an allowed service port responds; others remain filtered.' },
        { t: 'Too many fingerprints match this host to give specific OS details', type: 'meta', key: 'os', detail: 'Filtering can limit OS fingerprint accuracy because Nmap lacks varied responses.' }
      ]
    }
  ];

  const popularScans = [
    { name: 'Quick host discovery (find live devices)', cmd: 'nmap -sn 192.168.1.0/24', purpose: 'Find which devices are online in a subnet. Fast and easy starting point.', expect: 'List of hosts that are up (no port details).' },
    { name: 'Fast common port scan', cmd: 'nmap -F 192.168.1.10', purpose: 'Scan top 100 common ports quickly.', expect: 'A short list of open/closed/filtered common ports.' },
    { name: 'Standard TCP scan (common ports)', cmd: 'nmap 192.168.1.10', purpose: 'Default scan for a single host.', expect: 'Host status and common open TCP ports.' },
    { name: 'Service & version detection', cmd: 'nmap -sV 192.168.1.10', purpose: 'Identify software and versions on open ports.', expect: 'SERVICE and VERSION columns populated for open ports.' },
    { name: 'Default scripts + versions', cmd: 'nmap -sV -sC 192.168.1.10', purpose: 'Get versions plus safe default script info.', expect: 'Service versions and extra script output (e.g. titles, headers).' },
    { name: 'Top ports with reasons', cmd: 'nmap --top-ports 100 --reason 192.168.1.10', purpose: 'Quick scan that explains why ports are open/closed/filtered.', expect: 'Port states with reasons like syn-ack, reset, no-response.' },
    { name: 'Web server focused scan', cmd: 'nmap -p 80,443,8080,8443 -sV 192.168.1.10', purpose: 'Check common web ports and identify web services.', expect: 'States and versions for web-related ports.' },
    { name: 'Full TCP port sweep (authorized)', cmd: 'nmap -p- 192.168.1.10', purpose: 'Scan all TCP ports for thorough coverage.', expect: 'All open TCP ports found (can take longer).' },
    { name: 'UDP top ports (focused)', cmd: 'nmap -sU --top-ports 20 192.168.1.10', purpose: 'Check common UDP services.', expect: 'UDP states (open/closed/open|filtered), may take time.' },
    { name: 'OS detection (authorized)', cmd: 'nmap -O 192.168.1.10', purpose: 'Estimate the target operating system.', expect: 'OS guesses with confidence; best-effort fingerprinting.' },
    { name: 'Comprehensive audit profile', cmd: 'nmap -sS -sV -O --reason -oA scan_results 192.168.1.10', purpose: 'Detailed, saved scan for authorized audits.', expect: 'Rich output and saved .nmap/.xml/.gnmap files.' },
    { name: 'Show only open ports', cmd: 'nmap --open 192.168.1.10', purpose: 'Hide closed/filtered noise.', expect: 'Only open (or possibly open) ports displayed.' }
  ];

  function render() {
    const sel = document.getElementById('output-sample-select');
    const view = document.getElementById('output-view');
    const detail = document.getElementById('output-detail-content');
    const popularSel = document.getElementById('popular-scan-select');
    const popularDesc = document.getElementById('popular-scan-desc');
    const popularTarget = document.getElementById('popular-scan-target');
    const copyPopular = document.getElementById('copy-popular-scan');
    if (!sel || !view) return;

    sel.innerHTML = samples.map((s,i)=>`<option value="${i}">${s.name}</option>`).join('');
    if (popularSel) popularSel.innerHTML = popularScans.map((p,i)=>`<option value="${i}">${p.name}</option>`).join('');

    function setDetail(html) { if (detail) detail.innerHTML = html; }

    function personalizePopular(cmd) {
      const v = (popularTarget && popularTarget.value.trim()) ? popularTarget.value.trim() : '192.168.1.10';
      const isCidr = v.includes('/');
      const ipv4 = /^\d{1,3}(?:\.\d{1,3}){3}$/;
      const host = isCidr ? v.split('/')[0] : v;
      const subnet = isCidr ? v : (ipv4.test(v) ? v.replace(/\.\d+$/, '.0/24') : '192.168.1.0/24');
      return cmd.replace(/192\.168\.1\.0\/24/g, subnet).replace(/192\.168\.1\.10/g, host);
    }

    function updatePopular() {
      if (!popularSel || !popularDesc) return;
      const p = popularScans[+popularSel.value || 0];
      if (!p) return;
      const cmd = personalizePopular(p.cmd);
      popularDesc.innerHTML = `<strong>Command:</strong> <code>${escapeHtml(cmd)}</code><br><strong>Purpose:</strong> ${escapeHtml(p.purpose)}<br><strong>What to expect:</strong> ${escapeHtml(p.expect)}<br><span class="muted">Set your own authorized IP/domain/CIDR above. Use only on systems you own or have explicit permission to assess.</span>`;
    }

    function serviceInfo(service) {
      const s = (service || '').toLowerCase();
      const map = {
        ssh: { name: 'SSH (Secure Shell)', about: 'Remote administration/login protocol, typically on TCP 22. Encrypted command-line access and file transfer (SCP/SFTP).', checks: 'Confirm authorized access only, strong authentication (keys/MFA), disable root/password login if not needed, and keep server updated.' },
        http: { name: 'HTTP (Web Service)', about: 'Unencrypted web traffic, commonly TCP 80. Serves websites/APIs; content and configuration determine exposure.', checks: 'Review exposed pages/apps, redirects to HTTPS, server headers/config, and authentication on sensitive paths (authorized testing only).' },
        https: { name: 'HTTPS (TLS-secured Web)', about: 'Encrypted web traffic, commonly TCP 443. Security depends on certificate/TLS config and the application behind it.', checks: 'Check certificate validity, TLS configuration, and application security posture in authorized assessments.' },
        mysql: { name: 'MySQL Database', about: 'Relational database service, commonly TCP 3306. Should usually not be publicly exposed.', checks: 'Restrict network access, enforce strong credentials/least privilege, and patch regularly (authorized environments).' },
        domain: { name: 'DNS', about: 'Domain Name System service (often UDP/TCP 53). Resolves names to IPs and can reveal infrastructure details.', checks: 'Review recursion/zone transfer settings and exposure; validate only in authorized scope.' },
        ntp: { name: 'NTP (Network Time Protocol)', about: 'Time synchronization service, commonly UDP 123. Misconfiguration can enable abuse or information leakage.', checks: 'Limit exposure, use trusted sources, and apply secure configuration.' },
        snmp: { name: 'SNMP', about: 'Network management protocol, commonly UDP 161. Can expose sensitive device information if misconfigured.', checks: 'Use secure versions (e.g. SNMPv3), restrict access, and avoid default/community strings.' },
        ftp: { name: 'FTP', about: 'File Transfer Protocol, commonly TCP 21. Traditional FTP can transmit credentials/data insecurely.', checks: 'Prefer secure alternatives (SFTP/FTPS), restrict access, and harden configuration.' },
        smtp: { name: 'SMTP', about: 'Mail transfer protocol, commonly TCP 25 (and others for submission). Can reveal mail infrastructure details.', checks: 'Review relay/auth/TLS settings and exposure as part of authorized mail security checks.' },
        dhcps: { name: 'DHCP Server', about: 'Dynamic host configuration service (UDP 67/68 context). Assigns IP/network settings to clients.', checks: 'Ensure only authorized DHCP servers operate on the network; monitor for rogue services.' },
        'http-proxy': { name: 'HTTP Proxy', about: 'Proxy service for web traffic. Can affect traffic control, visibility, and access policies.', checks: 'Verify authentication, access controls, and logging in authorized environments.' },
        isakmp: { name: 'ISAKMP/IKE (VPN-related)', about: 'Key exchange service often associated with VPNs (commonly UDP 500). Exposure may indicate VPN endpoint presence.', checks: 'Confirm it is intended, hardened, and monitored; assess configuration only with authorization.' },
        ssl: { name: 'TLS/SSL Service', about: 'Encrypted service endpoint. Actual application behind TLS determines risk and function.', checks: 'Identify underlying service, certificate/TLS settings, and app security in authorized scope.' }
      };
      return map[s] || { name: service ? `Service: ${service}` : 'Service not identified', about: 'Nmap could not confidently identify a known service name from this line, or it is a generic/unknown service.', checks: 'Use authorized service/version detection, banner review, and asset documentation to identify and validate the service.' };
    }

    function versionInfo(lineText) {
      const t = (lineText || '');
      const versionLike = /\b\d+(?:\.\d+){1,3}(?:[^\s]*)?\b/.test(t) || /(OpenSSH|nginx|Apache|vsftpd|Ubuntu|TLS|httpd)/i.test(t);
      if (!versionLike) return '';
      return `<div class="detail-block"><h4>Version / banner information</h4>
        <ul class="breakdown">
          <li><strong>What it is:</strong> Version/banner data is Nmap's best-effort identification from service responses (e.g. <code>-sV</code>).</li>
          <li><strong>Why it matters:</strong> Helps inventory software, confirm expected deployments, and prioritize authorized patch/upgrade reviews.</li>
          <li><strong>Accuracy note:</strong> Banners can be incomplete, customized, or misleading; verify with authorized methods and asset owners.</li>
        </ul>
      </div>`;
    }

    function exposureNotes(line) {
      const state = line.state || '';
      const svc = (line.service || '').toLowerCase();
      const sensitive = ['ssh','ftp','mysql','snmp','smtp','domain','isakmp','http-proxy'].includes(svc) || [21,22,23,25,53,161,3306,3389,5432,6379,8080].includes(line.port);
      if (state === 'open') {
        return `<div class="detail-block"><h4>Exposure / risk notes (educational)</h4>
          <ul class="breakdown">
            <li><strong>Open port:</strong> A reachable service increases attack surface if unnecessary, misconfigured, outdated, or weakly protected.</li>
            ${sensitive ? '<li><strong>Sensitive/common target service:</strong> This service/port is often high-value for attackers if exposed. Limit access and harden it.</li>' : '<li><strong>Review need:</strong> Confirm the service is required, intentionally exposed, and monitored.</li>'}
            <li><strong>If something looks vulnerable:</strong> do <strong>not</strong> exploit it. Perform authorized validation, check vendor advisories/patches, and remediate.</li>
          </ul>
        </div>`;
      }
      if (state === 'filtered' || state === 'open|filtered') {
        return `<div class="detail-block"><h4>Filtering / visibility notes</h4>
          <ul class="breakdown">
            <li><strong>Blocked or ambiguous:</strong> Filtering can protect services, but it also limits visibility from this vantage point.</li>
            <li><strong>Authorized follow-up:</strong> Validate from approved network positions, review firewall rules, and confirm intended exposure.</li>
          </ul>
        </div>`;
      }
      if (state === 'closed') {
        return `<div class="detail-block"><h4>Exposure notes</h4>
          <ul class="breakdown">
            <li><strong>Closed port:</strong> No service is listening here now, which usually means no direct service exposure on this port.</li>
            <li><strong>Still useful:</strong> Confirms host reachability and helps with asset/network behavior understanding.</li>
          </ul>
        </div>`;
      }
      return '';
    }

    function defensiveProcessBlock(line) {
      const state = line.state || '';
      if (state !== 'open' && !/vuln|exploit|weak|default|outdated|exposed|misconfig/i.test((line.detail||'') + ' ' + (line.t||''))) return '';
      return `<div class="detail-block"><h4>Authorized security assessment process (defensive)</h4>
        <ul class="breakdown">
          <li><strong>1. Verify scope & authorization:</strong> ensure the target and tests are explicitly approved.</li>
          <li><strong>2. Identify & confirm:</strong> validate the service/version/configuration using safe, authorized checks and asset ownership records.</li>
          <li><strong>3. Assess exposure safely:</strong> review access controls, encryption, authentication, patch level, and known advisories in a controlled/approved manner.</li>
          <li><strong>4. Document evidence:</strong> record host, port, state, reason, and observed service/version details.</li>
          <li><strong>5. Remediate & monitor:</strong> patch/update, restrict network access, harden configs, rotate credentials, and monitor logs/alerts.</li>
        </ul>
      </div>`;
    }

    function draw() {
      const sample = samples[+sel.value];
      view.innerHTML = sample.lines.map((l, idx) => {
        let cls = 'out-line';
        if (l.type === 'port') cls += ' out-port ' + (l.state || '').replace('|','-');
        return `<span class="${cls}" data-idx="${idx}">${escapeHtml(l.t)}</span>`;
      }).join('\n');

      function scenarioOverview(s) {
        const ports = s.lines.filter(l => l.type === 'port');
        const counts = ports.reduce((a,p)=>{ a[p.state]=(a[p.state]||0)+1; return a; }, {});
        const countStr = Object.keys(counts).length ? Object.entries(counts).map(([k,v])=>`${v} ${k}`).join(', ') : 'no port lines in this sample';
        return `<div class="detail-block"><h4>Scenario overview</h4>
          ${s.summary ? `<p class="muted">${escapeHtml(s.summary)}</p>` : ''}
          <div class="kv"><div class="k">Port states found</div><div>${escapeHtml(countStr)}</div>
          <div class="k">How to use</div><div>Click a specific line to see details for that exact result (state, service, version, reason, and security context).</div></div>
        </div>`;
      }

      view.querySelectorAll('.out-line').forEach(el => {
        el.addEventListener('click', () => {
          view.querySelectorAll('.out-line').forEach(x=>x.classList.remove('active'));
          el.classList.add('active');
          const line = sample.lines[+el.dataset.idx];
          if (line.type === 'port') {
            const svc = serviceInfo(line.service);
            const state = line.state || 'unknown';
            setDetail(`<h4>Selected result: ${line.port}/${line.proto} <span class="pill ${state}">${escapeHtml(state)}</span></h4>
              <div class="detail-block"><h4>What this exact line means</h4><p class="muted">${escapeHtml(line.detail || 'This line reports a scanned port result.')}</p><pre>${escapeHtml(line.t)}</pre></div>
              <div class="detail-block"><h4>State details: ${escapeHtml(state)}</h4><p class="muted">${escapeHtml(stateExplain(state))}</p></div>
              <div class="detail-block"><h4>Service details: ${escapeHtml(svc.name)}</h4>
                <p class="muted">${escapeHtml(svc.about)}</p>
                <ul class="breakdown"><li><strong>Authorized checks / hardening:</strong> ${escapeHtml(svc.checks)}</li></ul>
              </div>
              ${versionInfo(line.t)}
              ${line.reason ? `<div class="detail-block"><h4>Reason details</h4><p class="muted"><strong>${escapeHtml(line.reason)}</strong> indicates why Nmap assigned the <strong>${escapeHtml(state)}</strong> state for this probe/response.</p></div>` : ''}
              ${exposureNotes(line)}
              ${defensiveProcessBlock(line)}`);
          } else if (line.key === 'up') {
            setDetail(`<h4>Selected result: Host status</h4>
              <div class="detail-block"><h4>What this line means</h4><p class="muted">${escapeHtml(line.detail || 'Host is reachable.')}</p><pre>${escapeHtml(line.t)}</pre></div>
              <div class="detail-block"><h4>Details explained</h4><ul class="breakdown"><li><strong>Host is up:</strong> target responded to discovery probes.</li><li><strong>Latency:</strong> responsiveness/time-to-respond indicator.</li><li><strong>Reason (if present):</strong> probe/response type that proved reachability (e.g. arp-response, echo-reply).</li></ul></div>
              <div class="detail-block"><h4>Why this matters</h4><p class="muted">Confirms the target is reachable before interpreting port/service results. If a host is not up, port states may be incomplete or absent.</p></div>`);
          } else if (line.key === 'os') {
            setDetail(`<h4>Selected result: OS detection</h4>
              <div class="detail-block"><h4>What this line means</h4><p class="muted">${escapeHtml(line.detail || 'OS fingerprinting is probabilistic.')}</p><pre>${escapeHtml(line.t)}</pre></div>
              <div class="detail-block"><h4>OS/version fingerprint details</h4><ul class="breakdown"><li><strong>Probabilistic:</strong> OS results are guesses based on network stack behavior.</li><li><strong>Confidence/accuracy:</strong> can be affected by filtering, virtualization, and limited open/closed ports.</li><li><strong>Authorized use:</strong> useful for inventory and validation, not definitive identification.</li></ul></div>`);
          } else if (line.key === 'host') {
            setDetail(`<h4>Selected result: Target / host report</h4>
              <div class="detail-block"><h4>What this line means</h4><p class="muted">${escapeHtml(line.detail || 'Identifies the scanned target.')}</p><pre>${escapeHtml(line.t)}</pre></div>
              <div class="detail-block"><h4>Details explained</h4><ul class="breakdown"><li><strong>Hostname/IP:</strong> identifies which system the following results belong to.</li><li><strong>Scope check:</strong> verify this is an authorized/intended target before taking action on findings.</li></ul></div>`);
          } else {
            setDetail(`<h4>Selected output line details</h4>
              <div class="detail-block"><h4>What this line means</h4><p class="muted">${escapeHtml(line.detail || 'Informational Nmap output line.')}</p><pre>${escapeHtml(line.t)}</pre></div>
              <div class="detail-block"><h4>How to interpret it</h4><ul class="breakdown"><li>Read this line in context of host status, port states, service/version, and reasons.</li><li>Use summaries like "Not shown..." to understand scan coverage and omitted ports.</li><li>Treat findings as inputs for authorized review, hardening, and documentation.</li></ul></div>
              ${/version|service|cpe/i.test(line.t || '') ? versionInfo(line.t) : ''}`);
          }
        });
      });

      setDetail(`${scenarioOverview(sample)}<div class="detail-block"><p class="muted">Click a specific line in the simulated output to see <strong>details for that line only</strong> (state, service, version, reason, and security notes when relevant).</p></div>`);
    }

    sel.addEventListener('change', draw);
    if (popularSel) popularSel.addEventListener('change', updatePopular);
    if (popularTarget) popularTarget.addEventListener('input', updatePopular);
    if (copyPopular) copyPopular.addEventListener('click', () => {
      const p = popularScans[+popularSel.value || 0];
      if (p) StorageAPI.copyText(personalizePopular(p.cmd));
    });

    updatePopular();
    draw();
  }

  function stateExplain(state) {
    if (state === 'open') return 'Open: an application/service is listening and accepting connections or packets on this port. This is reachable and active.';
    if (state === 'closed') return 'Closed: the host is reachable, but no application is listening on this port. A response (often TCP RST or ICMP port unreachable for UDP) was received.';
    if (state === 'filtered') return 'Filtered: Nmap cannot determine whether the port is open because probes are blocked/dropped by a firewall, filter, or network device (no useful response).';
    if (state === 'open|filtered') return 'Open|filtered: Nmap cannot tell if the port is open or filtered because no response was received. This is common in UDP, FIN/NULL/Xmas scans.';
    if (state === 'closed|filtered') return 'Closed|filtered: Nmap cannot determine whether the port is closed or filtered (seen in some scan types like IP ID idle in specific cases).';
    if (state === 'unfiltered') return 'Unfiltered: the port is reachable and not filtered, but Nmap cannot determine if it is open or closed (e.g. from ACK scan).';
    return 'Unknown: the state could not be confidently determined from the responses received.';
  }

  function portStateGuide(activeState) {
    const states = [
      { k: 'open', t: 'Open', d: 'A service is listening and responding. Expected in normal use, but should be reviewed for exposure, version, and necessity.', reasons: 'syn-ack, udp-response' },
      { k: 'closed', t: 'Closed', d: 'Reachable host, no service on that port. Not an open service, but confirms host/network path responsiveness.', reasons: 'reset (RST), conn-refused, port-unreach (UDP)' },
      { k: 'filtered', t: 'Filtered', d: 'Probes blocked or dropped by firewall/filter. Nmap cannot confirm open/closed; common for protected services.', reasons: 'no-response, admin-prohibited, host-unreach' },
      { k: 'open|filtered', t: 'Open|Filtered', d: 'Ambiguous: no response received, so it may be open or filtered. Often seen in UDP and some stealth scans.', reasons: 'no-response, udp-response (rare cases vary)' },
      { k: 'unfiltered', t: 'Unfiltered', d: 'Port is accessible (not filtered) but openness is unknown. Typical in ACK scans used for firewall mapping.', reasons: 'reset (RST)' },
      { k: 'unknown', t: 'Unknown/Other', d: 'Nmap could not determine the state confidently from available responses or scan conditions.', reasons: 'varies' }
    ];
    return `<div class="detail-block"><h4>Port states explained (all)</h4>
      <div class="state-guide">${states.map(s => `<div class="state-row ${activeState===s.k?'active':''}"><span class="pill ${s.k==='unknown'?'unknown':s.k}">${s.t}</span><div><div>${s.d}</div><div class="muted small"><strong>Common reasons:</strong> ${escapeHtml(s.reasons)}</div></div></div>`).join('')}</div>
      <p class="muted small" style="margin-top:0.5rem;">Interpretation tip: combine <strong>state + reason + service/version</strong> for accurate analysis. States can vary by scan type, firewall rules, and network path.</p>
    </div>`;
  }
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m])); }

  window.OutputAnalyzer = { render };
})();