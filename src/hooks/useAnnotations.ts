import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from './use-toast';
import { 
  Annotation, 
  AnnotationReply, 
  CreateAnnotationData, 
  CreateReplyData,
  AnnotationFilters 
} from '../types/annotations';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export function useAnnotations(chapterId: string) {
  const { session } = useSelector((state: RootState) => (state.auth));
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AnnotationFilters>({ status: 'open' });
  const { toast } = useToast();

  const fetchAnnotations = useCallback(async () => {
    try {
      setLoading(true);
      
      // Always fetch ALL annotations for the chapter, regardless of filters
      // This ensures the editor always shows all annotations while the panel can filter them locally
      const { data, error } = await supabase
        .from('annotations')
        .select(`
          *,
          user:profiles!annotations_user_id_fkey(id, full_name, avatar_url),
          replies:annotation_replies(
            *,
            user:profiles!annotation_replies_user_id_fkey(id, full_name, avatar_url)
          )
        `)
        .eq('chapter_id', chapterId)
        .order('start_offset', { ascending: true });

      if (error) throw error;

      // Sort replies by creation date
      const annotationsWithSortedReplies = data?.map(annotation => ({
        ...annotation,
        replies: annotation.replies?.sort((a: AnnotationReply, b: AnnotationReply) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        ) || []
      })) || [];

      setAnnotations(annotationsWithSortedReplies);
    } catch (error: any) {
      console.error('Error fetching annotations:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load annotations",
      });
    } finally {
      setLoading(false);
    }
  }, [chapterId, toast]);

  useEffect(() => {
    if (chapterId) {
      fetchAnnotations();
    }
  }, [chapterId, fetchAnnotations]);

  const createAnnotation = async (data: CreateAnnotationData): Promise<Annotation | null> => {
    try {
      const { data: newAnnotation, error } = await supabase
        .from('annotations')
        .insert({
          ...data,
          user_id: session?.user.id || '',
          status: 'open'
        })
        .select(`
          *,
          user:profiles!annotations_user_id_fkey(id, full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      const annotationWithReplies = { ...newAnnotation, replies: [] };
      setAnnotations(prev => [...prev, annotationWithReplies].sort((a, b) => a.start_offset - b.start_offset));

      return annotationWithReplies;
    } catch (error: any) {
      console.error('Error creating annotation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create annotation",
      });
      return null;
    }
  };

  const updateAnnotation = async (id: string, updates: Partial<Annotation>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('annotations')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setAnnotations(prev => prev.map(annotation => 
        annotation.id === id ? { ...annotation, ...updates } : annotation
      ));

      return true;
    } catch (error: any) {
      console.error('Error updating annotation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update annotation",
      });
      return false;
    }
  };

  const deleteAnnotation = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('annotations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAnnotations(prev => prev.filter(annotation => annotation.id !== id));

      return true;
    } catch (error: any) {
      console.error('Error deleting annotation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete annotation",
      });
      return false;
    }
  };

  const createReply = async (data: CreateReplyData): Promise<AnnotationReply | null> => {
    try {
      const { data: newReply, error } = await supabase
        .from('annotation_replies')
        .insert({
          ...data,
          user_id: session?.user.id || ''
        })
        .select(`
          *,
          user:profiles!annotation_replies_user_id_fkey(id, full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      setAnnotations(prev => prev.map(annotation => 
        annotation.id === data.annotation_id 
          ? { 
              ...annotation, 
              replies: [...(annotation.replies || []), newReply].sort((a, b) => 
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
              )
            }
          : annotation
      ));

      return newReply;
    } catch (error: any) {
      console.error('Error creating reply:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add reply",
      });
      return null;
    }
  };

  const deleteReply = async (replyId: string, annotationId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('annotation_replies')
        .delete()
        .eq('id', replyId);

      if (error) throw error;

      setAnnotations(prev => prev.map(annotation => 
        annotation.id === annotationId 
          ? { 
              ...annotation, 
              replies: annotation.replies?.filter(reply => reply.id !== replyId) || []
            }
          : annotation
      ));

      return true;
    } catch (error: any) {
      console.error('Error deleting reply:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete reply",
      });
      return false;
    }
  };

  const toggleAnnotationStatus = async (id: string): Promise<boolean> => {
    const annotation = annotations.find(a => a.id === id);
    if (!annotation) return false;

    const newStatus = annotation.status === 'open' ? 'resolved' : 'open';
    return await updateAnnotation(id, { status: newStatus });
  };

  const getAnnotationStats = () => {
    const total = annotations.length;
    const open = annotations.filter(a => a.status === 'open').length;
    const resolved = annotations.filter(a => a.status === 'resolved').length;
    
    return { total, open, resolved };
  };

  return {
    annotations,
    loading,
    filters,
    setFilters,
    createAnnotation,
    updateAnnotation,
    deleteAnnotation,
    createReply,
    deleteReply,
    toggleAnnotationStatus,
    getAnnotationStats,
    refetch: fetchAnnotations
  };
}