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