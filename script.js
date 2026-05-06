const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const progressBar = document.getElementById('progressBar');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

const savedTheme = localStorage.getItem('theme') || 'dark';
root.setAttribute('data-theme', savedTheme);
themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    themeIcon.className = next === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
});

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link, .footer-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
    });
});

const typedWords = [
    'CS Student',
    'Web Developer',
    'AI/ML Enthusiast',
    'Team Leader',
    'Problem Solver'
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typedText');

function typeEffect() {
    const word = typedWords[wordIndex];
    if (isDeleting) {
        typedEl.textContent = word.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedEl.textContent = word.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === word.length) {
        setTimeout(() => { isDeleting = true; }, 1600);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % typedWords.length;
    }

    setTimeout(typeEffect, isDeleting ? 60 : 100);
}

typeEffect();

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
});

const allSections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-link[data-section]');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            allNavLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('data-section') === id);
            });
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

allSections.forEach(sec => navObserver.observe(sec));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, 80);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

document.getElementById('footerYear').textContent = new Date().getFullYear();

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
        formStatus.textContent = '';

        try {
            const res = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { Accept: 'application/json' }
            });

            if (res.ok) {
                formStatus.textContent = '✓ Message sent successfully!';
                formStatus.style.color = 'var(--accent)';
                contactForm.reset();
            } else {
                formStatus.textContent = '✗ Something went wrong. Please try again.';
                formStatus.style.color = '#f87171';
            }
        } catch {
            formStatus.textContent = '✗ Network error. Please try again.';
            formStatus.style.color = '#f87171';
        }

        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Send Message</span>';
    });
}

const resumeBtn = document.getElementById('resumeDownload');
if (resumeBtn) {
    resumeBtn.addEventListener('click', (e) => {
        const href = resumeBtn.getAttribute('href');
        if (!href || href === 'resume.pdf') {
            e.preventDefault();
            alert('Resume PDF coming soon! Contact me directly at muhammaddbaqar@gmail.com');
        }
    });
}