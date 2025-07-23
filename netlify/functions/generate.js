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
Scene: ${scene}
Dialogue and emotion: ${dialogue}
Style notes: ${styleInput}

Begin mid-action. Avoid repeating input text verbatim. Use sensory details, dynamic pacing, and internal reflection to shape the moment.
`
            })
        });

        const result = await hfResponse.json();
        console.log('🐾 Hugging Face response:', result);
        return {
            statusCode: 200,
            body: JSON.stringify({ text: result?.[0]?.generated_text || '⚠️ No response from model.' })
        };
    } catch (err) {
        console.error('🔥 Hugging Face error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Something went wrong with the AI request.' })
        };
    }
};