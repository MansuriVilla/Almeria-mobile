function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function initHamburgerMenu() {
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".main_navigation");
  const closeBtn = document.querySelector(".nav_close");
  const overlay = document.querySelector(".nav_overlay");

  if (!hamburger || !nav) return;

  function toggleMenu(show) {
    nav.classList.toggle("active", show);
    hamburger.classList.toggle("active", show);
    hamburger.setAttribute("aria-expanded", show);
    if (overlay) overlay.classList.toggle("active", show);
  }

  hamburger.addEventListener("click", () =>
    toggleMenu(!nav.classList.contains("active")),
  );
  if (closeBtn) closeBtn.addEventListener("click", () => toggleMenu(false));
  if (overlay) overlay.addEventListener("click", () => toggleMenu(false));
}

function initProductGallery() {
  const thumbnails = document.querySelectorAll(".pdp_thumbnails img");
  const mainImage = document.querySelector(".pdp_main_image img");

  if (!thumbnails.length || !mainImage) return;

  function handleThumbnailClick(event) {
    const clickedThumb = event.currentTarget;

    thumbnails.forEach((t) => t.classList.remove("active"));
    clickedThumb.classList.add("active");

    const newSrc =
      clickedThumb.dataset.main || clickedThumb.getAttribute("src");
    if (newSrc) {
      mainImage.setAttribute("src", newSrc);
    }
  }

  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", handleThumbnailClick);
  });
}

function initCollectionFilters() {
  const grid = document.querySelector(".collection_grid");
  const sortSelect = document.getElementById("sort-by");
  const priceRange = document.querySelector(".price_range");
  const priceValue = document.querySelector(".price_value");

  if (!grid || !sortSelect) return;

  const products = Array.from(grid.querySelectorAll(".product_card")).map(
    (card) => {
      const priceNode = card.querySelector(".product_price");
      const titleNode = card.querySelector(".product_title");

      const priceText = priceNode ? priceNode.textContent : "0";
      const title = titleNode ? titleNode.textContent.trim() : "";

      const price = parseFloat(priceText.replace(/[^0-9.]/g, "")) || 0;

      return { element: card, price, title };
    },
  );

  function renderProducts(filteredProducts) {
    grid.innerHTML = "";

    if (filteredProducts.length === 0) {
      grid.innerHTML =
        '<p style="grid-column: 1 / -1; color: #666; font-size: 14px;display: flex;justify-content: center;align-items: center;aspect-ratio: 2/1;">No products match your filters.</p>';
      return;
    }

    const fragment = document.createDocumentFragment();
    filteredProducts.forEach((p) => fragment.appendChild(p.element));
    grid.appendChild(fragment);
  }

  function updateGrid() {
    const maxPrice = priceRange ? parseFloat(priceRange.value) : 1000;
    const sortValue = sortSelect.value;

    const filtered = products.filter((p) => p.price <= maxPrice);
    filtered.sort((a, b) => {
      switch (sortValue) {
        case "title-ascending":
          return a.title.localeCompare(b.title);
        case "title-descending":
          return b.title.localeCompare(a.title);
        case "price-ascending":
          return a.price - b.price;
        case "price-descending":
          return b.price - a.price;
        default:
          return 0;
      }
    });

    renderProducts(filtered);
  }

  if (priceRange) {
    priceRange.addEventListener("input", (e) => {
      if (priceValue) priceValue.textContent = e.target.value;
    });
    priceRange.addEventListener("change", updateGrid);
  }

  sortSelect.addEventListener("change", updateGrid);
  updateGrid();
}

function initQuantitySelectors() {
  const quantitySelectors = document.querySelectorAll(".quantity_selector");

  quantitySelectors.forEach((selector) => {
    const input = selector.querySelector(".qty_input");
    const buttons = selector.querySelectorAll(".qty_btn");

    if (!input || buttons.length < 2) return;

    const btnDecrease = Array.from(buttons).find(
      (b) => b.getAttribute("aria-label") === "Decrease quantity",
    );
    const btnIncrease = Array.from(buttons).find(
      (b) => b.getAttribute("aria-label") === "Increase quantity",
    );

    if (btnDecrease) {
      btnDecrease.addEventListener("click", () => {
        const currentValue = parseInt(input.value, 10) || 1;
        if (currentValue > 1) {
          input.value = currentValue - 1;
        }
      });
    }

    if (btnIncrease) {
      btnIncrease.addEventListener("click", () => {
        const currentValue = parseInt(input.value, 10) || 1;
        input.value = currentValue + 1;
      });
    }

    input.addEventListener("change", () => {
      const val = parseInt(input.value, 10);
      if (isNaN(val) || val < 1) {
        input.value = 1;
      }
    });
  });
}

function initSearchModal() {
  const searchBtns = document.querySelectorAll(".icon_search");
  const searchModal = document.querySelector(".search_modal");
  const searchClose = document.querySelector(".search_close");
  const searchBackdrop = document.querySelector(".search_backdrop");
  const searchInput = document.querySelector(".search_input");

  if (!searchModal || !searchBtns.length) return;

  function openSearch() {
    searchModal.classList.add("active");
    searchBtns.forEach((btn) => btn.setAttribute("aria-expanded", "true"));
    if (searchInput) {
      setTimeout(() => searchInput.focus(), 100);
    }
  }

  function closeSearch() {
    searchModal.classList.remove("active");
    searchBtns.forEach((btn) => btn.setAttribute("aria-expanded", "false"));
  }

  searchBtns.forEach((btn) => btn.addEventListener("click", openSearch));
  if (searchClose) searchClose.addEventListener("click", closeSearch);
  if (searchBackdrop) searchBackdrop.addEventListener("click", closeSearch);

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchModal.classList.contains("active")) {
      closeSearch();
    }
  });
}

function initCartDrawer() {
  const cartBtn = document.querySelector(".icon_cart");
  const cartDrawer = document.querySelector(".cart_drawer");
  const cartClose = document.querySelector(".cart_close");
  const cartBackdrop = document.querySelector(".cart_backdrop");

  if (!cartDrawer || !cartBtn) return;

  function openCart() {
    cartDrawer.classList.add("active");
    cartBtn.setAttribute("aria-expanded", "true");
  }

  function closeCart() {
    cartDrawer.classList.remove("active");
    cartBtn.setAttribute("aria-expanded", "false");
  }

  cartBtn.addEventListener("click", openCart);
  if (cartClose) cartClose.addEventListener("click", closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener("click", closeCart);

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && cartDrawer.classList.contains("active")) {
      closeCart();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initHamburgerMenu();
  initSearchModal();
  initCartDrawer();
  initProductGallery();
  initCollectionFilters();
  initQuantitySelectors();
});
