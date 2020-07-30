import { expect } from "chai";
import Sinon, { SinonSandbox, createSandbox, SinonStub } from "sinon";

import CommandFactory from "../../src/factories/CommandFactory";
import DirectoryUtils from "../../src/utils/DirectoryUtils";
// @ts-ignore - TS does not like MockCommand not living in src/
import MockCommand from "../MockCommand";
import MockCommandWithAlias from "../MockCommandWithAlias";

describe("CommandFactory", () => {
	let factory: CommandFactory;
	let commandName: string;
	let commandWithAliasesName: string;
	let aliases: string[];

	before(() => {
		commandName = new MockCommand().getName();
		commandWithAliasesName = new MockCommandWithAlias().getName();
		aliases = new MockCommandWithAlias().getAliases();

		factory = new CommandFactory();
		factory.commands = {};
		factory.commands[commandName] = () => new MockCommand();
		factory.commands[commandWithAliasesName] = () => new MockCommandWithAlias();

		aliases.forEach(alias => {
			factory.commands[alias] = () => new MockCommandWithAlias();
		});
	});

	describe("loadCommands()", () => {
		let sandbox: SinonSandbox;
		let emptyFactory: CommandFactory;
		let getFilesStub: SinonStub;

		beforeEach(() => {
			sandbox = createSandbox();
			emptyFactory = new CommandFactory();

			getFilesStub = sandbox.stub(DirectoryUtils, "getFilesInDirectory").callsFake(async () => [
				require("../MockCommand"), require("../MockCommandWithAlias")
			]);
		});

		it("should call DirectoryUtils::getFilesInDirectory()", async () => {
			await emptyFactory.loadCommands();

			expect(getFilesStub.called).to.be.true;
		});

		it("should load commands", async () => {
			expect(emptyFactory.commandExists(new MockCommand().getName())).to.be.false;

			await emptyFactory.loadCommands();

			expect(emptyFactory.commandExists(new MockCommand().getName())).to.be.true;
		});

		it("should load aliases", async () => {
			expect(emptyFactory.commandExists(new MockCommandWithAlias().getName())).to.be.false;

			await emptyFactory.loadCommands();

			expect(emptyFactory.commandExists(new MockCommandWithAlias().getName())).to.be.true;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});

	describe("commandExists()", () => {
		it("checks to see a command exists", () => {
			expect(factory.commandExists(commandName)).to.be.true;
		});

		it("checks to see a command exists - lowercase", () => {
			expect(factory.commandExists(commandName.toLowerCase())).to.be.true;
		});

		it("checks to see a command exists - uppercase", () => {
			expect(factory.commandExists(commandName.toUpperCase())).to.be.true;
		});

		it("checks to see a command doesn't exist", () => {
			expect(factory.commandExists("bad command")).to.be.false;
		});

		it("checks to see a command exists by it's aliases", () => {
			aliases.forEach(alias => {
				expect(factory.commandExists(alias)).to.be.true;
			});
		});
	});

	describe("getCommand()", () => {
		it("gets a mocked command", () => {
			expect(factory.getCommand(commandName)).to.be.a("object");
		});

		it("gets a mocked command - lowercase", () => {
			expect(factory.getCommand(commandName.toLowerCase())).to.be.a("object");
		});

		it("gets a mocked command - uppercase", () => {
			expect(factory.getCommand(commandName.toUpperCase())).to.be.a("object");
		});

		it("gets a mocked command by it's aliases", () => {
			aliases.forEach(alias => {
				expect(factory.getCommand(alias)).to.be.a("object");
			});
		});
	});
});