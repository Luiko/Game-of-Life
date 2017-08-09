import React, { Component } from 'react';

const clicked = { backgroundColor: 'grey', color: 'white' };

export function Board(props) {
  const { DIM } = props;
  let counter = 0;
  return (
    <div className="gameBoard">{
      props.board
        .map((block, index) => {
          const divNode = <div className="block"
            id={'block'+index}
            onClick={props.blockClick}>
          </div>;
          const divNodeClicked = <div className="block"
            id={'block'+index}
            onClick={props.blockClick}
            style={clicked}>
          </div>;
          return block? divNodeClicked : divNode;
        })
        .reduce((arr, element) => {
          if (arr[counter].length % DIM === 0) {
            arr.push([]);
            counter++;
          }
          arr[counter].push(element);
          return arr;
        },[[]])
        .map((line) => {
          return <div className="block-line">{line}</div>;
        })
    }</div>
  );
}

export function App(props) {
  return (
    <div className="container">
      <div className="bar">
        <div id="controls"> 
          <label htmlFor="sizeSelection">size</label>
          <select name="select" id="sizeSelection" onChange={props.changeSize}>
            <option value="64">64</option>
            <option value="48">48</option>
            <option value="32">32</option>
          </select>
          <button id="start" onClick={props.startClick}>start</button>
          <button id="clear" onClick={props.clearClick}>clear</button>
          <button id="stop" onClick={props.stopClick}>stop</button>
        </div>
        <div id="generation">{'generation: ' + props.generation}</div>
        <div id="fps">{'frame rate: ' + props.fps}</div>
      </div>
      {props.BoardComponent}
    </div>
  );
}

export default class AppContainer extends Component {
  constructor(props) {
    super(props);
    const defaultDIM = 64;
    this.state = {
      DIM: defaultDIM,
      board: this.generateRandomBoard(defaultDIM),
      fps: '0fps',
      time: 0,
      generation: 0,
      paused: true
    };
    this.getNextGeneration = this.getNextGeneration.bind(this);
    this.changeSize = this.changeSize.bind(this);
    this.blockClick = this.blockClick.bind(this);
  }

  generateRandomBoard(dim) {
    const length = dim * dim;
    const arr = [];
    for (let i = 0; i < length; i++) {
      const val = Math.random() < 0.25? true : false;
      arr.push(val);
    }
    return arr;
  }

  getNextGeneration() {
    const { DIM } = this.state;
    this.setState(prevState => {
      const _time = Date.now();
      const { generation, time } = prevState;
      const timeDifference = _time - time;
      const _rate = Math.min(timeDifference, 1000);
      const fps = 1000 / _rate;

      return {
        board: prevState.board.map((element, index, board) => {
          const x = index % DIM;
          const y = (index - x) / DIM | 0;
          const egde = DIM - 1;
          const borderTo = {
            top: y === 0,
            right: x === egde,
            bottom: y === egde,
            left: x === 0
          };
          const surroundings = [
            !borderTo.left && !borderTo.top? x - 1 + ((y - 1) * DIM)
            : !borderTo.left && borderTo.top? x - 1 + (egde * DIM)
            : borderTo.left && !borderTo.top? egde + ((y - 1) * DIM)
            : egde + (egde * DIM),
            borderTo.top? x + (egde * DIM)  : x + ((y - 1) * DIM),
            !borderTo.top && !borderTo.right? x + 1 + ((y - 1) * DIM)
            : !borderTo.top && borderTo.right? (y - 1) * DIM
            : borderTo.top && !borderTo.right? x + 1 + (egde * DIM)
            : egde * DIM,
            borderTo.left? egde + (y * DIM) : x - 1 + (y * DIM),
            borderTo.right? y * DIM : x + 1 + (y * DIM),
            !borderTo.left && !borderTo.bottom? x - 1 + ((y + 1) * DIM)
            : !borderTo.left && borderTo.bottom? x - 1
            : borderTo.left && !borderTo.bottom? egde + ((y + 1) * DIM)
            : egde,
            borderTo.bottom? x : x + ((y + 1) * DIM),
            !borderTo.bottom && !borderTo.right? x + 1 + ((y + 1) * DIM)
            : !borderTo.bottom && borderTo.right? (y + 1) * DIM
            : borderTo.bottom && !borderTo.right? x + 1
            : 0
          ];
          const alive = surroundings
          .reduce((count, index) => board[index]? count + 1 : count ,0);
          const born = !element && alive === 3;
          if (born) return true;
          const  goodLife = element && alive > 1 && alive < 4;
          if (goodLife) return true
          return false;
        }),
        fps: generation % 8 === 0?
          parseInt(fps) + 'fps'
          : prevState.fps,
        time: _time,
        generation: generation + 1
    }});
  }

  shouldComponentUpdate(_, nextState) {
    const boardIsDifferent = this.state.board.length !== nextState.board.length
      || this.state.board.reduce((val, element, index) => {
      return val || element !== nextState.board[index];
    }, false);
    return boardIsDifferent;
  }

  componentDidUpdate() {
    if (this.state.paused) return;
    const fullRerender = Date.now() - this.state.time;
    setTimeout(() => {
      requestAnimationFrame(this.getNextGeneration);
    }, fullRerender);
  }

  blockClick(prox) {
    if(!this.state.paused) return;
    this.tiempo = Date.now();
    const id = prox.target.id.slice(5);
    this.setState((prevState)=> ({
      board: prevState.board
        .map((element, index) => index == id? true : element)
    }));
  }

  changeSize(prox) {
    const { value } = prox.target;
    this.setState({
      generation: 0,
      time: 0,
      fps: '0fps',
      DIM: value,
      paused: true,
      board: this.generateRandomBoard(value)
    });
    if (this.state.paused) this.forceUpdate();
  }

  start() {
    this.setState({ paused: false });
    setTimeout(() => {
      requestAnimationFrame(this.getNextGeneration);
    }, 0);
  }

  clear() {
    this.setState((prevState) => {
      return {
        paused: true,
        board: prevState.board.map(() => false)
      };
    });
    if (this.state.paused) this.forceUpdate();
  }

  stop() {
    this.setState({ paused: true });
  }

  render() {
    return (
      <App changeSize={this.changeSize}
        startClick={() => this.start()}
        clearClick={() => this.clear()}
        stopClick={() => this.stop()}
        generation={this.state.generation}
        fps={this.state.fps}
        BoardComponent={<Board DIM={this.state.DIM} 
          board={this.state.board}
          blockClick={this.blockClick} 
        />}
      />
    );
  }
}
