(function () {
  const commands = [
    { cat: 'Basic Scanning', cmd: 'nmap 127.0.0.1', exp: 'Scans localhost using default settings to identify common open TCP ports on your own machine.', flags: [['127.0.0.1','Target (localhost)']], out: 'Lists open ports and services detected on localhost.', when: 'Initial local verification in your own environment.', level: 'Beginner', remember: 'Default scan = quick baseline.', targetKind: 'host' },
    { cat: 'Basic Scanning', cmd: 'nmap -v 192.168.1.10', exp: 'Increases verbosity to show more progress and details during the scan.', flags: [['-v','Verbose output'], ['192.168.1.10','Target IP']], out: 'More detailed runtime information.', when: 'Learning what Nmap is doing during a scan.', level: 'Beginner', remember: 'v = verbose.', targetKind: 'host' },
    { cat: 'Basic Scanning', cmd: 'nmap -T4 -F 192.168.1.10', exp: 'Runs a faster scan against the top 100 ports.', flags: [['-T4','Aggressive timing template'], ['-F','Fast mode (top 100 ports)']], out: 'Quick view of common ports.', when: 'Rapid baseline in authorized labs.', level: 'Beginner', remember: 'F = fast, T4 = faster timing.', targetKind: 'host' },
    { cat: 'Host Discovery', cmd: 'nmap -sn 192.168.1.0/24', exp: 'Performs host discovery without port scanning to find live hosts on a subnet.', flags: [['-sn','Host discovery only, no port scan'], ['192.168.1.0/24','Target CIDR subnet']], out: 'List of hosts that responded as up.', when: 'Building an inventory of live systems.', level: 'Beginner', remember: 'sn = scan no ports.', targetKind: 'cidr' },
    { cat: 'Host Discovery', cmd: 'nmap -Pn 192.168.1.10', exp: 'Skips host discovery and treats the host as online, then proceeds to port scanning.', flags: [['-Pn','No ping / assume host is up'], ['192.168.1.10','Target IP']], out: 'Port scan results even if discovery probes are filtered.', when: 'When hosts drop discovery probes but may have open ports.', level: 'Intermediate', remember: 'Pn = pretend online.', targetKind: 'host' },
    { cat: 'Host Discovery', cmd: 'nmap -PS22,80 192.168.1.0/24', exp: 'TCP SYN ping discovery to selected ports to determine if hosts are up.', flags: [['-PS22,80','SYN ping to ports 22 and 80']], out: 'Hosts responding to SYN ping probes.', when: 'Host discovery through specific TCP ports.', level: 'Intermediate', remember: 'PS = ping with SYN.', targetKind: 'cidr', details: { what: 'Sends SYN packets to chosen ports. A SYN/ACK or RST response indicates the host is reachable/alive. Default discovery port is 80 if not specified.', example: 'nmap -PS22,80 192.168.1.0/24 -sn', result: 'Nmap scan report for 192.168.1.10\nHost is up (0.0020s latency).\nNmap done: 256 IP addresses (3 hosts up) scanned', steps: ['Choose target subnet and ports likely allowed by firewall.', 'Nmap sends SYN probes to those ports on each host.', 'Responses (SYN/ACK or RST) mark hosts as up.', 'With -sn, Nmap stops after discovery.'], mistakes: ['Assuming no response always means host is down (could be filtered).', 'Using host discovery on unauthorized networks.'] } },
    { cat: 'Host Discovery', cmd: 'nmap -PA80 192.168.1.0/24', exp: 'TCP ACK ping discovery to check host reachability.', flags: [['-PA80','ACK ping to port 80']], out: 'Hosts responding (often with RST) are marked up.', when: 'Alternative discovery when SYN probes are filtered.', level: 'Intermediate', remember: 'PA = ping with ACK.', targetKind: 'cidr', details: { what: 'Sends TCP ACK packets. Reachable hosts commonly reply with RST, indicating they are up. Useful in some firewall scenarios for discovery behavior analysis.', example: 'nmap -PA80 192.168.1.0/24 -sn', result: 'Host 192.168.1.20 is up (received rst)\nNmap done: 256 IP addresses (2 hosts up) scanned', steps: ['Send ACK probes to target port(s).', 'Observe RST or other responses.', 'Mark responding hosts as up.'], mistakes: ['Confusing ACK discovery with ACK port scan (-sA) purpose.', 'Interpreting no response as definitive proof host is offline.'] } },
    { cat: 'Host Discovery', cmd: 'nmap -PU53 192.168.1.0/24', exp: 'UDP ping discovery using UDP probes (commonly port 53).', flags: [['-PU53','UDP ping to port 53']], out: 'Hosts marked up based on UDP/ICMP responses.', when: 'Discovering hosts that respond to UDP probes.', level: 'Intermediate', remember: 'PU = ping with UDP.', targetKind: 'cidr', details: { what: 'Sends UDP packets to selected ports (default behavior varies; 53/DNS is common). A UDP response or ICMP port unreachable/error can indicate the host is alive. No reply may be ambiguous.', example: 'nmap -PU53 192.168.1.0/24 -sn', result: 'Host 192.168.1.40 is up (received udp response)\nHost 192.168.1.53 is up (received port-unreach)', steps: ['Send UDP probe to target port (e.g. 53).', 'If host/service replies or returns ICMP unreachable, host is likely up.', 'If silent, result may be inconclusive.'], mistakes: ['Expecting UDP ping to be as reliable as ARP on local LAN.', 'Ignoring firewall filtering that drops UDP probes.'] } },
    { cat: 'Host Discovery', cmd: 'nmap -PR 192.168.1.0/24', exp: 'ARP discovery on local networks to find live hosts quickly and reliably.', flags: [['-PR','ARP ping']], out: 'Live hosts with MAC/vendor info on LAN.', when: 'Local subnet discovery on the same network segment.', level: 'Beginner', remember: 'PR = ping with ARP (LAN).', targetKind: 'cidr', details: { what: 'ARP (Address Resolution Protocol) maps IP addresses to MAC addresses on a local network. Nmap asks "Who has this IP?" and devices on the LAN usually must respond, making ARP discovery fast and accurate locally.', example: 'nmap -PR 192.168.1.0/24 -sn', result: 'Nmap scan report for 192.168.1.1\nHost is up (0.00050s latency).\nMAC Address: AA:BB:CC:11:22:33 (Router Vendor)', steps: ['Send ARP requests for IPs in range.', 'Receive ARP replies from active devices.', 'Report hosts as up with MAC/vendor when available.'], mistakes: ['Trying to use ARP discovery across routed networks (it works on local segment).', 'Forgetting -sn when only discovery is needed.'] } },

    { cat: 'TCP Scanning', cmd: 'nmap -sS 192.168.1.10', exp: 'TCP SYN scan: sends SYN packets to evaluate port states efficiently.', flags: [['-sS','TCP SYN scan']], out: 'Open/closed/filtered TCP ports.', when: 'Common TCP port enumeration in authorized environments.', level: 'Intermediate', remember: 'S = SYN (half-open).', targetKind: 'host', details: { what: 'SYN scan starts the TCP handshake by sending SYN. If the target replies SYN/ACK, the port is open (service listening). If it replies RST, the port is closed. No response/filtering can indicate filtered. Nmap often does not complete the handshake, so it is called "half-open".', example: 'nmap -sS -p 22,80,443 192.168.1.10', result: 'PORT    STATE  SERVICE\n22/tcp  open   ssh\n80/tcp  open   http\n443/tcp closed https', steps: ['Send SYN to target port.', 'Receive SYN/ACK (open), RST (closed), or no response/filter (filtered).', 'Record state and optionally stop before full ACK (implementation behavior).'], mistakes: ['Assuming SYN scan always bypasses logging/monitoring.', 'Confusing filtered with closed.'] } },
    { cat: 'TCP Scanning', cmd: 'nmap -sT 192.168.1.10', exp: 'TCP connect scan: completes full TCP connections using the OS network stack.', flags: [['-sT','TCP connect scan']], out: 'TCP port states based on full connection attempts.', when: 'When SYN scan is unavailable or full connect behavior is desired.', level: 'Beginner', remember: 'T = TCP connect (full handshake).', targetKind: 'host', details: { what: 'Connect scan asks the operating system to establish a full TCP connection (SYN, SYN/ACK, ACK). If connection succeeds, port is open; if refused/reset, closed. This method is broadly compatible but can be easier to log.', example: 'nmap -sT -p 22,80 192.168.1.10', result: 'PORT   STATE SERVICE\n22/tcp open  ssh\n80/tcp open  http', steps: ['OS initiates TCP handshake to each target port.', 'Successful connect => open.', 'Connection refused/reset => closed.', 'Timeout/filter behavior may indicate filtered.'], mistakes: ['Thinking connect scans are always "safe" to run without permission.', 'Ignoring that full connections may be more visible to services/logs.'] } },
    { cat: 'TCP Scanning', cmd: 'nmap -sA 192.168.1.10', exp: 'TCP ACK scan maps firewall filtering behavior (filtered vs unfiltered), not open ports.', flags: [['-sA','TCP ACK scan']], out: 'Filtered/unfiltered classifications.', when: 'Firewall rule analysis in authorized audits.', level: 'Advanced', remember: 'A = ACK for analysis.', targetKind: 'host', details: { what: 'ACK scan sends TCP packets with the ACK flag set. It helps determine whether ports are filtered by a firewall. It does not tell you if an application is listening (open). Responses like RST can indicate unfiltered; no response may indicate filtered.', example: 'nmap -sA -p 22,80,443 192.168.1.10', result: 'PORT    STATE      SERVICE\n22/tcp  unfiltered ssh\n80/tcp  filtered   http\n443/tcp unfiltered https', steps: ['Send ACK probe to port.', 'If RST received, port is reachable/unfiltered (state known to network path).', 'If dropped/no response, port may be filtered.', 'Use results to understand firewall behavior, not service availability.'], mistakes: ['Expecting "open" results from -sA.', 'Using on unauthorized networks.'] } },
    { cat: 'TCP Scanning', cmd: 'nmap -sW 192.168.1.10', exp: 'TCP Window scan examines TCP window behavior to help distinguish port states in some environments.', flags: [['-sW','TCP Window scan']], out: 'Window-based state inferences (environment-dependent).', when: 'Advanced firewall/stack behavior analysis.', level: 'Advanced', remember: 'W = window field.', targetKind: 'host', details: { what: 'Window scan is similar to ACK scan but looks at the TCP window size in RST responses. On some systems, window values differ for open vs closed ports, allowing inference. Results depend on target stack behavior.', example: 'nmap -sW 192.168.1.10', result: 'PORT   STATE  SERVICE\n22/tcp open   ssh\n80/tcp closed http', steps: ['Send ACK-like probes.', 'Analyze RST responses and TCP window values.', 'Infer state where possible (not universally reliable).'], mistakes: ['Assuming it works the same on all operating systems.', 'Using it as a replacement for service checks.'] } },
    { cat: 'TCP Scanning', cmd: 'nmap -sM 192.168.1.10', exp: 'TCP Maimon scan sends FIN/ACK probes; behavior is system-dependent.', flags: [['-sM','TCP Maimon scan']], out: 'Open|filtered/closed results depending on stack.', when: 'Learning special TCP probe behavior in labs.', level: 'Advanced', remember: 'M = Maimon (FIN/ACK).', targetKind: 'host', details: { what: 'Maimon scan (named after Uriel Maimon) sends FIN/ACK packets. Some BSD-derived systems drop packets for open ports and send RST for closed ports, but many modern systems behave differently. Treat as an educational/advanced technique.', example: 'nmap -sM 192.168.1.10', result: 'PORT   STATE         SERVICE\n22/tcp open|filtered ssh\n80/tcp closed        http', steps: ['Send FIN/ACK probe.', 'Interpret response or lack thereof based on stack behavior.', 'Expect variability across targets.'], mistakes: ['Assuming consistent results across all OSes.', 'Running advanced scans without understanding scope/impact.'] } },

    { cat: 'UDP Scanning', cmd: 'nmap -sU 192.168.1.10', exp: 'Scans UDP ports to identify services that do not use TCP.', flags: [['-sU','UDP scan']], out: 'UDP ports reported as open, closed, or open|filtered.', when: 'Auditing DNS, SNMP, NTP, and other UDP services.', level: 'Intermediate', remember: 'U = UDP (no handshake).', targetKind: 'host', details: { what: 'UDP has no connection handshake. If a service replies, Nmap may mark open. If ICMP Port Unreachable is returned, closed. If there is no response, it may be open|filtered because silence is ambiguous (service ignored probe or firewall dropped it). UDP scans are often slower.', example: 'nmap -sU --top-ports 20 192.168.1.10', result: 'PORT    STATE         SERVICE\n53/udp  open          domain\n123/udp open|filtered ntp\n161/udp closed        snmp', steps: ['Send UDP probes to selected ports.', 'Classify based on UDP replies, ICMP errors, or timeouts.', 'Optionally use version detection/scripts to clarify open|filtered results.'], mistakes: ['Expecting UDP scans to be as fast/clear as TCP scans.', 'Scanning too many UDP ports without scoping.'] } },
    { cat: 'UDP Scanning', cmd: 'nmap -sU --top-ports 20 192.168.1.10', exp: 'Scans the most common UDP ports to reduce time while maintaining useful coverage.', flags: [['-sU','UDP scan'], ['--top-ports 20','Scan 20 most common ports']], out: 'States for top UDP ports.', when: 'Faster UDP assessment during authorized reviews.', level: 'Intermediate', remember: 'Limit UDP to top ports for speed.', targetKind: 'host' },

    { cat: 'Port Enumeration', cmd: 'nmap -p 22 192.168.1.10', exp: 'Scans a specific port.', flags: [['-p 22','Specify port 22']], out: 'State of port 22.', when: 'Checking a known service port.', level: 'Beginner', remember: 'p = pick port.', targetKind: 'host' },
    { cat: 'Port Enumeration', cmd: 'nmap -p 22,80,443 192.168.1.10', exp: 'Scans a comma-separated list of ports.', flags: [['-p 22,80,443','Specific ports']], out: 'States for SSH, HTTP, and HTTPS ports.', when: 'Targeted checks of common services.', level: 'Beginner', remember: 'Comma-separated port list.', targetKind: 'host' },
    { cat: 'Port Enumeration', cmd: 'nmap -p 1-1000 192.168.1.10', exp: 'Scans a range of ports from 1 through 1000.', flags: [['-p 1-1000','Port range']], out: 'Port states within the range.', when: 'Broader enumeration of common ports.', level: 'Beginner', remember: 'Dash means range.', targetKind: 'host' },
    { cat: 'Port Enumeration', cmd: 'nmap -p- 192.168.1.10', exp: 'Scans all 65535 TCP ports.', flags: [['-p-','All TCP ports']], out: 'Comprehensive TCP port inventory (takes longer).', when: 'Thorough authorized audits.', level: 'Intermediate', remember: 'p- = all ports.', targetKind: 'host' },
    { cat: 'Port Enumeration', cmd: 'nmap --top-ports 100 192.168.1.10', exp: 'Scans Nmap\'s top 100 most common ports.', flags: [['--top-ports 100','Top 100 ports']], out: 'States for common ports.', when: 'Quick baseline enumeration.', level: 'Beginner', remember: 'Top ports = most common.', targetKind: 'host' },
    { cat: 'Port Enumeration', cmd: 'nmap -F 192.168.1.10', exp: 'Fast scan mode that checks fewer ports (top 100).', flags: [['-F','Fast mode']], out: 'Quick results for common ports.', when: 'Fast initial assessment.', level: 'Beginner', remember: 'F = fast.', targetKind: 'host' },

    { cat: 'Service Detection', cmd: 'nmap -sV 192.168.1.10', exp: 'Probes open ports to determine service and version information.', flags: [['-sV','Service/version detection']], out: 'Service names and version strings where detectable.', when: 'Understanding what software is running on open ports.', level: 'Intermediate', remember: 'V = version.', targetKind: 'host' },
    { cat: 'Service Detection', cmd: 'nmap -sV --version-intensity 5 192.168.1.10', exp: 'Runs service detection with a moderate probe intensity.', flags: [['-sV','Service detection'], ['--version-intensity 5','Probe intensity (0-9)']], out: 'Version info with balanced thoroughness.', when: 'Tuning between speed and accuracy.', level: 'Intermediate', remember: 'Higher intensity = more probes.', targetKind: 'host' },
    { cat: 'OS Detection', cmd: 'nmap -O 192.168.1.10', exp: 'Attempts to identify the target operating system using TCP/IP stack fingerprinting.', flags: [['-O','OS detection']], out: 'Possible OS matches with confidence indicators.', when: 'Asset profiling in authorized assessments.', level: 'Intermediate', remember: 'O = OS guess.', targetKind: 'host' },
    { cat: 'OS Detection', cmd: 'nmap -O --osscan-guess 192.168.1.10', exp: 'Encourages Nmap to provide more aggressive OS guesses when confidence is low.', flags: [['-O','OS detection'], ['--osscan-guess','Aggressive guessing']], out: 'Best-effort OS guesses.', when: 'When fingerprinting results are inconclusive.', level: 'Advanced', remember: 'Guess more aggressively.', targetKind: 'host' },
    { cat: 'NSE Scripts', cmd: 'nmap -sC 192.168.1.10', exp: 'Runs default NSE scripts for common discovery and information gathering.', flags: [['-sC','Default script set']], out: 'Additional host/service details from default scripts.', when: 'Enriching scan results during authorized assessments.', level: 'Intermediate', remember: 'C = common scripts.', targetKind: 'host' },
    { cat: 'NSE Scripts', cmd: 'nmap --script safe 192.168.1.10', exp: 'Runs scripts categorized as safe and generally non-intrusive.', flags: [['--script safe','Safe script category']], out: 'Informational script output.', when: 'Low-impact information gathering.', level: 'Intermediate', remember: 'Safe category first.', targetKind: 'host' },
    { cat: 'NSE Scripts', cmd: 'nmap --script discovery 192.168.1.10', exp: 'Runs discovery scripts to gather more information about hosts and services.', flags: [['--script discovery','Discovery category']], out: 'Discovery-related findings.', when: 'Authorized network inventory and discovery.', level: 'Intermediate', remember: 'Discovery = learn more.', targetKind: 'host' },
    { cat: 'Output and Reporting', cmd: 'nmap -oN scan.txt 192.168.1.10', exp: 'Saves normal human-readable output to a file.', flags: [['-oN scan.txt','Normal output file']], out: 'Creates scan.txt with results.', when: 'Readable records of authorized scans.', level: 'Beginner', remember: 'oN = normal output.', targetKind: 'host' },
    { cat: 'Output and Reporting', cmd: 'nmap -oA scan_results 192.168.1.10', exp: 'Saves output in normal, XML, and grepable formats at once.', flags: [['-oA scan_results','All major formats']], out: 'Creates .nmap, .xml, and .gnmap files.', when: 'Comprehensive reporting.', level: 'Beginner', remember: 'oA = all formats.', targetKind: 'host' },
    { cat: 'Output and Reporting', cmd: 'nmap --reason 192.168.1.10', exp: 'Shows why Nmap assigned each port state (e.g. syn-ack, reset, no-response).', flags: [['--reason','Explain port states']], out: 'Port states with reasons.', when: 'Learning and interpreting results.', level: 'Beginner', remember: 'Reason explains the "why".', targetKind: 'host' },
    { cat: 'IPv6 Scanning', cmd: 'nmap -6 -sn 2001:db8::/64', exp: 'Performs host discovery against an IPv6 network (documentation prefix shown).', flags: [['-6','Enable IPv6'], ['-sn','Host discovery only']], out: 'Responsive IPv6 hosts.', when: 'IPv6 inventory in authorized networks.', level: 'Intermediate', remember: '6 = IPv6.', targetKind: 'cidr' },
    { cat: 'Network Auditing', cmd: 'nmap -sV -O --reason 192.168.1.10', exp: 'Combines service and OS detection with reasons for detailed host profiling.', flags: [['-sV','Service detection'], ['-O','OS detection'], ['--reason','Explain port states']], out: 'Detailed host, service, and state reasoning.', when: 'In-depth authorized security auditing.', level: 'Intermediate', remember: 'Details + reasons.', targetKind: 'host' },
    { cat: 'Network Auditing', cmd: 'nmap -A 192.168.1.10', exp: 'Aggressive scan: OS detection, version detection, default scripts, and traceroute. Use with permission.', flags: [['-A','Aggressive scan options']], out: 'Rich host and service information.', when: 'Comprehensive authorized assessments where intrusiveness is acceptable.', level: 'Advanced', remember: 'A = all-in-one (noisy).', targetKind: 'host' }
  ];

  function categories() {
    const set = new Set(commands.map(c => c.cat));
    return Array.from(set);
  }

  function escapeHtml(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m])); }
  function escapeAttr(s){ return escapeHtml(s).replace(/"/g,'&quot;'); }

  function getTarget() {
    const el = document.getElementById('ref-target') || document.getElementById('cheatsheet-target');
    const v = el ? el.value.trim() : '';
    return v || '192.168.1.10';
  }

  function personalizeCommand(cmd, kind) {
    const t = getTarget();
    const isCidr = /\/(\d{1,2})$/.test(t) || t.includes('::/');
    const isRange = t.includes('-') && !t.startsWith('-');
    const ipv4 = /^\d{1,3}(?:\.\d{1,3}){3}$/;
    const host = isCidr ? t.split('/')[0] : t;
    const subnet = isCidr ? t : (ipv4.test(t) ? t.replace(/\.\d+$/, '.0/24') : '192.168.1.0/24');
    if (kind === 'none') return cmd;
    if (kind === 'cidr') return cmd.replace(/2001:db8::\/64/g, t.includes(':') ? t : '2001:db8::/64').replace(/192\.168\.1\.0\/24/g, subnet).replace(/192\.168\.1\.1-50|192\.168\.1\.1-254/g, isRange ? t : subnet);
    if (kind === 'range') return cmd.replace(/192\.168\.1\.1-50|192\.168\.1\.1-254|192\.168\.1\.1-10|192\.168\.1\.1-5/g, isRange ? t : host);
    if (kind === 'multi') return cmd.replace(/192\.168\.1\.10 192\.168\.1\.20|192\.168\.1\.1 192\.168\.2\.1/g, host + ' ' + host);
    return cmd
      .replace(/192\.168\.1\.10/g, host)
      .replace(/192\.168\.1\.1(?![\d\/\-])/g, host)
      .replace(/192\.168\.1\.5/g, host)
      .replace(/example\.local/g, host.includes('.') || host.includes(':') ? host : 'example.local')
      .replace(/domain\.com/g, host.includes('.') && !ipv4.test(host) ? host : 'example.local')
      .replace(/scanme\.nmap\.org/g, 'scanme.nmap.org')
      .replace(/127\.0\.0\.1/g, t === '127.0.0.1' ? '127.0.0.1' : host);
  }

  function enrichDetails(i, cmd) {
    const base = i.details || {};
    const flagHelp = [];
    const c = cmd;
    if (/\-sn\b/.test(c)) flagHelp.push('<li><strong>-sn</strong>: Host discovery only. Nmap checks which hosts are up and skips port scanning.</li>');
    if (/\-sS\b/.test(c)) flagHelp.push('<li><strong>-sS (TCP SYN scan)</strong>: Sends a SYN packet (start of TCP handshake). SYN/ACK usually means open, RST means closed, no response/filter means filtered. Often called "half-open" because the full handshake may not complete.</li>');
    if (/\-sT\b/.test(c)) flagHelp.push('<li><strong>-sT (TCP connect scan)</strong>: Completes a full TCP connection using the OS. More compatible without special privileges, but more visible in logs.</li>');
    if (/\-sU\b/.test(c)) flagHelp.push('<li><strong>-sU (UDP scan)</strong>: Sends UDP probes. UDP has no handshake; replies may mean open, ICMP port unreachable may mean closed, and silence can mean open|filtered.</li>');
    if (/\-sA\b/.test(c)) flagHelp.push('<li><strong>-sA (ACK scan)</strong>: Sends ACK packets to map firewall filtering (filtered vs unfiltered). It does not determine open services.</li>');
    if (/\-sW\b/.test(c)) flagHelp.push('<li><strong>-sW (Window scan)</strong>: ACK-like scan that inspects TCP window values in responses; behavior is system-dependent.</li>');
    if (/\-sM\b/.test(c)) flagHelp.push('<li><strong>-sM (Maimon scan)</strong>: Sends FIN/ACK probes. Some systems differentiate open/closed differently; results vary by stack.</li>');
    if (/\-PS/.test(c)) flagHelp.push('<li><strong>-PS (SYN ping)</strong>: Host discovery probe using SYN packets to selected ports.</li>');
    if (/\-PA/.test(c)) flagHelp.push('<li><strong>-PA (ACK ping)</strong>: Host discovery probe using ACK packets; reachable hosts often respond with RST.</li>');
    if (/\-PU/.test(c)) flagHelp.push('<li><strong>-PU (UDP ping)</strong>: Host discovery probe using UDP packets (e.g. port 53). Responses/ICMP messages can indicate host is up.</li>');
    if (/\-PR\b/.test(c)) flagHelp.push('<li><strong>-PR (ARP ping)</strong>: Local-network discovery using ARP ("who has this IP?"). Fast and reliable on the same LAN.</li>');
    if (/\-Pn\b/.test(c)) flagHelp.push('<li><strong>-Pn</strong>: Skip host discovery and treat target as online.</li>');
    if (/\-p\b/.test(c)) flagHelp.push('<li><strong>-p</strong>: Port selection (single, list, range, or all ports with <code>-p-</code>).</li>');
    if (/\-F\b/.test(c)) flagHelp.push('<li><strong>-F</strong>: Fast mode (top 100 ports).</li>');
    if (/--top-ports/.test(c)) flagHelp.push('<li><strong>--top-ports N</strong>: Scan N most common ports.</li>');
    if (/\-sV\b/.test(c)) flagHelp.push('<li><strong>-sV</strong>: Service/version detection (best-effort software identification).</li>');
    if (/\-O\b/.test(c)) flagHelp.push('<li><strong>-O</strong>: OS detection using TCP/IP fingerprinting (probabilistic).</li>');
    if (/\-sC\b/.test(c) || /--script/.test(c)) flagHelp.push('<li><strong>NSE (-sC/--script)</strong>: Runs Nmap scripts for extra discovery/info. Use safe categories for learning and only with permission.</li>');
    if (/--reason\b/.test(c)) flagHelp.push('<li><strong>--reason</strong>: Shows why a port state was assigned (syn-ack, reset, no-response, etc.).</li>');
    if (/--open\b/.test(c)) flagHelp.push('<li><strong>--open</strong>: Show only open/possibly open ports.</li>');
    if (/\-o[ABGNX]/.test(c) || /-oA\b/.test(c)) flagHelp.push('<li><strong>Output flags</strong>: Save results for reporting/review (<code>-oN</code> normal, <code>-oX</code> XML, <code>-oG</code> grepable, <code>-oA</code> all).</li>');
    if (/\-T\d/.test(c)) flagHelp.push('<li><strong>Timing (-T0..T5)</strong>: Controls speed vs reliability/impact. T3 is default; higher is faster but can miss results.</li>');
    if (/\-6\b/.test(c)) flagHelp.push('<li><strong>-6</strong>: IPv6 scanning mode.</li>');

    const what = base.what || `${i.exp || i.easy || ''} ${i.remember ? 'Memory tip: ' + i.remember : ''}`.trim();
    const example = personalizeCommand(base.example || cmd, i.targetKind || 'host');
    const result = base.result || `Example (simulated/typical):\n$ ${example}\nStarting Nmap (simulated)\nNmap scan report for <target>\nHost is up (0.0020s latency)\nPORT    STATE  SERVICE\n22/tcp  open   ssh\n80/tcp  open   http\n443/tcp closed https\nNmap done: 1 IP address (1 host up) scanned\n\nHow to read it:\n- Host is up: target responded\n- open: service is listening\n- closed: reachable but no service\n- filtered/open|filtered (if shown): probes blocked or ambiguous`;
    const steps = base.steps || [
      'Confirm you own the target or have explicit permission to scan it.',
      'Run the command against the chosen target (IP, hostname, range, or CIDR as appropriate).',
      'Nmap sends probes based on the selected scan type/options and waits for responses.',
      'Review host status, port states, services/versions, and reasons/output details.',
      'Save or document results if needed for your authorized assessment or lab notes.'
    ];
    const mistakes = base.mistakes || [
      'Scanning without authorization or outside approved scope.',
      'Confusing filtered with closed, or open|filtered with definitely open.',
      'Treating version/OS guesses as guaranteed facts instead of best-effort results.'
    ];
    return { what, example, result, steps, mistakes, flagHelp };
  }

  function buildModalHtml(i, personalizedCmd) {
    const d = enrichDetails(i, i.cmd || personalizedCmd);
    return `
      <div class="cmd">${escapeHtml(personalizedCmd)}</div>
      <div class="kv">
        <div class="k">Category</div><div>${escapeHtml(i.cat || 'General')}</div>
        <div class="k">Level</div><div>${escapeHtml(i.level || 'Beginner')}</div>
        <div class="k">Easy meaning</div><div>${escapeHtml(i.easy || i.exp || '')}</div>
        <div class="k">Remember</div><div>${escapeHtml(i.remember || 'Break command into flags + target.')}</div>
        <div class="k">When to use</div><div>${escapeHtml(i.when || '')}</div>
      </div>
      <div class="detail-block"><h4>In-depth explanation</h4><p class="muted">${escapeHtml(d.what)}</p></div>
      ${d.flagHelp.length ? `<div class="detail-block"><h4>Flags & terms explained</h4><ul class="breakdown">${d.flagHelp.join('')}</ul></div>` : ''}
      ${i.flags && i.flags.length ? `<div class="detail-block"><h4>Flag breakdown</h4><ul class="breakdown">${i.flags.map(f=>`<li><strong>${escapeHtml(f[0])}</strong>: ${escapeHtml(f[1])}</li>`).join('')}</ul></div>` : ''}
      <div class="detail-block"><h4>How it works (step by step)</h4><ol class="breakdown">${d.steps.map(s=>`<li>${escapeHtml(s)}</li>`).join('')}</ol></div>
      <div class="detail-block"><h4>Example command (personalized)</h4><pre>${escapeHtml(d.example)}</pre></div>
      <div class="detail-block"><h4>Example output & how to read it</h4><pre>${escapeHtml(d.result)}</pre></div>
      ${i.out ? `<div class="detail-block"><h4>Expected outcome</h4><p class="muted">${escapeHtml(i.out)}</p></div>` : ''}
      <div class="detail-block"><h4>What to learn from results</h4><ul class="breakdown"><li>Check whether the host is up and note latency.</li><li>Interpret port states: open (listening), closed (reachable, no service), filtered (blocked/unknown), open|filtered (ambiguous).</li><li>Use service/version/OS/script/reason details as evidence for authorized analysis, not absolute truth.</li></ul></div>
      <div class="detail-block"><h4>Common mistakes & tips</h4><ul class="breakdown">${d.mistakes.map(m=>`<li>${escapeHtml(m)}</li>`).join('')}</ul></div>
      <div class="notice notice-warning small"><strong>Ethical use:</strong> Run scans only on systems you own or have explicit permission to assess. Examples are for learning and may vary by environment.</div>
      <div class="card-actions"><button class="btn btn-sm btn-primary" data-copy="${escapeAttr(personalizedCmd)}">Copy command</button></div>
    `;
  }

  function renderCommandReference() {
    const grid = document.getElementById('command-reference-grid') || document.getElementById('library-grid');
    const search = document.getElementById('ref-search') || document.getElementById('library-search');
    const catSel = document.getElementById('ref-category') || document.getElementById('library-category');
    const targetInput = document.getElementById('ref-target') || document.getElementById('cheatsheet-target');
    const targetPreset = document.getElementById('ref-target-preset') || document.getElementById('cheatsheet-target-preset');
    if (!grid) return;

    const cats = Array.from(new Set(commands.map(c => c.cat)));
    if (catSel && catSel.options.length <= 1) {
      cats.forEach(c => { const opt = document.createElement('option'); opt.value = c; opt.textContent = c; catSel.appendChild(opt); });
    }

    // expose unified list for search index
    window.CommandLibrary.allReference = commands;

    function draw() {
      const q = ((search && search.value) || '').toLowerCase().trim();
      const cat = catSel ? catSel.value : 'all';
      const items = commands.filter(c => {
        const matchCat = cat === 'all' || c.cat === cat;
        const hay = [c.cmd, c.cat, c.exp, c.when, c.out, c.level, c.remember, ...(c.flags||[]).flat()].join(' ').toLowerCase();
        return matchCat && (!q || hay.includes(q));
      });

      grid.innerHTML = items.map((i, idx) => {
        const cmd = personalizeCommand(i.cmd, i.targetKind || 'host');
        const key = encodeURIComponent(i.cat + '|' + idx + '|' + i.cmd);
        return `
          <article class="card lib-card">
            <div class="lib-meta"><span class="tag">${escapeHtml(i.cat)}</span>${i.level ? `<span class="tag level">${escapeHtml(i.level)}</span>` : ''}</div>
            <div class="cmd">${escapeHtml(cmd)}</div>
            <p><strong>Easy meaning:</strong> <span class="muted">${escapeHtml(i.easy || i.exp || '')}</span></p>
            ${i.remember ? `<p><strong>Remember:</strong> <span class="muted">${escapeHtml(i.remember)}</span></p>` : ''}
            ${i.when ? `<p><strong>When to use:</strong> <span class="muted">${escapeHtml(i.when)}</span></p>` : ''}
            ${i.flags && i.flags.length ? `<div class="detail-block"><h4>Flag breakdown</h4><ul class="breakdown">${i.flags.slice(0,4).map(f=>`<li><strong>${escapeHtml(f[0])}</strong>: ${escapeHtml(f[1])}</li>`).join('')}${i.flags.length>4?'<li class="muted">Open Details for full breakdown…</li>':''}</ul></div>` : ''}
            <div class="card-actions">
              <button class="btn btn-sm btn-primary copy-ref" data-cmd="${escapeAttr(cmd)}">Copy</button>
              <button class="btn btn-sm btn-secondary details-ref" data-key="${key}">Details</button>
              <button class="btn btn-sm btn-ghost bookmark-ref" data-cmd="${escapeAttr(cmd)}">Bookmark</button>
            </div>
          </article>`;
      }).join('') || '<div class="card muted">No commands match your search/filter.</div>';

      const lookup = {};
      items.forEach((i, idx) => {
        const cmd = personalizeCommand(i.cmd, i.targetKind || 'host');
        const key = encodeURIComponent(i.cat + '|' + idx + '|' + i.cmd);
        lookup[key] = { html: buildModalHtml(i, cmd), cmd };
      });

      grid.querySelectorAll('.copy-ref').forEach(b => b.addEventListener('click', () => StorageAPI.copyText(b.dataset.cmd)));
      grid.querySelectorAll('.bookmark-ref').forEach(b => b.addEventListener('click', () => { StorageAPI.addBookmark(b.dataset.cmd); StorageAPI.toast('Bookmarked'); renderBookmarks(); }));
      grid.querySelectorAll('.details-ref').forEach(b => b.addEventListener('click', () => {
        const data = lookup[b.dataset.key];
        if (data && window.openDetailModal) window.openDetailModal({ title: 'Command Details & Learning Guide', html: data.html });
      }));
    }

    if (search) search.addEventListener('input', draw);
    if (catSel) catSel.addEventListener('change', draw);
    if (targetInput) targetInput.addEventListener('input', draw);
    if (targetPreset) targetPreset.addEventListener('change', () => { if (targetPreset.value && targetInput) { targetInput.value = targetPreset.value; draw(); } });
    draw();
  }

  // compatibility wrappers
  function renderLibrary() { renderCommandReference(); }
  function renderCheatsheet() { renderCommandReference(); }

  function renderBookmarks() {
    const list = document.getElementById('bookmarks-list');
    if (!list) return;
    const items = StorageAPI.getBookmarks();
    list.innerHTML = items.length ? items.map(c => `<li><span>${escapeHtml(c)}</span><span><button class="btn btn-sm btn-ghost bm-copy" data-cmd="${escapeAttr(c)}">Copy</button> <button class="btn btn-sm btn-ghost bm-del" data-cmd="${escapeAttr(c)}">Remove</button></span></li>`).join('') : '<li class="muted">No bookmarks yet.</li>';
    list.querySelectorAll('.bm-copy').forEach(b => b.addEventListener('click', () => StorageAPI.copyText(b.dataset.cmd)));
    list.querySelectorAll('.bm-del').forEach(b => b.addEventListener('click', () => { StorageAPI.removeBookmark(b.dataset.cmd); renderBookmarks(); }));
  }

  window.CommandLibrary = { commands, categories, renderLibrary, renderCheatsheet, renderCommandReference, renderBookmarks, escapeHtml, escapeAttr, allReference: commands };
})();