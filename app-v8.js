(() => {
  fetch('app-v7.js?v=8', {cache:'no-store'})
    .then(r => { if (!r.ok) throw new Error('Dashboard script unavailable: '+r.status); return r.text(); })
    .then(source => {
      // app-v7 contained one extra closing bracket after searchRules.
      // Remove that exact malformed line before evaluating the dashboard.
      const fixed = source.replace("\n];\nconst spendFields", "\nconst spendFields");
      (0,eval)(fixed);

      // Main recommendation tool: calculate the reward for THIS purchase only.
      window.searchPurchase = function(){
        const q = (document.getElementById('purchaseSearch')?.value || '').trim();
        const amount = Number(document.getElementById('purchaseAmount')?.value) || 0;
        const out = document.getElementById('purchaseResult');
        if (!out) return;
        if (!q || amount <= 0) {
          out.innerHTML = '<div class="empty">Enter what you are buying and the exact purchase amount to see your estimated reward for this single purchase.</div>';
          return;
        }
        const rule = detectCategory(q);
        const results = Object.entries(cards).map(([id,c]) => {
          const pct = rateFor(id, rule.cat);
          const value = pct == null ? null : amount * pct / 100;
          let offer = null;
          try { offer = matchingOffer(id,q); } catch(e) { offer = null; }
          return {id,name:c.name,pct,value,offer};
        }).sort((a,b)=>(b.value ?? -1)-(a.value ?? -1));
        const top = results.find(x => x.value != null);
        let html = `<div class="purchase-summary"><div class="type">SINGLE PURCHASE</div><h3>${esc(rule.label)}</h3><p class="muted">${esc(q)} · Purchase amount ${money(amount)}</p></div>`;
        if (top) html += `<div class="purchase-top"><span class="offer-status active">Highest configured reward for this purchase</span><h2>${esc(top.name)}</h2><p><strong>${top.pct}%</strong> back = <strong>${money(top.value)}</strong> estimated reward on this ${money(amount)} purchase.</p>${top.offer?`<p class="muted">You also entered a personal offer for this card: ${esc(top.offer.offer)}. Check the issuer terms for caps and eligibility.</p>`:''}</div>`;
        html += '<div class="purchase-list">' + results.map((x,i)=>`<div class="result-row"><strong>${i+1}. ${esc(x.name)}</strong> <span>${x.value==null?'No standard cash-back rate configured':x.pct+'% · '+money(x.value)+' back on this purchase'}</span>${x.offer?`<div class="muted">Personal offer: ${esc(x.offer.offer)}</div>`:''}</div>`).join('') + '</div>';
        html += '<p class="muted">Single-purchase estimate only. The amount is not annualized. Account-specific offers, rotating categories, points values and caps should be verified with the issuer.</p>';
        out.innerHTML = html;
      };

      window.quickPurchase = function(text,amount){
        document.getElementById('purchaseSearch').value = text;
        document.getElementById('purchaseAmount').value = amount;
        searchPurchase();
      };

      // Keep the secondary category calculator explicitly single-purchase too.
      window.calculate = function(){
        const amount = Number(document.getElementById('amount')?.value) || 0;
        const cat = document.getElementById('category')?.value || 'other';
        const out = document.getElementById('result');
        if (!out) return;
        if (amount <= 0) { out.innerHTML = '<div class="empty">Enter a purchase amount greater than $0.</div>'; return; }
        const vals = Object.entries(cards).map(([id,c])=>{ const pct=rateFor(id,cat); return {name:c.name,pct,value:pct==null?null:amount*pct/100}; }).sort((a,b)=>(b.value??-1)-(a.value??-1));
        out.innerHTML = `<p class="muted">Estimated reward on this single ${money(amount)} purchase.</p>` + vals.map((x,i)=>`<div class="result-row"><strong>${i+1}. ${esc(x.name)}</strong> — ${x.value==null?'No standard cash-back rate configured':x.pct+'% = '+money(x.value)+' back'}</div>`).join('');
      };
    })
    .catch(err => {
      console.error('Rhino Rewards dashboard failed to initialize:', err);
      const cards = document.getElementById('cards');
      if (cards) cards.innerHTML = '<div class="empty">Rhino Rewards could not load the dashboard data. Please refresh the page.</div>';
    });
})();
