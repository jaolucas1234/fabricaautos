const titulo = document.querySelector('header h1');
const uri = 'http://localhost:3000/';

fetch(uri)
    .then(response => response.json())
    .then(data => {
        titulo.textContent = data.titulo;
    });

const main = document.querySelector('main');
for (let i = 1; i <= 10; i++) {
    const area = document.createElement('div');
    area.id = `area-${i}`;
    area.innerHTML = `<p>${i}</p>`;
    main.appendChild(area);
}