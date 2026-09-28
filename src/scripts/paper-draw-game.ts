import { addParticipant, recordWinner, removeParticipant, resetDraw, type DrawState, type Participant } from './selectionState';

const game = document.querySelector<HTMLElement>('[data-paper-game]');
if (game) {
  const input = document.querySelector<HTMLInputElement>('[data-paper-input]')!;
  const form = document.querySelector<HTMLFormElement>('[data-paper-form]')!;
  const list = document.querySelector<HTMLElement>('[data-paper-list]')!;
  const grid = document.querySelector<HTMLElement>('[data-paper-grid]')!;
  const exclude = document.querySelector<HTMLInputElement>('[data-paper-exclude]')!;
  const result = document.querySelector<HTMLElement>('[data-paper-result]')!;
  const remaining = document.querySelector<HTMLElement>('[data-paper-remaining]')!;
  const history = document.querySelector<HTMLElement>('[data-paper-history]')!;
  const replay = document.querySelector<HTMLButtonElement>('[data-paper-replay]')!;
  const next = document.querySelector<HTMLButtonElement>('[data-paper-next]')!;
  let nextId = 0; let revealing = false;
  const make = (label: string): Participant => ({ id: nextId++, label });
  const initial = ['민지', '준호', '서연'].map(make);
  let state: DrawState<Participant> = { participants: initial, remaining: [...initial], history: [], currentWinner: null };
  const shuffle = <T,>(items: T[]) => items.map((item) => ({ item, value: crypto.getRandomValues(new Uint32Array(1))[0] })).sort((a, b) => a.value - b.value).map(({ item }) => item);
  const renderPapers = () => {
    grid.replaceChildren(...shuffle(state.remaining).map((item) => { const button = document.createElement('button'); button.type = 'button'; button.className = 'paper-card'; button.dataset.paper = String(item.id); button.setAttribute('aria-label', '접힌 종이 선택'); button.innerHTML = '<span>선택</span>'; return button; }));
  };
  const render = () => {
    list.replaceChildren(...state.remaining.map((item) => { const row = document.createElement('li'); const label = document.createElement('span'); const button = document.createElement('button'); label.textContent = item.label; button.type = 'button'; button.dataset.remove = String(item.id); button.textContent = '삭제'; button.ariaLabel = `${item.label} 삭제`; row.append(label, button); return row; }));
    exclude.disabled = revealing;
    remaining.textContent = state.remaining.length === 1 ? `${state.remaining[0].label} 님이 마지막으로 남았어요.` : `남은 참가자: ${state.remaining.map(({ label }) => label).join(', ')}`;
    history.textContent = state.history.length ? `추첨 순서: ${state.history.map(({ label }) => label).join(' → ')}` : '';
  };
  form.addEventListener('submit', (event) => { event.preventDefault(); const label = input.value.trim().slice(0, 16); if (!label || revealing) return; state = addParticipant(state, make(label)); input.value = ''; render(); renderPapers(); });
  list.addEventListener('click', (event) => { const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-remove]'); if (!button || revealing) return; state = removeParticipant(state, Number(button.dataset.remove)); render(); renderPapers(); });
  grid.addEventListener('click', async (event) => { const paper = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-paper]'); if (!paper || revealing || state.remaining.length < 2) return; const winner = state.remaining.find((item) => item.id === Number(paper.dataset.paper)); if (!winner) return; const excludeWinner = exclude.checked; revealing = true; render(); paper.classList.add('paper-card--open'); paper.textContent = winner.label; await new Promise((resolve) => setTimeout(resolve, 420)); state = recordWinner(state, winner, excludeWinner); if (state.remaining.length === 1) { const lastPaper = grid.querySelector<HTMLButtonElement>(`[data-paper="${state.remaining[0].id}"]`); if (lastPaper) { lastPaper.classList.add('paper-card--open'); lastPaper.textContent = state.remaining[0].label; } grid.querySelectorAll<HTMLButtonElement>('[data-paper]').forEach((button) => { button.disabled = true; }); } result.innerHTML = ''; const strong = document.createElement('strong'); strong.textContent = winner.label; result.append(strong, ' 님이 뽑혔어요!'); revealing = false; render(); next.hidden = state.remaining.length < 2; });
  next.addEventListener('click', () => { if (!revealing && state.remaining.length >= 2) { renderPapers(); next.hidden = true; } });
  replay.addEventListener('click', () => { if (!revealing) { state = resetDraw(state); result.textContent = '다시 고를 준비가 됐어요.'; render(); renderPapers(); next.hidden = true; } });
  result.textContent = '종이 하나를 선택해보세요.'; render(); renderPapers();
}
