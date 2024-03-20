const WHITE = "w";
const BLACK = "b";
const KING_SIDE_CASTLE = "O-O";
const QUEEN_SIDE_CASTLE = "O-O-O";
class Chessboard {
  constructor() {
    this._turn = WHITE;
    this._enPassantSquare = null;
    this._castlingRights = [KING_SIDE_CASTLE, QUEEN_SIDE_CASTLE];
    this._isEnded = false;
    this._isInCheck = false;
    this._checkingPieces = null;
    this._allAttackedSquares = null;
    this._pinnedPieces = null;
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
    this._allLegalMoves = {};
  }

  get turn() {
    return this._turn;
  }

  get enPassantSquare() {
    return this._enPassantSquare;
  }

  get castlingRights() {
    return this._castlingRights;
  }

  get isEnded() {
    return this._isEnded;
  }

  get isInCheck() {
    return this._isInCheck;
  }

  get checkingPieces() {
    return this._checkingPieces;
  }

  get allAttackedSquares() {
    return this._allAttackedSquares;
  }

  _getAttackedSquares(fromRow, fromCol) {
    // return squares that piece from [fromRow, fromCol] can attack
    const piece = this.getPiece(fromRow, fromCol);
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
            if (this.getPiece(currRow, currCol) !== null) break;
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
            if (this.getPiece(currRow, currCol) !== null) break;
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
            if (this.getPiece(currRow, currCol) !== null) break;
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

  _getAllAttackedSquares() {
    const allAttackedSquares = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (
          this.getPiece(row, col) !== null &&
          !this._isSameSide(this.getPiece(row, col))
        ) {
          const attackedSquares = this._getAttackedSquares(row, col);
          allAttackedSquares.push(...attackedSquares);
        }
      }
    }
    // filter duplicates
    this._allAttackedSquares = [
      ...new Set(allAttackedSquares.map(JSON.stringify)),
    ].map(JSON.parse);
  }

  findKing() {
    const king = this._turn === WHITE ? "k" : "K";
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.getPiece(row, col) === king) {
          return [row, col];
        }
      }
    }
  }

  _getIsEnemyPiece(piece) {
    return piece && !this._isSameSide(piece);
  }

  _isSameSide(piece) {
    return this._turn === WHITE
      ? piece === piece.toLowerCase()
      : piece === piece.toUpperCase();
  }

  getPotentialAttackedSquares() {
    const [row, col] = this.findKing();
    const pinnedSquares = {};
    // check if any piece is pinned
    const directions = [
      [-1, 0], // up
      [1, 0], // down
      [0, -1], // left
      [0, 1], // right
      [-1, -1], // up left
      [-1, 1], // up right
      [1, -1], // down left
      [1, 1], // down right
    ];
    for (const [dx, dy] of directions) {
      let counter = 0;
      let pinnedPiece = null;
      let currRow = row + dx;
      let currCol = col + dy;
      while (currRow >= 0 && currRow <= 7 && currCol >= 0 && currCol <= 7) {
        // check if exactly one piece in line of fire
        let piece = this.getPiece(currRow, currCol);
        if (piece !== null) {
          if (this._getIsEnemyPiece(piece) && counter === 1) {
            if (
              ((piece.toLowerCase() === "q" || piece.toLowerCase() === "r") &&
                (dx + dy) * (dx + dy) === 1) ||
              ((piece.toLowerCase() === "q" || piece.toLowerCase() === "b") &&
                (dx + dy) * (dx + dy) !== 1)
            ) {
              pinnedSquares[pinnedPiece] = [dx, dy];
            }
            break;
          } else if (this._isSameSide(piece) && counter === 0) {
            counter++;
            pinnedPiece = [currRow, currCol];
          }
        }
        currRow += dx;
        currCol += dy;
      }
    }
    this._pinnedPieces = pinnedSquares;
  }

  add(row, col, piece) {
    this._board[row][col] = piece;
  }

  remove(row, col) {
    this._board[row][col] = null;
  }

  _move(fromRow, fromCol, toRow, toCol) {
    this.add(toRow, toCol, this.getPiece(fromRow, fromCol));
    this.remove(fromRow, fromCol);
  }

  playOpponentMove(move) {
    const { fromRow, fromCol, toRow, toCol } = move;
    for (let i = 0; i < fromRow.length; i++) {
      this.move(fromRow[i], fromCol[i], toRow[i], toCol[i]);
    }
  }

  _updateCastle(piece, fromCol, toCol) {
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
  }

  _updateEnPassant(piece, fromRow, fromCol, toRow) {
    // update en passant square (if applicable)
    if (piece.toLowerCase() === "p" && Math.abs(toRow - fromRow) === 2) {
      this._enPassantSquare = [(fromRow + toRow) / 2, fromCol];
    } else {
      this._enPassantSquare = null;
    }
  }

  playYourMove(move) {
    const { fromRow, fromCol, toRow, toCol } = move;
    const piece = this.getPiece(fromRow, fromCol);
    if (piece === null) {
      console.log("move null???");
      return;
    }
    this._move(fromRow, fromCol, toRow, toCol);
    this._updateCastle(piece, fromCol, toCol);
    this._updateEnPassant(piece, fromRow, fromCol, toRow);
  }

  isLegalMove(move) {
    const { fromRow, fromCol, toRow, toCol } = move;
    const piece = this.getPiece(fromRow, fromCol);
    if (piece === null) return false;
    const legalMoves = this.getLegalMoves(fromRow, fromCol);
    for (const [row, col] of legalMoves) {
      if (row === toRow && col === toCol) return true;
    }
    return false;
  }

  getPiece(row, col) {
    return this._board[row][col];
  }

  _checkPinMovement(limit_x, limit_y, new_direction_x, new_direction_y) {
    if (
      !(limit_x || limit_y) ||
      (limit_x === new_direction_x && limit_y === new_direction_y)
    )
      return true;
    return false;
  }

  _getIsEmptySquare(row, col) {
    return this.getPiece(row, col) === null;
  }

  _getPawnMoves(fromRow, fromCol) {
    const possibleMoves = [];
    const direction = this._turn === WHITE ? -1 : 1;
    const startRow = this._turn === WHITE ? 6 : 1;
    let limit_x, limit_y;
    if (this._pinnedPieces && this._pinnedPieces[[fromRow, fromCol]]) {
      const [dx, dy] = this._pinnedPieces[[fromRow, fromCol]];
      limit_x = dx;
      limit_y = dy;
    }
    // check one square ahead
    if (this._getIsEmptySquare(fromRow + direction, fromCol))
      if (this._checkPinMovement(limit_x, limit_y, direction, 0)) {
        possibleMoves.push([fromRow + direction, fromCol]);
      }
    // check two squares ahead if pawn is at starting position
    if (
      fromRow === startRow &&
      this._getIsEmptySquare(fromRow + 2 * direction, fromCol)
    )
      if (this._checkPinMovement(limit_x, limit_y, direction, 0)) {
        possibleMoves.push([fromRow + 2 * direction, fromCol]);
      }
    // check diagonal squares for capturing
    if (this._getIsEnemyPiece(this.getPiece(fromRow + direction, fromCol - 1)))
      if (this._checkPinMovement(limit_x, limit_y, direction, -1)) {
        possibleMoves.push([fromRow + direction, fromCol - 1]);
      }
    if (this._getIsEnemyPiece(this.getPiece(fromRow + direction, fromCol - 1)))
      if (this._checkPinMovement(limit_x, limit_y, direction, 1)) {
        possibleMoves.push([fromRow + direction, fromCol + 1]);
      }
    // check en passant
    if (this._enPassantSquare !== null) {
      const [enPassantRow, enPassantCol] = this._enPassantSquare;
      if (
        enPassantRow === fromRow + direction &&
        (enPassantCol === fromCol - 1 || enPassantCol === fromCol + 1)
      )
        if (
          this._checkPinMovement(
            limit_x,
            limit_y,
            direction,
            enPassantCol - fromCol
          )
        ) {
          possibleMoves.push([enPassantRow, enPassantCol]);
        }
    }

    return possibleMoves;
  }

  _getKnightMoves(fromRow, fromCol) {
    const possibleMoves = [];
    let limit_x, limit_y;
    if (this._isPinnedSquare(fromRow, fromCol)) {
      [limit_x, limit_y] = this._pinnedPieces[[fromRow, fromCol]];
    }
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
          this.getPiece(newRow, newCol) === null ||
          !this._isSameSide(this.getPiece(newRow, newCol))
        )
          if (!(limit_x || limit_y)) {
            possibleMoves.push([newRow, newCol]);
          }
      }
    }
    return possibleMoves;
  }
  _isPinnedSquare(row, col) {
    return this._getPinnedSquares && this._getPinnedSquares[[row, col]];
  }
  _getRookMoves(fromRow, fromCol) {
    const possibleMoves = [];
    const rookDirections = [
      [-1, 0], // up
      [1, 0], // down
      [0, -1], // left
      [0, 1], // right
    ];
    let limit_x, limit_y;
    if (this._isPinnedSquare(fromRow, fromCol)) {
      [limit_x, limit_y] = this._getPinnedSquares[[fromRow, fromCol]];
    }
    for (const [dx, dy] of rookDirections) {
      let currRow = fromRow + dx;
      let currCol = fromCol + dy;
      while (currRow >= 0 && currRow <= 7 && currCol >= 0 && currCol <= 7) {
        if (this._checkPinMovement(limit_x, limit_y, dx, dy)) {
          if (this.getPiece(currRow, currCol) === null) {
            possibleMoves.push([currRow, currCol]);
          } else {
            if (!this._isSameSide(this.getPiece(currRow, currCol)))
              possibleMoves.push([currRow, currCol]);
            break;
          }
        }
        currRow += dx;
        currCol += dy;
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
    let limit_x, limit_y;
    if (this._isPinnedSquare(fromRow, fromCol)) {
      [limit_x, limit_y] = this._getPinnedSquares[[fromRow, fromCol]];
    }
    for (const [dx, dy] of bishopDirections) {
      let currRow = fromRow + dx;
      let currCol = fromCol + dy;
      while (currRow >= 0 && currRow <= 7 && currCol >= 0 && currCol <= 7) {
        if (this._checkPinMovement(limit_x, limit_y, dx, dy)) {
          if (this.getPiece(currRow, currCol) === null) {
            possibleMoves.push([currRow, currCol]);
          } else {
            if (!this._isSameSide(this.getPiece(currRow, currCol)))
              possibleMoves.push([currRow, currCol]);
            break;
          }
        }
        currRow += dx;
        currCol += dy;
      }
    }
    return possibleMoves;
  }

  _getQueenMoves(fromRow, fromCol) {
    return this._getBishopMoves(fromRow, fromCol).concat(
      this._getRookMoves(fromRow, fromCol)
    );
  }
  _isAttackedSquare = (row, col) => {
    if (this._allAttackedSquares) {
      return this._allAttackedSquares.some(([r, c]) => r === row && c === col);
    }
    return false;
  };
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
          this._getIsEmptySquare(newRow, newCol) ||
          !this._isSameSide(this.getPiece(newRow, newCol))
        )
          possibleMoves.push([newRow, newCol]);
      }
    }
    return possibleMoves;
  }

  getLegalMoves(row, col) {
    const piece = this.getPiece(row, col);
    if (piece === null) return [];
    switch (piece.toLowerCase()) {
      case "p":
        return this._getPawnMoves(row, col);
      case "n":
        return this._getKnightMoves(row, col);
      case "b":
        return this._getBishopMoves(row, col);
      case "r":
        return this._getRookMoves(row, col);
      case "q":
        return this._getQueenMoves(row, col);
      case "k":
        return this._getKingMoves(row, col);
    }
  }

  getAllLegalMoves() {
    const legalMoves = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.getPiece(row, col);
        if (piece && this._isSameSide(piece)) {
          const moves = this.getLegalMoves(row, col);
          this._allLegalMoves[[row, col]] = moves;
        }
      }
    }
  }
}

const chessboard = new Chessboard();
chessboard._getAllAttackedSquares();
