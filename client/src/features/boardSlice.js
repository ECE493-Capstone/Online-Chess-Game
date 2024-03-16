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
    board: [
      ["R", "N", "B", "Q", "K", "B", "N", "R"],
      ["P", "P", "P", "P", "P", "P", "P", "P"],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ["p", "p", "p", "p", "p", "p", "p", "p"],
      ["r", "n", "b", "q", "k", "b", "n", "r"],
    ],
  },
  reducers: {
    setDragStart: (state, action) => {
      state.dragStart = action.payload;
    },
    updateBoard: (state, action) => {
      const from = action.payload.from;
      const to = action.payload.to;
      const piece = state.dragStart.piece;
      const newBoard = state.board.map((row) => [...row]);
      newBoard[to[0]][to[1]] = piece;
      newBoard[from[0]][from[1]] = null;
      state.board = newBoard;
    },
    setClickPiece: (state, action) => {
      console.log(state.clickPiece, action.payload);
      state.clickPiece = action.payload;
    },
  },
});

export const { setDragStart, updateBoard, setClickPiece } = boardSlice.actions;

export default boardSlice.reducer;
