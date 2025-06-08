import { Annotation, AnnotationExportData } from '../types/annotations';

export function getTextSelection(): { 
  text: string; 
  startOffset: number; 
  endOffset: number; 
  range: Range | null;
} | null {
  // First try to get selection from the main document
  let selection = window.getSelection();
  let doc = document;
  
  // If no selection in main document, check iframe
  if (!selection || selection.rangeCount === 0 || !selection.toString().trim()) {
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentDocument) {
      doc = iframe.contentDocument;
      selection = iframe.contentWindow?.getSelection() || null;
    }
  }
  
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  const text = selection.toString().trim();
  
  if (!text) return null;

  // Find the editor element in the appropriate document
  const editorElement = doc.querySelector('.ProseMirror');
  if (!editorElement) return null;

  // Calculate offsets relative to the editor content
  const startOffset = getTextOffset(editorElement, range.startContainer, range.startOffset);
  const endOffset = getTextOffset(editorElement, range.endContainer, range.endOffset);

  return {
    text,
    startOffset,
    endOffset,
    range
  };
}

function getTextOffset(root: Element, node: Node, offset: number): number {
  let textOffset = 0;
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    null
  );

  let currentNode;
  while (currentNode = walker.nextNode()) {
    if (currentNode === node) {
      return textOffset + offset;
    }
    textOffset += currentNode.textContent?.length || 0;
  }

  return textOffset;
}

export function highlightAnnotatedText(
  editorElement: Element, 
  annotations: Annotation[],
  onAnnotationClick: (annotation: Annotation) => void,
  showAnnotations: boolean = true
): void {
  // Always remove existing highlights first
  removeExistingHighlights(editorElement);

  // Only add highlights if showAnnotations is true
  if (!showAnnotations || annotations.length === 0) {
    return;
  }

  // Sort annotations by start offset to handle overlapping correctly
  const sortedAnnotations = [...annotations].sort((a, b) => a.start_offset - b.start_offset);

  sortedAnnotations.forEach(annotation => {
    highlightAnnotation(editorElement, annotation, onAnnotationClick);
  });
}

function removeExistingHighlights(editorElement: Element): void {
  const existingHighlights = editorElement.querySelectorAll('.annotation-highlight');
  existingHighlights.forEach(highlight => {
    const parent = highlight.parentNode;
    if (parent) {
      // Replace the highlight span with its text content
      const textNode = document.createTextNode(highlight.textContent || '');
      parent.replaceChild(textNode, highlight);
      parent.normalize();
    }
  });
}

function highlightAnnotation(
  editorElement: Element, 
  annotation: Annotation,
  onAnnotationClick: (annotation: Annotation) => void
): void {
  const textContent = editorElement.textContent || '';
  
  // Validate annotation offsets
  if (annotation.start_offset < 0 || 
      annotation.end_offset > textContent.length || 
      annotation.start_offset >= annotation.end_offset) {
    console.warn('Invalid annotation offsets:', annotation);
    return;
  }

  const walker = document.createTreeWalker(
    editorElement,
    NodeFilter.SHOW_TEXT,
    null
  );

  let currentOffset = 0;
  let startNode: Text | null = null;
  let endNode: Text | null = null;
  let startNodeOffset = 0;
  let endNodeOffset = 0;

  let currentNode;
  while (currentNode = walker.nextNode()) {
    const textNode = currentNode as Text;
    const nodeLength = textNode.textContent?.length || 0;
    const nodeStart = currentOffset;
    const nodeEnd = currentOffset + nodeLength;

    // Check if annotation starts in this node
    if (!startNode && annotation.start_offset >= nodeStart && annotation.start_offset < nodeEnd) {
      startNode = textNode;
      startNodeOffset = annotation.start_offset - nodeStart;
    }

    // Check if annotation ends in this node
    if (!endNode && annotation.end_offset > nodeStart && annotation.end_offset <= nodeEnd) {
      endNode = textNode;
      endNodeOffset = annotation.end_offset - nodeStart;
    }

    // If we have both start and end nodes, we can break
    if (startNode && endNode) {
      break;
    }

    currentOffset = nodeEnd;
  }

  if (startNode && endNode) {
    try {
      const range = document.createRange();
      range.setStart(startNode, startNodeOffset);
      range.setEnd(endNode, endNodeOffset);

      // Check if the range is valid and has content
      if (range.collapsed || !range.toString().trim()) {
        return;
      }

      const highlight = document.createElement('span');
      highlight.className = `annotation-highlight ${
        annotation.status === 'resolved' ? 'resolved' : 'open'
      }`;
      highlight.style.cssText = `
        background-color: ${annotation.status === 'resolved' ? '#dcfce7' : '#fef3c7'} !important;
        border-bottom: 2px solid ${annotation.status === 'resolved' ? '#16a34a' : '#d97706'} !important;
        cursor: pointer !important;
        padding: 1px 2px !important;
        border-radius: 2px !important;
        position: relative !important;
      `;
      highlight.title = annotation.content;
      highlight.setAttribute('data-annotation-id', annotation.id);
      
      highlight.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        onAnnotationClick(annotation);
      });

      range.surroundContents(highlight);
    } catch (error) {
      // Handle cases where range spans multiple elements
      console.warn('Could not highlight annotation:', annotation.id, error);
    }
  }
}

export function exportAnnotations(
  annotations: Annotation[],
  chapterTitle: string
): AnnotationExportData {
  return {
    chapter_title: chapterTitle,
    annotations: annotations.map(annotation => ({
      id: annotation.id,
      content: annotation.content,
      selected_text: annotation.selected_text,
      status: annotation.status,
      created_at: annotation.created_at,
      user_name: annotation.user?.full_name || 'Unknown User',
      replies: annotation.replies?.map(reply => ({
        content: reply.content,
        created_at: reply.created_at,
        user_name: reply.user?.full_name || 'Unknown User'
      })) || []
    })),
    exported_at: new Date().toISOString()
  };
}

export function downloadAnnotationsAsJSON(data: AnnotationExportData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `annotations-${data.chapter_title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadAnnotationsAsCSV(data: AnnotationExportData): void {
  const headers = ['ID', 'Content', 'Selected Text', 'Status', 'Created At', 'User', 'Replies Count'];
  const rows = data.annotations.map(annotation => [
    annotation.id,
    `"${annotation.content.replace(/"/g, '""')}"`,
    `"${annotation.selected_text.replace(/"/g, '""')}"`,
    annotation.status,
    annotation.created_at,
    annotation.user_name,
    annotation.replies.length.toString()
  ]);

  const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `annotations-${data.chapter_title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Keyboard shortcuts
export function setupAnnotationKeyboardShortcuts(
  onCreateAnnotation: () => void,
  onTogglePanel: () => void,
  onNextAnnotation: () => void,
  onPrevAnnotation: () => void
): () => void {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Ctrl+Shift+A - Create annotation
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
      e.preventDefault();
      onCreateAnnotation();
    }
    
    // Ctrl+Shift+P - Toggle panel
    if (e.ctrlKey && e.shiftKey && e.key === 'P') {
      e.preventDefault();
      onTogglePanel();
    }
    
    // Ctrl+Shift+N - Next annotation
    if (e.ctrlKey && e.shiftKey && e.key === 'N') {
      e.preventDefault();
      onNextAnnotation();
    }
    
    // Ctrl+Shift+B - Previous annotation
    if (e.ctrlKey && e.shiftKey && e.key === 'B') {
      e.preventDefault();
      onPrevAnnotation();
    }
  };

  // Listen for events on both main document and iframe
  document.addEventListener('keydown', handleKeyDown);
  
  // Also listen on iframe if it exists
  const iframe = document.querySelector('iframe');
  if (iframe && iframe.contentDocument) {
    iframe.contentDocument.addEventListener('keydown', handleKeyDown);
  }
  
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentDocument) {
      iframe.contentDocument.removeEventListener('keydown', handleKeyDown);
    }
  };
}