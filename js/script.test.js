// js/script.test.js
const script = require('./script'); // Imports all exported functions

describe('Main Script Tests', () => {
  describe('validateForm', () => {
    let mockShowFormMessage;

    beforeEach(() => {
      document.body.innerHTML = '<form id="contactForm"></form>';
      // Spy on and mock showFormMessage just for validateForm tests
      // The actual showFormMessage is on the 'script' object (our import)
      mockShowFormMessage = jest.spyOn(script, 'showFormMessage').mockImplementation(() => {});
    });

    afterEach(() => {
      // Restore original implementation of showFormMessage after each test in this suite
      mockShowFormMessage.mockRestore();
    });

    test('should return true for valid data and not call showFormMessage', () => {
      const result = script.validateForm({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a valid message.',
      });
      expect(result).toBe(true);
      expect(mockShowFormMessage).not.toHaveBeenCalled();
    });

    test('should return false for invalid name (too short) and call showFormMessage', () => {
      const result = script.validateForm({
        name: 'J',
        email: 'john@example.com',
        message: 'Valid message.',
      });
      expect(result).toBe(false);
      expect(mockShowFormMessage).toHaveBeenCalledTimes(1);
      expect(mockShowFormMessage).toHaveBeenCalledWith('Please enter a valid name', 'error');
    });

    test('should return false for missing name and call showFormMessage', () => {
      const result = script.validateForm({
        email: 'john@example.com',
        message: 'Valid message.',
      });
      expect(result).toBe(false);
      expect(mockShowFormMessage).toHaveBeenCalledTimes(1);
      expect(mockShowFormMessage).toHaveBeenCalledWith('Please enter a valid name', 'error');
    });

    test('should return false for invalid email and call showFormMessage', () => {
      const result = script.validateForm({
        name: 'John Doe',
        email: 'invalid-email',
        message: 'Valid message.',
      });
      expect(result).toBe(false);
      expect(mockShowFormMessage).toHaveBeenCalledTimes(1);
      expect(mockShowFormMessage).toHaveBeenCalledWith('Please enter a valid email address', 'error');
    });

    test('should return false for missing email and call showFormMessage', () => {
      const result = script.validateForm({
        name: 'John Doe',
        message: 'Valid message.',
      });
      expect(result).toBe(false);
      // This will actually call showFormMessage for the email error first if name is valid.
      // Based on current validateForm logic, email is checked after name.
      expect(mockShowFormMessage).toHaveBeenCalledTimes(1);
      expect(mockShowFormMessage).toHaveBeenCalledWith('Please enter a valid email address', 'error');
    });


    test('should return false for invalid message (too short) and call showFormMessage', () => {
      const result = script.validateForm({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Short',
      });
      expect(result).toBe(false);
      expect(mockShowFormMessage).toHaveBeenCalledTimes(1);
      expect(mockShowFormMessage).toHaveBeenCalledWith('Please enter a message (minimum 10 characters)', 'error');
    });

    test('should return false for missing message and call showFormMessage', () => {
      const result = script.validateForm({
        name: 'John Doe',
        email: 'john@example.com',
      });
      expect(result).toBe(false);
      expect(mockShowFormMessage).toHaveBeenCalledTimes(1);
      expect(mockShowFormMessage).toHaveBeenCalledWith('Please enter a message (minimum 10 characters)', 'error');
    });
  });

  describe('showFormMessage', () => {
    beforeEach(() => {
      document.body.innerHTML = '<form id="contactForm"></form>';
      jest.useFakeTimers(); // Use fake timers for setTimeout
    });

    afterEach(() => {
      jest.useRealTimers(); // Restore real timers
      // Clean up any messages that might not have been removed if a test failed mid-way
      const existingMessages = document.querySelectorAll('.form-message');
      existingMessages.forEach(msg => msg.remove());
    });

    test('should create and append success message div, then remove it after timeout', () => {
      const form = document.getElementById('contactForm');
      script.showFormMessage('Test success', 'success'); // Use the real one

      const messageDiv = form.querySelector('.form-message.success');
      expect(messageDiv).not.toBeNull();
      expect(messageDiv.classList.contains('form-message')).toBe(true);
      expect(messageDiv.classList.contains('success')).toBe(true);
      expect(messageDiv.textContent).toBe('Test success');
      expect(form.contains(messageDiv)).toBe(true);

      // Fast-forward timers
      jest.runAllTimers();
      expect(form.querySelector('.form-message.success')).toBeNull();
    });

    test('should create and append error message div, then remove it after timeout', () => {
      const form = document.getElementById('contactForm');
      script.showFormMessage('Test error', 'error'); // Use the real one

      const messageDiv = form.querySelector('.form-message.error');
      expect(messageDiv).not.toBeNull();
      expect(messageDiv.classList.contains('form-message')).toBe(true);
      expect(messageDiv.classList.contains('error')).toBe(true);
      expect(messageDiv.textContent).toBe('Test error');
      expect(form.contains(messageDiv)).toBe(true);

      // Fast-forward timers
      jest.runAllTimers();
      expect(form.querySelector('.form-message.error')).toBeNull();
    });

    test('should handle form not being present gracefully', () => {
      document.body.innerHTML = ''; // Remove the form
      // Expect no error to be thrown
      expect(() => {
        script.showFormMessage('Test message on no form', 'success');
        // Try to run timers, though no message should have been added
        jest.runAllTimers();
      }).not.toThrow();
      // Also check that no message was somehow added to the body if form was null
      expect(document.querySelector('.form-message')).toBeNull();
    });
  });
});
