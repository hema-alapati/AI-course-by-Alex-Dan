import OpenAI from "openai";

const openai = new OpenAI();

function getAvailableFlights(departure: string, destination:string):string[]{
    console.log(`Getting available flights from ${departure} to ${destination}`)
    if(departure == 'New York' && destination == 'Los Angeles'){
        return ['Flight 101', 'Flight 102', 'Flight 103'];
    }
    if(departure == 'Los Angeles' && destination == 'New York'){
        return ['Flight 201', 'Flight 202'];
    }
    return ['66 FSFG'];
}

function getFlightStatus(flightId: string):string{
    console.log(`Getting the status of flight ${flightId}`)
    const flightAsNumber = parseInt(flightId);
    if(flightAsNumber%2==0){
        return 'ON_TIME'
    }
    return 'DELAYED'
}

function getFlightDetails(flightId: string):string{
    console.log(`Getting the details of flight ${flightId}`)
    const flightAsNumber = parseInt(flightId);
    if(flightAsNumber%2==0){
        return 'Flight 101: Departure at 10:00 AM, Arrival at 1:00 PM'
    }
    return 'Flight 102: Departure at 11:00 AM, Arrival at 2:00 PM'
}

function reserveFlight(flightId: string, passengerName: string):string{
    console.log(`Reserving flight ${flightId} for ${passengerName}`)
    const flightAsNumber = parseInt(flightId);
    if(flightAsNumber%2==0){
        return 'Reservation successful'
    }
    return 'Reservation failed'
}


const context: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
        role: 'system',
        content: 'You are a flight assistant. You can help users find flights, check flight status, get flight details, and reserve flights.'
    }
];

async function callOpenAIWithFunctions(){
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-0613',
        messages: context,
        temperature: 0.0,
        tools: [
            {
                type: 'function',
                function: {
                    name: 'getAvailableFlights',
                    description: 'Get available flights from departure to destination',
                    parameters: {
                        type: 'object',
                        properties: {
                            departure: {
                                type: 'string',
                                description: 'The departure city'
                            },
                            destination: {
                                type: 'string',
                                description: 'The destination city'
                            }
                        },
                        required: ['departure', 'destination']
                    }  
                }
            },
            {
                type: 'function',
                function: {
                    name: 'getFlightStatus',
                    description: 'Get the status of a flight',
                    parameters: {
                        type: 'object',
                        properties: {
                            flightId: {
                                type: 'string',
                                description: 'The flight ID'
                            }
                        },
                        required: ['flightId']
                    }  
                }
            },
            {
                type: 'function',
                function: {
                    name: 'getFlightDetails',
                    description: 'Get the details of a flight',
                    parameters: {
                        type: 'object',
                        properties: {
                            flightId: {
                                type: 'string',
                                description: 'The flight ID'
                            }
                        },
                        required: ['flightId']
                    }  
                }
            },
            {
                type: 'function',
                function: {
                    name: 'reserveFlight',
                    description: 'Reserve a flight for a passenger',
                    parameters: {
                        type: 'object',
                        properties: {
                            flightId: {
                                type: 'string',
                                description: 'The flight ID'
                            },
                            passengerName:{
                                type:'string',
                                description:'The name of the passenger'
                            }
                        },
                        required:['flightId', 'passengerName']
                    }  
                }
            }
        ]
    });
    const secondCallResponse = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-0613',
        messages: context,
    });
    console.log(secondCallResponse.choices[0].message);
}

console.log('Hello from flight assistant chatbot!')
process.stdin.addListener('data', async function (input) {
    let userInput = input.toString().trim();
    context.push({
        role: 'assistant',
        content: userInput
    });
    await callOpenAIWithFunctions();
});

