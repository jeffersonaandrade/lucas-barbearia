import React from 'react';
import { siteConfig } from '@/config/site.js';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

export const SEO: React.FC<SEOProps> = ({
  title = siteConfig.seo.title,
  description = siteConfig.seo.description,
  keywords = siteConfig.seo.keywords.join(', '),
  image = '/og-image.jpg',
  url = siteConfig.seo.localBusiness.website,
  type = 'website'
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": siteConfig.seo.localBusiness.name,
    "description": description,
    "url": url,
    "telephone": siteConfig.seo.localBusiness.phone,
    "email": siteConfig.seo.localBusiness.email,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Recife",
      "addressRegion": "Pernambuco",
      "addressCountry": "BR",
      "addressArea": siteConfig.seo.localBusiness.serviceArea
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": siteConfig.seo.localBusiness.latitude,
      "longitude": siteConfig.seo.localBusiness.longitude
    },
    "openingHours": "Mo-Fr 08:00-18:00",
    "medicalSpecialty": "Fisioterapia Respiratória Infantil",
    "availableService": [
      {
        "@type": "MedicalService",
        "name": "Fisioterapia Respiratória Domiciliar",
        "description": "Atendimento domiciliar para crianças com problemas respiratórios"
      },
      {
        "@type": "MedicalService", 
        "name": "Tratamento de Bronquite Infantil",
        "description": "Especializado em tratamento de bronquite em crianças"
      },
      {
        "@type": "MedicalService",
        "name": "Fisioterapia para Asma Infantil", 
        "description": "Tratamento fisioterapêutico para crianças com asma"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": "50",
      "bestRating": "5",
      "worstRating": "1"
    },
    "priceRange": "$$",
    "paymentAccepted": ["Cash", "Credit Card", "PIX"],
    "currenciesAccepted": "BRL",
    "areaServed": {
      "@type": "City",
      "name": "Recife"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Serviços de Fisioterapia Respiratória",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "MedicalService",
            "name": "Consulta Fisioterapia Respiratória",
            "description": "Avaliação e tratamento de problemas respiratórios infantis"
          },
          "price": "280.00",
          "priceCurrency": "BRL"
        }
      ]
    }
  };

  return (
    <>
      {/* Meta tags básicas */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:locale" content="pt_BR" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Outras meta tags importantes */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="author" content="Joanna Bomfim" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#e91e63" />
      <meta name="language" content="pt-BR" />
      <meta name="geo.region" content="BR-PE" />
      <meta name="geo.placename" content="Recife" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
    </>
  );
}; 