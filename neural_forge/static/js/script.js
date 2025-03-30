// DOM Elements
const templates = document.querySelectorAll(".template");
const dropZone = document.getElementById("dropZone");
const resumeUpload = document.getElementById("resumeUpload");
const analysisForm = document.getElementById("analysisForm");
const loadingOverlay = document.getElementById('loadingOverlay');
const proceedWithoutBtn = document.querySelector('.proceed-without');

// Toggle mobile menu
function toggleMenu() {
    document.querySelector(".nav-links").classList.toggle("nav-active");
}

// Template drag and drop functionality
templates.forEach((template) => {
    template.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", template.textContent);
    });
});

// Drop zone event handlers
dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");

    const text = e.dataTransfer.getData("text/plain");
    const newElement = document.createElement("div");
    newElement.classList.add("template");
    newElement.textContent = text;
    dropZone.appendChild(newElement);
});

// Proceed without upload
if (proceedWithoutBtn) {
    proceedWithoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "/dashboard";
    });
}

// Form submission handler
if (analysisForm) {
    analysisForm.addEventListener("submit", async function(event) {
        event.preventDefault();
        
        const file = resumeUpload.files[0];
        if (!file) {
            alert("Please upload a resume file");
            return;
        }

        const formData = new FormData();
        formData.append("resume", file);

        try {
            loadingOverlay.style.display = 'flex';
            
            const response = await fetch('/analyze_resume', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Analysis failed');
            }

            const result = await response.json();
            
            if (result.redirect) {
                window.location.href = result.redirect;
            } else if (result.data) {
                // Handle direct data response if needed
                console.log(result.data);
                window.location.href = "/editor";
            }
        } catch (error) {
            console.error("Error:", error);
            alert(`Error: ${error.message}`);
        } finally {
            loadingOverlay.style.display = 'none';
        }
    });
}

// Modal trigger with resume check
document.addEventListener("DOMContentLoaded", function() {
    const analyzeBtn = document.querySelector(".btn-primary");
    if (analyzeBtn) {
        analyzeBtn.addEventListener("click", function(event) {
            const resumeInput = document.getElementById("resumeUpload");
            
            if (!resumeInput || !resumeInput.files.length) {
                event.preventDefault();
                alert("Please upload a resume file first");
                return;
            }
            
            // If file exists, let the default modal behavior proceed
        });
    }
});

// Check for resume data on editor/dashboard pages
document.addEventListener("DOMContentLoaded", function() {
    if (window.location.pathname === '/editor' || window.location.pathname === '/dashboard') {
        fetch('/protected', {
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                window.location.href = '/auth';
            }
        })
        .catch(() => {
            window.location.href = '/auth';
        });
    }
});