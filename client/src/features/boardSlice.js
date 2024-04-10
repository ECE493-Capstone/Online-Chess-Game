import { createSlice } from "@reduxjs/toolkit";

export const boardSlice = createSlice({
  name: "board",
  initialState: {
    dragStart: {
      isDragStart: false,
      startIndex: null,
      piece: null,
    },
    clickPiece: {
      clickedSquare: null,
      legalMoves: [],
    },
    game: null,
    voteInfo: {
      votedSquare: null,
      isAllowed: false, // true if spectator turn & not voted yet
    },
  },
  reducers: {
    setDragStart: (state, action) => {
      state.dragStart = action.payload;
    },
    setClickPiece: (state, action) => {
      state.clickPiece = action.payload;
    },
    setGame: (state, action) => {
      state.game = action.payload;
    },
    setVoteInfo: (state, action) => {
      state.voteInfo = action.payload;
    },
  },
});

export const { setDragStart, setGame, setClickPiece, setVoteInfo } =
  boardSlice.actions;

export default boardSlice.reducer;
