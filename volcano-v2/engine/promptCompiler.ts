import { MODEL_PROFILES } from './modelProfiles';
import type { VolcanoModel } from './modelProfiles';

function clean(arr: string[]) {
  const out: string[] = [];
  for (const x of arr) {
    const t = (x ?? '').trim();
    if (!t) continue;
    if (!out.some(y => y.toLowerCase() === t.toLowerCase())) out.push(t);
  }
  return out;
}

export function compilePrompt({
  model,
  subject,
  descriptors,
  negative,
}: {
  model: VolcanoModel;
  subject: string;
  descriptors: string[];
  negative: string[];
}) {
  const profile = MODEL_PROFILES[model];
  const s = (subject ?? '').trim();
  const desc = clean(descriptors);
  const neg = clean(negative);

  if (!s && desc.length === 0) return '';

  if (profile.prefersSentences) {
    // Image Gen 1.5: more prose-friendly
    const sentences = [s].filter(Boolean);
    for (const d of desc) sentences.push(d);
    return sentences.filter(Boolean).join('. ') + (sentences.length ? '.' : '');
  }

  // Nano Banana Pro: dense, comma separated with optional negatives
  let prompt = [s, ...desc].filter(Boolean).join(', ');

  if (profile.supportsNegative && neg.length) {
    prompt += `\n\nNegative: ${neg.join(', ')}`;
  }

  return prompt;
}
