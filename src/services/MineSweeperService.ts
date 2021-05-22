import NumberUtil from "../utils/NumberUtil";

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

		const isOutsideTopEdge = rowIndex => rowIndex < 0;
		const isOutsideBottomEdge = rowIndex => rowIndex == rows;
		const isOutsideLeftEdge = colIndex => colIndex < 0;
		const isOutsideRightEdge = colIndex => colIndex == cols;

		const isOutside = (rowIndex, colIndex) => {
			if (isOutsideTopEdge(rowIndex)) return true;
			if (isOutsideBottomEdge(rowIndex)) return true;
			if (isOutsideLeftEdge(colIndex)) return true;
			if (isOutsideRightEdge(colIndex)) return true;
			return false;
		};

		let currentCount = 0;

		while (currentCount < bombCount) {
			const randomRow = NumberUtil.getRandomNumber(0, rows - 1);
			const randomColumn = NumberUtil.getRandomNumber(0, cols - 1);

			// eslint-disable-next-line no-continue
			if (grid[randomRow][randomColumn] === bomb) continue;
			grid[randomRow][randomColumn] = bomb;
			bombIndex.push([randomRow, randomColumn]);
			currentCount++;
		}

		bombIndex.map(([rowI, colI]) => {
			// Check around every bomb and add +1 to cell counter
			positions.map(([rowPosition, colPosition]) => {
				if (isOutside(rowI + rowPosition, colI + colPosition)) return;
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