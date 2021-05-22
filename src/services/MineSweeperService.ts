import NumberUtils from "../utils/NumberUtils";

class MineSweeperService {
	private static instance: MineSweeperService;

	/* eslint-disable */
	private constructor() { }
	/* eslint-enable */

	static getInstance(): MineSweeperService {
		if (!this.instance) {
			this.instance = new MineSweeperService();
		}

		return this.instance;
	}

	public generateGame(rows: number, cols: number, ratio: number): string {
		const bombCount = rows * cols / ratio;
		const bombIndex = [];
		const numbers = [":zero:", ":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:"];
		const positions = [[0, -1], [0, 1], [-1, -1], [-1, 0], [-1, 1], [1, -1], [1, 0], [1, 1]];
		const bomb = ":boom:";

		const grid = Array.from(Array(rows), () => new Array(cols).fill(0));

		function isOutsideEdges(rowIndex: number, colIndex: number) {
			// Top/Bottom
			if (rowIndex < 0 || rowIndex === rows) return true;
			// Sides
			if (colIndex < 0 || colIndex === cols) return true;

			return false;
		}

		let currentCount = 0;

		while (currentCount < bombCount) {
			const randomRow = NumberUtils.getRandomNumberInRange(0, rows - 1);
			const randomColumn = NumberUtils.getRandomNumberInRange(0, cols - 1);

			// eslint-disable-next-line no-continue
			if (grid[randomRow][randomColumn] === bomb) continue;
			grid[randomRow][randomColumn] = bomb;
			bombIndex.push([randomRow, randomColumn]);
			currentCount++;
		}

		bombIndex.map(([rowI, colI]) => {
			// Check around every bomb and add +1 to cell counter
			positions.map(([rowPosition, colPosition]) => {
				if (isOutsideEdges(rowI + rowPosition, colI + colPosition)) return;
				if (typeof grid[rowI + rowPosition][colI + colPosition] !== "number") return;

				grid[rowI + rowPosition][colI + colPosition] += 1;
			});
		});

		for (let rowI = 0; rowI < rows; rowI++) {
			for (let colI = 0; colI < cols; colI++) {
				// eslint-disable-next-line no-continue
				if (typeof grid[rowI][colI] !== "number") continue;
				grid[rowI][colI] = numbers[grid[rowI][colI]];
			}
		}

		let stringGrid = "";

		grid.map((row, index) => {
			stringGrid += `||${grid[index].join("||||")}||\n`;
		});

		return stringGrid;
	}
}

export default MineSweeperService;