function includeHTML() {
  const includes = document.querySelectorAll('[data-include]');
  includes.forEach(el => {
    const file = el.getAttribute('data-include');
    fetch(file)
      .then(resp => {
        if (!resp.ok) throw new Error(`Cannot load ${file}`);
        return resp.text();
      })
      .then(html => el.innerHTML = html)
      .catch(err => console.error(err));
  });
}

document.addEventListener('DOMContentLoaded', includeHTML);