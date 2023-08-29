import NumberUtils from "../utils/NumberUtils";

class MineSweeperService {
	// eslint-disable-next-line no-use-before-define
	private static instance: MineSweeperService;
	private static readonly GRID_ROWS = 11;
	private static readonly GRID_COLUMNS = 11;
	private static readonly BOMB = ":boom:";

	// eslint-disable-next-line
	private constructor() {}

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

	private placeBombs(grid: number[][], bombCount: number): number[][][] {
		const bombPositions = [];
		let i = 0;

		while (i < bombCount) {
			const randomRow = NumberUtils.getRandomNumberInRange(0, MineSweeperService.GRID_ROWS - 1);
			const randomColumn = NumberUtils.getRandomNumberInRange(0, MineSweeperService.GRID_COLUMNS - 1);

			// eslint-disable-next-line no-continue
			if (grid[randomRow][randomColumn] === -1) continue;

			grid[randomRow][randomColumn] = -1;
			bombPositions.push([randomRow, randomColumn]);
			i++;
		}

		return [grid, bombPositions];
	}

	private calculateBombSurrounding(grid: number[][], bombPositions: number[][]): number[][] {
		const bombSurroundingPositions = [[0, -1], [0, 1], [-1, -1], [-1, 0], [-1, 1], [1, -1], [1, 0], [1, 1]];

		bombPositions.map(([rowI, colI]) => {
			// Check around every bomb and add +1 to cell counter
			bombSurroundingPositions.map(([rowPosition, colPosition]) => {
				if (typeof grid[rowI + rowPosition] === "undefined" || typeof grid[rowI + rowPosition][colI + colPosition] === "undefined") return;
				if (grid[rowI + rowPosition][colI + colPosition] === -1) return;

				grid[rowI + rowPosition][colI + colPosition] += 1;
			});
		});

		return grid;
	}

	private formatGameResult(grid: number[][]): string {
		const numbers = [":zero:", ":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:"];
		let stringGrid = "";

		const formattedGrid: string[][] = grid.map((row, rowI) => row.map((col, colI) => {
			if (grid[rowI][colI] !== -1) return numbers[grid[rowI][colI]];
			return MineSweeperService.BOMB;
		}));

		formattedGrid.map((row, index) => {
			stringGrid += `||${formattedGrid[index].join("||||")}||\n`;
		});

		return stringGrid;
	}
}

export default MineSweeperService;