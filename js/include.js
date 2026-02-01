// js/include.js
function includeHTML() {
  const includes = document.querySelectorAll('[data-include]');

  includes.forEach(el => {
    const file = el.getAttribute('data-include');

    fetch(file)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load ${file}`);
        }
        return response.text();
      })
      .then(html => {
        el.innerHTML = html;
      })
      .catch(err => {
        console.error(err);
        el.innerHTML = '<!-- include failed -->';
      });
  });
}

document.addEventListener('DOMContentLoaded', includeHTML);
