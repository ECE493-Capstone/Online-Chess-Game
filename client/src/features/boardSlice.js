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
  },
});

export const { setDragStart, setGame, setClickPiece } = boardSlice.actions;

export default boardSlice.reducer;
