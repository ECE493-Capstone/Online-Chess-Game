/* 
  This file is deigned to support all FRs in the following sections: (FR7-FR30)
  3.4 Disconnection / Reconnection
  3.5 Spectating
  3.6 Game Review
  3.7 Gameplay Features
*/

export const WHITE = "w";
export const BLACK = "b";
export const GAME_MODE = {
  STANDARD: "standard",
  POWER_UP_DUCK: "Power-up Duck",
  BLIND: "Blind",
};

const KING_SIDE_CASTLE = "O-O";
const QUEEN_SIDE_CASTLE = "O-O-O";
export const EVOLVE_SYMBOL = "*";
const PROGRESS_SYMBOL = "+";
export const DUCK = "D";

export class Chessboard {
  constructor(side, gameMode, fen = null) {
    this._side = side;
    this._gameMode = gameMode ? gameMode : GAME_MODE.STANDARD;
    this._isEnded = false;
    this._winner = null;
    this._isInCheck = false;
    this._checkingSquares = []; // list of squares in the form [row, col] that are checking the king
    this._blockableSquares = []; // list of squares that can block the check
    this._attackedSquares = []; // list of all squares currently under attacked by opponent
    this._pinnedDirections = {}; // dictionary of squares with their pinned directions (CAUTION: key is _hash(row,col))

    if (fen) {
      this._initFromFEN2(fen);
    } else {
      this._turn = WHITE;
      this._halfMove = 0; // use to check for fifty move rule
      this._fullMove = 1;
      this._enPassantSquare = null;
      this._castlingRights = {
        [WHITE]: [KING_SIDE_CASTLE, QUEEN_SIDE_CASTLE],
        [BLACK]: [KING_SIDE_CASTLE, QUEEN_SIDE_CASTLE],
      };

      this._board = [
        // uppercase: black, lowercase: white
        ["R", "N", "B", "Q", "K", "B", "N", "R"], // [0]
        ["P", "P", "P", "P", "P", "P", "P", "P"], // [1]
        [null, null, null, null, null, null, null, null], // [2]
        [null, null, null, null, null, null, null, null], // [3]
        [
          null,
          null,
          null,
          this._gameMode === GAME_MODE.POWER_UP_DUCK ? DUCK : null,
          null,
          null,
          null,
          null,
        ], // [4]
        [null, null, null, null, null, null, null, null], // [5]
        ["p", "p", "p", "p", "p", "p", "p", "p"], // [6]
        ["r", "n", "b", "q", "k", "b", "n", "r"], // [7]
      ];
    }

    if (this._side === this._turn) {
      this._legalMoves = this._updateLegalMoves(); // dictionary of all legal moves for each square (CAUTION: key is _hash(row,col))
    } else {
      this._legalMoves = {};
    }
  }

  get side() {
    return this._side;
  }

  get turn() {
    return this._turn;
  }

  get isEnded() {
    return this._isEnded;
  }

  get winner() {
    return this._winner;
  }

  get castlingRights() {
    return this._castlingRights;
  }

  get isInCheck() {
    return this._isInCheck;
  }

  get checkingSquares() {
    return this._checkingSquares;
  }

  get legalMoves() {
    return this._legalMoves;
  }

  get gameMode() {
    return this._gameMode;
  }

  getBoard() {
    return this._board;
  }

  _initFromFEN2(fen) {
    const board = [];
    const fenParts = fen.split(" ");
    const [
      boardPart,
      turn,
      castlingRights,
      enPassantSquare,
      halfMove,
      fullMove,
    ] = fenParts;
    const fenRows = boardPart.split("/");

    for (let i = 0; i < 8; i++) {
      const row = [];
      let fenRow = fenRows[i];
      for (let j = 0; j < fenRow.length; j++) {
        const char = fenRow.charAt(j);
        if (!isNaN(char)) {
          for (let k = 0; k < parseInt(char); k++) {
            row.push(null);
          }
        } else {
          let charPiece = `${char}`;
          // check if characters followed is evolve symbol or progress symbol
          let charToSkip = 0;
          while (
            (fenRow.charAt(j + charToSkip + 1) === EVOLVE_SYMBOL ||
              fenRow.charAt(j + charToSkip + 1) === PROGRESS_SYMBOL) &&
            j + charToSkip + 1 < fenRow.length
          ) {
            charPiece += fenRow.charAt(j + charToSkip + 1);
            charToSkip++;
          }
          row.push(charPiece);
          j += charToSkip;
        }
      }
      board.push(row);
    }

    this._board = board;
    this._turn = turn;
    this._castlingRights = {
      [WHITE]: [],
      [BLACK]: [],
    };
    if (castlingRights !== "-") {
      for (const right of castlingRights) {
        if (right === "k") {
          this._castlingRights[WHITE].push(KING_SIDE_CASTLE);
        } else if (right === "q") {
          this._castlingRights[WHITE].push(QUEEN_SIDE_CASTLE);
        } else if (right === "K") {
          this._castlingRights[BLACK].push(KING_SIDE_CASTLE);
        } else if (right === "Q") {
          this._castlingRights[BLACK].push(QUEEN_SIDE_CASTLE);
        }
      }
    }
    this._enPassantSquare = enPassantSquare !== "-" ? enPassantSquare : null;
    this._halfMove = parseInt(halfMove);
    this._fullMove = parseInt(fullMove);
  }
  // _initFromFEN(fen) {
  //   const [board, turn, castlingRights, enPassantSquare, halfMove, fullMove] =
  //     fen.split(" ");
  //   const rows = board.split("/");
  //   this._board = rows.map((row) => row.split(""));
  //   this._turn = turn;
  //   this._castlingRights = {
  //     [WHITE]: [],
  //     [BLACK]: [],
  //   };
  //   if (castlingRights !== "-") {
  //     for (const right of castlingRights) {
  //       if (right === "k") {
  //         this._castlingRights[WHITE].push(KING_SIDE_CASTLE);
  //       } else if (right === "q") {
  //         this._castlingRights[WHITE].push(QUEEN_SIDE_CASTLE);
  //       } else if (right === "K") {
  //         this._castlingRights[BLACK].push(KING_SIDE_CASTLE);
  //       } else if (right === "Q") {
  //         this._castlingRights[BLACK].push(QUEEN_SIDE_CASTLE);
  //       }
  //     }
  //   }
  //   this._enPassantSquare = enPassantSquare !== "-" ? enPassantSquare : null;
  //   this._halfMove = parseInt(halfMove);
  //   this._fullMove = parseInt(fullMove);
  // }
  // convertToFEN2() {
  //   let fen = "";
  //   for (let row = 0; row < 8; row++) {
  //     let emptySquares = 0;
  //     for (let col = 0; col < 8; col++) {
  //       const piece = this.getPiece(row, col);
  //       if (piece === null) {
  //         emptySquares++;
  //       } else {
  //         if (emptySquares > 0) {
  //           fen += emptySquares;
  //           emptySquares = 0;
  //         }
  //         fen += piece;
  //       }
  //     }
  //     if (emptySquares > 0) {
  //       fen += emptySquares;
  //     }
  //     if (row < 7) {
  //       fen += "/";
  //     }
  //   }

  //   // Add the side to move
  //   fen += " w"; // Assuming it's white's turn to move

  //   // Add castling availability
  //   fen += " -"; // Assuming no castling is available

  //   // Add en passant square
  //   fen += " -"; // Assuming no en passant square available

  //   // Add halfmove clock
  //   fen += " 0"; // Assuming no halfmove clock

  //   // Add fullmove number
  //   fen += " 1"; // Assuming the current move number is 1

  //   return fen;
  // }
  convertToFEN() {
    let fen = "";
    for (let row = 0; row < 8; row++) {
      let empty = 0;
      for (let col = 0; col < 8; col++) {
        const piece = this.getPiece(row, col);
        if (piece === null) {
          empty++;
        } else {
          if (empty > 0) {
            fen += empty;
            empty = 0;
          }
          fen += piece;
        }
      }
      if (empty > 0) {
        fen += empty;
      }
      if (row < 7) {
        fen += "/";
      }
    }
    fen += ` ${this._turn} `;
    fen += this._getCastlingRightsInFEN();
    fen += ` ${this._enPassantSquare ? this._enPassantSquare : "-"}`;
    fen += ` ${this._halfMove}`;
    fen += ` ${this._fullMove}`;
    return fen;
  }

  _getCastlingRightsInFEN() {
    let castling = "";
    if (this._castlingRights[WHITE].includes(KING_SIDE_CASTLE)) {
      castling += "k";
    }
    if (this._castlingRights[WHITE].includes(QUEEN_SIDE_CASTLE)) {
      castling += "q";
    }
    if (this._castlingRights[BLACK].includes(KING_SIDE_CASTLE)) {
      castling += "K";
    }
    if (this._castlingRights[BLACK].includes(QUEEN_SIDE_CASTLE)) {
      castling += "Q";
    }
    return castling === "" ? "-" : castling;
  }

  isDraw() {
    return (
      this._isStalemate() ||
      this._isInsufficientMaterial() ||
      this._isThreefoldRepetition() ||
      this._isFiftyMoveRule()
    );
  }

  _isStalemate() {
    return (
      !this._isInCheck &&
      Object.values(this._legalMoves).every((m) => m.length === 0)
    );
  }

  _isInsufficientMaterial() {
    const pieces = this._board.flat().filter((piece) => piece !== null);
    const pawns = pieces.filter((piece) => this._isPawn(piece));
    const rooks = pieces.filter((piece) => this._isRook(piece));
    const queens = pieces.filter((piece) => this._isQueen(piece));
    const yourBishopKnights = pieces.filter(
      (piece) =>
        this._isSameSide(piece) &&
        (this._isBishop(piece) || this._isKnight(piece))
    );
    const opponentBishopKnights = pieces.filter(
      (piece) =>
        this._isEnemyPiece(piece) &&
        (this._isBishop(piece) || this._isKnight(piece))
    );

    return (
      pawns.length === 0 &&
      rooks.length === 0 &&
      queens.length === 0 &&
      yourBishopKnights.length <= 1 &&
      opponentBishopKnights.length <= 1
    );
  }

  _isThreefoldRepetition() {
    return false; // not implemented
  }

  _isFiftyMoveRule() {
    return false; // not implemented
    // return this._halfMove >= 100;
  }

  isCheckmate() {
    return (
      this._isInCheck &&
      Object.values(this._legalMoves).every((m) => m.length === 0)
    );
  }

  _checkGameOver() {
    if (this.isCheckmate()) {
      this._isEnded = true;
      this._winner = this._turn;
      console.log(`Checkmate! ${this._winner} wins!`);
    } else if (this.isDraw()) {
      this._isEnded = true;
      this._winner = null;
      console.log("Draw!");
    } else {
      this._checkKingsExistence();
    }
  }

  _checkKingsExistence() {
    // handle cases where kings are captured due to global castling or exploding pawn
    const numKingsAlive = this._board
      .flat()
      .filter((piece) => this._isKing(piece));
    if (numKingsAlive.length === 0) {
      this._isEnded = true;
      this._winner = null;
      console.log("Draw! (no kings)");
    } else if (numKingsAlive.length === 1) {
      const king = numKingsAlive[0];
      if (this._isSameSide(king)) {
        this._isEnded = true;
        this._winner = this._side;
      } else {
        this._isEnded = true;
        this._winner = this._side === WHITE ? BLACK : WHITE;
      }
    }
  }

  _isBlockableSquare(row, col) {
    if (!this._isInCheck) return true; // for safety
    return this._blockableSquares.some(([r, c]) => r === row && c === col);
  }

  _getBlockableSquares(checkRow, checkCol) {
    // return squares that can block the check from [checkRow, checkCol]
    const checkingPiece = this.getPiece(checkRow, checkCol);
    if (!checkingPiece) return [];
    const [kingRow, kingCol] = this._findKing();
    if (!kingRow || !kingCol) return []; // return empty (in case king exploded)
    const blockableSquares = [[checkRow, checkCol]];
    let directions = [];
    if (this._isPawn(checkingPiece) || this._isKnight(checkingPiece)) {
      return blockableSquares;
    } else if (this._isBishop(checkingPiece)) {
      directions = this._getBishopDirections();
    } else if (this._isRook(checkingPiece)) {
      directions = this._getRookDirections();
    } else if (this._isQueen(checkingPiece)) {
      directions = this._getQueenDirections();
    }

    for (const [dx, dy] of directions) {
      const squaresInDirection = [];
      let currRow = checkRow + dx;
      let currCol = checkCol + dy;
      while (currRow >= 0 && currRow <= 7 && currCol >= 0 && currCol <= 7) {
        if (currRow === kingRow && currCol === kingCol) {
          blockableSquares.push(...squaresInDirection);
          break;
        }
        // stop looking in this direction if hit non-king piece
        if (!this._isEmptySquare(currRow, currCol)) break;

        squaresInDirection.push([currRow, currCol]);

        currRow += dx;
        currCol += dy;
      }
    }
    return blockableSquares;
  }

  copy() {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }

  isSameTurn(turn) {
    return this._turn === turn;
  }

  _getRookDirections() {
    return [
      [-1, 0], // up
      [1, 0], // down
      [0, -1], // left
      [0, 1], // right
    ];
  }

  _getKnightDirections() {
    return [
      [-2, -1], // up left
      [-2, 1], // up right
      [-1, -2], // left up
      [-1, 2], // right up
      [1, -2], // left down
      [1, 2], // right down
      [2, -1], // down left
      [2, 1], // down right
    ];
  }

  _getBishopDirections() {
    return [
      [-1, -1], // up left
      [-1, 1], // up right
      [1, -1], // down left
      [1, 1], // down right
    ];
  }

  _getQueenDirections() {
    return this._getRookDirections().concat(this._getBishopDirections());
  }

  _getKingDirections() {
    return this._getRookDirections().concat(this._getBishopDirections());
  }

  getEmptySquares() {
    const emptySquares = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this._isEmptySquare(row, col)) {
          emptySquares.push([row, col]);
        }
      }
    }
    return emptySquares;
  }

  randomizeDuckPosition() {
    // return random empty square in the form [row, col]
    const [newRow, newCol] = this.getRandomEmptySquare();
    this._removeDuck();
    this.add(newRow, newCol, DUCK);

    return [newRow, newCol];
  }

  getRandomEmptySquare() {
    const emptySquares = this.getEmptySquares();
    return emptySquares[Math.floor(Math.random() * emptySquares.length)];
  }

  _findDuck() {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this._isDuckPiece(this.getPiece(row, col))) {
          return [row, col];
        }
      }
    }
    return null; // return null if can't find duck
  }

  _removeDuck() {
    const duckPosition = this._findDuck();
    if (duckPosition) {
      this.remove(duckPosition[0], duckPosition[1]);
    }
  }

  voteDuck(row, col) {
    if (this.gameMode !== GAME_MODE.POWER_UP_DUCK) return;
    this._removeDuck();
    this.add(row, col, DUCK);
    this._updateAfterOthersMove();
    this._checkGameOver();
  }

  _getAttackedSquares(fromRow, fromCol) {
    // return squares that piece from [fromRow, fromCol] can attack
    const piece = this.getPiece(fromRow, fromCol);
    if (!this._isEnemyPiece(piece)) return [];

    const attackingSide = this._side === WHITE ? BLACK : WHITE;
    const attackedSquares = [];

    if (this._isPawn(piece)) {
      const direction = attackingSide === WHITE ? -1 : 1;
      attackedSquares.push([fromRow + direction, fromCol - 1]);
      attackedSquares.push([fromRow + direction, fromCol + 1]);
    } else if (this._isKnight(piece)) {
      const knightMoves = this._getKnightDirections();
      for (const [dx, dy] of knightMoves) {
        const newRow = this._isEvolvedPiece(piece)
          ? (fromRow + dx) % 8
          : fromRow + dx;
        const newCol = this._isEvolvedPiece(piece)
          ? (fromCol + dy) % 8
          : fromCol + dy;

        if (newRow >= 0 && newRow <= 7 && newCol >= 0 && newCol <= 7) {
          attackedSquares.push([newRow, newCol]);
        }
      }
    } else if (
      this._isRook(piece) ||
      this._isBishop(piece) ||
      this._isQueen(piece)
    ) {
      let directions;
      if (this._isRook(piece)) {
        directions = this._getRookDirections();
      } else if (this._isBishop(piece)) {
        directions = this._getBishopDirections();
      } else if (this._isQueen(piece)) {
        directions = this._getQueenDirections();
      }
      for (const [dx, dy] of directions) {
        let currRow = fromRow + dx;
        let currCol = fromCol + dy;
        while (currRow >= 0 && currRow <= 7 && currCol >= 0 && currCol <= 7) {
          attackedSquares.push([currRow, currCol]);
          if (this.getPiece(currRow, currCol) !== null) break;
          currRow += dx;
          currCol += dy;
        }
      }
    } else if (this._isKing(piece)) {
      const kingMoves = this._getKingDirections();
      for (const [dx, dy] of kingMoves) {
        const newRow = fromRow + dx;
        const newCol = fromCol + dy;
        if (newRow >= 0 && newRow <= 7 && newCol >= 0 && newCol <= 7) {
          attackedSquares.push([newRow, newCol]);
        }
      }
    }
    return attackedSquares;
  }

  _updateAttackedSquares() {
    const [kingRow, kingCol] = this._findKing();
    if (!kingRow || !kingCol) return; // return if king is exploded
    this._checkingSquares = [];
    const allAttackedSquares = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this._isEnemyPiece(this.getPiece(row, col))) {
          const attackedSquares = this._getAttackedSquares(row, col);
          allAttackedSquares.push(...attackedSquares);
          if (
            attackedSquares.some(([r, c]) => r === kingRow && c === kingCol)
          ) {
            this._checkingSquares.push([row, col]);
          }
        }
      }
    }
    // filter duplicates
    this._attackedSquares = [
      ...new Set(allAttackedSquares.map(JSON.stringify)),
    ].map(JSON.parse);
    return this._attackedSquares;
  }

  _updateBlockableSquares() {
    const blockableSquares = [];
    for (const [row, col] of this._checkingSquares) {
      blockableSquares.push(...this._getBlockableSquares(row, col));
    }
    // filter duplicates
    this._blockableSquares = [
      ...new Set(blockableSquares.map(JSON.stringify)),
    ].map(JSON.parse);
    return this._blockableSquares;
  }

  _updateIsInCheck() {
    const [row, col] = this._findKing();
    if (!row || !col) return; // return if king is exploded
    this._isInCheck = this._isSquareUnderAttack(row, col);
    return this._isInCheck;
  }

  _findKing() {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.getPiece(row, col);
        if (this._isKing(piece) && this._isSameSide(piece)) {
          return [row, col];
        }
      }
    }
    return [null, null];
  }

  _findPiece(symbol) {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.getPiece(row, col) === symbol) {
          return [row, col];
        }
      }
    }
  }

  _isEnemyPiece(piece) {
    return piece && !this._isDuckPiece(piece) && !this._isSameSide(piece);
  }

  _isSameSide(piece) {
    return piece && !this._isDuckPiece(piece) && this._side === WHITE
      ? piece === piece.toLowerCase()
      : piece === piece.toUpperCase();
  }

  _isDuckPiece(piece) {
    return piece && piece === DUCK;
  }

  _updatePinnedSquares() {
    const [row, col] = this._findKing();
    if (!row || !col) return; // return if king is exploded
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
          if (
            (this._isEnemyPiece(piece) || this._isDuckPiece(piece)) &&
            counter === 1
          ) {
            if (
              ((this._isQueen(piece) || this._isRook(piece)) && // if pinned in vertical/horizontal directions
                (dx + dy) * (dx + dy) === 1) ||
              ((this._isQueen(piece) || this._isBishop(piece)) && // if pinned in diagonal directions
                (dx + dy) * (dx + dy) !== 1)
            ) {
              pinnedSquares[pinnedPiece] = [dx, dy];
            }
            break;
          } else if (this._isSameSide(piece) && counter === 0) {
            counter++;
            pinnedPiece = this._hash(currRow, currCol);
          }
        }
        currRow += dx;
        currCol += dy;
      }
    }
    this._pinnedDirections = pinnedSquares;
    return this._pinnedDirections;
  }

  add(row, col, piece) {
    this._board[row][col] = piece;
  }

  remove(row, col) {
    this._board[row][col] = null;
  }

  _move(fromRow, fromCol, toRow, toCol, promotionPiece) {
    const piece = this.getPiece(fromRow, fromCol);
    const moveInfo = this._getMoveInfo(piece, fromRow, fromCol, toRow, toCol); // obtain info before board changes
    const autoPromotion = this._checkAutoPromotion(piece, toRow, toCol);
    this.add(
      toRow,
      toCol,
      promotionPiece ? promotionPiece : autoPromotion ? autoPromotion : piece
    );
    this.remove(fromRow, fromCol);
    this._checkMoveCastle(piece, fromCol, toCol);
    this._checkMoveEnPassant(piece, toRow, toCol);
    this._checkMovePowerUpMode(fromRow, fromCol, toRow, toCol, moveInfo);
  }

  _checkAutoPromotion(piece, toRow, toCol) {
    if (this._isPawn(piece)) {
      const promotionRow = this._turn === WHITE ? 0 : 7;
      if (toRow === promotionRow) {
        return this._turn === WHITE ? "q" : "Q";
      }
    }
    return null;
  }

  _getMoveInfo(piece, fromRow, fromCol, toRow, toCol) {
    const info = {
      capturedPiece: null,
      isGlobalCastling: false,
    };
    const endPiece = this.getPiece(toRow, toCol);
    if (endPiece !== null) {
      info.capturedPiece = endPiece.toLowerCase();
    } else if (
      this._isPawn(piece) &&
      this._enPassantSquare &&
      toRow === this._enPassantSquare[0] &&
      toCol === this._enPassantSquare[1]
    ) {
      info.capturedPiece = "p";
    }

    if (this._isRook(piece) && this._isEvolvedPiece(piece)) {
      let standardRookMoves, globalCastleMoves;

      if (this._turn === this._side) {
        standardRookMoves = this._getStandardRookMoves(fromRow, fromCol);
        globalCastleMoves = this._getGlobalCastleMoves(fromRow, fromCol);
      } else {
        standardRookMoves = this._getOpponentStandardRookMoves(
          fromRow,
          fromCol
        );
        globalCastleMoves = this._getOpponentGlobalCastleMoves(
          fromRow,
          fromCol
        );
      }
      if (
        !standardRookMoves.some(([r, c]) => r === toRow && c === toCol) &&
        globalCastleMoves.some(([r, c]) => r === toRow && c === toCol)
      ) {
        info.isGlobalCastling = true;
      }
    }
    return info;
  }

  _checkMovePowerUpMode(initRow, initCol, finalRow, finalCol, moveInfo) {
    if (this._gameMode === GAME_MODE.POWER_UP_DUCK) {
      this._checkGlobalCastling(finalRow, finalCol, moveInfo); // Call order: 1
      this._checkPowerUpProgress(initRow, finalRow, finalCol, moveInfo); // Call order: 2
      this._checkBishopSniping(initRow, initCol, finalRow, finalCol, moveInfo); // Call order: 3
      this._checkKingResurrection(
        initRow,
        initCol,
        finalRow,
        finalCol,
        moveInfo
      ); // Call order: 3
      this._checkPawnExplosion(finalRow, finalCol, moveInfo); // Call order: 4
    }
  }

  _checkKingResurrection(initRow, initCol, finalRow, finalCol, moveInfo) {
    // king resurrect a piece that it just captures on its side
    const piece = this.getPiece(finalRow, finalCol);
    if (this._isKing(piece) && moveInfo.capturedPiece) {
      const resurrectedPiece =
        this._turn === WHITE
          ? moveInfo.capturedPiece.toLowerCase()
          : moveInfo.capturedPiece.toUpperCase();
      this.add(initRow, initCol, resurrectedPiece);
    }
  }

  _checkBishopSniping(initRow, initCol, finalRow, finalCol, moveInfo) {
    const piece = this.getPiece(finalRow, finalCol);
    if (
      this._isBishop(piece) &&
      this._isEvolvedPiece(piece) &&
      moveInfo.capturedPiece
    ) {
      this.remove(finalRow, finalCol);
      this.add(initRow, initCol, piece);
    }
  }

  _checkPawnExplosion(finalRow, finalCol, moveInfo) {
    if (
      moveInfo.capturedPiece &&
      this._isPawn(moveInfo.capturedPiece) &&
      this._isEvolvedPiece(moveInfo.capturedPiece)
    ) {
      this._explode(finalRow, finalCol);
    }
  }

  _explode(row, col) {
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
      const newRow = row + dx;
      const newCol = col + dy;
      if (newRow >= 0 && newRow <= 7 && newCol >= 0 && newCol <= 7) {
        this.remove(newRow, newCol);
      }
    }
    this.remove(row, col);
  }

  _checkGlobalCastling(finalRow, finalCol, moveInfo) {
    const piece = this.getPiece(finalRow, finalCol);
    if (moveInfo.isGlobalCastling) {
      this._decrementRookToken(piece, finalRow, finalCol);
    }
  }

  _checkPowerUpProgress(initRow, finalRow, finalCol, moveInfo) {
    const piece = this.getPiece(finalRow, finalCol);
    if (
      this._isPawn(piece) &&
      !this._isEvolvedPiece(piece) &&
      moveInfo.capturedPiece !== null
    ) {
      this._updatePawnEvolveProgress(piece, finalRow, finalCol);
    } else if (this._isKnight(piece) && !this._isEvolvedPiece(piece)) {
      this._updateKnightEvolveProgress(piece, finalRow, finalCol);
    } else if (
      this._isBishop(piece) &&
      !this._isEvolvedPiece(piece) &&
      moveInfo.capturedPiece !== null
    ) {
      this._updateBishopEvolveProgress(piece, initRow, finalRow, finalCol);
    } else if (this._isRook(piece) && moveInfo.capturedPiece !== null) {
      this._incrementRookToken(piece, finalRow, finalCol);
    }
  }

  _incrementRookToken(piece, row, col) {
    const newRook = piece + EVOLVE_SYMBOL;
    this.add(row, col, newRook);
  }

  _decrementRookToken(piece, row, col) {
    const newRook = piece.slice(0, -1);
    this.add(row, col, newRook);
  }

  _updatePawnEvolveProgress(piece, row, col) {
    const EVOLVE_THRESHOLD = 2;
    const newPawn = piece + PROGRESS_SYMBOL;
    this.add(row, col, newPawn);
    // if new piece has 3 progress symbols, evolve it
    if (newPawn.match(/\+/g).length === EVOLVE_THRESHOLD) {
      this._evolve(newPawn, row, col);
    }
  }

  _updateKnightEvolveProgress(piece, row, col) {
    const finalRow = this._turn === WHITE ? 0 : 7;
    if (row === finalRow) {
      this._evolve(piece, row, col);
    }
  }

  _updateBishopEvolveProgress(piece, fromRow, toRow, toCol) {
    const EVOLVE_THRESHOLD = 4;
    const rowDiff = Math.abs(fromRow - toRow);
    if (rowDiff >= EVOLVE_THRESHOLD) {
      this._evolve(piece, toRow, toCol);
    }
  }

  _evolve(piece, row, col) {
    const pieceSymbol = piece[0];
    this.add(row, col, pieceSymbol + EVOLVE_SYMBOL);
  }

  _isPawn(piece) {
    return piece && piece.toLowerCase().includes("p");
  }

  _isKnight(piece) {
    return piece && piece.toLowerCase().includes("n");
  }

  _isBishop(piece) {
    return piece && piece.toLowerCase().includes("b");
  }

  _isRook(piece) {
    return piece && piece.toLowerCase().includes("r");
  }

  _isKing(piece) {
    return piece && piece.toLowerCase() === "k";
  }

  _isQueen(piece) {
    return piece && piece.toLowerCase() === "q";
  }

  _isEvolvedPiece(piece) {
    return piece && piece.includes(EVOLVE_SYMBOL);
  }

  _checkMoveCastle(piece, fromCol, toCol) {
    if (this._isKing(piece) && Math.abs(toCol - fromCol) === 2) {
      const row = this._turn === WHITE ? 7 : 0;
      const kingSymbol = this._turn === WHITE ? "k" : "K";
      const rookSymbol = this._turn === WHITE ? "r" : "R";
      const rookFromCol = toCol === 6 ? 7 : 0;
      const rookToCol = toCol === 6 ? 5 : 3;
      this.remove(row, fromCol);
      this.add(row, toCol, kingSymbol);
      this.remove(row, rookFromCol);
      this.add(row, rookToCol, rookSymbol);
    }
  }

  _checkMoveEnPassant(piece, toRow, toCol) {
    if (
      this._isPawn(piece) &&
      this._enPassantSquare &&
      toRow === this._enPassantSquare[0] &&
      toCol === this._enPassantSquare[1]
    ) {
      this.remove(toRow + (this._turn === WHITE ? 1 : -1), toCol);
    }
  }

  playOpponentMove(move) {
    const { fromRow, fromCol, toRow, toCol, promotionPiece = null } = move;
    const piece = this.getPiece(fromRow, fromCol);
    if (piece === null) {
      console.error("move null???");
      return;
    }
    if (this._side === this._turn) {
      console.error("calling playOpponentMove() when it's your turn??");
      return;
    }
    // this._preUpdateHalfMove(piece, toRow, toCol);

    this._move(fromRow, fromCol, toRow, toCol, promotionPiece);
    this._updateEnPassant(piece, fromRow, fromCol, toRow);
    this._updateCastlingRights(piece, fromRow, fromCol);

    this._updateAfterOthersMove();

    // DEBUG STUFF ----------------
    console.log(`turn: ${this._turn}`);
    this.printStates();
    // ----------------

    if (this._turn === BLACK) {
      this._fullMove++;
    }

    this._checkGameOver();

    this._turn = this._turn === WHITE ? BLACK : WHITE;
  }

  _updateAfterOthersMove() {
    // call after an opponent's move or duck vote
    this._updateAttackedSquares(); // Call order: 1
    this._updateIsInCheck(); // Call order: 2
    this._updateBlockableSquares(); // Call order: 3
    this._updatePinnedSquares(); // Call order: 3
    this._updateLegalMoves(); // Call order: 4
  }
  playYourMove(move) {
    const { fromRow, fromCol, toRow, toCol, promotionPiece = null } = move;
    const piece = this.getPiece(fromRow, fromCol);
    if (piece === null) {
      console.error("move null???");
      return;
    }

    if (this._side !== this._turn) {
      console.error("calling playYourMove() when it's not your turn??");
      return;
    }

    // this._preUpdateHalfMove(piece, toRow, toCol);
    this._move(fromRow, fromCol, toRow, toCol, promotionPiece);
    this._updateEnPassant(piece, fromRow, fromCol, toRow);
    this._updateCastlingRights(piece, fromRow, fromCol);

    // DEBUG STUFF ----------------
    console.log(`turn: ${this._turn}`);
    this.printBoard();
    // ----------------

    if (this._turn === BLACK) {
      this._fullMove++;
    }

    this._turn = this._turn === WHITE ? BLACK : WHITE;
  }

  _preUpdateHalfMove(piece, toRow, toCol) {
    // check for capturing or pawn movement
    if (this._isPawn(piece) || !this._isEmptySquare(toRow, toCol)) {
      this._halfMove = 0;
    } else {
      this._halfMove++;
    }
  }

  _updateCastlingRights(piece, fromRow, fromCol) {
    if (this._isKing(piece)) {
      this._castlingRights[this._turn] = [];
    } else if (this._isRook(piece)) {
      const staringRow = this._turn === WHITE ? 7 : 0;
      if (fromCol === 0 && fromRow === staringRow) {
        this._castlingRights[this._turn] = this._castlingRights[
          this._turn
        ].filter((right) => right !== QUEEN_SIDE_CASTLE);
      } else if (fromCol === 7 && fromRow === staringRow) {
        this._castlingRights[this._turn] = this._castlingRights[
          this._turn
        ].filter((right) => right !== KING_SIDE_CASTLE);
      }
    }
  }

  _updateEnPassant(piece, fromRow, fromCol, toRow) {
    // update en passant square (if applicable)
    if (this._isPawn(piece) && Math.abs(toRow - fromRow) === 2) {
      this._enPassantSquare = [(fromRow + toRow) / 2, fromCol];
    } else {
      this._enPassantSquare = null;
    }
    return this._enPassantSquare;
  }

  isLegalMove(move) {
    const { fromRow, fromCol, toRow, toCol } = move;
    const piece = this.getPiece(fromRow, fromCol);
    if (piece === null) return false;
    console.log(this._legalMoves, this._turn);
    return this._legalMoves[this._hash(fromRow, fromCol)].some(
      ([r, c]) => r === toRow && c === toCol
    );
  }

  getPiece(row, col) {
    return this._board[row][col];
  }

  _checkPinMovement(fromRow, fromCol, new_direction_x, new_direction_y) {
    /* 
      limit_x is pinned direction for row, limit_y is pinned direction for col 
      return true if piece is not pinned or new direction is same as pinned direction
    */
    let limit_x, limit_y;
    if (this._isPinnedSquare(fromRow, fromCol)) {
      [limit_x, limit_y] = this._getPinnedDirections(fromRow, fromCol);
    }
    if (
      !(limit_x || limit_y) ||
      (limit_x === new_direction_x && limit_y === new_direction_y)
    )
      return true;
    return false;
  }

  _isEmptySquare(row, col) {
    return this.getPiece(row, col) === null;
  }

  _getPawnMoves(fromRow, fromCol) {
    const possibleMoves = [];
    const direction = this._side === WHITE ? -1 : 1;
    const startRow = this._side === WHITE ? 6 : 1;
    // check one square ahead
    if (
      this._isEmptySquare(fromRow + direction, fromCol) &&
      this._checkPinMovement(fromRow, fromCol, direction, 0) &&
      (!this._isInCheck ||
        this._isBlockableSquare(fromRow + direction, fromCol))
    ) {
      possibleMoves.push([fromRow + direction, fromCol]);
    }
    // check two squares ahead if pawn is at starting position
    if (
      fromRow === startRow &&
      this._isEmptySquare(fromRow + 2 * direction, fromCol) &&
      this._isEmptySquare(fromRow + direction, fromCol) &&
      this._checkPinMovement(fromRow, fromCol, direction, 0) &&
      (!this._isInCheck ||
        this._isBlockableSquare(fromRow + 2 * direction, fromCol))
    ) {
      possibleMoves.push([fromRow + 2 * direction, fromCol]);
    }
    // check diagonal squares for capturing
    if (
      this._isEnemyPiece(this.getPiece(fromRow + direction, fromCol - 1)) &&
      this._checkPinMovement(fromRow, fromCol, direction, -1) &&
      (!this._isInCheck ||
        this._isBlockableSquare(fromRow + direction, fromCol - 1))
    ) {
      possibleMoves.push([fromRow + direction, fromCol - 1]);
    }
    if (
      this._isEnemyPiece(this.getPiece(fromRow + direction, fromCol + 1)) &&
      this._checkPinMovement(fromRow, fromCol, direction, 1) &&
      (!this._isInCheck ||
        this._isBlockableSquare(fromRow + direction, fromCol + 1))
    ) {
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
            fromRow,
            fromCol,
            direction,
            enPassantCol - fromCol
          ) &&
          (!this._isInCheck ||
            this._isBlockableSquare(enPassantRow, enPassantCol))
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
      [limit_x, limit_y] = this._getPinnedDirections(fromRow, fromCol);
    }
    const isPinned = limit_x || limit_y;
    const knightMoves = this._getKnightDirections();
    for (const [dx, dy] of knightMoves) {
      const newRow = this._isEvolvedPiece(this.getPiece(fromRow, fromCol))
        ? (fromRow + dx) % 8 < 0
          ? 8 + ((fromRow + dx) % 8)
          : (fromRow + dx) % 8
        : fromRow + dx;
      const newCol = this._isEvolvedPiece(this.getPiece(fromRow, fromCol))
        ? (fromCol + dy) % 8 < 0
          ? 8 + ((fromCol + dy) % 8)
          : (fromCol + dy) % 8
        : fromCol + dy;
      if (newRow >= 0 && newRow <= 7 && newCol >= 0 && newCol <= 7) {
        if (
          (this._isEmptySquare(newRow, newCol) ||
            this._isEnemyPiece(this.getPiece(newRow, newCol))) &&
          !isPinned &&
          (!this._isInCheck || this._isBlockableSquare(newRow, newCol))
        ) {
          possibleMoves.push([newRow, newCol]);
        }
      }
    }
    return possibleMoves;
  }
  _isPinnedSquare(row, col) {
    return (
      this._pinnedDirections && this._pinnedDirections[this._hash(row, col)]
    );
  }

  _getPinnedDirections(row, col) {
    return this._pinnedDirections[this._hash(row, col)];
  }

  _getGlobalCastleMoves(fromRow, fromCol) {
    const possibleMoves = [];
    const piece = this.getPiece(fromRow, fromCol);

    if (
      this._isRook(piece) &&
      this._isEvolvedPiece(piece) &&
      this._isSameSide(piece)
    ) {
      const [kingRow, kingCol] = this._findKing();
      const kingDirections = this._getKingDirections();

      for (const [dx, dy] of kingDirections) {
        const newRow = kingRow + dx;
        const newCol = kingCol + dy;
        if (newRow >= 0 && newRow <= 7 && newCol >= 0 && newCol <= 7) {
          if (
            this._isEmptySquare(newRow, newCol) ||
            this._isEnemyPiece(this.getPiece(newRow, newCol))
          )
            possibleMoves.push([newRow, newCol]);
        }
      }
    }
    return possibleMoves;
  }

  _getOpponentGlobalCastleMoves(fromRow, fromCol) {
    const possibleMoves = [];
    const piece = this.getPiece(fromRow, fromCol);

    if (
      this._isRook(piece) &&
      this._isEvolvedPiece(piece) &&
      this._isEnemyPiece(piece)
    ) {
      const opponentKingSymbol = this._side === WHITE ? "K" : "k";
      const [kingRow, kingCol] = this._findPiece(opponentKingSymbol);
      const kingDirections = this._getKingDirections();

      for (const [dx, dy] of kingDirections) {
        const newRow = kingRow + dx;
        const newCol = kingCol + dy;
        if (newRow >= 0 && newRow <= 7 && newCol >= 0 && newCol <= 7) {
          if (
            this._isEmptySquare(newRow, newCol) ||
            this._isSameSide(this.getPiece(newRow, newCol))
          )
            possibleMoves.push([newRow, newCol]);
        }
      }
    }
    return possibleMoves;
  }

  _getRookMoves(fromRow, fromCol) {
    const possibleMoves = this._getStandardRookMoves(fromRow, fromCol);
    const globalCastleMoves = this._getGlobalCastleMoves(fromRow, fromCol);
    for (const move of globalCastleMoves) {
      if (!possibleMoves.some(([r, c]) => r === move[0] && c === move[1])) {
        possibleMoves.push(move);
      }
    }
    return possibleMoves;
  }

  _getStandardRookMoves(fromRow, fromCol) {
    const possibleMoves = [];
    const rookDirections = this._getRookDirections();
    for (const [dx, dy] of rookDirections) {
      let currRow = fromRow + dx;
      let currCol = fromCol + dy;
      while (currRow >= 0 && currRow <= 7 && currCol >= 0 && currCol <= 7) {
        if (this._checkPinMovement(fromRow, fromCol, dx, dy)) {
          if (this._isEmptySquare(currRow, currCol)) {
            if (!this._isInCheck || this._isBlockableSquare(currRow, currCol))
              possibleMoves.push([currRow, currCol]);
          } else {
            if (
              this._isEnemyPiece(this.getPiece(currRow, currCol)) &&
              (!this._isInCheck || this._isBlockableSquare(currRow, currCol))
            )
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

  _getOpponentStandardRookMoves(fromRow, fromCol) {
    const possibleMoves = [];
    const rookDirections = this._getRookDirections();
    for (const [dx, dy] of rookDirections) {
      let currRow = fromRow + dx;
      let currCol = fromCol + dy;
      while (currRow >= 0 && currRow <= 7 && currCol >= 0 && currCol <= 7) {
        if (this._isEmptySquare(currRow, currCol)) {
          possibleMoves.push([currRow, currCol]);
        } else {
          if (this._isSameSide(this.getPiece(currRow, currCol))) {
            possibleMoves.push([currRow, currCol]);
          }
          break;
        }
        currRow += dx;
        currCol += dy;
      }
    }
    return possibleMoves;
  }

  _getBishopMoves(fromRow, fromCol) {
    const possibleMoves = [];
    const bishopDirections = this._getBishopDirections();
    for (const [dx, dy] of bishopDirections) {
      let currRow = fromRow + dx;
      let currCol = fromCol + dy;
      while (currRow >= 0 && currRow <= 7 && currCol >= 0 && currCol <= 7) {
        if (this._checkPinMovement(fromRow, fromCol, dx, dy)) {
          if (
            this._isEmptySquare(currRow, currCol) &&
            (!this._isInCheck || this._isBlockableSquare(currRow, currCol))
          ) {
            possibleMoves.push([currRow, currCol]);
          } else {
            if (
              this._isEnemyPiece(this.getPiece(currRow, currCol)) &&
              (!this._isInCheck || this._isBlockableSquare(currRow, currCol))
            )
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
      this._getStandardRookMoves(fromRow, fromCol)
    );
  }
  _isSquareUnderAttack(row, col) {
    return this._attackedSquares.some(([r, c]) => r === row && c === col);
  }
  _getKingMoves(fromRow, fromCol) {
    const possibleMoves = [];
    const kingMoves = this._getKingDirections();
    for (const [dx, dy] of kingMoves) {
      const newRow = fromRow + dx;
      const newCol = fromCol + dy;
      if (newRow >= 0 && newRow <= 7 && newCol >= 0 && newCol <= 7) {
        if (this._isSquareUnderAttack(newRow, newCol)) continue;

        if (
          this._isEmptySquare(newRow, newCol) ||
          this._isEnemyPiece(this.getPiece(newRow, newCol))
        )
          possibleMoves.push([newRow, newCol]);
      }
    }

    // castling moves
    const startingRow = this._side === WHITE ? 7 : 0;
    if (fromRow === startingRow && fromCol === 4) {
      if (this._castlingRights[this._side].includes(KING_SIDE_CASTLE)) {
        if (
          this._isEmptySquare(startingRow, 5) &&
          this._isEmptySquare(startingRow, 6) &&
          !this._isSquareUnderAttack(startingRow, 5) &&
          !this._isSquareUnderAttack(startingRow, 6)
        )
          possibleMoves.push([startingRow, 6]);
      }
      if (this._castlingRights[this._side].includes(QUEEN_SIDE_CASTLE)) {
        if (
          this._isEmptySquare(startingRow, 3) &&
          this._isEmptySquare(startingRow, 2) &&
          this._isEmptySquare(startingRow, 1) &&
          !this._isSquareUnderAttack(startingRow, 3) &&
          !this._isSquareUnderAttack(startingRow, 2) &&
          !this._isSquareUnderAttack(startingRow, 1)
        )
          possibleMoves.push([startingRow, 2]);
      }
    }
    return possibleMoves;
  }

  _getLegalMoves(row, col) {
    const piece = this.getPiece(row, col);
    if (piece === null) return [];

    if (this._isPawn(piece)) {
      return this._getPawnMoves(row, col);
    } else if (this._isKnight(piece)) {
      return this._getKnightMoves(row, col);
    } else if (this._isBishop(piece)) {
      return this._getBishopMoves(row, col);
    } else if (this._isRook(piece)) {
      return this._getRookMoves(row, col);
    } else if (this._isQueen(piece)) {
      return this._getQueenMoves(row, col);
    } else if (this._isKing(piece)) {
      return this._getKingMoves(row, col);
    } else {
      console.warn("piece not implemented??");
      return [];
    }
  }

  _updateLegalMoves() {
    this._legalMoves = {};
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.getPiece(row, col);
        if (piece && this._isSameSide(piece)) {
          const moves = this._getLegalMoves(row, col);
          this._legalMoves[this._hash(row, col)] = moves;
        }
      }
    }
    return this._legalMoves;
  }

  _hash(row, col) {
    // use this to get key for dictionary since they don't work well with arrays being keys
    return row * 10 + col;
  }

  // print functions ----------------

  printStates() {
    console.log("board ----------------");
    this.printBoard();
    console.log("\n");

    console.log("highlight checking pieces (X) ----------------");
    this.printCheckingSquares();
    console.log("\n");

    console.log("highlight attacked squares (!) ----------------");
    this.printAttackedSquares();

    console.log("highlight blockable squares (^) ----------------");
    this.printBlockableSquares();
  }

  printBoard() {
    const prettyBoard = this._board
      .map((row) =>
        row.map((piece) => (piece === null ? "| |" : `|${piece}|`)).join("")
      )
      .join("\n");
    console.log(prettyBoard);
  }

  printCheckingSquares() {
    const prettyBoard = this._board
      .map((row, i) => {
        return row
          .map((piece, j) => {
            if (this._checkingSquares.some(([r, c]) => r === i && c === j))
              return `|X|`;
            return piece === null ? "| |" : `|${piece}|`;
          })
          .join("");
      })
      .join("\n");
    console.log(prettyBoard);
  }

  printAttackedSquares() {
    const prettyBoard = this._board
      .map((row, i) => {
        return row
          .map((piece, j) => {
            if (this._attackedSquares.some(([r, c]) => r === i && c === j))
              return `|!|`;
            return piece === null ? "| |" : `|${piece}|`;
          })
          .join("");
      })
      .join("\n");
    console.log(prettyBoard);
  }

  printPinnedDirections(row, col) {
    const pinnedDirection = this._pinnedDirections[this._hash(row, col)];
    if (!pinnedDirection) {
      console.log("not pinned");
      return;
    }
    const pinnedRow = row + pinnedDirection[0];
    const pinnedCol = col + pinnedDirection[1];
    const prettyBoard = this._board
      .map((row, i) => {
        return row
          .map((piece, j) => {
            if (i === pinnedRow && j === pinnedCol) return `|*|`;
            return piece === null ? "| |" : `|${piece}|`;
          })
          .join("");
      })
      .join("\n");
    console.log(prettyBoard);
  }

  printLegalMoves(row, col) {
    const moves = this._legalMoves[this._hash(row, col)];
    const prettyBoard = this._board
      .map((row, i) => {
        return row
          .map((piece, j) => {
            if (moves.some(([r, c]) => r === i && c === j)) return `|*|`;
            return piece === null ? "| |" : `|${piece}|`;
          })
          .join("");
      })
      .join("\n");
    console.log(prettyBoard);
  }

  printBlockableSquares() {
    const prettyBoard = this._board
      .map((row, i) => {
        return row
          .map((piece, j) => {
            if (this._blockableSquares.some(([r, c]) => r === i && c === j))
              return `|^|`;
            return piece === null ? "| |" : `|${piece}|`;
          })
          .join("");
      })
      .join("\n");
    console.log(prettyBoard);
  }

  // print functions ----------------
}

var global = window;
global.Chessboard = Chessboard;
