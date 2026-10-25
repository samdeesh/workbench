// Foundry Corp - AI-Native UX Interactive Controller
// Author: Samdeesh Menia (foundry.blog/samdeesh)

document.addEventListener('DOMContentLoaded', () => {

  // ========================================================
  // 1. Direct-Action Intent Search & Dynamic Panels (Level 2)
  // ========================================================
  const searchInput = document.getElementById('main-search-input');
  const autosuggestMenu = document.getElementById('autosuggest-menu');
  const clearSearchBtn = document.getElementById('btn-clear-search');
  const emptyState = document.getElementById('direct-landing-empty');
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
    if (clearSearchBtn) clearSearchBtn.style.display = 'inline-flex';

    // Hide empty state and show the direct-action landing card
    if (emptyState) emptyState.style.display = 'none';
    if (landingCard) {
      landingCard.style.display = 'block';
      landingCard.classList.add('open');
    }

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

    // Enter key directly renders matching surface
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const val = searchInput.value.trim().toLowerCase();
        let targetAction = 'statements';
        if (val.includes('seat') || val.includes('marg') || val.includes('license') || val.includes('loss')) {
          targetAction = 'revenue';
        } else if (val.includes('churn') || val.includes('account')) {
          targetAction = 'churn';
        }
        openDirectPage(targetAction, searchInput.value);
      }
    });
  }

  // Click on Autosuggest Item renders the corresponding section
  document.querySelectorAll('.autosuggest-item').forEach(item => {
    item.addEventListener('click', () => {
      const action = item.dataset.action;
      const title = item.querySelector('.autosuggest-item-title').textContent;
      openDirectPage(action, title);
    });
  });

  // Sample Query Pills render corresponding section
  samplePills.forEach(pill => {
    pill.addEventListener('click', () => {
      const query = pill.dataset.query;
      if (searchInput) searchInput.value = query;

      if (query.includes('statements')) {
        openDirectPage('statements', query);
      } else if (query.includes('margin') || query.includes('seats')) {
        openDirectPage('revenue', query);
      } else if (query.includes('churn') || query.includes('accounts')) {
        openDirectPage('churn', query);
      }
    });
  });

  // Clear button resets to empty state
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      hideAutosuggest();
      clearSearchBtn.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      if (landingCard) {
        landingCard.style.display = 'none';
        landingCard.classList.remove('open');
      }
      Object.keys(panels).forEach(key => {
        if (panels[key]) panels[key].style.display = 'none';
      });
    });
  }

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
  // 2. Interactive Proactive Governance (Level 3 HITL Cockpit)
  // ========================================================
  const hitlPills = document.querySelectorAll('.approval-option-pill');
  const hitlOverrideInput = document.getElementById('hitl-override-input');
  const hitlNodeSlider = document.getElementById('hitl-node-slider');
  const hitlNodeDisplay = document.getElementById('hitl-node-display');
  const metricCost = document.getElementById('hitl-metric-cost');
  const subCost = document.getElementById('hitl-sub-cost');
  const metricSla = document.getElementById('hitl-metric-sla');
  const subSla = document.getElementById('hitl-sub-sla');
  const metricRisk = document.getElementById('hitl-metric-risk');
  const subRisk = document.getElementById('hitl-sub-risk');
  const hitlConfidenceBadge = document.getElementById('hitl-confidence-badge');
  const btnToggleDiff = document.getElementById('btn-toggle-diff');
  const diffToggleText = document.getElementById('diff-toggle-text');
  const hitlDiffView = document.getElementById('hitl-diff-view');
  const hitlDiffContent = document.getElementById('hitl-diff-content');
  const btnHitlAuthorize = document.getElementById('btn-hitl-authorize');
  const btnHitlAuthText = document.getElementById('btn-hitl-auth-text');
  const hitlAuthStatus = document.getElementById('hitl-auth-status');
  const hitlAuditStamp = document.getElementById('hitl-audit-stamp');
  const auditStampMessage = document.getElementById('audit-stamp-message');
  const btnResetHitl = document.getElementById('btn-reset-hitl');

  const strategyPresets = {
    redundancy: {
      cost: '+$320/mo',
      costSub: '100% On-Demand Reserved',
      sla: '99.99% SLA',
      slaSub: 'Zero dropped customer sessions',
      risk: 'Minimal Risk',
      riskSub: 'Within Q4 surge contingency',
      nodes: 16,
      confidence: 'Forecasting Confidence: 99.2%',
      directive: 'Approve proposed +$320/mo allocation for full cluster redundancy (16 nodes)',
      diff: `
        <div class="hitl-diff-removed">- min_nodes = 8</div>
        <div class="hitl-diff-added">+ min_nodes = 16</div>
        <div class="hitl-diff-removed">- max_nodes = 16</div>
        <div class="hitl-diff-added">+ max_nodes = 32</div>
        <div class="hitl-diff-added">+ instance_type = "c6i.2xlarge" (On-Demand redundancy)</div>
      `
    },
    spot: {
      cost: '+$150/mo',
      costSub: '53% Cost Reduction vs Full',
      sla: '99.91% SLA',
      slaSub: '0.08% spot drain interruption risk',
      risk: 'Moderate Risk',
      riskSub: 'Spot reclamation fallback configured',
      nodes: 12,
      confidence: 'Forecasting Confidence: 94.6%',
      directive: 'Cap budget at +$150/mo and mandate spot compute instances (12 nodes)',
      diff: `
        <div class="hitl-diff-removed">- min_nodes = 8</div>
        <div class="hitl-diff-added">+ min_nodes = 12</div>
        <div class="hitl-diff-added">+ spot_allocation_strategy = "capacity-optimized-prioritized"</div>
        <div class="hitl-diff-added">+ on_demand_base_capacity = 4</div>
        <div class="hitl-diff-added">+ spot_ratio = 0.70</div>
      `
    },
    defer: {
      cost: '$0/mo',
      costSub: 'Hold current quarterly allocation',
      sla: 'Uncertain (>8k RPS)',
      slaSub: 'Potential P99 latency throttling',
      risk: 'Elevated Risk',
      riskSub: 'Synthetic load test threshold required',
      nodes: 8,
      confidence: 'Forecasting Confidence: 78.4%',
      directive: 'Defer budget increase pending synthetic load test > 8,000 RPS (8 nodes)',
      diff: `
        <div class="hitl-diff-added">+ trigger_synthetic_load_test = true</div>
        <div class="hitl-diff-added">+ load_test_threshold_rps = 8000</div>
        <div class="hitl-diff-added">+ alert_pagerduty_on_drop = true</div>
      `
    }
  };

  // Switch Strategy Pills
  hitlPills.forEach(pill => {
    pill.addEventListener('click', () => {
      hitlPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const strategyKey = pill.dataset.strategy || 'redundancy';
      const preset = strategyPresets[strategyKey];
      if (!preset) return;

      if (metricCost) metricCost.textContent = preset.cost;
      if (subCost) subCost.textContent = preset.costSub;
      if (metricSla) metricSla.textContent = preset.sla;
      if (subSla) subSla.textContent = preset.slaSub;
      if (metricRisk) metricRisk.textContent = preset.risk;
      if (subRisk) subRisk.textContent = preset.riskSub;
      if (hitlConfidenceBadge) hitlConfidenceBadge.textContent = preset.confidence;

      if (hitlNodeSlider) hitlNodeSlider.value = preset.nodes;
      if (hitlNodeDisplay) hitlNodeDisplay.textContent = `${preset.nodes} Worker Nodes (+${preset.nodes - 8} surge buffer)`;
      if (hitlDiffContent) hitlDiffContent.innerHTML = preset.diff;
      if (hitlOverrideInput) hitlOverrideInput.value = preset.directive;
    });
  });

  // Slider interactive tuning
  if (hitlNodeSlider) {
    hitlNodeSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      const addedNodes = Math.max(0, val - 8);
      const dynamicCost = addedNodes * 40;

      if (hitlNodeDisplay) {
        hitlNodeDisplay.textContent = `${val} Worker Nodes (+${addedNodes} surge buffer)`;
      }

      if (metricCost) {
        metricCost.textContent = `+$${dynamicCost}/mo`;
      }
      if (subCost) {
        subCost.textContent = `Dynamically scaled for ${val} nodes`;
      }

      if (hitlOverrideInput) {
        hitlOverrideInput.value = `Approve custom +$${dynamicCost}/mo allocation for ${val} worker nodes`;
      }
    });
  }

  // Toggle Policy Diff Viewer
  if (btnToggleDiff && hitlDiffView) {
    btnToggleDiff.addEventListener('click', () => {
      const isVisible = hitlDiffView.style.display === 'block';
      hitlDiffView.style.display = isVisible ? 'none' : 'block';
      if (diffToggleText) {
        diffToggleText.textContent = isVisible ? 'Show Policy Diff Preview' : 'Hide Policy Diff Preview';
      }
    });
  }

  // Authorize Directive with 2-Phase Progress State
  if (btnHitlAuthorize) {
    btnHitlAuthorize.addEventListener('click', () => {
      const directive = hitlOverrideInput ? hitlOverrideInput.value.trim() : 'Approved proposed limit';
      if (!directive) return;

      btnHitlAuthorize.disabled = true;
      if (btnHitlAuthText) btnHitlAuthText.textContent = '1/2: Signing supervisor token...';
      if (hitlAuthStatus) hitlAuthStatus.textContent = 'Validating IAM administrative credentials...';

      setTimeout(() => {
        if (btnHitlAuthText) btnHitlAuthText.textContent = '2/2: Applying Terraform plan to us-east-1...';

        setTimeout(() => {
          btnHitlAuthorize.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Directive Authorized</span>
          `;
          btnHitlAuthorize.classList.add('btn-success-state');

          if (hitlAuthStatus) {
            hitlAuthStatus.innerHTML = '<span style="color: var(--status-success-text); font-weight: 600;">Directive successfully registered and enforced in cluster state</span>';
          }

          if (hitlAuditStamp) {
            hitlAuditStamp.style.display = 'flex';
          }
          if (auditStampMessage) {
            auditStampMessage.textContent = `✓ DIRECTIVE AUTHORIZED BY SUPERVISOR: "${directive}" • Dispatched in 340ms`;
          }
        }, 450);
      }, 400);
    });
  }

  // Reset Simulation Button
  if (btnResetHitl) {
    btnResetHitl.addEventListener('click', () => {
      if (btnHitlAuthorize) {
        btnHitlAuthorize.disabled = false;
        btnHitlAuthorize.classList.remove('btn-success-state');
        btnHitlAuthorize.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span id="btn-hitl-auth-text">Authorize Directive</span>
        `;
      }
      if (hitlAuthStatus) {
        hitlAuthStatus.textContent = 'Awaiting human supervisor authorization • Zero blind automated execution';
      }
      if (hitlAuditStamp) {
        hitlAuditStamp.style.display = 'none';
      }
    });
  }

  // ========================================================
  // 3. Level 4 Autopilot Operations Log: 1-Click Remediation & Revise
  // ========================================================
  const approveFixBtn = document.getElementById('btn-approve-fix');
  const btnReviseFix = document.getElementById('btn-revise-fix');
  const reviseDrawer = document.getElementById('remediation-revise-drawer');
  const reviseInput = document.getElementById('revise-fix-input');
  const btnSubmitRevision = document.getElementById('btn-submit-revision');
  const btnCancelRevision = document.getElementById('btn-cancel-revision');
  const hitlStatusText = document.getElementById('hitl-status-text');
  const pendingBadge = document.getElementById('tag-pending-badge');
  const pendingItem = document.getElementById('item-pending-approval');
  const resolutionNote = document.getElementById('text-pending-resolution');

  // Toggle Revise / Reject Drawer
  if (btnReviseFix && reviseDrawer) {
    btnReviseFix.addEventListener('click', () => {
      const isVisible = reviseDrawer.style.display === 'block';
      reviseDrawer.style.display = isVisible ? 'none' : 'block';
      if (!isVisible && reviseInput) {
        reviseInput.focus();
        reviseInput.select();
      }
    });
  }

  // Cancel Revision
  if (btnCancelRevision && reviseDrawer) {
    btnCancelRevision.addEventListener('click', () => {
      reviseDrawer.style.display = 'none';
    });
  }

  // Submit Custom Revision Directive
  if (btnSubmitRevision && reviseInput) {
    btnSubmitRevision.addEventListener('click', () => {
      const customAction = reviseInput.value.trim() || 'Hold traffic on primary, force certificate rollover';
      btnSubmitRevision.disabled = true;
      btnSubmitRevision.innerHTML = '<span class="theme-spinner"></span> <span>Applying Custom Directive...</span>';

      setTimeout(() => {
        if (reviseDrawer) reviseDrawer.style.display = 'none';

        if (approveFixBtn) approveFixBtn.style.display = 'none';
        if (btnReviseFix) {
          btnReviseFix.disabled = true;
          btnReviseFix.innerHTML = `
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Revision Enforced</span>
          `;
          btnReviseFix.classList.add('btn-success-state');
        }

        if (pendingBadge) {
          pendingBadge.textContent = 'REVISED DIRECTIVE';
          pendingBadge.className = 'activity-tag tag-resolved';
        }

        if (pendingItem) {
          pendingItem.classList.remove('awaiting-approval');
          pendingItem.style.background = '#FFFFFF';
          pendingItem.style.borderColor = 'var(--status-success-border)';
        }

        if (resolutionNote) {
          resolutionNote.innerHTML = `➔ <strong>Custom Override Enforced:</strong> ${customAction}`;
          resolutionNote.style.color = 'var(--gray-800)';
        }

        if (hitlStatusText) {
          hitlStatusText.innerHTML = '<span style="color: var(--status-success-text); font-weight: 600;">Supervisor custom directive dispatched to Frankfurt edge (24ms)</span>';
        }
      }, 650);
    });
  }

  // 1-Click Approve & Execute Fix
  if (approveFixBtn) {
    approveFixBtn.addEventListener('click', () => {
      approveFixBtn.disabled = true;
      if (btnReviseFix) btnReviseFix.style.display = 'none';
      if (reviseDrawer) reviseDrawer.style.display = 'none';

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

        if (pendingBadge) {
          pendingBadge.textContent = 'RESOLVED';
          pendingBadge.className = 'activity-tag tag-resolved';
        }

        if (pendingItem) {
          pendingItem.classList.remove('awaiting-approval');
          pendingItem.style.background = '#FFFFFF';
          pendingItem.style.borderColor = 'var(--status-success-border)';
        }

        if (hitlStatusText) {
          hitlStatusText.innerHTML = '<span style="color: var(--status-success-text); font-weight: 600;">Authorized by Supervisor • Edge latency normalized (18ms)</span>';
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


