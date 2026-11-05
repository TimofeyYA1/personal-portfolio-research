// Progressive enhancement only: content stays readable without this module or Motion.
const locale = document.body.dataset.locale === 'en' ? 'en' : 'ru';
const words = (ru, en) => locale === 'ru' ? ru : en;
const cleanup = [];
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let disposed = false;

// A rejected draft returns the exact previous rule, with no mutation or partial apply.
export function evaluateRuleDraft(segment, value, previousRule) {
  if (!['new', 'all'].includes(segment)) return { accepted: false, reason: 'audience', rule: previousRule };
  const bonus = Number(value);
  if (!Number.isInteger(bonus) || bonus < 1 || bonus > 10) return { accepted: false, reason: 'bonus', rule: previousRule };
  return { accepted: true, reason: null, rule: { segment, bonus } };
}

function listen(target, event, handler, options) {
  target.addEventListener(event, handler, options);
  cleanup.push(() => target.removeEventListener(event, handler, options));
}

function initMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;
  let open = false;
  const setOpen = next => {
    open = next;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.classList.toggle('is-open', open);
    menu.hidden = !open;
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  };
  listen(toggle, 'click', () => setOpen(!open));
  listen(menu, 'click', event => {
    if (event.target.closest('a')) setOpen(false);
  });
  listen(document, 'keydown', event => {
    if (event.key === 'Escape' && open) {
      setOpen(false);
      toggle.focus();
    }
  });
  listen(document, 'click', event => {
    if (open && !menu.contains(event.target) && !toggle.contains(event.target)) setOpen(false);
  });
  listen(window, 'resize', () => {
    if (open && window.getComputedStyle(toggle).display === 'none') setOpen(false);
  }, { passive: true });
  setOpen(false);
}

function legacyCopy(text) {
  const field = document.createElement('textarea');
  const focused = document.activeElement;
  const selection = window.getSelection();
  const ranges = selection ? Array.from({ length: selection.rangeCount }, (_, i) => selection.getRangeAt(i).cloneRange()) : [];
  field.value = text;
  field.readOnly = true;
  field.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;font-size:16px';
  field.setAttribute('aria-hidden', 'true');
  document.body.append(field);
  let copied = false;
  try {
    field.select();
    field.setSelectionRange(0, field.value.length);
    copied = typeof document.execCommand === 'function' && document.execCommand('copy');
  } catch { copied = false; }
  field.remove();
  focused?.focus?.({ preventScroll: true });
  if (selection && ranges.length) {
    selection.removeAllRanges();
    ranges.forEach(range => selection.addRange(range));
  }
  return copied;
}

function initCopyEmail() {
  document.querySelectorAll('[data-copy]').forEach(button => {
    const status = button.parentElement.querySelector('.copy-status');
    const original = button.textContent;
    let timer;
    let busy = false;
    listen(button, 'click', async () => {
      if (busy) return;
      busy = true;
      const text = button.dataset.copy;
      let copied = false;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
          copied = true;
        }
      } catch { /* A blocked clipboard can still support the selection fallback. */ }
      if (!copied) copied = legacyCopy(text);
      if (disposed) return;
      clearTimeout(timer);
      button.textContent = copied ? words('Скопировано', 'Copied') : original;
      if (status) {
        status.classList.toggle('sr', copied);
        status.textContent = copied
          ? words('Адрес скопирован.', 'Email address copied.')
          : words(`Не удалось скопировать автоматически. Адрес: ${text}`, `Automatic copying was unavailable. Email: ${text}`);
      }
      timer = setTimeout(() => { button.textContent = original; }, 2400);
      busy = false;
    });
    cleanup.push(() => clearTimeout(timer));
  });
}

function initProgress() {
  const progress = document.querySelector('.reading-progress');
  if (!progress) return;
  let frame = 0;
  progress.style.transformOrigin = '0 50%';
  const update = () => {
    frame = 0;
    const scrolling = document.scrollingElement || document.documentElement;
    const distance = scrolling.scrollHeight - document.documentElement.clientHeight;
    const fraction = distance > 0 ? Math.min(1, Math.max(0, scrolling.scrollTop / distance)) : 0;
    progress.style.transform = `scaleX(${fraction})`;
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  listen(window, 'scroll', schedule, { passive: true });
  listen(window, 'resize', schedule, { passive: true });
  listen(window, 'pageshow', schedule, { passive: true });
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    cleanup.push(() => observer.disconnect());
  }
  document.fonts?.ready.then(schedule);
  cleanup.push(() => cancelAnimationFrame(frame));
  update();
}

function initEntranceMotion() {
  let initialized = false;
  let retry = 0;
  let stopInView;
  const startedAt = performance.now();
  const active = new Map();

  const stopAll = () => {
    active.forEach(({ controls, restore }) => {
      controls?.stop?.();
      restore();
    });
    active.clear();
  };

  function reveal(element, delay = 0) {
    if (motionPreference.matches || element.dataset.motionRevealed) return;
    const api = window.Motion;
    if (typeof api?.animate !== 'function') return;
    element.dataset.motionRevealed = 'true';
    const prior = { opacity: element.style.opacity, transform: element.style.transform };
    const restore = () => {
      element.style.opacity = prior.opacity;
      element.style.transform = prior.transform;
      active.delete(element);
    };
    try {
      const controls = api.animate(element, { opacity: [0, 1], y: [18, 0] }, {
        duration: 0.7, delay, ease: [0.22, 1, 0.36, 1],
      });
      active.set(element, { controls, restore });
      if (typeof controls?.then === 'function') controls.then(restore, restore);
    } catch { restore(); }
  }

  function initialize() {
    if (disposed || initialized || motionPreference.matches) return;
    const api = window.Motion;
    if (typeof api?.animate !== 'function' || typeof api?.inView !== 'function') {
      if (performance.now() - startedAt < 3000) retry = setTimeout(initialize, 120);
      return;
    }
    initialized = true;
    const entrance = document.querySelectorAll('.hero-intro, .headline-line > span, .headline-line > em, .hero-description, .hero-cta, .hero-foot');
    entrance.forEach((element, index) => reveal(element, Math.min(index * 0.075, 0.35)));
    const targets = Array.from(document.querySelectorAll('.reveal'));
    if (targets.length) {
      try {
        stopInView = api.inView(targets, element => { reveal(element); }, { amount: 0.12 });
      } catch {
        // Failure to observe never leaves hidden elements behind.
        targets.forEach(element => { element.style.opacity = ''; element.style.transform = ''; });
      }
    }
  }

  listen(motionPreference, 'change', () => {
    if (motionPreference.matches) {
      stopAll();
      clearTimeout(retry);
    } else initialize();
  });
  const script = document.querySelector('script[src$="motion.js"]');
  if (script) listen(script, 'load', initialize, { once: true });
  cleanup.push(() => { clearTimeout(retry); stopInView?.(); stopAll(); });
  initialize();
}

function initInstruments() {
  document.querySelectorAll('[data-instrument]').forEach(instrument => {
    const paths = Array.from(instrument.querySelectorAll('.signal-line')).map(element => ({
      element,
      noise: (element.dataset.noise || '').split(',').map(Number),
      order: (element.dataset.order || '').split(',').map(Number),
    })).filter(item => item.noise.length === 14 && item.order.length === 14 && [...item.noise, ...item.order].every(Number.isFinite));
    if (!paths.length) return;
    let frame = 0;
    let observer;
    const d = points => {
      const v = points.map(number => Math.round(number * 100) / 100);
      return `M${v[0]},${v[1]} C${v[2]},${v[3]} ${v[4]},${v[5]} ${v[6]},${v[7]} S${v[8]},${v[9]} ${v[10]},${v[11]} L${v[12]},${v[13]}`;
    };
    const paint = fraction => paths.forEach(({ element, noise, order }) => {
      element.setAttribute('d', d(noise.map((value, i) => value + (order[i] - value) * fraction)));
    });
    const finish = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      paint(1);
      instrument.dataset.state = 'ordered';
      instrument.classList.add('is-ordered');
      instrument.setAttribute('aria-busy', 'false');
    };
    const play = () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      if (motionPreference.matches) { finish(); return; }
      instrument.dataset.state = 'assembling';
      instrument.classList.remove('is-ordered');
      instrument.setAttribute('aria-busy', 'true');
      paint(0);
      const start = performance.now();
      const tick = now => {
        const progress = Math.min(1, Math.max(0, (now - start) / 900));
        const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
        paint(eased);
        if (progress < 1) frame = requestAnimationFrame(tick);
        else finish();
      };
      frame = requestAnimationFrame(tick);
    };
    const replay = instrument.querySelector('[data-replay]');
    if (replay) listen(replay, 'click', play);
    listen(motionPreference, 'change', () => { if (motionPreference.matches) finish(); });
    if (motionPreference.matches) finish();
    else if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) play(); }, { threshold: 0.15 });
      observer.observe(instrument);
    } else play();
    cleanup.push(() => { observer?.disconnect(); cancelAnimationFrame(frame); });
  });
}

function initBankDemo() {
  const root = document.querySelector('[data-bank-demo]');
  if (!root) return;
  const segment = root.querySelector('#segment');
  const bonus = root.querySelector('#bonus');
  const label = root.querySelector('#bonus-label');
  const apply = root.querySelector('#apply-rule');
  const badge = root.querySelector('#trace-badge');
  const message = root.querySelector('#trace-message');
  const a = root.querySelector('#result-a');
  const b = root.querySelector('#result-b');
  if (![segment, bonus, label, apply, badge, message, a, b].every(Boolean)) return;
  let lastValid = { segment: 'new', bonus: 5 };
  let hasApplied = false;
  message.setAttribute('aria-atomic', 'true');
  const limit = root.querySelector('.rule-limit');
  if (limit && !limit.id) limit.id = 'bank-model-limit';
  if (limit) bonus.setAttribute('aria-describedby', `${limit.id} ${message.id}`);
  const audience = value => value === 'all' ? words('все участники', 'all participants') : words('новые участники', 'new participants');
  const preserved = () => words(
    `В таблице остаётся последнее допустимое правило: ${audience(lastValid.segment)}, бонус ${lastValid.bonus}.`,
    `The table keeps the last valid rule: ${audience(lastValid.segment)}, bonus ${lastValid.bonus}.`,
  );
  const setState = state => {
    root.dataset.state = state;
    root.classList.toggle('is-dirty', state === 'dirty' || state === 'invalid');
    root.classList.toggle('is-invalid', state === 'invalid');
    badge.classList.toggle('error', state === 'invalid');
    bonus.setAttribute('aria-invalid', 'false');
    segment.setAttribute('aria-invalid', 'false');
  };
  const resultMessage = () => lastValid.segment === 'all'
    ? words(`Учебное правило: A01 и A02 входят в аудиторию и получают условный бонус +${lastValid.bonus}.`, `Educational rule: A01 and A02 are in the audience and receive a fictional bonus of +${lastValid.bonus}.`)
    : words(`Учебное правило: A01 — новый участник, бонус +${lastValid.bonus}. A02 не входит в выбранную аудиторию.`, `Educational rule: A01 is a new participant, bonus +${lastValid.bonus}. A02 is outside the selected audience.`);
  const edit = () => {
    label.value = bonus.value;
    label.textContent = bonus.value;
    const dirty = segment.value !== lastValid.segment || Number(bonus.value) !== lastValid.bonus;
    setState(dirty ? 'dirty' : hasApplied ? 'applied' : 'initial');
    badge.textContent = dirty ? words('Есть изменения', 'Unapplied changes') : hasApplied ? words('Правило применено', 'Rule applied') : words('Начальное правило', 'Initial rule');
    message.textContent = dirty
      ? words(`Черновик изменён. ${preserved()} Нажмите «Проверить и применить».`, `Draft changed. ${preserved()} Select “Validate and apply”.`)
      : resultMessage();
  };
  listen(segment, 'change', edit);
  listen(bonus, 'input', edit);
  listen(apply, 'click', () => {
    const candidate = evaluateRuleDraft(segment.value, bonus.value, lastValid);
    if (!candidate.accepted) {
      setState('invalid');
      badge.textContent = words('Правило отклонено', 'Rule rejected');
      message.textContent = candidate.reason === 'bonus'
        ? words(`Бонус должен быть целым числом от 1 до 10. ${preserved()}`, `The bonus must be a whole number from 1 to 10. ${preserved()}`)
        : words(`Выберите допустимую аудиторию. ${preserved()}`, `Choose a valid audience. ${preserved()}`);
      const invalidField = candidate.reason === 'bonus' ? bonus : segment;
      invalidField.setAttribute('aria-invalid', 'true');
      invalidField.focus({ preventScroll: true });
      return;
    }
    lastValid = candidate.rule;
    hasApplied = true;
    a.textContent = `+${lastValid.bonus}`;
    b.textContent = lastValid.segment === 'all' ? `+${lastValid.bonus}` : '—';
    setState('applied');
    badge.textContent = words('Правило применено', 'Rule applied');
    message.textContent = resultMessage();
  });
  setState('initial');
}

function initCodyDemo() {
  const root = document.querySelector('[data-cody-demo]');
  if (!root) return;
  const buttons = Array.from(root.querySelectorAll('button[data-step]'));
  const toggle = root.querySelector('.connection-toggle');
  const label = root.querySelector('#story-label');
  const title = root.querySelector('#story-title');
  const body = root.querySelector('#story-body');
  const output = root.querySelector('.story-output');
  if (!buttons.length || ![toggle, label, title, body, output].every(Boolean)) return;
  let step = 0;
  let offline = false;
  const stories = [
    ['DEMO / PROJECT', 'Demo Notes', words('Сначала выбираем вымышленный проект. Следующие действия в иллюстрации остаются связаны с ним.', 'Start with a fictional project. The following illustrated actions stay connected to it.')],
    ['DEMO / SESSION', words('Проверить счётчик', 'Check the counter'), words('Выбрана конкретная учебная сессия проекта Demo Notes. Похожее название другого разговора не меняет адресата.', 'A specific example session in Demo Notes is selected. A similar title in another conversation does not change the target.')],
    ['DEMO / TASK', words('«Запусти проверку»', '“Run the check”'), words('Показано, куда направлена задача: Demo Notes → «Проверить счётчик». Эта иллюстрация не отправляет команду и не управляет вашим устройством.', 'The illustrated target is Demo Notes → “Check the counter”. This example does not send a command or control your device.')],
    ['DEMO / RESULT', words('Пример результата', 'Example result'), words('Вымышленный ответ: «Проверка завершена, счётчик работает». Результат связан с выбранной сессией. Реальный запуск в этой демонстрации не выполнялся.', 'Fictional response: “Check complete; the counter works.” The result belongs to the selected session. No real check was run in this demonstration.')],
  ];
  output.setAttribute('aria-atomic', 'true');
  const render = () => {
    root.dataset.step = String(step);
    root.dataset.connection = offline ? 'offline' : 'illustrated';
    root.classList.toggle('is-offline', offline);
    buttons.forEach(button => {
      const active = Number(button.dataset.step) === step;
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('is-active', active);
      button.disabled = offline;
    });
    toggle.setAttribute('aria-pressed', String(offline));
    toggle.textContent = offline
      ? words('Показать восстановление связи ↗', 'Illustrate reconnection ↗')
      : words('Показать потерю связи ↗', 'Show a lost connection ↗');
    if (offline) {
      label.textContent = 'DEMO / OFFLINE';
      title.textContent = words('Связь потеряна', 'Connection lost');
      body.textContent = words('Учебное состояние: ответ от Mac недоступен. Система не должна показывать успешное выполнение. Выбранный контекст сохранён; восстановите связь в иллюстрации, чтобы продолжить.', 'Illustrated state: the Mac response is unavailable. The system should not report success. The selected context is preserved; illustrate reconnection to continue.');
    } else {
      [label.textContent, title.textContent, body.textContent] = stories[step];
    }
  };
  buttons.forEach((button, index) => {
    listen(button, 'click', () => {
      if (offline) return;
      const next = Number(button.dataset.step);
      if (Number.isInteger(next) && next >= 0 && next < stories.length) { step = next; render(); }
    });
    listen(button, 'keydown', event => {
      if (offline) return;
      let next;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % buttons.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + buttons.length) % buttons.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = buttons.length - 1;
      else return;
      event.preventDefault();
      step = Number(buttons[next].dataset.step);
      render();
      buttons[next].focus();
    });
  });
  listen(toggle, 'click', () => { offline = !offline; render(); });
  render();
}

function initProcessDemo() {
  const root = document.getElementById('process-demo-root');
  if (!root) return;
  import('./process-demo.js').then(({ mountProcessDemo }) => {
    if (disposed) return;
    const demo = mountProcessDemo(root, { locale });
    cleanup.push(() => demo.destroy());
  }).catch(() => {
    root.textContent = words('Интерактивный пример не загрузился. Описание подхода доступно выше.', 'The interactive example could not load. The approach is described above.');
  });
}

function start() {
  [initMenu, initCopyEmail, initProgress, initEntranceMotion, initInstruments, initBankDemo, initCodyDemo, initProcessDemo].forEach(initialize => {
    try { initialize(); } catch (error) { console.warn('An optional portfolio interaction could not start.', error); }
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
else start();

window.addEventListener('pagehide', event => {
  // BFCache retains this document and its listeners. Do not destroy or rebind them.
  if (event.persisted) return;
  disposed = true;
  cleanup.forEach(dispose => dispose());
});
