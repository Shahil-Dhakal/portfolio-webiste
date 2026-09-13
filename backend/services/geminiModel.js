// Figures out which Gemini model to use automatically, so the only thing
// you need to set is GEMINI_API_KEY — no model name to look up or guess.
//
// Google retires/renames Flash models fairly often, and their model-list
// endpoint sometimes still advertises a model as usable for a few days
// after it actually stops working for new API keys. So instead of trusting
// a single "best" pick forever, we keep a ranked list and let the caller
// (chat.js) fall through to the next one if the first turns out to be dead.

let cachedCandidates = null;

function extractVersion(id) {
  const match = id.match(/gemini-(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

function isTextFlashModel(id) {
  return id.includes('flash') && !/image|audio|tts|vision|embedding|live|native/.test(id);
}

async function fetchCandidates(apiKey) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Could not list Gemini models — check that GEMINI_API_KEY is correct. (${text})`);
  }

  const data = await res.json();
  const all = (data.models || [])
    .filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
    .map((m) => m.name.replace('models/', ''));

  const flashModels = all.filter(isTextFlashModel);
  const pool = flashModels.length ? flashModels : all;

  return pool.sort((a, b) => {
    const versionDiff = extractVersion(b) - extractVersion(a);
    if (versionDiff !== 0) return versionDiff;
    const rank = (id) => (id.includes('preview') || id.includes('exp') ? 1 : 0);
    return rank(a) - rank(b);
  });
}

export async function getModelCandidates(apiKey) {
  if (process.env.GEMINI_MODEL) return [process.env.GEMINI_MODEL];
  if (cachedCandidates) return cachedCandidates;

  cachedCandidates = await fetchCandidates(apiKey);
  if (cachedCandidates.length === 0) {
    throw new Error('This API key has no usable text models available.');
  }

  console.log('Gemini: candidate models in order —', cachedCandidates.slice(0, 5).join(', '));
  return cachedCandidates;
}

export function demoteModel(modelId) {
  if (!cachedCandidates) return;
  cachedCandidates = cachedCandidates.filter((id) => id !== modelId).concat(modelId);
}