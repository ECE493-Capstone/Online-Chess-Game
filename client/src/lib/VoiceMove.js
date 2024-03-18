import Fuse from "fuse.js";
export default class VoiceMove {
  Pieces = [
    { id: 1, name: "Pawn" },
    { id: 2, name: "Rook" },
    { id: 3, name: "Knight" },
    { id: 4, name: "Bishop" },
    { id: 5, name: "Queen" },
    { id: 6, name: "King" },
  ];

  constructor() {
    this.moves = this.generateMoves();
    this.fuse = new Fuse(this.moves, {
      keys: ["name"],
      includeScore: true,
    });
  }

  generateMoves() {
    const numbers = [
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
    ];
    const pieces = ["Pawn", "Rook", "Knight", "Bishop", "Queen", "King"];
    const letters = "abcdefgh";
    const moves = [];
    let counter = 1;
    for (let i = 0; i < pieces.length; i++) {
      for (let j = 1; j <= 8; j++) {
        for (let k = 1; k <= 8; k++) {
          moves.push({
            id: counter,
            name: `${pieces[i]} to ${letters[j]} ${numbers[k]}`,
          });
          counter++;
        }
      }
    }
    return moves;
  }

  matchMove(move) {
    const res = this.fuse.search(move);
    // console.log(res);
    return move && this.fuse.search(move);
  }
}
