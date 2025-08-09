// js/features/skillsMatrix.test.js
const { createSkillsMatrix, skillsData } = require('./skillsMatrix');

// Mock IntersectionObserver
let mockObserve = jest.fn();
let mockUnobserve = jest.fn();
let intersectionCallback;

global.IntersectionObserver = jest.fn((callback, options) => {
  intersectionCallback = callback; // Store the callback
  return {
    observe: mockObserve,
    unobserve: mockUnobserve,
    disconnect: jest.fn(),
    root: null,
    rootMargin: '',
    thresholds: options ? options.threshold : [], // Store threshold if provided
  };
});

describe('Skills Matrix', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div class="skills-container"></div>';
    mockObserve.mockClear();
    mockUnobserve.mockClear();
    global.IntersectionObserver.mockClear();
    intersectionCallback = undefined;
  });

  test('should do nothing if skills-container is not found', () => {
    document.body.innerHTML = ''; // Remove the container
    createSkillsMatrix();
    // Assertions: expect no elements were created or observer not called
    const container = document.querySelector('.skills-container');
    expect(container).toBeNull();
    expect(global.IntersectionObserver).not.toHaveBeenCalled();
  });

  test('should clear existing content in skills-container', () => {
    const container = document.querySelector('.skills-container');
    container.innerHTML = '<p>Old content</p>';
    createSkillsMatrix();
    expect(container.querySelector('p')).toBeNull();
    // Check if new content is there (e.g., at least one category)
    expect(container.querySelector('.skill-category')).not.toBeNull();
  });

  describe('HTML Structure Generation', () => {
    beforeEach(() => {
        createSkillsMatrix();
    });

    test('should create correct number of skill categories', () => {
        const categories = document.querySelectorAll('.skill-category');
        expect(categories.length).toBe(Object.keys(skillsData).length);
    });

    test('each category should have matrix-style class and an h3 title', () => {
        const categories = document.querySelectorAll('.skill-category');
        categories.forEach((categoryDiv, index) => {
            expect(categoryDiv.classList.contains('skill-category')).toBe(true);
            expect(categoryDiv.classList.contains('matrix-style')).toBe(true);
            const categoryTitle = categoryDiv.querySelector('h3');
            expect(categoryTitle).not.toBeNull();
            expect(categoryTitle.textContent).toBe(Object.keys(skillsData)[index]);
        });
    });

    test('each skill should have correct structure and attributes', () => {
        Object.entries(skillsData).forEach(([categoryName, skills]) => {
            const categoryDiv = Array.from(document.querySelectorAll('.skill-category'))
                                     .find(div => div.querySelector('h3').textContent === categoryName);
            expect(categoryDiv).not.toBeNull();

            const skillContainers = categoryDiv.querySelectorAll('.skill-bar-container');
            expect(skillContainers.length).toBe(Object.keys(skills).length);

            Object.entries(skills).forEach(([skillName, proficiency]) => {
                const skillContainer = Array.from(skillContainers)
                                            .find(sc => sc.querySelector('.skill-label').textContent === skillName);
                expect(skillContainer).not.toBeNull();

                const skillLabel = skillContainer.querySelector('.skill-label');
                expect(skillLabel).not.toBeNull();
                expect(skillLabel.textContent).toBe(skillName);

                const skillBar = skillContainer.querySelector('.skill-bar');
                expect(skillBar).not.toBeNull();

                const skillProgress = skillBar.querySelector('.skill-progress');
                expect(skillProgress).not.toBeNull();
                expect(skillProgress.style.width).toBe('0%');
                expect(skillProgress.getAttribute('data-progress')).toBe(`${proficiency}%`);

                const skillValue = skillContainer.querySelector('.skill-value');
                expect(skillValue).not.toBeNull();
                expect(skillValue.textContent).toBe(`${proficiency}%`);
            });
        });
    });
  });


  test('should call IntersectionObserver constructor once with correct options', () => {
    createSkillsMatrix();
    expect(global.IntersectionObserver).toHaveBeenCalledTimes(1);
    expect(global.IntersectionObserver.mock.calls[0][1]).toEqual({ threshold: 0.2 });
  });

  test('should call IntersectionObserver.observe for each category', () => {
    createSkillsMatrix();
    const categories = document.querySelectorAll('.skill-category');
    // Ensure IntersectionObserver was called before checking observe, otherwise categories might not exist
    expect(global.IntersectionObserver).toHaveBeenCalled();
    expect(mockObserve).toHaveBeenCalledTimes(categories.length);
    categories.forEach(category => {
      expect(mockObserve).toHaveBeenCalledWith(category);
    });
  });

  test('should animate skill bars when they intersect', () => {
    createSkillsMatrix();
    // Ensure the callback is captured
    expect(intersectionCallback).toBeDefined();

    const categoryDivs = document.querySelectorAll('.skill-category');
    expect(categoryDivs.length).toBeGreaterThan(0);

    categoryDivs.forEach(categoryDiv => {
        // Simulate this category becoming visible
        intersectionCallback([{ isIntersecting: true, target: categoryDiv }], {});

        const progressBars = categoryDiv.querySelectorAll('.skill-progress');
        progressBars.forEach(bar => {
            expect(bar.style.width).toBe(bar.getAttribute('data-progress'));
        });
    });
  });

  test('should not change skill bar width if not intersecting', () => {
    createSkillsMatrix();
    expect(intersectionCallback).toBeDefined();

    const categoryDivs = document.querySelectorAll('.skill-category');
    expect(categoryDivs.length).toBeGreaterThan(0);

    categoryDivs.forEach(categoryDiv => {
        // Ensure initial state is 0% or as expected before non-intersection
        const progressBars = categoryDiv.querySelectorAll('.skill-progress');
        progressBars.forEach(bar => {
            expect(bar.style.width).toBe('0%'); // Assuming it starts at 0%
        });

        // Simulate this category NOT becoming visible
        intersectionCallback([{ isIntersecting: false, target: categoryDiv }], {});

        // Verify width remains unchanged (still 0%)
        progressBars.forEach(bar => {
            expect(bar.style.width).toBe('0%');
        });
    });
  });

  test('should handle multiple entries in intersectionCallback', () => {
    createSkillsMatrix();
    expect(intersectionCallback).toBeDefined();
    const categoryDivs = document.querySelectorAll('.skill-category');
    if (categoryDivs.length < 2) {
        console.warn("Skipping multiple entries test: Less than 2 categories found.");
        return; // Skip if not enough categories to test this scenario
    }

    const entry1 = { isIntersecting: true, target: categoryDivs[0] };
    const entry2 = { isIntersecting: false, target: categoryDivs[1] }; // This one shouldn't animate

    intersectionCallback([entry1, entry2], {});

    // Check category 1 (intersecting)
    const progressBars1 = categoryDivs[0].querySelectorAll('.skill-progress');
    progressBars1.forEach(bar => {
        expect(bar.style.width).toBe(bar.getAttribute('data-progress'));
    });

    // Check category 2 (not intersecting)
    const progressBars2 = categoryDivs[1].querySelectorAll('.skill-progress');
    progressBars2.forEach(bar => {
        expect(bar.style.width).toBe('0%'); // Assuming it starts at 0% and stays
    });
  });
});
