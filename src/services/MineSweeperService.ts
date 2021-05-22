import NumberUtils from "../utils/NumberUtils";

class MineSweeperService {
	private static instance: MineSweeperService;
	private static readonly GRID_ROWS = 11;
	private static readonly GRID_COLUMNS = 11;

	/* eslint-disable */
	private constructor() { }
	/* eslint-enable */

	static getInstance(): MineSweeperService {
		if (!this.instance) {
			this.instance = new MineSweeperService();
		}

		return this.instance;
	}

	public generateGame(ratio: number): string {
		const bombCount = MineSweeperService.GRID_ROWS * MineSweeperService.GRID_COLUMNS / ratio;
		const bombIndex = [];
		const numbers = [":zero:", ":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:"];
		const bombSurroundingPositions = [[0, -1], [0, 1], [-1, -1], [-1, 0], [-1, 1], [1, -1], [1, 0], [1, 1]];
		const bomb = ":boom:";

		const grid = Array.from(Array(MineSweeperService.GRID_ROWS), () => new Array(MineSweeperService.GRID_COLUMNS).fill(0));

		let currentCount = 0;

		while (currentCount < bombCount) {
			const randomRow = NumberUtils.getRandomNumberInRange(0, MineSweeperService.GRID_ROWS - 1);
			const randomColumn = NumberUtils.getRandomNumberInRange(0, MineSweeperService.GRID_COLUMNS - 1);

			// eslint-disable-next-line no-continue
			if (grid[randomRow][randomColumn] === bomb) continue;
			grid[randomRow][randomColumn] = bomb;
			bombIndex.push([randomRow, randomColumn]);
			currentCount++;
		}

		bombIndex.map(([rowI, colI]) => {
			// Check around every bomb and add +1 to cell counter
			bombSurroundingPositions.map(([rowPosition, colPosition]) => {
				if (this.isOutsideEdges(rowI + rowPosition, colI + colPosition)) return;
				if (typeof grid[rowI + rowPosition][colI + colPosition] !== "number") return;

				grid[rowI + rowPosition][colI + colPosition] += 1;
			});
		});

		for (let rowI = 0; rowI < MineSweeperService.GRID_ROWS; rowI++) {
			for (let colI = 0; colI < MineSweeperService.GRID_COLUMNS; colI++) {
				if (typeof grid[rowI][colI] === "number") {
					grid[rowI][colI] = numbers[grid[rowI][colI]];
				}
			}
		}

		let stringGrid = "";

		grid.map((row, index) => {
			stringGrid += `||${grid[index].join("||||")}||\n`;
		});

		return stringGrid;
	}

	private isOutsideEdges(rowIndex: number, colIndex: number) {
		// Top/Bottom
		if (rowIndex < 0 || rowIndex === MineSweeperService.GRID_ROWS) return true;
		// Sides
		if (colIndex < 0 || colIndex === MineSweeperService.GRID_COLUMNS) return true;

		return false;
	}
}

export default MineSweeperService;