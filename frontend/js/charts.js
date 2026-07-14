// ===== Graphiques SVG (sans dépendance externe) =====
const Charts = (() => {
  const GOLD = ['#2563eb', '#0d9488', '#4f46e5', '#64748b', '#06b6d4', '#4338ca', '#0f766e', '#1e40af'];

  // Donut chart -> renvoie HTML (svg + légende)
  function donut(data, { size = 170 } = {}) {
    const total = data.reduce((s, d) => s + d.value, 0) || 1;
    const r = size / 2 - 14;
    const cx = size / 2, cy = size / 2;
    const circ = 2 * Math.PI * r;
    let offset = 0;
    const stroke = 22;
    let segs = '';
    data.forEach((d, i) => {
      const frac = d.value / total;
      const len = frac * circ;
      const color = d.color || GOLD[i % GOLD.length];
      segs += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}"
        stroke-width="${stroke}" stroke-dasharray="${len} ${circ - len}"
        stroke-dashoffset="${-offset}" transform="rotate(-90 ${cx} ${cy})"
        stroke-linecap="butt"></circle>`;
      offset += len;
    });
    const legend = data.map((d, i) => {
      const color = d.color || GOLD[i % GOLD.length];
      const pct = Math.round((d.value / total) * 100);
      return `<div class="legend-row">
        <span class="legend-dot" style="background:${color}"></span>
        <span>${UI.esc(d.label)}</span>
        <span class="legend-val">${d.value} (${pct}%)</span>
      </div>`;
    }).join('');
    return `<div class="donut-wrap">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#f1f5f9" stroke-width="${stroke}"></circle>
        ${segs}
        <text x="${cx}" y="${cy - 4}" text-anchor="middle" fill="#0f172a" font-size="26" font-weight="700">${total}</text>
        <text x="${cx}" y="${cy + 16}" text-anchor="middle" fill="#94a3b8" font-size="11">Total</text>
      </svg>
      <div class="donut-legend">${legend}</div>
    </div>`;
  }

  // Barres horizontales
  function bars(data) {
    const max = Math.max(...data.map((d) => d.value), 1);
    return data.map((d) => {
      const w = Math.round((d.value / max) * 100);
      return `<div class="bar-row">
        <span class="bar-lbl">${UI.esc(d.label)}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${w}%">${d.value > 0 && w > 14 ? d.value : ''}</div></div>
        <span class="bar-val">${w <= 14 ? d.value : ''}</span>
      </div>`;
    }).join('');
  }

  // Courbe d'évolution (line chart)
  function line(data, { width = 520, height = 200 } = {}) {
    if (!data.length) return UI.emptyState('📈', 'Aucune donnée');
    const pad = { l: 36, r: 16, t: 18, b: 30 };
    const w = width - pad.l - pad.r;
    const h = height - pad.t - pad.b;
    const max = Math.max(...data.map((d) => d.value), 1);
    const stepX = data.length > 1 ? w / (data.length - 1) : 0;
    const pts = data.map((d, i) => {
      const x = pad.l + i * stepX;
      const y = pad.t + h - (d.value / max) * h;
      return { x, y, d };
    });
    const path = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p.x.toFixed(1) + ' ' + p.y.toFixed(1)).join(' ');
    const area = path + ` L${pts[pts.length - 1].x.toFixed(1)} ${(pad.t + h).toFixed(1)} L${pts[0].x.toFixed(1)} ${(pad.t + h).toFixed(1)} Z`;
    const grid = [0, 0.5, 1].map((f) => {
      const y = pad.t + h - f * h;
      return `<line x1="${pad.l}" y1="${y}" x2="${width - pad.r}" y2="${y}" stroke="#e2e8f0" stroke-width="1"></line>
        <text x="${pad.l - 8}" y="${y + 4}" text-anchor="end" fill="#94a3b8" font-size="10">${Math.round(max * f)}</text>`;
    }).join('');
    const labels = pts.map((p) => `<text x="${p.x}" y="${height - 8}" text-anchor="middle" fill="#475569" font-size="11">${UI.esc(p.d.label)}</text>`).join('');
    const dots = pts.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#2563eb" stroke="#ffffff" stroke-width="2"></circle>
      <text x="${p.x}" y="${p.y - 10}" text-anchor="middle" fill="#1d4ed8" font-size="11" font-weight="600">${p.d.value}</text>`).join('');
    return `<svg width="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
      <defs><linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(37,99,235,0.20)"></stop>
        <stop offset="100%" stop-color="rgba(37,99,235,0)"></stop>
      </linearGradient></defs>
      ${grid}
      <path d="${area}" fill="url(#areaGrad)"></path>
      <path d="${path}" fill="none" stroke="#2563eb" stroke-width="2.5"></path>
      ${dots}${labels}
    </svg>`;
  }

  return { donut, bars, line, GOLD };
})();
