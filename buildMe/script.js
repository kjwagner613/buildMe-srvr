document.getElementById('generateBtn').addEventListener('click', async () => {
  const prompt = document.getElementById('prompt').value;
  const scene = document.getElementById('scene').value;
  const dialogue = document.getElementById('dialogue').value;
  const styleInput = document.getElementById('style').value;

  try {
    const response = await fetch('/.netlify/functions/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, scene, dialogue, styleInput, tone: styleInput })
    });

    const data = await response.json();
    const story = data.text || '⚠️ No response from model.';

    document.getElementById('output').textContent = story;
  } catch (err) {
    document.getElementById('output').textContent = '🔥 Something went wrong.';
    console.error('🧨 Form submission error:', err);
  }
});