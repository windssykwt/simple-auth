// fungsi animasi partikel
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = `${Math.random() * 3 + 1}px`;
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
    button.textContent = body.classList.contains('light-mode') ? '🌙' : '☀️';
    localStorage.setItem('mode', body.classList.contains('light-mode') ? 'light' : 'dark');
    toggleImage();
}

document.addEventListener('DOMContentLoaded', () => {
    const savedMode = localStorage.getItem('mode');
    if (savedMode === 'light') {
        document.body.classList.add('light-mode');
        document.querySelector('.toggle-button').textContent = '🌙';
        toggleImage();
    }

    const savedSplitScreen = localStorage.getItem('splitScreen');
    if (savedSplitScreen === 'true') {
        document.body.classList.add('split-screen');
    }
});

// fungsi toggle split screen
function toggleSplitScreen() {
    document.body.classList.toggle('split-screen');
    localStorage.setItem('splitScreen', document.body.classList.contains('split-screen'));
}

document.addEventListener('DOMContentLoaded', () => {
    const savedMode = localStorage.getItem('mode');
    if (savedMode === 'light') {
        document.body.classList.add('light-mode');
        document.querySelector('.toggle-button:first-child').textContent = '☀️';
    }

    const savedSplitScreen = localStorage.getItem('splitScreen');
    if (savedSplitScreen === 'true') {
        document.body.classList.add('split-screen');
    }
});

// fungsi untuk mengganti gambar
function toggleImage() {
    const moonContainer = document.getElementById('moon-container');
    const currentImage = moonContainer.querySelector('img');
    
    // Buat elemen gambar baru
    const newImage = document.createElement('img');
    newImage.id = 'moon';
    
    if (document.body.classList.contains('light-mode')) {
        newImage.src = '/assets/sun.svg';
        newImage.alt = 'Sun';
    } else {
        newImage.src = '/assets/moon.svg';
        newImage.alt = 'Moon';
    }
    
    // tambahkan clas fade-out pada gambar lama
    currentImage.classList.add('fade-out');
    
    // setelah animasi fade-out selesai, ganti dengan gambar baru
    setTimeout(() => {
        moonContainer.removeChild(currentImage);
        newImage.classList.add('fade-in');
        moonContainer.appendChild(newImage);
    }, 250);
}
