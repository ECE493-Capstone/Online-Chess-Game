import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    isPlayer: null,
    gameInfo: null,
  },
  reducers: {
    setIsPlayer: (state, action) => {
      state.isPlayer = action.payload;
    },
    setGameInfo: (state, action) => {
      state.gameInfo = action.payload;
    },
    removeGameInfo: (state) => {
      state.gameInfo = null;
    },
  },
});

export const { setGameInfo, removeGameInfo, setIsPlayer } = userSlice.actions;

export default userSlice.reducer;
