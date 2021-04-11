import {createSandbox, SinonSandbox} from "sinon";
import {expect} from "chai";
import ProjectService from "../../src/services/ProjectService";
import Project from "../../src/interfaces/Project";

describe("ProjectService", () => {
	describe("::getInstance()", () => {
		it("returns an instance of ProjectService", () => {
			const service = ProjectService.getInstance();

			expect(service).to.be.instanceOf(ProjectService);
		});
	});

	describe("formatTags()", () => {
		let sandbox: SinonSandbox;
		let projectService: ProjectService;

		beforeEach(() => {
			sandbox = createSandbox();
			projectService = ProjectService.getInstance();
		});

		it("formats all arguments to be usable as tags", async () => {
			const unformattedTags = ["#REACT", "FRONT-END", "#vue"];
			const tags = await projectService.formatTags(unformattedTags);

			expect(tags).to.deep.equal(["react", "front-end", "vue"]);
		});

		afterEach(() => {
			sandbox.restore();
		});
	});

	describe("getProjectByTags()", () => {
		let sandbox: SinonSandbox;
		// Let projectService: ProjectService;

		beforeEach(() => {
			sandbox = createSandbox();
		//	ProjectService = ProjectService.getInstance();
		});

		it("returns a single project", async () => {
			//
		});

		afterEach(() => {
			sandbox.restore();
		});
	});

	describe("getDifficulty()", () => {
		let sandbox: SinonSandbox;
		let projectService: ProjectService;

		beforeEach(() => {
			sandbox = createSandbox();
			projectService = ProjectService.getInstance();
		});

		it("returns the difficulty by recognizing the tag", async () => {
			const mockProject: Project = {
				title: "Mocking",
				description: "Hello World",
				tags: ["easy", "javascript", "react"]
			};

			const difficulty = projectService.getDifficulty(mockProject);

			expect(difficulty).to.equal("easy");
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});