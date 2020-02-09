import React, { useReducer } from 'react';

const RADIO_GROUP_NAME = 'board' 
const BOARD_SIZE = 3;

const BOT_VALUE = -1;
const PLAYER_VALUE = 1;

const CENTER = 4;
const CORNERS = [0, 2, 6, 8];
const SIDES = [1, 3, 5, 7];
const WINNING_BOARDS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,4,8],
  [2,4,6],
  [0,3,6],
  [1,4,7],
  [2,5,8]
];

// We start the intial board with the bot playing in top-left corner
// This could be randomized to be seem more "fair"
const INTIAL_BOARD = [BOT_VALUE, ...Array((BOARD_SIZE* BOARD_SIZE) - 1)];

const BOARD_REDUCER_ACTION_RESET = 'reset';

const boardReducer = (state, action) => {
  const type = action.type;

  if(type === BOARD_REDUCER_ACTION_RESET) {
    return [...INTIAL_BOARD];
  }

  if(Number.isNaN(type)) {
    return state;
  }

  // Add user's move
  const botMoves = [];
  const userMoves = [];
  const newState = state.map((cell, index) => {
    let result = cell;

    if(index === type) {
      result = PLAYER_VALUE;
      userMoves.push(index)
    } else if(cell === BOT_VALUE ) {
      botMoves.push(index);
    } else if ( cell === PLAYER_VALUE ) {
      userMoves.push(index)
    }

    return result;
  });

  // Add bot's move according to Newell & Simon's strategy https://en.wikipedia.org/wiki/Tic-tac-toe#Strategy
  const stateWithBot = [...newState];
  let newBotMove;

  // Check if there a potential win
  if(botMoves.length >= 2 && !newBotMove) {
    for(let i = 0; i < WINNING_BOARDS.length; i++) {
      const winningBoard = [...WINNING_BOARDS[i]];
  
      botMoves.forEach((value) => {
        const moveInBoard = winningBoard.indexOf(value);
  
        if(moveInBoard !== -1) {
          winningBoard.splice(moveInBoard, 1);
        }
      })
      
      if(winningBoard.length === 1 && stateWithBot[winningBoard[0]] === undefined) {
        newBotMove = winningBoard[0];
        break;
      }
    }
  } 

  // Block user from winning
  if(userMoves.length >= 2) {
    for(let i = 0; i < WINNING_BOARDS.length; i++) {
      const winningBoard = [...WINNING_BOARDS[i]];
  
      userMoves.forEach((value) => {
        const moveInBoard = winningBoard.indexOf(value);
  
        if(moveInBoard !== -1) {
          winningBoard.splice(moveInBoard, 1);
        }
      })
      
      if(winningBoard.length === 1 && stateWithBot[winningBoard[0]] === undefined) {
        newBotMove = winningBoard[0];
        break;
      }
    }
  }

  // Is the center available?
  if(!newBotMove && stateWithBot[CENTER] === undefined) {
    newBotMove = CENTER;
  }

  // Pick an opposite corner 
  if(!newBotMove) {
    const CORNER_OPPOSITES = {
      0: 8,
      2: 6,
      6: 2,
      8: 0
    };

    for(let i=0; i < CORNERS.length; i++) {
      let corner = stateWithBot[CORNERS[i]];
      if(corner === PLAYER_VALUE) {
        newBotMove = CORNER_OPPOSITES[corner];
        break;
      }
    }
  }
  
  // Otherwise pick an empty corner
  if(!newBotMove) {
    for(let i = 0; i < CORNERS.length; i++) {
      let corner = stateWithBot[CORNERS[i]];

      if(corner === undefined) {
        newBotMove = CORNERS[i];
        break;
      }
    }
  }

  // Lastly pick an empty side
  if(!newBotMove) {
    for(let i = 0; i < SIDES.length; i++) {
      let side = stateWithBot[SIDES[i]];

      if(side === undefined) {
        newBotMove = SIDES[i];
        break;
      }
    }
  }

  if(!newBotMove) {
    console.log("still haven't found a bot move")
  }

  stateWithBot[newBotMove] = BOT_VALUE;

  return stateWithBot;
}

const hasBotWon = (board) => {
  const found = WINNING_BOARDS.find((winner) => {
    return winner.reduce((prev, current, index) => {
      return prev && board[current] === BOT_VALUE;
    }, true)
  });

  return Boolean(found);
}

const INDEX_LABEL_MAPPING = {
  0: 'Top left',
  1: 'Top middle',
  2: 'Top right',
  3: 'Middle left',
  4: 'Center',
  5: 'Middle right',
  6: 'Bottom left',
  7: 'Bottom middle',
  8: 'Bottom right'
}

const Board = () => {
  const [boardState, dispatch] = useReducer(boardReducer, Array.apply(undefined, [...INTIAL_BOARD]));
  const handleSubmit = (e) => {
    e.preventDefault();
    const { value } = e.target[RADIO_GROUP_NAME];
    dispatch({type: parseInt(value, 10)}) 
  }
  const handleReset = (e) => {
    e.preventDefault();
    dispatch({type: BOARD_REDUCER_ACTION_RESET})
  }

  const winner = hasBotWon(boardState);
  const draw = !winner && boardState.indexOf(undefined) === -1;

  const hasUserPlayed = boardState.indexOf(PLAYER_VALUE) !== -1;

  return (
    <>
    {winner && <em>You lose, told you!</em>}
    {!hasUserPlayed && <em>You‘re go.</em>}
    {draw && <em>Fine, well at least I didn't lose.</em>}
    <form className="board" onSubmit={handleSubmit}>

      {boardState.map((cell, index) => {
        const id = `cell-${index}`;
        let cellMarkup;

        if(cell === PLAYER_VALUE) {
          cellMarkup = (
            <div className="board__cell board__cell--filled" key={index}>
              <input className="board__cell-control" type="radio" id={id} name={RADIO_GROUP_NAME} value={index} disabled />
              <label className="board__cell-label" htmlFor={id}>
                <span className="sr-only">{INDEX_LABEL_MAPPING[index]}</span>
                <span role="img" aria-label="O">⭕️</span>
              </label>
            </div>
          );
        } else if( cell === BOT_VALUE) {
          cellMarkup = (
            <div className="board__cell board__cell--filled" key={index}>
              <input className="board__cell-control" type="radio" id={id} name={RADIO_GROUP_NAME} value={index} disabled />
              <label className="board__cell-label" htmlFor={id}>
                <span className="sr-only">{INDEX_LABEL_MAPPING[index]}</span>
                <span role="img" aria-label="X">❌</span>
              </label>
            </div>
          );
        } else {
          cellMarkup = (
            <div className="board__cell" key={index}>
              <input className="board__cell-control" type="radio" id={id} name={RADIO_GROUP_NAME} value={index}/>
              <label className="board__cell-label" htmlFor={id}>
                <span className="sr-only">{INDEX_LABEL_MAPPING[index]}</span>
              </label>
            </div>
          );
        }

        return cellMarkup;
      })}

      <div className="board__actions">
        {(winner || draw) ? 
          <button className="action board__action" onClick={handleReset} type="reset">Lose again</button> :
          (
            <>
              {hasUserPlayed && <button className="action board__action" onClick={handleReset} type="reset">Give up!</button>}
              <button className="action board__action" type="submit">Submit</button> 
            </>
          )
        }
      </div>
    </form>
    </>
  )
}

export default Board;