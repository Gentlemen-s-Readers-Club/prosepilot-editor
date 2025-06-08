import { Annotation, AnnotationExportData } from '../types/annotations';

export function getTextSelection(): { 
  text: string; 
  startOffset: number; 
  endOffset: number; 
  range: Range | null;
} | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  const text = selection.toString().trim();
  
  if (!text) return null;

  // Calculate offsets relative to the editor content
  const editorElement = document.querySelector('.ProseMirror');
  if (!editorElement) return null;

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
  onAnnotationClick: (annotation: Annotation) => void
): void {
  // Remove existing highlights
  removeExistingHighlights(editorElement);

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
      parent.replaceChild(document.createTextNode(highlight.textContent || ''), highlight);
      parent.normalize();
    }
  });
}

function highlightAnnotation(
  editorElement: Element, 
  annotation: Annotation,
  onAnnotationClick: (annotation: Annotation) => void
): void {
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
    if (!startNode && annotation.start_offset >= nodeStart && annotation.start_offset <= nodeEnd) {
      startNode = textNode;
      startNodeOffset = annotation.start_offset - nodeStart;
    }

    // Check if annotation ends in this node
    if (!endNode && annotation.end_offset >= nodeStart && annotation.end_offset <= nodeEnd) {
      endNode = textNode;
      endNodeOffset = annotation.end_offset - nodeStart;
      break;
    }

    currentOffset = nodeEnd;
  }

  if (startNode && endNode) {
    const range = document.createRange();
    range.setStart(startNode, startNodeOffset);
    range.setEnd(endNode, endNodeOffset);

    const highlight = document.createElement('span');
    highlight.className = `annotation-highlight ${
      annotation.status === 'resolved' ? 'resolved' : 'open'
    }`;
    highlight.style.cssText = `
      background-color: ${annotation.status === 'resolved' ? '#dcfce7' : '#fef3c7'};
      border-bottom: 2px solid ${annotation.status === 'resolved' ? '#16a34a' : '#d97706'};
      cursor: pointer;
      padding: 1px 2px;
      border-radius: 2px;
    `;
    highlight.title = annotation.content;
    highlight.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      onAnnotationClick(annotation);
    });

    try {
      range.surroundContents(highlight);
    } catch (error) {
      // Handle cases where range spans multiple elements
      console.warn('Could not highlight annotation:', error);
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

  document.addEventListener('keydown', handleKeyDown);
  
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}