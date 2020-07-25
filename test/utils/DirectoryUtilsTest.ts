import fs, { Dirent } from "fs";
import { expect } from "chai";
import { createSandbox, SinonSandbox } from "sinon";
import DirectoryUtils from "../../src/utils/DirectoryUtils";
import { commands_directory } from "../../src/config.json";
import { promisify } from "util";

describe("DirectoryUtils", () => {
	describe("::readDirectory()", () => {
		let sandbox: SinonSandbox;

		beforeEach(() => {
			sandbox = createSandbox();
		});

		it("should call readdir", () => {
			const readdirStub = sandbox.stub(fs, "readdir");

			DirectoryUtils.readDirectory(`../../src/${commands_directory}`);

			expect(readdirStub.called).to.be.false;
		});

		it("should return a promise", () => {
			sandbox.stub(fs, "readdir");

			const result = DirectoryUtils.readDirectory(`../../src/${commands_directory}`);

			expect(result instanceof Promise).to.be.true;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});

	describe("::getFilesInDirectory()", () => {
		let sandbox: SinonSandbox;

		beforeEach(() => {
			sandbox = createSandbox();
		});

		it("should call readDirectory", () => {
			const readDirectoryStub = sandbox.stub(DirectoryUtils, "readDirectory").returns(["KickJacobCommand.js", "KickingService.js"]);

			sandbox.stub(module, "require").callsFake(path => path);

			DirectoryUtils.getFilesInDirectory(`../../src/${commands_directory}`, "Command.js");

			expect(readDirectoryStub.called).to.be.true;
		});

		it("should only return files that match a given ending", async () => {
			sandbox.stub(DirectoryUtils, "readDirectory").returns(["KickCommand.js", "KickingService.js"]);

			sandbox.stub(Array.prototype, "map").returns(["KickCommand.js"]);

			const files = await DirectoryUtils.getFilesInDirectory(`../../src/${commands_directory}`, "Commands.js");

			expect(files.includes("KickJacobCommand.js")).to.be.true;
			expect(files.includes("KickingService.js")).to.be.false;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});