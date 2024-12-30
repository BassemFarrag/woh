import { GoogleGenerativeAI } from '@google/generative-ai';
import { languageService } from '../services/languageService.js';

const API_KEYS = [
  'AIzaSyD',
  'AIzaSyD'
];
let currentKeyIndex = 0;

function getNextAPIKey() {
  const key = API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return key;
}

// Initialize the API dynamically
function initializeGenerativeAI() {
  const apiKey = getNextAPIKey();
  try {
    return new GoogleGenerativeAI(apiKey);
  } catch (error) {
    console.error('Failed to initialize Gemini API with key:', apiKey, error);
    throw new Error('API initialization failed. Please try again later.');
  }
}
// Update the generateQuestions function
export async function generateQuestions(topic) {
  let genAI = initializeGenerativeAI();

  try {
    const { promptLang } = languageService.getCurrentLanguage();
    const prompt = `Generate 10 multiple choice questions about ${topic} in ${promptLang}. Return only a JSON array where each question object has this format:
    {
      "question": "the question text in ${promptLang}",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": "the correct option"
    }`;
//models: "gemini-pro" or "gemini-1.5-flash" or "gemini-1.5-flash-8b"
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });
    const result = await model.generateContent(prompt);
    
    if (!result || !result.response) {
      throw new Error('Failed to generate questions. Please try again.');
    }

    const response = result.response;
    const text = response.text();
    
    // Extract and validate JSON
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Invalid response format. Please try again.');
    }
    
    let questions;
    try {
      questions = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      throw new Error('Failed to process questions. Please try again.');
    }

    // Validate questions format
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('No questions were generated. Please try again.');
    }

    if (!questions.every(isValidQuestion)) {
      throw new Error('Invalid question format received. Please try again.');
    }
    
    return questions;
  } catch (error) {
    console.error('API Error:', error);
    
    // Handle specific error cases
    if (error.message.includes('API key')) {
      throw new Error('Service authentication failed. Please try again later.');
    }
    if (error.message.includes('PERMISSION_DENIED')) {
      throw new Error('Service access denied. Please try again later.');
    }
    if (error.message.includes('RESOURCE_EXHAUSTED')) {
      throw new Error('Service temporarily unavailable. Please try again later.');
    }
    
    // Throw user-friendly error message
    throw new Error(error.message || 'Failed to generate questions. Please try again.');
  }
}

function isValidQuestion(question) {
  return (
    question &&
    typeof question.question === 'string' &&
    Array.isArray(question.options) &&
    question.options.length === 4 &&
    typeof question.correctAnswer === 'string' &&
    question.options.includes(question.correctAnswer)
  );
}