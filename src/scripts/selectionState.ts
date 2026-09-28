export interface Participant {
  id: number;
  label: string;
}

export interface DrawState<T extends Participant> {
  participants: T[];
  remaining: T[];
  history: T[];
  currentWinner: T | null;
}

export const addParticipant = <T extends Participant>(state: DrawState<T>, participant: T): DrawState<T> => ({
  ...state,
  participants: [...state.participants, participant],
  remaining: [...state.remaining, participant],
});

export const removeParticipant = <T extends Participant>(state: DrawState<T>, id: number): DrawState<T> => ({
  ...state,
  participants: state.participants.filter((item) => item.id !== id),
  remaining: state.remaining.filter((item) => item.id !== id),
});

export const recordWinner = <T extends Participant>(state: DrawState<T>, winner: T, exclude: boolean): DrawState<T> => {
  const remaining = exclude ? state.remaining.filter((item) => item.id !== winner.id) : state.remaining;
  const history = exclude && remaining.length === 1 ? [...state.history, winner, remaining[0]] : [...state.history, winner];
  return { ...state, currentWinner: winner, remaining, history };
};

export const resetDraw = <T extends Participant>(state: DrawState<T>): DrawState<T> => ({
  ...state,
  remaining: [...state.participants],
  history: [],
  currentWinner: null,
});
