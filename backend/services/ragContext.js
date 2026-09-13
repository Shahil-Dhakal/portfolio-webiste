import Profile from '../models/Profile.js';
import Project from '../models/Project.js';
import Writing from '../models/Writing.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KNOWLEDGE_DIR = path.join(__dirname, '..', 'knowledge');

function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function scoreWriting(writing, queryWords) {
  const haystack = `${writing.title} ${writing.excerpt || ''} ${writing.content}`.toLowerCase();
  return queryWords.reduce((score, word) => (haystack.includes(word) ? score + 1 : score), 0);
}

async function retrieveRelevantWritings(question, limit = 3) {
  const queryWords = tokenize(question);
  if (queryWords.length === 0) return [];

  const allWritings = await Writing.find().select('title category excerpt content');
  const scored = allWritings
    .map((w) => ({ writing: w, score: scoreWriting(w, queryWords) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map((entry) => entry.writing);
}

function loadKnowledgeChunks() {
  if (!fs.existsSync(KNOWLEDGE_DIR)) return [];

  const files = fs.readdirSync(KNOWLEDGE_DIR).filter((f) => f.endsWith('.txt') || f.endsWith('.md'));
  const chunks = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(KNOWLEDGE_DIR, file), 'utf-8');
    const paragraphs = raw.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    paragraphs.forEach((text) => chunks.push({ source: file, text }));
  }

  return chunks;
}

function scoreChunk(chunk, queryWords) {
  const haystack = chunk.text.toLowerCase();
  return queryWords.reduce((score, word) => (haystack.includes(word) ? score + 1 : score), 0);
}

function retrieveRelevantKnowledge(question, limit = 4) {
  const queryWords = tokenize(question);
  if (queryWords.length === 0) return [];

  const chunks = loadKnowledgeChunks();
  return chunks
    .map((chunk) => ({ chunk, score: scoreChunk(chunk, queryWords) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.chunk);
}

function formatProfile(profile) {
  if (!profile) return 'No profile information available.';
  const lines = [
    `Name: ${profile.name}`,
    `Role: ${profile.role}`,
    profile.heroBody?.length ? `About:\n${profile.heroBody.join('\n\n')}` : null,
    profile.contact?.email ? `Contact email: ${profile.contact.email}` : null,
    profile.contact?.phone ? `Contact phone: ${profile.contact.phone}` : null
  ].filter(Boolean);
  return lines.join('\n');
}

function formatProjects(projects) {
  if (!projects.length) return 'No projects listed.';
  return projects
    .map((p) => `- ${p.name} (${p.role || 'contributor'}): ${p.description}`)
    .join('\n');
}

function formatWritings(writings) {
  if (!writings.length) return null;
  return writings
    .map((w) => `- "${w.title}" (${w.category}): ${w.excerpt || w.content.slice(0, 200)}`)
    .join('\n');
}

function formatKnowledge(chunks) {
  if (!chunks.length) return null;
  return chunks.map((c) => `- (from ${c.source}) ${c.text}`).join('\n\n');
}

export async function buildSystemPrompt(question) {
  const [profile, projects, writings] = await Promise.all([
    Profile.findOne(),
    Project.find().sort('order'),
    retrieveRelevantWritings(question)
  ]);

  const writingsSection = formatWritings(writings);
  const knowledgeSection = formatKnowledge(retrieveRelevantKnowledge(question));

  return `You are a personal assistant answering questions on behalf of ${profile?.name || 'the site owner'}, embedded in his portfolio website's chat page.

Rules you must follow strictly:
- Only answer using the information provided below in the CONTEXT section. Do not invent, assume, or guess any fact about ${profile?.firstName || profile?.name || 'him'} that is not stated there.
- Only discuss topics related to ${profile?.firstName || profile?.name || 'him'} — his background, skills, projects, and creative writing. If asked about anything unrelated (general knowledge, other people, coding help unrelated to his work, etc.), politely decline and steer the conversation back to asking about him.
- If the CONTEXT doesn't contain the answer to a question about him, say so in a casual, in-character way - something like "Boss hasn't briefed me on that one yet, you'll have to ask him directly" or "That's above my clearance level - haven't been updated on that." Never invent an answer just to avoid saying you don't know.
- Keep replies conversational and fairly brief, matching the tone of a real chat - not a formal report.
- Speak about him in the first person is NOT required - refer to him by name or "he", or "the boss", as a personal assistant would, not as if you are him.

CONTEXT

--- ABOUT ---
${formatProfile(profile)}

--- PROJECTS ---
${formatProjects(projects)}
${writingsSection ? `\n--- RELEVANT WRITINGS (matched to the current question) ---\n${writingsSection}` : ''}
${knowledgeSection ? `\n--- ADDITIONAL KNOWLEDGE (matched to the current question) ---\n${knowledgeSection}` : ''}`;
}