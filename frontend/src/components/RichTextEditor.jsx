import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Document from '@tiptap/extension-document';

import { updateJournal } from '../services/api';

// Custom document with fixed structure
const CustomDocument = Document.extend({
  content: 'heading paragraph block*',
});

const Editor = ({ note, onNoteUpdate }) => {
  const editor = useEditor({
    extensions: [
      CustomDocument,
      StarterKit.configure({
        heading: false,
        paragraph: false,
      }),
      Heading.configure({ levels: [1] }),
      Paragraph,
      Text,
    ],
    editorProps: {
      attributes: {
        class:
          'tiptap bg-[#1e1e1e] text-gray-100 w-full min-h-screen focus:outline-none p-0 m-0',
      },
    },
    content: '',
    onUpdate: ({ editor }) => {
      if (note?.type === 'note') {
        const html = editor.getHTML();
        updateJournal(note.id, { ...note, content: html })
          .then(() => onNoteUpdate({ ...note, content: html }))
          .catch(console.error);
      }
    },
  });

  useEffect(() => {
    if (editor && note?.type === 'note') {
      const defaultContent = `
        <h1></h1>
        <p class="description"></p>
        <hr class="content-separator" />
        <p></p>
      `;
      editor.commands.setContent(note.content || defaultContent);
    }
  }, [note, editor]);

  if (!note) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 bg-[#1e1e1e]">
        <h2>Select or create a note to start writing...</h2>
      </div>
    );
  }

  if (note.type === 'ai' || note.type === 'ai_chat') {
    return (
      <div className="p-6 text-gray-400 bg-[#1e1e1e] h-full">
        <h2 className="text-xl font-semibold mb-2">AI Conversation</h2>
        <p>This space will show your chat with the AI.</p>
      </div>
    );
  }

  return (
    <div className="relative bg-[#1e1e1e] text-white h-screen overflow-y-auto px-6 py-6 pl-[250px]">
      {/* Adjust pl-[250px] to match your sidebar width */}
      <EditorContent editor={editor} />
      <style>{`
        .tiptap {
          padding: 0;
          margin: 0;
          background: #1e1e1e;
        }

        .ProseMirror {
          outline: none;
          border: none;
        }

        .tiptap h1 {
          font-size: 1.875rem; /* text-2xl */
          font-weight: bold;
          margin-bottom: 0.5rem;
          position: relative;
        }

        .tiptap p.description {
          font-size: 1rem; /* text-base */
          color: #aaa;
          margin-bottom: 1.25rem;
          position: relative;
        }

        .tiptap h1:empty::before {
          content: "Enter title here...";
          color: #666;
          font-style: italic;
          position: absolute;
          left: 0;
          pointer-events: none;
        }

        .tiptap p.description:empty::before {
          content: "Enter description here...";
          color: #666;
          font-style: italic;
          position: absolute;
          left: 0;
          pointer-events: none;
        }

        .tiptap p:not(.description):empty::before {
          content: "Start writing your content here...";
          color: #666;
          font-style: italic;
          position: absolute;
          left: 0;
          pointer-events: none;
        }

        .content-separator {
          border-top: 1px solid #333;
          margin: 1rem 0;
        }
      `}</style>
    </div>
  );
};

export default Editor;
