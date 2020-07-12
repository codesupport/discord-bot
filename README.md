# CodeSupport Discord Bot

[![Codacy Code Quality Badge](https://api.codacy.com/project/badge/Grade/c4b521b72b784a1ca31b0ed058271656)](https://app.codacy.com/gh/codesupport/discord-bot?utm_source=github.com&utm_medium=referral&utm_content=codesupport/discord-bot&utm_campaign=Badge_Grade_Settings)
[![Codacy Code Coverage Badge](https://app.codacy.com/project/badge/Coverage/e1a3878449c04c4ca227ecbb0377be04)](https://www.codacy.com/gh/codesupport/discord-bot?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=codesupport/discord-bot&amp;utm_campaign=Badge_Coverage)

## About
This repository contains the code for the CodeSupport Discord Bot. The project is written in TypeScript using the Discord.js module for interaction with the Discord API.

## Dependencies

### Production
- [Discord.js](https://www.npmjs.com/package/discord.js)
- [Axios](https://www.npmjs.com/package/axios)
- [Twitter](https://www.npmjs.com/package/twitter)
- [dotenv](https://www.npmjs.com/package/dotenv)

### Development
- [TypeScript](https://www.npmjs.com/package/typescript)
- [Mocha](https://www.npmjs.com/package/mocha)
- [TS-Mocha](https://www.npmjs.com/package/ts-mocha)
- [Sinon](https://www.npmjs.com/package/sinon)
- [Chai](https://www.npmjs.com/package/chai)
- [ESLint](https://www.npmjs.com/package/eslint)
- [TypeScript ESLint Plugin](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin)
- [TypeScript ESLint Parser](https://www.npmjs.com/package/@typescript-eslint/parser)
- [CodeSupport's ESLint Config](https://www.npmjs.com/package/eslint-config-codesupport)
- [NYC](https://www.npmjs.com/package/nyc)

**Notes:** 
- We have excluded [@types](http://definitelytyped.org) packages from this list.
- Although TypeScript is listed as a development dependency, it is needed to build the source code.

## Setup
1. Navigate into the repository on your computer and run `npm i`
2. Build the source code with `npm run build`
3. Start the Discord bot with `npm start`
   - You will need to supply the `DISCORD_TOKEN` environment variable
 
If you would like to use a `.env` file for storing your environment variables please create it in the root of the project.

## Structure
- All source code lives inside `src/`
- All tests live inside `test/`
- Any static assets (i.e. images) live inside `assets/`
- Commands live in `src/commands/`
- Event handlers live in `src/event/handlers`

Please name files (which aren't interfaces) with their type in, for example `RuleCommand` and `RuleCommandTest`. This helps make the file names more readable in your editor. Do not add a prefix or suffix of "I" or "Interface" to interfaces.

### Creating Commands
To create a command, create a new file in `src/commands` named `<CommandName>Command.ts`. Commands should extend the `Command` abstract and `super` the command name, the description and any command options (if applicable). When a command is run, it triggers the `run` method. This method has two parameters:
- `message` - The Discord Message object
- `args` - An optional array of strings that the user sends along with the command

#### Example Command
```ts
class ExampleCommand extends Command {
    constructor() {
        super(
            "example",
            "an example command"
        );    
    }

    async run(message: Message): Promise<void> {
        await message.channel.send("Hello!");
    }
}
```

### Creating Event Handlers
To create an event handler, create a new file in `src/event/handlers` named `<HandlerName>Handler.ts`. Event handlers should extend the `EventHandler` abstract and `super` the event constant they are triggered by. When an event handler is handled, it triggers the `handle` method. This method accepts any parameters that the event requires. Do not name event handlers after the event they handle, but what their functionality is (for example, `AutomaticMemberRoleHandler` not `GuildMemberAddHandler`.

#### Example Event Handler
```ts
class ExampleHandler extends EventHandler {
    constructor() {
        super(Constants.Events.MESSAGE_CREATE);    
    }

    async handle(message: Message): Promise<void> {
        await message.channel.send("Hello!");
    }
}
```

## Tests
We are using [Mocha](https://mochajs.org) with [Sinon](https://sinonjs.org) and [Chai](https://www.chaijs.com) for our tests. **All code should be tested,** if you are unsure of how to test your code ask LamboCreeper#6510 on Discord.

## Scripts
- To start the Discord bot use `npm start`
- To build the source code use `npm run build`
- To test the code use `npm test`
- To lint the code use `npm run lint`
- To get coverage stats use `npm run coverage`

**Any Questions?** Feel free to mention @LamboCreeper#6510 in the [CodeSupport Discord](https://discord.gg/Hn9SETt).
