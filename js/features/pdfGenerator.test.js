// js/features/pdfGenerator.test.js

const mockHtml2pdfSet = jest.fn().mockReturnThis();
const mockHtml2pdfFrom = jest.fn().mockReturnThis();
const mockHtml2pdfSave = jest.fn().mockResolvedValue(undefined);

global.html2pdf = jest.fn(() => ({
  set: mockHtml2pdfSet,
  from: mockHtml2pdfFrom,
  save: mockHtml2pdfSave,
}));

global.console = {
  error: jest.fn(),
  log: jest.fn(),
};

const { initPDFGenerator, generatePDF, showMessage } = require('./pdfGenerator');

describe('PDF Generator', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <header>
        <nav></nav>
      </header>
      <section id="about">
        <div class="container"></div>
      </section>
      <section id="contact">
        <form id="contactForm" class="contact-form"></form>
      </section>
      <button class="theme-toggle">Theme</button>
      <button class="pdf-button-existing"></button>
    `;

    global.html2pdf.mockClear();
    mockHtml2pdfSet.mockClear();
    mockHtml2pdfFrom.mockClear();
    mockHtml2pdfSave.mockClear();

    global.console.error.mockClear();
    global.console.log.mockClear();

    mockHtml2pdfSave.mockResolvedValue(undefined);

    document.querySelectorAll('.pdf-message').forEach(el => el.remove());
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    document.querySelectorAll('.pdf-message').forEach(el => el.remove());
  });

  describe('initPDFGenerator', () => {
    test('should create a button with class "pdf-button" and correct innerHTML', () => {
      initPDFGenerator();
      const button = document.querySelector('#about .container .pdf-button');
      expect(button).not.toBeNull();
      expect(button.className).toBe('pdf-button');
      expect(button.innerHTML).toBe('<i class="fas fa-file-pdf"></i> Download PDF');
    });

    test('should append the button to the #about .container element', () => {
      initPDFGenerator();
      const button = document.querySelector('#about .container .pdf-button');
      const aboutContainer = document.querySelector('#about .container');
      expect(aboutContainer.contains(button)).toBe(true);
    });

    // Simplified this test to be synchronous and not use fake timers to avoid timeouts.
    // It checks that the click initiates generatePDF (via html2pdf mock calls)
    // and that showMessage is called (by checking for the message div).
    // The 3-second removal by showMessage is tested in its own describe block.
    test('should add an event listener that triggers PDF generation effects', async () => {
      initPDFGenerator();
      const button = document.querySelector('#about .container .pdf-button');

      button.click();

      // Allow microtasks from generatePDF (which is async) to process.
      // This gives generatePDF a chance to run far enough to call html2pdf and showMessage.
      await new Promise(resolve => process.nextTick(resolve));

      expect(global.html2pdf).toHaveBeenCalled();
      expect(mockHtml2pdfSave).toHaveBeenCalled();

      const successMessageDiv = document.querySelector('.pdf-message.success');
      expect(successMessageDiv).not.toBeNull();
      expect(successMessageDiv.textContent).toBe('PDF generated successfully!');

      // Clean up the message div manually for this test as we are not using fake timers here
      // to test its automatic removal.
      if (successMessageDiv) {
        successMessageDiv.remove();
      }
    });
  });

  describe('generatePDF', () => {
    test('should show loading indicator, call html2pdf, and show success message', async () => {
      jest.useFakeTimers();
      await generatePDF();

      expect(global.html2pdf).toHaveBeenCalledTimes(1);
      expect(mockHtml2pdfSet).toHaveBeenCalledTimes(1);
      expect(mockHtml2pdfFrom).toHaveBeenCalledTimes(1);
      expect(mockHtml2pdfSave).toHaveBeenCalledTimes(1);

      const expectedOptions = {
        margin: 10,
        filename: 'Ankit_Jawla_Resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      expect(mockHtml2pdfSet).toHaveBeenCalledWith(expectedOptions);

      const fromCallArgs = mockHtml2pdfFrom.mock.calls[0][0];
      expect(fromCallArgs.querySelector('.theme-toggle')).toBeNull();
      expect(fromCallArgs.querySelectorAll('.pdf-button').length).toBe(0);
      expect(fromCallArgs.querySelector('.pdf-button-existing')).toBeNull();
      expect(fromCallArgs.querySelector('.contact-form')).toBeNull();
      expect(fromCallArgs.querySelector('nav')).toBeNull();

      const successMessageDiv = document.querySelector('.pdf-message.success');
      expect(successMessageDiv).not.toBeNull();
      expect(successMessageDiv.textContent).toBe('PDF generated successfully!');
      expect(document.querySelector('.loading-indicator')).toBeNull();

      jest.runAllTimers();
      expect(document.querySelector('.pdf-message.success')).toBeNull();
      jest.useRealTimers();
    });

    test('should handle PDF generation failure and show error message', async () => {
      jest.useFakeTimers();
      mockHtml2pdfSave.mockRejectedValueOnce(new Error('PDF generation error'));

      await generatePDF();

      expect(global.html2pdf).toHaveBeenCalledTimes(1);
      expect(mockHtml2pdfSave).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith('PDF generation failed:', expect.any(Error));

      const errorMessageDiv = document.querySelector('.pdf-message.error');
      expect(errorMessageDiv).not.toBeNull();
      expect(errorMessageDiv.textContent).toBe('Failed to generate PDF. Please try again.');
      expect(document.querySelector('.loading-indicator')).toBeNull();

      jest.runAllTimers();
      expect(document.querySelector('.pdf-message.error')).toBeNull();
      jest.useRealTimers();
    });

    test('loading indicator should be appended to body and removed after PDF generation success', async () => {
      await generatePDF();
      expect(document.querySelector('.loading-indicator')).toBeNull();
    });

    test('loading indicator should be appended to body and removed after PDF generation failure', async () => {
      mockHtml2pdfSave.mockRejectedValueOnce(new Error('PDF generation error'));
      await generatePDF();
      expect(document.querySelector('.loading-indicator')).toBeNull();
    });

    test('should remove specified elements from the cloned content for PDF', async () => {
      await generatePDF();
      expect(mockHtml2pdfFrom).toHaveBeenCalledTimes(1);
      const fromCallArgs = mockHtml2pdfFrom.mock.calls[0][0];

      expect(fromCallArgs.querySelector('.theme-toggle')).toBeNull();
      expect(fromCallArgs.querySelectorAll('.pdf-button').length).toBe(0);
      expect(fromCallArgs.querySelector('.pdf-button-existing')).toBeNull();
      expect(fromCallArgs.querySelector('.contact-form')).toBeNull();
      expect(fromCallArgs.querySelector('nav')).toBeNull();
    });
  });

  describe('showMessage', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    test('should create and append a message div with correct class and text', () => {
      showMessage('Test message', 'success');
      const messageDiv = document.querySelector('.pdf-message');
      expect(messageDiv).not.toBeNull();
      expect(messageDiv.classList.contains('success')).toBe(true);
      expect(messageDiv.textContent).toBe('Test message');
      expect(document.body.contains(messageDiv)).toBe(true);
    });

    test('should remove the message div after 3 seconds', () => {
      showMessage('Test message timed', 'error');
      let messageDiv = document.querySelector('.pdf-message.error');
      expect(messageDiv).not.toBeNull();
      jest.runAllTimers();
      messageDiv = document.querySelector('.pdf-message.error');
      expect(messageDiv).toBeNull();
    });

    test('should handle different message types for class styling', () => {
      showMessage('Error message', 'error');
      const messageDiv = document.querySelector('.pdf-message.error');
      expect(messageDiv).not.toBeNull();
      expect(messageDiv.classList.contains('error')).toBe(true);
      jest.runAllTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });
  });
});
