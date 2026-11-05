/** A local, synthetic process illustration. It does not call AI or export BPMN. */
let processDemoSequence = 0;

const copy = {
  ru: {
    eyebrow: 'Учебная модель', title: 'Из заметки в процесс',
    intro: 'Одного имени достаточно, чтобы убрать важное допущение из схемы.',
    sourceLabel: 'Прочитать источник', sourceName: 'Регламент учебной мастерской',
    source: 'Сотрудник отправляет заявку. После согласования закупщик оформляет заказ. При отказе заявка возвращается автору.',
    missing: 'Кто согласует заявку? В источнике это не указано.',
    clarifyLabel: 'Уточнить ответственность', question: 'Кто принимает решение по заявке?',
    choose: 'Выберите ответственного', manager: 'Руководитель мастерской', coordinator: 'Координатор закупок',
    unknown: 'Ответственный пока неизвестен', help: 'Ваш выбор станет отдельным уточнением. Исходный регламент останется прежним.',
    approve: 'Проверить и построить', reset: 'Начать заново',
    resultLabel: 'Проверить схему', waiting: 'Сначала нужен ответственный',
    waitingText: 'Схема появится после уточнения. Неизвестную роль нельзя незаметно превратить в факт.',
    invalid: 'Ответственный ещё неизвестен. Выберите роль, чтобы построить схему без этого допущения.',
    changed: 'Уточнение изменено. Проверьте его, чтобы обновить схему.',
    success: 'Уточнение принято. Схема построена с выбранным ответственным.',
    built: 'Схема построена', sourceKey: 'S1 · Исходный регламент', userKey: 'U1 · Ваше уточнение',
    provenanceBefore: 'Ответственный: ', provenanceAfter: '. Основание — ваш выбор в этом примере, а не текст регламента.',
    note: 'Вымышленные данные. Локальная проверка без AI. Иллюстрация процесса, не экспорт BPMN XML.',
    flowTitle: 'Процесс после уточнения ответственного',
    flowDescription: role => `Сотрудник подаёт заявку. ${role} принимает решение. При согласовании закупщик оформляет заказ; при отказе заявка возвращается автору. Роль согласующего взята из вашего уточнения U1; остальные действия — из учебного источника S1.`,
    request: ['Подать', 'заявку'], actor: 'Сотрудник', decision: 'Согласовано?', yes: 'ДА', no: 'НЕТ',
    order: ['Оформить', 'заказ'], buyer: 'Закупщик', returnTask: ['Вернуть', 'автору'], newRequest: 'Заявка',
    done: 'Заказ оформлен', revision: 'На доработку', resetLive: 'Пример сброшен. Ответственный снова неизвестен.',
    schemaSource: 'Действия: S1', schemaClarification: 'Ответственный: U1',
  },
  en: {
    eyebrow: 'Educational model', title: 'From a note to a process',
    intro: 'One named owner removes an important assumption from the diagram.',
    sourceLabel: 'Read the source', sourceName: 'Example workshop procedure',
    source: 'An employee submits a request. After approval, the buyer places an order. If rejected, the request returns to its author.',
    missing: 'Who approves the request? The source does not say.',
    clarifyLabel: 'Clarify responsibility', question: 'Who decides on the request?',
    choose: 'Choose a responsible role', manager: 'Workshop manager', coordinator: 'Procurement coordinator',
    unknown: 'The responsible role is still unknown', help: 'Your choice becomes a separate clarification. The original procedure stays unchanged.',
    approve: 'Check and build', reset: 'Start again',
    resultLabel: 'Review the diagram', waiting: 'A responsible role is needed',
    waitingText: 'The diagram appears after clarification. An unknown role should not quietly become a fact.',
    invalid: 'The responsible role is still unknown. Choose a role to build the diagram without that assumption.',
    changed: 'The clarification has changed. Check it to update the diagram.',
    success: 'Clarification accepted. The diagram now includes your chosen role.',
    built: 'Diagram built', sourceKey: 'S1 · Original procedure', userKey: 'U1 · Your clarification',
    provenanceBefore: 'Responsible role: ', provenanceAfter: '. This comes from your choice in this example, not from the procedure.',
    note: 'Fictional data. Local validation without AI. A process illustration, not a BPMN XML export.',
    flowTitle: 'Process after clarifying responsibility',
    flowDescription: role => `An employee submits a request. The ${role.toLowerCase()} decides on it. If approved, the buyer places an order; if rejected, the request returns to its author. The approving role comes from your clarification U1; the other actions come from educational source S1.`,
    request: ['Submit', 'request'], actor: 'Employee', decision: 'Approved?', yes: 'YES', no: 'NO',
    order: ['Place', 'order'], buyer: 'Buyer', returnTask: ['Return to', 'author'], newRequest: 'Request',
    done: 'Order placed', revision: 'For revision', resetLive: 'Example reset. The responsible role is unknown again.',
    schemaSource: 'Actions: S1', schemaClarification: 'Responsible role: U1',
  },
};

const css = `
.pd-root{--pd-ink:var(--ink,#21241f);--pd-paper:var(--paper,#f4f0e7);--pd-accent:var(--accent,#9e452f);--pd-line:color-mix(in srgb,var(--pd-ink) 21%,transparent);--pd-muted:color-mix(in srgb,var(--pd-ink) 73%,var(--pd-paper));color:var(--pd-ink);background:var(--pd-paper);font-family:inherit;font-size:16px;line-height:1.55;width:100%;min-width:0;isolation:isolate}
.pd-root,.pd-root *{box-sizing:border-box}
.pd-root button,.pd-root select{font:inherit}
.pd-root button{cursor:pointer}
.pd-root [hidden]{display:none!important}
.pd-head{padding:28px 30px 24px;border:1px solid var(--pd-line);border-bottom:0}
.pd-eyebrow{margin:0 0 12px;text-transform:uppercase;letter-spacing:.13em;font-size:11px;font-weight:700;color:var(--pd-accent)}
.pd-title{font-family:Georgia,'Times New Roman',serif;font-weight:400;font-size:clamp(30px,4vw,47px);line-height:1.08;letter-spacing:-.035em;margin:0 0 14px}
.pd-intro{max-width:50ch;margin:0;color:var(--pd-muted);font-size:15px}
.pd-inputs{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--pd-line)}
.pd-step{padding:24px 30px;min-width:0}
.pd-step+.pd-step{border-left:1px solid var(--pd-line)}
.pd-step-heading{display:flex;align-items:baseline;gap:12px;margin:0 0 22px;font-size:14px;font-weight:600;line-height:1.4}
.pd-number{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:12px;font-weight:400;color:var(--pd-accent)}
.pd-source-name{display:block;font-size:11px;line-height:1.5;color:var(--pd-muted);letter-spacing:.035em;margin-bottom:12px}
.pd-quote{margin:0;font-family:Georgia,'Times New Roman',serif;font-size:20px;line-height:1.5;letter-spacing:-.012em}
.pd-gap{margin:20px 0 0;padding-top:14px;border-top:1px dashed var(--pd-line);font-size:13px;color:var(--pd-accent)}
.pd-field-label{display:block;font-size:15px;font-weight:600;margin:0 0 10px}
.pd-select{display:block;max-width:100%;width:100%;min-width:0;border:1px solid var(--pd-line);border-radius:0;background:var(--pd-paper);color:var(--pd-ink);padding:12px 30px 12px 12px;min-height:48px;font-size:14px!important}
.pd-select[aria-invalid=true]{border-color:var(--pd-accent);outline:1px solid var(--pd-accent)}
.pd-help{margin:11px 0 0;font-size:12px;line-height:1.6;color:var(--pd-muted);max-width:45ch}
.pd-error{margin:12px 0 0;color:var(--pd-accent);font-size:13px;font-weight:600}
.pd-actions{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:21px}
.pd-approve{background:var(--pd-ink);color:var(--pd-paper);border:1px solid var(--pd-ink);padding:11px 17px;min-height:44px;font-size:13px!important;font-weight:600!important}
.pd-approve:hover{background:var(--pd-accent);border-color:var(--pd-accent)}
.pd-reset{border:0;border-bottom:1px solid var(--pd-line);background:transparent;color:var(--pd-muted);padding:9px 1px;min-height:44px;font-size:12px!important}
.pd-reset:hover{color:var(--pd-ink);border-color:var(--pd-ink)}
.pd-root button:focus-visible,.pd-root select:focus-visible{outline:2px solid var(--pd-accent);outline-offset:4px}
.pd-result{border:1px solid var(--pd-line);border-top:0;padding:24px 30px 20px;min-width:0}
.pd-result-top{display:flex;justify-content:space-between;align-items:baseline;gap:15px;flex-wrap:wrap}
.pd-result-top .pd-step-heading{margin-bottom:15px}
.pd-status{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:11px;color:var(--pd-accent)}
.pd-placeholder{padding:25px 0 30px;display:grid;grid-template-columns:48px 1fr;gap:18px;align-items:start;max-width:580px}
.pd-placeholder-mark{font-family:Georgia,'Times New Roman',serif;font-size:36px;border:1px dashed var(--pd-line);width:46px;height:46px;display:grid;place-items:center;line-height:1;color:var(--pd-accent)}
.pd-placeholder strong{font-size:16px;font-weight:600}
.pd-placeholder p{font-size:13px;line-height:1.6;color:var(--pd-muted);margin:7px 0 0}
.pd-provenance{margin:0;padding:14px 0 0;border-top:1px solid var(--pd-line);font-size:13px;line-height:1.6;color:var(--pd-muted)}
.pd-provenance strong{font-weight:600;color:var(--pd-ink)}
.pd-key{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:10px;letter-spacing:.025em;color:var(--pd-accent);display:block;margin-bottom:5px}
.pd-legend{display:flex;gap:20px;flex-wrap:wrap;margin:5px 0 16px;font-size:11px;color:var(--pd-muted)}
.pd-legend span{display:inline-flex;align-items:center;gap:7px}
.pd-legend span::before{content:'';display:block;width:13px;border-top:2px solid var(--pd-ink)}
.pd-legend span+span::before{border-color:var(--pd-accent)}
.pd-foot{font-size:11px;line-height:1.6;color:var(--pd-muted);margin:14px 0 0}
.pd-svg{display:block;width:100%;height:auto;overflow:visible;color:var(--pd-ink)}
.pd-svg text{font-family:inherit;fill:var(--pd-ink)}
.pd-svg .pd-node{fill:var(--pd-paper);stroke:var(--pd-ink);stroke-width:1.5}
.pd-svg .pd-decision{fill:var(--pd-paper);stroke:var(--pd-accent);stroke-width:1.7}
.pd-svg .pd-terminal{fill:var(--pd-ink)}
.pd-svg .pd-task-text{font-size:18px;font-weight:500;text-anchor:middle}
.pd-svg .pd-small-text{font-size:12px;fill:var(--pd-muted);text-anchor:middle}
.pd-svg .pd-role-text{font-size:14px;fill:var(--pd-accent);text-anchor:middle;font-weight:600}
.pd-svg .pd-branch-text{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:11px;fill:var(--pd-accent);letter-spacing:.07em}
.pd-svg .pd-path{fill:none;stroke:var(--pd-ink);stroke-width:1.5;stroke-dasharray:900;stroke-dashoffset:0;animation:pd-draw .9s ease-out both}
.pd-svg .pd-path-accent{stroke:var(--pd-accent)}
.pd-mobile-svg{display:none}
.pd-live{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
@keyframes pd-draw{from{stroke-dashoffset:900}to{stroke-dashoffset:0}}
@media(max-width:680px){.pd-inputs{grid-template-columns:1fr}.pd-step+.pd-step{border-left:0;border-top:1px solid var(--pd-line)}.pd-head,.pd-step,.pd-result{padding-left:22px;padding-right:22px}.pd-title{font-size:35px}.pd-quote{font-size:21px}}
@media(max-width:560px){.pd-desktop-svg{display:none}.pd-mobile-svg{display:block;max-width:360px;margin:0 auto}.pd-head,.pd-step,.pd-result{padding-left:18px;padding-right:18px}.pd-title{font-size:32px}.pd-intro{font-size:14px}.pd-step-heading{margin-bottom:18px}.pd-provenance{font-size:12px}.pd-legend{gap:9px 18px}.pd-select{font-size:12px!important}.pd-actions{gap:8px 16px}}
@media(prefers-reduced-motion:reduce){.pd-svg .pd-path{animation:none}}
`;

const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const normalizeLocale = value => value === 'en' ? 'en' : 'ru';

/** Mount into an existing element; all state and listeners belong to this instance. */
export function mountProcessDemo(container, { locale = 'ru' } = {}) {
  if (!container || typeof container.appendChild !== 'function') {
    throw new TypeError('mountProcessDemo requires a DOM container.');
  }
  const document = container.ownerDocument;
  const uid = `pd-${Date.now().toString(36)}-${++processDemoSequence}`;
  const root = document.createElement('section');
  root.className = 'pd-root';
  const state = { locale: normalizeLocale(locale), selected: '', approved: false, invalid: false, destroyed: false };
  let liveMessage = '';

  function task(x, y, width, lines, actor = '') {
    return `<rect class="pd-node" x="${x}" y="${y}" width="${width}" height="76" rx="3"/><text class="pd-task-text" x="${x + width / 2}" y="${y + 31}"><tspan x="${x + width / 2}">${escape(lines[0])}</tspan><tspan x="${x + width / 2}" dy="23">${escape(lines[1])}</tspan></text>${actor ? `<text class="pd-small-text" x="${x + width / 2}" y="${y - 13}">${escape(actor)} · S1</text>` : ''}`;
  }

  function graph(mobile = false) {
    const t = copy[state.locale];
    const role = t[state.selected];
    const suffix = mobile ? 'm' : 'd';
    const arrow = `${uid}-arrow-${suffix}`;
    const accentArrow = `${uid}-accent-arrow-${suffix}`;
    const titleId = `${uid}-graph-title-${suffix}`;
    const descriptionId = `${uid}-graph-desc-${suffix}`;
    const roleLines = state.locale === 'ru'
      ? (state.selected === 'manager' ? ['Руководитель', 'мастерской'] : ['Координатор', 'закупок'])
      : (state.selected === 'manager' ? ['Workshop', 'manager'] : ['Procurement', 'coordinator']);
    const start = `<svg class="pd-svg ${mobile ? 'pd-mobile-svg' : 'pd-desktop-svg'}" viewBox="${mobile ? '0 0 320 650' : '0 0 840 330'}" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="${titleId} ${descriptionId}"><title id="${titleId}">${escape(t.flowTitle)}</title><desc id="${descriptionId}">${escape(t.flowDescription(role))}</desc><defs><marker id="${arrow}" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L8 4L0 8" fill="var(--pd-ink)"/></marker><marker id="${accentArrow}" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L8 4L0 8" fill="var(--pd-accent)"/></marker></defs>`;
    if (mobile) {
      return start + `
        <circle class="pd-terminal" cx="160" cy="22" r="6"/>
        <path class="pd-path" d="M160 28V71" marker-end="url(#${arrow})"/>
        ${task(99, 76, 122, t.request)}
        <text class="pd-small-text" x="73" y="58">${escape(t.actor)} · S1</text>
        <path class="pd-path" d="M160 152V234" marker-end="url(#${arrow})"/>
        <rect x="62" y="171" width="196" height="45" fill="var(--pd-paper)"/>
        <text class="pd-role-text" x="160" y="190"><tspan x="160">${escape(roleLines[0])}</tspan><tspan x="160" dy="19">${escape(roleLines[1])} · U1</tspan></text>
        <path class="pd-decision" d="M160 239L218 292L160 345L102 292Z"/>
        <text class="pd-task-text" x="160" y="297" style="font-size:14px">${escape(t.decision)}</text>
        <path class="pd-path pd-path-accent" d="M102 292H73V427" marker-end="url(#${accentArrow})"/>
        <path class="pd-path pd-path-accent" d="M218 292H247V427" marker-end="url(#${accentArrow})"/>
        <text class="pd-branch-text" x="42" y="332">${t.yes}</text>
        <text class="pd-branch-text" x="260" y="332">${t.no}</text>
        ${task(12, 432, 122, t.order)}
        ${task(186, 432, 122, t.returnTask)}
        <rect x="20" y="378" width="106" height="25" fill="var(--pd-paper)"/>
        <rect x="230" y="378" width="34" height="25" fill="var(--pd-paper)"/>
        <text class="pd-small-text" x="73" y="395">${escape(t.buyer)} · S1</text>
        <text class="pd-small-text" x="247" y="395">S1</text>
        <path class="pd-path" d="M73 508V560" marker-end="url(#${arrow})"/>
        <path class="pd-path" d="M247 508V560" marker-end="url(#${arrow})"/>
        <circle class="pd-terminal" cx="73" cy="571" r="6"/>
        <circle class="pd-terminal" cx="247" cy="571" r="6"/>
        <text class="pd-small-text" x="73" y="601">${escape(t.done)}</text>
        <text class="pd-small-text" x="247" y="601">${escape(t.revision)}</text>
      </svg>`;
    }
    return start + `
      <circle class="pd-terminal" cx="22" cy="132" r="6"/>
      <path class="pd-path" d="M28 132H72" marker-end="url(#${arrow})"/>
      ${task(78, 94, 146, t.request, t.actor)}
      <path class="pd-path" d="M224 132H328" marker-end="url(#${arrow})"/>
      <text class="pd-role-text" x="386" y="49">${escape(role)} · U1</text>
      <path class="pd-decision" d="M386 78L444 132L386 186L328 132Z"/>
      <text class="pd-task-text" x="386" y="138" style="font-size:15px">${escape(t.decision)}</text>
      <path class="pd-path pd-path-accent" d="M444 132H539" marker-end="url(#${accentArrow})"/>
      <text class="pd-branch-text" x="474" y="117">${t.yes}</text>
      ${task(545, 94, 146, t.order, t.buyer)}
      <path class="pd-path" d="M691 132H775" marker-end="url(#${arrow})"/>
      <circle class="pd-terminal" cx="787" cy="132" r="6"/>
      <text class="pd-small-text" x="778" y="164">${escape(t.done)}</text>
      <path class="pd-path pd-path-accent" d="M386 186V264H539" marker-end="url(#${accentArrow})"/>
      <text class="pd-branch-text" x="403" y="233">${t.no}</text>
      ${task(545, 226, 146, t.returnTask)}
      <text class="pd-small-text" x="618" y="215">S1</text>
      <path class="pd-path" d="M691 264H775" marker-end="url(#${arrow})"/>
      <circle class="pd-terminal" cx="787" cy="264" r="6"/>
      <text class="pd-small-text" x="778" y="296">${escape(t.revision)}</text>
    </svg>`;
  }

  function outputMarkup() {
    const t = copy[state.locale];
    if (!state.approved) return `<div class="pd-placeholder"><span class="pd-placeholder-mark" aria-hidden="true">?</span><div><strong>${t.waiting}</strong><p>${t.waitingText}</p></div></div>`;
    return `<div class="pd-legend"><span>${t.schemaSource}</span><span>${t.schemaClarification}</span></div>${graph()}${graph(true)}<p class="pd-provenance"><span class="pd-key">${t.userKey}</span>${t.provenanceBefore}<strong>${escape(t[state.selected])}</strong>${t.provenanceAfter}</p>`;
  }

  function renderOutput() {
    root.querySelector('[data-pd-output]').innerHTML = outputMarkup();
    root.querySelector('[data-pd-status]').textContent = state.approved ? copy[state.locale].built : '';
  }

  function announce(message) {
    liveMessage = message;
    root.querySelector('[data-pd-live]').textContent = message;
  }

  function renderError() {
    const select = root.querySelector('[data-pd-select]');
    const error = root.querySelector('[data-pd-error]');
    select.setAttribute('aria-invalid', String(state.invalid));
    select.setAttribute('aria-describedby', `${uid}-help${state.invalid ? ` ${uid}-error` : ''}`);
    error.hidden = !state.invalid;
    error.textContent = state.invalid ? copy[state.locale].invalid : '';
  }

  function render() {
    const t = copy[state.locale];
    root.lang = state.locale;
    root.setAttribute('aria-labelledby', `${uid}-title`);
    root.innerHTML = `<style>${css}</style>
      <header class="pd-head"><p class="pd-eyebrow">${t.eyebrow}</p><h3 class="pd-title" id="${uid}-title">${t.title}</h3><p class="pd-intro">${t.intro}</p></header>
      <div class="pd-inputs">
        <div class="pd-step"><h4 class="pd-step-heading"><span class="pd-number">01</span>${t.sourceLabel}</h4><span class="pd-source-name">S1 / ${t.sourceName}</span><blockquote class="pd-quote">${t.source}</blockquote><p class="pd-gap">${t.missing}</p></div>
        <div class="pd-step"><h4 class="pd-step-heading"><span class="pd-number">02</span>${t.clarifyLabel}</h4><label class="pd-field-label" for="${uid}-role">${t.question}</label><select class="pd-select" id="${uid}-role" data-pd-select aria-describedby="${uid}-help" aria-invalid="false"><option value="">${t.choose}</option><option value="manager">${t.manager}</option><option value="coordinator">${t.coordinator}</option><option value="unknown">${t.unknown}</option></select><p class="pd-help" id="${uid}-help">${t.help}</p><p class="pd-error" data-pd-error id="${uid}-error" hidden></p><div class="pd-actions"><button class="pd-approve" type="button" data-pd-action="approve">${t.approve}</button><button class="pd-reset" type="button" data-pd-action="reset">${t.reset}</button></div></div>
      </div>
      <div class="pd-result"><div class="pd-result-top"><h4 class="pd-step-heading"><span class="pd-number">03</span>${t.resultLabel}</h4><span class="pd-status" data-pd-status>${state.approved ? t.built : ''}</span></div><div data-pd-output>${outputMarkup()}</div><p class="pd-foot">${t.note}</p></div>
      <div class="pd-live" data-pd-live aria-live="polite" aria-atomic="true">${escape(liveMessage)}</div>`;
    root.querySelector('[data-pd-select]').value = state.selected;
    renderError();
  }

  function onClick(event) {
    const button = event.target.closest?.('[data-pd-action]');
    if (!button || !root.contains(button)) return;
    const action = button.dataset.pdAction;
    const t = copy[state.locale];
    if (action === 'reset') {
      state.selected = '';
      state.approved = false;
      state.invalid = false;
      root.querySelector('[data-pd-select]').value = '';
      renderError();
      renderOutput();
      announce(t.resetLive);
      root.querySelector('[data-pd-select]').focus();
      return;
    }
    if (action !== 'approve') return;
    state.invalid = !['manager', 'coordinator'].includes(state.selected);
    state.approved = !state.invalid;
    renderError();
    renderOutput();
    announce(state.invalid ? t.invalid : t.success);
    if (state.invalid) root.querySelector('[data-pd-select]').focus();
  }

  function onChange(event) {
    if (!event.target.matches?.('[data-pd-select]')) return;
    const hadResult = state.approved;
    state.selected = event.target.value;
    state.approved = false;
    state.invalid = false;
    renderError();
    renderOutput();
    announce(hadResult ? copy[state.locale].changed : '');
  }

  root.addEventListener('click', onClick);
  root.addEventListener('change', onChange);
  render();
  container.appendChild(root);

  return {
    destroy() {
      if (state.destroyed) return;
      state.destroyed = true;
      root.removeEventListener('click', onClick);
      root.removeEventListener('change', onChange);
      root.remove();
    },
    setLocale(nextLocale) {
      if (state.destroyed) return;
      const next = normalizeLocale(nextLocale);
      if (next === state.locale) return;
      const focused = document.activeElement;
      const restore = root.contains(focused)
        ? (focused.matches('[data-pd-select]') ? '[data-pd-select]' : focused.dataset?.pdAction ? `[data-pd-action="${focused.dataset.pdAction}"]` : null)
        : null;
      state.locale = next;
      liveMessage = state.invalid ? copy[next].invalid : state.approved ? copy[next].success : '';
      render();
      if (restore) root.querySelector(restore)?.focus();
    },
  };
}
