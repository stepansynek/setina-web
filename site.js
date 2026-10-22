/* SETINA: chování všech stránek (menu, 3D díly, protokol hřídele, zkouška rozměru, výkresy, galerie, poptávka). */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.remove('no-js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  var fmt = function (n) { return n.toLocaleString('cs-CZ', { maximumFractionDigits: 2 }); };

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
    window.addEventListener('resize', function () { if (window.innerWidth > 1120 && !mnav.hidden) setMenu(false); });
  }

  var hasGL = !!(window.THREE && window.SetinaParts);

  /* ---------- 3D díly: každý .stage[data-part] jde otáčet tažením a po chvíli se vrátí do výchozí polohy ---------- */
  function mountViewer(stage) {
    var canvas = $('canvas', stage);
    var d = stage.dataset;
    var baseYaw = parseFloat(d.yaw), basePitch = parseFloat(d.pitch);
    var v = window.SetinaParts.createViewer(canvas, { part: d.part, yaw: baseYaw, pitch: basePitch, zoom: parseFloat(d.zoom) || 1 });
    var userYaw = 0, userPitch = 0, last = 0, idleSince = 0;
    var dragging = false, px = 0, py = 0, raf = 0;

    function draw() {
      v.state.yaw = baseYaw + userYaw;
      v.state.pitch = basePitch + userPitch;
      v.render();
    }
    function tick(now) {
      raf = 0;
      var dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!dragging && now - idleSince > 1500) {
        var k = 1 - Math.exp(-dt * 1.6);
        userYaw -= userYaw * k;
        userPitch -= userPitch * k;
      }
      draw();
      if (dragging || Math.abs(userYaw) + Math.abs(userPitch) > 0.002) raf = requestAnimationFrame(tick);
    }
    function wake() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } }

    v.size();
    draw();
    stage.classList.add('live');
    if ('ResizeObserver' in window) new ResizeObserver(function () { v.size(); draw(); }).observe(stage);

    canvas.addEventListener('pointerdown', function (e) {
      dragging = true; px = e.clientX; py = e.clientY;
      canvas.setPointerCapture(e.pointerId);
      wake();
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      userYaw += (e.clientX - px) * 0.008;
      userPitch = Math.max(-0.45, Math.min(0.55, userPitch + (e.clientY - py) * 0.004));
      px = e.clientX; py = e.clientY;
    });
    function release() {
      if (!dragging) return;
      dragging = false;
      idleSince = performance.now();
      if (reduce) { userYaw = userPitch = 0; draw(); }
      wake();
    }
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);
    return v;
  }

  var stages = $$('.stage[data-part]');
  if (stages.length && hasGL && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var st = e.target;
        if (e.isIntersecting && st._viewer === undefined) {
          try { st._viewer = mountViewer(st); } catch (err) { st._viewer = null; st.classList.remove('live'); }
          io.unobserve(st);
        }
      });
    }, { rootMargin: '200px 0px' });
    stages.forEach(function (st) { io.observe(st); });
  }

  /* ---------- úvod: protokol hřídele ----------
     Hřídel leží z boku, tažením se točí kolem své osy. Praporky pod ní jsou spojené s místem měření,
     najetí na praporek zvýrazní měřený úsek. Při prvním zobrazení sonda jednou projede hřídel zleva doprava. */
  var probe = $('[data-probe]');
  if (probe) {
    var pStage = $('.probe-stage', probe);
    var pCanvas = $('canvas', pStage);
    var leads = $('.probe-leads', probe);
    var hl = $('.probe-hl', probe);
    var scan = $('.probe-scan', probe);
    var flags = $$('.flag', probe);
    var pv = null;
    var spanFor = function (w) { return w < 640 ? 0.92 : 0.94; };
    var SVGNS = 'http://www.w3.org/2000/svg';

    // bez WebGL: stejný obrys počítáme z rozměrů statického obrázku (hřídel 212 mm přes celou šířku obrázku)
    var projectStill = function (xmm, rmm) {
      var still = $('.probe-still', probe);
      var sr = still.getBoundingClientRect(), pr = pStage.getBoundingClientRect();
      var scale = sr.width / 212;
      return { x: sr.left - pr.left + xmm * scale, y: sr.top - pr.top + sr.height / 2 + rmm * scale };
    };
    var project = function (xmm, rmm) { return pv ? pv.project(xmm, rmm) : projectStill(xmm, rmm); };

    var drawLeads = function () {
      if (getComputedStyle(leads).display === 'none') return;
      var fr = probe.getBoundingClientRect(), sr = pStage.getBoundingClientRect();
      leads.setAttribute('viewBox', '0 0 ' + fr.width + ' ' + fr.height);
      leads.innerHTML = '';
      flags.forEach(function (f, i) {
        var a = project(+f.dataset.x, +f.dataset.r);
        var ax = a.x + sr.left - fr.left, ay = a.y + sr.top - fr.top + 3;
        var r = f.getBoundingClientRect();
        // vodítko končí na horní lince praporku co nejblíž pod místem měření, se zalomením jen když je potřeba
        var fx = Math.min(Math.max(ax, r.left - fr.left + 2), r.right - fr.left - 2), fy = r.top - fr.top;
        var midY = fy - 16;
        var g = document.createElementNS(SVGNS, 'g');
        var path = document.createElementNS(SVGNS, 'path');
        path.setAttribute('d', Math.abs(fx - ax) < 1 ? 'M' + ax + ' ' + ay + 'V' + fy : 'M' + ax + ' ' + ay + 'V' + midY + 'H' + fx + 'V' + fy);
        var dot = document.createElementNS(SVGNS, 'circle');
        dot.setAttribute('cx', ax); dot.setAttribute('cy', ay); dot.setAttribute('r', 3);
        g.append(path, dot);
        leads.appendChild(g);
        f._lead = g;
      });
    };
    var highlight = function (f) {
      flags.forEach(function (x) { x.classList.toggle('on', x === f); if (x._lead) x._lead.classList.toggle('on', x === f); });
      if (!f) { probe.classList.remove('hl-on'); return; }
      var a = project(+f.dataset.from, 0), b = project(+f.dataset.to, 0);
      hl.style.left = a.x + 'px';
      hl.style.width = Math.max(4, b.x - a.x) + 'px';
      probe.classList.add('hl-on');
    };
    flags.forEach(function (f) {
      f.tabIndex = 0;
      f.addEventListener('mouseenter', function () { highlight(f); });
      f.addEventListener('mouseleave', function () { highlight(null); });
      f.addEventListener('focus', function () { highlight(f); });
      f.addEventListener('blur', function () { highlight(null); });
    });

    // jednorázové měření: sonda projede hřídel, praporky se postupně „naměří“
    var sweep = function () {
      if (reduce || probe._swept) return;
      probe._swept = true;
      var a = project(0, 0), b = project(212, 0);
      var bars = flags.map(function (f) { return $('.tb', f); });
      var targets = bars.map(function (t) { return t.style.getPropertyValue('--at'); });
      bars.forEach(function (t) { t.style.setProperty('--at', t.style.getPropertyValue('--nom') || '50'); });
      probe.classList.add('measuring');
      scan.style.opacity = '1';
      var t0 = performance.now(), dur = 1700;
      var step = function (now) {
        var k = Math.min((now - t0) / dur, 1);
        var e = 1 - Math.pow(1 - k, 3);
        var x = a.x + (b.x - a.x) * e;
        scan.style.transform = 'translateX(' + x + 'px)';
        var mm = 212 * e;
        flags.forEach(function (f, i) {
          if (!f.classList.contains('measured') && mm >= +f.dataset.x) {
            f.classList.add('measured');
            bars[i].style.setProperty('--at', targets[i]);
          }
        });
        if (k < 1) requestAnimationFrame(step);
        else {
          scan.style.transition = 'opacity .4s ease';
          scan.style.opacity = '0';
          bars.forEach(function (t, i) { t.style.setProperty('--at', targets[i]); });
          flags.forEach(function (f) { f.classList.add('measured'); });
          setTimeout(function () { probe.classList.remove('measuring'); }, 300);
        }
      };
      requestAnimationFrame(step);
    };

    if (hasGL) {
      try {
        pv = window.SetinaParts.createViewer(pCanvas, { part: 'shaft', axis: true, yaw: -0.16, pitch: 0.2, spin: 2.45, span: spanFor });
        var spin = 2.45, vel = 0, dragging = false, lx = 0, ly = 0, lt = 0, raf = 0;
        var render = function () { pv.state.spin = spin; pv.render(); };
        var loop = function (now) {
          raf = 0;
          var dt = Math.min((now - lt) / 1000, 0.05); lt = now;
          if (!dragging) { spin += vel * dt; vel *= Math.exp(-dt * 2.2); }
          render();
          if (dragging || Math.abs(vel) > 0.02) raf = requestAnimationFrame(loop);
        };
        var wake = function () { if (!raf) { lt = performance.now(); raf = requestAnimationFrame(loop); } };
        pv.size(); render();
        probe.classList.add('live');
        pCanvas.addEventListener('pointerdown', function (e) { dragging = true; lx = e.clientX; ly = e.clientY; vel = 0; pCanvas.setPointerCapture(e.pointerId); wake(); });
        pCanvas.addEventListener('pointermove', function (e) {
          if (!dragging) return;
          var dd = (e.clientX - lx + e.clientY - ly) * 0.012;
          spin += dd; vel = reduce ? 0 : dd * 40;
          lx = e.clientX; ly = e.clientY;
        });
        var up = function () { dragging = false; wake(); };
        pCanvas.addEventListener('pointerup', up);
        pCanvas.addEventListener('pointercancel', up);
        if ('ResizeObserver' in window) new ResizeObserver(function () { pv.size(); render(); drawLeads(); }).observe(pStage);
      } catch (err) { pv = null; probe.classList.remove('live'); }
    }
    var start = function () {
      drawLeads();
      if ('IntersectionObserver' in window) {
        var so = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { so.disconnect(); setTimeout(sweep, 250); } }, { threshold: 0.6 });
        so.observe(pStage);
      }
    };
    window.addEventListener('resize', drawLeads);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else start();
    var still = $('.probe-still', probe);
    if (!still.complete) still.addEventListener('load', drawLeads);
  }

  /* ---------- podmenu výroby: zvýraznit sekci, která je na obrazovce ---------- */
  var subLinks = $$('.subnav a[href^="#"]');
  if (subLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    subLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var mark = function (id) {
      subLinks.forEach(function (a) { a.removeAttribute('aria-current'); });
      if (byId[id]) byId[id].setAttribute('aria-current', 'true');
    };
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) mark(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
    var pageHead = $('.page-head');
    if (pageHead) new IntersectionObserver(function (entries) { if (entries[0].isIntersecting) mark(null); }).observe(pageHead);
  }

  /* ---------- váš díl: rozměr zadaný jednou platí na celém webu ----------
     Pracovní rozsahy jsou v data-env: "rot:Ø×délka" (soustruh, bruska), "cyl:Ø×výška" (pětiosé centrum),
     "box:X×Y×Z" (frézka, měřicí stroj, libovolné natočení), "max:délka" (svařenec). Více rozsahů odděluje středník. */
  var PART_KEY = 'setina.dil';
  var EXAMPLE = { kind: 'rot', d: 120, l: 400 };
  var store = {
    get: function () { try { var p = JSON.parse(localStorage.getItem(PART_KEY)); return p && p.kind ? p : null; } catch (e) { return null; } },
    set: function (p) { try { if (p) localStorage.setItem(PART_KEY, JSON.stringify(p)); else localStorage.removeItem(PART_KEY); } catch (e) { /* bez úložiště to funguje jen na této stránce */ } }
  };
  var perms = function (a, b, c) { return [[a, b, c], [a, c, b], [b, a, c], [b, c, a], [c, a, b], [c, b, a]]; };
  var minOf = function (arr) { return Math.min.apply(null, arr); };
  // jak velkou část pracovního rozsahu díl zabere (1 = přesně na hraně, víc = nevejde se)
  var usage = function (env, p) {
    var t = env.split(':'), e = t[1].split('x').map(Number);
    var rot = p.kind === 'rot';
    var d = p.d || 0, l = p.l || 0, w = p.w || 0, h = p.h || 0;
    var box = rot ? [d, d, l] : [l, w, h];
    if (t[0] === 'rot') {
      if (rot) return Math.max(d / e[0], l / e[1]);
      return minOf(perms(l, w, h).map(function (q) { return Math.max(Math.hypot(q[1], q[2]) / e[0], q[0] / e[1]); }));
    }
    if (t[0] === 'cyl') {
      if (rot) return Math.min(Math.max(d / e[0], l / e[1]), Math.max(Math.hypot(d, l) / e[0], d / e[1]));
      return minOf(perms(l, w, h).map(function (q) { return Math.max(Math.hypot(q[0], q[1]) / e[0], q[2] / e[1]); }));
    }
    if (t[0] === 'box') return minOf(perms(box[0], box[1], box[2]).map(function (q) { return Math.max(q[0] / e[0], q[1] / e[1], q[2] / e[2]); }));
    return Math.max.apply(null, box) / e[0];
  };
  var bestUsage = function (envs, p) { return minOf(envs.split(';').map(function (e) { return usage(e, p); })); };
  var partText = function (p) {
    var s = p.kind === 'rot'
      ? [p.d ? 'Ø ' + fmt(p.d) : '', p.l ? fmt(p.l) : ''].filter(Boolean).join(' × ')
      : [p.l, p.w, p.h].filter(Boolean).map(fmt).join(' × ');
    return s + ' mm';
  };
  var given = function (p) { return p && (p.kind === 'rot' ? (p.d || p.l) : (p.l || p.w || p.h)); };

  var paintRows = function (scope, p, example) {
    var cnc = 0, cmm = false;
    scope.classList.toggle('has-part', !!p);
    scope.classList.toggle('is-example', !!example);
    $$('[data-env]', scope).forEach(function (row) {
      var bar = $('.tb-fit', row), markEl = $('.fit-mark', row);
      if (!p) { if (markEl) { markEl.textContent = ''; markEl.className = 'fit-mark'; } row.classList.remove('yes', 'no'); return; }
      var u = bestUsage(row.dataset.env, p);
      var ok = u <= 1;
      if (bar) { bar.style.setProperty('--at', Math.min(u, 1.22) * 80); bar.classList.toggle('out', !ok); }
      if (markEl) {
        markEl.className = 'fit-mark ' + (ok ? 'yes' : 'no');
        markEl.textContent = ok ? 'vejde se, zabere ' + Math.max(1, Math.round(u * 100)) + ' % rozsahu' : 'nevejde se';
      }
      row.classList.toggle('yes', ok);
      row.classList.toggle('no', !ok);
      if (ok && row.dataset.cnc) cnc += +row.dataset.cnc;
      if (ok && row.hasAttribute('data-cmm')) cmm = true;
    });
    return { cnc: cnc, cmm: cmm };
  };

  $$('[data-fit]').forEach(function (fit) {
    var section = fit.closest('section') || document;
    var rowsScope = $('[data-fit-rows]', section);
    var out = $('[data-fit-out]', fit), go = $('[data-fit-go]', fit);
    var idle = out.textContent;
    var num = function (name) {
      var v = parseFloat((fit.elements[name].value || '').replace(',', '.').replace(/[^\d.]/g, ''));
      return v > 0 ? v : 0;
    };
    var read = function () {
      var kind = fit.elements.kind.value;
      return { kind: kind, d: kind === 'rot' ? num('d') : 0, l: num('l'), w: kind === 'box' ? num('w') : 0, h: kind === 'box' ? num('h') : 0 };
    };
    var showKind = function () {
      var kind = fit.elements.kind.value;
      $$('.dim', fit).forEach(function (f) { f.hidden = f.dataset.kind.split(' ').indexOf(kind) < 0; });
      fit.elements.d.placeholder = kind === 'rot' ? '120' : '';
      fit.elements.l.placeholder = kind === 'rot' ? '400' : '';
    };
    var check = function (save) {
      showKind();
      var p = read();
      if (save) store.set(given(p) ? p : null);
      if (!given(p)) {
        var res0 = rowsScope ? paintRows(rowsScope, EXAMPLE, true) : null;
        out.textContent = rowsScope ? 'Ukázka pro hřídel Ø 120 × 400 mm: zelené pole je pracovní rozsah, značka je díl. Zadejte rozměr svého dílu a web si ho zapamatuje i na dalších stránkách.' : idle;
        if (go) go.hidden = true;
        return res0;
      }
      var res = rowsScope ? paintRows(rowsScope, p, false) : { cnc: 0 };
      var size = partText(p);
      if (rowsScope && rowsScope.tagName === 'TABLE') {
        out.textContent = res.cnc
          ? 'Díl ' + size + ' se vejde do ' + (res.cnc === 12 ? 'všech 12' : res.cnc + ' z 12') + ' CNC strojů' + (res.cmm ? ' a změříme ho na 3D měřicím stroji.' : '.')
          : 'Díl ' + size + ' se nevejde do žádného z našich CNC strojů. Pošlete výkres a doporučíme, kdo ho vyrobí.';
      } else {
        var okN = $$('[data-env].yes', rowsScope || fit).length;
        out.textContent = 'Díl ' + size + ': ' + (okN ? 'zvládneme ' + (okN === 1 ? 'jednu technologii' : okN + ' technologie') + ' ze čtyř.' : 'nevejde se do žádného z našich strojů. Pošlete výkres a doporučíme, kdo ho vyrobí.');
      }
      if (go) { go.hidden = !res.cnc; go.href = 'poptavka.html'; }
      return res;
    };
    // předvyplnit uložený rozměr
    var saved = store.get();
    if (saved) {
      $$('input[name="kind"]', fit).forEach(function (r) { r.checked = r.value === saved.kind; });
      ['d', 'l', 'w', 'h'].forEach(function (k) { if (saved[k]) fit.elements[k].value = fmt(saved[k]); });
    }
    fit.addEventListener('input', function () { check(true); });
    fit.addEventListener('change', function () { check(true); });
    fit.addEventListener('submit', function (e) { e.preventDefault(); });
    check(false);
  });

  // výroba: u každé technologie řádek, jestli se sem uložený díl vejde
  var savedPart = store.get();
  $$('[data-your-fit]').forEach(function (el) {
    if (!savedPart) return;
    var u = bestUsage(el.dataset.yourFit, savedPart);
    el.hidden = false;
    el.classList.toggle('no', u > 1);
    el.textContent = 'Váš díl ' + partText(savedPart) + (u <= 1 ? ' tu uděláme.' : ' je na tyto stroje moc velký.');
  });

  /* ---------- výkres z úvodu: soubory si podrží IndexedDB a formulář poptávky je převezme ---------- */
  var DB = 'setina', DBSTORE = 'vykresy';
  var idb = function (mode, fn) {
    return new Promise(function (resolve, reject) {
      if (!('indexedDB' in window)) { reject(new Error('no idb')); return; }
      var req = indexedDB.open(DB, 1);
      req.onupgradeneeded = function () { req.result.createObjectStore(DBSTORE); };
      req.onerror = function () { reject(req.error); };
      req.onsuccess = function () {
        var tx = req.result.transaction(DBSTORE, mode);
        var r = fn(tx.objectStore(DBSTORE));
        tx.oncomplete = function () { resolve(r && r.result); req.result.close(); };
        tx.onerror = function () { reject(tx.error); };
      };
    });
  };
  var FILE_LIMIT = 25 * 1024 * 1024;
  var FILE_TYPES = /\.(pdf|step|stp|dxf|dwg|igs|iges|png|jpe?g|heic)$/i;

  $$('[data-drop]').forEach(function (form) {
    var input = $('.drop-input', form);
    var label = $('.drop-text strong', form);
    var hand = function (files) {
      files = Array.prototype.slice.call(files || []);
      if (!files.length) return;
      form.classList.add('saving');
      label.textContent = files.length === 1 ? files[0].name : files.length + ' soubory';
      idb('readwrite', function (s) { return s.put(files, 'posledni'); })
        .then(function () { location.href = 'poptavka.html?vykres=1'; })
        .catch(function () { location.href = 'poptavka.html'; });
    };
    input.addEventListener('change', function () { hand(input.files); });
    ['dragenter', 'dragover'].forEach(function (t) { form.addEventListener(t, function (e) { e.preventDefault(); form.classList.add('drag'); }); });
    ['dragleave', 'dragend'].forEach(function (t) { form.addEventListener(t, function () { form.classList.remove('drag'); }); });
    form.addEventListener('drop', function (e) { e.preventDefault(); form.classList.remove('drag'); hand(e.dataTransfer && e.dataTransfer.files); });
    form.addEventListener('submit', function (e) { e.preventDefault(); input.click(); });
  });

  /* ---------- zakázky: fotky z dílny, filtry a prohlížeč ---------- */
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
      dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.classList.contains('lb-img')) dlg.close(); });
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

  /* ---------- poptávka: formulář po krocích s živým náhledem ---------- */
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

    // živý náhled vpravo: co poptávka obsahuje teď
    var preview = $('#preview');
    var setPreview = function (key, val, empty) {
      if (!preview) return;
      var row = $('[data-for="' + key + '"]', preview);
      if (!row) return;
      var dd = $('dd', row);
      var text = val || empty;
      if (dd.textContent !== text) {
        dd.textContent = text;
        row.classList.remove('changed'); void row.offsetWidth;
        if (val) row.classList.add('changed');
      }
      dd.classList.toggle('empty', !val);
      if (key === 'rozmer') row.hidden = !val;
    };
    var updatePreview = function () {
      var tech = form.querySelector('input[name="tech"]:checked');
      setPreview('tech', tech && tech.value, 'zatím nevybráno');
      setPreview('qty', form.elements.qty.value.trim(), 'zatím nevyplněno');
      setPreview('material', form.elements.material.value.trim(), 'zatím nevyplněno');
      setPreview('term', form.elements.term.value, '');
      var fs = fileInput ? Array.prototype.map.call(fileInput.files, function (f) { return f.name; }) : [];
      setPreview('file', fs.join(', '), 'zatím bez souboru');
    };

    var fileInput = $('#f-file'), filesOut = $('#f-files'), drop = $('#drop');
    var checkFiles = function () {
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
      } else {
        filesOut.textContent = files.map(function (f) { return f.name; }).join(', ');
      }
      updatePreview();
    };
    if (fileInput) {
      fileInput.addEventListener('change', checkFiles);
      ['dragenter', 'dragover'].forEach(function (t) { drop.addEventListener(t, function () { drop.classList.add('drag'); }); });
      ['dragleave', 'drop'].forEach(function (t) { drop.addEventListener(t, function () { drop.classList.remove('drag'); }); });
      // výkres přetažený na úvodu nebo na konci jiné stránky
      if (/[?&]vykres=1/.test(location.search) && 'DataTransfer' in window) {
        idb('readonly', function (s) { return s.get('posledni'); }).then(function (files) {
          if (!files || !files.length) return;
          var dt = new DataTransfer();
          files.forEach(function (f) { dt.items.add(f); });
          fileInput.files = dt.files;
          checkFiles();
          idb('readwrite', function (s) { return s.delete('posledni'); });
        }).catch(function () {});
      }
    }
    // opravené pole přestane hlásit chybu hned, ne až po dalším kliknutí na Pokračovat
    var clearField = function (e) {
      var field = e.target.closest && e.target.closest('.field.invalid');
      if (!field || e.target.type === 'file') return;
      var ok = e.target.type === 'radio' ? true : e.target.value.trim() !== '';
      if (!ok) return;
      field.classList.remove('invalid');
      $$('.err', field).forEach(function (x) { x.remove(); });
      $$('[aria-invalid]', field).forEach(function (i) { i.removeAttribute('aria-invalid'); i.removeAttribute('aria-describedby'); });
    };
    form.addEventListener('input', function (e) { clearField(e); updatePreview(); });
    form.addEventListener('change', function (e) { clearField(e); updatePreview(); });

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
      updatePreview();
      go(0);
    });
    // rozměr ze stránky Stroje nebo z úvodu
    var rozmer = new URLSearchParams(location.search).get('rozmer');
    var stored = store.get();
    var sizeText = rozmer ? rozmer.slice(0, 60) : (stored && given(stored) ? partText(stored) : '');
    var note = $('#f-msg');
    if (sizeText && note && !note.value) note.value = 'Rozměr dílu: ' + sizeText;
    setPreview('rozmer', sizeText, '');
    updatePreview();
    go(0, true);
  }
})();
