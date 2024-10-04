// fungsi untuk menangani proses login
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login successful') {
            console.log('Login success!');
            localStorage.setItem('username', username);
            window.location.href = 'landing.html';
        } else {
            console.log('Login failed: ' + data.error);
            alert('Login failed: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        console.log('Terjadi kesalahan saat login');
        alert('Terjadi kesalahan saat login');
    });
}

// fungsi untuk menangani proses pendaftaran
function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('Password tidak cocok');
        return;
    }

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert('Pendaftaran berhasil!');
            window.location.href = 'login.html'; // arahkan ke halaman login
        } else {
            alert('Pendaftaran gagal: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        console.log('Terjadi kesalahan saat mendaftar');
        alert('Terjadi kesalahan saat mendaftar');
    });
}
