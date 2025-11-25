// CORNER - Gen-Z Website Interactions

document.addEventListener('DOMContentLoaded', () => {
  
  // ===== CUSTOM CURSOR =====
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');

  if (cursorDot && cursorOutline && window.innerWidth > 920) {
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let outlineX = 0, outlineY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      // Smooth cursor follow
      dotX += (mouseX - dotX) * 0.9;
      dotY += (mouseY - dotY) * 0.9;
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;

      cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;
      cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor interactions
    const interactiveElements = document.querySelectorAll('a, button, input, .stat-card, .problem-card, .solution-card');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.style.transform += ' scale(2)';
        cursorOutline.style.transform += ' scale(1.5)';
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.style.transform = cursorDot.style.transform.replace(' scale(2)', '');
        cursorOutline.style.transform = cursorOutline.style.transform.replace(' scale(1.5)', '');
      });
    });
  }

  // ===== FLOATING BANNER =====
  const floatCard = document.getElementById('floatCard');
  if (floatCard) {
    let time = 0;
    function floatAnimation() {
      time += 0.01;
      const y = Math.sin(time * 1.2) * 12;
      const x = Math.cos(time * 0.8) * 6;
      const rotate = Math.sin(time * 0.6) * 2;
      
      floatCard.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
      requestAnimationFrame(floatAnimation);
    }
    floatAnimation();
  }

  // ===== PARTICLES SYSTEM =====
  const canvas = document.getElementById('particles');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const DPR = window.devicePixelRatio || 1;
    let width = canvas.width = window.innerWidth * DPR;
    let height = canvas.height = window.innerHeight * DPR;
    let particles = [];

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = -Math.random() * 0.5 - 0.2;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.y < 0) this.y = height;
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.fillStyle = `rgba(185, 255, 107, ${this.opacity})`;
        ctx.arc(this.x / DPR, this.y / DPR, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      const particleCount = Math.min(Math.floor((width * height) / 15000), 50);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width / DPR, height / DPR);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth * DPR;
      height = canvas.height = window.innerHeight * DPR;
      ctx.scale(DPR, DPR);
      initParticles();
    });
  }

  // ===== SCROLL ANIMATIONS =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealElements = document.querySelectorAll('.stat-card, .problem-card, .solution-card, .vision-stat');
  
  if (revealElements.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.animation = `fadeInUp 0.8s ease both`;
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => {
      el.style.opacity = '0';
      observer.observe(el);
    });
  }

  // ===== FORM HANDLING =====
  const forms = document.querySelectorAll('form[data-netlify]');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.innerHTML;

      // Show success state
      submitButton.disabled = true;
      submitButton.innerHTML = '<span>✓ You\'re on the list!</span>';
      submitButton.style.background = 'linear-gradient(135deg, #b9ff6b, #7de84f)';

      // Submit to Netlify
      const formData = new FormData(form);
      const data = new URLSearchParams();
      for (const pair of formData.entries()) {
        data.append(pair[0], pair[1]);
      }

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data.toString()
      })
      .then(() => {
        // Also send to serverless function if exists
        try {
          const jsonData = {};
          for (const pair of formData.entries()) {
            jsonData[pair[0]] = pair[1];
          }
          fetch('/.netlify/functions/sendSignup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jsonData)
          }).catch(() => {});
        } catch (err) {}

        // Reset form after delay
        setTimeout(() => {
          submitButton.disabled = false;
          submitButton.innerHTML = originalText;
          submitButton.style.background = '';
          form.reset();
        }, 2000);
      })
      .catch(() => {
        // Error handling
        submitButton.innerHTML = '<span>Try again</span>';
        setTimeout(() => {
          submitButton.disabled = false;
          submitButton.innerHTML = originalText;
        }, 1500);
      });
    });
  });

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ===== STICKY NOTIFY BUTTON =====
  const stickyNotify = document.getElementById('stickyNotify');
  const notifyTopBtn = document.getElementById('notifyTopBtn');
  
  if (stickyNotify) {
    stickyNotify.addEventListener('click', () => {
      document.getElementById('notify')?.scrollIntoView({ behavior: 'smooth' });
      stickyNotify.style.transform = 'translateY(-4px) scale(1.1)';
      setTimeout(() => {
        stickyNotify.style.transform = '';
      }, 200);
    });
  }

  if (notifyTopBtn) {
    notifyTopBtn.addEventListener('click', () => {
      document.getElementById('notify')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ===== MAGNETIC BUTTONS =====
  const magneticElements = document.querySelectorAll('.btn-primary, .btn-glow, .btn-submit');
  magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });

  // ===== PARALLAX HERO BACKGROUND =====
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
      heroBg.style.opacity = 1 - scrolled / 800;
    });
  }

  // ===== NUMBER COUNTER ANIMATION =====
  const statNumbers = document.querySelectorAll('.stat-number');
  const countersObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const finalValue = target.textContent;
        
        if (finalValue === '∞') {
          target.style.animation = 'pulse 2s ease-in-out infinite';
        } else {
          const numericValue = parseInt(finalValue);
          if (!isNaN(numericValue)) {
            let current = 0;
            const increment = numericValue / 30;
            const timer = setInterval(() => {
              current += increment;
              if (current >= numericValue) {
                target.textContent = numericValue;
                clearInterval(timer);
              } else {
                target.textContent = Math.floor(current);
              }
            }, 40);
          }
        }
        countersObserver.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(num => countersObserver.observe(num));

  // ===== GLITCH EFFECT ON HOVER =====
  const glitchElements = document.querySelectorAll('.glitch');
  glitchElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      el.style.animation = 'glitchAnim 0.3s ease';
    });
    el.addEventListener('animationend', () => {
      el.style.animation = '';
    });
  });

  // Add glitch keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes glitchAnim {
      0%, 100% { transform: translate(0); }
      20% { transform: translate(-2px, 2px); }
      40% { transform: translate(2px, -2px); }
      60% { transform: translate(-2px, -2px); }
      80% { transform: translate(2px, 2px); }
    }
  `;
  document.head.appendChild(style);

  console.log('🥊 CORNER - Built different. Built for fighters.');
});
