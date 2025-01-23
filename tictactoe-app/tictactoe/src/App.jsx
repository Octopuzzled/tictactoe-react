import { useState } from 'react';
import PropTypes from 'prop-types';

function Square({ value, onSquareClick, isWinning }) {
  return (
    <button className={`square ${isWinning ? 'winning' : ''}`} 
      onClick={onSquareClick}>
      {value}
    </button>
  );
}

Square.propTypes = {
  value: PropTypes.string,
  onSquareClick: PropTypes.func.isRequired,
  isWinning: PropTypes.bool
};

function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares);
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    // Calculate and pass the row and col
    const row = Math.floor(i / 3);
    const col = i % 3;
    onPlay(nextSquares, row, col);
  }


function renderBoard() {
  const board = [];
  for (let i = 0; i < 3; i++) {
    const row = [];
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      row.push(
        <Square
          key={index}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
          isWinning={winner && winner.line.includes(index)}
        />
      );
    }
    board.push(<div key={i} className="board-row">{row}</div>);
  }
  return board;
}

let status;
if (winner) {
  status = 'Winner: ' + winner.winner;
} else if (squares.every((square) => square !== null)) {
  status = 'Draw';
} else {
  status = 'Next player: ' + (xIsNext ? 'X' : 'O');
}

  return (
    <>
      <h1>Tic Tac Toe</h1>
      <div className="status">{status}</div>
      <div className="game">
        {renderBoard()}
      </div>
    </>
  );
}

Board.propTypes = {
  xIsNext: PropTypes.bool.isRequired,
  squares: PropTypes.arrayOf(PropTypes.string),
  onPlay: PropTypes.func.isRequired
};

export default function Game() {
  const [history, setHistory] = useState([{squares: Array(9).fill(null), location: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;
  const [isAscending, setIsAscending] = useState(true);

  function handlePlay(nextSquares, row, col) {
    const nextHistory = [...history.slice(0, currentMove + 1), {squares: nextSquares, location: {row, col}}];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      const location = squares.location;
      if (move === currentMove) {
        description = `Currently move #${move} - You are at (${location.row}, ${location.col})`;
      } else {
        description = `Go to move #${move} - Move at (${location.row}, ${location.col})`;
        }
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  const orderedMoves = isAscending ? moves : moves.slice().reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => setIsAscending(!isAscending)}>
          {isAscending ? 'Sort Descending' : 'Sort Ascending'}
        </button>
        <ol>{orderedMoves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: [a, b, c],
      };
    }
  }
  return null;
}

calculateWinner.propTypes = {
  squares: PropTypes.arrayOf(PropTypes.string)
};
