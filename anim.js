// Visual-only helpers. Does not touch your data logic in script.js.
(() => {
  const stagger = () => document.querySelectorAll('.sensorBox, .card').forEach((el, i) => el.style.setProperty('--i', i % 24));
  stagger();

  const btns = document.querySelectorAll('.menuBtn');
  const side = document.getElementById('sideBar');
  const setActive = b => btns.forEach(x => x.classList.toggle('active', x === b));
  setActive(document.getElementById('dBtn'));

  btns.forEach(b => b.addEventListener('click', () => {
    setActive(b);
    setTimeout(stagger, 0);
    if (window.innerWidth <= 900 && side) side.style.display = 'none';
  }));

  // close the mobile menu when tapping outside it
  document.addEventListener('click', e => {
    if (window.innerWidth > 900 || !side) return;
    if (!side.contains(e.target) && !e.target.closest('#menus')) side.style.display = 'none';
  });
})();
