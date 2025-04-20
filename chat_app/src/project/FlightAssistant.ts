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