// PDF Resume Generator
function initPDFGenerator() {
    const generatePDFButton = document.createElement('button');
    generatePDFButton.className = 'pdf-button';
    generatePDFButton.innerHTML = '<i class="fas fa-file-pdf"></i> Download PDF';
    
    generatePDFButton.addEventListener('click', generatePDF);
    
    // Add button to the about section
    const aboutSection = document.querySelector('#about .container');
    if (aboutSection) {
        aboutSection.appendChild(generatePDFButton);
    }
}

async function generatePDF() {
    // Show loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-indicator';
    loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
    document.body.appendChild(loadingDiv);

    try {
        // Create a deep clone of the body
        const content = document.body.cloneNode(true);
        
        // Remove unnecessary elements
        const elementsToRemove = content.querySelectorAll('.theme-toggle, .pdf-button, .contact-form, nav');
        elementsToRemove.forEach(el => el.remove());
        
        // Configure PDF options
        const options = {
            margin: 10,
            filename: 'Ankit_Jawla_Resume.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Generate PDF
        await html2pdf().set(options).from(content).save();
        
        // Show success message
        showMessage('PDF generated successfully!', 'success');
    } catch (error) {
        console.error('PDF generation failed:', error);
        showMessage('Failed to generate PDF. Please try again.', 'error');
    } finally {
        // Remove loading indicator
        loadingDiv.remove();
    }
}

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `pdf-message ${type}`;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
} 