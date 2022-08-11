//Game of Life React + Redux Implementation
//You may prefer to view the source here:  
//https://github.com/thepeted/game-of-life-redux

//CONSTANTS
const GRID_HEIGHT = 25;
const GRID_WIDTH = 40;

//REACT & REDUX LIBRARIES SET UP
const { Component } = React;
const { createStore, applyMiddleware } = Redux;
const { Provider } = ReactRedux;
const { connect } = ReactRedux;
const { combineReducers } = Redux;

//HELPERS - generate the gamestate by constructing 2d arrays
const makeGrid = (height, width, makeRandom = false) => {
  let grid = [];
  for (var i = 0; i < height; i++) {
    var row = [];
    for (var j = 0; j < width; j++) {
      let value;
      if (makeRandom) {
        value = Math.random() > 0.85;
      }
      row.push({
        status: value,
        newBorn: value });

    }
    grid.push(row);
  }
  return grid;
};

const advanceGrid = function (grid = []) {
  let gridHeight = grid.length;
  let gridWidth = grid[0].length;

  let calculateNeighbours = function (x, y) {
    //since the world is toroidal: if the cell is at the edge of the grid we
    //will reference the cell on the opposite edge
    let topRow = x - 1 < 0 ? gridHeight - 1 : x - 1;
    let bottomRow = x + 1 === gridHeight ? 0 : x + 1;
    let leftColumn = y - 1 < 0 ? gridWidth - 1 : y - 1;
    let rightColumn = y + 1 === gridWidth ? 0 : y + 1;

    let total = 0;
    total += grid[topRow][leftColumn].status;
    total += grid[topRow][y].status;
    total += grid[topRow][rightColumn].status;
    total += grid[x][leftColumn].status;
    total += grid[x][rightColumn].status;
    total += grid[bottomRow][leftColumn].status;
    total += grid[bottomRow][y].status;
    total += grid[bottomRow][rightColumn].status;

    return total;
  };
  //apply the rules of the game by comparing with the existing grid to build
  //a new array
  let gameState = [];
  for (let i = 0; i < gridHeight; i++) {
    let row = [];
    for (let j = 0; j < gridWidth; j++) {
      let cellIsAlive = grid[i][j].status;
      let neighbours = calculateNeighbours(i, j);
      if (cellIsAlive) {
        if (neighbours < 2) {
          row.push({ status: 0 });
        } else if (neighbours > 3) {
          row.push({ status: 0 });
        } else {
          row.push({ status: 1 });
        }
      }
      if (!cellIsAlive) {
        if (neighbours === 3) {
          row.push({
            status: 1,
            newBorn: true });

        } else {
          row.push({ status: 0 });
        }
      }
    }
    gameState.push(row);
  }
  return gameState;
};


//ACTIONS

function toggleAlive(x, y) {
  return {
    type: 'TOGGLE_ALIVE',
    x,
    y };

}

function makeRandomGrid() {
  return {
    type: 'MAKE_RANDOM' };

}

function tick() {
  return {
    type: 'TICK' };

}

function startPlaying(timerId) {
  return {
    type: 'PLAY',
    timerId };

}

function stopPlaying(timerId) {
  return {
    type: 'STOP',
    timerId };

}

function clear() {
  return {
    type: 'CLEAR' };

}

//COMPONENTS - 'dumb' functional components only receive props.  They don't need to dispatch actions nor to they care about the overall state of the app

const Button = ({ title, icon, handleClick }) => /*#__PURE__*/
React.createElement("span", { onClick: handleClick, className: "button" }, /*#__PURE__*/
React.createElement("i", { className: icon }), " ", title);



const Cell = ({ alive, newBorn, handleClick }) => /*#__PURE__*/
React.createElement("td", {
  onClick: handleClick,
  className: `${alive ? 'alive' : ''} ${newBorn ? 'new-born' : ''}` });




//CONTAINERS - define a React component and use React-Redux to connect up to the Redux store

class Board_ extends Component {
  render() {
    return /*#__PURE__*/(
      React.createElement("div", null, /*#__PURE__*/
      React.createElement("table", null, /*#__PURE__*/
      React.createElement("tbody", null,
      this.props.board.map((row, i) => /*#__PURE__*/
      React.createElement("tr", { key: i }, " ", row.map((cell, j) => /*#__PURE__*/
      React.createElement(Cell, {
        key: j,
        alive: cell.status,
        newBorn: cell.newBorn,
        handleClick: () => this.props.toggleAlive(i, j) }))))))));






  }}


const mapStateToProps_1 = ({ board }) => {
  return { board };
};

const mapDispatchToProps_1 = dispatch => {
  return { toggleAlive: (x, y) => dispatch(toggleAlive(x, y)) };
};

const Board = connect(mapStateToProps_1, mapDispatchToProps_1)(Board_);

//

class Control_ extends Component {
  componentDidMount() {
    this.props.random();
    this.togglePlay();
  }
  render() {
    return /*#__PURE__*/(
      React.createElement("div", { className: "controls" }, /*#__PURE__*/
      React.createElement("div", { className: "buttons" }, /*#__PURE__*/
      React.createElement(Button, {
        handleClick: () => this.props.random(),
        title: 'Randomise',
        icon: 'fa fa-random' }), /*#__PURE__*/

      React.createElement(Button, {
        handleClick: () => this.clear(),
        title: 'Clear',
        icon: 'fa fa-undo' }), /*#__PURE__*/

      React.createElement("div", { className: "button-group" }, /*#__PURE__*/
      React.createElement(Button, {
        icon: this.props.playState.isRunning ? 'fa fa-pause' : 'fa fa-play',
        handleClick: () => this.togglePlay() }), /*#__PURE__*/

      React.createElement(Button, {
        handleClick: () => this.props.tick(),
        icon: 'fa fa-step-forward' })))));





  }
  togglePlay() {
    if (this.props.playState.isRunning) {
      clearInterval(this.props.playState.timerId);
      this.props.stopPlaying();
    } else {
      let interval = setInterval(this.props.tick, 100);
      this.props.startPlaying(interval);
    }
  }
  clear() {
    if (this.props.playState.isRunning) {
      clearInterval(this.props.playState.timerId);
      this.props.stopPlaying();
    }
    this.props.clear();
  }}



const mapStateToProps_2 = ({ playState }) => {
  return { playState };
};

const mapDispatchToProps_2 = dispatch => {
  return {
    random: () => dispatch(makeRandomGrid()),
    tick: () => dispatch(tick()),
    startPlaying: timerId => dispatch(startPlaying(timerId)),
    stopPlaying: () => dispatch(stopPlaying()),
    clear: () => dispatch(clear()) };

};

const Control = connect(mapStateToProps_2, mapDispatchToProps_2)(Control_);

//

class Counter_ extends Component {
  render() {
    return /*#__PURE__*/(
      React.createElement("div", { className: "counter" }, "Generations: ",
      this.props.generations));


  }}


const mapStateToProps_3 = ({ counter }) => {
  return { generations: counter };
};

const Counter = connect(mapStateToProps_3)(Counter_);

//

const App = () => /*#__PURE__*/
React.createElement("div", null, /*#__PURE__*/
React.createElement("h1", null, "Game of Life"), /*#__PURE__*/
React.createElement(Board, null), /*#__PURE__*/
React.createElement(Control, null), /*#__PURE__*/
React.createElement(Counter, null));



//REDUCERS

const initialGrid = makeGrid(GRID_HEIGHT, GRID_WIDTH);
const boardReducer = (state = initialGrid, action) => {
  switch (action.type) {
    case 'TOGGLE_ALIVE':
      let board = state.slice(0);
      let cell = board[action.x][action.y];
      cell.status = !cell.status;
      cell.newBorn = !cell.newBorn;
      return board;
    case 'MAKE_RANDOM':
      //true param requests a random grid from makeGrid method
      return makeGrid(GRID_HEIGHT, GRID_WIDTH, true);
    case 'CLEAR':
      return makeGrid(GRID_HEIGHT, GRID_WIDTH);
    case 'TICK':
      return advanceGrid(state.slice(0));
    default:
      return state;}

};

const generationCounterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'TICK':
      return state + 1;
    case 'CLEAR':
      return 0;
    case 'MAKE_RANDOM':
      return 0;
    default:
      return state;}

};

const playInitialState = {
  timerId: null,
  isRunning: false };


const playStatusReducer = (state = playInitialState, action) => {
  switch (action.type) {
    case 'PLAY':
      return {
        timerId: action.timerId,
        isRunning: true };

    case 'STOP':
      return {
        timerId: null,
        isRuninng: false };

    default:
      return state;}

};

//COMBINE REDUCERS
const reducers = combineReducers({
  board: boardReducer,
  playState: playStatusReducer,
  counter: generationCounterReducer });


//APPLICATION WRAPPER - wrap the app with the redux store and render to the DOM
const createStoreWithMiddleware = applyMiddleware()(createStore);

ReactDOM.render( /*#__PURE__*/
React.createElement(Provider, { store: createStoreWithMiddleware(reducers) }, /*#__PURE__*/
React.createElement(App, null)),

document.querySelector('.container'));