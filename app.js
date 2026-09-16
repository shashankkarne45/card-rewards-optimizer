const cards={
  freedom:{
    name:'Chase Freedom Unlimited®',short:'Freedom Unlimited',subtitle:'Chase',fee:0,network:'Visa',
    rates:{travel:5,dining:3,drugstore:3,other:1.5},
    conditions:['5% applies to travel purchased through Chase Travel.','3% applies to dining at restaurants, including takeout and eligible delivery services.','3% applies to drugstore purchases.','1.5% applies to other eligible purchases.'],
    features:[
      ['No annual fee','No annual fee.'],
      ['Cash back does not expire','Cash back rewards do not expire while the account remains open, subject to the rewards agreement.'],
      ['Flexible redemption','Redeem for cash back, gift cards, travel and other available Ultimate Rewards options.'],
      ['Chase Offers','Eligible cardmembers can receive targeted cash-back offers in the Chase app or on chase.com.'],
      ['DashPass','6 months complimentary DashPass when first activated during the current eligibility period; terms apply.'],
      ['Lyft','2% total cash back on qualifying Lyft purchases through Sept. 30, 2027, subject to terms.'],
      ['Credit Journey','Free credit score, score-improvement tools and identity monitoring through Chase Credit Journey.'],
      ['Digital wallet / instant use','Eligible new cardmembers can add the card to supported digital wallets for instant use.'],
      ['Pay Over Time','Eligible purchases may be eligible for Chase Pay Over Time; eligibility and terms vary.']
    ],
    protections:[
      ['Purchase Protection','Eligible new purchases covered for 120 days against damage or theft, up to $500 per item.'],
      ['Extended Warranty Protection','Eligible warranties of 3 years or less may be extended by 1 additional year, up to 4 years from purchase.'],
      ['Trip Cancellation / Interruption','Up to $1,500 per covered traveler and $6,000 per trip for covered prepaid, non-refundable passenger fares; restrictions apply.'],
      ['Zero Liability Protection','Protection from responsibility for unauthorized charges, subject to terms.']
    ],
    source:'Chase Freedom Unlimited public card page, checked Sept. 16, 2026.'
  },
  prime:{
    name:'Prime Visa',short:'Prime Visa',subtitle:'Amazon / Chase',fee:0,network:'Visa',
    rates:{amazon:5,travel:5,gas:2,dining:2,transit:2,other:1},
    conditions:['5% requires an eligible Prime membership and applies at Amazon.com, Audible.com, Whole Foods Market and on Chase Travel.','2% applies at gas stations, restaurants and local transit/commuting including rideshare.','1% applies to other eligible purchases.'],
    features:[
      ['No annual fee','No annual credit card fee.'],
      ['$150 Amazon Gift Card offer','Current public offer shown by Chase: eligible Prime members receive a $150 Amazon Gift Card on approval; offers can change.'],
      ['Prime Card Bonus','Eligible Prime cardmembers can earn 10% back or more on a rotating selection of Amazon items/categories through limited-time offers.'],
      ['Daily Amazon rewards','Rewards can be available for redemption as soon as the next day at Amazon.com, with no minimum rewards balance to redeem.'],
      ['Cash back / gift cards / travel','Rewards can also be redeemed for cash back, gift cards and travel through Chase.'],
      ['No foreign transaction fees','No foreign transaction fees for purchases outside the United States.'],
      ['Contactless','Tap-to-pay contactless functionality.'],
      ['Chase Offers','Eligible Chase customers may receive targeted offers in the Chase app or on chase.com.']
    ],
    protections:[
      ['Extended Warranty Protection','Eligible warranties of 3 years or less may be extended by 1 additional year, up to 4 years from purchase.'],
      ['Purchase Protection','Eligible new purchases covered for 120 days against damage or theft, up to $500 per item.'],
      ['Baggage Delay Insurance','Up to $100 per day for up to 3 days for eligible essential purchases when baggage is delayed over 6 hours.'],
      ['Travel Accident Insurance','Up to $500,000 of accidental death or dismemberment coverage when eligible transportation is paid with the card.'],
      ['Lost Luggage Reimbursement','Up to $3,000 per covered traveler for covered lost, damaged or stolen baggage.'],
      ['Auto Rental Coverage','Coverage for theft and collision damage on most rental vehicles; U.S. coverage is secondary to personal auto insurance.'],
      ['Roadside Assistance','Roadside assistance dispatch is available; service fees are billed to the card.'],
      ['Travel & Emergency Assistance','Access to travel/legal/medical referral assistance; costs of goods or services are the cardmember’s responsibility.'],
      ['Zero Liability Protection','Protection from responsibility for unauthorized charges, subject to terms.']
    ],
    source:'Chase Prime Visa public card page, checked Sept. 16, 2026.'
  }
};

const spendFields=[['amazon','Amazon / Whole Foods / Audible'],['travel','Chase Travel'],['dining','Dining'],['gas','Gas'],['drugstore','Drugstore'],['transit','Transit'],['other','Everything else']];

function money(n){return '$'+Number(n||0).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}
function label(k){return ({amazon:'Amazon / Whole Foods / Audible',travel:'Chase Travel',dining:'Dining',drugstore:'Drugstore',gas:'Gas',transit:'Transit',other:'Everything else'})[k]||k}
function renderCards(){document.getElementById('cards').innerHTML=Object.entries(cards).map(([id,c])=>`<article class="panel" onclick="openCardModal('${id}')"><div class="card-top"><div><h3>${c.name}</h3><div class="muted">${c.subtitle} · ${c.network}</div></div><span class="card-chip">View details →</span></div><div class="rates">${Object.entries(c.rates).map(([k,v])=>`<div class="rate"><b>${v}%</b>${label(k)}</div>`).join('')}</div><p class="muted">${c.features.length+c.protections.length} tracked features & protections · $${c.fee} annual fee</p></article>`).join('')}
function renderBenefits(){document.getElementById('benefits').innerHTML=Object.entries(cards).flatMap(([id,c])=>c.protections.map(([t,d])=>`<article class="benefit"><div class="type">${c.short}</div><h3>${t}</h3><div class="muted">${d}</div></article>`)).join('')}
function getOffers(){try{return JSON.parse(localStorage.getItem('cro_offers')||'[]')}catch{return []}}
function offerActive(o){if(!o.expires)return true;return new Date(o.expires+'T23:59:59')>=new Date()}
function renderOffers(){const q=(document.getElementById('search').value||'').toLowerCase();const all=getOffers().filter(o=>(o.merchant+' '+cards[o.card].name+' '+o.offer).toLowerCase().includes(q));const active=all.filter(offerActive),expired=all.filter(o=>!offerActive(o));document.getElementById('offerCount').textContent=active.length;let html=active.map(o=>offerHtml(o,false)).join('');if(expired.length)html+=`<div style="grid-column:1/-1;margin-top:10px"><h3>Expired</h3></div>`+expired.map(o=>offerHtml(o,true)).join('');document.getElementById('offers').innerHTML=html||`<div class="empty">No personal offers yet. Add an offer you see in your card account.</div>`}
function offerHtml(o,isExpired){return `<article class="offer ${isExpired?'expired':''}"><span class="offer-status ${isExpired?'expired-tag':'active'}">${isExpired?'Expired':'Active'}</span><span class="tag">${cards[o.card].name}</span><h3>${escapeHtml(o.merchant)}</h3><div>${escapeHtml(o.offer)}</div>${o.expires?`<p class="muted">Expires ${o.expires}</p>`:''}</article>`}
function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function openOfferModal(){document.getElementById('modal').classList.remove('hidden')};function closeOfferModal(){document.getElementById('modal').classList.add('hidden')}
function saveOffer(){const merchant=document.getElementById('merchant').value.trim(),offer=document.getElementById('offerText').value.trim(),card=document.getElementById('offerCard').value,expires=document.getElementById('expires').value;if(!merchant||!offer)return alert('Please enter a merchant and offer.');const list=getOffers();list.unshift({merchant,offer,card,expires});localStorage.setItem('cro_offers',JSON.stringify(list));document.getElementById('merchant').value='';document.getElementById('offerText').value='';document.getElementById('expires').value='';closeOfferModal();renderOffers();searchPurchase();}
function findMatchingOffer(card,category,purchaseText=''){const terms={amazon:['amazon','whole foods','audible'],travel:['travel','hotel','flight','airline','rental car'],dining:['dining','restaurant','dinner','lunch','doordash','grubhub','seamless'],gas:['gas','fuel','shell','chevron','exxon','bp'],drugstore:['drug','cvs','walgreens','rite aid'],transit:['transit','uber','lyft','taxi','commute'],other:[]}[category]||[];const text=String(purchaseText||'').toLowerCase();const offers=getOffers().filter(o=>o.card===card&&offerActive(o));return offers.find(o=>{const offerText=(o.merchant+' '+o.offer).toLowerCase();return (text&&offerText.split(/\s+/).some(word=>word.length>3&&text.includes(word)))||terms.some(t=>offerText.includes(t))})}
function rateFor(card,cat){return cards[card].rates[cat]??cards[card].rates.other}
function calculate(){const amount=Number(document.getElementById('amount').value)||0,cat=document.getElementById('category').value;const vals=Object.entries(cards).map(([id,c])=>{const pct=rateFor(id,cat),offer=findMatchingOffer(id,cat);return {id,name:c.name,pct,value:amount*pct/100,offer}});document.getElementById('result').innerHTML=vals.map(x=>`<div class="result-row"><strong>${x.name}</strong> — ${x.pct}% = ${money(x.value)} on this purchase ${x.offer?`<span class="muted">· matching personal offer: ${escapeHtml(x.offer.offer)}</span>`:''}</div>`).join('')}
function renderComparison(){const cats=['amazon','travel','dining','gas','drugstore','transit','other'];let html='<table class="compare-table"><thead><tr><th>Category / feature</th><th>Chase Freedom Unlimited</th><th>Prime Visa</th></tr></thead><tbody>';cats.forEach(k=>html+=`<tr><td>${label(k)}</td><td><strong>${cards.freedom.rates[k]??cards.freedom.rates.other}%</strong></td><td><strong>${cards.prime.rates[k]??cards.prime.rates.other}%</strong></td></tr>`);html+=`<tr><td>Annual fee</td><td>$0</td><td>$0</td></tr><tr><td>Foreign transaction fee</td><td>Check current card pricing/terms</td><td>$0</td></tr><tr><td>Tracked features</td><td>${cards.freedom.features.length}</td><td>${cards.prime.features.length}</td></tr><tr><td>Tracked protections</td><td>${cards.freedom.protections.length}</td><td>${cards.prime.protections.length}</td></tr></tbody></table>`;document.getElementById('comparison').innerHTML=html}
function openCompareModal(){document.getElementById('fullComparison').innerHTML=document.getElementById('comparison').innerHTML;document.getElementById('compareModal').classList.remove('hidden')};function closeCompareModal(){document.getElementById('compareModal').classList.add('hidden')}
function openCardModal(id){const c=cards[id];document.getElementById('cardDetails').innerHTML=`<div class="detail-hero"><div><div class="type">${c.subtitle}</div><h2>${c.name}</h2><div class="muted">${c.network} · $${c.fee} annual fee</div></div><button class="secondary" onclick="closeCardModal()">Close</button></div><div class="detail-section"><h3>Reward rates</h3><div class="detail-grid">${Object.entries(c.rates).map(([k,v])=>`<div class="detail-item"><b>${v}% back</b><span class="muted">${label(k)}</span></div>`).join('')}</div></div><div class="detail-section"><h3>Reward conditions</h3><ul class="detail-list">${c.conditions.map(x=>`<li>${x}</li>`).join('')}</ul></div><div class="detail-section"><h3>Features</h3><div class="detail-grid">${c.features.map(([t,d])=>`<div class="detail-item"><b>${t}</b><span class="muted">${d}</span></div>`).join('')}</div></div><div class="detail-section"><h3>Travel & purchase protections</h3><div class="detail-grid">${c.protections.map(([t,d])=>`<div class="detail-item"><b>${t}</b><span class="muted">${d}</span></div>`).join('')}</div></div><div class="source-note">${c.source} Benefits have eligibility requirements, limitations and exclusions. Your account's Guide to Benefits and current pricing/terms control.</div>`;document.getElementById('cardModal').classList.remove('hidden')}
function closeCardModal(){document.getElementById('cardModal').classList.add('hidden')}
function renderSpendInputs(){document.getElementById('spendInputs').innerHTML=spendFields.map(([k,t])=>`<label>${t}<input class="spend-input" data-cat="${k}" type="number" min="0" value="0"></label>`).join('')}
function evaluateSpending(){const spend=Object.fromEntries([...document.querySelectorAll('.spend-input')].map(x=>[x.dataset.cat,Number(x.value)||0]));const results=Object.entries(cards).map(([id,c])=>{let annual=0;const breakdown=[];Object.entries(spend).forEach(([cat,monthly])=>{const yearly=monthly*12;const reward=yearly*rateFor(id,cat)/100;annual+=reward;if(yearly)breakdown.push([cat,reward])});return {id,name:c.name,annual,breakdown}});const max=Math.max(...results.map(x=>x.annual),0);document.getElementById('profileValue').textContent=money(max);document.getElementById('evaluation').innerHTML=`<p class="muted">Estimated annual rewards from the rates configured above. This excludes taxes, exclusions, limited-time offers, points-transfer value and personal offers unless separately entered.</p><div class="eval-grid">${results.map(x=>`<div class="eval-card"><b>${x.name}</b><div class="eval-value">${money(x.annual)}</div><div class="bar"><i style="width:${max?Math.max(3,x.annual/max*100):0}%"></i></div><p class="muted">${x.breakdown.map(([k,v])=>`${label(k)}: ${money(v)}`).join(' · ')||'Enter monthly spending above.'}</p></div>`).join('')}</div>`}
function resetSpending(){document.querySelectorAll('.spend-input').forEach(x=>x.value=0);document.getElementById('profileValue').textContent='$0';document.getElementById('evaluation').innerHTML=''}

const purchaseCategories={
  amazon:['amazon','whole foods','audible','prime order','amazon order'],
  travel:['chase travel','hotel','hotels','flight','flights','airline','airfare','travel','rental car','car rental'],
  dining:['restaurant','restaurants','dinner','lunch','breakfast','food delivery','doordash','grubhub','seamless','eat out','cafe','coffee shop','bar'],
  gas:['gas','gasoline','fuel','shell','chevron','exxon','mobil','bp','speedway','casey','gas station'],
  drugstore:['drugstore','pharmacy','cvs','walgreens','rite aid','prescription','medicine'],
  transit:['uber','lyft','taxi','transit','bus','subway','metro','commute','rideshare'],
  other:[]
};
function detectPurchaseCategory(text){const q=String(text||'').toLowerCase().trim();if(!q)return {category:'other',matched:'Everything else'};let best='other',bestScore=0;Object.entries(purchaseCategories).forEach(([cat,terms])=>{const score=terms.reduce((n,t)=>n+(q.includes(t)?(t.length>=6?2:1):0),0);if(score>bestScore){best=cat;bestScore=score}});return {category:best,matched:label(best),confidence:bestScore?bestScore>2?'Strong match':'Likely match':'General purchase'};}
function searchPurchase(){const input=document.getElementById('purchaseSearch');const out=document.getElementById('purchaseResult');if(!input||!out)return;const text=input.value.trim();const amount=Number(document.getElementById('purchaseAmount').value)||0;if(!text){out.innerHTML='<div class="empty">Search for a purchase above to see the card comparison.</div>';return}const detected=detectPurchaseCategory(text);const vals=Object.entries(cards).map(([id,c])=>{const basePct=rateFor(id,detected.category);const offer=findMatchingOffer(id,detected.category,text);const offerBonus=parseOfferBonus(offer&&offer.offer);const effectivePct=basePct+offerBonus;return {id,name:c.name,basePct,offer,offerBonus,effectivePct,value:amount*effectivePct/100}});const max=Math.max(...vals.map(x=>x.effectivePct));const top=vals.filter(x=>x.effectivePct===max);const primary=top[0];out.innerHTML=`<div class="purchase-summary"><div><span class="eyebrow">PURCHASE MATCH</span><h3>${escapeHtml(text)}</h3><p>Detected category: <strong>${detected.matched}</strong> <span class="muted">· ${detected.confidence}</span></p></div><div class="purchase-pick"><span>Based on configured rates</span><strong>${escapeHtml(primary.name)}</strong><b>${primary.effectivePct}% estimated reward</b><small>${money(amount*primary.effectivePct/100)} on ${money(amount)}</small></div></div><div class="purchase-results">${vals.map(x=>`<div class="purchase-card ${x.effectivePct===max?'top-match':''}"><div><strong>${escapeHtml(x.name)}</strong><div class="muted">Base rate: ${x.basePct}%${x.offer?` · Personal offer: ${escapeHtml(x.offer.offer)}${x.offerBonus?` · estimated offer bonus +${x.offerBonus}%`:''}`:''}</div></div><div class="purchase-value"><b>${x.effectivePct}%</b><span>${money(x.value)}</span></div></div>`).join('')}</div><p class="purchase-note">This suggestion uses the reward rates configured in Rhino Rewards and any matching personal offer you entered. Merchant coding and offer terms can change the actual reward. For Prime Visa, Amazon/Whole Foods/Chase Travel 5% requires an eligible Prime membership.</p>`}
function parseOfferBonus(offerText){const s=String(offerText||'').toLowerCase();const m=s.match(/(\d+(?:\.\d+)?)\s*%/);if(!m)return 0;const n=Number(m[1]);return Number.isFinite(n)?n:0}
function quickPurchase(text,amount){document.getElementById('purchaseSearch').value=text;document.getElementById('purchaseAmount').value=amount;searchPurchase();document.getElementById('purchaseResult').scrollIntoView({behavior:'smooth',block:'nearest'})}
renderCards();renderBenefits();renderOffers();renderComparison();renderSpendInputs();calculate();
