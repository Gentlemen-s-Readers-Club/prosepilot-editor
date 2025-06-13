export const editorStyles = `
  .annotation-highlight {
    position: relative;
    transition: all 0.2s ease;
    display: inline;
  }

  .annotation-highlight:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .annotation-highlight.resolved {
    background-color: #dcfce7 !important;
    border-bottom: 2px solid #16a34a !important;
  }

  .annotation-highlight.open {
    background-color: #fef3c7 !important;
    border-bottom: 2px solid #d97706 !important;
  }
  
  .ProseMirror {
    min-height: 500px;
    padding: 1rem;
    border-radius: 0.5rem;
    outline: none;
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
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
  
  .ProseMirror p {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  .ProseMirror ul, .ProseMirror ol {
    padding-left: 1.5rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  .ProseMirror ul {
    list-style-type: disc;
  }
  
  .ProseMirror ul ul {
    list-style-type: circle;
  }
  
  .ProseMirror ul ul ul {
    list-style-type: square;
  }
  
  .ProseMirror ol {
    list-style-type: decimal;
  }
  
  .ProseMirror ol ol {
    list-style-type: lower-alpha;
  }
  
  .ProseMirror ol ol ol {
    list-style-type: lower-roman;
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
  
  .ProseMirror *[data-align="center"] {
    text-align: center;
  }
  
  .ProseMirror *[data-align="right"] {
    text-align: right;
  }
  
  .ProseMirror *[data-align="justify"] {
    text-align: justify;
  }
  
  .comments-mode {
    min-height: 500px;
    padding: 1rem;
    border-radius: 0.5rem;
    outline: none;
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
    cursor: default;
    background-color: #fafafa;
    user-select: text;
  }
  
  .comments-mode h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .comments-mode h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .comments-mode h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .comments-mode p {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  .comments-mode ul, .comments-mode ol {
    padding-left: 1.5rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  .comments-mode ul {
    list-style-type: disc;
  }
  
  .comments-mode ul ul {
    list-style-type: circle;
  }
  
  .comments-mode ul ul ul {
    list-style-type: square;
  }
  
  .comments-mode ol {
    list-style-type: decimal;
  }
  
  .comments-mode ol ol {
    list-style-type: lower-alpha;
  }
  
  .comments-mode ol ol ol {
    list-style-type: lower-roman;
  }
  
  .comments-mode li {
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
  }
  
  .comments-mode blockquote {
    border-left: 4px solid #e2e8f0;
    padding-left: 1rem;
    margin-left: 0;
    margin-right: 0;
    font-style: italic;
    color: #4a5568;
  }
  
  .comments-mode *[data-align="center"] {
    text-align: center;
  }
  
  .comments-mode *[data-align="right"] {
    text-align: right;
  }
  
  .comments-mode *[data-align="justify"] {
    text-align: justify;
  }
`; 