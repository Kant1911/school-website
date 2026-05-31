// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.12)';
  } else {
    navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
  }
});

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const icon = menuToggle.querySelector('i');
  icon.className = navLinks.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.querySelector('i').className = 'fas fa-bars';
  });
});

// Animated counters
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current).toLocaleString();
  }, 16);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(animateCounter);
      statObserver.disconnect();
    }
  });
}, { threshold: 0.3 });
const statBar = document.querySelector('.stat-bar');
if (statBar) statObserver.observe(statBar);

// Activity tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const tab = document.getElementById('tab-' + btn.dataset.tab);
    if (tab) tab.classList.add('active');
  });
});

// Contact form
const API_URL = 'https://school-website-7j6j.onrender.com';

async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const success = document.getElementById('formSuccess');

  const inputs = form.querySelectorAll('input, textarea');
  const [nameEl, emailEl, subjectEl, messageEl] = inputs;

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังส่ง...';

  try {
    const res = await fetch(`${API_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: nameEl.value,
        email: emailEl.value,
        subject: subjectEl.value,
        message: messageEl.value
      })
    });

    const data = await res.json();

    if (data.success) {
      form.style.display = 'none';
      success.style.display = 'block';
      setTimeout(() => {
        form.reset();
        form.style.display = 'block';
        success.style.display = 'none';
      }, 4000);
    } else {
      alert(data.error || 'ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง');
    }
  } catch (err) {
    alert('เกิดข้อผิดพลาด กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> ส่งข้อความ';
  }
}

// Back to top
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('show', window.scrollY > 400);
});
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Scroll reveal animation
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.about-card, .program-card, .activity-card, .news-card, .timeline-content').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  revealObserver.observe(el);
});
