import NumberUtils from "../utils/NumberUtils";

class MineSweeperService {
	private static instance: MineSweeperService;
	private static readonly GRID_ROWS = 11;
	private static readonly GRID_COLUMNS = 11;
	private static readonly BOMB = ":boom:";

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
		const emptyGrid = Array.from(Array(MineSweeperService.GRID_ROWS), () => new Array(MineSweeperService.GRID_COLUMNS).fill(0));

		const [gridWithBombs, bombPositions] = this.placeBombs(emptyGrid, bombCount);

		const gameGrid = this.calculateBombSurrounding(gridWithBombs, bombPositions);

		return this.formatGameResult(gameGrid);
	}

	private placeBombs(grid: any[][], bombCount: number) {
		const bombPositions = [];

		for (let i = 0; i < bombCount; i++) {
			const randomRow = NumberUtils.getRandomNumberInRange(0, MineSweeperService.GRID_ROWS - 1);
			const randomColumn = NumberUtils.getRandomNumberInRange(0, MineSweeperService.GRID_COLUMNS - 1);

			// eslint-disable-next-line no-continue
			if (grid[randomRow][randomColumn] === MineSweeperService.BOMB) continue;
			grid[randomRow][randomColumn] = MineSweeperService.BOMB;
			bombPositions.push([randomRow, randomColumn]);
		}

		return [grid, bombPositions];
	}

	private calculateBombSurrounding(grid: any[][], bombPositions: any[][]) {
		const bombSurroundingPositions = [[0, -1], [0, 1], [-1, -1], [-1, 0], [-1, 1], [1, -1], [1, 0], [1, 1]];

		bombPositions.map(([rowI, colI]) => {
			// Check around every bomb and add +1 to cell counter
			bombSurroundingPositions.map(([rowPosition, colPosition]) => {
				if (typeof grid[rowI + rowPosition] === "undefined") return;
				if (typeof grid[rowI + rowPosition][colI + colPosition] !== "number") return;

				grid[rowI + rowPosition][colI + colPosition] += 1;
			});
		});

		return grid;
	}

	private formatGameResult(grid: any[][]) {
		const numbers = [":zero:", ":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:"];
		let stringGrid = "";

		for (let rowI = 0; rowI < MineSweeperService.GRID_ROWS; rowI++) {
			for (let colI = 0; colI < MineSweeperService.GRID_COLUMNS; colI++) {
				if (typeof grid[rowI][colI] === "number") {
					grid[rowI][colI] = numbers[grid[rowI][colI]];
				}
			}
		}

		grid.map((row, index) => {
			stringGrid += `||${grid[index].join("||||")}||\n`;
		});

		return stringGrid;
	}
}

export default MineSweeperService;