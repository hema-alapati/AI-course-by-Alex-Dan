import OpenAI from "openai";

const openai = new OpenAI();

function getTimeOfDay(){
    return '5.45'
}


function getOrderStatus(orderId: string){
    console.log(`Getting the status of the order ${orderId}`)
    const orderAsNumber = parseInt(orderId);
    if(orderAsNumber%2==0){
        return 'IN_PROGRESS'
    }
    return 'COMPLETED'
}


async function callOpenAIWithTools(){
    const context: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        {
            role:'system',
            content:'You are a helpful assistant that gives information about the time of day and order status.'
        },
        {
            role: 'user',
            content: 'What is the status of order 1234?'
        }
    ]

    //configure chat tools (first openAI call)
    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: context,
        tools: [
            {
                type: 'function',
                function: {
                    name:'getTimeOfDay',
                    description: 'Get the current time of day',
                }
            },
            {
                type: 'function',
                function: {
                    name:'getOrderStatus',
                    description: 'Get the status of an order',
                    parameters:{
                        type:'object',
                        properties:{
                            orderId:{
                                type:'string',
                                description:'The ID of the order to get the status for'
                            }
                        },
                        required:['orderId']

                    }
                }

            }
        ],
        tool_choice: 'auto' // the engine will decide which tool to use
    })
    // decide if tool call is required
    const willInvokeFunction=response.choices[0].finish_reason='tool_calls'
    const toolCall=response.choices[0].message.tool_calls![0]

    if(willInvokeFunction){
        const toolName =toolCall.function.name
        if(toolName=='getTimeOfDay'){
            const toolResponse = getTimeOfDay();
            const.push(response.choices[0].message);
            const.push({
                role: 'tool',
                content: toolResponse,
                tool_call_id: toolCall.id
            })
        }
        if(toolName=='getOrderStatus'){
            const rawArgument=toolCall.function.arguments;
            const parsedArguments=JSON.parse(rawArgument);
            const toolResponse = getOrderStatus(parsedArguments.orderId);

            const.push(response.choices[0].message);
            const.push({
                role: 'tool',
                content: toolResponse,
                tool_call_id: toolCall.id
            })
        }
    }

    const secondResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: context,
    })

    console.log(response.choices[0].message.content)

}

callOpenAIWithTools();


// // src/tools/index.ts

// class ChatBot {
//     constructor(private name: string = "ChatBot") {}

//     greet(): string {
//         return `Hello! I am ${this.name}. How can I assist you today?`;
//     }

//     getCurrentTime(): string {
//         const now = new Date();
//         return `The current time is ${now.toLocaleTimeString()}.`;
//     }

//     respondToQuery(query: string): string {
//         if (query.toLowerCase().includes("time")) {
//             return this.getCurrentTime();
//         }
//         return "I'm sorry, I can only tell you the current time for now.";
//     }
// }

// // Example usage
// const bot = new ChatBot();
// console.log(bot.greet());
// console.log(bot.respondToQuery("What is the current time?"));