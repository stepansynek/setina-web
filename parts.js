/* 3D modely dílů SETINA (three.js r149, UMD). Jednotka scény = 10 mm. */
(function (global) {
  'use strict';
  var T = global.THREE;

  // tone: barva místnosti, kterou ocel odráží; 'smalt' = tmavě zelený smalt stránky, jinak neutrální šedá
  function studio(renderer, tone) {
    var scene = new T.Scene();
    var box = new T.BoxGeometry();
    box.deleteAttribute('uv');
    var dark = tone === 'smalt';
    var room = new T.Mesh(box, new T.MeshStandardMaterial({ side: T.BackSide, color: dark ? 0x35443d : 0x4f565c, roughness: 1, metalness: 0 }));
    room.scale.set(32, 30, 32);
    room.position.set(0, 3, 0);
    scene.add(room);
    var fill = new T.PointLight(0xffffff, 2.5, 40, 2);
    fill.position.set(0, 9, 0);
    scene.add(fill);
    var floor = new T.Mesh(new T.PlaneGeometry(32, 32), new T.MeshStandardMaterial({ color: dark ? 0x14211b : 0x23282c, roughness: 1 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -11.9;
    scene.add(floor);
    function softbox(w, h, k, x, y, z, rx, ry) {
      var m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: new T.Color().setScalar(k), side: T.DoubleSide }));
      m.position.set(x, y, z);
      if (rx == null) m.lookAt(0, 0, 0); else m.rotation.set(rx, ry, 0);
      scene.add(m);
    }
    softbox(16, 2.6, 18, 0, 14.6, -2, Math.PI / 2, 0);
    softbox(2.6, 10, 10, -15.5, 5, 5, 0, Math.PI / 2);
    softbox(1.6, 10, 7, 15.5, 6, -5, 0, -Math.PI / 2);
    softbox(10, 2.5, 3, 0, 4, 15.5, 0, Math.PI);
    softbox(13, 3, 2.4, 0, 12, -13);
    softbox(26, 9, 0.7, 0, 9, -15);
    softbox(1.4, 20, 6, -9, 0, 12);
    softbox(1.0, 20, 4, 10, 0, 11);
    var pm = new T.PMREMGenerator(renderer);
    var tex = pm.fromScene(scene, 0.025).texture;
    pm.dispose();
    return tex;
  }

  // jemné stopy po soustružení: obvodové rýhy podél osy dílu
  function turningMarks(repeat) {
    var c = document.createElement('canvas');
    c.width = 4; c.height = 512;
    var g = c.getContext('2d');
    var seed = 7;
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    for (var y = 0; y < 512; y++) {
      var v = 128 + Math.sin(y * 2.4) * 36 + (rnd() - 0.5) * 50;
      g.fillStyle = 'rgb(' + (v | 0) + ',' + (v | 0) + ',' + (v | 0) + ')';
      g.fillRect(0, y, 4, 1);
    }
    var t = new T.CanvasTexture(c);
    t.wrapS = t.wrapT = T.RepeatWrapping;
    t.repeat.set(1, repeat || 4);
    return t;
  }

  // stopy po zarovnání čela: soustředné kružnice, mapované přes souřadnice tvaru (UV extrudovaných těles)
  function facingMarks(size) {
    var c = document.createElement('canvas');
    c.width = c.height = 512;
    var g = c.getContext('2d');
    g.fillStyle = '#808080';
    g.fillRect(0, 0, 512, 512);
    var seed = 11;
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    for (var r = 256; r > 0; r -= 1) {
      var v = 128 + Math.sin(r * 2.1) * 34 + (rnd() - 0.5) * 40;
      g.strokeStyle = 'rgb(' + (v | 0) + ',' + (v | 0) + ',' + (v | 0) + ')';
      g.lineWidth = 1.2;
      g.beginPath(); g.arc(256, 256, r, 0, Math.PI * 2); g.stroke();
    }
    var t = new T.CanvasTexture(c);
    t.repeat.set(1 / size, 1 / size);
    t.offset.set(0.5, 0.5);
    return t;
  }

  // stopy po frézování čelní frézou: překrývající se oblouky
  function millMarks(size) {
    var c = document.createElement('canvas');
    c.width = c.height = 512;
    var g = c.getContext('2d');
    g.fillStyle = '#808080';
    g.fillRect(0, 0, 512, 512);
    g.lineWidth = 1;
    for (var x = -200; x < 700; x += 5) {
      var v = 110 + (x % 15) * 2;
      g.strokeStyle = 'rgba(' + v + ',' + v + ',' + v + ',0.55)';
      g.beginPath(); g.arc(x, 256, 300, -0.9, 0.9); g.stroke();
    }
    var t = new T.CanvasTexture(c);
    t.wrapS = t.wrapT = T.RepeatWrapping;
    t.repeat.set(1 / size, 1 / size);
    return t;
  }

  function materials() {
    return {
      turned: new T.MeshPhysicalMaterial({ color: 0xc9ced3, metalness: 1, roughness: 0.3, bumpMap: turningMarks(14), bumpScale: 0.0035, side: T.DoubleSide }),
      ground: new T.MeshPhysicalMaterial({ color: 0xdde1e4, metalness: 1, roughness: 0.1, side: T.DoubleSide }),
      keyed: new T.MeshPhysicalMaterial({ color: 0xc4c9ce, metalness: 1, roughness: 0.32, side: T.DoubleSide }),
      thread: new T.MeshPhysicalMaterial({ color: 0xbfc4c9, metalness: 1, roughness: 0.38, side: T.DoubleSide }),
      faced: new T.MeshPhysicalMaterial({ color: 0xc9ced3, metalness: 1, roughness: 0.22, bumpMap: facingMarks(16), bumpScale: 0.004 }),
      alu: new T.MeshPhysicalMaterial({ color: 0xd3d8dc, metalness: 1, roughness: 0.3, bumpMap: millMarks(6), bumpScale: 0.003 }),
      blackOxide: new T.MeshPhysicalMaterial({ color: 0x2a2f34, metalness: 0.7, roughness: 0.38 }),
      paint: new T.MeshPhysicalMaterial({ color: 0x3a444c, metalness: 0.2, roughness: 0.5, clearcoat: 0.3, clearcoatRoughness: 0.5 }),
      hole: new T.MeshStandardMaterial({ color: 0x15191c, metalness: 0.4, roughness: 0.7 }),
      rubber: new T.MeshStandardMaterial({ color: 0x1e2226, metalness: 0, roughness: 0.8 })
    };
  }

  // každý vnitřní bod profilu zdvojíme, aby osazení měla ostré hrany
  function lathe(points, mat) {
    var pts = [];
    points.forEach(function (p, i) {
      var v = new T.Vector2(p[0] / 10, p[1] / 10);
      pts.push(v);
      if (i > 0 && i < points.length - 1) pts.push(v.clone());
    });
    return new T.Mesh(new T.LatheGeometry(pts, 160), mat);
  }

  // úsek hřídele s vyfrézovanou drážkou pro pero: průřez kruh s obdélníkovým zářezem, vytažený podél osy (mm)
  function keyed(r, w, depth, from, to, mat) {
    var R = r / 10, hw = w / 20, yc = Math.sqrt(R * R - hw * hw), th0 = Math.atan2(yc, hw);
    var sh = new T.Shape();
    sh.moveTo(hw, yc);
    sh.lineTo(hw, R - depth / 10);
    sh.lineTo(-hw, R - depth / 10);
    sh.lineTo(-hw, yc);
    sh.absarc(0, 0, R, Math.PI - th0, 2 * Math.PI + th0, false);
    var geo = new T.ExtrudeGeometry(sh, { depth: (to - from) / 10, bevelEnabled: false, curveSegments: 120 });
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, from / 10, 0);
    geo.computeVertexNormals();
    return new T.Mesh(geo, mat);
  }

  // hřídel čerpadla, 42CrMo4, L 212 mm: závit M30×2, ložiskové čepy Ø35 k6, nákružek Ø60
  function shaft(m) {
    var thread = [[0, 4.3], [2.5, 0], [14, 0], [15, 1]];
    for (var y = 2; y <= 21; y++) thread.push([y % 2 ? 15 : 13.8, y]);
    thread.push([12.8, 22], [12.8, 25], [16.5, 25], [17.5, 26]);
    var parts = [
      lathe(thread, m.thread),
      lathe([[17.5, 26], [17.5, 58]], m.ground),
      lathe([[17.5, 58], [22, 58], [22, 70], [29, 70], [30, 71], [30, 92], [29, 93], [22.5, 93], [22.5, 105]], m.turned),
      lathe([[22.5, 150], [22.5, 157], [21, 157], [21, 159.5], [22.5, 159.5], [22.5, 165], [17.5, 165]], m.turned),
      lathe([[17.5, 165], [17.5, 197]], m.ground),
      lathe([[17.5, 197], [14, 197], [14, 199]], m.turned),
      lathe([[14, 210], [14, 211], [13, 212], [2.5, 212], [0, 207.7]], m.turned),
      // drážky pro pero: 14 P9 v sedle oběžného kola (105–150 mm), 8 P9 na konci pro spojku (199–210 mm)
      keyed(22.5, 14, 5.5, 105, 150, m.keyed),
      keyed(14, 8, 4, 199, 210, m.keyed)
    ];
    var g = new T.Group();
    parts.forEach(function (p) { p.geometry.translate(0, -10.6, 0); g.add(p); });
    g.rotation.z = -Math.PI / 2;
    var wrap = new T.Group();
    wrap.add(g);
    wrap.userData = { radius: 11, shadow: [27, 7.5], floor: -3.6, halfLen: 10.6, endR: 1.5, maxR: 3 };
    return wrap;
  }

  function roundedRect(w, h, r) {
    var s = new T.Shape();
    var x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }
  // jäkl / hranol se zaoblenými hranami; axis = směr délky
  function bar(len, w, h, r, axis, mat) {
    var geo = new T.ExtrudeGeometry(roundedRect(w, h, r), { depth: len, bevelEnabled: false, curveSegments: 5 });
    geo.translate(0, 0, -len / 2);
    if (axis === 'x') geo.rotateY(Math.PI / 2);
    if (axis === 'y') geo.rotateX(Math.PI / 2);
    return new T.Mesh(geo, mat);
  }
  function cyl(r, h, mat, seg) { return new T.Mesh(new T.CylinderGeometry(r, r, h, seg || 48), mat); }

  // svařovaný rám balicího stroje 950 × 520 mm s obrobenými dosedacími plochami
  function frame(m) {
    var g = new T.Group();
    var L = 95, W = 52, H = 26, tw = 6, th = 4;
    var zEdge = W / 2 - tw / 2, xEdge = L / 2 - tw / 2;
    [-zEdge, zEdge].forEach(function (z) {
      var b = bar(L, tw, th, 0.5, 'x', m.paint); b.position.set(0, H, z); g.add(b);
      var rail = bar(L - 14, 4, 0.5, 0.1, 'x', m.ground); rail.position.set(0, H + th / 2 + 0.25, z); g.add(rail);
    });
    [-xEdge, xEdge, -15, 15].forEach(function (x) {
      var b = bar(W - 2 * tw, tw, th, 0.5, 'z', m.paint); b.position.set(x, H, 0); g.add(b);
    });
    [[-xEdge, -zEdge], [xEdge, -zEdge], [-xEdge, zEdge], [xEdge, zEdge]].forEach(function (p) {
      var leg = bar(H - th / 2, tw, tw, 0.5, 'y', m.paint); leg.position.set(p[0], (H - th / 2) / 2, p[1]); g.add(leg);
      var plate = bar(9, 9, 0.8, 0.3, 'z', m.paint); plate.position.set(p[0], 0.4, p[1]); g.add(plate);
      var rod = cyl(0.8, 3.2, m.ground, 24); rod.position.set(p[0], -1.2, p[1]); g.add(rod);
      var foot = cyl(3, 1, m.rubber); foot.position.set(p[0], -3, p[1]); g.add(foot);
    });
    [-15, 15].forEach(function (x) {
      [-12, 12].forEach(function (z) {
        var pad = cyl(2.6, 0.5, m.ground); pad.position.set(x, H + th / 2 + 0.25, z); g.add(pad);
        var hole = cyl(0.8, 0.52, m.hole, 24); hole.position.copy(pad.position); g.add(hole);
      });
    });
    var bb = new T.Box3().setFromObject(g);
    var c = bb.getCenter(new T.Vector3());
    g.position.sub(c);
    var wrap = new T.Group();
    wrap.add(g);
    wrap.userData = { radius: 56, shadow: [118, 72], floor: bb.min.y - c.y - 0.05 };
    return wrap;
  }

  // upínací přípravek pro robotické svařování: deska EN AW-7075, dorazy C45, upnutá trubka Ø40
  function fixture(m) {
    var g = new T.Group();
    var top = 2.08;
    var plate = new T.Mesh(new T.ExtrudeGeometry(roundedRect(30, 20, 0.9), { depth: 2, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 2, curveSegments: 6 }), m.alu);
    plate.geometry.rotateX(-Math.PI / 2);
    g.add(plate);
    for (var x = -12.5; x <= 12.5; x += 2.5) {
      for (var z = -7.5; z <= 7.5; z += 2.5) {
        if (Math.abs(x) > 5.5 && Math.abs(x) < 12 && z > -6.5 && z < 4) continue;
        var h = cyl(0.32, 0.04, m.hole, 20); h.position.set(x, top + 0.01, z); g.add(h);
      }
    }
    var tube = cyl(2, 28, m.ground, 64); tube.rotation.z = Math.PI / 2; tube.position.set(0, top + 5 + 2, 0); g.add(tube);
    var bore = cyl(1.55, 28.02, m.hole, 48); bore.rotation.z = Math.PI / 2; bore.position.copy(tube.position); g.add(bore);
    [-9, 9].forEach(function (x) {
      var block = bar(6, 4, 5, 0.25, 'z', m.blackOxide); block.position.set(x, top + 2.5, 0); g.add(block);
      var post = cyl(0.6, 11, m.ground, 32); post.position.set(x, top + 5.5, -4.5); g.add(post);
      var arm = bar(5.6, 1.2, 0.8, 0.2, 'z', m.blackOxide); arm.position.set(x, top + 11.1, -2); g.add(arm);
      var spindle = cyl(0.35, 1.8, m.ground, 20); spindle.position.set(x, top + 9.95, 0.4); g.add(spindle);
      var tip = cyl(0.75, 0.5, m.rubber, 32); tip.position.set(x, top + 9.25, 0.4); g.add(tip);
      var knob = cyl(0.9, 0.9, m.blackOxide, 32); knob.position.set(x, top + 11.1, -4.5); g.add(knob);
    });
    [[-13, -8], [13, 8], [-13, 8], [13, -8]].forEach(function (p) {
      var pin = cyl(0.55, 1.6, m.ground, 32); pin.position.set(p[0], top + 0.8, p[1]); g.add(pin);
    });
    var bb = new T.Box3().setFromObject(g);
    var c = bb.getCenter(new T.Vector3());
    g.position.sub(c);
    var wrap = new T.Group();
    wrap.add(g);
    wrap.userData = { radius: 19, shadow: [44, 34], floor: bb.min.y - c.y - 0.02 };
    return wrap;
  }

  function centered(g, radius, shadowPad) {
    var bb = new T.Box3().setFromObject(g);
    var c = bb.getCenter(new T.Vector3());
    var sz = bb.getSize(new T.Vector3());
    g.position.sub(c);
    var wrap = new T.Group();
    wrap.add(g);
    wrap.userData = { radius: radius, shadow: [sz.x * shadowPad, sz.z * shadowPad], floor: bb.min.y - c.y - 0.02 };
    return wrap;
  }
  function ring(r, x, y) { var p = new T.Path(); p.absarc(x || 0, y || 0, r, 0, Math.PI * 2, true); return p; }
  function flat(shape, depth, mat, bevel) {
    var geo = new T.ExtrudeGeometry(shape, { depth: depth, bevelEnabled: !!bevel, bevelThickness: bevel || 0, bevelSize: bevel || 0, bevelSegments: 2, curveSegments: 64 });
    geo.rotateX(-Math.PI / 2);
    return new T.Mesh(geo, mat);
  }

  // příruba Ø160 × 48 mm: 8 děr Ø18 na roztečné kružnici 125 mm, vrtání Ø60
  function flange(m) {
    var g = new T.Group();
    var disc = new T.Shape();
    disc.absarc(0, 0, 8, 0, Math.PI * 2, false);
    disc.holes.push(ring(3));
    for (var i = 0; i < 8; i++) {
      var a = (i + 0.5) / 8 * Math.PI * 2;
      disc.holes.push(ring(0.9, Math.cos(a) * 6.25, Math.sin(a) * 6.25));
    }
    g.add(flat(disc, 1.8, m.faced, 0.07));
    g.add(lathe([[30, 18], [30, 48], [43, 48], [45, 46], [45, 18]], m.turned));
    g.add(lathe([[30, 47.9], [30, 48.6], [36, 48.6], [36, 47.9]], m.ground));
    return centered(g, 9.6, 1.5);
  }

  // frézované pouzdro z EN AW-6082, 120 × 80 × 41 mm: kapsa hloubky 16 mm, vrtání Ø18, čtyři zahloubené díry
  function housing(m) {
    var g = new T.Group();
    var pts = [[-4.9, -2.9], [4.9, -2.9], [-4.9, 2.9], [4.9, 2.9]];
    var block = roundedRect(12, 8, 0.45);
    pts.forEach(function (p) { block.holes.push(ring(0.78, p[0], p[1])); });
    block.holes.push(roundedRect(7.2, 4.4, 0.8));
    g.add(flat(block, 4.1, m.alu, 0.05));
    var floor = roundedRect(7.2, 4.4, 0.8);
    floor.holes.push(ring(0.9));
    floor.holes.push(ring(0.25, -2.6, 0), ring(0.25, 2.6, 0));
    g.add(flat(floor, 2.5, m.alu));
    pts.forEach(function (p) {
      var sleeve = lathe([[4.5, 0], [4.5, 25], [7.8, 25], [7.8, 0]], m.alu);
      sleeve.position.set(p[0], 0, -p[1]);
      g.add(sleeve);
    });
    var side = cyl(0.9, 0.02, m.hole, 40); side.rotation.z = Math.PI / 2; side.position.set(6.06, 2, 0); g.add(side);
    [-1.6, 1.6].forEach(function (z) { var tap = cyl(0.22, 0.02, m.hole, 20); tap.rotation.z = Math.PI / 2; tap.position.set(6.06, 3.2, z); g.add(tap); });
    return centered(g, 7.6, 1.45);
  }

  // kalené pouzdro s osazením, Ø40 h5 broušené, vrtání Ø25, délka 50 mm
  function bushing(m) {
    var g = new T.Group();
    g.add(lathe([[12.5, 1], [13.5, 0], [19, 0], [20, 1]], m.turned));
    g.add(lathe([[20, 1], [20, 44]], m.ground));
    g.add(lathe([[20, 44], [27, 44], [28, 45], [28, 50], [13.5, 50], [12.5, 49], [12.5, 1]], m.turned));
    g.add(lathe([[12.4, 8], [12.4, 42]], m.ground));
    return centered(g, 4.3, 1.7);
  }

  function contactShadow(w, d, y, strength) {
    var c = document.createElement('canvas');
    c.width = c.height = 256;
    var g = c.getContext('2d');
    var grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grd.addColorStop(0, 'rgba(20,28,34,' + (strength || 0.42) + ')');
    grd.addColorStop(0.45, 'rgba(20,28,34,' + (strength || 0.42) * 0.45 + ')');
    grd.addColorStop(1, 'rgba(20,28,34,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 256, 256);
    var mesh = new T.Mesh(new T.PlaneGeometry(w, d), new T.MeshBasicMaterial({ map: new T.CanvasTexture(c), transparent: true, depthWrite: false, toneMapped: false }));
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = y;
    return mesh;
  }

  // scéna s jedním dílem: yaw = otočení kolem svislé osy, pitch = náklon kamery
  function createViewer(canvas, opts) {
    opts = opts || {};
    var renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, alpha: opts.background == null, preserveDrawingBuffer: !!opts.still });
    renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = opts.exposure || 1.0;
    renderer.setPixelRatio(opts.pixelRatio || Math.min(global.devicePixelRatio || 1, 2));
    if (opts.background != null) renderer.setClearColor(opts.background, 1);
    else renderer.setClearColor(0x000000, 0);

    var scene = new T.Scene();
    scene.environment = studio(renderer, opts.tone);
    var m = materials();
    var part = ({ shaft: shaft, frame: frame, fixture: fixture, flange: flange, housing: housing, bushing: bushing })[opts.part || 'shaft'](m);
    var turntable = new T.Group();
    turntable.add(part);
    var ud = part.userData;
    if (!opts.axis) turntable.add(contactShadow(ud.shadow[0], ud.shadow[1], ud.floor, opts.shadow));
    scene.add(turntable);

    // axis: pravoúhlý pohled z boku, díl se točí kolem vlastní osy jako ve sklíčidle a body na ose leží lineárně v šířce plátna
    var axis = !!opts.axis;
    var camera = axis ? new T.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000) : new T.PerspectiveCamera(opts.fov || 26, 1, 0.1, 1000);
    var state = { yaw: opts.yaw != null ? opts.yaw : -0.5, pitch: opts.pitch != null ? opts.pitch : 0.32, zoom: opts.zoom || 1, spin: opts.spin || 0 };
    var W = 1, H = 1;

    function size() {
      W = canvas.clientWidth || canvas.width; H = canvas.clientHeight || canvas.height;
      renderer.setSize(W, H, false);
      var aspect = W / H;
      if (axis) {
        var span = typeof opts.span === 'function' ? opts.span(W) : (opts.span || 0.66);
        var halfW = (ud.halfLen * Math.cos(state.yaw) + ud.endR * Math.abs(Math.sin(state.yaw))) / span;
        halfW = Math.max(halfW, ud.maxR * 1.12 * aspect);
        camera.left = -halfW; camera.right = halfW;
        camera.top = halfW / aspect; camera.bottom = -halfW / aspect;
        camera.userData.dist = 60;
      } else {
        camera.aspect = aspect;
        var vf = T.MathUtils.degToRad(camera.fov);
        var hf = 2 * Math.atan(Math.tan(vf / 2) * camera.aspect);
        camera.userData.dist = ud.radius / Math.sin(Math.min(vf, hf) / 2) / state.zoom;
      }
      camera.updateProjectionMatrix();
    }
    function render() {
      turntable.rotation.y = state.yaw;
      if (axis) part.rotation.x = state.spin;
      var d = camera.userData.dist;
      camera.position.set(0, Math.sin(state.pitch) * d, Math.cos(state.pitch) * d);
      camera.lookAt(0, opts.lookY || 0, 0);
      renderer.render(scene, camera);
    }
    // bod na povrchu dílu v mm (vzdálenost od čela se závitem, poloměr pod osou) → pixely na plátně
    function project(xmm, rmm) {
      var v = new T.Vector3(xmm / 10 - ud.halfLen, -rmm / 10, 0);
      v.applyEuler(turntable.rotation);
      v.project(camera);
      return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H };
    }
    size();
    return { renderer: renderer, state: state, size: size, render: render, project: project };
  }

  global.SetinaParts = { createViewer: createViewer };
})(window);
