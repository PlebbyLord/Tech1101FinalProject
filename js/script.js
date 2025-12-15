/* ================================
   GLOBAL HELPERS / SHARED ELEMENTS
   ================================ */

// Image modal elements (used in hobbies slideshow)
const modal = document.getElementById("imgModal");
const modalImg = document.getElementById("modalImg");
const modalClose = document.getElementById("modalClose");

/* ================================
   MAIN SCRIPT – RUN AFTER PAGE LOAD
   ================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ===== AUTO UPDATE YEAR (FOOTER) ===== */
  // Automatically sets the current year
  document.getElementById('year')
    ?.replaceWith(document.createTextNode(new Date().getFullYear()));

  /* ===== TIME-BASED GREETING ===== */
  // Changes greeting depending on time of day
  const g = document.getElementById('greeting');
  if (g) {
    const h = new Date().getHours();
    g.textContent =
      h < 12 ? 'Good morning' :
      h < 18 ? 'Good afternoon' :
               'Good evening';
  }

  /* ===== TYPING EFFECT (HERO SECTION) ===== */
  // Types out my name/roles letter by letter
  const typedEl = document.getElementById('typed');
  const message = "Billy Joel — Student • Coder • Editor • Gamer";

  if (typedEl) {
    let i = 0;
    const speed = 40;

    function type() {
      typedEl.textContent = message.slice(0, i);
      i++;
      if (i <= message.length) {
        setTimeout(type, speed);
      } else {
        blink();
      }
    }

    // Blinking cursor effect at the end
    function blink() {
      typedEl.innerHTML = typedEl.textContent + '<span class="cursor">▌</span>';
      setTimeout(() => {
        typedEl.innerHTML = typedEl.textContent;
      }, 500);
    }

    type();
  }

  /* ===== SMOOTH SCROLL FOR INTERNAL LINKS ===== */
  // Makes anchor links scroll smoothly instead of jumping
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      document
        .querySelector(a.getAttribute('href'))
        ?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ===== SCROLL REVEAL ANIMATION ===== */
  // Elements fade/slide in when they enter the viewport
  const revealEls = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window && revealEls.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.transition =
            'opacity 700ms ease, transform 700ms ease';
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => {
      el.style.opacity = 0;
      el.style.transform = 'translateY(18px)';
      obs.observe(el);
    });
  } else {
    // Fallback if IntersectionObserver is not supported
    revealEls.forEach(el => {
      el.style.opacity = 1;
      el.style.transform = 'none';
    });
  }

  /* ===== STATS COUNTER ANIMATION ===== */
  // Animates numbers counting up (used on index page stats)
  document.querySelectorAll('.stat').forEach(el => {
    const target =
      Number(el.dataset.count || el.querySelector('.num')?.textContent || 0);

    if (!target) return;

    let start = 0;
    const duration = 1200;
    const step = Math.ceil(target / (duration / 30));
    const numEl = el.querySelector('.num');

    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      if (numEl) numEl.textContent = start;
    }, 30);
  });

  /* ===== HOBBIES SLIDESHOW ===== */
  // Handles multiple independent slideshows
  let slideGroups = {};

  document.querySelectorAll(".slideshow").forEach(card => {
    const group = card.dataset.slides;
    const slides = Array.from(card.querySelectorAll(".slide"));
    if (!slides.length) return;

    slideGroups[group] = { slides, index: 0 };

    // Make sure first image is active
    slides.forEach((s, i) =>
      s.classList.toggle('active', i === 0)
    );
  });

  function showSlide(group, n) {
    const obj = slideGroups[group];
    if (!obj) return;

    obj.slides[obj.index].classList.remove('active');
    obj.index = (n + obj.slides.length) % obj.slides.length;
    obj.slides[obj.index].classList.add('active');
  }

  // Previous / Next buttons
  document.querySelectorAll('.prev').forEach(btn => {
    btn.addEventListener('click', () =>
      showSlide(btn.dataset.group,
      slideGroups[btn.dataset.group].index - 1)
    );
  });

  document.querySelectorAll('.next').forEach(btn => {
    btn.addEventListener('click', () =>
      showSlide(btn.dataset.group,
      slideGroups[btn.dataset.group].index + 1)
    );
  });

  // Auto-advance slides every 4 seconds
  setInterval(() => {
    for (let g in slideGroups) {
      showSlide(g, slideGroups[g].index + 1);
    }
  }, 4000);

  /* ===== RESUME COLLAPSIBLE SECTIONS ===== */
  // Expands/collapses resume sections
  document.querySelectorAll('.collapsible').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const content = btn.nextElementSibling;
      if (!content) return;

      content.style.display =
        content.style.display === 'block' ? 'none' : 'block';
    });
  });

  /* ===== CHEAT SHEET FILTER ===== */
  // Filters HTML tags in cheat sheet table
  const cheatFilter = document.getElementById('cheat-filter');
  if (cheatFilter) {
    cheatFilter.addEventListener('input', () => {
      const q = cheatFilter.value.trim().toLowerCase();

      document
        .querySelectorAll('#cheat-table tbody tr')
        .forEach(tr => {
          const tag = tr.dataset.tag || '';
          tr.style.display =
            (!q || tag.includes(q) ||
             tr.textContent.toLowerCase().includes(q))
              ? ''
              : 'none';
        });
    });
  }

  /* ===== COPY BUTTONS ===== */
  // Copies code snippets to clipboard
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const snip = btn.dataset.snippet || '';
      try {
        await navigator.clipboard.writeText(snip);
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy', 1200);
      } catch {
        btn.textContent = 'Copy failed';
        setTimeout(() => btn.textContent = 'Copy', 1200);
      }
    });
  });

  /* ===== IMAGE MODAL (HOBBIES) ===== */
  // Clicking any slideshow image opens it fullscreen
  document.querySelectorAll(".slide").forEach(img => {
    img.addEventListener("click", () => {
      modalImg.src = img.src;
      modal.classList.remove("hidden");
    });
  });

  // Close modal button
  modalClose.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Click outside image to close
  modal.addEventListener("click", e => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });

});
