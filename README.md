# BioMotion Pro

**BioMotion Pro** is a modern, responsive, and professional web application designed for comprehensive biomechanical diagnostics and podiatric record management. It reimagines the legacy form interface into a sleek, multi-step wizard, enhancing both the user experience and data collection efficiency.

## Features ✨

- **Professional Wizard Interface:** A clean, step-by-step 9-stage progression for patient data capture that reduces cognitive overload.
- **Premium Aesthetics:** Built with a glassmorphism design system, smooth transitions, and dynamic SVG icons.
- **Integrated WebRTC Camera Support:** Direct in-browser image capture for frontal, posterior, plantar, retropié, and physical prescription pictures.
- **Firebase Backend Ready:** Forms connect effortlessly to live Firebase Cloud Functions for robust data storage.
- **Interactive Records View:** A dedicated, searchable "Historial de Diagnóstico" gallery to manage, review, and delete patient records with their associated captured images.

## Technology Stack 💻

- **Frontend Core:** HTML5, CSS3, JavaScript (ES6+)
- **Design System:** Custom CSS featuring CSS variables for easy theming, Glassmorphism, and the `Inter` font.
- **Backend/Storage:** Designed to integrate with Firebase (Firestore & Cloud Storage) via Cloud Functions endpoints.

## Project Structure 📁

```
BioMotion-Pro/
├── index.html       # The main multi-step diagnostic wizard
├── main.js          # Wizard logic, WebRTC camera integrations, and form submission
├── records.html     # Patient history gallery and management view
├── records.js       # Data fetching, search filtering, and deletion logic
└── style.css        # Core design system and responsive layout rules
```

## Running Locally 🚀

This project is a standalone frontend application. To serve it locally:

1. Clone this repository:
   ```bash
   git clone https://github.com/edramos-lab/BioMotion-Pro.git
   cd BioMotion-Pro
   ```

2. Start a simple HTTP server (Python 3):
   ```bash
   python3 -m http.server 8000
   ```
   *(Alternatively, you can use Node.js tools like `http-server` or `live-server`).*

3. Open your browser and navigate to `http://localhost:8000`.

## Connecting to the Backend 🔗

The frontend is currently programmed to hit a specific Cloud Function endpoint on form submission and record fetching. 

If you are using your own Firebase project, ensure you update the `fetch` URLs in both `main.js` and `records.js` to point to your deployed Firebase Cloud Functions:
```javascript
// Example in main.js and records.js
fetch('https://YOUR-REGION-YOUR-PROJECT.cloudfunctions.net/app/api/...', { ... })
```

## License 📜

This project is intended for professional use within the BioMotion ecosystem.
