// Vercel serverless function (runs on the server, never in the browser).
// This is what keeps the Anthropic API key secret — the frontend calls this
// endpoint instead of Anthropic directly, so the key never appears in any
// request a visitor's browser can see.
//
// Requires an ANTHROPIC_API_KEY environment variable set in the Vercel
// project dashboard (Settings -> Environment Variables) and a redeploy
// after adding it.

const SYSTEM_PROMPT = `You are Voyora's AI Guide, a friendly, concise travel assistant embedded in the Voyora travel website. Voyora has destination guides for 32 places: Paris, Austria, Spain, Tokyo, Dubai, Sydney, New York, Rio de Janeiro, Italy, Thailand, Switzerland, South Korea, Germany, Vietnam, Singapore, India, Greece, Turkiye, Mexico, UK, Saudi Arabia, Portugal, Malaysia, Netherlands, Hong Kong, Croatia, Indonesia, Poland, Canada, Ireland, Morocco, and Egypt.

Help with packing, best times to visit, itinerary structure, local food, and general trip-planning questions. Keep answers short and practical — a few sentences or a short list, not an essay. When a question is about a destination Voyora covers, mention that a fuller guide exists on its Voyora destination page. If asked something unrelated to travel, briefly and kindly redirect to travel topics. Never state visa or entry requirements with false confidence — give general guidance and tell the traveler to confirm current rules with the relevant embassy or official government site, since these change often.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY is not set in this environment.');
    return res.status(500).json({ error: 'AI Guide is not configured yet.' });
  }

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'A messages array is required.' });
  }

  // Bound both history length and per-message size so one runaway
  // conversation can't blow up token cost or the request payload.
  const trimmed = messages.slice(-10).map((m) => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: String(m.content || '').slice(0, 4000),
  }));

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 600,
        system: SYSTEM_PROMPT,
        messages: trimmed,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error:', response.status, errText);
      return res
        .status(502)
        .json({ error: 'AI Guide had trouble responding. Please try again.' });
    }

    const data = await response.json();
    const reply = data.content?.find((block) => block.type === 'text')?.text || '';

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('AI Guide handler error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
