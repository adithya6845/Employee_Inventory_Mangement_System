import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const nvidia = new OpenAI({ 
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

async function testKey() {
  console.log('Testing NVIDIA key:', process.env.NVIDIA_API_KEY.substring(0, 15) + '...');
  try {
    const response = await nvidia.chat.completions.create({
      model: "meta/llama-3.1-70b-instruct",
      messages: [
        { role: "system", content: "You are a test assistant. Reply with 'OK'." },
        { role: "user", content: "Hello" }
      ],
      temperature: 0,
    });
    console.log('NVIDIA response:', response.choices[0].message.content.trim());
    console.log('✅ NVIDIA API Key is 100% Valid and Active!');
  } catch (error) {
    console.error('❌ NVIDIA API Key Error:', error.message);
  }
}

testKey();
