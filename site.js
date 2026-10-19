/* SETINA: chování všech stránek (menu, 3D díly, galerie, poptávkový formulář). */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.remove('no-js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ---------- mobilní menu ---------- */
  var menuBtn = $('#menu-btn');
  var mnav = $('#mnav');
  if (menuBtn && mnav) {
    var setMenu = function (open) {
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.textContent = open ? 'Zavřít' : 'Menu';
      mnav.hidden = !open;
    };
    menuBtn.addEventListener('click', function () { setMenu(mnav.hidden); });
    mnav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !mnav.hidden) { setMenu(false); menuBtn.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth > 1040 && !mnav.hidden) setMenu(false); });
  }

  /* ---------- 3D díly: každý .stage[data-part] jde otáčet tažením ---------- */
  function mountViewer(stage, index) {
    var canvas = $('canvas', stage);
    var d = stage.dataset;
    var baseYaw = parseFloat(d.yaw), basePitch = parseFloat(d.pitch);
    var v = window.SetinaParts.createViewer(canvas, { part: d.part, yaw: baseYaw, pitch: basePitch, zoom: parseFloat(d.zoom) || 1 });
    var userYaw = 0, userPitch = 0, swayT = 0, last = 0, idleSince = 0;
    var dragging = false, px = 0, py = 0, running = false, visible = true, raf = 0;
    var swing = parseFloat(d.swing || '0.2');
    var phase = index * 1.9;

    function draw() {
      v.state.yaw = baseYaw + userYaw + (reduce ? 0 : Math.sin(swayT * 0.35 + phase) * swing - Math.sin(phase) * swing);
      v.state.pitch = basePitch + userPitch;
      v.render();
    }
    function tick(now) {
      raf = 0;
      var dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!dragging) {
        swayT += dt;
        if (now - idleSince > 1500) {
          var k = 1 - Math.exp(-dt * 1.6);
          userYaw -= userYaw * k;
          userPitch -= userPitch * k;
        }
      }
      draw();
      if (running) raf = requestAnimationFrame(tick);
    }
    function play() {
      var should = visible && !document.hidden && (!reduce || dragging);
      if (should && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(tick); }
      if (!should && running) { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }
    }

    v.size();
    draw();
    stage.classList.add('live');
    if ('ResizeObserver' in window) new ResizeObserver(function () { v.size(); draw(); }).observe(stage);
    document.addEventListener('visibilitychange', play);

    canvas.addEventListener('pointerdown', function (e) {
      dragging = true; px = e.clientX; py = e.clientY;
      stage.classList.add('touched');
      canvas.setPointerCapture(e.pointerId);
      play();
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      userYaw += (e.clientX - px) * 0.008;
      userPitch = Math.max(-0.45, Math.min(0.55, userPitch + (e.clientY - py) * 0.004));
      px = e.clientX; py = e.clientY;
      if (reduce) draw();
    });
    function release() {
      if (!dragging) return;
      dragging = false;
      idleSince = performance.now();
      play();
    }
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);
    return { setVisible: function (on) { visible = on; play(); } };
  }

  var stages = $$('.stage[data-part]');
  if (stages.length && window.THREE && window.SetinaParts && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var st = e.target;
        if (e.isIntersecting && st._viewer === undefined) {
          try { st._viewer = mountViewer(st, stages.indexOf(st)); } catch (err) { st._viewer = null; st.classList.remove('live'); }
        }
        if (st._viewer) st._viewer.setVisible(e.isIntersecting);
      });
    }, { rootMargin: '200px 0px' });
    stages.forEach(function (st) { io.observe(st); });
  }

  /* ---------- podmenu výroby: zvýraznit sekci, která je na obrazovce ---------- */
  var subLinks = $$('.subnav a[href^="#"]');
  if (subLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    subLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var mark = function (id) {
      subLinks.forEach(function (a) { a.classList.remove('on'); a.removeAttribute('aria-current'); });
      var a = byId[id];
      if (a) { a.classList.add('on'); a.setAttribute('aria-current', 'true'); }
    };
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) mark(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
    // hlavička stránky na obrazovce = jsme nad první technologií
    var pageHead = $('.page-head');
    if (pageHead) new IntersectionObserver(function (entries) { if (entries[0].isIntersecting) mark(null); }).observe(pageHead);
  }

  /* ---------- stroje: vejde se díl? ---------- */
  var fit = $('#fit');
  if (fit) {
    var rows = $$('.machines tbody tr');
    var fitOut = $('#fit-out'), fitGo = $('#fit-go');
    var idle = fitOut.textContent;
    var num = function (name) {
      var v = parseFloat((fit.elements[name].value || '').replace(',', '.').replace(/[^\d.]/g, ''));
      return v > 0 ? v : 0;
    };
    var nums = function (attr) { return attr.split(' ').map(Number); };
    // všechna natočení kvádru a × b × c
    var perms = function (a, b, c) { return [[a, b, c], [a, c, b], [b, a, c], [b, c, a], [c, a, b], [c, b, a]]; };
    var fitsBox = function (env, a, b, c) {
      return perms(a, b, c).some(function (p) { return p[0] <= env[0] && p[1] <= env[1] && p[2] <= env[2]; });
    };
    var fmt = function (n) { return n.toLocaleString('cs-CZ', { maximumFractionDigits: 2 }); };
    var check = function () {
      var kind = fit.elements.kind.value;
      $$('.dim', fit).forEach(function (f) { f.hidden = f.dataset.kind.split(' ').indexOf(kind) < 0; });
      var d = num('d'), l = num('l'), w = num('w'), h = num('h');
      var given = kind === 'rot' ? [d, l] : [l, w, h];
      if (!given.some(Boolean)) {
        rows.forEach(function (r) { r.classList.remove('yes', 'no'); });
        fitOut.textContent = idle;
        fitGo.hidden = true;
        return;
      }
      var size = kind === 'rot'
        ? [d ? 'Ø ' + fmt(d) : '', l ? fmt(l) : ''].filter(Boolean).join(' × ')
        : given.filter(Boolean).map(fmt).join(' × ');
      size += ' mm';
      var cnc = 0, cmm = false;
      rows.forEach(function (r) {
        var ok = false;
        if (kind === 'rot') {
          if (r.dataset.rot) { var e = nums(r.dataset.rot); ok = d <= e[0] && l <= e[1]; }
          else if (r.dataset.cyl) { var c = nums(r.dataset.cyl); ok = (d <= c[0] && l <= c[1]) || (Math.hypot(d, l) <= c[0] && d <= c[1]); }
          else if (r.dataset.box) ok = fitsBox(nums(r.dataset.box), d, d, l);
          else if (r.dataset.max) ok = Math.max(d, l) <= +r.dataset.max;
        } else {
          if (r.dataset.cyl) { var y = nums(r.dataset.cyl); ok = perms(l, w, h).some(function (p) { return Math.hypot(p[0], p[1]) <= y[0] && p[2] <= y[1]; }); }
          else if (r.dataset.box) ok = fitsBox(nums(r.dataset.box), l, w, h);
          else if (r.dataset.max) ok = Math.max(l, w, h) <= +r.dataset.max;
        }
        r.classList.toggle('yes', ok);
        r.classList.toggle('no', !ok);
        if (ok && r.hasAttribute('data-cnc')) cnc += parseInt($('.num', r).textContent, 10);
        if (ok && r.hasAttribute('data-cmm')) cmm = true;
      });
      if (cnc) {
        fitOut.textContent = 'Díl ' + size + ' se vejde do ' + (cnc === 12 ? 'všech 12' : cnc + ' z 12') + ' CNC strojů' + (cmm ? ' a změříme ho na 3D měřicím stroji.' : '.');
        fitGo.href = 'poptavka.html?rozmer=' + encodeURIComponent(size);
        fitGo.hidden = false;
      } else {
        fitOut.textContent = 'Díl ' + size + ' se nevejde do žádného z našich CNC strojů. Pošlete výkres a doporučíme, kdo ho vyrobí.';
        fitGo.hidden = true;
      }
    };
    fit.addEventListener('input', check);
    fit.addEventListener('change', check);
    fit.addEventListener('submit', function (e) { e.preventDefault(); });
    check();
  }

  /* ---------- galerie: filtry a prohlížeč ---------- */
  var grid = $('[data-gallery]');
  if (grid) {
    var shots = $$('.shot', grid);
    var filterBtns = $$('.filters button');
    var status = $('#filter-status');
    var photos = function (n) { return n === 1 ? '1 fotografie' : (n >= 2 && n <= 4 ? n + ' fotografie' : n + ' fotografií'); };
    filterBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.dataset.filter, n = 0;
        filterBtns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        shots.forEach(function (s) {
          var show = f === 'vse' || (' ' + s.dataset.cat + ' ').indexOf(' ' + f + ' ') >= 0;
          s.hidden = !show;
          if (show) n++;
        });
        if (status) status.textContent = 'Zobrazeno: ' + photos(n);
      });
    });

    var dlg = $('#lightbox');
    if (dlg && typeof dlg.showModal === 'function') {
      var lbImg = $('.lb-img img', dlg), lbCap = $('[data-cap]', dlg), lbSrc = $('[data-src]', dlg), lbPos = $('[data-pos]', dlg);
      var list = [], cur = 0;
      var show = function (i) {
        cur = (i + list.length) % list.length;
        var s = list[cur], im = $('img', s);
        lbImg.src = s.dataset.full || im.src;
        lbImg.alt = im.alt;
        lbCap.textContent = $('figcaption', s).textContent;
        lbSrc.innerHTML = '';
        var a = document.createElement('a');
        a.href = s.dataset.href; a.target = '_blank'; a.rel = 'noopener';
        a.textContent = s.dataset.credit;
        lbSrc.append('Foto: ', a, ', ' + s.dataset.license);
        lbPos.textContent = (cur + 1) + ' / ' + list.length;
      };
      shots.forEach(function (s) {
        $('button', s).addEventListener('click', function () {
          list = shots.filter(function (x) { return !x.hidden; });
          show(list.indexOf(s));
          dlg.showModal();
        });
      });
      $('[data-prev]', dlg).addEventListener('click', function () { show(cur - 1); });
      $('[data-next]', dlg).addEventListener('click', function () { show(cur + 1); });
      $('[data-close]', dlg).addEventListener('click', function () { dlg.close(); });
      dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
      dlg.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); show(cur - 1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); show(cur + 1); }
      });
      var sx = null;
      lbImg.addEventListener('pointerdown', function (e) { sx = e.clientX; });
      lbImg.addEventListener('pointerup', function (e) {
        if (sx === null) return;
        var dx = e.clientX - sx; sx = null;
        if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
      });
    }
  }

  /* ---------- poptávka: formulář po krocích ---------- */
  var form = $('#inquiry');
  if (form) {
    var steps = $$('fieldset[data-step]', form);
    var prog = $$('.progress li');
    var backBtn = $('[data-back]', form), nextBtn = $('[data-next]', form), sendBtn = $('[data-send]', form);
    var errBox = $('#form-err');
    var done = $('#done');
    var cur = 0;

    var clearErrors = function () {
      $$('.field.invalid', form).forEach(function (f) { f.classList.remove('invalid'); });
      $$('.field .err', form).forEach(function (e) { e.remove(); });
      $$('[aria-invalid]', form).forEach(function (i) { i.removeAttribute('aria-invalid'); i.removeAttribute('aria-describedby'); });
      errBox.hidden = true;
    };
    var flag = function (input, msg) {
      var field = input.closest('.field');
      var span = document.createElement('span');
      span.className = 'err';
      span.id = (input.id || input.name) + '-err';
      span.textContent = msg;
      field.classList.add('invalid');
      field.appendChild(span);
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', span.id);
    };
    var fileInput = $('#f-file'), filesOut = $('#f-files'), drop = $('#drop');
    var FILE_LIMIT = 25 * 1024 * 1024;
    var FILE_TYPES = /\.(pdf|step|stp|dxf|dwg|igs|iges|png|jpe?g|heic)$/i;
    if (fileInput) {
      fileInput.addEventListener('change', function () {
        var files = Array.prototype.slice.call(fileInput.files);
        var field = fileInput.closest('.field');
        field.classList.remove('invalid');
        $$('.err', field).forEach(function (e) { e.remove(); });
        fileInput.removeAttribute('aria-invalid');
        var bad = files.filter(function (f) { return !FILE_TYPES.test(f.name); })[0];
        var total = files.reduce(function (sum, f) { return sum + f.size; }, 0);
        var msg = '';
        if (bad) msg = 'Soubor ' + bad.name + ' neumíme otevřít. Pošlete PDF, STEP, IGES, DXF, DWG nebo fotku.';
        else if (total > FILE_LIMIT) msg = 'Soubory mají dohromady ' + Math.ceil(total / 1048576) + ' MB, limit je 25 MB. Větší pošlete na obchod@setina-obrabeni.cz.';
        if (msg) {
          fileInput.value = '';
          filesOut.textContent = '';
          flag(fileInput, msg);
          return;
        }
        filesOut.textContent = files.map(function (f) { return f.name; }).join(', ');
      });
      ['dragenter', 'dragover'].forEach(function (t) { drop.addEventListener(t, function () { drop.classList.add('drag'); }); });
      ['dragleave', 'drop'].forEach(function (t) { drop.addEventListener(t, function () { drop.classList.remove('drag'); }); });
    }

    var validStep = function (i) {
      clearErrors();
      var first = null;
      $$('[data-msg]', steps[i]).forEach(function (input) {
        var ok;
        if (input.type === 'radio') ok = !!form.querySelector('input[name="' + input.name + '"]:checked');
        else ok = input.value.trim() !== '' && input.checkValidity();
        if (ok || input.closest('.field').classList.contains('invalid')) return;
        flag(input, input.dataset.msg);
        if (!first) first = input;
      });
      if (first) first.focus();
      return !first;
    };
    var fillSummary = function () {
      var out = $('#summary');
      out.innerHTML = '';
      $$('[data-sum]', form).forEach(function (input) {
        var val;
        if (input.type === 'radio') { if (!input.checked) return; val = input.value; }
        else if (input.type === 'file') { val = Array.prototype.map.call(input.files, function (f) { return f.name; }).join(', '); }
        else val = input.value.trim();
        if (!val) return;
        var row = document.createElement('div');
        var dt = document.createElement('dt'); dt.textContent = input.dataset.sum;
        var dd = document.createElement('dd'); dd.textContent = val;
        row.append(dt, dd);
        out.appendChild(row);
      });
    };
    var go = function (i, quiet) {
      cur = i;
      steps.forEach(function (s, k) { s.hidden = k !== i; });
      prog.forEach(function (p, k) {
        p.classList.toggle('on', k === i);
        p.classList.toggle('done', k < i);
        if (k === i) p.setAttribute('aria-current', 'step'); else p.removeAttribute('aria-current');
      });
      backBtn.hidden = i === 0;
      nextBtn.hidden = i === steps.length - 1;
      sendBtn.hidden = i !== steps.length - 1;
      if (i === steps.length - 1) fillSummary();
      if (quiet) return;
      var legend = $('legend', steps[i]);
      legend.setAttribute('tabindex', '-1');
      legend.focus({ preventScroll: true });
      var top = form.getBoundingClientRect().top + window.scrollY - 100;
      if (window.scrollY > top) window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
    };
    nextBtn.addEventListener('click', function () { if (validStep(cur)) go(cur + 1); });
    backBtn.addEventListener('click', function () { clearErrors(); go(cur - 1); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (cur !== steps.length - 1) { if (validStep(cur)) go(cur + 1); return; }
      clearErrors();
      var consent = $('#f-consent');
      if (!consent.checked) {
        errBox.textContent = 'Bez souhlasu se zpracováním údajů vám nemůžeme odpovědět. Zaškrtněte ho prosím.';
        errBox.hidden = false;
        consent.focus();
        return;
      }
      form.hidden = true;
      done.hidden = false;
      done.focus();
    });
    $('#again').addEventListener('click', function () {
      form.reset();
      if (filesOut) filesOut.textContent = '';
      clearErrors();
      done.hidden = true;
      form.hidden = false;
      go(0);
    });
    var rozmer = new URLSearchParams(location.search).get('rozmer');
    var note = $('#f-msg');
    if (rozmer && note && !note.value) note.value = 'Rozměr dílu: ' + rozmer.slice(0, 60);
    go(0, true);
  }
})();
