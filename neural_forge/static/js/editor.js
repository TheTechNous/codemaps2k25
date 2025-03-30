document.addEventListener("DOMContentLoaded", function() {
    // Check if user is authenticated and has resume data
    checkAuthAndData();
    
    // Initialize editor with session data
    initializeEditor();

    // Save functionality
    document.getElementById("saveBtn").addEventListener("click", saveResume);

    // PDF Generation
    document.getElementById("downloadBtn").addEventListener("click", generatePDF);

    // Logout functionality
    document.getElementById("logoutBtn").addEventListener("click", logoutUser);
});

function checkAuthAndData() {
    // Verify user is authenticated and has resume data
    if (!sessionStorage.getItem('resume_data')) {
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
}

function initializeEditor() {
    // Load resume data from session
    const resumeData = JSON.parse(sessionStorage.getItem('resume_data')) || {};
    
    // Populate editor fields
    document.getElementById("name").textContent = resumeData.name || "Your Name";
    document.getElementById("summary").textContent = resumeData.summary || "Professional summary";
    document.getElementById("email").textContent = resumeData.email || "your.email@example.com";
    document.getElementById("linkedin").textContent = resumeData.linkedin || "linkedin.com/in/yourprofile";
    document.getElementById("github").textContent = resumeData.github || "github.com/yourusername";
    
    // Make fields editable
    makeFieldsEditable();
}

function makeFieldsEditable() {
    // Make all resume fields contenteditable
    const editableFields = document.querySelectorAll('[data-editable="true"]');
    editableFields.forEach(field => {
        field.setAttribute('contenteditable', 'true');
        field.addEventListener('blur', function() {
            // Add visual feedback when editing is done
            this.classList.remove('editing');
        });
        field.addEventListener('focus', function() {
            this.classList.add('editing');
        });
    });
}

async function saveResume() {
    const saveBtn = document.getElementById("saveBtn");
    const spinner = saveBtn.querySelector('.spinner-border');
    const btnText = saveBtn.querySelector('.btn-text');
    
    try {
        // Show loading state
        saveBtn.disabled = true;
        spinner.classList.remove('d-none');
        btnText.textContent = 'Saving...';
        
        // Collect updated data
        const updatedData = {
            name: document.getElementById("name").textContent.trim(),
            summary: document.getElementById("summary").textContent.trim(),
            email: document.getElementById("email").textContent.trim(),
            linkedin: document.getElementById("linkedin").textContent.trim(),
            github: document.getElementById("github").textContent.trim(),
            skills: Array.from(document.querySelectorAll("#skills li")).map(li => li.textContent.trim()),
            experience: Array.from(document.querySelectorAll("#experience li")).map(li => li.textContent.trim()),
            education: Array.from(document.querySelectorAll("#education li")).map(li => li.textContent.trim()),
            projects: Array.from(document.querySelectorAll("#projects li")).map(li => li.textContent.trim())
        };

        // Send to server
        const response = await fetch('/save_resume', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify(updatedData),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to save resume');
        }

        const result = await response.json();
        
        // Update local storage with new data
        sessionStorage.setItem('resume_data', JSON.stringify(result.updatedResume));
        
        // Show success feedback
        showAlert('Resume saved successfully!', 'success');
    } catch (error) {
        console.error('Save error:', error);
        showAlert('Failed to save resume. Please try again.', 'danger');
    } finally {
        // Restore button state
        saveBtn.disabled = false;
        spinner.classList.add('d-none');
        btnText.textContent = 'Save Resume';
    }
}

function generatePDF() {
    const downloadBtn = document.getElementById("downloadBtn");
    const spinner = downloadBtn.querySelector('.spinner-border');
    const btnText = downloadBtn.querySelector('.btn-text');
    
    try {
        // Show loading state
        downloadBtn.disabled = true;
        spinner.classList.remove('d-none');
        btnText.textContent = 'Generating...';
        
        // Get the resume element to print
        const element = document.getElementById("resume-container");
        
        // Use html2pdf.js for PDF generation
        const opt = {
            margin: 10,
            filename: 'my_resume.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Generate and download PDF
        html2pdf().from(element).set(opt).save()
            .then(() => {
                showAlert('PDF downloaded successfully!', 'success');
            });
    } catch (error) {
        console.error('PDF generation error:', error);
        showAlert('Failed to generate PDF. Please try again.', 'danger');
    } finally {
        // Restore button state
        downloadBtn.disabled = false;
        spinner.classList.add('d-none');
        btnText.textContent = 'Download PDF';
    }
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const container = document.getElementById('alerts-container') || document.body;
    container.prepend(alertDiv);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => alertDiv.remove(), 150);
    }, 5000);
}

async function logoutUser() {
    try {
        const response = await fetch('/logout', {
            method: 'POST',
            credentials: 'include'
        });
        
        if (response.ok) {
            // Clear client-side storage
            localStorage.removeItem('access_token');
            sessionStorage.removeItem('resume_data');
            
            // Redirect to home page
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Logout error:', error);
        showAlert('Failed to logout. Please try again.', 'danger');
    }
}

// Add this to your HTML head when using html2pdf:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>