import { expect } from "chai";
import { createSandbox, SinonSandbox } from "sinon";
import DirectoryUtils from "../../src/utils/DirectoryUtils";

describe("DirectoryUtils", () => {
	describe("::getFilesInDirectory()", () => {
		let sandbox: SinonSandbox;

		beforeEach(() => {
			sandbox = createSandbox();
		});

		it("should call readDirectory()", () => {
			const readDirectoryStub = sandbox.stub(DirectoryUtils, "readDirectory").returns(["FakeFile.js"]);

			sandbox.stub(Array.prototype, "map");

			DirectoryUtils.getFilesInDirectory(".", ".js");

			expect(readDirectoryStub.called).to.be.true;
		});

		it("should filter files", async () => {
			sandbox.stub(DirectoryUtils, "readDirectory").returns(["FakeFile.js", "FakeCommand.js"]);
			sandbox.stub(DirectoryUtils, "require").callsFake(arg => arg);

			const files = await DirectoryUtils.getFilesInDirectory(".", "Command.js");

			expect(files.includes("./FakeFile.js")).to.be.false;
			expect(files.includes("./FakeCommand.js")).to.be.true;
		});

		it("should require the files", async () => {
			const requireStub = sandbox.stub(DirectoryUtils, "require");

			sandbox.stub(DirectoryUtils, "readDirectory").returns(["FakeFile.js", "FakeCommand.js"]);

			await DirectoryUtils.getFilesInDirectory(".", "Command.js");

			expect(requireStub.calledWith("./FakeCommand.js")).to.be.true;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});