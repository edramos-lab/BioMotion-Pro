let allRecords = [];

const loadingSpinner = document.getElementById('loadingSpinner');
const loadingText = document.getElementById('loadingText');
const container = document.getElementById('records-list');

// Fetch Records
fetch('https://us-central1-adaptivabiomotion-93558.cloudfunctions.net/app/api/records')
    .then(res => res.json())
    .then(data => {
        allRecords = data;
        renderRecords(data);
    })
    .catch(err => {
        console.error(err);
        container.innerHTML = `<div class="empty-state">Error al cargar registros.</div>`;
    });

// Search functionality
document.getElementById('search').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = allRecords.filter(r =>
        (r.nombrePaciente && r.nombrePaciente.toLowerCase().includes(query)) ||
        (r.id && r.id.toLowerCase().includes(query))
    );
    renderRecords(filtered);
});

// Delete specific record
function deleteRecord(id) {
    if (!id) return;

    if (confirm('¿Está seguro que desea eliminar este registro?')) {
        fetch(`https://us-central1-adaptivabiomotion-93558.cloudfunctions.net/app/api/records/${id}`, {
            method: 'DELETE'
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    allRecords = allRecords.filter(r => r.id !== id);
                    renderRecords(allRecords);
                } else {
                    alert('Error al eliminar el registro');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al eliminar el registro');
            });
    }
}

function renderRecords(records) {
    container.innerHTML = '';

    if (!records || !records.length) {
        container.innerHTML = '<div class="empty-state">No se encontraron resultados.</div>';
        return;
    }

    records.forEach(record => {
        const div = document.createElement('div');
        div.className = 'record-card';

        const images = [
            { key: 'imagen_frontal', title: 'Frontal' },
            { key: 'imagen_posterior', title: 'Posterior' },
            { key: 'imagen_plantar', title: 'Plantar' },
            { key: 'imagen_retropie', title: 'Retropié' },
            { key: 'imagen_receta', title: 'Receta' }
        ];

        const imageGallery = images.map(img => {
            if (record[img.key]) {
                return `
          <div class="gallery-item">
            <img src="${record[img.key]}" alt="${img.title}" onclick="window.open('${record[img.key]}', '_blank')"/>
            <p>${img.title}</p>
          </div>
        `;
            }
            return '';
        }).join('');

        div.innerHTML = `
      <div class="record-header">
        <div class="record-info">
          <h3>${record.nombrePaciente || 'Sin nombre'}</h3>
          <p><strong>ID:</strong> ${record.id}</p>
          <p><strong>Fecha:</strong> ${record.fecha ? new Date(record.fecha).toLocaleString() : 'N/A'}</p>
          <p><strong>Ciudad:</strong> ${record.ciudad || 'N/A'}</p>
        </div>
        <button onclick="deleteRecord('${record.id}')" class="btn btn-danger">Borrar</button>
      </div>
      
      <div class="image-gallery">
        ${imageGallery}
      </div>
      
      <details>
        <summary>Ver todos los detalles técnicos</summary>
        <pre>${JSON.stringify(record, null, 2)}</pre>
      </details>
    `;

        container.appendChild(div);
    });
}
