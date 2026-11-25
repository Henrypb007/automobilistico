const DAMAGE_CATALOG = [
  {
    id: "para-choque-dianteiro",
    title: "Trinca e Desalinhamento do Para-Choque Dianteiro",
    code: "FUN-104",
    category: "funilaria",
    severity: "moderado",
    urgency: "Média",
    time: "4h – 7h",
    cost: "R$ 650 – R$ 1.450",
    x: 50,
    y: 12,
    desc: "Fissura em ABS/polipropileno e travas laterais deslocadas após impacto leve ou raspada em guia.",
    steps: [
      "Remover o para-choque e inspecionar guias e absorvedor de impacto.",
      "Realizar solda plástica a quente na trinca interna e reforço com tela metálica.",
      "Preparar superfície, aplicar primer flexível, pintar na tonalidade e verniz automotivo.",
      "Reinstalar verificando folgas e alinhamento com faróis e capô."
    ],
    parts: ["Para-choque ABS", "Presilhas/Guias", "Primer Flexível", "Solda Plástica"]
  },
  {
    id: "vazamento-arrefecimento",
    title: "Vazamento de Fluido no Radiador / Mangueira",
    code: "MEC-218",
    category: "mecanica",
    severity: "critico",
    urgency: "Imediata",
    time: "2h – 4h",
    cost: "R$ 380 – R$ 1.100",
    x: 50,
    y: 28,
    desc: "Perda de líquido de arrefecimento com risco de superaquecimento do motor e empenamento de cabeçote.",
    steps: [
      "Aguardar o motor esfriar e pressurizar o sistema para localizar o ponto exato.",
      "Substituir mangueira ressecada, abraçadeiras ou reparar/trocar o radiador.",
      "Completar com aditivo na proporção recomendada e sangrar o ar do circuito.",
      "Monitorar temperatura de trabalho e ausência de vazamentos."
    ],
    parts: ["Mangueira Superior", "Abraçadeiras Inox", "Aditivo Concentrado", "Tampa/Radiador"]
  },
  {
    id: "pivo-bandeja-dianteira",
    title: "Folga no Pivô / Bucha da Bandeja Dianteira",
    code: "SUS-309",
    category: "suspensao",
    severity: "critico",
    urgency: "Alta",
    time: "2h – 3h30",
    cost: "R$ 420 – R$ 980",
    x: 16,
    y: 34,
    desc: "Estalos em esterçamento ou irregularidades, desgaste irregular da banda do pneu e perda de precisão.",
    steps: [
      "Elevar o veículo com segurança e verificar folgas na roda e articulações.",
      "Substituir buchas e/ou pivô da bandeja com prensa hidráulica adequada.",
      "Executar alinhamento de direção (convergência/cáster) e balanceamento."
    ],
    parts: ["Bandeja/Buchas", "Pivô de Suspensão", "Porcas Autotravantes"]
  },
  {
    id: "sensor-abs-roda",
    title: "Falha no Sensor de Rotação / Chicote ABS",
    code: "ELE-412",
    category: "eletrica",
    severity: "moderado",
    urgency: "Média",
    time: "1h – 2h",
    cost: "R$ 240 – R$ 620",
    x: 84,
    y: 34,
    desc: "Luz de ABS/controle de estabilidade acesa por cabo rompido ou contaminação magnética no sensor.",
    steps: [
      "Conectar scanner OBD-II/ABS para identificar a roda exata com sinal ausente.",
      "Inspecionar chicote, conector e pista magnética do cubo de roda.",
      "Substituir o sensor danificado e limpar o código de falha na central."
    ],
    parts: ["Sensor de Roda ABS", "Limpa-Contatos", "Abraçadeiras"]
  },
  {
    id: "mossa-porta-lateral",
    title: "Amassado Sem Perda de Pintura na Porta",
    code: "FUN-152",
    category: "funilaria",
    severity: "leve",
    urgency: "Baixa",
    time: "1h30 – 3h",
    cost: "R$ 220 – R$ 580",
    x: 82,
    y: 56,
    desc: "Deformação superficial em chapa metálica com verniz íntegro, ideal para martelinho de ouro.",
    steps: [
      "Iluminar a área com régua/fita de reflexão para mapear o vinco.",
      "Acessar por trás do painel interno ou utilizar ventosas de tração controlada.",
      "Finalizar com polimento técnico para uniformizar o brilho."
    ],
    parts: ["Ferramentas PDR", "Ventosas", "Massa/Cera de Polimento"]
  }
];

const VEHICLE_PROFILES = {
  esportivo: { scaleX: 1.02, scaleY: 1.0, cabinTop: 84, cabinHeight: 132 },
  seda: { scaleX: 1.0, scaleY: 1.06, cabinTop: 78, cabinHeight: 152 },
  suv: { scaleX: 1.08, scaleY: 1.04, cabinTop: 68, cabinHeight: 174 },
  hatch: { scaleX: 0.98, scaleY: 0.92, cabinTop: 74, cabinHeight: 148 }
};

const state = {
  category: "all",
  query: "",
  selectedId: DAMAGE_CATALOG[0].id,
  yaw: 24,
  pitch: -12,
  zoom: 1,
  xray: false,
  motionPaused: false,
  pointer: { x: 0.5, y: 0.5 }
};

const dom = {
  canvas: document.getElementById("bg-cars-canvas"),
  vehicleSelect: document.getElementById("vehicle-select"),
  toggleMotion: document.getElementById("toggle-motion"),
  searchInput: document.getElementById("search-input"),
  clearSearch: document.getElementById("clear-search"),
  categoryFilters: document.getElementById("category-filters"),
  btnXray: document.getElementById("btn-xray"),
  btnResetView: document.getElementById("btn-reset-view"),
  stage3d: document.getElementById("stage-3d"),
  carRig: document.getElementById("car-3d-rig"),
  carCabin: document.querySelector(".car-cabin"),
  carBodyShell: document.querySelector(".car-body-shell"),
  hotspotsLayer: document.getElementById("hotspots-layer"),
  hudYaw: document.getElementById("hud-yaw"),
  hudPitch: document.getElementById("hud-pitch"),
  hudZoom: document.getElementById("hud-zoom"),
  resultsCount: document.getElementById("results-count"),
  severityBadge: document.getElementById("severity-badge"),
  damageList: document.getElementById("damage-list"),
  detailTitle: document.getElementById("detail-title"),
  detailCode: document.getElementById("detail-code"),
  detailDesc: document.getElementById("detail-desc"),
  detailTime: document.getElementById("detail-time"),
  detailCost: document.getElementById("detail-cost"),
  detailUrgency: document.getElementById("detail-urgency"),
  detailSteps: document.getElementById("detail-steps"),
  detailParts: document.getElementById("detail-parts")
};

function getFilteredDamages() {
  const q = state.query.trim().toLowerCase();
  return DAMAGE_CATALOG.filter((item) => {
    const matchesCat = state.category === "all" || item.category === state.category;
    const matchesText =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.parts.some((p) => p.toLowerCase().includes(q));
    return matchesCat && matchesText;
  });
}

function update3DTransform() {
  dom.carRig.style.transform = `rotateX(${state.pitch}deg) rotateZ(${state.yaw}deg) scale(${state.zoom})`;
  dom.hudYaw.textContent = `${Math.round(state.yaw)}°`;
  dom.hudPitch.textContent = `${Math.round(state.pitch)}°`;
  dom.hudZoom.textContent = `${state.zoom.toFixed(2)}x`;
}

function renderHotspots(items) {
  dom.hotspotsLayer.innerHTML = "";
  items.forEach((item) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `hotspot ${item.id === state.selectedId ? "selected" : ""}`;
    btn.dataset.sev = item.severity;
    btn.style.left = `${item.x}%`;
    btn.style.top = `${item.y}%`;
    btn.title = `${item.code}: ${item.title}`;
    btn.setAttribute("aria-label", `${item.title} (${item.severity})`);
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      selectDamage(item.id);
    });
    dom.hotspotsLayer.appendChild(btn);
  });
}

function renderList(items) {
  dom.damageList.innerHTML = "";
  dom.resultsCount.textContent = `${items.length} ocorrência(s) encontrada(s)`;

  if (!items.length) {
    dom.damageList.innerHTML = `<p class="muted">Nenhum dano corresponde ao filtro atual.</p>`;
    return;
  }

  items.forEach((item) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `damage-item ${item.id === state.selectedId ? "active" : ""}`;
    btn.innerHTML = `
      <div>
        <strong>${item.title}</strong>
        <small>${item.code} • ${item.time}</small>
      </div>
      <span class="badge badge-${item.severity}">${item.severity}</span>
    `;
    btn.addEventListener("click", () => selectDamage(item.id));
    dom.damageList.appendChild(btn);
  });
}

function renderDetail(item) {
  if (!item) return;
  dom.detailTitle.textContent = item.title;
  dom.detailCode.textContent = item.code;
  dom.detailDesc.textContent = item.desc;
  dom.detailTime.textContent = item.time;
  dom.detailCost.textContent = item.cost;
  dom.detailUrgency.textContent = item.urgency;

  dom.severityBadge.className = `badge badge-${item.severity}`;
  dom.severityBadge.textContent = item.severity;

  dom.detailSteps.innerHTML = item.steps.map((s) => `<li>${s}</li>`).join("");
  dom.detailParts.innerHTML = item.parts.map((p) => `<span class="part-tag">${p}</span>`).join("");
}

function selectDamage(id) {
  state.selectedId = id;
  const filtered = getFilteredDamages();
  const activeItem = DAMAGE_CATALOG.find((d) => d.id === id) || filtered[0];
  renderHotspots(filtered);
  renderList(filtered);
  renderDetail(activeItem);
}

function init3DViewerEvents() {
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  dom.stage3d.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".hotspot")) return;
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
  });

  window.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    state.yaw += dx * 0.45;
    state.pitch = Math.max(-55, Math.min(55, state.pitch - dy * 0.35));
    update3DTransform();
  });

  window.addEventListener("pointerup", () => {
    dragging = false;
  });

  dom.stage3d.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      state.zoom = Math.max(0.7, Math.min(1.45, state.zoom - e.deltaY * 0.001));
      update3DTransform();
    },
    { passive: false }
  );

  dom.btnXray.addEventListener("click", () => {
    state.xray = !state.xray;
    dom.btnXray.setAttribute("aria-pressed", String(state.xray));
    dom.stage3d.classList.toggle("xray-active", state.xray);
  });

  dom.btnResetView.addEventListener("click", () => {
    state.yaw = 24;
    state.pitch = -12;
    state.zoom = 1;
    update3DTransform();
  });

  dom.vehicleSelect.addEventListener("change", (e) => {
    const profile = VEHICLE_PROFILES[e.target.value] || VEHICLE_PROFILES.esportivo;
    dom.carBodyShell.style.transform = `scale(${profile.scaleX}, ${profile.scaleY})`;
    dom.carCabin.style.top = `${profile.cabinTop}px`;
    dom.carCabin.style.height = `${profile.cabinHeight}px`;
  });
}

function initFlyingCarsBackground() {
  const ctx = dom.canvas.getContext("2d");
  let width = 0;
  let height = 0;

  function resize() {
    width = dom.canvas.width = window.innerWidth;
    height = dom.canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (e) => {
    state.pointer.x = e.clientX / Math.max(1, width);
    state.pointer.y = e.clientY / Math.max(1, height);
  });

  const cars = Array.from({ length: 14 }, (_, idx) => ({
    x: Math.random() * 1400,
    y: Math.random() * 900,
    depth: 0.45 + Math.random() * 0.95,
    vx: 0.35 + Math.random() * 0.75,
    vy: (Math.random() - 0.5) * 0.25,
    tilt: (Math.random() - 0.5) * 0.28,
    phase: Math.random() * Math.PI * 2,
    color: idx % 2 === 0 ? "rgba(0, 229, 255, 0.24)" : "rgba(255, 77, 0, 0.22)"
  }));

  function drawCarWireframe(car, time) {
    const bob = Math.sin(time * 0.0018 + car.phase) * 10 * car.depth;
    const parallaxX = (state.pointer.x - 0.5) * 26 * car.depth;
    const parallaxY = (state.pointer.y - 0.5) * 18 * car.depth;
    const w = 96 * car.depth;
    const h = 34 * car.depth;

    ctx.save();
    ctx.translate(car.x + parallaxX, car.y + bob + parallaxY);
    ctx.rotate(car.tilt + Math.sin(time * 0.001 + car.phase) * 0.04);
    ctx.strokeStyle = car.color;
    ctx.lineWidth = Math.max(1, 1.5 * car.depth);

    // Silhueta lateral aerodinâmica estilizada
    ctx.beginPath();
    ctx.moveTo(-w * 0.5, h * 0.25);
    ctx.lineTo(-w * 0.42, -h * 0.15);
    ctx.lineTo(-w * 0.12, -h * 0.58);
    ctx.lineTo(w * 0.22, -h * 0.55);
    ctx.lineTo(w * 0.48, -h * 0.12);
    ctx.lineTo(w * 0.52, h * 0.25);
    ctx.closePath();
    ctx.stroke();

    // Rodas em perspectiva
    const wheelR = 8.5 * car.depth;
    [-w * 0.28, w * 0.28].forEach((wx) => {
      ctx.beginPath();
      ctx.arc(wx, h * 0.28, wheelR, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Linha de fluxo/rastro sutil
    ctx.beginPath();
    ctx.moveTo(-w * 0.55, 0);
    ctx.lineTo(-w * 0.95, 0);
    ctx.stroke();

    ctx.restore();
  }

  function loop(now) {
    ctx.clearRect(0, 0, width, height);

    for (const car of cars) {
      if (!state.motionPaused) {
        car.x += car.vx * car.depth;
        car.y += car.vy * car.depth;
        if (car.x > width + 140) car.x = -140;
        if (car.y < -80) car.y = height + 80;
        if (car.y > height + 80) car.y = -80;
      }
      drawCarWireframe(car, now);
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

dom.searchInput.addEventListener("input", (e) => {
  state.query = e.target.value;
  const filtered = getFilteredDamages();
  if (filtered.length && !filtered.some((d) => d.id === state.selectedId)) {
    state.selectedId = filtered[0].id;
  }
  renderHotspots(filtered);
  renderList(filtered);
  renderDetail(DAMAGE_CATALOG.find((d) => d.id === state.selectedId) || filtered[0]);
});

dom.clearSearch.addEventListener("click", () => {
  dom.searchInput.value = "";
  state.query = "";
  selectDamage(DAMAGE_CATALOG[0].id);
});

dom.categoryFilters.addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  dom.categoryFilters.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
  chip.classList.add("active");
  state.category = chip.dataset.category;
  const filtered = getFilteredDamages();
  if (filtered.length) state.selectedId = filtered[0].id;
  renderHotspots(filtered);
  renderList(filtered);
  renderDetail(filtered[0]);
});

dom.toggleMotion.addEventListener("click", () => {
  state.motionPaused = !state.motionPaused;
  dom.toggleMotion.setAttribute("aria-pressed", String(state.motionPaused));
  dom.toggleMotion.textContent = state.motionPaused ? "Retomar 3D" : "Pausar 3D";
});

update3DTransform();
init3DViewerEvents();
initFlyingCarsBackground();
selectDamage(state.selectedId);
