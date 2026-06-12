import { Events } from "discord.js";
import EventHandler from "../src/abstracts/EventHandler";

class MockHandler extends EventHandler {
	constructor() {
		super(Events.MessageCreate);
	}

	handle = async function() {};
}

export default MockHandler;
