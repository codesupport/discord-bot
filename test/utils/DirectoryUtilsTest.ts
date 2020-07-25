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

		afterEach(() => {
			sandbox.restore();
		});
	});

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

		afterEach(() => {
			sandbox.restore();
		});
	});
});