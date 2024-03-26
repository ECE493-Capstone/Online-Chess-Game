import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: true,
    userId: 123,
    socket: null,
    gameSession: null,
    spectateSessions: [],
    gameInfo: null,
  },
  reducers: {
    setGameInfo: (state, action) => {
      state.gameInfo = action.payload;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    removeGameInfo: (state) => {
      state.gameInfo = null;
    },
  },
});

export const { setGameInfo, removeGameInfo, setSocket } = userSlice.actions;

export default userSlice.reducer;
