import { addParticipant, recordWinner, removeParticipant, resetDraw, type DrawState, type Participant } from './selectionState';

const game = document.querySelector<HTMLElement>('[data-paper-game]');

if (game) {
  const input = document.querySelector<HTMLInputElement>('[data-paper-input]')!;
  const form = document.querySelector<HTMLFormElement>('[data-paper-form]')!;
  const addButton = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const list = document.querySelector<HTMLElement>('[data-paper-list]')!;
  const grid = document.querySelector<HTMLElement>('[data-paper-grid]')!;
  const exclude = document.querySelector<HTMLInputElement>('[data-paper-exclude]')!;
  const status = document.querySelector<HTMLElement>('[data-paper-status]')!;
  const result = document.querySelector<HTMLElement>('[data-paper-result]')!;
  const remaining = document.querySelector<HTMLElement>('[data-paper-remaining]')!;
  const history = document.querySelector<HTMLElement>('[data-paper-history]')!;
  const replay = document.querySelector<HTMLButtonElement>('[data-paper-replay]')!;
  const next = document.querySelector<HTMLButtonElement>('[data-paper-next]')!;

  let nextId = 0;
  let revealing = false;
  let roundLocked = false;

  const make = (label: string): Participant => ({ id: nextId++, label });
  const initial = ['민지', '준호', '서연'].map(make);
  let state: DrawState<Participant> = {
    participants: initial,
    remaining: [...initial],
    history: [],
    currentWinner: null,
  };

  const shuffle = <T,>(items: T[]) =>
    items
      .map((item) => ({ item, value: crypto.getRandomValues(new Uint32Array(1))[0] }))
      .sort((a, b) => a.value - b.value)
      .map(({ item }) => item);

  const renderPapers = () => {
    const papers = shuffle(state.remaining).map((item, index) => {
      const button = document.createElement('button');
      const mark = document.createElement('span');

      button.type = 'button';
      button.className = 'paper-card';
      button.dataset.paper = String(item.id);
      button.setAttribute('aria-label', '접힌 종이 ' + (index + 1) + ' 선택');
      button.disabled = revealing || roundLocked || state.remaining.length < 2;

      mark.textContent = '?';
      mark.setAttribute('aria-hidden', 'true');
      button.append(mark);

      return button;
    });

    grid.replaceChildren(...papers);
  };

  const render = () => {
    const controlsLocked = revealing || roundLocked;

    list.replaceChildren(
      ...state.remaining.map((item) => {
        const row = document.createElement('li');
        const label = document.createElement('span');
        const button = document.createElement('button');

        label.textContent = item.label;
        button.type = 'button';
        button.dataset.remove = String(item.id);
        button.textContent = '×';
        button.ariaLabel = item.label + ' 삭제';
        button.disabled = controlsLocked;

        row.append(label, button);
        return row;
      }),
    );

    input.disabled = controlsLocked;
    addButton.disabled = controlsLocked;
    exclude.disabled = controlsLocked;
    next.disabled = revealing;
    replay.disabled = revealing;

    grid.querySelectorAll<HTMLButtonElement>('[data-paper]').forEach((button) => {
      button.disabled = revealing || roundLocked || state.remaining.length < 2;
    });

    status.textContent = revealing
      ? '종이를 펼치고 있어요.'
      : roundLocked
        ? ''
        : state.remaining.length < 2
          ? '한 명을 더 추가하면 시작할 수 있어요.'
          : '종이 하나를 골라보세요.';

    remaining.textContent =
      state.history.length === 0
        ? ''
        : state.remaining.length === 1
          ? state.remaining[0].label + ' 님이 마지막으로 남았어요.'
          : '남은 참가자: ' + state.remaining.map(({ label }) => label).join(', ');

    history.textContent = state.history.length
      ? '추첨 순서: ' + state.history.map(({ label }) => label).join(' → ')
      : '';

    next.hidden = !(roundLocked && state.remaining.length >= 2);
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const label = input.value.trim().slice(0, 16);

    if (!label || revealing || roundLocked) return;

    state = addParticipant(state, make(label));
    input.value = '';
    renderPapers();
    render();
    input.focus();
  });

  list.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-remove]');

    if (!button || revealing || roundLocked) return;

    state = removeParticipant(state, Number(button.dataset.remove));
    renderPapers();
    render();
  });

  grid.addEventListener('click', async (event) => {
    const paper = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-paper]');

    if (!paper || revealing || roundLocked || state.remaining.length < 2) return;

    const winner = state.remaining.find((item) => item.id === Number(paper.dataset.paper));
    if (!winner) return;

    const excludeWinner = exclude.checked;
    const revealDelay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 420;

    revealing = true;
    result.textContent = '';
    result.classList.remove('paper-result--win');
    render();

    paper.classList.add('paper-card--open');
    paper.textContent = winner.label;
    paper.setAttribute('aria-label', winner.label + ' 결과');

    await new Promise((resolve) => setTimeout(resolve, revealDelay));

    state = recordWinner(state, winner, excludeWinner);
    roundLocked = true;

    if (state.remaining.length === 1) {
      const last = state.remaining[0];
      const lastPaper = grid.querySelector<HTMLButtonElement>('[data-paper="' + last.id + '"]');

      if (lastPaper) {
        lastPaper.classList.add('paper-card--open');
        lastPaper.textContent = last.label;
        lastPaper.setAttribute('aria-label', last.label + ' 마지막 참가자');
      }
    }

    result.replaceChildren();
    const strong = document.createElement('strong');
    strong.textContent = winner.label;
    result.append(strong, ' 님이 뽑혔어요!');
    result.classList.add('paper-result--win');

    revealing = false;
    render();
  });

  next.addEventListener('click', () => {
    if (revealing || !roundLocked || state.remaining.length < 2) return;

    roundLocked = false;
    result.textContent = '';
    result.classList.remove('paper-result--win');
    renderPapers();
    render();
  });

  replay.addEventListener('click', () => {
    if (revealing) return;

    state = resetDraw(state);
    roundLocked = false;
    result.textContent = '';
    result.classList.remove('paper-result--win');
    renderPapers();
    render();
  });

  result.textContent = '';
  renderPapers();
  render();
}
