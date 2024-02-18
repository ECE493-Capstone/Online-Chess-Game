import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "movies",
  initialState: {
    isLoggedIn: true,
    userId: 123,
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
  },
});

export const {
  setUserId,
  removeUserId,
  setIsMoviesLoaded,
  setLoadedToWatchMovies,
  setMovie,
} = userSlice.actions;

export default userSlice.reducer;
