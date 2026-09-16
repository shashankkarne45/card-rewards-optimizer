(() => {
  fetch('app-v7.js?v=8', {cache:'no-store'})
    .then(r => { if (!r.ok) throw new Error('Dashboard script unavailable: '+r.status); return r.text(); })
    .then(source => {
      const fixed = source.replace("\n];\nconst spendFields", "\nconst spendFields");
      (0,eval)(fixed);

      // Current verified public data updates for the two cards requested.
      cards.platinum.rates = {};
      cards.platinum.features = ['$0 annual fee','No standard purchase rewards','Designed for building credit','No foreign transaction fees','Automatic credit-line review eligibility','CreditWise','Card Lock','Virtual card numbers','$0 fraud liability','Capital One mobile app / Eno'];
      cards.dcu.rates = {other:1};
      cards.dcu.features = ['1% cash back / 1 point per $1 on qualifying purchases','No annual fee','No balance transfer fee','No foreign transaction fee','No cash advance fee','Merchant-funded offers','Visa Signature Luxury Hotel Collection','24/7 Visa Signature Concierge','Travel coverage / emergency assistance','Zero Liability protection','24/7 roadside assistance','Emergency cash','Tap to Pay'];

      window.searchPurchase = function(){
        const q=(document.getElementById('purchaseSearch')?.value||'').trim();
        const amount=Number(document.getElementById('purchaseAmount')?.value)||0;
        const out=document.getElementById('purchaseResult');
        if(!out)return;
        if(!q||amount<=0){out.innerHTML='<div class="empty">Enter what you are buying and the exact purchase amount to see the reward for this single purchase.</div>';return;}
        const rule=detectCategory(q);
        const results=Object.entries(cards).map(([id,c])=>{const pct=rateFor(id,rule.cat);let offer=null;try{offer=matchingOffer(id,q)}catch(e){}return{id,name:c.name,pct,value:pct==null?null:amount*pct/100,offer}}).sort((a,b)=>(b.value??-1)-(a.value??-1));
        const top=results.find(x=>x.value!=null);
        let html=`<div class="purchase-summary"><div><div class="type">SINGLE PURCHASE</div><h3>${esc(rule.label)}</h3><p class="muted">${esc(q)} · Purchase amount ${money(amount)}</p></div>${top?`<div class="purchase-pick"><span>Recommended for this purchase</span><strong>${esc(top.name)}</strong><b>${money(top.value)} back</b><small>${top.pct}% estimated reward on ${money(amount)}</small></div>`:''}</div>`;
        html+='<div class="purchase-results">'+results.map((x,i)=>`<div class="purchase-card ${i===0&&x.value!=null?'top-match':''}"><div><strong>${i+1}. ${esc(x.name)}</strong>${x.offer?`<div class="muted">Personal offer: ${esc(x.offer.offer)}</div>`:''}</div><div class="purchase-value">${x.value==null?'<span>No standard reward</span>':`<b>${money(x.value)}</b><span>${x.pct}% back on this purchase</span>`}</div></div>`).join('')+'</div>';
        html+='<p class="purchase-note">Single-purchase estimate only. The amount is not annualized. Account-specific offers, rotating categories, points values and caps should be verified with the issuer.</p>';
        out.innerHTML=html;
      };

      window.quickPurchase=function(text,amount){document.getElementById('purchaseSearch').value=text;document.getElementById('purchaseAmount').value=amount;window.searchPurchase()};
      window.calculate=function(){const amount=Number(document.getElementById('amount')?.value)||0,cat=document.getElementById('category')?.value||'other',out=document.getElementById('result');if(!out)return;if(amount<=0){out.innerHTML='<div class="empty">Enter a purchase amount greater than $0.</div>';return}const vals=Object.entries(cards).map(([id,c])=>{const pct=rateFor(id,cat);return{name:c.name,pct,value:pct==null?null:amount*pct/100}}).sort((a,b)=>(b.value??-1)-(a.value??-1));out.innerHTML=`<p class="muted">Estimated reward on this single ${money(amount)} purchase.</p>`+vals.map((x,i)=>`<div class="result-row"><strong>${i+1}. ${esc(x.name)}</strong> — ${x.value==null?'No standard cash-back rate configured':x.pct+'% = '+money(x.value)+' back'}</div>`).join('')};

      // Re-render after the public-data overrides above.
      renderCards();renderBenefits();renderComparison();renderOffers();
      window.searchPurchase();
    })
    .catch(err=>{console.error('Rhino Rewards dashboard failed to initialize:',err);const el=document.getElementById('cards');if(el)el.innerHTML='<div class="empty">Rhino Rewards could not load the dashboard data. Please refresh the page.</div>'});
})();
