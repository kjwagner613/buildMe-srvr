const fetch = require('node-fetch');
const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;
const MODEL_URL = 'https://api-inference.huggingface.co/models/gpt2';

exports.handler = async function (event, context) {
  const { prompt, tone, scene, dialogue, styleInput } = JSON.parse(event.body || '{}');

  try {
    const hfResponse = await fetch(MODEL_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: `
You are an expert fiction writer. Write a vivid, emotionally charged story scene using the following elements:

Prompt: ${prompt}
Tone: ${tone}
Scene: ${scene}
Dialogue and emotion: ${dialogue}
Style notes: ${styleInput}

Begin mid-action. Avoid repeating input text verbatim. Use sensory details, dynamic pacing, and internal reflection to shape the moment.
`
      })
    });

    console.log('🧠 HF status:', hfResponse.status);
    const rawText = await hfResponse.text();
    console.log('🧨 Raw HF response:', rawText);

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (e) {
      console.error('💥 Failed to parse JSON:', e);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Invalid JSON returned from Hugging Face.' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ text: parsed?.[0]?.generated_text || '⚠️ No response from model.' })
    };
  } catch (err) {
    console.error('🔥 Hugging Face error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Something went wrong with the AI request.' })
    };
  }
};
