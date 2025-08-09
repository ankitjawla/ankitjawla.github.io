// Skills Matrix Visualization
const skillsData = {
    'Artificial Intelligence & ML': {
        'Generative AI': 95,
        'LangChain Framework': 90,
        'Machine Learning': 85,
        'Deep Learning': 80,
        'Python for AI': 90,
        'Vertex AI Studio': 85,
        'OpenAI API': 90,
        'RAG Systems': 88,
        'NLP': 85,
        'Prompt Engineering': 92
    },
    'Cloud & DevOps': {
        'AWS': 90,
        'Azure': 85,
        'Google Cloud': 80,
        'Docker': 85,
        'Kubernetes': 75,
        'CI/CD': 85,
        'Terraform': 80,
        'AWS Lambda': 88,
        'Microservices': 85,
        'Cloud Security': 82
    },
    'Programming & Databases': {
        'Python': 95,
        'JavaScript': 85,
        'SQL': 90,
        'NoSQL': 80,
        'REST APIs': 90,
        'GraphQL': 75,
        'MongoDB': 85,
        'PostgreSQL': 88,
        'Redis': 80,
        'ORM Tools': 85
    },
    'Regulatory & Finance': {
        'AxiomSL': 95,
        'COREP/FINREP': 90,
        'Basel Regulations': 85,
        'Financial Reporting': 90,
        'Risk Management': 88,
        'Compliance': 92,
        'KYC/AML': 85,
        'MiFID II': 80,
        'IFRS': 85,
        'Regulatory Tech': 90
    },
    'Project Management & Tools': {
        'Agile/Scrum': 90,
        'JIRA': 88,
        'Confluence': 85,
        'Git': 90,
        'Jenkins': 85,
        'SAFe': 88,
        'Risk Assessment': 85,
        'Team Leadership': 90,
        'Stakeholder Management': 88,
        'Technical Documentation': 90
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

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        skillsData,
        createSkillsMatrix
    };
}