const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Konfigurasi transporter email (gunakan konfigurasi SMTP Anda)
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your_email@example.com',
    pass: 'your_email_password'
  }
});

// Buat koneksi ke database SQLite
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      email TEXT UNIQUE,
      password TEXT,
      otp TEXT,
      otp_expires DATETIME
    )`);
  }
});

// Fungsi untuk menghasilkan OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Fungsi untuk mengirim OTP melalui email
function sendOTP(email, otp) {
  const mailOptions = {
    from: 'your_email@example.com',
    to: email,
    subject: 'OTP untuk Login',
    text: `OTP Anda adalah: ${otp}. OTP ini akan kadaluarsa dalam 5 menit.`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error mengirim email:', error);
    } else {
      console.log('Email terkirim:', info.response);
    }
  });
}

// Endpoint untuk registrasi
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: 'Error hashing password' });
    }
    
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.run(query, [username, email, hash], function(err) {
      if (err) {
        return res.status(400).json({ error: 'Username or email already exists' });
      }
      res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
    });
  });
});

// Endpoint untuk login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const query = 'SELECT * FROM users WHERE username = ?';
  db.get(query, [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error comparing passwords' });
      }
      if (result) {
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 5*60000); // OTP kadaluarsa dalam 5 menit

        db.run('UPDATE users SET otp = ?, otp_expires = ? WHERE id = ?', [otp, otpExpires.toISOString(), user.id], (err) => {
          if (err) {
            return res.status(500).json({ error: 'Error saving OTP' });
          }
          sendOTP(user.email, otp);
          res.json({ message: 'OTP sent', userId: user.id });
        });
      } else {
        res.status(400).json({ error: 'Invalid password' });
      }
    });
  });
});

// Endpoint baru untuk verifikasi OTP
app.post('/verify-otp', (req, res) => {
  const { userId, otp } = req.body;

  const query = 'SELECT * FROM users WHERE id = ?';
  db.get(query, [userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (new Date() > new Date(user.otp_expires)) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    // OTP valid, reset OTP in database
    db.run('UPDATE users SET otp = NULL, otp_expires = NULL WHERE id = ?', [user.id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error resetting OTP' });
      }
      res.json({ message: 'Login successful', userId: user.id });
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
