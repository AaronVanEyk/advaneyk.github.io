// ============================
// Load CSV and render products
// ============================
async function loadProducts(csvPath) {
  try {
    const response = await fetch(csvPath);
    if (!response.ok) throw new Error(`Failed to fetch ${csvPath}`);
    const text = await response.text();

    const products = parseCSV(text); // parse CSV into array
    renderProducts(products);        // display all products
  } catch (err) {
    console.error('Error loading products:', err);
    const container = document.getElementById('product-list');
    if (container) container.innerHTML = '<p>Failed to load products.</p>';
  }
}

// ============================
// Render product cards on category page
// ============================
function renderProducts(list) {
  const container = document.getElementById('product-list');
  if (!container) return;

  container.innerHTML = ''; // clear previous content

  list.forEach(p => {
    if (!p || !p.product_number) return; // guard against bad CSV

    const imageSrc = `images/products/${p.product_number}.jpg`;

    const div = document.createElement('div');
    div.className = 'product-card';

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
