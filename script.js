let ecLevel = 'M';

// ── EC pills ──
document.querySelectorAll('.ec-pill').forEach(p => {
  p.addEventListener('click', () => {
    document.querySelectorAll('.ec-pill').forEach(x => x.classList.remove('active'));
    p.classList.add('active');
    ecLevel = p.dataset.level;
  });
});

// ── Size slider ──
const sizeInput = document.getElementById('qr-size');
const sizeVal   = document.getElementById('size-val');
sizeInput.addEventListener('input', () => {
  sizeVal.textContent = sizeInput.value + 'px';
});

// ── Color pickers ──
document.getElementById('fg-color').addEventListener('input', e => {
  document.getElementById('fg-dot').style.background = e.target.value;
});
document.getElementById('bg-color').addEventListener('input', e => {
  document.getElementById('bg-dot').style.background = e.target.value;
});

// ── Char counter ──
const qrInput = document.getElementById('qr-input');
qrInput.addEventListener('input', () => {
  document.getElementById('char-count').textContent = qrInput.value.length;
});
document.getElementById('char-count').textContent = qrInput.value.length;

// ── Generate triggers ──
document.getElementById('gen-btn').addEventListener('click', generate);
qrInput.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key === 'Enter') generate();
});

// ── QR render size: fluid based on container ──
function getQRSize() {
  const output = document.getElementById('qr-output');
  // Use the element's actual rendered width, capped at 260
  return Math.min(output.offsetWidth || 220, 260);
}

function generate() {
  const text = qrInput.value.trim();
  if (!text) { showToast('ENTER SOME CONTENT'); return; }

  const btn = document.getElementById('gen-btn');
  btn.classList.add('loading');

  setTimeout(() => {
    const output = document.getElementById('qr-output');
    output.innerHTML = '';

    const fg   = document.getElementById('fg-color').value;
    const bg   = document.getElementById('bg-color').value;
    const size = getQRSize();

    try {
      new QRCode(output, {
        text,
        width: size,
        height: size,
        colorDark: fg,
        colorLight: bg,
        correctLevel: QRCode.CorrectLevel[ecLevel]
      });

      setTimeout(() => {
        enableDownloads();
        updateStats(text);
      }, 100);

    } catch (e) {
      output.innerHTML = '<div class="qr-placeholder"><p style="color:#ff4d6d;letter-spacing:0.1em;font-size:10px">ERROR<br>TEXT TOO LONG</p></div>';
    }

    btn.classList.remove('loading');
  }, 180);
}

function enableDownloads() {
  document.getElementById('dl-png').classList.add('active');
  document.getElementById('dl-svg').classList.add('active');
}

function updateStats(text) {
  document.getElementById('char-count').textContent = text.length;
  document.getElementById('version-val').textContent = Math.min(Math.ceil(text.length / 17), 40);
  document.getElementById('capacity-val').textContent = Math.floor(2953 * (1 - text.length / 2953 * 0.3)) + 'B';
}

// ── PNG download ──
document.getElementById('dl-png').addEventListener('click', () => {
  const canvas = document.querySelector('#qr-output canvas');
  if (!canvas) return;

  const size = parseInt(sizeInput.value);
  const off  = document.createElement('canvas');
  off.width  = size;
  off.height = size;
  off.getContext('2d').drawImage(canvas, 0, 0, size, size);

  // iOS Safari: use blob download fallback
  off.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.download = 'qrforge-' + Date.now() + '.png';
    a.href     = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');

  showToast('PNG DOWNLOADED');
});

// ── SVG download ──
document.getElementById('dl-svg').addEventListener('click', () => {
  const canvas = document.querySelector('#qr-output canvas');
  if (!canvas) return;

  const size = parseInt(sizeInput.value);
  const fg   = document.getElementById('fg-color').value;
  const bg   = document.getElementById('bg-color').value;

  const off  = document.createElement('canvas');
  off.width  = canvas.width;
  off.height = canvas.height;
  const ctx  = off.getContext('2d');
  ctx.drawImage(canvas, 0, 0);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);

  let rects = '';
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const i = (y * canvas.width + x) * 4;
      if (0.299 * data.data[i] + 0.587 * data.data[i + 1] + 0.114 * data.data[i + 2] < 128) {
        rects += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
      }
    }
  }

  const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvas.width} ${canvas.height}" width="${size}" height="${size}"><rect width="${canvas.width}" height="${canvas.height}" fill="${bg}"/><g fill="${fg}">${rects}</g></svg>`;
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  const a   = document.createElement('a');
  a.download = 'qrforge-' + Date.now() + '.svg';
  a.href     = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('SVG DOWNLOADED');
});

// ── Toast ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

// ── No auto-generate: textarea starts empty ──