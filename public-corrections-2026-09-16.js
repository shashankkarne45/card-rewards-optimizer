/* Rhino Rewards public-data corrections verified 2026-09-16.
   No personalized issuer offers or bank logins are used. */
(function () {
  const apply = () => {
    if (typeof cards === 'undefined' || typeof rateFor === 'undefined') return false;

    // Old Navy Encore: current Gap/Old Navy terms say 500 points = $1 reward.
    cards.oldnavy.rates = {oldnavy:5, apparel:3, other:1};
    cards.oldnavy.features = [
      '25 points/$1 at Old Navy / Gap family brands',
      '15 points/$1 at eligible outside apparel retailers',
      '5 points/$1 elsewhere on Mastercard',
      '500 points = $1 reward value',
      'Current public promotion: 30% off first purchase with a new Encore Credit Card; exclusions apply',
      'All-Access benefits include extended returns and early access, subject to Encore terms'
    ];

    // Bilt Blue: distinguish the current published multipliers instead of treating all non-category spend as 1X.
    cards.bilt.rates = {dining:4, travel:2, transit:3, other:1};
    cards.bilt.features = [
      'No annual fee',
      '$100 Bilt Cash sign-up bonus',
      'Up to 4X at Bilt partner restaurants',
      '3X on hotels through Bilt Travel',
      '3X on Lyft after linking Bilt and Lyft',
      '2X on flights through Bilt Travel',
      '1X on other everyday purchases',
      'Up to 1.25X on rent and mortgage through Bilt',
      'No transaction fee on housing payments through Bilt',
      'No foreign transaction fees',
      'Cellular Wireless Telephone Protection',
      '10% intro APR on new eligible purchases for 12 billing cycles',
      'Neighborhood Benefits'
    ];

    // Cash+ selected 5%/2% categories are account-selected, so never assume Electronics/Grocery selections.
    // Keep only the public base rate for generic purchase ranking; portal bonus is handled separately.
    cards.cashplus.rates = {other:1};

    // Discover Q4 categories were not found on a current official public page during this check.
    // Do not pre-load unverified future categories. Q3 2026 is the currently verified quarter.
    cards.discover.rates = {rotating5:5, other:1};

    const originalPublicRateFor = window.publicRateFor;
    window.publicRateFor = function(id, cat, q) {
      if (id === 'bilt') {
        const text = String(q || '').toLowerCase();
        if (text.includes('lyft') || text.includes('uber')) return 3;
        if (text.includes('hotel')) return 3;
        if (text.includes('flight') || text.includes('airline')) return 2;
        if (cat === 'dining') return 4;
        if (cat === 'transit') return 3;
        return 1;
      }
      return originalPublicRateFor ? originalPublicRateFor(id, cat, q) : rateFor(id, cat);
    };

    // Re-render the dashboard with the corrected public data.
    if (typeof renderCards === 'function') renderCards();
    if (typeof renderBenefits === 'function') renderBenefits();
    if (typeof renderComparison === 'function') renderComparison();
    if (typeof renderOffers === 'function') renderOffers();
    if (typeof window.searchPurchase === 'function') window.searchPurchase();
    return true;
  };

  if (!apply()) {
    let tries = 0;
    const timer = setInterval(() => {
      if (apply() || ++tries > 100) clearInterval(timer);
    }, 100);
  }
})();
