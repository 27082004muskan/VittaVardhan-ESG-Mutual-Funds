// Quick test script to verify OpenAI API and server setup
require('dotenv').config();
const OpenAI = require('openai');

console.log('🧪 Testing OpenAI API Setup...\n');

// Check if API key exists
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ ERROR: OPENAI_API_KEY not found in .env file!');
  console.error('Please make sure your .env file contains:');
  console.error('OPENAI_API_KEY=your_api_key_here');
  process.exit(1);
}

console.log('✅ API Key found in environment');
console.log('✅ API Key starts with:', process.env.OPENAI_API_KEY.substring(0, 10) + '...');

// Test OpenAI connection
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function testOpenAI() {
  try {
    console.log('\n🧪 Testing OpenAI API call...');
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant. Respond with just 'Hello, I am working!'"
        },
        {
          role: "user",
          content: "Say hello"
        }
      ],
      max_tokens: 50,
    });

    const response = completion.choices[0].message.content;
    console.log('✅ OpenAI API is working!');
    console.log('📝 Response:', response);
    console.log('\n🎉 Everything is set up correctly!');
    console.log('💡 Now start your server with: npm start');
    
  } catch (error) {
    console.error('\n❌ OpenAI API Error:');
    console.error('Error message:', error.message);
    
    if (error.status === 401) {
      console.error('\n💡 This means your API key is invalid. Please check:');
      console.error('1. Your API key is correct');
      console.error('2. Your API key has credits');
      console.error('3. Your API key hasn\'t expired');
    } else if (error.status === 429) {
      console.error('\n💡 Rate limit exceeded. Please try again later.');
    } else {
      console.error('\n💡 Please check your internet connection and API key.');
    }
    process.exit(1);
  }
}

testOpenAI();

