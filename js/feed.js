/* ═══════════════════════════════════════════════════════════════════
   TIP — Threat Feed View
   Card rendering, search, filter, sort, DETAIL VIEW
   ═══════════════════════════════════════════════════════════════════ */

const FeedView = {
  activeCat: 'all',
  query: '',
  sortBy: 'date',
  detailId: null,

  render(subRoute) {
    if (subRoute && subRoute[0] === 'detail' && subRoute[1]) {
      this.detailId = subRoute[1];
      this.renderDetail();
    } else {
      this.detailId = null;
      this.renderFeed();
    }
  },

  renderFeed() {
    const container = document.getElementById('feedList');
    const countEl = document.getElementById('feedCount');
    const showingEl = document.getElementById('feedShowing');
    const metaUpdated = document.getElementById('feedUpdated');
    const headerEl = document.getElementById('feedHeader');
    const controlsEl = document.getElementById('feedControls');
    if (!container) return;

    // Show feed UI elements
    if (headerEl) headerEl.style.display = '';
    if (controlsEl) controlsEl.style.display = '';
    if (countEl) countEl.style.display = '';

    // Update meta
    const meta = DataManager.getMeta();
    if (metaUpdated) {
      metaUpdated.textContent = new Date(meta.lastFetch).toLocaleString('en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
        timeZone: 'UTC', timeZoneName: 'short'
      });
    }
    if (showingEl) {
      showingEl.innerHTML = `<b>${meta.totalPublished}</b> advisories`;
    }

    // Get and filter items
    let items = DataManager.getPublishedItems();

    if (this.activeCat !== 'all') {
      items = items.filter(i => i.category === this.activeCat);
    }

    if (this.query) {
      const q = this.query.toLowerCase();
      items = items.filter(i =>
        (i.title + ' ' + i.summary + ' ' + (i.cve || '') + ' ' + (i.actor || '') +
          ' ' + i.tags.join(' ') + ' ' + i.source).toLowerCase().includes(q)
      );
    }

    // Sort
    items.sort((a, b) => {
      if (this.sortBy === 'cvss') return (b.cvss || 0) - (a.cvss || 0);
      if (this.sortBy === 'sev') {
        const diff = (TIP_DATA.sevRank[b.severity] || 0) - (TIP_DATA.sevRank[a.severity] || 0);
        return diff || b.date.localeCompare(a.date);
      }
      return b.date.localeCompare(a.date);
    });

    // Count
    const catLabel = this.activeCat === 'all' ? 'all categories' : TIP_DATA.categories[this.activeCat].label;
    if (countEl) {
      countEl.textContent = `${items.length} of ${DataManager.getPublishedItems().length} advisories · ${catLabel}`;
    }

    // Render cards
    if (!items.length) {
      container.innerHTML = `<div class="empty-state">
        <div class="empty-icon">🔍</div>
        No advisories match your filter.
      </div>`;
      return;
    }

    container.innerHTML = items.map(item => this.renderCard(item)).join('');
  },

  renderCard(item) {
    const cat = TIP_DATA.categories[item.category];
    // Card click → detail view; Source link click → external (stopPropagation)
    return `<article class="feed-card cat-${item.category}" onclick="window.location.hash='feed/detail/${item.id}'" style="cursor:pointer">
      <div class="card-top">
        <span class="badge badge-${item.category}">${cat.short}</span>
        <span class="sev-badge sev-${item.severity.toLowerCase()}">${item.severity}</span>
        ${item.cve ? `<span class="cve-tag">${App.escapeHtml(item.cve)}</span>` : ''}
        ${item.cvss ? `<span class="cvss-tag">CVSS ${item.cvss.toFixed(1)}</span>` : ''}
        <span class="date-tag">${App.formatDate(item.date)}</span>
      </div>
      <h3>${App.escapeHtml(item.title)}</h3>
      <p class="card-summary">${App.escapeHtml(item.summary)}</p>
      <div class="card-footer">
        ${item.actor ? `<span class="actor-tag">▲ ${App.escapeHtml(item.actor)}</span>` : ''}
        ${item.tags.map(t => `<span class="hash-tag">#${App.escapeHtml(t)}</span>`).join('')}
        <span class="source-link"><a href="${App.escapeHtml(App.safeUrl(item.url))}" target="_blank" rel="noopener" onclick="event.stopPropagation()">${App.escapeHtml(item.source)} →</a></span>
      </div>
    </article>`;
  },

  /* ═══════════════════════════════════════════════════════════════════
     DETAIL VIEW — Full advisory article page
     ═══════════════════════════════════════════════════════════════════ */
  renderDetail() {
    const container = document.getElementById('feedList');
    const countEl = document.getElementById('feedCount');
    const headerEl = document.getElementById('feedHeader');
    const controlsEl = document.getElementById('feedControls');
    if (!container) return;

    // Hide feed-specific UI
    if (headerEl) headerEl.style.display = 'none';
    if (controlsEl) controlsEl.style.display = 'none';
    if (countEl) countEl.style.display = 'none';

    const item = TIP_DATA.feedItems.find(i => i.id === this.detailId);
    if (!item) {
      container.innerHTML = `<div class="empty-state">Advisory not found.</div>`;
      return;
    }

    const cat = TIP_DATA.categories[item.category];
    const detail = this.generateDetailContent(item);
    const linkedAdv = item.actor ? TIP_DATA.adversaries.find(a =>
      item.actor.toLowerCase().includes(a.name.toLowerCase())
    ) : null;

    // Estimate reading time
    const wordCount = detail.fullText.split(/\s+/).length;
    const readTime = Math.max(3, Math.ceil(wordCount / 200));

    container.innerHTML = `
      <div class="detail-article fade-in">
        <!-- Back nav -->
        <div class="back-btn" onclick="window.location.hash='feed'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Feed
        </div>

        <!-- Article Header -->
        <article class="article-container">
          <header class="article-header">
            <div class="article-badges">
              <span class="badge badge-${item.category}" style="font-size:11px;padding:4px 12px">${cat.short}</span>
              <span class="sev-badge sev-${item.severity.toLowerCase()}" style="font-size:11px;padding:4px 10px">${item.severity}</span>
              ${item.cve ? `<span class="cve-tag" style="font-size:12px;padding:3px 10px">${App.escapeHtml(item.cve)}</span>` : ''}
              ${item.cvss ? `<span class="cvss-tag" style="font-size:12px">CVSS ${item.cvss.toFixed(1)}</span>` : ''}
            </div>

            <h1 class="article-title">${App.escapeHtml(item.title)}</h1>

            <div class="article-meta">
              <span class="meta-item"><span class="meta-label">Published:</span> ${App.formatDate(item.date)}</span>
              <span class="meta-item"><span class="meta-label">Source:</span> <a href="${App.escapeHtml(App.safeUrl(item.url))}" target="_blank" rel="noopener" style="color:var(--accent)">${App.escapeHtml(item.source)}</a></span>
              <span class="meta-item"><span class="meta-label">Reading time:</span> ${readTime} min</span>
              ${item.actor ? `<span class="meta-item"><span class="meta-label">Threat Actor:</span> <span style="color:var(--cat-kev);font-weight:600">${App.escapeHtml(item.actor)}</span></span>` : ''}
            </div>

            <div class="article-tags">
              ${item.tags.map(t => `<span class="hash-tag">#${App.escapeHtml(t)}</span>`).join('')}
            </div>
          </header>

          <!-- TL;DR -->
          <div class="article-section">
            <blockquote class="article-tldr">
              <strong>TL;DR for analysts and IR teams.</strong> ${App.escapeHtml(detail.tldr)}
            </blockquote>
          </div>

          <hr class="article-divider">

          <!-- Context: Why This Matters -->
          <div class="article-section">
            <h2 class="article-h2">
              <span class="section-num">1.</span> Context: Why This Matters
            </h2>
            ${detail.context.map(p => `<p class="article-p">${p}</p>`).join('')}
          </div>

          <hr class="article-divider">

          <!-- Attack Topology -->
          <div class="article-section">
            <h2 class="article-h2">
              <span class="section-num">2.</span> Attack Topology
            </h2>
            <div class="attack-topology">
              ${detail.topology.map(step => `
                <div class="topology-step">
                  <div class="topology-phase">${step.phase}</div>
                  <div class="topology-detail">
                    <div class="topology-title">${step.title}</div>
                    <div class="topology-desc">${step.description}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <hr class="article-divider">

          <!-- Technical Analysis -->
          <div class="article-section">
            <h2 class="article-h2">
              <span class="section-num">3.</span> Technical Analysis
            </h2>
            ${detail.technical.map(p => `<p class="article-p">${p}</p>`).join('')}
          </div>

          <hr class="article-divider">

          <!-- IOCs & Detection -->
          <div class="article-section">
            <h2 class="article-h2">
              <span class="section-num">4.</span> Indicators of Compromise & Detection
            </h2>
            ${detail.iocs.length ? `
            <div class="ioc-table">
              <div class="ioc-header">
                <span>Type</span>
                <span>Value</span>
                <span>Context</span>
              </div>
              ${detail.iocs.map(ioc => `
                <div class="ioc-row">
                  <span class="ioc-type">${ioc.type}</span>
                  <span class="ioc-value">${ioc.value}</span>
                  <span class="ioc-context">${ioc.context}</span>
                </div>
              `).join('')}
            </div>` : '<p class="article-p" style="color:var(--text-muted)">No specific IOCs published for this advisory at this time.</p>'}

            ${detail.detectionRules ? `
            <div class="detection-tabs">
              <div class="det-tab-bar">
                <button class="det-tab active" onclick="FeedView.switchDetTab(this,'dataprime')">DataPrime</button>
                <button class="det-tab" onclick="FeedView.switchDetTab(this,'kql')">KQL</button>
                <button class="det-tab" onclick="FeedView.switchDetTab(this,'sigma')">Sigma Rule</button>
              </div>
              <div class="det-tab-panel active" data-panel="dataprime">
                <div class="query-block">
                  <div class="query-header">
                    <span>DataPrime · Coralogix Detection</span>
                    <button class="copy-btn" data-query-type="dataprime" data-item-id="${item.id}" onclick="FeedView.copyDetection(this)">Copy</button>
                  </div>
                  <pre class="query-body">${HuntLabView.highlightQuery(detail.detectionRules.dataprime)}</pre>
                </div>
              </div>
              <div class="det-tab-panel" data-panel="kql">
                <div class="query-block">
                  <div class="query-header">
                    <span>KQL · Microsoft Sentinel / Defender</span>
                    <button class="copy-btn" data-query-type="kql" data-item-id="${item.id}" onclick="FeedView.copyDetection(this)">Copy</button>
                  </div>
                  <pre class="query-body">${FeedView.highlightKQL(detail.detectionRules.kql)}</pre>
                </div>
              </div>
              <div class="det-tab-panel" data-panel="sigma">
                <div class="query-block">
                  <div class="query-header">
                    <span>Sigma Rule · Universal Detection</span>
                    <button class="copy-btn" data-query-type="sigma" data-item-id="${item.id}" onclick="FeedView.copyDetection(this)">Copy</button>
                  </div>
                  <pre class="query-body">${FeedView.highlightSigma(detail.detectionRules.sigma)}</pre>
                </div>
              </div>
            </div>` : ''}
          </div>

          <hr class="article-divider">

          <!-- Recommended Actions -->
          <div class="article-section">
            <h2 class="article-h2">
              <span class="section-num">5.</span> Recommended Actions
            </h2>
            <div class="action-list">
              ${detail.actions.map((action, i) => `
                <div class="action-item">
                  <div class="action-num">${i + 1}</div>
                  <div class="action-text">${action}</div>
                </div>
              `).join('')}
            </div>
          </div>

          ${linkedAdv ? `
          <hr class="article-divider">
          <div class="article-section">
            <h2 class="article-h2">
              <span class="section-num">6.</span> Linked Adversary Profile
            </h2>
            <div class="linked-adv-card" onclick="window.location.hash='adversaries/detail/${linkedAdv.id}'" style="cursor:pointer">
              <div class="adv-header">
                <div class="adv-icon ${linkedAdv.type}" style="width:36px;height:36px;font-size:16px">${linkedAdv.type === 'apt' ? '🎯' : '💰'}</div>
                <div>
                  <div class="adv-name" style="font-size:15px">${App.escapeHtml(linkedAdv.name)}</div>
                  <div class="adv-aliases">${linkedAdv.aliases.join(' · ')}</div>
                </div>
                <span class="badge badge-${linkedAdv.type === 'apt' ? 'kev' : 'ransomware'}" style="margin-left:auto">${linkedAdv.type.toUpperCase()}</span>
              </div>
              <p class="card-summary" style="margin:8px 0 0;font-size:12.5px">${App.escapeHtml(linkedAdv.notes)}</p>
            </div>
          </div>` : ''}

          <!-- Source & References -->
          <div class="article-section" style="margin-top:32px">
            <div class="article-source-box">
              <div style="font-family:var(--font-mono);font-size:10px;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);margin-bottom:8px">Original Source</div>
              <a href="${App.escapeHtml(App.safeUrl(item.url))}" target="_blank" rel="noopener" class="article-source-link">
                <span>${App.escapeHtml(item.source)}</span>
                <span style="color:var(--accent)">Open Source →</span>
              </a>
            </div>
          </div>
        </article>
      </div>
    `;
  },

  /* ═══════════════════════════════════════════════════════════════════
     DETAIL CONTENT GENERATOR
     Generates TL;DR, Context, Topology, Technical, IOCs, Actions
     based on the advisory data
     ═══════════════════════════════════════════════════════════════════ */
  generateDetailContent(item) {
    const catInfo = TIP_DATA.categories[item.category];
    // Free-text fields may originate from AI-curated/web-sourced content — escape
    // before splicing into any HTML string built in this file's generators.
    const s = {
      cve: item.cve ? App.escapeHtml(item.cve) : null,
      actor: item.actor ? App.escapeHtml(item.actor) : null,
      summary: App.escapeHtml(item.summary),
      tags: item.tags.map(t => App.escapeHtml(t)),
    };

    // --- TL;DR ---
    let tldr = s.summary;
    if (s.cve) tldr += ` Track as ${s.cve}.`;
    if (item.cvss) tldr += ` CVSS score: ${item.cvss.toFixed(1)}.`;
    if (s.actor) tldr += ` Attribution: ${s.actor}.`;
    tldr += ` Immediate action required: review exposure, apply patches if available, and monitor for exploitation indicators.`;

    // --- Context: Why This Matters ---
    const context = [];
    if (item.category === 'zeroday') {
      context.push(`This advisory tracks an actively-exploited zero-day vulnerability — a flaw that was being weaponized in the wild before a patch was available. Zero-days represent the highest-priority class of vulnerability because traditional patch-management cycles cannot defend against them; detection and containment must operate independently of vendor remediation timelines.`);
      context.push(`${s.summary} The exploitation window for this vulnerability began before public disclosure, meaning that organizations running affected software during the exploitation period must treat their environments as potentially compromised, not merely "at risk."`);
    } else if (item.category === 'kev') {
      context.push(`This vulnerability has been added to the CISA Known Exploited Vulnerabilities (KEV) catalog, which means there is confirmed evidence of active exploitation in the wild. Federal agencies are required to patch KEV entries within deadlines set by BOD 22-01, but all organizations should treat KEV additions as emergency-priority patching events.`);
      context.push(`${s.summary} The presence of this CVE in the KEV catalog transforms it from a theoretical risk into a confirmed, operational threat. Defenders should assume that exploit code is reliable and widely available.`);
    } else if (item.category === 'supplychain') {
      context.push(`Supply chain attacks target the trust relationships between software producers and consumers. Instead of attacking the target directly, adversaries compromise an upstream dependency, build system, or distribution channel — converting routine software updates into delivery mechanisms for malicious code. This class of attack is particularly dangerous because it bypasses perimeter defenses entirely.`);
      context.push(`${s.summary} The convergence of supply chain attacks targeting developer tooling signals a maturing attack playbook: the developer environment is the new perimeter.`);
    } else if (item.category === 'ransomware') {
      context.push(`Ransomware operations continue to evolve both technically and operationally. Modern ransomware groups operate as structured businesses with affiliate programs, specialized initial-access brokers, and data-extortion capabilities that don't depend on successful encryption. The financial incentive structure ensures that these operations will continue to intensify.`);
      context.push(`${s.summary} Organizations in targeted sectors should review their backup integrity, incident response playbooks, and network segmentation controls immediately.`);
    } else if (item.category === 'rce') {
      context.push(`Remote Code Execution vulnerabilities allow attackers to execute arbitrary code on target systems without requiring local access. When combined with "unauthenticated" and "no user interaction" characteristics, RCE flaws become wormable — capable of self-propagating across networks without any human involvement. These represent the most severe class of vulnerability in any risk framework.`);
      context.push(`${s.summary} Internet-facing assets running affected software should be patched with maximum urgency. If patching cannot be completed immediately, network-level mitigations (firewall rules, IPS signatures) should be deployed as interim controls.`);
    } else {
      context.push(`${s.summary}`);
      context.push(`This advisory warrants immediate review by security operations teams. The technical details and exploitation context should inform prioritization decisions for patching, detection engineering, and threat hunting activities.`);
    }

    // Add sector/impact context
    if (item.actor) {
      const adv = TIP_DATA.adversaries.find(a => item.actor.toLowerCase().includes(a.name.toLowerCase()));
      if (adv) {
        context.push(`The attributed threat actor, ${App.escapeHtml(adv.name)}, is a ${App.escapeHtml(adv.type)} group with ${App.escapeHtml(adv.motivation.toLowerCase())} motivation, known to target ${adv.sectors.map(x => App.escapeHtml(x)).join(', ')} sectors. Organizations in these sectors should elevate their monitoring posture and consider proactive threat hunting for related TTPs.`);
      }
    }

    // --- Attack Topology ---
    const topology = this.generateTopology(item);

    // --- Technical Analysis ---
    const technical = [];
    if (item.cve && item.cvss) {
      technical.push(`<strong>${s.cve}</strong> carries a CVSS base score of ${item.cvss.toFixed(1)}, placing it in the <strong>${App.escapeHtml(item.severity)}</strong> severity tier. ${item.cvss >= 9.0 ? 'Scores at or above 9.0 indicate that the vulnerability is trivially exploitable, requires no special privileges, and delivers maximum impact on confidentiality, integrity, or availability — often all three.' : item.cvss >= 7.0 ? 'Scores in this range indicate significant exploitability and impact, typically involving either a complex attack vector or requiring some level of privileges.' : 'While not rated as critical, this vulnerability still poses a meaningful risk in environments where the affected component is exposed.'}`);
    }
    technical.push(`The vulnerability's exploitation characteristics — ${s.tags.join(', ')} — align with known attack patterns. ${item.category === 'rce' ? 'Remote code execution without authentication represents the most dangerous vulnerability class, as it enables both initial access and lateral movement without requiring any pre-existing foothold.' : item.category === 'zeroday' ? 'Zero-day exploitation indicates that the attacker invested significant resources in vulnerability research and weaponization, suggesting either a sophisticated threat actor or access to an exploit broker marketplace.' : 'The exploitation pattern observed in the wild should inform detection engineering efforts.'}`);
    technical.push(`Defenders should monitor for the specific exploitation patterns associated with this vulnerability class. Network-based detection should focus on anomalous traffic patterns to/from affected services, while endpoint-based detection should monitor for post-exploitation indicators such as unusual process creation, credential access, or data staging activities.`);

    // --- IOCs ---
    const iocs = this.generateIOCs(item);

    // --- Detection Rules (DataPrime + KQL + Sigma) ---
    const detectionRules = {
      dataprime: this.generateDetectionQuery(item),
      kql: this.generateKQLQuery(item),
      sigma: this.generateSigmaRule(item)
    };

    // --- Recommended Actions ---
    const actions = [];
    actions.push(`<strong>Identify exposure:</strong> Enumerate all instances of affected software across your environment. Prioritize internet-facing and business-critical assets.`);
    if (s.cve) {
      actions.push(`<strong>Apply patches:</strong> Deploy vendor-provided patches for ${s.cve} immediately. If patching requires a maintenance window, implement compensating controls (WAF rules, network ACLs, IPS signatures) in the interim.`);
    } else {
      actions.push(`<strong>Apply mitigations:</strong> Follow vendor-recommended mitigations. Monitor vendor channels for patch availability.`);
    }
    actions.push(`<strong>Hunt for indicators:</strong> Search historical logs for the IOCs listed above. Focus on the exploitation window (${App.escapeHtml(item.date)} and earlier) to identify any pre-disclosure compromise.`);
    if (s.actor) {
      actions.push(`<strong>Actor-specific TTPs:</strong> Review MITRE ATT&CK mappings for ${s.actor} and validate that your detection coverage addresses their known tradecraft.`);
    }
    actions.push(`<strong>Monitor for exploitation:</strong> Deploy detection rules targeting the specific exploitation pattern. Use the DataPrime, KQL, or Sigma rules above depending on your SIEM platform.`);
    actions.push(`<strong>Update incident response:</strong> Ensure your IR playbook covers this vulnerability class. Pre-stage containment procedures for affected systems.`);

    // Full text for reading time calc
    const fullText = [tldr, ...context, ...technical, ...actions].join(' ');

    return { tldr, context, topology, technical, iocs, detectionRules, actions, fullText };
  },

  generateTopology(item) {
    const steps = [];
    const safeCve = item.cve ? App.escapeHtml(item.cve) : null;
    const safeActor = item.actor ? App.escapeHtml(item.actor) : null;
    const safeTags = item.tags.map(t => App.escapeHtml(t));
    const safeSummary = App.escapeHtml(item.summary);

    if (item.category === 'zeroday' || item.category === 'kev') {
      steps.push({ phase: 'RECON', title: 'Target Identification', description: `Adversary identifies ${safeTags[0] || 'target'} systems exposed to the internet via Shodan, Censys, or similar reconnaissance tools.` });
      steps.push({ phase: 'WEAPON', title: 'Exploit Development', description: `${safeCve ? safeCve + ' ' : ''}exploit is weaponized — ${item.cvss >= 9.0 ? 'unauthenticated, no user interaction required' : 'requires minimal prerequisites to execute'}.` });
      steps.push({ phase: 'DELIVER', title: 'Exploitation', description: `Exploit payload delivered to vulnerable ${safeTags[0] || 'service'}. ${item.category === 'zeroday' ? 'No patch available at time of exploitation.' : 'Unpatched systems are targeted.'}` });
      steps.push({ phase: 'EXPLOIT', title: 'Code Execution', description: `Arbitrary code execution achieved on target system. ${item.severity === 'Critical' ? 'SYSTEM/root level access obtained.' : 'Elevated privileges obtained.'}` });
      steps.push({ phase: 'C2', title: 'Post-Exploitation', description: `Attacker establishes persistence and begins lateral movement, credential harvesting, or data exfiltration.` });
    } else if (item.category === 'supplychain') {
      steps.push({ phase: 'INFILT', title: 'Supply Chain Infiltration', description: `Adversary compromises upstream package registry, build system, or trusted publisher credentials.` });
      steps.push({ phase: 'INJECT', title: 'Malicious Code Injection', description: `Backdoored code is injected into legitimate packages or updates. ${safeSummary.substring(0, 80)}…` });
      steps.push({ phase: 'DISTRIB', title: 'Distribution via Trust', description: `Compromised packages distributed through official channels. Victims install them as routine dependency updates.` });
      steps.push({ phase: 'EXECUTE', title: 'Payload Activation', description: `Malicious code activates in victim environments — credential theft, C2 establishment, or destructive payload delivery.` });
      steps.push({ phase: 'PERSIST', title: 'Persistence & Spread', description: `Backdoor maintains access across updates. In worm variants, the malware self-propagates to additional packages and systems.` });
    } else if (item.category === 'ransomware') {
      steps.push({ phase: 'ACCESS', title: 'Initial Access', description: `${safeActor || 'Ransomware operator'} obtains initial access — typically via VPN exploitation, phishing, or initial access broker.` });
      steps.push({ phase: 'RECON', title: 'Internal Discovery', description: `Attacker maps the network, identifies domain controllers, backup systems, and high-value data stores.` });
      steps.push({ phase: 'STAGE', title: 'Data Exfiltration', description: `Sensitive data is staged and exfiltrated to attacker-controlled infrastructure before encryption begins.` });
      steps.push({ phase: 'DEPLOY', title: 'Ransomware Deployment', description: `Encryption payload is deployed across the network via Group Policy, PsExec, or similar lateral deployment tools.` });
      steps.push({ phase: 'EXTORT', title: 'Extortion', description: `Victim receives ransom demand. Double-extortion: pay for decryption AND to prevent data publication on leak site.` });
    } else {
      steps.push({ phase: 'RECON', title: 'Reconnaissance', description: `Target systems identified and profiled for exploitation.` });
      steps.push({ phase: 'EXPLOIT', title: 'Exploitation', description: `${safeCve || 'Vulnerability'} exploited to gain access or execute code on target systems.` });
      steps.push({ phase: 'IMPACT', title: 'Impact', description: `${App.escapeHtml(item.severity)} severity impact on affected systems — ${safeTags.join(', ')}.` });
    }

    return steps;
  },

  generateIOCs(item) {
    const iocs = [];
    const safeCve = item.cve ? App.escapeHtml(item.cve) : null;
    const safeActor = item.actor ? App.escapeHtml(item.actor) : null;

    if (safeCve) {
      iocs.push({ type: 'CVE', value: `<code>${safeCve}</code>`, context: `Primary vulnerability identifier — use for patch management and vulnerability scanning` });
    }

    // Generate contextual IOCs based on category and tags
    if (item.tags.includes('kev') || item.category === 'kev') {
      iocs.push({ type: 'NETWORK', value: '<code>Anomalous traffic to affected service ports</code>', context: 'Monitor for exploitation traffic patterns to/from affected services' });
    }
    if (item.tags.includes('rce') || item.category === 'rce') {
      iocs.push({ type: 'PROCESS', value: '<code>Unexpected child processes from service accounts</code>', context: 'Post-exploitation indicator — web server or service spawning cmd/powershell/bash' });
    }
    if (safeActor) {
      const adv = TIP_DATA.adversaries.find(a => item.actor.toLowerCase().includes(a.name.toLowerCase()));
      if (adv && adv.iocs.length) {
        adv.iocs.forEach(ioc => {
          iocs.push({ type: 'THREAT INTEL', value: `<code>${App.escapeHtml(ioc)}</code>`, context: `Associated with ${adv.name}` });
        });
      }
    }
    if (item.tags.includes('ssrf')) {
      iocs.push({ type: 'WEB', value: '<code>SSRF-pattern requests (internal IP in URL parameters)</code>', context: 'Server-side request forgery exploitation attempts' });
    }
    if (item.tags.includes('wormable')) {
      iocs.push({ type: 'NETWORK', value: '<code>Lateral SMB/RPC scanning from internal hosts</code>', context: 'Wormable exploitation — monitor for internal scanning patterns' });
    }

    return iocs;
  },

  generateDetectionQuery(item) {
    if (item.category === 'rce' || item.tags.includes('rce')) {
      return `source logs
| filter $d.event_type == "process_creation"
| filter $d.parent_process in ["w3wp.exe", "httpd", "nginx", "java", "node"]
| filter $d.process_name in ["cmd.exe", "powershell.exe", "bash", "sh", "certutil.exe"]
| filter $d.timestamp >= "${item.date}T00:00:00Z"
| groupby $d.hostname, $d.parent_process, $d.process_name, $d.command_line
| count() as exec_count
| filter exec_count > 0
| sort -exec_count`;
    } else if (item.category === 'kev' || item.tags.includes('ssrf')) {
      return `source logs
| filter $d.event_type == "http_request"
| filter $d.url contains "${item.tags[0] || 'target'}"
| filter $d.response_code >= 200 && $d.response_code < 400
| filter $d.timestamp >= "${item.date}T00:00:00Z"
| groupby $d.source_ip, $d.url, $d.response_code
| count() as request_count
| filter request_count > 5
| sort -request_count`;
    } else if (item.category === 'supplychain') {
      return `source logs
| filter $d.event_type in ["process_creation", "file_creation"]
| filter $d.process_name in ["npm", "npx", "pip", "pip3", "node"]
| filter $d.command_line contains "${item.tags[0] || 'package'}"
| filter $d.timestamp >= "${item.date}T00:00:00Z"
| groupby $d.hostname, $d.user, $d.command_line
| count() as hits
| sort -hits`;
    } else if (item.category === 'ransomware') {
      return `source logs
| filter $d.event_type in ["file_modification", "file_creation"]
| filter $d.file_extension matches /\\.(encrypted|locked|crypt|ransom)$/
| filter $d.timestamp >= "${item.date}T00:00:00Z"
| groupby $d.hostname, $d.process_name, $d.file_path
| count() as file_count
| filter file_count > 10
| sort -file_count`;
    } else {
      return `source logs
| filter $d.timestamp >= "${item.date}T00:00:00Z"
| filter $d.severity in ["critical", "high"]
| filter $d.event_type in ["alert", "detection"]
| filter $d.description contains "${item.tags[0] || item.category}"
| groupby $d.source_ip, $d.hostname, $d.description
| count() as alert_count
| sort -alert_count`;
    }
  },

  /* ═══════════════════════════════════════════════════════════════════
     KQL Query Generator (Microsoft Sentinel / Defender)
     ═══════════════════════════════════════════════════════════════════ */
  generateKQLQuery(item) {
    if (item.category === 'rce' || item.tags.includes('rce')) {
      return `// KQL — Detect post-exploitation from RCE
DeviceProcessEvents
| where Timestamp >= datetime(${item.date}T00:00:00Z)
| where InitiatingProcessFileName in~ ("w3wp.exe", "httpd", "nginx", "java.exe", "node.exe")
| where FileName in~ ("cmd.exe", "powershell.exe", "bash", "sh", "certutil.exe", "bitsadmin.exe")
| project Timestamp, DeviceName, InitiatingProcessFileName, FileName, ProcessCommandLine
| summarize ExecutionCount = count() by DeviceName, InitiatingProcessFileName, FileName, ProcessCommandLine
| where ExecutionCount > 0
| sort by ExecutionCount desc`;
    } else if (item.category === 'kev' || item.tags.includes('ssrf')) {
      return `// KQL — Detect exploitation of ${item.cve || 'KEV vulnerability'}
CommonSecurityLog
| where TimeGenerated >= datetime(${item.date}T00:00:00Z)
| where RequestURL contains "${item.tags[0] || 'target'}"
| where ResponseCode >= 200 and ResponseCode < 400
| summarize RequestCount = count() by SourceIP, RequestURL, ResponseCode
| where RequestCount > 5
| sort by RequestCount desc

// Alternative: Network connection anomalies
DeviceNetworkEvents
| where Timestamp >= datetime(${item.date}T00:00:00Z)
| where RemotePort in (80, 443, 8080, 8443)
| summarize ConnectionCount = count() by DeviceName, RemoteIP, RemotePort
| where ConnectionCount > 100
| sort by ConnectionCount desc`;
    } else if (item.category === 'supplychain') {
      return `// KQL — Detect supply chain compromise indicators
DeviceProcessEvents
| where Timestamp >= datetime(${item.date}T00:00:00Z)
| where FileName in~ ("npm.cmd", "npx.cmd", "pip.exe", "pip3.exe", "node.exe")
| where ProcessCommandLine contains "${item.tags[0] || 'package'}"
| project Timestamp, DeviceName, AccountName, FileName, ProcessCommandLine
| summarize Hits = count() by DeviceName, AccountName, ProcessCommandLine
| sort by Hits desc

// File creation by package managers
DeviceFileEvents
| where Timestamp >= datetime(${item.date}T00:00:00Z)
| where InitiatingProcessFileName in~ ("npm.cmd", "node.exe", "pip.exe")
| where FileName endswith ".js" or FileName endswith ".py"
| summarize FileCount = count() by DeviceName, InitiatingProcessFileName, FolderPath`;
    } else if (item.category === 'ransomware') {
      return `// KQL — Detect ransomware activity patterns
DeviceFileEvents
| where Timestamp >= datetime(${item.date}T00:00:00Z)
| where ActionType == "FileModified" or ActionType == "FileCreated"
| where FileName matches regex @"\\.(encrypted|locked|crypt|ransom|enc)$"
| summarize FileCount = count() by DeviceName, InitiatingProcessFileName, bin(Timestamp, 1m)
| where FileCount > 10
| sort by FileCount desc

// Lateral movement via PsExec / WMI
DeviceProcessEvents
| where Timestamp >= datetime(${item.date}T00:00:00Z)
| where FileName in~ ("psexec.exe", "psexesvc.exe", "wmic.exe")
| project Timestamp, DeviceName, AccountName, FileName, ProcessCommandLine
| sort by Timestamp desc`;
    } else {
      return `// KQL — General threat detection for ${item.tags[0] || item.category}
SecurityAlert
| where TimeGenerated >= datetime(${item.date}T00:00:00Z)
| where AlertSeverity in ("High", "Critical")
| where Description contains "${item.tags[0] || item.category}"
| project TimeGenerated, AlertName, AlertSeverity, Description, RemediationSteps
| sort by TimeGenerated desc

DeviceEvents
| where Timestamp >= datetime(${item.date}T00:00:00Z)
| where ActionType in ("AntivirusDetection", "ExploitGuardNetworkProtectionBlocked")
| summarize AlertCount = count() by DeviceName, ActionType
| sort by AlertCount desc`;
    }
  },

  /* ═══════════════════════════════════════════════════════════════════
     Sigma Rule Generator (Universal Detection Format)
     ═══════════════════════════════════════════════════════════════════ */
  generateSigmaRule(item) {
    const title = item.title.replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 60);
    const id = 'tip-' + item.id;
    const cveRef = item.cve || 'N/A';
    const tags = item.tags.map(t => `    - attack.${t.replace(/[^a-z0-9]/g, '_')}`).join('\n');

    if (item.category === 'rce' || item.tags.includes('rce')) {
      return `title: "${title}"
id: ${id}
status: experimental
level: critical
description: |
  Detects post-exploitation activity following ${cveRef}.
  ${item.summary.substring(0, 120)}...
references:
  - ${item.url}
date: ${item.date}
author: TIP Auto-Generated
tags:
    - attack.execution
    - attack.t1059
    - cve.${(item.cve || 'unknown').toLowerCase()}
${tags}
logsource:
    category: process_creation
    product: windows
detection:
    selection_parent:
        ParentImage|endswith:
            - '\\\\w3wp.exe'
            - '\\\\httpd.exe'
            - '\\\\nginx.exe'
            - '\\\\java.exe'
            - '\\\\node.exe'
    selection_child:
        Image|endswith:
            - '\\\\cmd.exe'
            - '\\\\powershell.exe'
            - '\\\\certutil.exe'
            - '\\\\bitsadmin.exe'
            - '\\\\mshta.exe'
    condition: selection_parent and selection_child
falsepositives:
    - Legitimate admin scripts executed by web services
    - Scheduled tasks triggered by service accounts`;
    } else if (item.category === 'supplychain') {
      return `title: "${title}"
id: ${id}
status: experimental
level: high
description: |
  Detects indicators of supply chain compromise.
  ${item.summary.substring(0, 120)}...
references:
  - ${item.url}
date: ${item.date}
author: TIP Auto-Generated
tags:
    - attack.supply_chain
    - attack.t1195
${tags}
logsource:
    category: process_creation
    product: windows
detection:
    selection_pkg:
        Image|endswith:
            - '\\\\npm.cmd'
            - '\\\\npx.cmd'
            - '\\\\pip.exe'
            - '\\\\node.exe'
        CommandLine|contains:
            - '${item.tags[0] || 'malicious-package'}'
    selection_net:
        Image|endswith: '\\\\node.exe'
        DestinationHostname|contains:
            - 'pastebin'
            - 'raw.githubusercontent'
            - 'ngrok'
    condition: selection_pkg or selection_net
falsepositives:
    - Legitimate package installations
    - CI/CD pipeline activity`;
    } else if (item.category === 'ransomware') {
      return `title: "${title}"
id: ${id}
status: experimental
level: critical
description: |
  Detects ransomware deployment indicators.
  ${item.summary.substring(0, 120)}...
references:
  - ${item.url}
date: ${item.date}
author: TIP Auto-Generated
tags:
    - attack.impact
    - attack.t1486
    - attack.t1490
${tags}
logsource:
    category: file_event
    product: windows
detection:
    selection_ext:
        TargetFilename|endswith:
            - '.encrypted'
            - '.locked'
            - '.crypt'
            - '.ransom'
    selection_tools:
        Image|endswith:
            - '\\\\vssadmin.exe'
            - '\\\\wbadmin.exe'
            - '\\\\bcdedit.exe'
        CommandLine|contains:
            - 'delete shadows'
            - 'delete catalog'
            - 'recoveryenabled no'
    condition: selection_ext or selection_tools
falsepositives:
    - Legitimate encryption tools
    - Backup software operations`;
    } else {
      return `title: "${title}"
id: ${id}
status: experimental
level: ${item.severity === 'Critical' ? 'critical' : item.severity === 'High' ? 'high' : 'medium'}
description: |
  Detects exploitation of ${cveRef}.
  ${item.summary.substring(0, 120)}...
references:
  - ${item.url}
date: ${item.date}
author: TIP Auto-Generated
tags:
    - cve.${(item.cve || 'unknown').toLowerCase()}
${tags}
logsource:
    category: process_creation
    product: windows
detection:
    selection:
        Image|endswith:
            - '\\\\cmd.exe'
            - '\\\\powershell.exe'
    filter:
        ParentImage|endswith:
            - '\\\\explorer.exe'
            - '\\\\svchost.exe'
    condition: selection and not filter
falsepositives:
    - Administrative activity
    - Legitimate automation scripts`;
    }
  },

  /* ═══════════════════════════════════════════════════════════════════
     Syntax Highlighters
     ═══════════════════════════════════════════════════════════════════ */
  highlightKQL(query) {
    const escaped = query
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    return escaped.replace(
      /(\b(?:where|project|summarize|sort|extend|join|union|let|count|bin|datetime|ago|startofday|endofday|parse|distinct|top|take|render|mv-expand|make-set|make-list|has|has_any|matches)\b)|(\/\/.*)|(\"(?:[^\"\\]|\\.)*\")|(@\"[^\"]*\")|(\'[^\']*\')|(\b(?:by|in~?|in|and|or|not|desc|asc|on|between|contains|endswith|startswith|matches regex)\b|==|!=|&gt;=|&lt;=|&gt;|&lt;)|(\b\d+\.?\d*\b)|(\b[A-Z][A-Za-z]+(?:Events?|Log|Alert|Info)\b)/g,
      function(m, kw, comment, str1, str2, str3, op, num, table) {
        if (kw)      return '<span class="q-keyword">' + m + '</span>';
        if (comment)  return '<span class="q-comment">' + m + '</span>';
        if (str1 || str2 || str3) return '<span class="q-string">' + m + '</span>';
        if (op)       return '<span class="q-operator">' + m + '</span>';
        if (num)      return '<span class="q-number">' + m + '</span>';
        if (table)    return '<span class="q-function">' + m + '</span>';
        return m;
      }
    );
  },

  highlightSigma(yaml) {
    const escaped = yaml
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    return escaped.replace(
      /(#.*)|(\'[^\']*\')|(\"[^\"]*\")|(\b(?:title|id|status|level|description|references|date|author|tags|logsource|detection|falsepositives|fields|condition)\b:)|(\b(?:category|product|service)\b:)|(\b(?:and|or|not|selection\w*|filter\w*)\b)|(\|(?:endswith|startswith|contains|base64offset|re|cidr|all|windash))|(\b(?:experimental|test|stable|critical|high|medium|low|informational)\b)/g,
      function(m, comment, sq, dq, topkey, srckey, logic, modifier, lvl) {
        if (comment)  return '<span class="q-comment">' + m + '</span>';
        if (sq || dq) return '<span class="q-string">' + m + '</span>';
        if (topkey)   return '<span class="q-keyword">' + m + '</span>';
        if (srckey)   return '<span class="q-function">' + m + '</span>';
        if (logic)    return '<span class="q-operator">' + m + '</span>';
        if (modifier) return '<span class="q-function">' + m + '</span>';
        if (lvl)      return '<span class="q-number">' + m + '</span>';
        return m;
      }
    );
  },

  /* ═══════════════════════════════════════════════════════════════════
     Detection Tab Switching & Copy
     ═══════════════════════════════════════════════════════════════════ */
  switchDetTab(btn, panel) {
    const container = btn.closest('.detection-tabs');
    container.querySelectorAll('.det-tab').forEach(t => t.classList.remove('active'));
    container.querySelectorAll('.det-tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    container.querySelector(`[data-panel="${panel}"]`).classList.add('active');
  },

  copyDetection(btn) {
    const type = btn.dataset.queryType;
    const itemId = btn.dataset.itemId;
    const item = TIP_DATA.feedItems.find(i => i.id === itemId);
    if (!item) return;

    let text = '';
    if (type === 'dataprime') text = this.generateDetectionQuery(item);
    else if (type === 'kql') text = this.generateKQLQuery(item);
    else if (type === 'sigma') text = this.generateSigmaRule(item);

    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = '✓ Copied!';
      setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
    });
  },

  // Store detection rules for copy access
  _cachedRules: {},

  bindEvents() {
    const searchInput = document.getElementById('feedSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.query = e.target.value;
        this.renderFeed();
      });
    }

    const sortSelect = document.getElementById('feedSort');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.sortBy = e.target.value;
        this.renderFeed();
      });
    }
  }
};

// Bind events after DOM ready
document.addEventListener('DOMContentLoaded', () => FeedView.bindEvents());
