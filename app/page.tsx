'use client';

import { useMemo, useState } from 'react';

/* ======================
   COMPONENT IMPORTS
   page.tsx is at: /app/studio/page.tsx
   components are at: /components
   ====================== */

import { LearningModeSwitch } from '../../components/LearningModeSwitch';
import { ModeSwitch } from '../../components/ModeSwitch';
import { IntentInput } from '../../components/IntentInput';
import { PromptPreview } from '../../components/PromptPreview';
import { IntelligencePanel } from '../../components/IntelligencePanel';
import { GlossaryPanel } from '../../components/GlossaryPanel';
import { StyleDNABlender } from '../../components/StyleDNABlender';
import { ColorIntelligence } from '../../components/ColorIntelligence';
import { ImageReferenceInput } from '../../components/ImageReferenceInput';
import { ExplainPrompt } from '../../components/ExplainPrompt';

/* ======================
   ENGINE IMPORTS
   ====================== */

import { compilePrompt } from '../../engine/promptCompiler';
import { lintPrompt } from '../../engine/qualityLinter';
import { suggestForModel } from '../../engine/modelAdvisor';
import { suggestModifiers } from '../../engine/modifierSuggester';

import type { VolcanoModel } from '../../engine/modelProfiles';
import type { LearningMode } from '../../engine/learningModes';
import { LEARNING_MODE } from '../../engine/learningModes';

/* ======================
   PAGE
   ====================== */

export default function StudioPage() {
  const [model, setModel] = useState<VolcanoModel>('chatgpt_image_1_5');
  const [learningMode, setLearningMode] = useState<LearningMode>('beginner');

  const [subject, setSubject] = useState('');
  const [descriptors, setDescriptors] = useState<string[]>([]);
  const [negative, setNegative] = useState<string[]>([]);

  const [activeTab, setActiveTab] =
    useState<'studio' | 'glossary' | 'styleDNA' | 'color' | 'image' | 'explain'>(
      'studio'
    );

  /* ======================
     DERIVED DATA
     ====================== */

  const compiledPrompt = useMemo(
    () => compilePrompt({ model, subject, descriptors, negative }),
    [model, subject, descriptors, negative]
  );

  const warnings = useMemo(
    () =>
      lintPrompt({
        model,
        subject,
        descriptors,
        negative,
        strictness: LEARNING_MODE[learningMode].lintStrictness,
      }),
    [model, subject, descriptors, negative, learningMode]
  );

  const modelTips = useMemo(() => suggestForModel(model), [model]);
  const missingSuggestions = useMemo(
    () => suggestModifiers(subject, descriptors),
    [subject, descriptors]
  );

  /* ======================
     HELPERS
     ====================== */

  const addDescriptor = (text: string) => {
    const token = text.trim();
    if (!token) return;

    setDescriptors((prev) =>
      prev.some((d) => d.toLowerCase() === token.toLowerCase())
        ? prev
        : [...prev, token]
    );
  };

  const addNegative = (text: string) => {
    const token = text.trim();
    if (!token) return;

    setNegative((prev) =>
      prev.some((d) => d.toLowerCase() === token.toLowerCase())
        ? prev
        : [...prev, token]
    );
  };

  const removeDescriptor = (idx: number) =>
    setDescriptors((prev) => prev.filter((_, i) => i !== idx));

  const removeNegative = (idx: number) =>
    setNegative((prev) => prev.filter((_, i) => i !== idx));

  const ui = LEARNING_MODE[learningMode];

  /* ======================
     RENDER
     ====================== */

  return (
    <main className="studio">
      {/* ===== Header ===== */}
      <header className="topbar">
        <div className="brand">
          <div className="badge">VOLCANO</div>
          <div>
            <div className="title">Virtuoso AI Art Assistant</div>
            <div className="subtitle">Model-aware prompt studio</div>
          </div>
        </div>

        <div className="topControls">
          <LearningModeSwitch mode={learningMode} setMode={setLearningMode} />
          <ModeSwitch model={model} setModel={setModel} />
        </div>
      </header>

      {/* ===== Tabs ===== */}
      <nav className="tabs">
        {[
          ['studio', 'Studio'],
          ['glossary', 'Glossary'],
          ['styleDNA', 'Style DNA'],
          ['color', 'Color'],
          ['image', 'Image'],
          ['explain', 'Explain'],
        ].map(([key, label]) => (
          <button
            key={key}
            className={activeTab === key ? 'tab active' : 'tab'}
            onClick={() => setActiveTab(key as any)}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* ===== Layout ===== */}
      <section className="grid">
        {/* ===== Main Column ===== */}
        <section className="col main">
          <IntentInput
            subject={subject}
            setSubject={setSubject}
            onAddDescriptor={addDescriptor}
            onAddNegative={addNegative}
            density={ui.uiDensity}
          />

          <PromptPreview
            model={model}
            subject={subject}
            descriptors={descriptors}
            negative={negative}
            compiled={compiledPrompt}
            onRemoveDescriptor={removeDescriptor}
            onRemoveNegative={removeNegative}
          />
        </section>

        {/* ===== Side Column ===== */}
        <aside className="col side">
          <IntelligencePanel
            learningMode={learningMode}
            model={model}
            warnings={warnings}
            modelTips={modelTips}
            missingSuggestions={missingSuggestions}
            onAddDescriptor={addDescriptor}
            onAddNegative={addNegative}
          />

          {activeTab === 'glossary' && (
            <GlossaryPanel onAddToken={addDescriptor} />
          )}

          {activeTab === 'styleDNA' && (
            <StyleDNABlender
              onApply={(pack) => {
                pack.core.forEach(addDescriptor);
                pack.motifs.forEach(addDescriptor);
                pack.lighting.forEach(addDescriptor);
                pack.camera.forEach(addDescriptor);
                pack.materials.forEach(addDescriptor);
                pack.colorBias.forEach(addDescriptor);
                pack.bridge.forEach(addDescriptor);
              }}
            />
          )}

          {activeTab === 'color' && (
            <ColorIntelligence
              onAddColorWords={(words) => words.forEach(addDescriptor)}
            />
          )}

          {activeTab === 'image' && (
            <ImageReferenceInput
              onExtract={(info) => {
                info.suggestions.forEach(addDescriptor);
              }}
            />
          )}

          {activeTab === 'explain' &&
            (ui.showExplain ? (
              <ExplainPrompt
                model={model}
                subject={subject}
                descriptors={descriptors}
                negative={negative}
              />
            ) : (
              <div className="card mutedSmall">
                Explain mode is hidden in PRO learning mode.
              </div>
            ))}
        </aside>
      </section>
    </main>
  );
}