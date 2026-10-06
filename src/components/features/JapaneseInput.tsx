'use client';

import { useState } from 'react';
import { toKana } from 'wanakana';
import { getKanaSet, type KanaScript } from '@/lib/content/kana';
import {
  DAKUTEN_KEY,
  DAKUTEN_MAP,
  HANDAKUTEN_KEY,
  HANDAKUTEN_MAP,
  KANA_KEY_MAP,
  KANA_KEY_MAP_SHIFT,
} from '@/lib/japanese/kanaKeys';
import { Button } from '@/components/ui/Button';

type InputMode = 'romaji' | 'kana-keys';

const KEY_ROWS: string[][] = [
  [
    'Digit1',
    'Digit2',
    'Digit3',
    'Digit4',
    'Digit5',
    'Digit6',
    'Digit7',
    'Digit8',
    'Digit9',
    'Digit0',
    'Minus',
    'Equal',
  ],
  [
    'KeyQ',
    'KeyW',
    'KeyE',
    'KeyR',
    'KeyT',
    'KeyY',
    'KeyU',
    'KeyI',
    'KeyO',
    'KeyP',
    DAKUTEN_KEY,
    HANDAKUTEN_KEY,
  ],
  ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote'],
  ['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash'],
];

function toScript(char: string, script: KanaScript): string {
  if (script === 'hiragana') return char;
  return [...char].map((c) => String.fromCodePoint(c.codePointAt(0)! + 0x60)).join('');
}

function toHiraganaBase(char: string, script: KanaScript): string {
  if (script === 'hiragana') return char;
  return [...char].map((c) => String.fromCodePoint(c.codePointAt(0)! - 0x60)).join('');
}

export function JapaneseInput({
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  const [script, setScript] = useState<KanaScript>('hiragana');
  const [mode, setMode] = useState<InputMode>('romaji');
  const [showKeyboard, setShowKeyboard] = useState(false);

  function applyDakuten(map: Record<string, string>) {
    const last = value.slice(-1);
    const base = toHiraganaBase(last, script);
    const voiced = map[base];
    if (voiced) onChange(value.slice(0, -1) + toScript(voiced, script));
  }

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    if (mode === 'kana-keys') {
      onChange(event.target.value);
      return;
    }
    const converted = toKana(event.target.value, {
      IMEMode: script === 'hiragana' ? 'toHiragana' : 'toKatakana',
    });
    onChange(converted);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (mode !== 'kana-keys') return;
    const code = event.code;

    if (code === DAKUTEN_KEY || code === HANDAKUTEN_KEY) {
      event.preventDefault();
      applyDakuten(code === DAKUTEN_KEY ? DAKUTEN_MAP : HANDAKUTEN_MAP);
      return;
    }

    const char = (event.shiftKey && KANA_KEY_MAP_SHIFT[code]) || KANA_KEY_MAP[code];
    if (char) {
      event.preventDefault();
      onChange(value + toScript(char, script));
    }
  }

  function insertCharacter(character: string) {
    onChange(value + character);
  }

  function pressKey(code: string) {
    if (code === DAKUTEN_KEY || code === HANDAKUTEN_KEY) {
      applyDakuten(code === DAKUTEN_KEY ? DAKUTEN_MAP : HANDAKUTEN_MAP);
      return;
    }
    const char = KANA_KEY_MAP[code];
    if (char) onChange(value + toScript(char, script));
  }

  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        rows={rows}
        placeholder={placeholder}
        className="font-jp border-border bg-background text-foreground focus:border-accent focus:ring-accent/30 rounded-lg border px-3.5 py-2.5 outline-none focus:ring-2"
      />
      <div className="flex flex-wrap items-center gap-2">
        <div className="bg-surface-sunken flex gap-1 rounded-full p-1 text-sm">
          {(['hiragana', 'katakana'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setScript(option)}
              className={`rounded-full px-3 py-1 font-semibold capitalize transition-colors ${
                script === option
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="bg-surface-sunken flex gap-1 rounded-full p-1 text-sm">
          {(
            [
              ['romaji', 'Romaji'],
              ['kana-keys', 'Kana keys'],
            ] as const
          ).map(([option, label]) => (
            <button
              key={option}
              type="button"
              onClick={() => setMode(option)}
              className={`rounded-full px-3 py-1 font-semibold transition-colors ${
                mode === option
                  ? 'bg-accent-2 text-accent-2-foreground'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={() => setShowKeyboard((v) => !v)}>
          {showKeyboard ? 'Hide keyboard' : 'Show keyboard'}
        </Button>
      </div>
      <p className="text-muted text-xs">
        {mode === 'romaji'
          ? `Type romaji (e.g. "nihongo") — it converts to ${script} as you go.`
          : 'Your physical keys map directly to kana, like a real JIS kana keyboard — press the ゛/゜ keys right after か/さ/た/は row kana to voice them.'}
      </p>
      {showKeyboard && mode === 'romaji' && (
        <div className="border-border bg-surface-sunken flex flex-wrap gap-1 rounded-lg border p-2">
          {getKanaSet(script).map((kana) => (
            <button
              key={kana.character}
              type="button"
              onClick={() => insertCharacter(kana.character)}
              className="font-jp border-border bg-surface hover:border-accent/50 hover:bg-accent/5 flex h-9 w-9 items-center justify-center rounded-md border text-base transition-colors"
            >
              {kana.character}
            </button>
          ))}
        </div>
      )}
      {showKeyboard && mode === 'kana-keys' && (
        <div className="border-border bg-surface-sunken flex flex-col gap-1 rounded-lg border p-2">
          {KEY_ROWS.map((row, i) => (
            <div key={i} className="flex gap-1" style={{ marginLeft: `${i * 1}rem` }}>
              {row.map((code) => {
                const isMark = code === DAKUTEN_KEY || code === HANDAKUTEN_KEY;
                const base = isMark
                  ? code === DAKUTEN_KEY
                    ? '゛'
                    : '゜'
                  : toScript(KANA_KEY_MAP[code] ?? '', script);
                const shiftChar = KANA_KEY_MAP_SHIFT[code];
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => pressKey(code)}
                    className="font-jp border-border bg-surface hover:border-accent/50 hover:bg-accent/5 relative flex h-10 w-10 items-center justify-center rounded-md border text-base transition-colors"
                  >
                    {base}
                    {shiftChar && (
                      <span className="font-jp text-muted absolute top-0.5 right-1 text-[0.6rem]">
                        {toScript(shiftChar, script)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
