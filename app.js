const exchangeRate = 1471;

const models = [
  {
    id: "llama3-8b",
    name: "Llama 3 8B",
    params: "8B",
    vram: 24,
    ram: 64,
    storage: 2,
    gpu: "NVIDIA GeForce RTX 4090 24GB",
    cpu: "AMD Ryzen 9 7950X",
    note: "기본 추천",
    examples: [
      "사내 FAQ/상담 이력 기반 답변 자동화",
      "q-q intent embedding으로 유사 질문 캐시 재사용",
      "중소 규모 도메인 문서 RAG 답변"
    ]
  },
  {
    id: "mistral-7b",
    name: "Mistral 7B",
    params: "7B",
    vram: 16,
    ram: 64,
    storage: 2,
    gpu: "NVIDIA GeForce RTX 4080 SUPER 16GB",
    cpu: "AMD Ryzen 9 7900",
    note: "비용 절감",
    examples: [
      "짧은 고객 문의 분류와 답변 초안",
      "저비용 QLoRA 실험 반복",
      "Redis 캐시 중심의 빠른 의도 매칭"
    ]
  },
  {
    id: "qwen2.5-7b",
    name: "Qwen2.5 7B",
    params: "7B",
    vram: 24,
    ram: 64,
    storage: 2,
    gpu: "NVIDIA GeForce RTX 4090 24GB",
    cpu: "AMD Ryzen 9 7950X",
    note: "다국어 균형",
    examples: [
      "한국어/영어 혼합 기술 문서 질의응답",
      "상품/게시글 분류 보조",
      "규칙 기반 필터와 RAG 결합 답변"
    ]
  },
  {
    id: "gemma2-9b",
    name: "Gemma 2 9B",
    params: "9B",
    vram: 24,
    ram: 96,
    storage: 2,
    gpu: "NVIDIA GeForce RTX 4090 24GB",
    cpu: "AMD Ryzen 9 7950X",
    note: "정확도 우선",
    examples: [
      "정책/가이드 문서 기반 답변",
      "긴 문맥 요약과 카테고리 태깅",
      "검수자용 답변 후보 생성"
    ]
  },
  {
    id: "llama3-70b",
    name: "Llama 3 70B",
    params: "70B",
    vram: 48,
    ram: 128,
    storage: 4,
    gpu: "NVIDIA RTX 6000 Ada 48GB",
    cpu: "AMD Threadripper 7970X",
    note: "고사양 경고",
    examples: [
      "대형 모델 QLoRA 실험",
      "높은 품질의 도메인 답변 후보 생성",
      "배치 처리 기반 사내 문서 분석"
    ]
  }
];

const controls = [
  {
    id: "tuningDepth",
    label: "LoRA 학습 강도",
    low: "짧은 실험 중심",
    mid: "일반 파인튜닝",
    high: "긴 학습/반복 실험",
    impact: "GPU VRAM, GPU 등급, 냉각, 전원 여유"
  },
  {
    id: "quantization",
    label: "양자화/메모리 절감",
    low: "FP16 중심",
    mid: "8bit/4bit 혼합",
    high: "QLoRA 적극 사용",
    impact: "낮추면 VRAM 필요량 증가, 올리면 속도보다 메모리 절감 우선"
  },
  {
    id: "ragDepth",
    label: "q-q intent emb RAG 강도",
    low: "캐시 중심",
    mid: "문서 검색 균형",
    high: "검색 후보 확장",
    impact: "RAM, SSD, CPU, Redis 캐시 여유"
  },
  {
    id: "redisLoad",
    label: "Local Redis 캐시 규모",
    low: "소형",
    mid: "중형",
    high: "대형",
    impact: "RAM 용량, SSD 로그 공간"
  },
  {
    id: "datasetSize",
    label: "학습 데이터 규모",
    low: "5만 이하",
    mid: "10만 전후",
    high: "30만 이상",
    impact: "RAM, SSD, CPU 코어, 백업 저장공간"
  },
  {
    id: "batchSize",
    label: "배치/학습 처리량",
    low: "안정 우선",
    mid: "균형",
    high: "처리량 우선",
    impact: "GPU VRAM, GPU 등급, PSU"
  },
  {
    id: "loraRank",
    label: "LoRA rank",
    low: "r=8",
    mid: "r=16~32",
    high: "r=64 이상",
    impact: "GPU VRAM, RAM, 학습 시간"
  },
  {
    id: "contextLength",
    label: "컨텍스트 길이",
    low: "4K",
    mid: "8K",
    high: "16K 이상",
    impact: "GPU VRAM, RAM, 추론 지연"
  },
  {
    id: "storageLevel",
    label: "저장공간 여유",
    low: "최소",
    mid: "권장",
    high: "로그/스냅샷 보존",
    impact: "NVMe SSD 용량, 백업 디스크"
  },
  {
    id: "budgetMargin",
    label: "예산/확장 여유",
    low: "타이트",
    mid: "권장",
    high: "업그레이드 여유",
    impact: "PSU, 메인보드, 케이스, 냉각 확장성"
  }
];

const baseParts = {
  "NVIDIA GeForce RTX 4090 24GB": {
    category: "GPU",
    price: 3100000,
    note: "24GB VRAM 기준 LoRA/QLoRA 실험 권장"
  },
  "NVIDIA GeForce RTX 4080 SUPER 16GB": {
    category: "GPU",
    price: 1850000,
    note: "7B급 QLoRA 비용 절감형"
  },
  "NVIDIA RTX 6000 Ada 48GB": {
    category: "GPU",
    price: 9800000,
    note: "긴 컨텍스트/대형 모델용 48GB VRAM"
  },
  "AMD Ryzen 9 7950X": {
    category: "CPU",
    price: 900000,
    note: "16코어급 로컬 학습/검색 균형"
  },
  "AMD Ryzen 9 7900": {
    category: "CPU",
    price: 560000,
    note: "비용 절감형 12코어급"
  },
  "AMD Threadripper 7970X": {
    category: "CPU",
    price: 3600000,
    note: "대용량 데이터 전처리/워크스테이션급"
  }
};

const sharedParts = [
  {
    category: "Memory",
    name: "DDR5 메모리",
    basePrice: 1208730,
    note: "64GB는 2-DIMM 권장, 128GB 풀뱅크는 클럭 하락 감안"
  },
  {
    category: "Storage",
    name: "NVMe SSD",
    basePrice: Math.round(639.99 * exchangeRate),
    note: "모델/데이터셋/체크포인트 저장"
  },
  {
    category: "Motherboard",
    name: "AM5 X670E/B650E급 보드",
    basePrice: 520000,
    note: "메모리 슬롯 4개, PCIe 확장성 기준"
  },
  {
    category: "PSU",
    name: "CORSAIR RM1000x ATX 3.1",
    basePrice: Math.round(179.99 * exchangeRate),
    note: "4090급 단일 GPU 전원 여유"
  },
  {
    category: "Case",
    name: "Fractal Design Meshify 2",
    basePrice: 216000,
    note: "풀사이즈 GPU와 흡기 여유"
  },
  {
    category: "Cooling",
    name: "상급 공랭 또는 360mm 수랭",
    basePrice: 180000,
    note: "장시간 학습 부하 기준"
  },
  {
    category: "Redis/RAG",
    name: "Local Redis + q-q intent embedding RAG",
    basePrice: 0,
    note: "오픈소스 로컬 구성, 하드웨어 비용 제외"
  }
];

const state = Object.fromEntries(controls.map((control) => [control.id, 4]));
const priceOverrides = {};

const money = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
  maximumFractionDigits: 0
});

function clampLevel(value) {
  return Math.min(7, Math.max(1, Number(value)));
}

function levelText(level, low, mid, high) {
  if (level <= 2) return low;
  if (level <= 5) return mid;
  return high;
}

function selectedModel() {
  return models.find((model) => model.id === document.querySelector("#modelSelect").value) || models[0];
}

function multiplier() {
  const heavy = controls.reduce((sum, control) => {
    if (control.id === "quantization") {
      return sum + (8 - state[control.id]);
    }
    return sum + state[control.id];
  }, 0);
  return 1 + Math.max(0, heavy - 40) * 0.018;
}

function recommendedMemory(model) {
  let memory = Math.max(model.ram, 64);
  if (state.redisLoad >= 6 || state.datasetSize >= 6 || state.contextLength >= 6) {
    memory += 32;
  }
  if (model.id === "llama3-70b" || state.datasetSize >= 7 || state.ragDepth >= 7) {
    memory = Math.max(memory, 128);
  }
  return memory;
}

function memoryConfig(memoryGb) {
  if (memoryGb <= 64) {
    return "64GB, 2x32GB 권장";
  }
  if (memoryGb <= 96) {
    return "96GB, 2-DIMM 우선 권장";
  }
  return "128GB, 4-DIMM 풀뱅크 가능하나 메모리 클럭 하락 감안";
}

function recommendedStorage(model) {
  let storage = model.storage;
  if (state.storageLevel >= 4 || state.datasetSize >= 6) {
    storage += 1;
  }
  if (state.storageLevel >= 6 || state.datasetSize >= 7) {
    storage += 1;
  }
  return storage;
}

function recommendedGpu(model) {
  if (model.id === "llama3-70b") return model.gpu;
  if (state.contextLength >= 7 || state.batchSize >= 7 || state.tuningDepth >= 7) {
    return "NVIDIA RTX 6000 Ada 48GB";
  }
  return model.gpu;
}

function recommendedCpu(model) {
  if (model.id === "llama3-70b" || state.datasetSize >= 7) return "AMD Threadripper 7970X";
  return model.cpu;
}

function parts() {
  const model = selectedModel();
  const gpu = recommendedGpu(model);
  const cpu = recommendedCpu(model);
  const memGb = recommendedMemory(model);
  const storageTb = recommendedStorage(model);
  const dynamicShared = sharedParts.map((part) => {
    if (part.category === "Memory") {
      return {
        ...part,
        name: memoryConfig(memGb),
        basePrice: Math.round(part.basePrice * (memGb / 64)),
        note: memGb >= 128 ? "풀뱅크 사용 시 용량은 확보되지만 DDR5 동작 클럭이 낮아질 수 있음" : part.note
      };
    }
    if (part.category === "Storage") {
      return {
        ...part,
        name: `NVMe SSD ${storageTb}TB 이상`,
        basePrice: Math.round(part.basePrice * (storageTb / 2))
      };
    }
    return part;
  });

  return [
    { ...baseParts[gpu], name: gpu, basePrice: baseParts[gpu].price },
    { ...baseParts[cpu], name: cpu, basePrice: baseParts[cpu].price },
    ...dynamicShared
  ];
}

function total(partsList) {
  return partsList.reduce((sum, part) => {
    const price = priceOverrides[part.category] ?? Math.round(part.basePrice * multiplier());
    return sum + price;
  }, 0);
}

function renderModels() {
  const select = document.querySelector("#modelSelect");
  select.innerHTML = models
    .map((model) => `<option value="${model.id}">${model.name} (${model.note})</option>`)
    .join("");
  select.value = "llama3-8b";
  select.addEventListener("change", render);
}

function renderControls() {
  const list = document.querySelector("#controlList");
  list.innerHTML = controls
    .map(
      (control) => `
        <div class="range-card">
          <div class="range-label">
            <span>${control.label}</span>
            <span class="range-value" id="${control.id}Value">${state[control.id]} / 7</span>
          </div>
          <input id="${control.id}" type="range" min="1" max="7" value="${state[control.id]}" />
          <p class="range-help" id="${control.id}Help">${levelText(
            state[control.id],
            control.low,
            control.mid,
            control.high
          )}</p>
          <p class="range-impact">올리면 영향: ${control.impact}</p>
        </div>
      `
    )
    .join("");

  controls.forEach((control) => {
    document.querySelector(`#${control.id}`).addEventListener("input", (event) => {
      state[control.id] = clampLevel(event.target.value);
      document.querySelector(`#${control.id}Value`).textContent = `${state[control.id]} / 7`;
      document.querySelector(`#${control.id}Help`).textContent = levelText(
        state[control.id],
        control.low,
        control.mid,
        control.high
      );
      render();
    });
  });
}

function renderDl(target, rows) {
  document.querySelector(target).innerHTML = rows
    .map(([term, desc]) => `<dt>${term}</dt><dd>${desc}</dd>`)
    .join("");
}

function renderParts(partsList) {
  document.querySelector("#partsTable").innerHTML = partsList
    .map((part) => {
      const currentPrice = priceOverrides[part.category] ?? Math.round(part.basePrice * multiplier());
      return `
        <tr>
          <td>${part.category}</td>
          <td>${part.name}</td>
          <td>
            <div class="price-input">
              <span>${money.format(currentPrice)}</span>
              <input type="number" min="0" step="10000" value="${currentPrice}" data-category="${part.category}" aria-label="${part.category} 예상 가격" />
            </div>
          </td>
          <td>${part.note}</td>
        </tr>
      `;
    })
    .join("");

  document.querySelectorAll("[data-category]").forEach((input) => {
    input.addEventListener("change", (event) => {
      priceOverrides[event.target.dataset.category] = Math.max(0, Number(event.target.value) || 0);
      render();
    });
  });
}

function renderExamples(model) {
  document.querySelector("#examples").innerHTML = model.examples
    .map(
      (example, index) => `
        <div class="example-card">
          <strong>예시 ${index + 1}</strong>
          <p>${example}</p>
        </div>
      `
    )
    .join("");
}

function render() {
  const model = selectedModel();
  const partsList = parts();
  const gpu = recommendedGpu(model);
  const cpu = recommendedCpu(model);
  const memGb = recommendedMemory(model);
  const storageTb = recommendedStorage(model);
  const totalPrice = total(partsList);
  const highRisk = gpu.includes("RTX 6000") || model.id === "llama3-70b";

  document.querySelector("#totalPrice").textContent = money.format(totalPrice);
  document.querySelector("#confidenceBadge").textContent = highRisk ? "고사양/비용 주의" : "싱글 노드 권장";

  renderDl("#stackList", [
    ["모델", `${model.name} / ${model.params}`],
    ["학습 방식", "LoRA 또는 QLoRA"],
    ["캐시", "Local Redis exact cache"],
    ["검색", "q-q intent embedding RAG"],
    ["배포", "Vercel 정적 웹페이지"]
  ]);

  renderDl("#specList", [
    ["GPU", gpu],
    ["CPU", cpu],
    ["VRAM", `${Math.max(model.vram, gpu.includes("48GB") ? 48 : model.vram)}GB 이상`],
    ["RAM", `${memGb}GB 권장`],
    ["메모리 구성", memoryConfig(memGb)],
    ["Storage", `${storageTb}TB NVMe 이상`],
    ["운영 기준", "로컬 단일 노드, 학습/추론 동시 과부하 방지"]
  ]);

  renderParts(partsList);
  renderExamples(model);
}

renderModels();
renderControls();
render();
