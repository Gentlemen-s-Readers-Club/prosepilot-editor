import React from 'react';
import { MessageSquare, CheckCircle, Circle } from 'lucide-react';
import { Annotation } from '../../types/annotations';

interface AnnotationMarkerProps {
  annotation: Annotation;
  onClick: () => void;
  isActive: boolean;
}

export function AnnotationMarker({ annotation, onClick, isActive }: AnnotationMarkerProps) {
  const replyCount = annotation.replies?.length || 0;
  const isResolved = annotation.status === 'resolved';

  return (
    <span
      className={`annotation-marker inline-flex items-center gap-1 px-1 py-0.5 rounded text-xs cursor-pointer transition-all ${
        isActive
          ? 'bg-blue-200 text-blue-800 shadow-md'
          : isResolved
          ? 'bg-green-100 text-green-700 hover:bg-green-200'
          : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
      }`}
      onClick={onClick}
      title={`${annotation.content} (${replyCount} replies)`}
    >
      {isResolved ? (
        <CheckCircle className="w-3 h-3" />
      ) : (
        <Circle className="w-3 h-3" />
      )}
      <MessageSquare className="w-3 h-3" />
      {replyCount > 0 && <span className="font-medium">{replyCount}</span>}
    </span>
  );
}