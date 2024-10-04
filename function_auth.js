// Fungsi untuk menangani proses login
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
        if (data.message === 'OTP sent') {
            localStorage.setItem('tempUserId', data.userId);
            alert('OTP telah dikirim ke email Anda. Silakan masukkan OTP.');
            // Tampilkan form OTP
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('otpForm').style.display = 'block';
        } else {
            console.log('Login gagal: ' + data.error);
            alert('Login gagal: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        console.log('Terjadi kesalahan saat login');
        alert('Terjadi kesalahan saat login');
    });
}

// Fungsi untuk menangani verifikasi OTP
function handleOTPVerification(event) {
    event.preventDefault();
    const otp = document.getElementById('otp').value;
    const userId = localStorage.getItem('tempUserId');

    fetch('http://localhost:3000/verify-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, otp }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login successful') {
            console.log('Login berhasil!');
            localStorage.setItem('username', document.getElementById('username').value);
            localStorage.removeItem('tempUserId');
            window.location.href = 'landing.html';
        } else {
            console.log('Verifikasi OTP gagal: ' + data.error);
            alert('Verifikasi OTP gagal: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        console.log('Terjadi kesalahan saat verifikasi OTP');
        alert('Terjadi kesalahan saat verifikasi OTP');
    });
}

// Fungsi untuk menangani proses pendaftaran
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
            window.location.href = 'login.html'; // Arahkan ke halaman login
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

// Hapus window.onload karena kita tidak memerlukan inisialisasi tampilan lagi
