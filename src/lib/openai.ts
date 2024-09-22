// import { uploadFile } from "./firebase";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';
import { uploadOnCloudinary } from "./cloudinary";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY as string;

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
export async function generateImagePrompt(name: string) {
  
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are an creative and helpful AI assistance capable of generating interesting thumbnail descriptions for my notes. Your output will be fed into the GEMINI API to generate a thumbnail. The description should be minimalistic and flat styled. Please generate a thumbnail description for my notebook titles ${name}.`;

  const image_description = await model.generateContent(prompt);
  return image_description.response.text() as string;
}

export async function generateImage(imageDescription : string,name :string) {
  const form = new FormData()
  const prompt = `${imageDescription}`;
  form.append('prompt', `${prompt}`)

  try {
    const response = await fetch('https://clipdrop-api.co/text-to-image/v1', {
      method: 'POST',
      headers: {
        'x-api-key': "15d2ae6daed9f80f9437e52d6b4fddfa11eba7c6a7890c7b9e07b73bdc13063570d78b5750b66be463f72ed317fb6cd5",
      },
      body: form,
    });

    if (!response.ok) {
      const errorText = await response.text(); 
      console.error(`Error generating image: ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    
    const imagePath = path.join('/Users/subhammahapatra/desktop', `${name.replace(/\s+/g, '-').toLowerCase()}.png`);

    console.log('Image generated successfully!');

    fs.writeFile(imagePath, Buffer.from(buffer), (err) => {
      if (err) {
        console.error('Error saving image:', err);
      } else {
        console.log(`Image saved successfully to ${imagePath}`);
      }
    });

   const imageUrl = await uploadOnCloudinary(imagePath)
   if(!imageUrl){
    return null;
   }
   return imageUrl.url as string

  } catch (error) {
    console.error('Error generating image:', error);
    throw error; 
}
}

// export async function generateImagePrompt(name: string) {
//   try {
//     const response = await openai.createChatCompletion({
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are an creative and helpful AI assistance capable of generating interesting thumbnail descriptions for my notes. Your output will be fed into the DALLE API to generate a thumbnail. The description should be minimalistic and flat styled",
//         },
//         {
//           role: "user",
//           content: `Please generate a thumbnail description for my notebook titles ${name}`,
//         },
//       ],
//     });
//     const data = await response.json();
//     const image_description = data.choices[0].message.content;
//     return image_description as string;
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }

// export async function generateImage(image_description: string) {
//   try {
//     const response = await openai.createImage({
//       prompt: image_description,
//       n: 1,
//       size: "256x256",
//     });
//     const data = await response.json();
//     const image_url = data.data[0].url;
//     return image_url as string;
//   } catch (error) {
//     console.error(error);
//   }

//   return "https://t4.ftcdn.net/jpg/02/66/72/41/360_F_266724172_Iy8gdKgMa7XmrhYYxLCxyhx6J7070Pr8.jpg";
// }

// export async function generateImage(Image : string) {  
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//   const prompt = `One Google Images of ${Image}`;
//   console.log(prompt);

//   const image_url = await model.generateContent(prompt);
//   console.log("image:", image_url.response.text());
//   // return image_url as string;
//   // return image_url.response.text() as string;
// }

// const fs = require('fs');