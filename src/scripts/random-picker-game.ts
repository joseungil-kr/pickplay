import { addParticipant, recordWinner, removeParticipant, resetDraw, type DrawState, type Participant } from './selectionState';

const game = document.querySelector<HTMLElement>('[data-random-picker]');

if (game) {
  const input = document.querySelector<HTMLInputElement>('[data-picker-input]')!;
  const form = document.querySelector<HTMLFormElement>('[data-picker-form]')!;
  const list = document.querySelector<HTMLElement>('[data-picker-list]')!;
  const count = document.querySelector<HTMLSelectElement>('[data-picker-count]')!;
  const exclude = document.querySelector<HTMLInputElement>('[data-picker-exclude]')!;
  const pick = document.querySelector<HTMLButtonElement>('[data-picker-pick]')!;
  const replay = document.querySelector<HTMLButtonElement>('[data-picker-replay]')!;
  const candidate = document.querySelector<HTMLElement>('[data-picker-candidate]')!;
  const status = document.querySelector<HTMLElement>('[data-picker-status]')!;
  const result = document.querySelector<HTMLElement>('[data-picker-result]')!;
  const remaining = document.querySelector<HTMLElement>('[data-picker-remaining]')!;
  const history = document.querySelector<HTMLElement>('[data-picker-history]')!;
  let nextId = 0;
  let drawing = false;
  const make = (label: string): Participant => ({ id: nextId++, label });
  const initial = ['민지', '준호', '서연'].map(make);
  let state: DrawState<Participant> = { participants: initial, remaining: [...initial], history: [], currentWinner: null };

  const render = () => {
    list.replaceChildren(...state.remaining.map((item) => {
      const row = document.createElement('li');
      const label = document.createElement('span');
      const button = document.createElement('button');
      label.textContent = item.label;
      button.type = 'button'; button.dataset.remove = String(item.id); button.textContent = '×'; button.ariaLabel = `${item.label} 삭제`;
      row.append(label, button);
      return row;
    }));
    pick.disabled = drawing || state.remaining.length < 2;
    count.disabled = drawing;
    exclude.disabled = drawing;
    remaining.textContent = state.remaining.length === 1 ? `${state.remaining[0].label} 님이 마지막으로 남았어요.` : `남은 참가자: ${state.remaining.map(({ label }) => label).join(', ')}`;
    status.textContent = drawing ? '이름을 고르고 있어요.' : state.currentWinner ? '' : state.remaining.length < 2 ? '한 명을 더 추가하면 시작할 수 있어요.' : "준비 완료 · ${state.remaining.length}명";
    candidate.textContent = drawing ? candidate.textContent : state.currentWinner ? state.currentWinner.label : '?';
    history.textContent = state.history.length ? `추첨 순서: ${state.history.map(({ label }) => label).join(' → ')}` : '';
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const label = input.value.trim().slice(0, 16);
    if (!label || drawing) return;
    state = addParticipant(state, make(label)); input.value = ''; render(); input.focus();
  });
  list.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-remove]');
    if (!button || drawing) return;
    state = removeParticipant(state, Number(button.dataset.remove)); render();
  });
  pick.addEventListener('click', async () => {
    if (drawing || state.remaining.length < 2) return;
    const excludeWinner = exclude.checked;
    const requested = Number(count.value);
    const number = Number.isFinite(requested) ? Math.min(Math.max(1, Math.floor(requested)), state.remaining.length - 1) : 1;
    const winners: Participant[] = [];
    for (let step = 0; step < number; step += 1) {
      const values = new Uint32Array(1); crypto.getRandomValues(values);
      const candidate = state.remaining.find((item) => !winners.some((winner) => winner.id === item.id))!;
      const available = state.remaining.filter((item) => !winners.some((winner) => winner.id === item.id));
      winners.push(available[values[0] % available.length] ?? candidate);
    }
    drawing = true; render(); result.textContent = '';
    const frames = [...state.remaining, ...state.remaining, ...winners];
    for (const item of frames) { candidate.textContent = item.label; await new Promise((resolve) => setTimeout(resolve, 110)); }
    winners.forEach((winner) => { state = recordWinner(state, winner, excludeWinner); });
    drawing = false;
    result.replaceChildren();
    winners.forEach((winner, index) => { const strong = document.createElement('strong'); strong.textContent = winner.label; result.append(strong, index === winners.length - 1 ? ' 님이 뽑혔어요!' : ', '); });
    render();
  });
  replay.addEventListener('click', () => { if (!drawing) { state = resetDraw(state); result.textContent = '다시 뽑을 준비가 됐어요.'; render(); } });
  result.textContent = '';
  render();
}
