import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAppDispatch, useAppSelector } from './';
import { setUser, setProfile, setLoading, clearAuth } from '../store/slices/authSlice';
import { setCategories, setLanguages, setNarrators, setLiteratureStyles, setTones } from '../store/slices/dataSlice';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, profile, loading } = useAppSelector(state => state.auth);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          if (session?.user) {
            dispatch(setUser(session.user));
            
            // Fetch profile
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (profileData) {
              dispatch(setProfile(profileData));
            }

            // Fetch reference data
            const [
              categoriesResponse,
              languagesResponse,
              narratorsResponse,
              stylesResponse,
              tonesResponse
            ] = await Promise.all([
              supabase.from('categories').select('*').order('name'),
              supabase.from('languages').select('*').order('name'),
              supabase.from('narrators').select('*').order('name'),
              supabase.from('literature_styles').select('*').order('name'),
              supabase.from('tones').select('*').order('name')
            ]);

            if (categoriesResponse.data) dispatch(setCategories(categoriesResponse.data));
            if (languagesResponse.data) dispatch(setLanguages(languagesResponse.data));
            if (narratorsResponse.data) dispatch(setNarrators(narratorsResponse.data));
            if (stylesResponse.data) dispatch(setLiteratureStyles(stylesResponse.data));
            if (tonesResponse.data) dispatch(setTones(tonesResponse.data));
          }
          dispatch(setLoading(false));
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        if (mounted) {
          dispatch(setLoading(false));
        }
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (mounted) {
          if (session?.user) {
            dispatch(setUser(session.user));
            
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (profileData) {
              dispatch(setProfile(profileData));
            }
          } else {
            dispatch(clearAuth());
          }
          dispatch(setLoading(false));
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return { session: user ? { user } : null, loading };
}