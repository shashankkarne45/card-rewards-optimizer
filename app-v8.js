(() => {
  fetch('app-v7.js?v=7', {cache:'no-store'})
    .then(r => { if (!r.ok) throw new Error('Dashboard script unavailable: '+r.status); return r.text(); })
    .then(source => {
      const fixed = source.replace("    ];\nconst spendFields", "const spendFields");
      (0,eval)(fixed);
    })
    .catch(err => {
      console.error('Rhino Rewards dashboard failed to initialize:', err);
      const cards = document.getElementById('cards');
      if (cards) cards.innerHTML = '<div class="empty">Rhino Rewards could not load the dashboard data. Please refresh the page.</div>';
    });
})();
