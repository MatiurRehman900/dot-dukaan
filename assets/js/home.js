document.addEventListener('DOMContentLoaded', function () {
  const buttons = document.querySelectorAll('.featured-btns .category-btn');
  const panels = document.querySelectorAll('.category-panel');

  let clickedActiveBtn = null;
  let hoverTimeout = null;

  function clearHoverTimeout() {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      hoverTimeout = null;
    }
  }

  function showOnlyPanel(cat) {
    panels.forEach(p => {
      p.style.display = (p.getAttribute('data-cat') === cat) ? 'block' : 'none';
    });
  }

  function hideAllPanels() {
    panels.forEach(p => p.style.display = 'none');
  }

  // When a category button is clicked — make it the persistent active selection
  buttons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      // prevent document click handler from immediately closing
      e.stopPropagation();
      clearHoverTimeout();
      const cat = btn.getAttribute('data-cat');
      // if clicking the already-active (persisted) button -> toggle it off
      if (clickedActiveBtn === btn) {
        clickedActiveBtn = null;
        buttons.forEach(b => b.classList.remove('active'));
        hideAllPanels();
        return;
      }
      // mark clicked active
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      clickedActiveBtn = btn;
      showOnlyPanel(cat);
      // smooth scroll into view for small screens
      const panel = document.querySelector('.category-panel[data-cat="' + cat + '"]');
      panel && panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // Hover behavior: show panel on mouseenter and keep it visible while hovering
    btn.addEventListener('mouseenter', function () {
      clearHoverTimeout();
      const cat = btn.getAttribute('data-cat');
      // show hovered panel (temporary)
      showOnlyPanel(cat);
      // visually indicate hovered button (reuse active class temporarily)
      btn.classList.add('active');
    });

    btn.addEventListener('mouseleave', function () {
      // small delay to allow entering panel without flicker
      clearHoverTimeout();
      hoverTimeout = setTimeout(() => {
        if (clickedActiveBtn) {
          // restore clicked selection
          const cat = clickedActiveBtn.getAttribute('data-cat');
          showOnlyPanel(cat);
          buttons.forEach(b => b.classList.toggle('active', b === clickedActiveBtn));
        } else {
          hideAllPanels();
          buttons.forEach(b => b.classList.remove('active'));
        }
      }, 120);
    });
  });

  // Keep panel visible while hovering over it; hide/restore when leaving
  panels.forEach(panel => {
    panel.addEventListener('mouseenter', function () {
      clearHoverTimeout();
    });
    panel.addEventListener('mouseleave', function () {
      clearHoverTimeout();
      hoverTimeout = setTimeout(() => {
        if (clickedActiveBtn) {
          const cat = clickedActiveBtn.getAttribute('data-cat');
          showOnlyPanel(cat);
          buttons.forEach(b => b.classList.toggle('active', b === clickedActiveBtn));
        } else {
          hideAllPanels();
          buttons.forEach(b => b.classList.remove('active'));
        }
      }, 120);
    });
  });

  // Close panels when clicking outside the buttons, the options container, or the panels
  document.addEventListener('click', function (e) {
    const insideBtns = e.target.closest('.featured-btns');
    const insideOptions = e.target.closest('.category-options');
    const insidePanel = e.target.closest('.category-panel');
    // If click was inside buttons, inside the options container, or inside a panel, ignore
    if (insideBtns || insideOptions || insidePanel) return;

    // click outside -> hide everything and clear active selection
    clickedActiveBtn = null;
    hideAllPanels();
    buttons.forEach(b => b.classList.remove('active'));
  });

    // Do not auto-open any category by default. Panels stay hidden until user
    // clicks or hovers a category. To enable a default, call `first.click()`
    // or set a `data-default="true"` attribute and uncomment the logic below.
    // const first = document.querySelector('.featured-btns .category-btn[data-default="true"]') || document.querySelector('.featured-btns .category-btn[data-cat]');
    // if (first) first.click();
});
