import { generateTextResilient } from './src/lib/ai-gateway';

async function test(){
  try {
    const result = await generateTextResilient({
      system: '',
      prompt: 'Say hello',
    });
    console.log('Result:', result);
  } catch(e){
    console.error('Error:', e);
  }
}

test();
