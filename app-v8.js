(() => {
  fetch('app-v7.js?v=8', {cache:'no-store'})
    .then(r => { if (!r.ok) throw new Error('Dashboard script unavailable: '+r.status); return r.text(); })
    .then(source => {
      const fixed = source.replace("\n];\nconst spendFields", "\nconst spendFields");
      (0,eval)(fixed);

      // Verified public issuer data checked 2026-09-16. No personalized issuer offers are accessed.
      cards.freedom.features = ['No annual fee','5% Chase Travel','3% dining','3% drugstores','Chase Offers','Purchase protection','Extended warranty','Trip cancellation/interruption','$200 bonus after $500 in 3 months for eligible new accounts','0% intro APR for 15 months','6 months complimentary DashPass when first activated by Dec. 31, 2027','2% total cash back on qualifying Lyft purchases through Sept. 30, 2027'];
      cards.prime.features = ['No annual fee','$150 Amazon Gift Card on approval for eligible Prime applicants','5% Amazon / Whole Foods / Audible with Prime','5% Chase Travel with Prime','2% gas','2% restaurants','2% local transit / rideshare','Chase Offers','No foreign transaction fees','Purchase protection','Extended warranty'];
      cards.amazonstore.features = ['No annual fee','Amazon Gift Card upon approval; public amount can vary','0% equal-monthly-payment financing on qualifying Amazon purchases','6 months on $50-$599.99','12 months on $600+','24 months on select purchases','Eligible Prime Store Card members can choose 5% back at Amazon.com / Whole Foods instead of financing','Financing and % back cannot be combined'];
      cards.smartly.features = ['No annual fee','2% cash back on eligible purchases','2.5% / 3% / 4% with qualifying Smartly balances on the first $10,000 per billing cycle','0% intro APR for 12 billing cycles','Cash-back Deals','ExtendPay','Additional 4 points/$1 on qualifying prepaid hotel and car reservations through the U.S. Bank Travel Center'];
      cards.cashplus.features = ['No annual fee','$200 bonus after $1,000 in eligible purchases within 90 days for eligible new accounts','Choose two 5% quarterly categories up to $2,000 combined','Choose one 2% everyday category','1% other eligible purchases','5% total on eligible prepaid air, hotel and car reservations through U.S. Bank Travel Center','Cash-back Deals','0% intro APR for 15 billing cycles','ExtendPay'];
      cards.quicksilver.features = ['No annual fee','1.5% cash back on every purchase','5% eligible Capital One Travel hotel / vacation rental / rental car / activity bookings','5% eligible Capital One Entertainment','Capital One Offers','CreditWise','$200 cash bonus after $500 within 3 months for eligible new accounts','0% intro APR for 15 months'];
      cards.platinum.rates = {};
      cards.platinum.features = ['$0 annual fee','No standard purchase rewards','Designed for building credit','No foreign transaction fees','Automatic credit-line review eligibility','CreditWise','Card Lock','Virtual card numbers','$0 fraud liability','Capital One mobile app / Eno'];
      cards.discover.features = ['No annual fee','5% rotating categories after activation up to $1,500 combined quarterly spend','Current Q3 2026: Gas Stations, Transportation and Drug Stores through Sept. 30','1% other purchases','Unlimited Cashback Match for eligible new cardmembers','$0 fraud liability','Card lock'];
      cards.robinhoodgold.rates = {travel:5,other:3};
      cards.robinhoodgold.features = ['3% cash back on eligible purchases','5% cash back on eligible travel through Robinhood Travel','Gold membership required','No separate card annual fee; annual Robinhood Gold subscription required','Cash redemption options','Virtual cards','Visa Signature-style travel and purchase protections subject to terms'];
      cards.oldnavy.rates = {oldnavy:5,apparel:3,other:1};
      cards.oldnavy.features = ['25 points/$1 at Old Navy / Gap family brands','15 points/$1 at eligible outside apparel retailers','5 points/$1 elsewhere on Mastercard','100 points = $1 reward value under published terms','30% first-purchase discount for eligible new cardmembers; code expires 14 days after account opening','Free shipping / birthday / early access / extended-return benefits subject to Encore terms'];
      cards.bilt.rates = {other:1};
      cards.bilt.features = ['No annual fee','$100 Bilt Cash sign-up bonus','Up to 4X at Bilt partner restaurants','Up to 3X on hotels through Bilt Travel','3X on Lyft after linking Bilt and Lyft','2X on flights through Bilt Travel','1X other everyday purchases','Up to 1.25X on rent and mortgage through Bilt','No transaction fee on housing payments through Bilt','No foreign transaction fees','Cellular Wireless Telephone Protection','10% intro APR for 12 billing cycles','Neighborhood Benefits'];
      cards.dcu.rates = {other:1};
      cards.dcu.features = ['1% cash back / 1 point per $1 on qualifying purchases','No annual fee','No balance transfer fee','No foreign transaction fee','No cash advance fee','Merchant-funded offers','Visa Signature Luxury Hotel Collection','24/7 Visa Signature Concierge','Travel coverage / emergency assistance','Zero Liability protection','24/7 roadside assistance','Emergency cash','Tap to Pay'];

      function publicRateFor(id,cat,q){
        const now=new Date();
        // Discover rotating categories are date-sensitive and must be activated.
        if(id==='discover'){
          const y=now.getFullYear(),m=now.getMonth()+1,d=now.getDate();
          if(y===2026 && m>=7 && m<=9 && ['gas','transit','drugstore'].includes(cat)) return 5;
          if(y===2026 && (m===10 || m===11 || m===12) && ['dining','entertainment'].includes(cat)) return 5;
          if(y===2026 && (m===10 || m===11 || m===12) && cat==='utilities') return 5;
        }
        // These Travel Center bonuses are explicitly tied to the portal, not generic travel merchants.
        if(id==='cashplus' && /travel center|travelcenter/i.test(q||'')) return 5;
        if(id==='smartly' && /travel center|travelcenter/i.test(q||'')) return 6;
        return rateFor(id,cat);
      }

      window.searchPurchase = function(){
        const q=(document.getElementById('purchaseSearch')?.value||'').trim();
        const amount=Number(document.getElementById('purchaseAmount')?.value)||0;
        const out=document.getElementById('purchaseResult');
        if(!out)return;
        if(!q||amount<=0){out.innerHTML='<div class="empty">Enter what you are buying and the exact purchase amount to see the reward for this single purchase.</div>';return;}
        const rule=detectCategory(q);
        const results=Object.entries(cards).map(([id,c])=>{const pct=publicRateFor(id,rule.cat,q);let offer=null;try{offer=matchingOffer(id,q)}catch(e){}return{id,name:c.name,pct,value:pct==null?null:amount*pct/100,offer}}).sort((a,b)=>(b.value??-1)-(a.value??-1));
        const top=results.find(x=>x.value!=null);
        let html=`<div class="purchase-summary"><div><div class="type">SINGLE PURCHASE</div><h3>${esc(rule.label)}</h3><p class="muted">${esc(q)} · Purchase amount ${money(amount)}</p></div>${top?`<div class="purchase-pick"><span>Recommended for this purchase</span><strong>${esc(top.name)}</strong><b>${money(top.value)} back</b><small>${top.pct}% estimated reward on ${money(amount)}</small></div>`:''}</div>`;
        html+='<div class="purchase-results">'+results.map((x,i)=>`<div class="purchase-card ${i===0&&x.value!=null?'top-match':''}"><div><strong>${i+1}. ${esc(x.name)}</strong>${x.offer?`<div class="muted">Personal offer: ${esc(x.offer.offer)}</div>`:''}</div><div class="purchase-value">${x.value==null?'<span>No standard reward</span>':`<b>${money(x.value)}</b><span>${x.pct}% estimated reward on this purchase</span>`}</div></div>`).join('')+'</div>';
        html+='<p class="purchase-note">Single-purchase estimate only. The amount is not annualized. Rotating categories require activation; U.S. Bank selected categories and account-specific offers must be verified in the issuer account.</p>';
        out.innerHTML=html;
      };

      window.quickPurchase=function(text,amount){document.getElementById('purchaseSearch').value=text;document.getElementById('purchaseAmount').value=amount;window.searchPurchase()};
      window.calculate=function(){const amount=Number(document.getElementById('amount')?.value)||0,cat=document.getElementById('category')?.value||'other',out=document.getElementById('result');if(!out)return;if(amount<=0){out.innerHTML='<div class="empty">Enter a purchase amount greater than $0.</div>';return}const vals=Object.entries(cards).map(([id,c])=>{const pct=publicRateFor(id,cat,'');return{name:c.name,pct,value:pct==null?null:amount*pct/100}}).sort((a,b)=>(b.value??-1)-(a.value??-1));out.innerHTML=`<p class="muted">Estimated reward on this single ${money(amount)} purchase.</p>`+vals.map((x,i)=>`<div class="result-row"><strong>${i+1}. ${esc(x.name)}</strong> — ${x.value==null?'No standard cash-back rate configured':x.pct+'% = '+money(x.value)+' back'}</div>`).join('')};

      // Add the audit trail from public-updates.json to card details without exposing account data.
      const originalOpenCardModal=window.openCardModal;
      window.openCardModal=function(id){
        originalOpenCardModal(id);
        const box=document.getElementById('cardDetails');
        fetch('public-updates.json?v=20260916',{cache:'no-store'}).then(r=>r.json()).then(log=>{
          const item=log.cards?.[id];
          if(!item||!box)return;
          const notes=(item.updates||[]).map(x=>`<li>${esc(x)}</li>`).join('');
          const sources=(item.sourceNotes||[]).map(s=>`<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.source)}</a> — checked ${esc(s.checked)}</li>`).join('');
          box.insertAdjacentHTML('beforeend',`<div class="detail-section"><h3>Verified public update log</h3><ul>${notes}</ul><h4>Sources / date checked</h4><ul>${sources}</ul><div class="source-note">Public-source snapshot only. Account-specific offers are not retrieved or stored by Rhino Rewards.</div></div>`);
        }).catch(()=>{});
      };

      renderCards();renderBenefits();renderComparison();renderOffers();
      window.searchPurchase();
    })
    .catch(err=>{console.error('Rhino Rewards dashboard failed to initialize:',err);const el=document.getElementById('cards');if(el)el.innerHTML='<div class="empty">Rhino Rewards could not load the dashboard data. Please refresh the page.</div>'});
})();
