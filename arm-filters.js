// Filtres bras : Biceps / Triceps, avec ciblage fiable à partir des muscles du catalogue RepDB.
(function () {
  const categories = document.querySelector('.categories');
  const grid = document.querySelector('#exercise-grid');
  if (!categories || !grid) return;

  let selectedArm = null;
  let muscleById = new Map();
  let ready = false;

  async function loadMuscles() {
    try {
      const res = await fetch('https://exercise-dataset.com/exercises.json');
      const data = await res.json();
      (Array.isArray(data) ? data : data.exercises || []).forEach(e => {
        const id = String(e.id ?? '');
        const muscles = (e.muscles || []).map(m => String(m).toLowerCase());
        if (id) muscleById.set(id, muscles);
      });
    } catch (_) {}
    ready = true;
    applyArmFilter();
  }

  function applyArmFilter() {
    requestAnimationFrame(() => {
      const cards = [...grid.querySelectorAll('.card')];
      cards.forEach(card => {
        const id = String(card.dataset.id || '');
        const muscles = muscleById.get(id) || [];
        const visible = !selectedArm || (ready && muscles.some(m => m === selectedArm || m.includes(selectedArm)));
        card.dataset.armHidden = visible ? '0' : '1';
        if (!visible) card.style.display = 'none';
      });
      const visible = cards.filter(c => c.style.display !== 'none').length;
      const count = document.querySelector('#count');
      if (count) count.textContent = `${visible} exercice${visible > 1 ? 's' : ''}`;
      const empty = document.querySelector('#empty');
      if (empty) empty.hidden = visible !== 0;
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
      b.onclick = event => {
        event.preventDefault();
        event.stopPropagation();
        selectedArm = selectedArm === muscle ? null : muscle;
        categories.querySelectorAll('.hs-arm-filter').forEach(x => x.classList.toggle('active', x.dataset.arm === selectedArm));
        old.click();
        setTimeout(applyArmFilter, 20);
      };
      return b;
    };
    old.after(makeButton('Biceps', 'biceps'), makeButton('Triceps', 'triceps'));
  }

  const observer = new MutationObserver(() => {
    installArmButtons();
    if (selectedArm) applyArmFilter();
  });
  observer.observe(categories, { childList: true, subtree: true });
  observer.observe(grid, { childList: true, subtree: true });

  categories.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || button.classList.contains('hs-arm-filter')) return;
    selectedArm = null;
    categories.querySelectorAll('.hs-arm-filter').forEach(x => x.classList.remove('active'));
    grid.querySelectorAll('.card').forEach(c => c.dataset.armHidden = '0');
  }, true);

  installArmButtons();
  loadMuscles();
})();