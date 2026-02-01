// ============================
// Load single product by SKU from multiple CSVs
// ============================
const categoryCSVs = [
  '/data/accessoires.csv',
  '/data/antennas.csv',
  '/data/patches.csv'
];

async function loadProductBySKU(sku) {
  const container = document.getElementById('product-details');

  for (const csvPath of categoryCSVs) {
    try {
      const response = await fetch(csvPath);
      if (!response.ok) continue; // skip if file not found
      const text = await response.text();
      const products = parseCSV(text); // you already have parseCSV in utils.js
      const product = products.find(p => p.product_number === sku);

      if (product) {
        renderProduct(product);
        return; // stop after first match
      }
    } catch (err) {
      console.error(`Error fetching ${csvPath}:`, err);
    }
  }

  // If we reach here, product not found
  container.innerHTML = '<p>Product not found.</p>';
}

// ============================
// Render single product
// ============================
function renderProduct(p) {
  const container = document.getElementById('product-details');
  if (!p || !p.product_number) {
    container.textContent = 'Product not found.';
    return;
  }

  const imageSrc = `images/products/${p.product_number}.jpg`;

  container.innerHTML = `
    <img
      src="${imageSrc}"
      alt="${p.name || 'Product image'}"
      class="product-detail-image"
      onerror="this.src='images/products/placeholder.jpg'"
    >
    <h1>${p.name || 'Unnamed Product'}</h1>
    <div class="sku">#${p.product_number}</div>
    <div class="price">$${p.price ? p.price.toFixed(2) : '0.00'}</div>
    <div>
      ${p.inventory && p.inventory > 0
        ? `In stock: ${p.inventory}`
        : `<span class="out">Out of stock</span>`}
    </div>
    <p class="description">${p.description || ''}</p>
    <div class="tags">${p.tags && p.tags.length ? p.tags.join(', ') : ''}</div>
  `;
}
