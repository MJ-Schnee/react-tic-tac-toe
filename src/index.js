import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	return (
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i) {
		return (
			<Square
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	render() {
		return (
			<div>
				{/* Creates an array of 3 divs and cycles through them */}
				{Array(3).fill().map((rowValue, rowIndex) =>
					<div className="board-row" key={"row_" + rowIndex}>
						{/* Creates an array of 3 spans and cycles through them to
                render a square of the specified value*/}
						{Array(3).fill().map((colValue, colIndex) =>
							<span id={"row_" + (colIndex + 1) + "_col_" + (rowIndex + 1)} key={"row_" + rowIndex + "_col_" + colIndex}>
								{this.renderSquare(3 * (rowIndex % 3) + colIndex)}
							</span>
						)}
					</div>
				)}
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill()
			}],
			stepNumber: 0,
			xIsNext: true,
			moves: [],
			listReversed: false,
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		const moves = this.state.moves.slice(0, this.state.stepNumber);

		if (calculateWinner(squares) || squares[i]) {
			return;
		}

		squares[i] = this.state.xIsNext ? "X" : "O";
		this.setState({
			history: history.concat([{
				squares: squares
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
			moves: moves.concat(calculateSquareCoord(i)),
		});
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0
		});
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);
		const moves = this.state.moves;

		const movesList = history.map((step, move) => {
			if (this.state.listReversed)
				move = history.length - 1 - move;

			const desc = move ?
				'Go to move #' + move + ' : ' + moves[move - 1] :
				'Go to game start';

			return (
				<li key={move}>
					<button
						onClick={() => this.jumpTo(move)}
						onMouseEnter={(el) => el.target.style.fontWeight = 'bold'}
						onMouseLeave={(el) => el.target.style.fontWeight = ''}
					>
						{desc}
					</button>
				</li>
			);
		});

		const status = winner ?
			"Winner: " + winner :
			"Next player: " + (this.state.xIsNext ? "X" : "O");

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<button onClick={() => {
						this.setState({ listReversed: !this.state.listReversed });
					}}>
						{this.state.listReversed ? "Unreverse the list!" : "Reverse the list!"}
					</button>
					<ol reversed={this.state.listReversed}>{movesList}</ol>
				</div>
			</div>
		);
	}
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
			const coord1 = [calculateSquareCoord(a).substring(1, 2), calculateSquareCoord(a).substring(4, 5)];
			const coord2 = [calculateSquareCoord(b).substring(1, 2), calculateSquareCoord(b).substring(4, 5)];
			const coord3 = [calculateSquareCoord(c).substring(1, 2), calculateSquareCoord(c).substring(4, 5)];
			document.querySelector(`#row_${coord1[0]}_col_${coord1[1]}`).firstChild.style.background = "#0F0";
			document.querySelector(`#row_${coord2[0]}_col_${coord2[1]}`).firstChild.style.background = "#0F0";
			document.querySelector(`#row_${coord3[0]}_col_${coord3[1]}`).firstChild.style.background = "#0F0";
			return squares[a];
		} else if (squares[a]) {
			for (let i = 1; i < 4; i++)
				for (let j = 1; j < 4; j++)
					document.querySelector(`#row_${i}_col_${j}`).firstChild.style.background = "#FFF";
		}
	}

	for (let i = 0; i < 9; i++)
		if (squares[i] === undefined)
			return null;

	return undefined;
}

/**
 * Calculates the "(col, row)" of a square
 * @param {*} square Given index of a square according to the game board
 */
function calculateSquareCoord(square) {
	const col = (square % 3) + 1;
	const row = (Math.floor(square / 3)) + 1;
	// Fun fact: in trying to discover how to calculate the rows
	//   I learned that (X - (X % Y)) % Y will always equal 0
	return `(${col}, ${row})`;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
