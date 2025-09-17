// ---------------------- ELEMENTS ----------------------
const startDetect = document.getElementById("startDetect");
const stopDetect = document.getElementById("stopDetect");
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const resultDetection = document.getElementById("disease");
const treatmentEl = document.getElementById("treatment");

// Action buttons
const scanPlantBtn = document.getElementById("scanPlant");
const plantGuideBtn = document.getElementById("plantGuide");

// History modal
const historyModal = document.getElementById("historyModal");
const historyBtn = document.getElementById("history");
const closeHistory = document.getElementById("closeHistory");
const historyList = document.getElementById("historyList");

// Clear history button
const clearHistoryBtn = document.createElement("button");
clearHistoryBtn.innerText = "Clear History";
clearHistoryBtn.classList.add("btn", "secondary");
historyModal.querySelector(".modal-content").appendChild(clearHistoryBtn);

// Plant Guide modal
const plantGuideModal = document.getElementById("plantGuideModal");
const closeGuide = document.getElementById("closeGuide");
const guideList = document.getElementById("guideList");
const guideSearch = document.getElementById("guideSearch");

// Example static Plant Disease Guide Data
const plantGuideData = {
    "Anthracnose": "Dark, sunken lesions on leaves, stems, and fruit. Treatment: Remove affected parts and apply fungicide.",
    "Black Spot": "Circular black spots on leaves. Treatment: Use neem oil or sulfur-based fungicides.",
    "Mosaic Virus": "Mottled yellow-green leaves, stunted growth. No cure, remove infected plants and control pests.",
    "Blight": "Rapid yellowing and browning of leaves. Treatment: Copper-based fungicides and crop rotation.",
    "Powdery Mildew": "White powdery coating on leaves. Treatment: Spray with potassium bicarbonate or milk solution.",
    "Rust": "Orange or brown pustules under leaves. Treatment: Apply sulfur fungicide and improve air circulation.",
    "Healthy": "No symptoms. Maintain proper care with water, nutrients, and sunlight."
};

// ---------------------- FUNCTIONS ----------------------

// Render static guide list
function renderGuideList(filter = "") {
    guideList.innerHTML = "";
    Object.entries(plantGuideData).forEach(([disease, description]) => {
        if (disease.toLowerCase().includes(filter.toLowerCase())) {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${disease}</strong><br><small>${description}</small>`;
            guideList.appendChild(li);
        }
    });
}

// Markdown renderer
const md = window.markdownit();

// Scan history array
let scanHistory = [];

// ML5 classifier and camera stream
let classifier;
let stream;
let diseaseName = "";

// ---------------------- CAMERA CONTROLS ----------------------
startDetect.addEventListener('click', async () => {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.play();
        startDetect.disabled = true;
        stopDetect.disabled = false;

        // Load Teachable Machine model
        classifier = await ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/8GYtlPoCt/model.json');
        console.log("Model Loaded!");
        classifyVideo();
    } catch (err) {
        console.error('Error accessing webcam:', err);
    }
});

stopDetect.addEventListener('click', () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        startDetect.disabled = false;
        stopDetect.disabled = true;
    }
});

// ---------------------- VIDEO CLASSIFICATION ----------------------
function classifyVideo() {
    classifier.classify(video, (err, results) => {
        if (err) {
            console.error(err);
            return;
        }
        if (!results || results.length === 0) return;

        const detectedLabel = results[0].label;
        const confidence = results[0].confidence.toFixed(2);
        resultDetection.innerText = `${detectedLabel}, Confidence: ${confidence}`;

        const diseaseList = [
            "Anthracnose", "Black Spot", "Mosaic Virus", "Blight",
            "Powdery Mildew", "Rust", "Healthy"
        ];

        if (diseaseList.includes(detectedLabel) && confidence > 0.3) {
            diseaseName = detectedLabel + " Plant Disease";

            // Save scan history
            scanHistory.push({
                disease: detectedLabel,
                confidence: confidence,
                time: new Date().toLocaleString()
            });

            // Draw video frame
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Capture image
            const base64Image = canvas.toDataURL('image/png');

            // Send to backend AI
            sendToBackend(base64Image);
        } else {
            requestAnimationFrame(classifyVideo);
        }
    });
}