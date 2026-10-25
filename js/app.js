// Foundry Corp - AI-Native UX Interactive Controller
// Author: Samdeesh Menia (foundry.blog/samdeesh)

document.addEventListener('DOMContentLoaded', () => {

  // ========================================================
  // 1. Direct-Action Intent Search & Dynamic Panels
  // ========================================================
  const searchInput = document.getElementById('main-search-input');
  const autosuggestMenu = document.getElementById('autosuggest-menu');
  const clearSearchBtn = document.getElementById('btn-clear-search');
  const landingCard = document.getElementById('direct-landing-container');
  const skeletonLoader = document.getElementById('landing-skeleton');
  const samplePills = document.querySelectorAll('.sample-query-pill');

  const panels = {
    statements: document.getElementById('panel-statements'),
    revenue: document.getElementById('panel-revenue'),
    churn: document.getElementById('panel-churn')
  };

  function showAutosuggest() {
    if (autosuggestMenu) autosuggestMenu.classList.add('open');
    if (clearSearchBtn) clearSearchBtn.style.display = 'inline-flex';
  }

  function hideAutosuggest() {
    if (autosuggestMenu) autosuggestMenu.classList.remove('open');
  }

  function openDirectPage(actionKey, queryText) {
    hideAutosuggest();
    if (searchInput) searchInput.value = queryText || searchInput.value;

    // Show simulated quick skeleton loading animation for tactile AI retrieval feel
    if (skeletonLoader) {
      skeletonLoader.style.display = 'flex';
      Object.keys(panels).forEach(key => {
        if (panels[key]) panels[key].style.display = 'none';
      });

      setTimeout(() => {
        skeletonLoader.style.display = 'none';
        Object.keys(panels).forEach(key => {
          if (panels[key]) {
            panels[key].style.display = (key === actionKey) ? 'block' : 'none';
          }
        });
      }, 250);
    } else {
      Object.keys(panels).forEach(key => {
        if (panels[key]) {
          panels[key].style.display = (key === actionKey) ? 'block' : 'none';
        }
      });
    }

    if (landingCard) {
      landingCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value.trim().toLowerCase();
      if (val.length > 0) {
        showAutosuggest();

        // Match autosuggest items
        const items = document.querySelectorAll('.autosuggest-item');
        items.forEach(item => {
          const action = item.dataset.action;
          const text = item.textContent.toLowerCase();
          const matches = text.includes(val) || 
            (val.includes('stat') && action === 'statements') ||
            (val.includes('bank') && action === 'statements') ||
            (val.includes('seat') && action === 'revenue') ||
            (val.includes('license') && action === 'revenue') ||
            (val.includes('marg') && action === 'revenue') ||
            (val.includes('loss') && action === 'revenue') ||
            (val.includes('churn') && action === 'churn') ||
            (val.includes('account') && action === 'churn');

          item.style.display = matches ? 'flex' : 'none';
        });
      } else {
        hideAutosuggest();
        if (clearSearchBtn) clearSearchBtn.style.display = 'none';
      }
    });

    searchInput.addEventListener('focus', () => {
      if (searchInput.value.trim().length > 0) showAutosuggest();
    });
  }

  // Click on Autosuggest Item
  document.querySelectorAll('.autosuggest-item').forEach(item => {
    item.addEventListener('click', () => {
      const action = item.dataset.action;
      const title = item.querySelector('.autosuggest-item-title').textContent;
      openDirectPage(action, title);
    });
  });

  // Sample Query Pills
  samplePills.forEach(pill => {
    pill.addEventListener('click', () => {
      const query = pill.dataset.query;
      if (searchInput) searchInput.value = query;
      showAutosuggest();

      if (query.includes('statements')) {
        openDirectPage('statements', query);
      } else if (query.includes('margin') || query.includes('seats')) {
        openDirectPage('revenue', query);
      } else if (query.includes('churn')) {
        openDirectPage('churn', query);
      }
    });
  });

  // Clear button
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      hideAutosuggest();
      clearSearchBtn.style.display = 'none';
    });
  }

  // Multimodal Voice Streaming Simulator
  const voiceBtn = document.getElementById('btn-voice-input');
  const voiceWaveform = document.getElementById('voice-waveform');
  const voicePill = document.getElementById('pill-voice-modality');

  function triggerMultimodalVoiceSimulation() {
    if (!voiceBtn || voiceBtn.classList.contains('listening')) return;

    voiceBtn.classList.add('listening');
    if (voiceWaveform) voiceWaveform.classList.add('active');
    if (clearSearchBtn) clearSearchBtn.style.display = 'none';
    if (searchInput) {
      searchInput.value = '';
      searchInput.setAttribute('placeholder', 'Streaming multimodal voice transcript...');
    }

    const spokenQuery = "Where are my treasury statements?";
    let charIndex = 0;

    // Simulate real-time speech transcription stream
    const typeInterval = setInterval(() => {
      if (charIndex < spokenQuery.length) {
        if (searchInput) searchInput.value = spokenQuery.slice(0, charIndex + 1);
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          voiceBtn.classList.remove('listening');
          if (voiceWaveform) voiceWaveform.classList.remove('active');
          if (searchInput) searchInput.setAttribute('placeholder', "Type or click voice: 'statements', 'margin', or 'churn'...");
          openDirectPage('statements', spokenQuery);
        }, 350);
      }
    }, 40);
  }

  if (voiceBtn) voiceBtn.addEventListener('click', triggerMultimodalVoiceSimulation);
  if (voicePill) voicePill.addEventListener('click', triggerMultimodalVoiceSimulation);

  // Document click to close autosuggest
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-box-wrapper')) {
      hideAutosuggest();
    }
  });

  // 1-Click Statement Downloads with Loading Spinner
  document.querySelectorAll('.action-download-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const b = e.currentTarget;
      const original = b.innerHTML;
      b.innerHTML = '<span class="theme-spinner"></span> <span>Generating PDF...</span>';
      b.disabled = true;

      setTimeout(() => {
        b.innerHTML = `
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Downloaded</span>
        `;
        b.classList.add('btn-success-state');

        setTimeout(() => {
          b.innerHTML = original;
          b.disabled = false;
          b.classList.remove('btn-success-state');
        }, 2200);
      }, 650);
    });
  });

  // Relatable Financial Telemetry: Reclaim Inactive SaaS Seats
  const applyCdnBtn = document.getElementById('btn-apply-cdn');
  const cdnSuccessBox = document.getElementById('cdn-success-box');
  const dragDisplay = document.getElementById('revenue-drag-display');
  const driverStatusTag = document.getElementById('driver-status-tag');

  if (applyCdnBtn) {
    applyCdnBtn.addEventListener('click', () => {
      applyCdnBtn.disabled = true;
      applyCdnBtn.innerHTML = '<span class="theme-spinner"></span> <span>Reclaiming 142 Inactive Licenses...</span>';

      setTimeout(() => {
        applyCdnBtn.innerHTML = `
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>142 Seats Reclaimed</span>
        `;
        applyCdnBtn.classList.add('btn-success-state');

        if (dragDisplay) {
          dragDisplay.textContent = 'Normalized (+$48.2K/yr)';
          dragDisplay.style.color = 'var(--status-success-text)';
        }

        if (driverStatusTag) {
          driverStatusTag.textContent = 'RECLAIM RESOLVED';
          driverStatusTag.className = 'activity-tag tag-auto';
        }

        if (cdnSuccessBox) {
          cdnSuccessBox.style.display = 'block';
        }
      }, 700);
    });
  }

  // Churn Diagnostic: Schedule Executive QBR
  const scheduleQbrBtn = document.getElementById('btn-schedule-qbr');
  if (scheduleQbrBtn) {
    scheduleQbrBtn.addEventListener('click', () => {
      scheduleQbrBtn.disabled = true;
      scheduleQbrBtn.innerHTML = '<span class="theme-spinner"></span> <span>Scheduling...</span>';

      setTimeout(() => {
        scheduleQbrBtn.innerHTML = `
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Executive QBR Scheduled</span>
        `;
        scheduleQbrBtn.classList.add('btn-success-state');
      }, 600);
    });
  }

  // ========================================================
  // 2. Proactive AI with Human-in-the-Loop (Level 2 HITL)
  // ========================================================
  const approveFixBtn = document.getElementById('btn-approve-fix');
  const hitlStatusText = document.getElementById('hitl-status-text');

  if (approveFixBtn) {
    approveFixBtn.addEventListener('click', () => {
      approveFixBtn.disabled = true;
      approveFixBtn.innerHTML = '<span class="theme-spinner"></span> <span>Executing Remediation on Edge...</span>';
      if (hitlStatusText) hitlStatusText.textContent = 'Rerouting EUR checkout gateway & rotating token handshake...';

      setTimeout(() => {
        approveFixBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Remediation Executed</span>
        `;
        approveFixBtn.classList.add('btn-success-state');

        if (hitlStatusText) {
          hitlStatusText.innerHTML = '<span style="color: var(--status-success-text); font-weight: 600;">Authorized by Supervisor • Edge latency normalized (18ms)</span>';
        }
      }, 750);
    });
  }

  // ========================================================
  // 3. Level 3 Activity Log: Smart Suggestions & Override
  // ========================================================
  const toggleDrawerBtn = document.getElementById('btn-toggle-drawer');
  const approvalDrawer = document.getElementById('approval-drawer');
  const optionPills = document.querySelectorAll('.approval-option-pill');
  const overrideInput = document.getElementById('approval-override-input');
  const submitApprovalBtn = document.getElementById('btn-submit-approval');
  const pendingBadge = document.getElementById('tag-pending-badge');
  const pendingItem = document.getElementById('item-pending-approval');
  const pendingTitle = document.getElementById('text-pending-title');
  const pendingSub = document.getElementById('text-pending-sub');

  // Toggle drawer visibility if needed
  if (toggleDrawerBtn && approvalDrawer) {
    toggleDrawerBtn.addEventListener('click', () => {
      const isHidden = approvalDrawer.style.display === 'none';
      approvalDrawer.style.display = isHidden ? 'block' : 'none';
      const textSpan = document.getElementById('btn-toggle-text');
      if (textSpan) textSpan.textContent = isHidden ? 'Hide Options' : 'Review Options';
    });
  }

  // Clicking an AI Suggestion pill auto-fills the custom override input
  optionPills.forEach(pill => {
    pill.addEventListener('click', () => {
      optionPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const directive = pill.dataset.directive;
      if (overrideInput && directive) {
        overrideInput.value = directive;
        overrideInput.focus();
      }
    });
  });

  // Authorize Directive with Loading Spinner
  if (submitApprovalBtn) {
    submitApprovalBtn.addEventListener('click', () => {
      const directiveText = overrideInput ? overrideInput.value.trim() : 'Approved proposed limit';
      if (!directiveText) return;

      submitApprovalBtn.disabled = true;
      submitApprovalBtn.innerHTML = '<span class="theme-spinner"></span> <span>Applying Directive...</span>';

      setTimeout(() => {
        submitApprovalBtn.innerHTML = `
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Directive Applied</span>
        `;
        submitApprovalBtn.classList.add('btn-success-state');

        if (pendingBadge) {
          pendingBadge.textContent = 'POLICY ACTIVE';
          pendingBadge.className = 'activity-tag tag-auto';
        }

        if (pendingItem) {
          pendingItem.classList.remove('awaiting-approval');
          pendingItem.style.background = '#FFFFFF';
          pendingItem.style.borderColor = 'var(--status-success-border)';
        }

        if (pendingTitle) {
          pendingTitle.textContent = 'PR-402: Auto-scaling cluster policy enforced';
        }

        if (pendingSub) {
          pendingSub.textContent = `Applied Directive: "${directiveText}" • Authorized by Supervisor`;
        }

        if (toggleDrawerBtn) {
          toggleDrawerBtn.style.display = 'none';
        }
      }, 700);
    });
  }

  // ========================================================
  // Flat Navigation Tabs (AI-Native UX 3 Levels)
  // ========================================================
  const tabButtons = document.querySelectorAll('.level-tab-btn');
  const tabPanes = document.querySelectorAll('.level-tab-pane');

  function switchTab(tabKey, updateHash = true) {
    if (!tabKey) return;
    const targetPaneId = `pane-${tabKey}`;
    const targetPane = document.getElementById(targetPaneId);
    if (!targetPane) return;

    tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabKey);
    });

    tabPanes.forEach(pane => {
      pane.classList.toggle('active', pane.id === targetPaneId);
    });

    if (updateHash) {
      history.replaceState(null, '', `#${tabKey}`);
    }
  }

  window.switchTab = switchTab;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabKey = btn.dataset.tab;
      switchTab(tabKey);
    });
  });

  // Handle URL hash on initial load (e.g. #level-2, #level-3, #level-4)
  if (window.location.hash) {
    let hashKey = window.location.hash.replace('#', '');
    if (hashKey === 'level-1') hashKey = 'level-2';
    if (['level-2', 'level-3', 'level-4'].includes(hashKey)) {
      switchTab(hashKey, false);
    }
  }

  // ========================================================
  // GitHub Stars Fetcher with Session Caching
  // ========================================================
  function loadGitHubStars() {
    const starPills = document.querySelectorAll('[data-repo="samdeesh/workbench"]');
    if (!starPills.length) return;

    try {
      const cachedStars = sessionStorage.getItem('gh_stars_workbench');
      if (cachedStars) {
        starPills.forEach(pill => { pill.textContent = cachedStars; });
        return;
      }

      fetch('https://api.github.com/repos/samdeesh/workbench')
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && typeof data.stargazers_count === 'number') {
            const count = data.stargazers_count.toLocaleString();
            sessionStorage.setItem('gh_stars_workbench', count);
            starPills.forEach(pill => { pill.textContent = count; });
          }
        })
        .catch(() => {
          // Keep fallback
        });
    } catch (e) {
      // Ignore sessionStorage errors in restricted sandboxes
    }
  }

  loadGitHubStars();

});


