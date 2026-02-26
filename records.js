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

      ${record.documentUrl ? `
      <div style="margin-bottom: 1.5rem;">
        <a href="${record.documentUrl}" target="_blank" class="btn btn-secondary" style="display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none;">
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Descargar Documento Adjunto
        </a>
      </div>` : ''}

      <details>
        <summary>Ver todos los detalles técnicos</summary>
        <pre>${JSON.stringify(record, null, 2)}</pre>
      </details>
    `;

        container.appendChild(div);
    });
}
