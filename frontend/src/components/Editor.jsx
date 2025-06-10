import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Document from '@tiptap/extension-document';

import { updateJournal } from '../services/api';

// Custom document with fixed structure: heading, description, then rest
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
      Heading.configure({
        levels: [1],
      }),
      Paragraph,
      Text,
    ],
    editorProps: {
      attributes: {
        class:
          'tiptap bg-[#1e1e1e] text-gray-100 min-h-screen w-full focus:outline-none border-0 p-0 m-0',
      },
    },
    onUpdate: ({ editor }) => {
      if (note?.type === 'note') {
        const html = editor.getHTML();
        updateJournal(note.id, { ...note, content: html })
          .then(() => onNoteUpdate({ ...note, content: html }))
          .catch(console.error);
      }
    },
    content: '', // Will be set by effect
  });

  useEffect(() => {
    if (editor && note?.type === 'note') {
      // Only set content if it's empty
      const defaultContent = `
        <p></p>
      `;
      editor.commands.setContent(note.content || defaultContent);
    }
  }, [note, editor]);

  if (!note) {
    return (
      <div className="editor empty-state flex items-center justify-center h-full text-gray-500">
        <h2>Select or create a note to start writing...</h2>
      </div>
    );
  }

  if (note.type === 'ai' || note.type === 'ai_chat') {
    return (
      <div className="editor ai-placeholder p-6 text-gray-400 bg-[#1e1e1e] h-full">
        <h2 className="text-xl font-semibold mb-2">AI Conversation</h2>
        <p>This space will show your chat with the AI.</p>
      </div>
    );
  }

  return (
    <div className="editor h-screen w-full bg-[#1e1e1e] text-white overflow-y-auto relative border-0 p-0 m-0">
      <div className="metadata-section p-4">
        <input
          type="text"
          className="title-input w-full bg-[#1e1e1e] text-gray-100 text-xl font-bold mb-1 p-2 focus:outline-none focus:ring-0 focus:border-transparent"
          placeholder="Enter title here..."
          value={note?.title || ''}
          onChange={(e) => onNoteUpdate({ ...note, title: e.target.value })}
        />
        <input
          type="text"
          className="description-input w-full bg-[#1e1e1e] text-gray-100 mb-1 p-2 focus:outline-none focus:ring-0 focus:border-transparent"
          placeholder="Enter description here..."
          value={note?.description || ''}
          onChange={(e) => onNoteUpdate({ ...note, description: e.target.value })}
        />
      </div>
      <EditorContent editor={editor} />
      <style>{`
        .tiptap {
          border: none !important;
          padding: 0 !important;
          margin: 0 !important;
          background: #1e1e1e !important;
        }

        .editor {
          background: #1e1e1e !important;
        }

        .ProseMirror {
          background: #1e1e1e !important;
          border: none !important;
          padding: 1rem 1rem 1rem 1rem !important;
          margin: 0 !important;
          outline: none !important;
        }

        .title-input::placeholder,
        .description-input::placeholder {
          color: #666;
          font-style: italic;
          opacity: 1;
        }

        .title-input:focus::placeholder,
        .description-input:focus::placeholder {
          color: #666;
          opacity: 0.7;
        }

        .title-input:focus,
        .description-input:focus {
          outline: none !important;
          box-shadow: none !important;
          border: none !important;
          background: #1e1e1e !important;
        }

        .title-input,
        .description-input {
          border: none;
          box-shadow: none;
          background: #1e1e1e;
          caret-color: white;
        }

        .metadata-section {
          background: #1e1e1e;
          padding: 1rem 1rem 0.5rem 1rem;
        }

        .ProseMirror p:empty::before {
          content: "Start writing your content here...";
          color: #666;
          pointer-events: none;
          display: block;
          font-style: italic;
          position: absolute;
        }

        .ProseMirror p:empty {
          min-height: 1.5em;
          position: relative;
        }

        .ProseMirror:focus {
          outline: none !important;
          box-shadow: none !important;
        }
      `}</style>
    </div>
  );
};

export default Editor;
