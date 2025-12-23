'use client';

import { useMemo, useState } from 'react';
import { LearningModeSwitch } from '@/components/LearningModeSwitch';
import { ModeSwitch } from '@/components/ModeSwitch';
import { IntentInput } from '@/components/IntentInput';
import { PromptPreview } from '@/components/PromptPreview';
import { IntelligencePanel } from '@/components/IntelligencePanel';
import { GlossaryPanel } from '@/components/GlossaryPanel';
import { StyleDNABlender } from '@/components/StyleDNABlender';
import { ColorIntelligence } from '@/components/ColorIntelligence';
import { ImageReferenceInput } from '@/components/ImageReferenceInput';
import { ExplainPrompt } from '@/components/ExplainPrompt';

import { compilePrompt } from '@/engine/promptCompiler';
import { lintPrompt } from '@/engine/qualityLinter';
import { suggestForModel } from '@/engine/modelAdvisor';
import { suggestModifiers } from '@/engine/modifierSuggester';
import type { VolcanoModel } from '@/engine/modelProfiles';
import type { LearningMode } from '@/engine/learningModes';
import { LEARNING_MODE } from '@/engine/learningModes';

export default function StudioPage() {
  const [model, setModel] = useState<VolcanoModel>('chatgpt_image_1_5');
  const [learningMode, setLearningMode] = useState<LearningMode>('beginner');
  const [subject, setSubject] = useState('');
  const [descriptors, setDescriptors] = useState<string[]>([]);
  const [negative, setNegative] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'studio'|'glossary'|'styleDNA'|'color'|'image'|'explain'>('studio');

  const compiled = useMemo(() => compilePrompt({ model, subject, descriptors, negative }), [model, subject, descriptors, negative]);
  const warnings = useMemo(() => lintPrompt({ model, subject, descriptors, negative, strictness: LEARNING_MODE[learningMode].lintStrictness }), [model, subject, descriptors, negative, learningMode]);
  const modelTips = useMemo(() => suggestForModel(model), [model]);
  const missingSuggestions = useMemo(() => suggestModifiers(subject, descriptors), [subject, descriptors]);

  const addDescriptor = (t: string) => {
    const token = (t ?? '').trim();
    if (!token) return;
    setDescriptors(prev => {
      const exists = prev.some(x => x.toLowerCase() === token.toLowerCase());
      return exists ? prev : [...prev, token];
    });
  };

  const addNegative = (t: string) => {
    const token = (t ?? '').trim();
    if (!token) return;
    setNegative(prev => {
      const exists = prev.some(x => x.toLowerCase() === token.toLowerCase());
      return exists ? prev : [...prev, token];
    });
  };

  const removeDescriptor = (idx: number) => setDescriptors(prev => prev.filter((_, i) => i !== idx));
  const removeNegative = (idx: number) => setNegative(prev => prev.filter((_, i) => i !== idx));

  const ui = LEARNING_MODE[learningMode];

  return (
    <main className="studio">
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

      <nav className="tabs">
        {([
          ['studio','Studio'],
          ['glossary','Glossary'],
          ['styleDNA','Style DNA'],
          ['color','Color'],
          ['image','Image'],
          ['explain','Explain'],
        ] as const).map(([k, label]) => (
          <button key={k} className={activeTab === k ? 'tab active' : 'tab'} onClick={() => setActiveTab(k)}>
            {label}
          </button>
        ))}
      </nav>

      <section className="grid">
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
            compiled={compiled}
            onRemoveDescriptor={removeDescriptor}
            onRemoveNegative={removeNegative}
          />
        </section>

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
            <StyleDNABlender onApply={(pack) => {
              pack.core.forEach(addDescriptor);
              pack.motifs.forEach(addDescriptor);
              pack.lighting.forEach(addDescriptor);
              pack.camera.forEach(addDescriptor);
              pack.materials.forEach(addDescriptor);
              pack.colorBias.forEach(addDescriptor);
              pack.bridge.forEach(addDescriptor);
            }} />
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

          {activeTab === 'explain' && (
            ui.showExplain ? <ExplainPrompt model={model} subject={subject} descriptors={descriptors} negative={negative} />
            : <div className="card mutedSmall">Explain mode is hidden in PRO learning mode (switch to Beginner/Intermediate).</div>
          )}
        </aside>
      </section>
    </main>
  );
}
