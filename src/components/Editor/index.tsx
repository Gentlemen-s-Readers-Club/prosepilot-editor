import React, { useEffect, useRef } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorToolbar } from './EditorToolbar';

interface EditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  readOnly?: boolean;
}

const editorStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  
  :root {
    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  }
  
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family: var(--font-sans);
    background-color: white;
    color: #333;
    overflow: auto;
  }
  
  body {
    box-sizing: border-box;
  }
  
  .ProseMirror {
    outline: none;
    min-height: calc(100% - 40px);
    padding: 50px;
    box-sizing: border-box;
  }
  
  .ProseMirror:focus {
    outline: none;
  }
  
  .ProseMirror h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .ProseMirror h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .ProseMirror h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .ProseMirror h4 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .ProseMirror h5 {
    font-size: 1rem;
    font-weight: 600;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .ProseMirror h6 {
    font-size: 0.875rem;
    font-weight: 600;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .ProseMirror p {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }
  
  .ProseMirror ul, .ProseMirror ol {
    padding-left: 1.5rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  .ProseMirror li {
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
  }
  
  .ProseMirror blockquote {
    border-left: 4px solid #e2e8f0;
    padding-left: 1rem;
    margin-left: 0;
    margin-right: 0;
    font-style: italic;
    color: #4a5568;
  }
  
  .ProseMirror img {
    max-width: 100%;
    height: auto;
  }
  
  .ProseMirror a {
    color: #3182ce;
    text-decoration: underline;
  }
  
  .ProseMirror a:hover {
    text-decoration: none;
  }
  
  .ProseMirror *[data-align="center"] {
    text-align: center;
  }
  
  .ProseMirror *[data-align="right"] {
    text-align: right;
  }
  
  .ProseMirror *[data-align="justify"] {
    text-align: justify;
  }
`;

export function Editor({ initialContent = '', onChange, readOnly = false }: EditorProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph', 'blockquote'],
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    editable: !readOnly,
  });

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !editor) return;

    const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDocument) return;

    // Create editor container if it doesn't exist
    if (!editorRef.current) {
      editorRef.current = iframeDocument.createElement('div');
      editorRef.current.id = 'editor-container';
      iframeDocument.body.appendChild(editorRef.current);
    }

    // Set up styles
    const style = iframeDocument.createElement('style');
    style.textContent = editorStyles;
    iframeDocument.head.appendChild(style);

    // Mount editor
    const editorElement = editor.options.element;
    if (editorElement) {
      editorRef.current.appendChild(editorElement);
    }
    
    return () => {
      if (editorRef.current) {
        editorRef.current.remove();
        editorRef.current = null;
      }
    };
  }, [editor, iframeRef]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      {!readOnly && <EditorToolbar editor={editor} />}
      <div className="border rounded-lg bg-white flex-1">
        <iframe
          ref={iframeRef}
          className="w-full h-[calc(100vh-300px)] rounded-lg grow-1"
        />
      </div>
    </div>
  );
}