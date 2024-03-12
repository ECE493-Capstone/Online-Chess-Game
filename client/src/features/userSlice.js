import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "movies",
  initialState: {
    isLoggedIn: true,
    userId: 123,
    socket: null,
    gameInfo: null,
    spectateSessions: [],
  },
  reducers: {
    setGameInfo: (state, action) => {
      state.gameInfo = action.payload;
    },
    removeGameInfo: (state) => {
      state.gameInfo = null;
    },
    setSocket: (state, action) => {
      console.log("WEE");
      state.socket = action.payload;
    },
  },
});

export const { setGameInfo, removeGameInfo, setSocket } = userSlice.actions;

export default userSlice.reducer;
