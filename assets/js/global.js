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

// ============================================
// Marketplace-specific sidebar (categories)
// ============================================
(function() {
    function initMarketplaceSidebar() {
        // Check if we're on marketplace page
        if (!window.location.pathname.includes('marketplace')) return;
        
        // Check if sidebar already exists
        if (document.getElementById('categorySearchBar')) return;

        const marketplaceSidebarHTML = `
    <!-- Marketplace Categories Sidebar -->
    <div id="categoryOverlay" class="sidebar-overlay"></div>
    <aside id="categorySearchBar" class="mobile-sidebar" aria-hidden="true">
        <div class="mobile-sidebar-header">
            <div class="d-flex align-items-center justify-content-between">
                <h6 class="mb-0">Shop by Category</h6>
                <button class="category-sidebar-close btn btn-link"><i class="fa fa-times"></i></button>
            </div>
        </div>
        <div class="mobile-sidebar-body">
            <div class="mb-3">
                <h6 class="mb-3">Kitchen Utensils</h6>
                <ul class="list-unstyled">
                    <li><a href="#">Cooking Tools</a></li>
                    <li><a href="#">Cutting &amp; Chopping</a></li>
                    <li><a href="#">Baking Essentials</a></li>
                    <li><a href="#">Measuring Tools</a></li>
                    <li><a href="#">Dining</a></li>
                    <li><a href="#">Kitchen Storage</a></li>
                </ul>
            </div>
            <hr>
            <div class="mb-3">
                <h6 class="mb-3">Cleaning Supplies</h6>
                <ul class="list-unstyled">
                    <li><a href="#">Home Cleaning</a></li>
                    <li><a href="#">Air Fresheners &amp; Deodorizers</a></li>
                    <li><a href="#">Laundry Care</a></li>
                </ul>
            </div>
            <hr>
            <div class="mb-3">
                <h6 class="mb-3">Storage &amp; Organization</h6>
                <ul class="list-unstyled">
                    <li><a href="#">Wardrobe &amp; Closet Organizers</a></li>
                    <li><a href="#">Bathroom Storage</a></li>
                    <li><a href="#">Office &amp; Desk Organizers</a></li>
                    <li><a href="#">Travel &amp; Luggage Organizers</a></li>
                </ul>
            </div>
            <hr>
            <div class="mb-3">
                <h6 class="mb-3">Home Décor</h6>
                <ul class="list-unstyled">
                    <li><a href="#">Lighting</a></li>
                    <li><a href="#">Decorative Accessories</a></li>
                </ul>
            </div>
            <hr>
            <div class="mb-3">
                <h6 class="mb-3">Home Improvement</h6>
                <ul class="list-unstyled">
                    <li><a href="#">Tools &amp; Hardware</a></li>
                    <li><a href="#">Safety &amp; Security</a></li>
                    <li><a href="#">Outdoor &amp; Garden</a></li>
                </ul>
            </div>
            <hr>
            <div class="mb-3">
                <h6 class="mb-3">Health &amp; Beauty</h6>
                <ul class="list-unstyled">
                    <li><a href="#">Skincare</a></li>
                    <li><a href="#">Haircare</a></li>
                    <li><a href="#">Personal Grooming</a></li>
                    <li><a href="#">Fitness &amp; Wellness</a></li>
                    <li><a href="#">Oral care</a></li>
                </ul>
            </div>
            <hr>
            <div class="mb-3">
                <h6 class="mb-3">Electronics &amp; Accessories</h6>
                <ul class="list-unstyled">
                    <li><a href="#">Mobile Accessories</a></li>
                    <li><a href="#">Gaming Accessories</a></li>
                    <li><a href="#">Car Electronics</a></li>
                    <li><a href="#">Audio &amp; Video Accessories</a></li>
                </ul>
            </div>
            <hr>
            <div class="mb-3">
                <h6 class="mb-3">Smart Gadgets</h6>
                <ul class="list-unstyled">
                    <li><a href="#">Smart Home Devices</a></li>
                    <li><a href="#">Wearable Tech</a></li>
                    <li><a href="#">Portable Devices</a></li>
                    <li><a href="#">Kitchen Smart Gadgets</a></li>
                </ul>
            </div>
        </div>
    </aside>
        `;

        document.body.insertAdjacentHTML('beforeend', marketplaceSidebarHTML);
        initMarketplaceSidebarToggle();
    }

    function initMarketplaceSidebarToggle() {
        var categoryBtn = document.querySelector('.marketplace-category-btn');
        var categorySidebar = document.getElementById('categorySearchBar');
        var categoryOverlay = document.getElementById('categoryOverlay');
        var categoryCloseBtn = document.querySelector('.category-sidebar-close');

        function openCategorySidebar() {
            if (categorySidebar) {
                categorySidebar.classList.add('open');
                categoryOverlay.classList.add('visible');
                categorySidebar.setAttribute('aria-hidden', 'false');
            }
        }

        function closeCategorySidebar() {
            if (categorySidebar) {
                categorySidebar.classList.remove('open');
                categoryOverlay.classList.remove('visible');
                categorySidebar.setAttribute('aria-hidden', 'true');
            }
        }

        if (categoryBtn) categoryBtn.addEventListener('click', openCategorySidebar);
        if (categoryCloseBtn) categoryCloseBtn.addEventListener('click', closeCategorySidebar);
        if (categoryOverlay) categoryOverlay.addEventListener('click', closeCategorySidebar);

        // Close on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeCategorySidebar();
        });

        // Close sidebar when clicking on category links
        var categoryLinks = document.querySelectorAll('#categorySearchBar a');
        categoryLinks.forEach(function(link) {
            link.addEventListener('click', closeCategorySidebar);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMarketplaceSidebar);
    } else {
        initMarketplaceSidebar();
    }
})();

// ============================================
// Global Mobile Sidebar Component
// ============================================
(function() {
    // Create sidebar HTML
    function initMobileSidebar() {
        // Check if sidebar already exists
        if (document.getElementById('mobileSidebar')) return;

        const sidebarHTML = `
    <!-- Mobile Sidebar Overlay -->
    <div id="sidebarOverlay" class="sidebar-overlay"></div>
    <!-- Mobile Sidebar -->
    <aside id="mobileSidebar" class="mobile-sidebar" aria-hidden="true">
        <div class="mobile-sidebar-header bg-dark">
            <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                    <img src="/assets/images/logo.png" alt="" style="height:36px;">
                </div>
                <button class="mobile-sidebar-close btn btn-link"><i class="fa fa-times"></i></button>
            </div>
        </div>
        <div class="mobile-sidebar-body">
            <div class="mb-3">
                <h6 class="mb-2">Navigation</h6>
                <ul class="list-unstyled">
                    <li><a href="/index.html">Home</a></li>
                    <li><a href="/pages/marketplace.html">Marketplace</a></li>
                    <li><a href="/pages/vendor.html">Vendors</a></li>
                    <li><a href="/pages/partner.html">Partners</a></li>
                    <li><a href="/pages/Support.html">Support</a></li>
                </ul>
            </div>
            <hr>
            <div class="mb-3">
                <h6 class="mb-2">Account</h6>
                <ul class="list-unstyled">
                    <li><a href="#">Login / Register</a></li>
                    <li><a href="#">My Profile</a></li>
                    <li><a href="#">Orders</a></li>
                    <li><a href="#">Cart</a></li>
                </ul>
            </div>
        </div>
    </aside>
        `;

        // Insert sidebar into body
        document.body.insertAdjacentHTML('beforeend', sidebarHTML);

        // Initialize sidebar toggle
        initSidebarToggle();
    }

    // Initialize sidebar toggle functionality
    function initSidebarToggle() {
        var openBtn = document.querySelector('.mobile-menu-btn');
        var sidebar = document.getElementById('mobileSidebar');
        var overlay = document.getElementById('sidebarOverlay');
        var closeBtn = document.querySelector('.mobile-sidebar-close');

        function openSidebar() {
            if (sidebar) {
                sidebar.classList.add('open');
                overlay.classList.add('visible');
                sidebar.setAttribute('aria-hidden', 'false');
            }
        }

        function closeSidebar() {
            if (sidebar) {
                sidebar.classList.remove('open');
                overlay.classList.remove('visible');
                sidebar.setAttribute('aria-hidden', 'true');
            }
        }

        if (openBtn) openBtn.addEventListener('click', openSidebar);
        if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
        if (overlay) overlay.addEventListener('click', closeSidebar);

        // Close on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeSidebar();
        });

        // Close sidebar when clicking on sidebar links
        var sidebarLinks = document.querySelectorAll('.mobile-sidebar a');
        sidebarLinks.forEach(function(link) {
            link.addEventListener('click', closeSidebar);
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileSidebar);
    } else {
        initMobileSidebar();
    }
})();
