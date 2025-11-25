/* Small site JS - particles, floating card and lightweight feedback */
document.addEventListener('DOMContentLoaded', () => {
  // floating banner micro animation
  const floatCard = document.getElementById('floatCard');
  if (floatCard) {
    let t = 0;
    function bob() {
      t += 0.016;
      const y = Math.sin(t * 1.2) * 8;
      const r = Math.sin(t * 0.6) * 1.8;
      floatCard.style.transform = `translateY(${y}px) rotate(${r}deg)`;
      requestAnimationFrame(bob);
    }
    bob();
  }

  // small particle system
  const c = document.getElementById('particles');
  if (c && c.getContext) {
    const ctx = c.getContext('2d');
    const DPR = window.devicePixelRatio || 1;
    let w = (c.width = innerWidth * DPR);
    let h = (c.height = innerHeight * DPR);
    let particles = [];

    function reset() {
      w = c.width = innerWidth * DPR;
      h = c.height = innerHeight * DPR;
      ctx.scale(DPR, DPR);
      particles = Array.from({ length: 22 }).map(() => ({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        s: 1 + Math.random() * 2.4,
        a: 0.05 + Math.random() * 0.2,
        xv: (Math.random() - 0.5) * 0.3,
        yv: -Math.random() * 0.1 - 0.02,
      }));
    }
    reset();
    window.addEventListener('resize', reset);

    function render() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      particles.forEach(p => {
        p.x += p.xv;
        p.y += p.yv;
        if (p.y < -20) p.y = innerHeight + 20;
        if (p.x < -20) p.x = innerWidth + 20;
        if (p.x > innerWidth + 20) p.x = -20;

        ctx.beginPath();
        ctx.fillStyle = `rgba(185,255,107,${p.a})`;
        ctx.arc(p.x, p.y, p.s * 3, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(render);
    }
    render();
  }

  // small submit handler to show inline success message and post via XHR to Netlify
  const forms = document.querySelectorAll('form[data-netlify]');
  forms.forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const data = new FormData(form);
      const submitButton = form.querySelector('button[type="submit"]');

      // UX: show instant feedback
      if (submitButton) {
        submitButton.disabled = true;
        const original = submitButton.innerText;
        submitButton.innerText = 'Thanks — you’re on the list!';

        // submit to Netlify using fetch (works on deployed site) — fallback to simple delay in local dev
        const body = new URLSearchParams();
        for (const pair of data.entries()) body.append(pair[0], pair[1]);

        // push to Netlify's built-in form handler
        fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() })
          .then(() => {
            // success
            setTimeout(() => {
              submitButton.disabled = false;
              submitButton.innerText = original;
              try { form.reset(); } catch (err) {}
            }, 1800);
          })
          .catch(() => {
            // if fetch fails (local), just revert and clear
            setTimeout(() => {
              submitButton.disabled = false;
              submitButton.innerText = original;
              try { form.reset(); } catch (err) {}
            }, 1200);
          });

        // ALSO send a JSON payload to the serverless function for forwarding/analytics
        try {
          const jsonPayload = {};
          for (const pair of data.entries()) jsonPayload[pair[0]] = pair[1];
          fetch('/.netlify/functions/sendSignup', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(jsonPayload) }).catch(() => {});
        } catch (err) { }
      }
    });
  });

  // top notify button to jump to form
  const notifyTopBtn = document.getElementById('notifyTopBtn');
  if (notifyTopBtn) {
    notifyTopBtn.addEventListener('click', () => {
      document.getElementById('notify')?.scrollIntoView({behavior:'smooth'});
    });
  }

  // reveal on scroll - staggered
  const anims = document.querySelectorAll('.anim');
  if (anims.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.12 });

    anims.forEach((el, idx) => {
      el.style.transitionDelay = `${(idx % 6) * 80}ms`;
      observer.observe(el);
    });
  }

  // sticky notify button
  const stickyNotify = document.getElementById('stickyNotify');
  if (stickyNotify) {
    stickyNotify.addEventListener('click', () => {
      document.getElementById('notify')?.scrollIntoView({behavior:'smooth'});
      // little pulse feedback
      stickyNotify.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 260 });
    });
  }
});
