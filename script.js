const optionScore = { A: 3, B: 2, C: 1, D: 0 };

const questions = [
  {
    dim: "参与",
    text: "一场夜市里忽然围起一圈人，讨论正热。你刚走到边上，更可能：",
    options: {
      A: "接一句话，把话题往某个方向带一下",
      B: "不急着说，先把来龙去脉听完整",
      C: "不看中间，去边上听别人怎么议论",
      D: "站在人群里，但基本不出声"
    }
  },
  {
    dim: "能量",
    text: "如果把你的一天拆开来看，更像：",
    options: {
      A: "白天普通，夜里反而更清醒",
      B: "有节奏地做一点，但不会拉满",
      C: "大多数时间低速运行",
      D: "想了很多，但很难真正开始"
    }
  },
  {
    dim: "情绪",
    text: "一间屋子里气氛突然变得压抑，你通常会：",
    options: {
      A: "说点什么，让气氛动一下",
      B: "明显感觉到，但不去改变",
      C: "记住这种感觉，之后慢慢想",
      D: "尽量把注意力移开"
    }
  },
  {
    dim: "现实",
    text: "一件现实问题摆在面前，你更接近：",
    options: {
      A: "直接动手处理",
      B: "先等等，看情况发展",
      C: "想办法绕开一部分",
      D: "暂时放着不动"
    }
  },
  {
    dim: "参与",
    text: "进入一个完全陌生的环境，你第一反应是：",
    options: {
      A: "找一个点切进去参与",
      B: "先看整体结构再决定",
      C: "留意边角发生了什么",
      D: "可以在，但不太想被注意"
    }
  },
  {
    dim: "能量",
    text: "连续几天都需要投入精力时，你更可能：",
    options: {
      A: "能撑住，但情绪起伏会变大",
      B: "逐渐降低参与度",
      C: "很快开始拖延或停下来",
      D: "白天低效，晚上再补"
    }
  },
  {
    dim: "情绪",
    text: "经历一件冲击比较大的事后，你更可能：",
    options: {
      A: "当下说出来或表达",
      B: "放在心里慢慢消化",
      C: "把它当作一个“现象”去看",
      D: "不太想再碰这个感受"
    }
  },
  {
    dim: "现实",
    text: "你和现实之间的关系更像：",
    options: {
      A: "在里面参与",
      B: "在里面，但留一点距离",
      C: "多数时候在边上看",
      D: "尽量不正面进入"
    }
  },
  {
    dim: "参与",
    text: "面对一件复杂的事情，你更接近哪种节奏：",
    options: {
      A: "先说再调整",
      B: "先看再判断",
      C: "先收集零散信息",
      D: "一直在，但不真正介入"
    }
  },
  {
    dim: "能量",
    text: "没有外部要求时，你的自然状态更像：",
    options: {
      A: "会主动找点事情做",
      B: "做一点，但保持余量",
      C: "很慢地运转",
      D: "基本不启动"
    }
  },
  {
    dim: "情绪",
    text: "“情绪说出来会更轻一点”",
    options: {
      A: "很同意",
      B: "有时是",
      C: "不太是",
      D: "基本不是"
    }
  },
  {
    dim: "现实",
    text: "当现实和你内心不一致时，你更可能：",
    options: {
      A: "调整自己去适应",
      B: "保留一部分自己的空间",
      C: "往内收，不太对外说",
      D: "直接回避这件事"
    }
  },
  {
    dim: "参与",
    text: "在一个持续存在的群体中，你更像：",
    options: {
      A: "会影响气氛的人",
      B: "偶尔参与一下",
      C: "一直在，但不太显眼",
      D: "多数时候只是旁观"
    }
  },
  {
    dim: "能量",
    text: "你恢复状态的方式更接近：",
    options: {
      A: "和人互动一下",
      B: "自己待一会整理",
      C: "放空一段时间",
      D: "等某个时间点自然恢复"
    }
  },
  {
    dim: "情绪",
    text: "如果必须选一种方式面对情绪，你更接近：",
    options: {
      A: "释放出来",
      B: "慢慢理清",
      C: "先放着",
      D: "尽量不碰"
    }
  },
  {
    dim: "现实",
    text: "如果把你放在一个“必须做选择”的节点上，你更可能：",
    options: {
      A: "直接做决定",
      B: "再观察一会",
      C: "找一个折中的方式",
      D: "尽量延后这个选择"
    }
  }
];

const labels = {
  A: {
    name: "下水道诗人",
    scene: "画面：深夜反复改一句话，最终没有发出去。",
    poem: "你在水线以下写作。\n句子被反复打磨，像石头在暗流里变圆。\n没有观众，但你仍把话写到最锋利。",
    analysis:
      "你是“表达前加工型”。会先把感受转译成更精确的语言，再决定是否说出。优点是洞察细节、表达质量高；代价是输出频率低，容易错过时机。你对“说什么”要求高于“要不要说”，因此在公共场合常显得安静，但一旦表达，通常有密度。"
  },
  B: {
    name: "末班车守望者",
    scene: "画面：人群散去后，你还站在原地看完整个收尾。",
    poem: "灯一盏盏灭，你才确认方向。\n你不赶车，你等终点显形。",
    analysis:
      "你是“延迟决策型”。习惯在信息充分、情绪回落后再行动。优点是判断稳、少后悔；代价是进入节奏慢，容易被认为不积极。你更像终局观察者而非过程参与者，适合做收尾判断、复盘、风险把控。"
  },
  C: {
    name: "情绪女巫",
    scene: "画面：你一句话，房间里的气氛立刻改变。",
    poem: "你不说情绪，你点燃它。\n火起于言，场随你转。",
    analysis:
      "你是“情绪放大器”。对氛围极敏感，并能通过语言或表情迅速调动场域。优点是带节奏、共情强、能凝聚或打散气氛；风险是容易过度放大情绪，自己也会被反噬。适合需要情绪动员的情境，不适合高压理性决策场。"
  },
  D: {
    name: "信息拾荒者",
    scene: "画面：你不看正文，直接滑到评论区。",
    poem: "主线太直，你去拐角。\n碎片更亮，你在边缘发光。",
    analysis:
      "你是“边角信息优先型”。更信任多源、碎片、反常识的材料。优点是视角多、能发现被忽略的点；风险是信息过载、难以收束结论。你更擅长“发现问题”而非“定论问题”，在探索阶段价值更高。"
  },
  E: {
    name: "夜间巡游体",
    scene: "画面：凌晨两点忽然清醒，开始处理白天没做的事。",
    poem: "白日如雾，夜晚成形。\n你在暗处运行，节律自成。",
    analysis:
      "你是“错峰运行型”。精力与主流时间表不同，夜间效率更高。优点是能避开干扰、深度专注；代价是与他人协作成本高、作息易失衡。适合独立任务、需要长时间沉浸的工作。"
  },
  F: {
    name: "无效人类",
    scene: "画面：躺着想了一天计划，最后一项也没开始。",
    poem: "万念起而不动。\n世界喧哗，你按下静止。",
    analysis:
      "你是“启动阈值过高型”。并非没有能力，而是多数任务不构成“值得开始”的理由。优点是避免无效消耗、对意义有筛选；风险是长期停滞、机会流失。关键在于降低启动门槛（切成最小步），而非增加计划。"
  },
  G: {
    name: "现实逃兵",
    scene: "画面：该处理的事情你绕开，先去做别的。",
    poem: "你不否认战场，你选择侧身。\n刀未出鞘，人已离位。",
    analysis:
      "你是“回避冲突型”。对压力与不确定性有预警，会主动保持距离。优点是自我保护强、避免正面损耗；风险是问题累积、焦虑转移。需要区分“暂避（策略）”与“长期回避（成本）”，为关键事项设定不可绕开的触发点。"
  },
  H: {
    name: "情感巢居者",
    scene: "画面：什么都没说，但在心里把一段关系想了很多层。",
    poem: "你在内里筑巢。\n情绪被安放，层层有序。",
    analysis:
      "你是“内向整合型”。倾向把情绪结构化处理，而非即时表达。优点是稳定、深度高、关系一旦建立就很牢；代价是外界难以读取你，容易被误解为冷淡。适合深关系，不适合需要快速反馈的互动。"
  },
  I: {
    name: "半透明人",
    scene: "画面：你在场发过言，但事后几乎没人记得。",
    poem: "你穿行其间，不留涟漪。\n光过其身，形不驻名。",
    analysis:
      "你是“低痕迹融入型”。能快速适应环境，但不主动占据注意力。优点是摩擦小、适配广；风险是贡献被低估、存在感不足。需要在关键节点“提高显影度”（总结、定锚、复述），让价值被看见。"
  },
  J: {
    name: "影子居民",
    scene: "画面：长期待在角落，看同一群人反复发生故事。",
    poem: "你居于光外，久而为常。\n万象更迭，你守其侧。",
    analysis:
      "你是“稳定边缘型”。并非偶尔旁观，而是持续选择不进入中心。优点是视野稳定、判断不被情境裹挟；代价是机会接触面窄、影响力有限。适合长期观察与记录，但需要周期性地“进入一次中心”以更新视角。"
  }
};

const prototypes = {
  A: [0.25, 0.35, 0.8, 0.6],
  B: [0.2, 0.5, 0.4, 0.5],
  C: [0.85, 0.7, 0.9, 0.7],
  D: [0.3, 0.5, 0.4, 0.4],
  E: [0.4, 0.6, 0.5, 0.6],
  F: [0.1, 0.1, 0.3, 0.2],
  G: [0.2, 0.3, 0.4, 0.1],
  H: [0.3, 0.4, 0.85, 0.5],
  I: [0.35, 0.4, 0.4, 0.55],
  J: [0.15, 0.4, 0.35, 0.6]
};

const state = {
  index: 0,
  answers: Array(questions.length).fill(null),
  result: null
};

const homeScreen = document.getElementById("homeScreen");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");
const startBtn = document.getElementById("startBtn");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const questionTitle = document.getElementById("questionTitle");
const questionText = document.getElementById("questionText");
const optionsBox = document.getElementById("options");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const resultName = document.getElementById("resultName");
const resultScene = document.getElementById("resultScene");
const resultPoem = document.getElementById("resultPoem");
const resultAnalysis = document.getElementById("resultAnalysis");
const probabilityList = document.getElementById("probabilityList");
const secondaryResult = document.getElementById("secondaryResult");
const shareBtn = document.getElementById("shareBtn");
const copyBtn = document.getElementById("copyBtn");
const restartBtn = document.getElementById("restartBtn");
const shareHint = document.getElementById("shareHint");

startBtn.addEventListener("click", () => {
  state.index = 0;
  showScreen("quiz");
  renderQuestion();
});

prevBtn.addEventListener("click", () => {
  state.index = Math.max(0, state.index - 1);
  renderQuestion();
});

nextBtn.addEventListener("click", () => {
  if (!state.answers[state.index]) return;
  if (state.index === questions.length - 1) {
    state.result = calculateResult(state.answers);
    renderResult(state.result);
    showScreen("result");
    return;
  }
  state.index += 1;
  renderQuestion();
});

restartBtn.addEventListener("click", () => {
  state.answers = Array(questions.length).fill(null);
  state.result = null;
  showScreen("home");
});

shareBtn.addEventListener("click", async () => {
  if (!state.result) return;
  const text = createShareText(state.result);
  const url = `${location.origin}${location.pathname}?result=${encodeURIComponent(state.result.mainId)}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "暗潮人格测试结果",
        text,
        url
      });
      shareHint.textContent = "已调用系统分享面板，可在微信中转发。";
      return;
    } catch {
      // 用户取消分享，无需提示为错误
    }
  }

  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(url)}`;
  window.open(qr, "_blank");
  shareHint.textContent = "已打开分享二维码，微信扫一扫可查看你的结果。";
});

copyBtn.addEventListener("click", async () => {
  if (!state.result) return;
  const text = createShareText(state.result);
  try {
    await navigator.clipboard.writeText(text);
    shareHint.textContent = "结果文案已复制，可直接粘贴到微信。";
  } catch {
    shareHint.textContent = "复制失败，请手动复制页面内容。";
  }
});

function showScreen(name) {
  homeScreen.classList.toggle("active", name === "home");
  quizScreen.classList.toggle("active", name === "quiz");
  resultScreen.classList.toggle("active", name === "result");
}

function renderQuestion() {
  const q = questions[state.index];
  questionTitle.textContent = `Q${state.index + 1}（${q.dim}）`;
  questionText.textContent = q.text;
  progressText.textContent = `第 ${state.index + 1} / ${questions.length} 题`;
  progressFill.style.width = `${((state.index + 1) / questions.length) * 100}%`;
  prevBtn.disabled = state.index === 0;
  nextBtn.disabled = !state.answers[state.index];

  optionsBox.innerHTML = "";
  Object.entries(q.options).forEach(([key, text]) => {
    const btn = document.createElement("button");
    btn.className = `option-btn ${state.answers[state.index] === key ? "active" : ""}`;
    btn.textContent = `${key}. ${text}`;
    btn.addEventListener("click", () => {
      state.answers[state.index] = key;
      renderQuestion();
    });
    optionsBox.appendChild(btn);
  });
}

function calculateResult(answers) {
  const score = answers.map((a) => optionScore[a]);
  const P = score[0] + score[4] + score[8] + score[12];
  const E = score[1] + score[5] + score[9] + score[13];
  const M = score[2] + score[6] + score[10] + score[14];
  const R = score[3] + score[7] + score[11] + score[15];

  let p = clamp01(P / 12 + jitter());
  let e = clamp01(E / 12 + jitter());
  let m = clamp01(M / 12 + jitter());
  let r = clamp01(R / 12 + jitter());

  if (e < 0.15) return forcedResult("F", { p, e, m, r }, "极低能量强制规则");
  if (m > 0.85 && p > 0.7) return forcedResult("C", { p, e, m, r }, "高情绪 + 高参与强制规则");
  if (r < 0.15) return forcedResult("G", { p, e, m, r }, "强现实回避强制规则");

  const k = 8;
  const raw = Object.entries(prototypes).map(([id, vector]) => {
    const d =
      (p - vector[0]) ** 2 +
      (e - vector[1]) ** 2 +
      (m - vector[2]) ** 2 +
      (r - vector[3]) ** 2;
    const scoreVal = Math.exp(-k * d);
    return { id, d, score: scoreVal };
  });

  const total = raw.reduce((sum, item) => sum + item.score, 0);
  const probs = raw
    .map((item) => ({ ...item, prob: item.score / total }))
    .sort((a, b) => b.prob - a.prob);

  const main = probs[0];
  const second = probs[1];
  const secondary = main.prob - second.prob < 0.08 ? second.id : null;

  return {
    mode: "softmax",
    mainId: main.id,
    secondaryId: secondary,
    probs,
    metrics: { p, e, m, r }
  };
}

function forcedResult(id, metrics, rule) {
  const probs = Object.keys(prototypes).map((key) => ({
    id: key,
    prob: key === id ? 1 : 0,
    d: null,
    score: null
  }));
  return {
    mode: "forced",
    forcedRule: rule,
    mainId: id,
    secondaryId: null,
    probs,
    metrics
  };
}

function renderResult(result) {
  const profile = labels[result.mainId];
  resultName.textContent = profile.name;
  resultScene.textContent = profile.scene;
  resultPoem.textContent = profile.poem;
  resultAnalysis.textContent = profile.analysis;

  probabilityList.innerHTML = "";
  result.probs
    .sort((a, b) => b.prob - a.prob)
    .forEach((item) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${labels[item.id].name}</span><span>${(item.prob * 100).toFixed(1)}%</span>`;
      probabilityList.appendChild(li);
    });

  if (result.secondaryId) {
    secondaryResult.classList.remove("hidden");
    secondaryResult.textContent = `副结果：${labels[result.secondaryId].name}（与主结果差值 < 0.08）`;
  } else {
    secondaryResult.classList.add("hidden");
  }

  if (result.mode === "forced") {
    shareHint.textContent = `命中规则：${result.forcedRule}`;
  } else {
    shareHint.textContent = "";
  }
}

function createShareText(result) {
  const main = labels[result.mainId].name;
  const second = result.secondaryId ? `；副结果：${labels[result.secondaryId].name}` : "";
  return `我在「暗潮人格测试」里的结果是：${main}${second}。\n来测测你的夜色人格：${location.href}`;
}

function jitter() {
  return Math.random() * 0.06 - 0.03;
}

function clamp01(val) {
  return Math.max(0, Math.min(1, val));
}
