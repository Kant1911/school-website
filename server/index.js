require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: [
    'https://kant1911.github.io',
    'http://127.0.0.1:5500',
    'http://localhost:5500',
    'http://localhost:3000'
  ]
}));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'School Website API is running' });
});

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: 'รูปแบบอีเมลไม่ถูกต้อง' });
  }

  try {
    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVE_EMAIL || process.env.EMAIL_USER,
      replyTo: email,
      subject: `[ติดต่อโรงเรียน] ${subject}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
          <div style="background:#1a3a6b;padding:24px 32px;">
            <h2 style="color:#fff;margin:0;font-size:1.2rem;">ข้อความจากเว็บไซต์โรงเรียน</h2>
          </div>
          <div style="padding:32px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:8px 0;font-weight:700;color:#1a3a6b;width:120px;">ชื่อ-นามสกุล</td>
                <td style="padding:8px 0;color:#475569;">${name}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-weight:700;color:#1a3a6b;">อีเมล</td>
                <td style="padding:8px 0;color:#475569;">${email}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;font-weight:700;color:#1a3a6b;">หัวข้อ</td>
                <td style="padding:8px 0;color:#475569;">${subject}</td>
              </tr>
            </table>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;">
            <p style="font-weight:700;color:#1a3a6b;margin-bottom:10px;">ข้อความ</p>
            <p style="color:#475569;line-height:1.7;white-space:pre-wrap;">${message}</p>
          </div>
          <div style="background:#f8fafc;padding:16px 32px;font-size:0.8rem;color:#94a3b8;">
            ส่งจากเว็บไซต์โรงเรียนพระแม่มารีสาฐุประดิษฐ์
          </div>
        </div>
      `
    });

    res.json({ success: true, message: 'ส่งข้อความเรียบร้อยแล้ว' });
  } catch (err) {
    console.error('Email error:', err.message);
    res.status(500).json({ success: false, error: 'ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
