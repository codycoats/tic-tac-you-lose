import React, { useReducer } from 'react';

const RADIO_GROUP_NAME = 'board' 
const BOARD_SIZE = 3;

const boardReducer = (state, action) => {
  const type = action.type;

  // User didn't say anything
  if(type === 'foo') {

  }

  // Add user's move
  const newState = state.map((cell, index) => {
    let result = cell;

    if(index === type) {
      result = 1;
    }

    return result;
  });

  // Add bot's move
  const stateWithBot = [...newState];
  for(let i = 0; i < stateWithBot.length; i++) {
    if(stateWithBot[i] === undefined) {
      stateWithBot[i] = -1;
      break;
    }
  }

  return stateWithBot;
}

const isWinningBoard = (board) => {
  const winningBoards = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,4,8],
    [2,4,6],
    [0,3,6],
    [1,4,7],
    [2,5,8]
  ];

  const found = winningBoards.find((winner) => {
    return winner.reduce((prev, current, index) => {
      return prev && board[index] === -1;
    })
  });

  return Boolean(found);
}

const INTIAL_BOARD = [-1, ...Array((BOARD_SIZE* BOARD_SIZE) -1)];

const Board = () => {
  const [boardState, dispatch] = useReducer(boardReducer, Array.apply(undefined, INTIAL_BOARD));

  const handleSubmit = (e) => {
    e.preventDefault();
    const { value } = e.target['board'];
    dispatch({type: parseInt(value, 10)}) 
  }

  // Detect boardState as 'won'
  if(isWinningBoard(boardState)) {
    return (<h1>You lose, told you!</h1>)
  }

  return (
    <>
    <form className="board" onSubmit={handleSubmit}>

      {boardState.map((cell, index) => {
        const id = `cell-${index}`;
        let cellMarkup;

        if(cell === 1) {
          cellMarkup = (
            <div className="board__cell board__cell--X" key={index}>
              <input type="radio" id={id} name={RADIO_GROUP_NAME} value={index} disabled />
              <label htmlFor={id}>❌</label>
            </div>
          );
        } else if( cell === -1) {
          cellMarkup = (
            <div className="board__cell board-cell--O" key={index}>
              <input type="radio" id={id} name={RADIO_GROUP_NAME} value={index} disabled />
              <label htmlFor={id}>⭕️</label>
            </div>
          );
        } else {
          cellMarkup = (
            <div className="board__cell" key={index}>
              <input type="radio" id={id} name={RADIO_GROUP_NAME} value={index}/>
              <label htmlFor={id}>🔲</label>
            </div>
          );
        }

        return cellMarkup;
      })}

      <button type="submit">
        Submit
      </button>
    </form>
    </>
  )
}

export default Board;