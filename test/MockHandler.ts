import { Events } from "discord.js";
import EventHandler from "../src/abstracts/EventHandler";

class MockHandler extends EventHandler {
	constructor() {
		super(Events.MessageCreate);
	}

    // eslint-disable-next-line no-empty-function
    handle = async function() {};
}

export default MockHandler;
