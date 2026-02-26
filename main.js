let currentStep = 1;
const totalSteps = 9;

// --- Wizard Logic ---

function updateWizardUI() {
    // Hide all steps
    document.querySelectorAll('.wizard-step').forEach(step => {
        step.classList.remove('active');
    });

    // Show current step
    document.getElementById(`step-${currentStep}`).classList.add('active');

    // Update Progress bar and text
    const percentage = ((currentStep) / totalSteps) * 100;
    document.getElementById('progressBar').style.width = `${percentage}%`;
    document.getElementById('currentStepText').innerText = currentStep;

    // Update buttons
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const btnSubmit = document.getElementById('btnSubmit');

    btnPrev.disabled = currentStep === 1;

    if (currentStep === totalSteps) {
        btnNext.style.display = 'none';
        btnSubmit.style.display = 'inline-block';
    } else {
        btnNext.style.display = 'inline-block';
        btnSubmit.style.display = 'none';
    }

    // Attempt to start camera if entering Step 5
    if (currentStep === 5 && !currentStream) {
        startCamera('environment').catch(e => console.log('Camera start skipped/failed', e));
    }
}

function changeStep(direction) {
    if (direction === 1 && currentStep < totalSteps) {
        // Here you could add simple validation if required inputs are empty
        currentStep++;
    } else if (direction === -1 && currentStep > 1) {
        currentStep--;
    }
    updateWizardUI();
    // Scroll to top of container
    document.querySelector('.wizard-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// --- File Drop Area Logic ---
const fileInput = document.getElementById('document');
const fileDisplay = document.getElementById('file-name-display');

if (fileInput) {
    fileInput.addEventListener('change', (e) => {
        if (fileInput.files.length > 0) {
            fileDisplay.textContent = `Archivo seleccionado: ${fileInput.files[0].name}`;
        } else {
            fileDisplay.textContent = '';
        }
    });
}

// --- WebRTC Camera Logic ---
let currentStream = null;

async function startCamera(facingMode = 'environment') {
    try {
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: facingMode }
        });

        currentStream = stream;

        // Compartir el stream entre los 5 videos
        ['frontal', 'posterior', 'plantar', 'retropie', 'receta'].forEach(view => {
            const video = document.getElementById(`video_${view}`);
            if (video) {
                video.srcObject = stream;
            }
        });

        return stream;
    } catch (err) {
        console.error('Error al acceder a la cámara:', err);
    }
}

async function switchCamera() {
    const cameraSelect = document.getElementById('cameraSelect');
    const facingMode = cameraSelect.value;
    await startCamera(facingMode);
}

function captureImage(view) {
    const video = document.getElementById(`video_${view}`);
    const canvas = document.getElementById(`canvas_${view}`);
    const input = document.querySelector(`input[name="imagen_${view}"]`);
    const imgPreview = document.getElementById(`img_${view}`);

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataURL = canvas.toDataURL('image/jpeg', 0.8);
        input.value = dataURL;
        imgPreview.src = dataURL;
        imgPreview.style.display = 'block';
    } else {
        alert("La cámara aún no está lista.");
    }
}

// --- Submission Logic ---

async function submitWizard() {
    console.log('Enviando formulario final...');
    const form = document.getElementById('diagnosticForm');
    
    // Validar requeridos en html5 (hacky trigger)
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const spinnerOverlay = document.getElementById('spinnerOverlay');
    spinnerOverlay.style.display = 'flex';
    document.querySelector('.wizard-container').classList.add('form-disabled');

    try {
        const formData = new FormData(form);
        const formDataObj = {};
        
        for (let [key, value] of formData.entries()) {
            formDataObj[key] = value;
        }

        console.log('Sending data (simulating to endpoint)...');
        
        const response = await fetch('https://us-central1-adaptivabiomotion-93558.cloudfunctions.net/app/api/form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataObj)
        });

        const text = await response.text();
        let resData;
        try {
            resData = JSON.parse(text);
        } catch(e) { /* ignore parse error on ok */ }

        if (response.ok) {
            alert("¡Diagnóstico guardado exitosamente!");
            form.reset();
            // Reset to step 1
            currentStep = 1;
            updateWizardUI();
            
            // Clear images
            ['frontal', 'posterior', 'plantar', 'retropie', 'receta'].forEach(view => {
                const img = document.getElementById(`img_${view}`);
                if (img) img.style.display = 'none';
            });
            if(fileDisplay) fileDisplay.textContent = '';
            
        } else {
            const errorMessage = (resData && (resData.error || resData.message)) || 'Error en el servidor.';
            alert(`Error: ${errorMessage}`);
        }
    } catch (err) {
        console.error("Error completo", err);
        alert("Ocurrió un error al intentar enviar el diagnóstico.");
    } finally {
        spinnerOverlay.style.display = 'none';
        document.querySelector('.wizard-container').classList.remove('form-disabled');
    }
}

// Initialization calls
document.addEventListener('DOMContentLoaded', () => {
    updateWizardUI();
});
