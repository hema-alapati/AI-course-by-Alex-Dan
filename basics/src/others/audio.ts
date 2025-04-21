import OpenAI from "openai";
import {writeFileSync, createReadStream} from 'fs';

const openai = new OpenAI()

async function createTranscription(){
    const response = await openai.audio.transcriptions.create({
        file: createReadStream('AudioSample.m4a'),
        model: 'whisper-1',
        language: 'en'
    });
    console.log(response);
}

async function translate(){
    const response = await openai.audio.transcriptions.create({
        file: createReadStream('FrenchSample.m4a'),
        model: 'whisper-1'
    })
    console.log(response);

}

async function textToSpeech(){
    const sampleText = 'Hello, this is a sample text to speech conversion.';

    const response = await openai.audio.speech.create({
        input: sampleText,
        voice: 'alloy',
        model: 'tts-1',
        response_format: 'mp3'
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    writeFileSync('output.mp3', buffer);
    console.log('Audio file saved as output.mp3');
}


textToSpeech();
// translate();
// createTranscription();