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
import { useSelector } from 'react-redux';
import { hasProOrStudioPlan } from '../../store/slices/subscriptionSlice';

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
  const [floatingButtonPosition, setFloatingButtonPosition] = useState<{
    x: number;
    y: number;
    visible: boolean;
  }>({ x: 0, y: 0, visible: false });

  // Check if user has Pro or Studio plan
  const hasProOrStudio = useSelector(hasProOrStudioPlan);

  const { 
    annotations, 
    loading,
    filters,
    setFilters,
    createAnnotation, 
    deleteAnnotation,
    createReply,
    deleteReply,
    toggleAnnotationStatus,
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

  // Reset to edit mode if user doesn't have Pro or Studio plan
  useEffect(() => {
    if (!hasProOrStudio && mode === 'comments') {
      setMode('edit');
      setShowAnnotationPanel(false);
      setSelectedAnnotation(null);
      setShowCreateModal(false);
      setSelectionData(null);
      setFloatingButtonPosition({ x: 0, y: 0, visible: false });
    }
  }, [hasProOrStudio, mode]);

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
    if (mode !== 'comments' || !contentRef.current || !hasProOrStudio) return;
    
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
    
    // Add new highlights - show ALL annotations regardless of panel filter
    // This ensures the editor always shows all annotations while the panel can filter them
    annotations.forEach(annotation => {
      const { start_offset, end_offset, status } = annotation;
      const textContent = contentElement.textContent || '';
      
      if (status !== 'open' || start_offset < 0 || end_offset > textContent.length || start_offset >= end_offset) {
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
              background-color: ${status === 'open' ? '#fef3c7' : '#d1fae5'} !important;
              border-bottom: 2px solid ${status === 'open' ? '#d97706' : '#059669'} !important;
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
  }, [annotations, mode, hasProOrStudio]);

  // Update content when initialContent changes
  useEffect(() => {
    if (mode === 'comments' && contentRef.current && hasProOrStudio) {
      contentRef.current.innerHTML = initialContent;
      // Apply highlights after content is updated
      setTimeout(() => {
        highlightAnnotations();
      }, 100);
    }
  }, [initialContent, mode, highlightAnnotations, hasProOrStudio]);

  // Update highlights when annotations or visibility changes
  useEffect(() => {
    if (mode === 'comments' && hasProOrStudio) {
      highlightAnnotations();
    }
  }, [annotations, highlightAnnotations, mode, hasProOrStudio]);

  // Function to handle text selection and show floating button
  const handleTextSelection = useCallback(() => {
    if (mode !== 'comments' || readOnly || !hasProOrStudio) {
      setFloatingButtonPosition({ x: 0, y: 0, visible: false });
      return;
    }

    const selection = getTextSelection();
    if (!selection || !selection.text) {
      setFloatingButtonPosition({ x: 0, y: 0, visible: false });
      return;
    }

    // Get the selection range to position the button
    const windowSelection = window.getSelection();
    if (!windowSelection || windowSelection.rangeCount === 0) {
      setFloatingButtonPosition({ x: 0, y: 0, visible: false });
      return;
    }

    const range = windowSelection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // Only show button if the selection is within the content area
    const contentElement = contentRef.current;
    if (contentElement) {
      const contentRect = contentElement.getBoundingClientRect();
      if (rect.top >= contentRect.top && rect.bottom <= contentRect.bottom) {
        // Position the button above the selection
        setFloatingButtonPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 10,
          visible: true
        });
        return;
      }
    }
    
    setFloatingButtonPosition({ x: 0, y: 0, visible: false });
  }, [mode, readOnly, getTextSelection, hasProOrStudio]);

  // Set up selection change listeners
  useEffect(() => {
    if (mode !== 'comments' || !hasProOrStudio) return;

    const handleSelectionChange = () => {
      // Use a shorter debounce to be more responsive
      setTimeout(handleTextSelection, 50);
    };

    const handleMouseUp = () => {
      // Check selection after mouse up to ensure we catch the final selection
      setTimeout(handleTextSelection, 10);
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [mode, handleTextSelection, hasProOrStudio]);

  // Hide floating button when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Don't hide if clicking on the floating button itself
      if (target.closest('.floating-annotation-button')) {
        return;
      }
      
      // Don't hide if clicking on annotation highlights
      if (target.closest('.annotation-highlight')) {
        return;
      }
      
      // Check if there's still a text selection
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || !selection.toString().trim()) {
        setFloatingButtonPosition({ x: 0, y: 0, visible: false });
      }
    };

    if (mode === 'comments' && hasProOrStudio) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [mode, hasProOrStudio]);

  const handleCreateAnnotation = useCallback(() => {
    if (readOnly || !hasProOrStudio) return;

    const selection = getTextSelection();
    if (!selection || !selection.text) {
      alert('Please select some text to annotate.');
      return;
    }

    setSelectionData(selection);
    setShowCreateModal(true);
    setFloatingButtonPosition({ x: 0, y: 0, visible: false });
  }, [readOnly, getTextSelection, hasProOrStudio]);

  const handleSubmitAnnotation = async (data: CreateAnnotationData) => {
    if (!hasProOrStudio) return;
    
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

  // Handle annotation status changes
  const handleAnnotationStatusChange = useCallback(async (annotationId: string) => {
    if (!hasProOrStudio) return;
    
    const success = await toggleAnnotationStatus(annotationId);
    if (success) {
      // Update highlights immediately when status changes
      setTimeout(() => {
        highlightAnnotations();
      }, 100);
    }
  }, [toggleAnnotationStatus, highlightAnnotations, hasProOrStudio]);

  // Set up keyboard shortcuts
  useEffect(() => {
    if (mode !== 'comments' || readOnly || !hasProOrStudio) return;
    
    // Detect if user is on Mac
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifierKey = isMac ? 'metaKey' : 'ctrlKey';
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+Shift+A (Mac) or Ctrl+Shift+A (Windows/Linux) - Create annotation
      if (e[modifierKey as keyof KeyboardEvent] && e.shiftKey && e.key === 'a') {
        e.preventDefault();
        handleCreateAnnotation();
      }
      
      // Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows/Linux) - Toggle panel
      if (e[modifierKey as keyof KeyboardEvent] && e.shiftKey && e.key === 'p') {
        e.preventDefault();
        setShowAnnotationPanel(!showAnnotationPanel);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showAnnotationPanel, handleCreateAnnotation, readOnly, mode, hasProOrStudio]);

  return (
    <div className="flex flex-col gap-2 h-full">
      
      {/* Only show annotation toolbar if user has Pro or Studio plan */}
      {hasProOrStudio && (
        <AnnotationToolbar
          mode={mode}
          totalCount={stats.open}
          onModeChange={setMode}
          onTogglePanel={() => setShowAnnotationPanel(!showAnnotationPanel)}
          isReadOnly={readOnly}
        />
      )}

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
        
        {/* Floating annotation button - only show if user has Pro or Studio plan */}
        {hasProOrStudio && mode === 'comments' && !readOnly && floatingButtonPosition.visible && (
          <div
            className="floating-annotation-button fixed z-50 pointer-events-auto"
            style={{
              left: `${floatingButtonPosition.x}px`,
              top: `${floatingButtonPosition.y}px`,
              transform: 'translateX(-50%)'
            }}
          >
            <button
              onClick={handleCreateAnnotation}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              title={`Add annotation (${navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? '⌘' : 'Ctrl'}+Shift+A)`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Annotation panel - only show if user has Pro or Studio plan */}
        {hasProOrStudio && mode === 'comments' && showAnnotationPanel && (
          <AnnotationPanel
            isOpen={showAnnotationPanel}
            onClose={() => setShowAnnotationPanel(false)}
            selectedAnnotation={selectedAnnotation}
            onAnnotationSelect={setSelectedAnnotation}
            onAnnotationStatusChange={handleAnnotationStatusChange}
            annotations={annotations}
            loading={loading}
            filters={filters}
            setFilters={setFilters}
            toggleAnnotationStatus={toggleAnnotationStatus}
            deleteAnnotation={deleteAnnotation}
            createReply={createReply}
            deleteReply={deleteReply}
            getAnnotationStats={getAnnotationStats}
          />
        )}
      </div>

      {/* Create annotation modal - only show if user has Pro or Studio plan */}
      {hasProOrStudio && mode === 'comments' && showCreateModal && selectionData && !readOnly && (
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