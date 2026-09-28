import { WheelRenderer, type WheelItem } from './WheelRenderer';

type Participant = WheelItem;
type DrawState = {
  participants: Participant[];
  remaining: Participant[];
  history: Participant[];
  currentWinner: Participant | null;
};

const palette = ['#155eef', '#e85d04', '#087968', '#7c3aed', '#c2410c', '#0f766e', '#be123c', '#4d7c0f', '#0369a1', '#a16207', '#6d28d9', '#9f1239', '#1d4ed8', '#b45309', '#047857', '#9d174d', '#4338ca', '#15803d', '#ea580c', '#0e7490', '#9333ea', '#ca8a04', '#0f766e', '#a21caf'];

const game = document.querySelector<HTMLElement>('[data-wheel-game]');

if (game) {
  const input = document.querySelector<HTMLInputElement>('[data-wheel-input]')!;
  const list = document.querySelector<HTMLElement>('[data-wheel-list]')!;
  const form = document.querySelector<HTMLFormElement>('[data-wheel-form]')!;
  const spinButton = document.querySelector<HTMLButtonElement>('[data-wheel-spin]')!;
  const replayButton = document.querySelector<HTMLButtonElement>('[data-wheel-replay]')!;
  const shareButton = document.querySelector<HTMLButtonElement>('[data-wheel-share]')!;
  const excludeInput = document.querySelector<HTMLInputElement>('[data-wheel-exclude]')!;
  const result = document.querySelector<HTMLElement>('[data-wheel-result]')!;
  const history = document.querySelector<HTMLElement>('[data-wheel-history]')!;
  const status = document.querySelector<HTMLElement>('[data-wheel-status]')!;
  const renderer = new WheelRenderer(document.querySelector<HTMLCanvasElement>('[data-wheel-canvas]')!);
  let nextId = 0;
  let spinning = false;
  let state: DrawState = { participants: [], remaining: [], history: [], currentWinner: null };

  const participant = (label: string): Participant => ({ id: nextId, label, color: palette[nextId++ % palette.length] });
  const addInitial = ['민지', '준호', '서연'].map(participant);
  state = { participants: addInitial, remaining: [...addInitial], history: [], currentWinner: null };

  const renderResult = (winner?: Participant, excluded = false) => {
    result.replaceChildren();
    if (!winner) {
      result.textContent = '참가자 2명 이상을 확인한 뒤 룰렛을 돌려보세요.';
      return;
    }
    const name = document.createElement('strong');
    name.textContent = winner.label;
    result.append(name, ' 님이 뽑혔어요!');
    if (!excluded) return;
    const remainingText = document.createElement('span');
    remainingText.className = 'wheel-result__detail';
    remainingText.textContent = state.remaining.length === 1
      ? `${state.remaining[0].label} 님이 마지막으로 남았어요.`
      : `${state.remaining.map(({ label }) => label).join(', ')} 님이 남았어요.`;
    const nextText = document.createElement('span');
    nextText.className = 'wheel-result__next';
    nextText.textContent = `다음 룰렛을 돌릴 때부터 ${winner.label} 님을 제외해요.`;
    result.append(remainingText, nextText);
  };

  const renderState = (drawWheel = true) => {
    const items = state.remaining.map((item) => {
      const row = document.createElement('li');
      const label = document.createElement('span');
      const remove = document.createElement('button');
      label.textContent = item.label;
      remove.type = 'button';
      remove.dataset.remove = String(item.id);
      remove.ariaLabel = `${item.label} 삭제`;
      remove.textContent = '삭제';
      row.append(label, remove);
      return row;
    });
    list.replaceChildren(...items);
    if (drawWheel) renderer.setItems(state.remaining);
    spinButton.disabled = spinning || state.remaining.length < 2;
    status.textContent = state.remaining.length === 1
      ? `${state.remaining[0].label} 님이 마지막으로 남았어요.`
      : state.remaining.length < 2 ? '참가자를 2명 이상 넣어주세요.' : `다음 추첨 대상 ${state.remaining.length}명`;
    history.textContent = state.history.length ? `추첨 순서: ${state.history.map(({ label }) => label).join(' → ')}` : '';
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const label = input.value.trim().slice(0, 16);
    if (!label || spinning) return;
    const item = participant(label);
    state = { ...state, participants: [...state.participants, item], remaining: [...state.remaining, item] };
    input.value = '';
    renderState();
    input.focus();
  });

  list.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-remove]');
    if (!button || spinning) return;
    const id = Number(button.dataset.remove);
    state = {
      ...state,
      participants: state.participants.filter((item) => item.id !== id),
      remaining: state.remaining.filter((item) => item.id !== id),
    };
    renderState();
  });

  spinButton.addEventListener('click', async () => {
    if (spinning || state.remaining.length < 2) return;
    renderer.setItems(state.remaining);
    const excludeWinner = excludeInput.checked;
    spinning = true;
    excludeInput.disabled = true;
    spinButton.disabled = true;
    result.textContent = '룰렛을 돌리는 중이에요…';
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    const winnerIndex = values[0] % state.remaining.length;
    const winner = state.remaining[winnerIndex];
    await renderer.spinTo(winnerIndex);
    const nextRemaining = excludeWinner ? state.remaining.filter((item) => item.id !== winner.id) : state.remaining;
    const nextHistory = excludeWinner && nextRemaining.length === 1
      ? [...state.history, winner, nextRemaining[0]]
      : [...state.history, winner];
    state = {
      ...state,
      currentWinner: winner,
      history: nextHistory,
      remaining: nextRemaining,
    };
    spinning = false;
    excludeInput.disabled = false;
    renderResult(winner, excludeWinner);
    renderState(false);
  });

  replayButton.addEventListener('click', () => {
    if (spinning) return;
    state = { ...state, remaining: [...state.participants], history: [], currentWinner: null };
    renderer.reset();
    renderResult();
    renderState();
  });

  shareButton.addEventListener('click', async () => {
    const text = result.textContent || 'PickPlay 룰렛으로 한 명을 뽑아보세요.';
    if (navigator.share) await navigator.share({ title: 'PickPlay 룰렛', text, url: location.href });
    else {
      await navigator.clipboard.writeText(`${text}\n${location.href}`);
      status.textContent = '링크를 복사했어요.';
    }
  });

  renderResult();
  renderState();
}