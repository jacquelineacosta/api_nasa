function escapeHtml(text) {
    return text.replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")
               .replace(/>/g, "&gt;")
               .replace(/"/g, "&quot;")
               .replace(/'/g, "&#039;");
}

async function searchImages() {
    const query = document.getElementById('searchQuery').value;
    const URL = `https://images-api.nasa.gov/search?q=${query}`;

    document.getElementById('loader').style.display = 'block'; // Mostrar loader

    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        displayImages(data.collection.items);
    } catch (error) {
        console.error('Error fetching the data:', error);
    } finally {
        document.getElementById('loader').style.display = 'none'; // Ocultar loader
    }
}

function displayImages(items) {
    const resultadoImg = document.getElementById('contenedor');
    resultadoImg.innerHTML = '';

    items.forEach((item, index) => {
        const imagenURL = item.links && item.links.length > 0 ? item.links[0].href : '';
        const titulo = item.data && item.data.length > 0 ? item.data[0].title : '';
        const descripcion = item.data && item.data.length > 0 ? item.data[0].description : '';
        const date = item.data && item.data.length > 0 ? item.data[0].date_created : '';

        const card = `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${imagenURL}" class="card-img-top" alt="${titulo}">
                    <div class="card-body">
                        <h5 class="card-title"><strong>${titulo}</strong></h5>
                        <p class="card-text"><small class="text-muted">${new Date(date).toLocaleDateString()}</small></p>
                        <p class="card-text">${escapeHtml(descripcion)}</p>
                        <button class="btn btn-outline-dark" onclick='showDescription("${escapeHtml(descripcion)}")'>Ver Descripción</button>
                    </div>
                </div>
            </div>
        `;
        ;
        resultadoImg.innerHTML += card;
    });
}      

const searchInput = document.getElementById('searchQuery');
searchInput.addEventListener('input', () => {
    if (searchInput.checkValidity()) {
        searchInput.classList.remove('is-invalid');
    } else {
        searchInput.classList.add('is-invalid');
    }
});

function showDescription(descripcion) {
    document.getElementById('modal-description').textContent = descripcion;
    const descriptionModal = new bootstrap.Modal(document.getElementById('descriptionModal'));
    descriptionModal.show();
}