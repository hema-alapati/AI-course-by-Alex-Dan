import OpenAI from "openai";
import {writeFileSync} from 'fs';

const openai = new OpenAI()

async function generateFreeImage(){
    const response = await openai.images.generate({
        prompt:'A futuristic city skyline at sunset, with flying cars and neon lights',
        model: 'dall-e-2',
        style: 'vivid',
        quality: 'standard',
        n: 1
    });
    console.log(response)

}

async function generateFreeLocalImage(){
    const response = await openai.images.generate({
        prompt:'A futuristic city skyline at sunset, with flying cars and neon lights',
        model: 'dall-e-2',
        style: 'vivid',
        quality: 'standard',
        n: 1,
        response_format: 'b64_json'
    });
    const rawImage = response.data[0].b64_json;
    if(rawImage){
        writeFileSync('image.png',Buffer.from(rawImage,'base64'))
    }

}

async function generateAdvancedImage(){
    const response = await openai.images.generate({
        prompt: 'Photo of a city at night with skyscrapers and neon lights',
        model: 'dall-e-3',
        quality: 'hd',
        size: '1024x1024',
        response_format: 'b64_json',
    })
    const rawImage = response.data[0].b64_json;
    if(rawImage){
        writeFileSync('city.png',Buffer.from(rawImage,'base64'))
    }   
}

generateAdvancedImage()
// generateFreeLocalImage()
// generateFreeImage()