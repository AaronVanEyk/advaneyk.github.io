const FILES = ['data/connectors.csv','data/mounts.csv','data/antennas.csv'];
const params = new URLSearchParams(window.location.search);
const sku = params.get('sku');

if(!sku){document.getElementById('product-details').textContent='No product selected.'; throw new Error('SKU missing');}

let allProducts = [];

Promise.all(FILES.map(f=>fetch(f).then(r=>r.text())))
  .then(texts=>texts.flatMap(parseCSV))
  .then(p=>{allProducts=p; renderProduct(allProducts.find(p=>p.product_number===sku));});

function renderProduct(p){
  const container=document.getElementById('product-details');
  if(!p){container.textContent='Product not found.'; return;}
  container.innerHTML=`
    <h1>${p.name}</h1>
    <div class="sku">Product #${p.product_number}</div>
    <div class="price">$${p.price.toFixed(2)}</div>
    <div>${p.inventory>0?`In stock: ${p.inventory}`:'<span class="out">Out of stock</span>'}</div>
    <p class="description">${p.description}</p>
    <div class="tags">${p.tags.join(', ')}</div>
  `;
}