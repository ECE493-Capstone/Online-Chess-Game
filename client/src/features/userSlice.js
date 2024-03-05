import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "movies",
  initialState: {
    isLoggedIn: true,
    userId: 123,
    socket: null,
    gameSession: null,
    spectateSessions: [],
  },
  reducers: {
    setGameSession: (state, action) => {
      state.gameSession = action.payload;
    },
    removeGameSession: (state, action) => {
      state.gameSession = null;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
  },
});

export const { setGameSession, removeGameSession, setSocket } =
  userSlice.actions;

export default userSlice.reducer;
