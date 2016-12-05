import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>React Tic-tac-toe Game</h2>
        </div>
        <Game />
      </div>
    );
  }
}

/** Game entrance, contains Board and GameInfo component
 *  All states stay here
**/
class Game extends Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        positon: {x:null, y:null}
      }],
      xIsNext: true,
      winner: null,
      stepNumber: 0,
      winnerIndexs: Array(3).fill(null)
    };
  }

  calculateWinner(squares) {
    if (squares[0] && 
          ((squares[0] === squares[1] && squares[0] === squares[2]) ||
           (squares[0] === squares[3] && squares[0] === squares[6]) ||
           (squares[0] === squares[4] && squares[0] === squares[8]))) {
      if (squares[0] === squares[1] && squares[0] === squares[2])
        this.stateWinnerIndexs(0, 1, 2);
      else if (squares[0] === squares[3] && squares[0] === squares[6])
        this.stateWinnerIndexs(0, 3, 6);
      else
        this.stateWinnerIndexs(0, 4, 8);
      return squares[0];
    }
    if (squares[1] && squares[1] === squares[4] && squares[1] === squares[7]) {
      this.stateWinnerIndexs(1, 4, 7);
      return squares[1];
    }
    if (squares[2] && squares[2] === squares[5] && squares[2] === squares[8]) {
      this.stateWinnerIndexs(2, 5, 8);
      return squares[2];
    }
    if (squares[3] && squares[3] === squares[4] && squares[3] === squares[5]) {
      this.stateWinnerIndexs(3, 4, 5);
      return squares[3];
    }
    if (squares[6] && 
          ((squares[6] === squares[7] && squares[6] === squares[8]) || 
           (squares[6] === squares[4] && squares[6] === squares[2]))) {
      if (squares[6] === squares[7] && squares[6] === squares[8])
        this.stateWinnerIndexs(6, 7, 8);
      else
        this.stateWinnerIndexs(2, 4, 6);
      return squares[6];
    }
    return null;
  }

  stateWinnerIndexs(a, b, c) {
    this.setState({winnerIndexs: [a, b, c]});
  }

  /** Handle action when players click on the game board **/
  handleClick(index) {
    const history = this.state.history.slice(0, this.state.stepNumber+1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    if (this.state.winner || squares[index])
      return;
    squares[index] = this.state.xIsNext ? 'X' : 'O';
    const xIsNext = !this.state.xIsNext;
    const winner = this.calculateWinner(squares);

    let position = {};
    switch(index) {
      case 0: case 1: case 2:
        position.x = 1;
        position.y = index + 1;
        break;
      case 3: case 4: case 5:
        position.x = 2;
        position.y = index - 2;
        break;
      case 6: case 7: case 8:
        position.x = 3;
        position.y = index - 5;
        break;
      default:
        return null;
    }

    this.setState({
      history: history.concat([{squares: squares, position: position}]), 
      xIsNext: xIsNext,
      winner: winner,
      stepNumber: history.length,
    });
  }

  /** Handle action when players click on the game info list **/
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
      winner: this.calculateWinner(this.state.history[step].squares),
      winnerIndexs: Array(3).fill(null)
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    let gameStatus;
    if (this.state.winner) {
      gameStatus = 'Winner: ' + this.state.winner;
    } else {
      gameStatus = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div>
        <div className="game">
          <Board 
            squares={current.squares}
            winnerIndexs={this.state.winnerIndexs}
            onClick={(index) => this.handleClick(index)} />
          <GameInfo 
            gameStatus={gameStatus} 
            history={history}
            position={this.state.position}
            stepNumber={this.state.stepNumber}
            onClick={(move) => this.jumpTo(move)} />
        </div>
      </div>
    );
  }
}

/** To display the game status and history list **/
class GameInfo extends Component {
  listClassNames(index) {
    return index === this.props.stepNumber ? 'list-selected' : 'list';
  }

  /** Helper class for changing status header color **/
  getClassName(gameStatus) {
    return (gameStatus.includes("Winner") ? "status-header-winner" :
      "status-header-next");
  }

  render() {
    const moves = this.props.history.map((step, move) => {
      const desc = move ? 'Move # (' + step.position.x + ', ' + step.position.y
        + ')' : 'Game start';
      return (
        <li key={move}>
          <a href="#" className={this.listClassNames(move)}
            onClick={() => this.props.onClick(move)}>{desc}</a>
        </li>
      );
    });
      
    return (
      <div className="game-info" >
        <h2 className={this.getClassName(this.props.gameStatus)}>
          {this.props.gameStatus}
        </h2>
        <ol>{moves}</ol>
      </div>
    );
  }
}

/** Game board to play which contains 9 Square component **/
class Board extends Component {
  renderSquare(index) {
    return (
      <Square 
        value={this.props.squares[index]}
        index={index}
        key={index}
        winnerIndexs={this.props.winnerIndexs}
        onClick={() => this.props.onClick(index)}/>
    );
  }

  renderRow(row) {
    return (
      <div className="game-row" key={row}>
        {[row, row+1, row+2].map(i => this.renderSquare(i))}
      </div>
    );
  }

  render() {
    return (
      <div className="game-board">
        {[0, 3, 6].map(row => this.renderRow(row))}
      </div>
    );
  }
}

class Square extends Component {
  getClassName(index) {
    return "square " + 
      (this.props.winnerIndexs.indexOf(index) === -1 ? '' : "square-selected");
  }

  render() {
    return (
      <button 
        className={this.getClassName(this.props.index)}
        onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}

export default App;
