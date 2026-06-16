import { client, DEFAULT_MODEL } from "./lib/openai.js";
import { convertUnitTool, convertUnit } from "./tools/unit.js";
import { spinner } from "./utils/spinner.js";
import readline from "readline";

const AVAILABLE_TOOLS = {
    convert_units: convertUnit,
};

const tools = [convertUnitTool];

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

while (true) {
    const userInput = await ask("\n請輸入要換算的問題（直接按 Enter 離開）：");
    if (!userInput.trim()) break;

    const messages = [{ role: "user", content: userInput }];

    while (true) {
        const spin = spinner("思考中...").start();

        const response = await client.chat.completions.create({
            model: DEFAULT_MODEL,
            messages,
            tools,
            tool_choice: "auto",
        });

        spin.stop();

        const message = response.choices[0].message;
        messages.push(message);

        if (!message.tool_calls || message.tool_calls.length === 0) {
            console.log(message.content);
            break;
        }

        for (const toolCall of message.tool_calls) {
            const fnName = toolCall.function.name;
            const args = JSON.parse(toolCall.function.arguments);
            console.log(`\n[呼叫 tool] ${fnName}(${JSON.stringify(args)})`);

            const fn = AVAILABLE_TOOLS[fnName];
            const result = await fn(args);

            messages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: JSON.stringify(result),
            });
        }
    }
}

rl.close();