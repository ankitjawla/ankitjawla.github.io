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

  describe('updateThemeIcon', () => {
    beforeEach(() => {
      document.body.innerHTML = '<button class="theme-toggle"><i class="fas fa-moon"></i></button>';
    });

    test('should set sun icon when theme is dark', () => {
      script.updateThemeIcon('dark');
      const icon = document.querySelector('.theme-toggle i');
      expect(icon.className).toBe('fas fa-sun');
    });

    test('should set moon icon when theme is light', () => {
      script.updateThemeIcon('light');
      const icon = document.querySelector('.theme-toggle i');
      expect(icon.className).toBe('fas fa-moon');
    });

    // Documents existing behavior: function assumes the icon exists and throws otherwise.
    test('throws if icon element is missing (regression guard)', () => {
      document.body.innerHTML = '';
      expect(() => script.updateThemeIcon('dark')).toThrow();
    });
  });

  describe('initThemeToggle', () => {
    let matchMediaListeners;

    beforeEach(() => {
      document.body.innerHTML = '<button class="theme-toggle"><i class="fas fa-moon"></i></button>';
      localStorage.clear();
      matchMediaListeners = [];
      window.matchMedia = jest.fn().mockImplementation(() => ({
        matches: false,
        addEventListener: jest.fn((_evt, cb) => matchMediaListeners.push(cb)),
        removeEventListener: jest.fn(),
      }));
    });

    test('uses saved localStorage theme on init', () => {
      localStorage.setItem('theme', 'dark');
      script.initThemeToggle();
      expect(document.body.getAttribute('data-theme')).toBe('dark');
      expect(document.querySelector('.theme-toggle i').className).toBe('fas fa-sun');
    });

    test('falls back to system dark preference when no saved theme', () => {
      window.matchMedia = jest.fn().mockImplementation(() => ({
        matches: true,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));
      script.initThemeToggle();
      expect(document.body.getAttribute('data-theme')).toBe('dark');
    });

    test('falls back to light when no saved theme and system is light', () => {
      script.initThemeToggle();
      expect(document.body.getAttribute('data-theme')).toBe('light');
    });

    test('toggles theme on button click and persists to localStorage', () => {
      script.initThemeToggle();
      expect(document.body.getAttribute('data-theme')).toBe('light');

      document.querySelector('.theme-toggle').click();
      expect(document.body.getAttribute('data-theme')).toBe('dark');
      expect(localStorage.getItem('theme')).toBe('dark');
      expect(document.querySelector('.theme-toggle i').className).toBe('fas fa-sun');

      document.querySelector('.theme-toggle').click();
      expect(document.body.getAttribute('data-theme')).toBe('light');
      expect(localStorage.getItem('theme')).toBe('light');
    });

    test('reacts to system color-scheme change', () => {
      script.initThemeToggle();
      expect(matchMediaListeners.length).toBe(1);

      matchMediaListeners[0]({ matches: true });
      expect(document.body.getAttribute('data-theme')).toBe('dark');
      expect(localStorage.getItem('theme')).toBe('dark');

      matchMediaListeners[0]({ matches: false });
      expect(document.body.getAttribute('data-theme')).toBe('light');
      expect(localStorage.getItem('theme')).toBe('light');
    });
  });

  describe('initFormHandling', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <form id="contactForm">
          <input name="name" />
          <input name="email" />
          <textarea name="message"></textarea>
        </form>
      `;
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('shows success and resets form when data is valid', () => {
      script.initFormHandling();
      const form = document.getElementById('contactForm');
      form.querySelector('[name="name"]').value = 'Jane Doe';
      form.querySelector('[name="email"]').value = 'jane@example.com';
      form.querySelector('[name="message"]').value = 'Hello, this is a long enough message.';
      const resetSpy = jest.spyOn(form, 'reset');

      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);

      expect(submitEvent.defaultPrevented).toBe(true);
      const success = form.querySelector('.form-message.success');
      expect(success).not.toBeNull();
      expect(success.textContent).toBe('Message sent successfully!');
      expect(resetSpy).toHaveBeenCalled();
    });

    test('shows error and does not reset when data is invalid', () => {
      script.initFormHandling();
      const form = document.getElementById('contactForm');
      form.querySelector('[name="name"]').value = 'J'; // too short
      form.querySelector('[name="email"]').value = 'jane@example.com';
      form.querySelector('[name="message"]').value = 'Hello, valid message body here.';
      const resetSpy = jest.spyOn(form, 'reset');

      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);

      expect(submitEvent.defaultPrevented).toBe(true);
      expect(form.querySelector('.form-message.error')).not.toBeNull();
      expect(form.querySelector('.form-message.success')).toBeNull();
      expect(resetSpy).not.toHaveBeenCalled();
    });

    test('does nothing when form is absent', () => {
      document.body.innerHTML = '';
      expect(() => script.initFormHandling()).not.toThrow();
    });
  });

  describe('initSmoothScrolling', () => {
    let scrollIntoViewSpy;

    beforeEach(() => {
      document.body.innerHTML = `
        <a href="#about" id="link"></a>
        <section id="about"></section>
      `;
      scrollIntoViewSpy = jest.fn();
      Element.prototype.scrollIntoView = scrollIntoViewSpy;
    });

    test('intercepts anchor click and calls scrollIntoView with smooth options', () => {
      script.initSmoothScrolling();
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      document.getElementById('link').dispatchEvent(clickEvent);

      expect(clickEvent.defaultPrevented).toBe(true);
      expect(scrollIntoViewSpy).toHaveBeenCalledTimes(1);
      expect(scrollIntoViewSpy).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    });

    test('does not call scrollIntoView when target is missing', () => {
      document.body.innerHTML = '<a href="#missing" id="link"></a>';
      script.initSmoothScrolling();
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      document.getElementById('link').dispatchEvent(clickEvent);

      expect(clickEvent.defaultPrevented).toBe(true);
      expect(scrollIntoViewSpy).not.toHaveBeenCalled();
    });
  });

  describe('initImageLoading', () => {
    test('adds loaded class immediately when image.complete is true', () => {
      document.body.innerHTML = '<img id="i1" />';
      const img = document.getElementById('i1');
      Object.defineProperty(img, 'complete', { value: true, configurable: true });

      script.initImageLoading();
      expect(img.classList.contains('loaded')).toBe(true);
    });

    test('adds loaded class on load event when image.complete is false', () => {
      document.body.innerHTML = '<img id="i2" />';
      const img = document.getElementById('i2');
      Object.defineProperty(img, 'complete', { value: false, configurable: true });

      script.initImageLoading();
      expect(img.classList.contains('loaded')).toBe(false);

      img.dispatchEvent(new Event('load'));
      expect(img.classList.contains('loaded')).toBe(true);
    });
  });

  describe('initScrollAnimations', () => {
    let observeSpy;
    let unobserveSpy;
    let observerCallback;

    beforeEach(() => {
      observeSpy = jest.fn();
      unobserveSpy = jest.fn();
      global.IntersectionObserver = jest.fn((cb) => {
        observerCallback = cb;
        return { observe: observeSpy, unobserve: unobserveSpy, disconnect: jest.fn() };
      });
      document.body.innerHTML = `
        <section class="section" id="s1"></section>
        <section class="section" id="s2"></section>
      `;
    });

    test('initializes sections with hidden state and observes them', () => {
      script.initScrollAnimations();
      const sections = document.querySelectorAll('.section');
      sections.forEach((s) => {
        expect(s.style.opacity).toBe('0');
        expect(s.style.transform).toBe('translateY(20px)');
      });
      expect(observeSpy).toHaveBeenCalledTimes(sections.length);
    });

    test('reveals section and unobserves it on intersection', () => {
      script.initScrollAnimations();
      const target = document.getElementById('s1');
      const fakeObserver = { unobserve: unobserveSpy };
      observerCallback([{ isIntersecting: true, target }], fakeObserver);

      expect(target.style.opacity).toBe('1');
      expect(target.style.transform).toBe('translateY(0)');
      expect(unobserveSpy).toHaveBeenCalledWith(target);
    });

    test('does nothing for non-intersecting entries', () => {
      script.initScrollAnimations();
      const target = document.getElementById('s2');
      observerCallback([{ isIntersecting: false, target }], { unobserve: unobserveSpy });

      expect(target.style.opacity).toBe('0');
      expect(unobserveSpy).not.toHaveBeenCalled();
    });
  });

  describe('scroll-spy nav active class', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <nav>
          <a href="#one"></a>
          <a href="#two"></a>
        </nav>
        <section id="one"></section>
        <section id="two"></section>
      `;
      const one = document.getElementById('one');
      const two = document.getElementById('two');
      Object.defineProperty(one, 'offsetTop', { value: 0, configurable: true });
      Object.defineProperty(one, 'clientHeight', { value: 500, configurable: true });
      Object.defineProperty(two, 'offsetTop', { value: 500, configurable: true });
      Object.defineProperty(two, 'clientHeight', { value: 500, configurable: true });
    });

    test('marks the section currently in view as active', () => {
      window.pageYOffset = 600;
      window.dispatchEvent(new Event('scroll'));
      const links = document.querySelectorAll('nav a');
      expect(links[0].classList.contains('active')).toBe(false);
      expect(links[1].classList.contains('active')).toBe(true);
    });

    test('switches active class as scroll position changes', () => {
      window.pageYOffset = 0;
      window.dispatchEvent(new Event('scroll'));
      let links = document.querySelectorAll('nav a');
      expect(links[0].classList.contains('active')).toBe(true);
      expect(links[1].classList.contains('active')).toBe(false);

      window.pageYOffset = 700;
      window.dispatchEvent(new Event('scroll'));
      links = document.querySelectorAll('nav a');
      expect(links[0].classList.contains('active')).toBe(false);
      expect(links[1].classList.contains('active')).toBe(true);
    });
  });

  describe('DOMContentLoaded integration', () => {
    let scrollIntoViewSpy;
    let scrollToSpy;

    beforeEach(() => {
      document.body.innerHTML = `
        <nav>
          <a href="#about"></a>
        </nav>
        <ul class="skill-list">
          <li>Skill A</li>
        </ul>
        <section id="about">
          <div class="container"></div>
        </section>
        <div class="skills-container"></div>
        <button class="theme-toggle"><i class="fas fa-moon"></i></button>
        <a href="#about" id="anchor"></a>
      `;
      localStorage.clear();

      window.matchMedia = jest.fn().mockImplementation(() => ({
        matches: false,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      }));
      global.IntersectionObserver = jest.fn(() => ({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      }));
      scrollIntoViewSpy = jest.fn();
      Element.prototype.scrollIntoView = scrollIntoViewSpy;
      scrollToSpy = jest.fn();
      window.scrollTo = scrollToSpy;
      // The handler calls createSkillsMatrix() as a global — mirror the
      // browser load order by exposing it before dispatching.
      global.createSkillsMatrix = require('./features/skillsMatrix').createSkillsMatrix;
    });

    test('wires print button, theme, skills, hover, and nav', () => {
      document.dispatchEvent(new Event('DOMContentLoaded'));

      const printButton = document.querySelector('#about .container .print-button');
      expect(printButton).not.toBeNull();
      expect(printButton.innerHTML).toContain('Print Resume');

      expect(document.body.getAttribute('data-theme')).toBe('light');
      expect(document.querySelectorAll('.skill-category').length).toBeGreaterThan(0);

      const skillItem = document.querySelector('.skill-list li');
      skillItem.dispatchEvent(new Event('mouseenter'));
      expect(skillItem.classList.contains('highlight')).toBe(true);
      skillItem.dispatchEvent(new Event('mouseleave'));
      expect(skillItem.classList.contains('highlight')).toBe(false);
    });

    test('nav link click scrolls and prevents default', () => {
      const aboutSection = document.getElementById('about');
      Object.defineProperty(aboutSection, 'offsetTop', { value: 800, configurable: true });

      document.dispatchEvent(new Event('DOMContentLoaded'));

      const navLink = document.querySelector('nav a');
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      navLink.dispatchEvent(clickEvent);

      expect(clickEvent.defaultPrevented).toBe(true);
      expect(scrollToSpy).toHaveBeenCalledWith({ top: 730, behavior: 'smooth' });
    });

    test('print button click invokes window.print', () => {
      document.dispatchEvent(new Event('DOMContentLoaded'));
      const originalPrint = window.print;
      window.print = jest.fn();
      try {
        document.querySelector('#about .container .print-button').click();
        expect(window.print).toHaveBeenCalledTimes(1);
      } finally {
        window.print = originalPrint;
      }
    });

    test('inline anchor[href^="#"] handler triggers smooth scrollIntoView', () => {
      document.dispatchEvent(new Event('DOMContentLoaded'));
      scrollIntoViewSpy.mockClear();

      const anchor = document.getElementById('anchor');
      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      anchor.dispatchEvent(clickEvent);

      expect(clickEvent.defaultPrevented).toBe(true);
      // Two listeners are bound on a[href^="#"] — one from initSmoothScrolling
      // (block: 'start'), one from the inline DOMContentLoaded loop.
      expect(scrollIntoViewSpy).toHaveBeenCalled();
    });
  });
});
