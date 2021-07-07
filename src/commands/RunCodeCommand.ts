import { Message, MessageEmbed } from "discord.js";
import Command from "../abstracts/Command";
import { EMBED_COLOURS } from "../config.json";
const axios = require('axios')
async function execx(args,codex){
    return axios
  .post('http://kingslayer.ninja:2000/api/v2/execute', {
  "language": args[0],
  "version":"3.9.4",
  "files": [
    {
      "name": "codesupport.js",
      "content": codex
    }
  ],
  "stdin": "",
  "compile_timeout": 10000,
  "run_timeout": 3000,
  "compile_memory_limit": -1,
  "run_memory_limit": -1
})
}
class RunCodeCommand extends Command {
	constructor() {
		super(
			"runcode",
			"Run various kinds of code from Discord!"
		);
	}

	async run(message: Message, args?: string[]): Promise<void> {
		const embed = new MessageEmbed();
        var a = ""
        var arg = args.slice()
        arg.shift()
        a = arg.join(' ')
        var codex = a;
console.log(a);
console.log(codex);
		if ((!args || typeof args[0] === "undefined")||a.length==0) {
			embed.setTitle("Error");
			embed.setDescription("You must define a language. Or provide codeblock");
			embed.addField("Correct Usage", "?runcode <language> <codeblock>");
			embed.setColor(EMBED_COLOURS.ERROR);
		} else {
			try {
//var res=""
console.log(codex.slice(3,-3).slice(3));
console.log(codex.slice(0,-3).slice(3));
await execx(args,codex.slice(0,-3).slice(3))
  .then(res => {
    console.log(res.data.run['stdout'] || "None");
					embed.setTitle("Code Executed");
					embed.setDescription("Your code has been executed.");
                    embed.addField("Output",res.data.run['stdout'] || "None");
                    if(res.data.run['stderr'] != ""){
                        embed.addField("Error",res.data.run['stderr'] || "None");
                    }
					embed.setFooter("Result powered by the Piston API.");
					embed.setColor(EMBED_COLOURS.SUCCESS);
    
  })
  .catch(error => {
      console.log(error);
    embed.setTitle("Error");
        embed.setDescription("Seems like it is invalid language.");
        embed.setColor(EMBED_COLOURS.ERROR);
  })
				
			} catch (error) {
                console.log(error);
				embed.setTitle("Error");
				embed.setDescription("There was a problem querying DuckDuckGo.");
				embed.addField("Correct Usage", "?search <query>");
				embed.setColor(EMBED_COLOURS.ERROR);
			}
		}
        console.log(embed);
        if (embed.description==null){embed.setDescription("Error")}
		await message.channel.send({ embed });
	}
}

export default RunCodeCommand;