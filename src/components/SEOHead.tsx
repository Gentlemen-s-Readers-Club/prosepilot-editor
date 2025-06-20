import React from 'react';
import { Helmet } from 'react-helmet';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  twitterImage?: string;
  structuredData?: object;
  noindex?: boolean;
  type?: 'website' | 'article' | 'product';
}

export function SEOHead({
  title,
  description,
  keywords,
  canonical,
  ogImage = 'https://prosepilot.app/og-image.png',
  twitterImage = 'https://prosepilot.app/twitter-image.png',
  structuredData,
  noindex = false,
  type = 'website'
}: SEOHeadProps) {
  const fullTitle = title.includes('ProsePilot') ? title : `${title} - ProsePilot`;
  const canonicalUrl = canonical || `https://prosepilot.app${window.location.pathname}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="ProsePilot" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={twitterImage} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}

// Predefined structured data for common page types
export const structuredData = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ProsePilot",
    "url": "https://prosepilot.app",
    "logo": "https://prosepilot.app/logo.png",
    "description": "AI-powered book writing platform that transforms ideas into publication-ready books",
    "sameAs": [
      "https://twitter.com/prosepilot",
      "https://linkedin.com/company/prosepilot"
    ]
  },
  
  softwareApplication: {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ProsePilot",
    "description": "AI-powered book writing platform that transforms ideas into publication-ready books",
    "url": "https://prosepilot.app",
    "applicationCategory": "WritingApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "9.00",
      "priceCurrency": "USD",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "9.00",
        "priceCurrency": "USD",
        "billingIncrement": "P1M"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250"
    },
    "author": {
      "@type": "Organization",
      "name": "ProsePilot"
    }
  },
  
  article: (articleData: {
    headline: string;
    description: string;
    author: string;
    datePublished: string;
    dateModified: string;
    image?: string;
  }) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": articleData.headline,
    "description": articleData.description,
    "author": {
      "@type": "Person",
      "name": articleData.author
    },
    "datePublished": articleData.datePublished,
    "dateModified": articleData.dateModified,
    "publisher": {
      "@type": "Organization",
      "name": "ProsePilot",
      "logo": {
        "@type": "ImageObject",
        "url": "https://prosepilot.app/logo.png"
      }
    },
    ...(articleData.image && {
      "image": {
        "@type": "ImageObject",
        "url": articleData.image
      }
    })
  }),
  
  faqPage: (faqs: Array<{ question: string; answer: string }>) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  })
}; 