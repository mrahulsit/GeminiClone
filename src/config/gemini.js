import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from '@google/generative-ai';
  
  const MODEL_NAME = "gemini-1.0-pro";
  const API_KEY = "AIzaSyDF7iVgGWCF6qAlhsbgIpWUKDkNMzOrBa8";
  
  async function runChat(prompt) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const chat = model.startChat({
      generationConfig,
      history: [
      ],
    });

    const result = await chat.sendMessage(prompt);
    const response = result.response;
    console.log(response);
    return response.text();
  
    // const safetySettings = [
    //   {
    //     category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    //     threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    //   },
    //   {
    //     category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    //     threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    //   },
    //   {
    //     category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    //     threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    //   },
    //   {
    //     category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    //     threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    //   },
    // ];
  }
  
  export default runChat;