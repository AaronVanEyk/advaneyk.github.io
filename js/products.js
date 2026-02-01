// products.js

// ============================
// Global products array
// ============================
let allProducts = []; // stores all products for filtering/search

// ============================
// Load CSV and initialize page
// ============================
async function loadProducts(csvPath) {
  try {
    const response = await fetch(csvPath);
    if (!response.ok) throw new Error(`Failed to fetch ${csvPath}`);
    const text = await response.text();
    allProducts = parseCSV(text);           // parse CSV into array of objects
    renderProducts(allProducts);            // render initial product cards
    populateTagFilter(allProducts);         // populate tag dropdown
  } catch (err) {
    console.error('Error loading products:', err);
    const container = document.getElementById('product-list');
    if (container) container.innerHTML = '<p>Failed to load products.</p>';
  }
}

// ============================
// Render category page product cards
// ============================
function renderProducts(list) {
  const container = document.getElementById('product-list');
  if (!container) return;

  container.innerHTML = ''; // clear existing

  list.forEach(p => {
    // Defensive guard
    if (!p || !p.product_number) return;

    const div = document.createElement('div');
    div.className = 'product-card';

    const imageSrc = `images/products/${p.product_number}.jpg`;

    div.innerHTML = `
      <a href="product.html?sku=${encodeURIComponent(p.product_number)}" class="product-link">
        <img
          src="${imageSrc}"
          alt="${p.name || 'Product image'}"
          class="product-image"
          loading="lazy"
          onerror="this.src='images/products/placeholder.jpg'"
        >
        <div class="sku">#${p.product_number}</div>
        <h3>${p.name || 'Unnamed Product'}</h3>
        <div class="price">$${p.price ? p.price.toFixed(2) : '0.00'}</div>
        <div>
          ${p.inventory && p.inventory > 0
            ? `In stock: ${p.inventory}`
            : `<span class="out">Out of stock</span>`}
        </div>
        <p class="description">${p.description || ''}</p>
        <div class="tags">${p.tags && p.tags.length ? p.tags.join(', ') : ''}</div>
      </a>
    `;

    container.appendChild(div);
  });
}

// ============================
// Populate tag dropdown safely
// ============================
function populateTagFilter(products) {
  const select = document.getElementById('tag-filter');
  if (!select) return;

  const tags = Array.from(new Set(products.flatMap(p => p.tags || []))); // safe flatten
  select.innerHTML = `<option value="">All Tags</option>`;

  tags.forEach(tag => {
    const option = document.createElement('option');
    option.value = tag;
    option.textContent = tag;
    select.appendChild(option);
  });
}

// ============================
// Attach real-time search
// ============================
function attachSearchListener() {
  const searchInput = document.getElementById('search');
  if (!searchInput) return;

  searchInput.addEventListener('input', e => {
    const term = e.target.value.toLowerCase();

    const filtered = allProducts.filter(p =>
      (p.name || '').toLowerCase().includes(term) ||
      (p.description || '').toLowerCase().includes(term) ||
      (p.tags || []).some(tag => tag.toLowerCase().includes(term))
    );

    renderProducts(filtered);
  });
}

// ============================
// Attach tag filter listener
// ============================
function attachTagFilterListener() {
  const select = document.getElementById('tag-filter');
  if (!select) return;

  select.addEventListener('change', e => {
    const selectedTag = e.target.value;

    const filtered = selectedTag
      ? allProducts.filter(p => (p.tags || []).includes(selectedTag))
      : allProducts;

    renderProducts(filtered);
  });
}

// ============================
// Initialize when DOM is ready
// ============================
document.addEventListener('DOMContentLoaded', () => {
  loadProducts('data/connectors.csv'); // replace with your CSV path
  attachSearchListener();
  attachTagFilterListener();
});
