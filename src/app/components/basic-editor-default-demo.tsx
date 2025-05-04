'use client';

import React, { useMemo, useCallback } from 'react';
import { createPlateEditor, Plate, PlateContent } from '@udecode/plate/react';
import { HighlightPlugin } from '@udecode/plate-highlight/react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';

const initialValue = [
  // set the initial text in the editor
  { type: 'paragraph',
    children: [
      { text: 'Type something here… Try using the words ' },
      { text: 'happy' },
      { text: ' or ' },
      { text: 'sad' },
      { text: ' to see highlighting!' },
    ],
  },
];

export default function BasicEditorDefaultDemo() {
  // create PlateEditor with highlight plugin
  const editor = useMemo(
    () =>
      createPlateEditor({
        value: initialValue,
        plugins: [HighlightPlugin],
      }),
    []
  );

  // decorate “happy”/“sad” by checking for node.text
  const decorate = useCallback(
    ({ entry: [node, path] }: { entry: [any, any] }) => {
      const ranges: any[] = [];
      if (typeof (node as any).text !== 'string') return ranges;

      const text = (node as any).text as string;
      let m: RegExpExecArray | null;

      const highlightWord = (re: RegExp, emotion: 'happy' | 'sad') => {
        while ((m = re.exec(text)) !== null) {
          ranges.push({
            anchor: { path, offset: m.index },
            focus: { path, offset: m.index + m[0].length },
            highlight: true,
            emotion,
          });
        }
      };

      // highlight happy/sad words
      highlightWord(/\bhappy\b/gi, 'happy');
      highlightWord(/\bsad\b/gi, 'sad');

      return ranges;
    },
    []
  );

  // renderLeaf is unchanged
  const renderLeaf = useCallback(({ attributes, children, leaf }: any) => {
    if (leaf.highlight) {
      const bg = leaf.emotion === 'happy' ? '#FFEB3B' : '#FFB6C1';
      const msg =
        leaf.emotion === 'happy'
          // happy message
          ? 'Great job! Keep up the positive vibes!'
          // sad message
          : 'Don\'t worry, it\'s okay to feel sad sometimes.';

      return (
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <mark
              {...attributes}
              style={{
                backgroundColor: bg,
                padding: '0 3px',
                borderRadius: '3px',
                cursor: 'pointer',
              }}
            >
              {children}
            </mark>
          </HoverCardTrigger>
          <HoverCardContent className="text-sm">{msg}</HoverCardContent>
        </HoverCard>
      );
    }
    return <span {...attributes}>{children}</span>;
  }, []);

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-3">Emotion Highlighting Editor</h2>
      <p className="mb-4">
        Type words like <code>"happy"</code> or <code>"sad"</code> to see them
        highlighted with hover cards!
      </p>
      <div className="border border-gray-200 rounded-lg p-4 min-h-[150px]">
        <Plate editor={editor} decorate={decorate} renderLeaf={renderLeaf}>
          <PlateContent
            placeholder="Type something..."
            className="min-h-[100px]"
          />
        </Plate>
      </div>
    </div>
  );
}
