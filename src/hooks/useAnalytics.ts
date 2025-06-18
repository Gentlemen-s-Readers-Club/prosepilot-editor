import ReactGA from 'react-ga4';
import { useEffect, useCallback } from 'react';

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

interface AnalyticsConfig {
  measurementId: string;
  gaOptions?: {
    siteSpeedSampleRate?: number;
    alwaysSendReferrer?: boolean;
    allowAdFeatures?: boolean;
  };
}

export const useAnalytics = (config?: AnalyticsConfig) => {
  // Initialize GA4
  const initialize = useCallback((measurementId: string, options?: AnalyticsConfig['gaOptions']) => {
    if (typeof window !== 'undefined') {
      ReactGA.initialize(measurementId, {
        gaOptions: options || config?.gaOptions,
      });
    }
  }, [config]);

  // Track page views
  const trackPageView = useCallback((path?: string, title?: string) => {
    if (typeof window !== 'undefined') {
      ReactGA.send({
        hitType: 'pageview',
        page: path || window.location.pathname,
        title: title || document.title,
      });
    }
  }, []);

  // Track custom events
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    if (typeof window !== 'undefined') {
      ReactGA.event({
        category: event.category,
        action: event.action,
        label: event.label,
        value: event.value,
      });
    }
  }, []);

  // Track user timing (using custom event in GA4)
  const trackTiming = useCallback((category: string, variable: string, time: number, label?: string) => {
    if (typeof window !== 'undefined') {
      ReactGA.event({
        category: 'timing',
        action: variable,
        label: label || category,
        value: time,
      });
    }
  }, []);

  // Track exceptions (using custom event in GA4)
  const trackException = useCallback((description: string, fatal: boolean = false) => {
    if (typeof window !== 'undefined') {
      ReactGA.event({
        category: 'exception',
        action: fatal ? 'fatal_exception' : 'non_fatal_exception',
        label: description,
      });
    }
  }, []);

  // Set user properties
  const setUserProperties = useCallback((properties: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      ReactGA.set(properties);
    }
  }, []);

  // Set custom dimensions and metrics
  const setCustomDimension = useCallback((dimensionIndex: number, value: string) => {
    if (typeof window !== 'undefined') {
      ReactGA.set({
        [`dimension${dimensionIndex}`]: value,
      });
    }
  }, []);

  const setCustomMetric = useCallback((metricIndex: number, value: number) => {
    if (typeof window !== 'undefined') {
      ReactGA.set({
        [`metric${metricIndex}`]: value,
      });
    }
  }, []);

  // Track user engagement
  const trackUserEngagement = useCallback((engagementTimeMs: number) => {
    if (typeof window !== 'undefined') {
      ReactGA.event({
        category: 'engagement',
        action: 'user_engagement',
        value: engagementTimeMs,
      });
    }
  }, []);

  // Track button clicks
  const trackButtonClick = useCallback((buttonName: string, location?: string) => {
    trackEvent({
      category: 'button_click',
      action: 'click',
      label: `${buttonName}${location ? `_${location}` : ''}`,
    });
  }, [trackEvent]);

  // Track form submissions
  const trackFormSubmission = useCallback((formName: string, success: boolean = true) => {
    trackEvent({
      category: 'form',
      action: success ? 'submit_success' : 'submit_error',
      label: formName,
    });
  }, [trackEvent]);

  // Track search queries
  const trackSearch = useCallback((searchTerm: string, resultsCount?: number) => {
    trackEvent({
      category: 'search',
      action: 'search',
      label: searchTerm,
      value: resultsCount,
    });
  }, [trackEvent]);

  // Initialize on mount if config is provided
  useEffect(() => {
    if (config?.measurementId) {
      initialize(config.measurementId, config.gaOptions);
    }
  }, [config, initialize]);

  return {
    initialize,
    trackPageView,
    trackEvent,
    trackTiming,
    trackException,
    setUserProperties,
    setCustomDimension,
    setCustomMetric,
    trackUserEngagement,
    trackButtonClick,
    trackFormSubmission,
    trackSearch,
  };
};

// Export default for convenience
export default useAnalytics;

