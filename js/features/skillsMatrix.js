// Skills Matrix Visualization
const skillsData = {
    'Artificial Intelligence & ML': {
        'Generative AI': 95,
        'LangChain Framework': 90,
        'Machine Learning': 85,
        'Deep Learning': 80,
        'Python for AI': 90,
        'Vertex AI Studio': 85,
        'OpenAI API': 90
    },
    'Cloud & DevOps': {
        'AWS': 90,
        'Azure': 85,
        'Google Cloud': 80,
        'Docker': 85,
        'Kubernetes': 75,
        'CI/CD': 85
    },
    'Programming & Databases': {
        'Python': 95,
        'JavaScript': 85,
        'SQL': 90,
        'NoSQL': 80,
        'REST APIs': 90
    },
    'Regulatory & Finance': {
        'AxiomSL': 95,
        'COREP/FINREP': 90,
        'Basel Regulations': 85,
        'Financial Reporting': 90
    }
};

function createSkillsMatrix() {
    const container = document.querySelector('.skills-container');
    if (!container) return;

    container.innerHTML = ''; // Clear existing content

    Object.entries(skillsData).forEach(([category, skills]) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'skill-category matrix-style';
        
        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = category;
        categoryDiv.appendChild(categoryTitle);

        Object.entries(skills).forEach(([skill, proficiency]) => {
            const skillDiv = document.createElement('div');
            skillDiv.className = 'skill-bar-container';
            
            const skillLabel = document.createElement('div');
            skillLabel.className = 'skill-label';
            skillLabel.textContent = skill;

            const skillBar = document.createElement('div');
            skillBar.className = 'skill-bar';
            
            const skillProgress = document.createElement('div');
            skillProgress.className = 'skill-progress';
            skillProgress.style.width = '0%';
            skillProgress.setAttribute('data-progress', `${proficiency}%`);

            const skillValue = document.createElement('span');
            skillValue.className = 'skill-value';
            skillValue.textContent = `${proficiency}%`;

            skillBar.appendChild(skillProgress);
            skillDiv.appendChild(skillLabel);
            skillDiv.appendChild(skillBar);
            skillDiv.appendChild(skillValue);
            categoryDiv.appendChild(skillDiv);
        });

        container.appendChild(categoryDiv);
    });

    // Animate skill bars when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = entry.target.querySelectorAll('.skill-progress');
                bars.forEach(bar => {
                    const progress = bar.getAttribute('data-progress');
                    bar.style.width = progress;
                });
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.skill-category').forEach(category => {
        observer.observe(category);
    });
} 