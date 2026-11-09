/* Page behavior: navigation, the hero condition ladder, case tabs, the figure
   lightbox and the BibTeX copy button. */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Mobile menu */
  function initMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.getElementById('page-nav');
    if (!toggle || !nav) { return; }
    function setOpen(open) {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    }
    toggle.addEventListener('click', function () { setOpen(!nav.classList.contains('open')); });
    nav.addEventListener('click', function (event) { if (event.target.closest('a')) { setOpen(false); } });
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape') { setOpen(false); } });
  }

  /* Highlight the section in view */
  function initActiveSection() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.page-nav a'));
    if (!links.length || !('IntersectionObserver' in window)) { return; }
    var byId = {};
    links.forEach(function (link) { byId[link.getAttribute('href').slice(1)] = link; });
    var visible = {};
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { visible[entry.target.id] = entry.isIntersecting; });
      var current = null;
      Object.keys(byId).forEach(function (id) { if (visible[id]) { current = id; } });
      links.forEach(function (link) {
        var on = current !== null && link === byId[current];
        link.classList.toggle('active', on);
        if (on) { link.setAttribute('aria-current', 'true'); } else { link.removeAttribute('aria-current'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) { observer.observe(section); }
    });
  }

  /* Generic tabs: arrow keys move between tabs, selection shows one panel */
  function initTabs(tablist, onSelect) {
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    function select(tab, options) {
      tabs.forEach(function (other) {
        var on = other === tab;
        other.setAttribute('aria-selected', String(on));
        other.setAttribute('tabindex', on ? '0' : '-1');
        var panel = document.getElementById(other.getAttribute('aria-controls'));
        if (panel) {
          panel.hidden = !on;
          if (on && options && options.animate) {
            panel.classList.remove('reveal');
            void panel.offsetWidth;
            panel.classList.add('reveal');
          }
        }
      });
      if (onSelect) { onSelect(tab, options || {}); }
    }
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () { select(tab, { user: true, animate: !reducedMotion }); });
    });
    tablist.addEventListener('keydown', function (event) {
      var index = tabs.indexOf(document.activeElement);
      if (index < 0) { return; }
      var next = null;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { next = tabs[(index + 1) % tabs.length]; }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { next = tabs[(index - 1 + tabs.length) % tabs.length]; }
      if (event.key === 'Home') { next = tabs[0]; }
      if (event.key === 'End') { next = tabs[tabs.length - 1]; }
      if (next) {
        event.preventDefault();
        next.focus();
        select(next, { user: true, animate: !reducedMotion });
      }
    });
    return { tabs: tabs, select: select };
  }

  /* Hero: step once through Video, Audio, Shared and MHE, then hand over to the reader */
  function initLadder() {
    var ladder = document.querySelector('.ladder');
    if (!ladder) { return; }
    var replay = document.querySelector('.replay');
    var timer = null;
    var controls = initTabs(ladder, function (tab, options) {
      if (options.user) { stop(); }
    });

    function stop() {
      if (timer) { window.clearTimeout(timer); timer = null; }
    }

    function play() {
      stop();
      var i = 0;
      function step() {
        controls.select(controls.tabs[i], { animate: true });
        i += 1;
        if (i < controls.tabs.length) { timer = window.setTimeout(step, 1300); }
        else { timer = null; }
      }
      step();
    }

    if (reducedMotion) { return; }
    if (replay) {
      replay.hidden = false;
      replay.addEventListener('click', play);
    }
    // Start when the card is on screen, once.
    var card = document.querySelector('.case-demo');
    if ('IntersectionObserver' in window && card) {
      var seen = new IntersectionObserver(function (entries) {
        if (entries.some(function (entry) { return entry.isIntersecting; })) {
          seen.disconnect();
          window.setTimeout(play, 500);
        }
      }, { threshold: 0.5 });
      seen.observe(card);
    }
  }

  function initCaseTabs() {
    var list = document.querySelector('.case-tabs');
    if (list) { initTabs(list); }
  }

  /* Example clips: the playlist picks the clip in the player; clicking an entry also starts it */
  function initClips() {
    var list = document.querySelector('.clip-list');
    var stage = document.querySelector('.clip-stage');
    if (!list || !stage) { return; }

    function videoFor(tab) {
      var panel = document.getElementById(tab.getAttribute('aria-controls'));
      return panel ? panel.querySelector('video') : null;
    }

    var controls = initTabs(list, function (selected) {
      controls.tabs.forEach(function (tab) {
        var video = videoFor(tab);
        if (tab !== selected && video && !video.paused) { video.pause(); }
      });
    });

    controls.tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var video = videoFor(tab);
        if (!video) { return; }
        // On narrow screens the list sits below the player; bring the player back into view.
        stage.scrollIntoView({ block: 'nearest', behavior: reducedMotion ? 'auto' : 'smooth' });
        var started = video.play();
        if (started && typeof started.catch === 'function') {
          started.catch(function (error) {
            // Switching clips mid-load aborts the start, and a browser may refuse to start with
            // sound; either way the clip stays selected with its play button ready.
            if (error && error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
              console.warn('Example clip could not play:', error);
            }
          });
        }
      });
    });
  }

  /* Lightbox for figures */
  function initLightbox() {
    var dialog = document.querySelector('.lightbox');
    if (!dialog || typeof dialog.showModal !== 'function') {
      // No <dialog> support: open the full image in a new tab instead.
      document.querySelectorAll('.zoomable').forEach(function (button) {
        button.addEventListener('click', function () { window.open(button.getAttribute('data-full'), '_blank', 'noopener'); });
      });
      return;
    }
    var image = dialog.querySelector('.lightbox-stage img');
    var caption = dialog.querySelector('.lightbox-caption');
    var openLink = dialog.querySelector('.lightbox-open');
    var lastTrigger = null;

    document.querySelectorAll('.zoomable').forEach(function (button) {
      button.setAttribute('aria-label', 'Enlarge figure');
      button.addEventListener('click', function () {
        lastTrigger = button;
        var source = button.getAttribute('data-full');
        var thumb = button.querySelector('img');
        image.src = source;
        image.alt = thumb ? thumb.alt : '';
        caption.textContent = button.getAttribute('data-caption') || '';
        openLink.href = source;
        dialog.showModal();
      });
    });
    dialog.querySelector('.lightbox-close').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (event) { if (event.target === dialog) { dialog.close(); } });
    dialog.addEventListener('close', function () {
      image.removeAttribute('src');
      if (lastTrigger) { lastTrigger.focus(); }
    });
  }

  /* Copy BibTeX */
  function initCopy() {
    document.querySelectorAll('[data-copy]').forEach(function (button) {
      var label = button.querySelector('span');
      var original = label ? label.textContent : '';
      button.addEventListener('click', function () {
        var source = document.querySelector(button.getAttribute('data-copy'));
        if (!source) { return; }
        var text = source.textContent;
        function done(ok) {
          button.classList.toggle('copied', ok);
          if (label) { label.textContent = ok ? 'Copied' : 'Select the text to copy'; }
          window.setTimeout(function () {
            button.classList.remove('copied');
            if (label) { label.textContent = original; }
          }, 2000);
        }
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(fallbackCopy(source)); });
        } else {
          done(fallbackCopy(source));
        }
      });
    });
  }

  function fallbackCopy(node) {
    try {
      var range = document.createRange();
      range.selectNodeContents(node);
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      var ok = document.execCommand('copy');
      selection.removeAllRanges();
      return ok;
    } catch (error) {
      return false;
    }
  }

  function init() {
    initMenu();
    initActiveSection();
    initLadder();
    initCaseTabs();
    initClips();
    initLightbox();
    initCopy();
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); }
  else { init(); }
})();
