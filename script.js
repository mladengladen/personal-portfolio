(function () {
  // Custom cursor
  var cursor = document.getElementById('cursor');
  var follower = document.getElementById('cursorFollower');
  var fx = 0, fy = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', function (e) {
    cx = e.clientX;
    cy = e.clientY;
    cursor.style.left = (cx - 5) + 'px';
    cursor.style.top = (cy - 5) + 'px';
  });

  function animFollower() {
    fx += (cx - fx - 18) * 0.15;
    fy += (cy - fy - 18) * 0.15;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(animFollower);
  }
  animFollower();

  document.querySelectorAll('a, .acc-header, .gallery-item--clickable, .modal-close').forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      cursor.style.transform = 'scale(2.5)';
      follower.style.transform = 'scale(1.5)';
    });
    el.addEventListener('mouseleave', function () {
      cursor.style.transform = 'scale(1)';
      follower.style.transform = 'scale(1)';
    });
  });

  // Nav scroll
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Scroll reveal
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });

  // Accordion
  document.querySelectorAll('.acc-header').forEach(function (header) {
    header.addEventListener('click', function () {
      // If this header links externally, open in new tab
      if (header.dataset.href) {
        window.open(header.dataset.href, '_blank', 'noopener,noreferrer');
        return;
      }

      // If this header has a data-modal, open that modal instead
      if (header.dataset.modal) {
        openModal(header.dataset.modalSrc || '', header.dataset.modalTitle || '');
        return;
      }

      var item = header.closest('.acc-item');
      var isOpen = item.classList.contains('open');

      document.querySelectorAll('.acc-item').forEach(function (i) {
        i.classList.remove('open');
        var lbl = i.querySelector('.toggle-label');
        if (lbl) lbl.textContent = 'View mockups';
      });

      if (!isOpen) {
        item.classList.add('open');
        var lbl = item.querySelector('.toggle-label');
        if (lbl) lbl.textContent = 'Close';
        setTimeout(function () {
          item.querySelector('.acc-body').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 150);
      }
    });
  });

  // Modal
  var modal = document.getElementById('imageModal');
  var modalClose = document.getElementById('modalClose');
  var modalImg = document.getElementById('modalImg');
  var modalTitle = document.getElementById('modalTitle');

  function openModal(src, title) {
    modalImg.src = src || '';
    modalImg.alt = title || '';
    modalTitle.textContent = title || '';
    modal.classList.add('open');
    modal.querySelector('.modal-container').scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.gallery-item--clickable').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.stopPropagation();
      var img = el.querySelector('img');
      openModal(el.dataset.modalSrc || img.src, img.alt);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);

  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });
})();
