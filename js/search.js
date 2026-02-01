const FILES = ['data/connectors.csv','data/mounts.csv','data/antennas.csv'];
let allProducts = [];

Promise.all(FILES.map(f=>fetch(f).then(r=>r.text())))
  .then(texts=>texts.flatMap(parseCSV))
  .then(p=>allProducts=p);

document.getElementById('search')
  .addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    const results = allProducts.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.product_number.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.includes(q))
    );
    renderResults(results);
  });

function renderResults(list){
  const container=document.getElementById('results');
  container.innerHTML='';
  list.forEach(p=>{
    const div=document.createElement('div');
    div.className='product';
    div.innerHTML=`
      <a href="product.html?sku=${encodeURIComponent(p.product_number)}" class="product-link">
        <div class="sku">#${p.product_number}</div>
        <h3>${p.name}</h3>
        <p class="description">${p.description}</p>
        <div class="tags">${p.tags.join(', ')}</div>
      </a>
    `;
    container.appendChild(div);
  });
}