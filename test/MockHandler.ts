import { Constants } from "discord.js";
import EventHandler from "../src/abstracts/EventHandler";

class MockHandler extends EventHandler {
	constructor() {
		super(Constants.Events.MESSAGE_CREATE);
	}

    // eslint-disable-next-line no-empty-function
    handle = async function() {};
}

export default MockHandler;
