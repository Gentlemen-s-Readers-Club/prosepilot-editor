import { Annotation } from '../../types/annotations';

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
  
  // Add annotation markers to the gutter
  addAnnotationGutterMarkers(editorElement, sortedAnnotations, onAnnotationClick);
}

function removeExistingHighlights(editorElement: Element): void {
  const existingHighlights = editorElement.querySelectorAll('.annotation-highlight');
  existingHighlights.forEach(highlight => {
    const parent = highlight.parentNode;
    if (parent) {
      // Replace the highlight span with its text content
      const textNode = highlight.ownerDocument.createTextNode(highlight.textContent || '');
      parent.replaceChild(textNode, highlight);
      parent.normalize();
    }
  });
  
  // Remove gutter markers
  const gutterMarkers = editorElement.querySelectorAll('.annotation-gutter-marker');
  gutterMarkers.forEach(marker => marker.remove());
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

  // Get the document context (iframe or main document)
  const doc = editorElement.ownerDocument;
  
  // Create a range to find the text nodes
  const range = doc.createRange();
  range.selectNodeContents(editorElement);
  
  // Get all text content and find the correct positions
  let currentOffset = 0;
  let startNode: Text | null = null;
  let endNode: Text | null = null;
  let startNodeOffset = 0;
  let endNodeOffset = 0;

  const walker = doc.createTreeWalker(
    editorElement,
    NodeFilter.SHOW_TEXT,
    null
  );

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
      const highlightRange = doc.createRange();
      highlightRange.setStart(startNode, startNodeOffset);
      highlightRange.setEnd(endNode, endNodeOffset);

      // Check if the range is valid and has content
      if (highlightRange.collapsed || !highlightRange.toString().trim()) {
        return;
      }

      const highlight = doc.createElement('span');
      highlight.className = `annotation-highlight ${
        annotation.status === 'resolved' ? 'resolved' : 'open'
      }`;
      
      // Use inline styles to ensure they work in iframe
      const backgroundColor = annotation.status === 'resolved' ? '#dcfce7' : '#fef3c7';
      const borderColor = annotation.status === 'resolved' ? '#16a34a' : '#d97706';
      
      highlight.style.cssText = `
        background-color: ${backgroundColor} !important;
        border-bottom: 2px solid ${borderColor} !important;
        cursor: pointer !important;
        padding: 1px 2px !important;
        border-radius: 2px !important;
        position: relative !important;
        display: inline !important;
      `;
      
      highlight.title = annotation.content;
      highlight.setAttribute('data-annotation-id', annotation.id);
      
      highlight.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        onAnnotationClick(annotation);
      });

      // Try to surround the content with the highlight
      try {
        highlightRange.surroundContents(highlight);
      } catch (error) {
        // If surroundContents fails, try extracting and inserting
        try {
          const contents = highlightRange.extractContents();
          highlight.appendChild(contents);
          highlightRange.insertNode(highlight);
        } catch (fallbackError) {
          console.warn('Could not highlight annotation:', annotation.id, fallbackError);
        }
      }
    } catch (error) {
      console.warn('Could not highlight annotation:', annotation.id, error);
    }
  }
}

function addAnnotationGutterMarkers(
  editorElement: Element,
  annotations: Annotation[],
  onAnnotationClick: (annotation: Annotation) => void
): void {
  const doc = editorElement.ownerDocument;
  
  // Group annotations by line
  const lineMap = new Map<number, Annotation[]>();
  
  annotations.forEach(annotation => {
    // Find the line number for this annotation
    const lineNumber = findLineNumberForOffset(editorElement, annotation.start_offset);
    
    if (lineNumber !== null) {
      if (!lineMap.has(lineNumber)) {
        lineMap.set(lineNumber, []);
      }
      lineMap.get(lineNumber)?.push(annotation);
    }
  });
  
  // Add gutter markers for each line with annotations
  lineMap.forEach((lineAnnotations, lineNumber) => {
    const lineElement = findLineElementByNumber(editorElement, lineNumber);
    if (!lineElement) return;
    
    // Create a gutter marker container if it doesn't exist
    let gutterContainer = lineElement.querySelector('.annotation-gutter-container');
    if (!gutterContainer) {
      gutterContainer = doc.createElement('div');
      gutterContainer.className = 'annotation-gutter-container';
      (gutterContainer as HTMLElement).style.cssText = `
        position: absolute;
        left: -20px;
        top: 0;
        bottom: 0;
        width: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      `;
      (lineElement as HTMLElement).style.position = 'relative';
      lineElement.appendChild(gutterContainer);
    }
    
    // Add a marker for each annotation on this line
    lineAnnotations.forEach(annotation => {
      const marker = doc.createElement('div');
      marker.className = `annotation-gutter-marker ${annotation.status}`;
      marker.title = annotation.content;
      marker.style.cssText = `
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin: 2px 0;
        cursor: pointer;
        background-color: ${annotation.status === 'resolved' ? '#10b981' : '#f59e0b'};
      `;
      
      marker.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        onAnnotationClick(annotation);
      });
      
      gutterContainer.appendChild(marker);
    });
  });
}

function findLineNumberForOffset(editorElement: Element, offset: number): number | null {
  const textContent = editorElement.textContent || '';
  if (offset >= textContent.length) return null;
  
  // Split content by newlines and calculate line number
  const textBeforeOffset = textContent.substring(0, offset);
  return textBeforeOffset.split('\n').length - 1;
}

function findLineElementByNumber(editorElement: Element, lineNumber: number): Element | null {
  // This is a simplified approach - in a real implementation, you'd need to find the actual DOM element
  // that corresponds to the line number, which depends on your editor's structure
  const paragraphs = editorElement.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li');
  if (lineNumber < paragraphs.length) {
    return paragraphs[lineNumber];
  }
  return null;
}

// Keyboard shortcuts
export function setupAnnotationKeyboardShortcuts(
  onCreateAnnotation: () => void,
  onTogglePanel: () => void
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