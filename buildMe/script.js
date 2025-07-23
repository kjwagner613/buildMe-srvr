document.getElementById('generateBtn').addEventListener('click', async () => {
  const prompt = document.getElementById('prompt').value;
  const tone = document.getElementById('tone').value;
  const scene = document.getElementById('scene').value;
  const dialogue = document.getElementById('dialogue').value;
  const styleInput = document.getElementById('style').value;

  try {
    const response = await fetch('/.netlify/functions/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, tone, scene, dialogue, styleInput })
    });

    const out = document.getElementById('output');
    const raw = await response.text();
    if (!response.ok) {
      out.value = `HTTP ${response.status}\n${raw}`;
      return;
    }
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      out.value = `Invalid JSON from function:\n${raw}`;
      return;
    }
    if (data.error) {
      out.value = data.details ? `${data.error}\n${data.details}` : data.error;
    } else {
      out.value = data.text;
    }
  } catch (err) {
    const out = document.getElementById('output');
    out.value = `🔥 Fetch error: ${err.message}`;
    console.error('🧨 Form submission error:', err);
  }
});
