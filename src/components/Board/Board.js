import React, { useReducer } from 'react';

const RADIO_GROUP_NAME = 'board' 
const BOARD_SIZE = 3;

const boardReducer = (state, action) => {
  const type = action.type;

  console.log({type})
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

const Board = () => {
  const [boardState, dispatch] = useReducer(boardReducer, Array.apply(undefined, Array(BOARD_SIZE* BOARD_SIZE)));

  const handleSubmit = (e) => {
    e.preventDefault();
    const { value } = e.target['board'];
    console.log("handleSubmit", value)
    dispatch({type: parseInt(value, 10)}) 
  }

  // Detect boardState as 'won'

  return (
    <>
    <form className="board" onSubmit={handleSubmit}>

      {boardState.map((cell, index) => {
        const id = `cell-${index}`;
        let cellMarkup;
        console.log({cell})

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


      {/* <label htmlFor="top-left">
        Top left
      </label>
      <input type="radio" id="top-left" name={RADIO_GROUP_NAME} value="0"/>

      <label htmlFor="top-middle">
        Top middle
      </label>
      <input type="radio" id="top-middle" name={RADIO_GROUP_NAME} value="1"/>

      <label htmlFor="top-right">
        Top right
      </label>
      <input type="radio" id="top-right" name={RADIO_GROUP_NAME} value="2"/>

      <label htmlFor="middle-left">
        Middle left
      </label>
      <input type="radio" id="middle-left" name={RADIO_GROUP_NAME} value="3"/>

      <label htmlFor="center">
        Center
      </label>
      <input type="radio" id="center" name={RADIO_GROUP_NAME} value="4"/>

      <label htmlFor="middle-right">
        Middle right
      </label>
      <input type="radio" id="middle-right" name={RADIO_GROUP_NAME} value="5"/>

      <label htmlFor="bottom-left">
        Bottom left
      </label>
      <input type="radio" id="bottom-left" name={RADIO_GROUP_NAME} value="6"/>

      <label htmlFor="bottom-middle">
        Bottom middle
      </label>
      <input type="radio" id="bottom-middle" name={RADIO_GROUP_NAME} value="7"/>

      <label htmlFor="bottom-right">
        Bottom right
      </label>
      <input type="radio" id="bottom-right" name={RADIO_GROUP_NAME} value="8"/> */}

      <button type="submit">
        Submit
      </button>
    </form>
    </>
  )
}

export default Board;