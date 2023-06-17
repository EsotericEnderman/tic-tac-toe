/* eslint-disable no-use-before-define */
/* eslint-disable func-style */
let gameBoard = ["", "", "", "", "", "", "", "", ""];
const gameBoardElement = document.querySelector("div.js-board-container");

let computerPiece, playerPiece;

function renderGameBoard() {
	gameBoardElement.innerHTML = "";
	gameBoard.forEach((move) => {
		if (!move) {
			gameBoardElement.innerHTML += `
      <div class="board-element">
				<img
					class="grey-square"
					alt="Grey Square"
					src="images/grey-square.png" />
			</div>
      `;
		} else if (move === "x") {
			gameBoardElement.innerHTML += `
      <div class="board-element">
				<img
					class="grey-square"
					alt="Grey Square"
					src="images/grey-square.png" />

          <div class="move">
            <img alt="X" src="images/cross.png" class="move-icon">
          </div>
			</div>
      `;
		} else if (move === "o") {
			gameBoardElement.innerHTML += `
      <div class="board-element">
				<img
					class="grey-square"
					alt="Grey Square"
					src="images/grey-square.png" />

          <div class="move">
            <img alt="O" src="images/circle.png" class="move-icon">
          </div>
			</div>
      `;
		}
	});

	const greySquareImages = document.querySelectorAll("img.grey-square");

	greySquareImages.forEach((element, index) =>
		element.addEventListener("click", () => {
			if (gameStatus.innerHTML === "Your move" && !gameBoard[index]) {
				gameBoard.splice(index, 1, playerPiece);
				renderGameBoard();

				const status = checkGameStatus();

				if (!status) playComputerMove();
			}
		}),
	);
}

function pickRandomMove() {
	const filteredGameBoard = gameBoard
		.map((move, index) => ({
			move,
			index,
		}))
		.filter((move) => !move.move);

	return filteredGameBoard[Math.floor(Math.random() * filteredGameBoard.length)]
		.index;
}

function pickBestMove() {
	let bestMove;

	gameBoard.forEach((move, index) => {
		if (
			!move &&
			// Horizontal row check.
			((index % 3 === 0 &&
				gameBoard[index + 1] === computerPiece &&
				gameBoard[index + 2] === computerPiece) ||
				(index % 3 === 1 &&
					gameBoard[index - 1] === computerPiece &&
					gameBoard[index + 1] === computerPiece) ||
				(index % 3 === 2 &&
					gameBoard[index - 2] === computerPiece &&
					gameBoard[index - 1] === computerPiece) ||
				// Vertical row check.
				(index < 3 &&
					gameBoard[index + 3] === computerPiece &&
					gameBoard[index + 6] === computerPiece) ||
				(index > 2 &&
					index < 6 &&
					gameBoard[index - 3] === computerPiece &&
					gameBoard[index + 3] === computerPiece) ||
				(index > 5 &&
					gameBoard[index - 6] === computerPiece &&
					gameBoard[index - 3] === computerPiece) ||
				// Diagonal up to down check.
				(index === 0 &&
					gameBoard[4] === computerPiece &&
					gameBoard[8] === computerPiece) ||
				(gameBoard[0] === computerPiece &&
					index === 4 &&
					gameBoard[8] === computerPiece) ||
				(gameBoard[0] === computerPiece &&
					gameBoard[4] === computerPiece &&
					index === 8) ||
				// Diagonal down to up check.
				(index === 2 &&
					gameBoard[4] === computerPiece &&
					gameBoard[6] === computerPiece) ||
				(gameBoard[2] === computerPiece &&
					index === 4 &&
					gameBoard[6] === computerPiece) ||
				(gameBoard[2] === computerPiece &&
					gameBoard[4] === computerPiece &&
					index === 6))
		) {
			bestMove = index;
		}
	});

	if (!bestMove) {
		gameBoard.forEach((move, index) => {
			if (
				!move &&
				// Horizontal row check.
				((index % 3 === 0 &&
					gameBoard[index + 1] === playerPiece &&
					gameBoard[index + 2] === playerPiece) ||
					(index % 3 === 1 &&
						gameBoard[index - 1] === playerPiece &&
						gameBoard[index + 1] === playerPiece) ||
					(index % 3 === 2 &&
						gameBoard[index - 2] === playerPiece &&
						gameBoard[index - 1] === playerPiece) ||
					// Vertical row check.
					(index < 3 &&
						gameBoard[index + 3] === playerPiece &&
						gameBoard[index + 6] === playerPiece) ||
					(index > 2 &&
						index < 6 &&
						gameBoard[index - 3] === playerPiece &&
						gameBoard[index + 3] === playerPiece) ||
					(index > 5 &&
						gameBoard[index - 6] === playerPiece &&
						gameBoard[index - 3] === playerPiece) ||
					// Diagonal up to down check.
					(index === 0 &&
						gameBoard[4] === playerPiece &&
						gameBoard[8] === playerPiece) ||
					(gameBoard[0] === playerPiece &&
						index === 4 &&
						gameBoard[8] === playerPiece) ||
					(gameBoard[0] === playerPiece &&
						gameBoard[4] === playerPiece &&
						index === 8) ||
					// Diagonal down to up check.
					(index === 2 &&
						gameBoard[4] === playerPiece &&
						gameBoard[6] === playerPiece) ||
					(gameBoard[2] === playerPiece &&
						index === 4 &&
						gameBoard[6] === playerPiece) ||
					(gameBoard[2] === playerPiece &&
						gameBoard[4] === playerPiece &&
						index === 6))
			) {
				bestMove = index;
			}
		});
	}

	if (!bestMove && !gameBoard[4]) bestMove = 4;

	if (!bestMove) {
		if (!gameBoard[0]) bestMove = 0;
		if (!gameBoard[2] && gameBoard[5] !== playerPiece) bestMove = 2;
		if (!gameBoard[6] && gameBoard[7] !== playerPiece) bestMove = 6;

		if (!gameBoard[8]) bestMove = 8;
	}

	return bestMove ?? pickRandomMove();
}

function playMove(index, move) {
	gameBoard[index] = move;
	renderGameBoard();
}

const gameStatus = document.querySelector("p.js-game-status");

const difficultySelection = document.querySelector(
	"select.js-difficult-selector",
);

function playComputerMove() {
	gameStatus.innerHTML = "Computer's move";

	setTimeout(() => {
		const moveIndex =
			// @ts-ignore
			difficultySelection.value === "Easy" ||
			// @ts-ignore
			(difficultySelection.value === "Medium" && Math.random() > 0.5)
				? pickRandomMove()
				: pickBestMove();
		playMove(moveIndex, computerPiece);

		const status = checkGameStatus();

		if (!status) gameStatus.innerHTML = "Your move";
	}, Math.random() * 1000 + 1000);
}

const startGameButton = document.querySelector("button.js-start-game-button");

function checkGameStatus() {
	let status;

	gameBoard.forEach((move, index) => {
		if (
			move &&
			// Horizontal row check.
			((index % 3 === 0 &&
				gameBoard[index + 1] === move &&
				gameBoard[index + 2] === move) ||
				// Vertical row check.
				(gameBoard[index + 3] === move && gameBoard[index + 6] === move) ||
				// Diagonal up to down check.
				(move === gameBoard[0] &&
					move === gameBoard[4] &&
					move === gameBoard[8]) ||
				// Diagonal down to up check.
				(move === gameBoard[2] &&
					move === gameBoard[4] &&
					move === gameBoard[6]))
		) {
			status = `${move === playerPiece ? "You win!" : "You lose!"}`;
		}
	});

	if (!status && !gameBoard.includes("")) status = "Tie";

	if (status) {
		startGameButton.innerHTML = "Reset Game";
		gameStatus.innerHTML = status;
	}

	return status;
}

startGameButton.addEventListener("click", () => {
	if (
		startGameButton.innerHTML === "End Game" ||
		startGameButton.innerHTML === "Reset Game"
	) {
		gameBoard = ["", "", "", "", "", "", "", "", ""];
		renderGameBoard();

		startGameButton.classList.remove("end-game-button", "js-end-game-button");
		startGameButton.classList.add("start-game-button", "js-start-game-button");

		startGameButton.innerHTML = "Start Game";
		gameStatus.innerHTML = "";
	} else if (
		!gameStatus.innerHTML &&
		// @ts-ignore
		difficultySelection.value !== "Select Difficulty"
	) {
		startGameButton.classList.remove(
			"start-game-button",
			"js-start-game-button",
		);

		startGameButton.classList.add("end-game-button", "js-end-game-button");

		startGameButton.innerHTML = "End Game";

		gameBoard = ["", "", "", "", "", "", "", "", ""];
		renderGameBoard();

		const firstMove = Math.random() > 0.5 ? "player" : "computer";

		if (firstMove === "computer") {
			computerPiece = "x";
			playerPiece = "o";
		} else {
			computerPiece = "o";
			playerPiece = "x";
		}

		if (firstMove === "computer") {
			playComputerMove();
		} else {
			gameStatus.innerHTML = "Your move";
		}
	}
});
