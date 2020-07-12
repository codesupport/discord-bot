import fs from "fs";
import { expect } from "chai";
import { createSandbox, SinonSandbox } from "sinon";
import DirectoryUtils from "../../src/utils/DirectoryUtils";
import { commands_directory } from "../../src/config.json";

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
			const readdirStub = sandbox.stub(fs, "readdir");

			const result = DirectoryUtils.readDirectory(`../../src/${commands_directory}`);

			expect(result instanceof Promise).to.be.true;
		});

		afterEach(() => {
			sandbox.restore();
		});
    });
    
    describe()
});