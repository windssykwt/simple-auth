// fungsi animasi partikel
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = `${Math.random() * 10 + 5}px`;
        particle.style.height = particle.style.width;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particlesContainer.appendChild(particle);
    }
}

document.addEventListener('DOMContentLoaded', createParticles);

// fungsi toggle mode
function toggleMode() {
    const body = document.body;
    const button = document.querySelector('.toggle-button');
    body.classList.toggle('light-mode');
    button.textContent = body.classList.contains('light-mode') ? '☀️' : '🌙';
    localStorage.setItem('mode', body.classList.contains('light-mode') ? 'light' : 'dark');
}

document.addEventListener('DOMContentLoaded', () => {
    const savedMode = localStorage.getItem('mode');
    if (savedMode === 'light') {
        document.body.classList.add('light-mode');
        document.querySelector('.toggle-button').textContent = '☀️';
    }
});