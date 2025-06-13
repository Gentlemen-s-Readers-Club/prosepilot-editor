import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorToolbar } from './EditorToolbar';
import { AnnotationToolbar } from './AnnotationToolbar';
import { AnnotationPanel } from '../annotations/AnnotationPanel';
import { CreateAnnotationModal } from '../annotations/CreateAnnotationModal';
import { useAnnotations } from '../../hooks/useAnnotations';
import { Annotation, CreateAnnotationData } from '../../types/annotations';
import { editorStyles } from './editorStyles';

interface EnhancedEditorProps {
  chapterId: string;
  chapterTitle: string;
  initialContent?: string;
  onChange?: (content: string) => void;
  readOnly?: boolean;
}

export function EnhancedEditor({ 
  chapterId,
  initialContent = '', 
  onChange, 
  readOnly = false,
}: EnhancedEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'edit' | 'comments'>('edit');
  const [showAnnotationPanel, setShowAnnotationPanel] = useState(false);
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

  // Only create TipTap editor for edit mode
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph', 'blockquote'],
      }),
      Placeholder.configure({
        placeholder: 'Start writing or paste your content here...',
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    editable: !readOnly && mode === 'edit',
  });

  const stats = getAnnotationStats();

  // Function to get text selection for comment mode
  const getTextSelection = useCallback(() => {
    if (mode === 'edit' && editor) {
      const { from, to } = editor.state.selection;
      if (from === to) return null; // No selection
      
      const text = editor.state.doc.textBetween(from, to);
      if (!text.trim()) return null;
      
      return {
        text,
        startOffset: from,
        endOffset: to
      };
    } else if (mode === 'comments' && contentRef.current) {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return null;
      
      const range = selection.getRangeAt(0);
      const text = selection.toString().trim();
      if (!text) return null;
      
      // Calculate offsets relative to the content div
      const contentElement = contentRef.current;
      const startOffset = getTextOffset(contentElement, range.startContainer, range.startOffset);
      const endOffset = getTextOffset(contentElement, range.endContainer, range.endOffset);
      
      return {
        text,
        startOffset,
        endOffset
      };
    }
    return null;
  }, [editor, mode]);

  // Helper function to calculate text offset
  const getTextOffset = (element: Element, node: Node, offset: number): number => {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    );
    
    let currentOffset = 0;
    let currentNode;
    
    while ((currentNode = walker.nextNode()) !== null) {
      if (currentNode === node) {
        return currentOffset + offset;
      }
      currentOffset += currentNode.textContent?.length || 0;
    }
    
    return currentOffset;
  };

  // Function to highlight annotations for comment mode
  const highlightAnnotations = useCallback(() => {
    if (mode !== 'comments' || !contentRef.current) return;
    
    const contentElement = contentRef.current;
    
    // Remove existing highlights first
    const existingHighlights = contentElement.querySelectorAll('.annotation-highlight');
    existingHighlights.forEach(highlight => {
      const parent = highlight.parentNode;
      if (parent) {
        const textNode = document.createTextNode(highlight.textContent || '');
        parent.replaceChild(textNode, highlight);
        parent.normalize();
      }
    });
    
    // Add new highlights
    annotations.forEach(annotation => {
      const { start_offset, end_offset, status } = annotation;
      const textContent = contentElement.textContent || '';
      
      if (start_offset < 0 || end_offset > textContent.length || start_offset >= end_offset) {
        return;
      }
      
      // Find text nodes and create highlights
      const walker = document.createTreeWalker(
        contentElement,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      let currentOffset = 0;
      let startNode: Text | null = null;
      let endNode: Text | null = null;
      let startNodeOffset = 0;
      let endNodeOffset = 0;
      
      let currentNode;
      while ((currentNode = walker.nextNode()) !== null) {
        const textNode = currentNode as Text;
        const nodeLength = textNode.textContent?.length || 0;
        const nodeStart = currentOffset;
        const nodeEnd = currentOffset + nodeLength;
        
        if (!startNode && start_offset >= nodeStart && start_offset < nodeEnd) {
          startNode = textNode;
          startNodeOffset = start_offset - nodeStart;
        }
        
        if (!endNode && end_offset > nodeStart && end_offset <= nodeEnd) {
          endNode = textNode;
          endNodeOffset = end_offset - nodeStart;
        }
        
        if (startNode && endNode) break;
        currentOffset = nodeEnd;
      }
      
      if (startNode && endNode) {
        try {
          const range = document.createRange();
          range.setStart(startNode, startNodeOffset);
          range.setEnd(endNode, endNodeOffset);
          
          if (!range.collapsed && range.toString().trim()) {
            const highlight = document.createElement('span');
            highlight.className = `annotation-highlight ${status}`;
            highlight.setAttribute('data-annotation-id', annotation.id);
            highlight.style.cssText = `
              background-color: ${status === 'resolved' ? '#dcfce7' : '#fef3c7'} !important;
              border-bottom: 2px solid ${status === 'resolved' ? '#16a34a' : '#d97706'} !important;
              cursor: pointer !important;
              padding: 1px 2px !important;
              border-radius: 2px !important;
              position: relative !important;
              display: inline !important;
            `;
            
            highlight.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              const annotationId = highlight.getAttribute('data-annotation-id');
              if (annotationId) {
                const foundAnnotation = annotations.find(a => a.id === annotationId);
                if (foundAnnotation) {
                  setSelectedAnnotation(foundAnnotation);
                  setShowAnnotationPanel(true);
                }
              }
            });
            
            range.surroundContents(highlight);
          }
        } catch (error) {
          console.warn('Could not highlight annotation:', annotation.id, error);
        }
      }
    });
  }, [annotations, mode]);

  // Update content when initialContent changes
  useEffect(() => {
    if (mode === 'comments' && contentRef.current) {
      contentRef.current.innerHTML = initialContent;
      // Apply highlights after content is updated
      setTimeout(() => {
        highlightAnnotations();
      }, 100);
    }
  }, [initialContent, mode, highlightAnnotations]);

  // Update highlights when annotations or visibility changes
  useEffect(() => {
    if (mode === 'comments') {
      highlightAnnotations();
    }
  }, [annotations, highlightAnnotations, mode]);

  const handleCreateAnnotation = useCallback(() => {
    if (readOnly) return;

    const selection = getTextSelection();
    if (!selection || !selection.text) {
      alert('Please select some text to annotate.');
      return;
    }

    setSelectionData(selection);
    setShowCreateModal(true);
  }, [readOnly, getTextSelection]);

  const handleSubmitAnnotation = async (data: CreateAnnotationData) => {
    const newAnnotation = await createAnnotation(data);
    if (newAnnotation) {
      setSelectedAnnotation(newAnnotation);
      setShowAnnotationPanel(true);
      // Update highlights after creating annotation
      setTimeout(() => {
        highlightAnnotations();
      }, 100);
    }
  };

  // Set up keyboard shortcuts
  useEffect(() => {
    if (mode !== 'comments' || readOnly) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+A - Create annotation
      if (e.ctrlKey && e.shiftKey && e.key === 'a') {
        e.preventDefault();
        handleCreateAnnotation();
      }
      
      // Ctrl+Shift+P - Toggle panel
      if (e.ctrlKey && e.shiftKey && e.key === 'p') {
        e.preventDefault();
        setShowAnnotationPanel(!showAnnotationPanel);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showAnnotationPanel, handleCreateAnnotation, readOnly, mode]);

  return (
    <div className="flex flex-col gap-2 h-full">
      
      <AnnotationToolbar
        mode={mode}
        annotationCount={stats.total}
        openCount={stats.open}
        onModeChange={setMode}
        onTogglePanel={() => setShowAnnotationPanel(!showAnnotationPanel)}
        onCreateAnnotation={handleCreateAnnotation}
        isReadOnly={readOnly}
      />

      {mode === 'edit' && !readOnly && editor && <EditorToolbar editor={editor} />}
      
      <div className="border rounded-lg bg-white flex-1 relative">
        <style>{editorStyles}</style>
        <div 
          ref={editorRef} 
          className={`w-full h-full rounded-lg ${mode === 'comments' ? 'comments-mode' : ''}`}
        >
          {mode === 'edit' && editor ? (
            <EditorContent editor={editor} />
          ) : mode === 'comments' ? (
            <div
              ref={contentRef}
              className="comments-mode w-full h-full"
              dangerouslySetInnerHTML={{ __html: initialContent }}
            />
          ) : null}
        </div>
        
        {mode === 'comments' && showAnnotationPanel && (
          <AnnotationPanel
            chapterId={chapterId}
            isOpen={showAnnotationPanel}
            onClose={() => setShowAnnotationPanel(false)}
            selectedAnnotation={selectedAnnotation}
            onAnnotationSelect={setSelectedAnnotation}
          />
        )}
      </div>

      {mode === 'comments' && showCreateModal && selectionData && !readOnly && (
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