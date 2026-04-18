"use client";

import { useState } from "react";

export interface StoryFrame {
  title: string;
  body: string;
  screen: React.ReactNode;
  note?: string;
}

export function Storyboard({ frames }: { frames: StoryFrame[] }) {
  const [i, setI] = useState(0);
  const f = frames[i];

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <div className="mb-3 text-xs uppercase tracking-wider text-[var(--color-muted)]">
          Frame {i + 1} of {frames.length}
        </div>
        <h2 className="mb-3 text-2xl font-semibold leading-tight">{f.title}</h2>
        <p className="text-[var(--color-muted)] leading-relaxed">{f.body}</p>
        {f.note && (
          <p className="mt-4 rounded-lg border border-dashed border-[var(--color-line)] bg-[var(--color-paper)] p-3 text-xs text-[var(--color-muted)]">
            {f.note}
          </p>
        )}
        <div className="mt-6 flex gap-2">
          <button
            onClick={() => setI(Math.max(0, i - 1))}
            disabled={i === 0}
            className="rounded-full border border-[var(--color-line)] px-4 py-1.5 text-sm disabled:opacity-30"
          >
            ← Previous
          </button>
          <button
            onClick={() => setI(Math.min(frames.length - 1, i + 1))}
            disabled={i === frames.length - 1}
            className="rounded-full bg-[var(--color-ink)] px-4 py-1.5 text-sm text-[var(--color-bone)] disabled:opacity-30"
          >
            Next →
          </button>
        </div>
        <div className="mt-6 flex gap-1">
          {frames.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={`h-1.5 flex-1 rounded-full transition ${
                idx === i ? "bg-[var(--color-ink)]" : "bg-[var(--color-line)]"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="lg:col-span-3">
        <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] p-6 min-h-[420px]">
          {f.screen}
        </div>
      </div>
    </div>
  );
}
