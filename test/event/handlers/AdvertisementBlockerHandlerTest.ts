import { expect } from "chai";
import AdvertisementBlockerHandler from "../../../src/event/handlers/AdvertisementBlockerHandler";
import {Constants} from "discord.js";

describe("AdvertisementBlockerHandler", () => {
    describe("Constructor()", () => {
        it("Creates a handler for MESSAGE_CREATE", () => {
            const handler = new AdvertisementBlockerHandler();

            expect(handler.getEvent()).to.equal(Constants.Events.MESSAGE_CREATE);
        });
    });
})