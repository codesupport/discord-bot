import { expect } from "chai";

import CommandFactory from "../../src/factories/CommandFactory";
// @ts-ignore - TS does not like MockCommand not living in src/
import MockCommand from "../MockCommand";

describe("CommandFactory", () => {
    let factory: CommandFactory;
    let commandName: string;

    before(() => {
        factory = new CommandFactory();
        commandName = new MockCommand().getName();
        factory["commands"] = {};
        factory["commands"][commandName] = () => new MockCommand();
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
    });
});