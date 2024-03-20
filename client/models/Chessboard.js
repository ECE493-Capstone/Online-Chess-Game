const WHITE = "w";
const BLACK = "b";
const KING_SIDE_CASTLE = "O-O";
const QUEEN_SIDE_CASTLE = "O-O-O";

class Chessboard {
  constructor() {
    this._board = [
      // uppercase: black, lowercase: white
      ["R", "N", "B", "Q", "K", "B", "N", "R"], // [0]
      ["P", "P", "P", "P", "P", "P", "P", "P"], // [1]
      [null, null, null, null, null, null, null, null], // [2]
      [null, null, null, null, null, null, null, null], // [3]
      [null, null, null, null, null, null, null, null], // [4]
      [null, null, null, null, null, null, null, null], // [5]
      ["p", "p", "p", "p", "p", "p", "p", "p"], // [6]
      ["r", "n", "b", "q", "k", "b", "n", "r"], // [7]
    ];
    this._turn = WHITE;
    this._enPassantSquare = null;
    this._castlingRights = [KING_SIDE_CASTLE, QUEEN_SIDE_CASTLE];
    this._isEnded = false;
    this._isInCheck = false;
    this._checkingPieces = null;
    this._getAllAttackedSquares = null;
  }

  turn() {
    return this._turn;
  }

  board() {
    return this._board;
  }

  get(row, col) {
    // null if no piece on the square
    if (row < 0 || row > 7 || col < 0 || col > 7) return null;
    return this._board[row][col];
  }

  add(row, col, piece) {
    this._board[row][col] = piece;
  }

  remove(row, col) {
    this._board[row][col] = null;
  }

  _makeMove(fromRow, fromCol, toRow, toCol, promotionPiece) {
    const piece = this.get(fromRow, fromCol);
    if (piece === null) {
      console.log("move null???");
      return;
    }

    this.remove(fromRow, fromCol);

    // check for castling
    if (piece.toLowerCase() === "k") {
      this._castlingRights = [];
      if (Math.abs(toCol - fromCol) === 2) {
        // castling
        const row = this._turn === WHITE ? 7 : 0;
        const rookSymbol = this._turn === WHITE ? "R" : "r";
        const rookFromCol = toCol === 6 ? 7 : 0;
        const rookToCol = toCol === 6 ? 5 : 3;
        this.remove(row, rookFromCol);
        this.add(row, rookToCol, rookSymbol);
      }
    }

    this.add(toRow, toCol, promotionPiece !== null ? promotionPiece : piece);

    // update en passant square (if applicable)
    if (piece.toLowerCase() === "p" && Math.abs(toRow - fromRow) === 2) {
      this._enPassantSquare = [(fromRow + toRow) / 2, fromCol];
    } else {
      this._enPassantSquare = null;
    }

    // update castling rights (if applicable)
    if (piece.toLowerCase() === "r" && fromCol === 0) {
      this._castlingRights = this._castlingRights.filter(
        (right) => right !== QUEEN_SIDE_CASTLE
      );
    } else if (piece.toLowerCase() === "r" && fromCol === 7) {
      this._castlingRights = this._castlingRights.filter(
        (right) => right !== KING_SIDE_CASTLE
      );
    }

    this._turn = this._turn === WHITE ? BLACK : WHITE;
  }

  move(fromRow, fromCol, toRow, toCol, promotionPiece = null) {
    this._makeMove(fromRow, fromCol, toRow, toCol, promotionPiece);
    this.isCheckmate();
    this.isDraw();
    this.isChecked();
  }

  getCastlingRights() {
    return this._castlingRights;
  }

  isChecked() {
    const kingSquare = this._findKingSquare();
    const allAttackedSquares = this._getAllAttackedSquares();
    return allAttackedSquares.some(
      ([row, col]) => row === kingSquare[0] && col === kingSquare[1]
    );
  }

  isGameOver() {
    return this._isEnded || this.isCheckmate() || this.isDraw();
  }

  isDraw() {
    return (
      this.isStalemate() ||
      this.inThreefoldRepetition() ||
      this.insufficientMaterial() ||
      this.isFiftyMoveRule()
    );
  }

  isCheckmate() {
    return this.isChecked() && this._getAllLegalMoves().length === 0;
  }

  _findKingSquare() {
    const kingSymbol = this._turn === WHITE ? "k" : "K";
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.get(row, col) === kingSymbol) {
          return [row, col];
        }
      }
    }
  }

  // isGameOver() { // TODO
  //     return false;
  // }

  _isSameSide(piece) {
    return this._turn === WHITE
      ? piece === piece.toLowerCase()
      : piece === piece.toUpperCase();
  }

  _getAllAttackedSquares() {
    const allAttackedSquares = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (
          this.get(row, col) !== null &&
          !this._isSameSide(this.get(row, col))
        ) {
          const attackedSquares = this._getAttackedSquares(row, col);
          allAttackedSquares.push(...attackedSquares);
        }
      }
    }
    // filter duplicates
    return [...new Set(allAttackedSquares.map(JSON.stringify))].map(JSON.parse);
  }

  _getAllLegalMoves() {
    const allLegalMoves = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (
          this.get(row, col) !== null &&
          this._isSameSide(this.get(row, col))
        ) {
          const legalMoves = this.getLegalMoves(row, col);
          allLegalMoves.push(...legalMoves);
        }
      }
    }
    return allLegalMoves;
  }

  _getCheckSquares() {
    // return the squares that are checking the king
    const kingSquare = this._findKingSquare();
    const checkSquares = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (
          this.get(row, col) !== null &&
          !this._isSameSide(this.get(row, col))
        ) {
          const attackedSquares = this._getAttackedSquares(row, col);
          if (
            attackedSquares.some(
              ([r, c]) => r === kingSquare[0] && c === kingSquare[1]
            )
          ) {
            checkSquares.push([row, col]);
          }
        }
      }
    }
    return checkSquares;
  }

  _getCheckPath(fromRow, fromCol) {
    const piece = this.get(fromRow, fromCol);
  }

  _getAttackedSquares(fromRow, fromCol) {
    // return squares that piece from [fromRow, fromCol] can attack
    const piece = this.get(fromRow, fromCol);
    if (piece === null) return [];
    if (this._isSameSide(piece)) return [];

    const attackingSide = this._turn === WHITE ? BLACK : WHITE;
    const attackedSquares = [];
    switch (piece.toLowerCase()) {
      case "p":
        const direction = attackingSide === WHITE ? -1 : 1;
        attackedSquares.push([fromRow + direction, fromCol - 1]);
        attackedSquares.push([fromRow + direction, fromCol + 1]);
        break;
      case "r":
        const rookDirections = [
          [-1, 0], // up
          [1, 0], // down
          [0, -1], // left
          [0, 1], // right
        ];
        for (const [dx, dy] of rookDirections) {
          let currRow = fromRow + dx;
          let currCol = fromCol + dy;
          while (currRow >= 0 && currRow <= 7 && currCol >= 0 && currCol <= 7) {
            attackedSquares.push([currRow, currCol]);
            if (this.get(currRow, currCol) !== null) break;
            currRow += dx;
            currCol += dy;
          }
        }
        break;
      case "n":
        const knightMoves = [
          [-2, -1], // up left
          [-2, 1], // up right
          [-1, -2], // left up
          [-1, 2], // right up
          [1, -2], // left down
          [1, 2], // right down
          [2, -1], // down left
          [2, 1], // down right
        ];
        for (const [dx, dy] of knightMoves) {
          const newRow = fromRow + dx;
          const newCol = fromCol + dy;
          if (newRow >= 0 && newRow <= 7 && newCol >= 0 && newCol <= 7) {
            attackedSquares.push([newRow, newCol]);
          }
        }
        break;
      case "b":
        const bishopDirections = [
          [-1, -1], // up left
          [-1, 1], // up right
          [1, -1], // down left
          [1, 1], // down right
        ];
        for (const [dx, dy] of bishopDirections) {
          let currRow = fromRow + dx;
          let currCol = fromCol + dy;
          while (currRow >= 0 && currRow <= 7 && currCol >= 0 && currCol <= 7) {
            attackedSquares.push([currRow, currCol]);
            if (this.get(currRow, currCol) !== null) break;
            currRow += dx;
            currCol += dy;
          }
        }
        break;
      case "q":
        const queenDirections = [
          [-1, 0], // up
          [1, 0], // down
          [0, -1], // left
          [0, 1], // right
          [-1, -1], // up left
          [-1, 1], // up right
          [1, -1], // down left
          [1, 1], // down right
        ];
        for (const [dx, dy] of queenDirections) {
          let currRow = fromRow + dx;
          let currCol = fromCol + dy;
          while (currRow >= 0 && currRow <= 7 && currCol >= 0 && currCol <= 7) {
            attackedSquares.push([currRow, currCol]);
            if (this.get(currRow, currCol) !== null) break;
            currRow += dx;
            currCol += dy;
          }
        }
        break;
      case "k":
        const kingMoves = [
          [-1, 0], // up
          [1, 0], // down
          [0, -1], // left
          [0, 1], // right
          [-1, -1], // up left
          [-1, 1], // up right
          [1, -1], // down left
          [1, 1], // down right
        ];
        for (const [dx, dy] of kingMoves) {
          const newRow = fromRow + dx;
          const newCol = fromCol + dy;
          if (newRow >= 0 && newRow <= 7 && newCol >= 0 && newCol <= 7) {
            attackedSquares.push([newRow, newCol]);
          }
        }
        break;
      default:
        console.warn("piece not implemented??");
        break;
    }
    return attackedSquares;
  }
  _getIsEmptySquare(row, col) {
    return this.get(row, col) === null;
  }

  _getIsAllyPiece(row, col) {
    return this.get(row, col) !== null && this._isSameSide(this.get(row, col));
  }

  _getIsEnemyPiece(row, col) {
    return this.get(row, col) !== null && !this._isSameSide(this.get(row, col));
  }

  _isAttackedSquare = (row, col) => {
    return this._getAllAttackedSquares().some(
      ([r, c]) => r === row && c === col
    );
  };

  _getPawnMoves(fromRow, fromCol) {
    const possibleMoves = [];
    const direction = this._turn === WHITE ? -1 : 1;
    const startRow = this._turn === WHITE ? 6 : 1;

    // check one square ahead
    if (this._getIsEmptySquare(fromRow + direction, fromCol))
      possibleMoves.push([fromRow + direction, fromCol]);

    // check two squares ahead if pawn is at starting position
    if (
      fromRow === startRow &&
      this._getIsEmptySquare(fromRow + 2 * direction, fromCol)
    )
      possibleMoves.push([fromRow + 2 * direction, fromCol]);

    // check diagonal squares for capturing
    if (this._getIsEnemyPiece(fromRow + direction, fromCol - 1))
      possibleMoves.push([fromRow + direction, fromCol - 1]);
    if (this._getIsEnemyPiece(fromRow + direction, fromCol + 1))
      possibleMoves.push([fromRow + direction, fromCol + 1]);

    // check en passant
    if (this._enPassantSquare !== null) {
      const [enPassantRow, enPassantCol] = this._enPassantSquare;
      if (
        enPassantRow === fromRow + direction &&
        (enPassantCol === fromCol - 1 || enPassantCol === fromCol + 1)
      )
        possibleMoves.push([enPassantRow, enPassantCol]);
    }

    return possibleMoves;
  }

  _getKnightMoves(fromRow, fromCol) {
    const possibleMoves = [];
    const knightMoves = [
      [-2, -1], // up left
      [-2, 1], // up right
      [-1, -2], // left up
      [-1, 2], // right up
      [1, -2], // left down
      [1, 2], // right down
      [2, -1], // down left
      [2, 1], // down right
    ];
    for (const [dx, dy] of knightMoves) {
      const newRow = fromRow + dx;
      const newCol = fromCol + dy;
      if (newRow >= 0 && newRow <= 7 && newCol >= 0 && newCol <= 7) {
        if (
          this.get(newRow, newCol) === null ||
          !this._isSameSide(this.get(newRow, newCol))
        )
          possibleMoves.push([newRow, newCol]);
      }
    }
    return possibleMoves;
  }

  _getBishopMoves(fromRow, fromCol) {
    const possibleMoves = [];
    const bishopDirections = [
      [-1, -1], // up left
      [-1, 1], // up right
      [1, -1], // down left
      [1, 1], // down right
    ];
    for (const [dx, dy] of bishopDirections) {
      let currRow = fromRow + dx;
      let currCol = fromCol + dy;
      while (currRow >= 0 && currRow <= 7 && currCol >= 0 && currCol <= 7) {
        if (this.get(currRow, currCol) === null) {
          possibleMoves.push([currRow, currCol]);
        } else {
          if (!this._isSameSide(this.get(currRow, currCol)))
            possibleMoves.push([currRow, currCol]);
          break;
        }
        currRow += dx;
        currCol += dy;
      }
    }
    return possibleMoves;
  }
  _getRookMoves(fromRow, fromCol) {
    const possibleMoves = [];
    const rookDirections = [
      [-1, 0], // up
      [1, 0], // down
      [0, -1], // left
      [0, 1], // right
    ];
    for (const [dx, dy] of rookDirections) {
      let currRow = fromRow + dx;
      let currCol = fromCol + dy;
      while (currRow >= 0 && currRow <= 7 && currCol >= 0 && currCol <= 7) {
        if (this.get(currRow, currCol) === null) {
          possibleMoves.push([currRow, currCol]);
        } else {
          if (!this._isSameSide(this.get(currRow, currCol)))
            possibleMoves.push([currRow, currCol]);
          break;
        }
        currRow += dx;
        currCol += dy;
      }
    }
    return possibleMoves;
  }

  _getQueenMoves(fromRow, fromCol) {
    return this._getRookMoves(fromRow, fromCol).concat(
      this._getBishopMoves(fromRow, fromCol)
    );
  }
  _getKingMoves(fromRow, fromCol) {
    const possibleMoves = [];
    const kingMoves = [
      [-1, 0], // up
      [1, 0], // down
      [0, -1], // left
      [0, 1], // right
      [-1, -1], // up left
      [-1, 1], // up right
      [1, -1], // down left
      [1, 1], // down right
    ];
    for (const [dx, dy] of kingMoves) {
      const newRow = fromRow + dx;
      const newCol = fromCol + dy;
      if (newRow >= 0 && newRow <= 7 && newCol >= 0 && newCol <= 7) {
        if (this._isAttackedSquare(newRow, newCol)) continue;

        if (
          this._getIsEmptySquare() ||
          !this._isSameSide(this.get(newRow, newCol))
        )
          possibleMoves.push([newRow, newCol]);
      }
    }
    return possibleMoves;
  }

  _getAllKingMovesWithCastling(fromRow, fromCol) {
    const possibleMoves = this._getKingMoves(fromRow, fromCol);
    const allAttackedSquares = this._getAllAttackedSquares();
    const isAttacked = (row, col) =>
      allAttackedSquares.some(([r, c]) => r === row && c === col);
    if (this._turn === WHITE) {
      if (
        this._castlingRights.includes(KING_SIDE_CASTLE) &&
        this.get(7, 5) === null &&
        !isAttacked(7, 5) &&
        this.get(7, 6) === null &&
        !isAttacked(7, 6)
      ) {
        possibleMoves.push(KING_SIDE_CASTLE);
      }
      if (
        this._castlingRights.includes(QUEEN_SIDE_CASTLE) &&
        this.get(7, 1) === null &&
        !isAttacked(7, 1) &&
        this.get(7, 2) === null &&
        !isAttacked(7, 2) &&
        this.get(7, 3) === null &&
        !isAttacked(7, 3)
      ) {
        possibleMoves.push(QUEEN_SIDE_CASTLE);
      }
    } else {
      if (
        this._castlingRights.includes(KING_SIDE_CASTLE) &&
        this.get(0, 5) === null &&
        !isAttacked(0, 5) &&
        this.get(0, 6) === null &&
        !isAttacked(0, 6)
      ) {
        possibleMoves.push(KING_SIDE_CASTLE);
      }
      if (
        this._castlingRights.includes(QUEEN_SIDE_CASTLE) &&
        this.get(0, 1) === null &&
        !isAttacked(0, 1) &&
        this.get(0, 2) === null &&
        !isAttacked(0, 2) &&
        this.get(0, 3) === null &&
        !isAttacked(0, 3)
      ) {
        possibleMoves.push(QUEEN_SIDE_CASTLE);
      }
    }
    return possibleMoves;
  }

  getLegalMoves(fromRow, fromCol) {
    const piece = this.get(fromRow, fromCol);
    if (piece === null) return [];

    let possibleMoves = [];
    if (this._isInCheck) {
      if (this._checkingPieces.length > 1 || piece.toLowerCase() !== "k") {
        // double check, only king can move;
        return this._getKingMoves(fromRow, fromCol);
      }

      switch (piece.toLowerCase()) {
        case "p":
          possibleMoves = this._getPawnMoves(fromRow, fromCol);
          break;
        case "r":
          possibleMoves = this._getRookMoves(fromRow, fromCol);
          break;
        case "n":
          possibleMoves = this._getKnightMoves(fromRow, fromCol);
          break;
        case "b":
          possibleMoves = this._getBishopMoves(fromRow, fromCol);
          break;
        case "q":
          possibleMoves = this._getQueenMoves(fromRow, fromCol);
          break;
        case "k":
          possibleMoves = this._getAllKingMovesWithCastling(fromRow, fromCol);
          break;

        default:
          console.warn("[POSSIBLE MOVES] piece not implemented??");
          break;
      }
    }
    return possibleMoves;
  }

  prettyPrint() {
    const prettyBoard = this._board
      .map((row) =>
        row.map((piece) => (piece === null ? "| |" : `|${piece}|`)).join("")
      )
      .join("\n");
    console.log(prettyBoard);
  }
}
