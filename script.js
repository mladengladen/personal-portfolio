(function () {
  var root = document.documentElement;

  // Local time in Skopje
  var localTime = document.getElementById('localTime');
  try {
    var timeFormat = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Skopje', hour: '2-digit', minute: '2-digit' });
    var updateTime = function () { localTime.textContent = timeFormat.format(new Date()) + ' local time'; };
    updateTime();
    localTime.hidden = false;
    setInterval(updateTime, 30000);
  } catch (e) {}

  // Nav border once the page scrolls
  var nav = document.getElementById('nav');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Highlight the nav link for the section in view
  var navLinks = document.querySelectorAll('.nav-links a');
  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var key = entry.target.dataset.nav;
      navLinks.forEach(function (link) {
        link.setAttribute('aria-current', link.getAttribute('href') === '#' + key ? 'true' : 'false');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('[data-nav]').forEach(function (el) { sectionObserver.observe(el); });

  // Scroll reveal
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });

  // Lightbox
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxTitle = document.getElementById('lightboxTitle');
  var lightboxBody = document.getElementById('lightboxBody');

  function openLightbox(src, title, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || title;
    lightboxTitle.textContent = title;
    lightboxBody.scrollTop = 0;
    lightbox.showModal();
    root.style.overflow = 'hidden';
  }

  document.querySelectorAll('.shot-frame').forEach(function (frame) {
    frame.addEventListener('click', function () {
      openLightbox(frame.dataset.full, frame.dataset.title, frame.querySelector('img').alt);
    });
  });

  document.getElementById('lightboxClose').addEventListener('click', function () { lightbox.close(); });
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) lightbox.close();
  });
  lightbox.addEventListener('close', function () { root.style.overflow = ''; });

  // Copy email
  var copyBtn = document.getElementById('copyEmail');
  var copyTip = document.getElementById('copyTip');
  var copyStatus = document.getElementById('copyStatus');
  var copyTimer;

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    // Fallback for non-secure contexts (e.g. opening the file locally)
    var field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    var ok = document.execCommand('copy');
    document.body.removeChild(field);
    return ok ? Promise.resolve() : Promise.reject();
  }

  function showCopyResult(ok) {
    copyBtn.classList.toggle('is-done', ok);
    copyBtn.classList.add('show-tip');
    copyTip.textContent = ok ? 'Copied' : 'Couldn’t copy';
    copyStatus.textContent = ok ? 'Email copied' : 'Couldn’t copy the email';
    clearTimeout(copyTimer);
    copyTimer = setTimeout(function () {
      copyBtn.classList.remove('is-done', 'show-tip');
      copyTip.textContent = 'Copy email';
      copyStatus.textContent = '';
    }, 1800);
  }

  copyBtn.addEventListener('click', function () {
    var result;
    try { result = copyText(copyBtn.dataset.copy); } catch (e) { result = Promise.reject(); }
    result.then(function () { showCopyResult(true); }, function () { showCopyResult(false); });
  });
})();
