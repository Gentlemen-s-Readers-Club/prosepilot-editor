import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorToolbar } from './EditorToolbar';
import { AnnotationToolbar } from './AnnotationToolbar';
import { AnnotationPanel } from '../annotations/AnnotationPanel';
import { CreateAnnotationModal } from '../annotations/CreateAnnotationModal';
import { useAnnotations } from '../../hooks/useAnnotations';
import { 
  getTextSelection, 
  highlightAnnotatedText, 
  exportAnnotations,
  downloadAnnotationsAsJSON,
  downloadAnnotationsAsCSV,
  setupAnnotationKeyboardShortcuts
} from '../../utils/annotationUtils';
import { Annotation } from '../../types/annotations';

interface EnhancedEditorProps {
  chapterId: string;
  chapterTitle: string;
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

  .annotation-highlight {
    position: relative;
    transition: all 0.2s ease;
  }

  .annotation-highlight:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .annotation-highlight.resolved {
    background-color: #dcfce7 !important;
    border-bottom-color: #16a34a !important;
  }

  .annotation-highlight.open {
    background-color: #fef3c7 !important;
    border-bottom-color: #d97706 !important;
  }
`;

export function EnhancedEditor({ 
  chapterId,
  chapterTitle,
  initialContent = '', 
  onChange, 
  readOnly = false 
}: EnhancedEditorProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [showAnnotationPanel, setShowAnnotationPanel] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectionData, setSelectionData] = useState<{
    text: string;
    startOffset: number;
    endOffset: number;
  } | null>(null);

  const { 
    annotations, 
    createAnnotation, 
    getAnnotationStats 
  } = useAnnotations(chapterId);

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
      
      // Re-highlight annotations after content changes
      if (showAnnotations) {
        setTimeout(() => {
          const editorElement = iframeRef.current?.contentDocument?.querySelector('.ProseMirror');
          if (editorElement) {
            highlightAnnotatedText(editorElement, annotations, handleAnnotationClick);
          }
        }, 100);
      }
    },
    editable: !readOnly,
  });

  const stats = getAnnotationStats();

  // Handle annotation highlighting
  useEffect(() => {
    if (!editor || !showAnnotations) return;

    const editorElement = iframeRef.current?.contentDocument?.querySelector('.ProseMirror');
    if (editorElement) {
      highlightAnnotatedText(editorElement, annotations, handleAnnotationClick);
    }
  }, [editor, annotations, showAnnotations]);

  // Set up iframe and editor
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

  // Set up keyboard shortcuts
  useEffect(() => {
    const cleanup = setupAnnotationKeyboardShortcuts(
      handleCreateAnnotation,
      () => setShowAnnotationPanel(!showAnnotationPanel),
      handleNextAnnotation,
      handlePrevAnnotation
    );

    return cleanup;
  }, [showAnnotationPanel, annotations, selectedAnnotation]);

  const handleAnnotationClick = useCallback((annotation: Annotation) => {
    setSelectedAnnotation(annotation);
    setShowAnnotationPanel(true);
  }, []);

  const handleCreateAnnotation = useCallback(() => {
    if (readOnly) return;

    const selection = getTextSelection();
    if (!selection) {
      alert('Please select some text to annotate.');
      return;
    }

    setSelectionData({
      text: selection.text,
      startOffset: selection.startOffset,
      endOffset: selection.endOffset
    });
    setShowCreateModal(true);
  }, [readOnly]);

  const handleSubmitAnnotation = async (data: any) => {
    const newAnnotation = await createAnnotation(data);
    if (newAnnotation) {
      setSelectedAnnotation(newAnnotation);
      setShowAnnotationPanel(true);
    }
  };

  const handleExportAnnotations = () => {
    const exportData = exportAnnotations(annotations, chapterTitle);
    
    // Show export options
    const format = window.confirm('Export as JSON? (Cancel for CSV)');
    if (format) {
      downloadAnnotationsAsJSON(exportData);
    } else {
      downloadAnnotationsAsCSV(exportData);
    }
  };

  const handleNextAnnotation = () => {
    if (annotations.length === 0) return;
    
    const currentIndex = selectedAnnotation 
      ? annotations.findIndex(a => a.id === selectedAnnotation.id)
      : -1;
    
    const nextIndex = (currentIndex + 1) % annotations.length;
    setSelectedAnnotation(annotations[nextIndex]);
    setShowAnnotationPanel(true);
  };

  const handlePrevAnnotation = () => {
    if (annotations.length === 0) return;
    
    const currentIndex = selectedAnnotation 
      ? annotations.findIndex(a => a.id === selectedAnnotation.id)
      : -1;
    
    const prevIndex = currentIndex <= 0 ? annotations.length - 1 : currentIndex - 1;
    setSelectedAnnotation(annotations[prevIndex]);
    setShowAnnotationPanel(true);
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 h-full">
      {!readOnly && <EditorToolbar editor={editor} />}
      
      <AnnotationToolbar
        annotationCount={stats.total}
        openCount={stats.open}
        resolvedCount={stats.resolved}
        showAnnotations={showAnnotations}
        onToggleAnnotations={() => setShowAnnotations(!showAnnotations)}
        onTogglePanel={() => setShowAnnotationPanel(!showAnnotationPanel)}
        onCreateAnnotation={handleCreateAnnotation}
        onExportAnnotations={handleExportAnnotations}
        isReadOnly={readOnly}
      />
      
      <div className="border rounded-lg bg-white flex-1 relative">
        <iframe
          ref={iframeRef}
          className="w-full h-full rounded-lg"
          style={{ minHeight: 'calc(100vh - 350px)' }}
        />
        
        {showAnnotationPanel && (
          <AnnotationPanel
            chapterId={chapterId}
            isOpen={showAnnotationPanel}
            onClose={() => setShowAnnotationPanel(false)}
            selectedAnnotation={selectedAnnotation}
            onAnnotationSelect={setSelectedAnnotation}
            onExportAnnotations={handleExportAnnotations}
          />
        )}
      </div>

      {showCreateModal && selectionData && (
        <CreateAnnotationModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setSelectionData(null);
          }}
          onSubmit={handleSubmitAnnotation}
          selectedText={selectionData.text}
          chapterId={chapterId}
          startOffset={selectionData.startOffset}
          endOffset={selectionData.endOffset}
        />
      )}
    </div>
  );
}