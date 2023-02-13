import { createSlice } from '@reduxjs/toolkit';

export const gameSlice = createSlice({
  name: 'game',
  initialState: {
    status: 'pending',
    currentValue: 15,
    players: [],
    enemy: null,
    yourTurn: false,
  },
  reducers: {
    updatePlayerStatus: (state, action) => {
      state.status = action.payload;
    },
    setCurrentValue: (state, action) => {
      state.currentValue = action.payload;
    },
    setEnemy: (state, action) => {
      state.enemy = action.payload;
    },
    changeTurn: (state, action) => {
      state.yourTurn = !state.yourTurn;
    },
    setGame: (state, action) => action.payload,
  },
});

// Action creators are generated for each case reducer function
export const { updatePlayerStatus, setCurrentValue, setEnemy, changeTurn, setGame } =
  gameSlice.actions;

export default gameSlice.reducer;
