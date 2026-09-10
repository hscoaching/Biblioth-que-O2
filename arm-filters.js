// Remplace le filtre unique « Bras » par deux filtres : Biceps et Triceps.
// Le filtre natif « bras » reste utilisé en interne ; on affine ensuite les cartes affichées.
(function () {
  const categories = document.querySelector('.categories');
  const grid = document.querySelector('#exercise-grid');
  if (!categories || !grid) return;

  let selectedArm = null;
  let applying = false;

  function applyArmFilter() {
    if (applying) return;
    applying = true;
    requestAnimationFrame(() => {
      const cards = grid.querySelectorAll('.card');
      cards.forEach(card => {
        if (!selectedArm) {
          card.style.display = '';
          return;
        }
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(selectedArm) ? '' : 'none';
      });
      const visible = [...cards].filter(c => c.style.display !== 'none').length;
      const count = document.querySelector('#count');
      if (count && selectedArm) count.textContent = `${visible} exercice${visible > 1 ? 's' : ''}`;
      applying = false;
    });
  }

  function installArmButtons() {
    const old = categories.querySelector('[data-category="bras"]');
    if (!old || categories.querySelector('.hs-arm-filter')) return;

    old.style.display = 'none';

    const makeButton = (label, muscle) => {
      const b = document.createElement('button');
      b.className = 'chip hs-arm-filter';
      b.type = 'button';
      b.textContent = label;
      b.dataset.arm = muscle;
      b.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        selectedArm = selectedArm === muscle ? null : muscle;
        old.click();
        requestAnimationFrame(() => {
          categories.querySelectorAll('.hs-arm-filter').forEach(x =>
            x.classList.toggle('active', x.dataset.arm === selectedArm)
          );
          applyArmFilter();
        });
      };
      return b;
    };

    old.after(makeButton('Biceps', 'biceps'), makeButton('Triceps', 'triceps'));
  }

  const observer = new MutationObserver(() => {
    installArmButtons();
    applyArmFilter();
  });

  observer.observe(categories, { childList: true, subtree: true });
  observer.observe(grid, { childList: true, subtree: true });

  categories.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button || button.classList.contains('hs-arm-filter')) return;
    selectedArm = null;
  }, true);

  installArmButtons();
})();
