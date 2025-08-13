import { useEffect } from "react";
import { SEOConfig } from "@shared/seo";

interface SEOHeadProps {
  config: SEOConfig;
  pageTitle?: string;
  pageDescription?: string;
}

export default function SEOHead({ config, pageTitle, pageDescription }: SEOHeadProps) {
  useEffect(() => {
    const updateMetaTags = () => {
      // Update document title
      const title = pageTitle || config.title;
      if (title) {
        document.title = title;
      }

      // Helper function to update or create meta tags
      const updateMetaTag = (name: string, content: string, property?: boolean) => {
        const attribute = property ? 'property' : 'name';
        let metaTag = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;

        if (!metaTag) {
          metaTag = document.createElement('meta');
          metaTag.setAttribute(attribute, name);
          document.head.appendChild(metaTag);
        }

        metaTag.setAttribute('content', content || '');
      };

      // Helper function to update link tags
      const updateLinkTag = (rel: string, href: string, sizes?: string, type?: string) => {
        if (!href) return;

        let linkTag = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
        
        if (!linkTag) {
          linkTag = document.createElement('link');
          linkTag.setAttribute('rel', rel);
          document.head.appendChild(linkTag);
        }
        
        linkTag.setAttribute('href', href);
        if (sizes) linkTag.setAttribute('sizes', sizes);
        if (type) linkTag.setAttribute('type', type);
      };

      // Basic SEO meta tags
      updateMetaTag('description', pageDescription || config.description);
      updateMetaTag('keywords', config.keywords);
      updateMetaTag('robots', config.robots);
      updateMetaTag('language', config.language);

      // Canonical URL
      if (config.canonical) {
        let canonicalTag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
        if (!canonicalTag) {
          canonicalTag = document.createElement('link');
          canonicalTag.setAttribute('rel', 'canonical');
          document.head.appendChild(canonicalTag);
        }
        canonicalTag.setAttribute('href', config.canonical);
      }

      // Open Graph meta tags
      updateMetaTag('og:title', config.ogTitle || title, true);
      updateMetaTag('og:description', config.ogDescription || pageDescription || config.description, true);
      updateMetaTag('og:image', config.ogImage, true);
      updateMetaTag('og:type', config.ogType, true);
      updateMetaTag('og:url', config.ogUrl || config.canonical, true);
      
      if (config.companyName) {
        updateMetaTag('og:site_name', config.companyName, true);
      }

      // Twitter Card meta tags
      updateMetaTag('twitter:card', config.twitterCard);
      updateMetaTag('twitter:title', config.twitterTitle || config.ogTitle || title);
      updateMetaTag('twitter:description', config.twitterDescription || config.ogDescription || pageDescription || config.description);
      updateMetaTag('twitter:image', config.twitterImage || config.ogImage);
      
      if (config.twitterSite) {
        updateMetaTag('twitter:site', config.twitterSite);
      }

      // Favicon and icons
      if (config.favicon) {
        updateLinkTag('icon', config.favicon, '32x32', 'image/x-icon');
        updateLinkTag('shortcut icon', config.favicon);
      }

      if (config.appleTouchIcon) {
        updateLinkTag('apple-touch-icon', config.appleTouchIcon, '180x180');
      }

      // Structured data for company
      if (config.companyName) {
        let scriptTag = document.querySelector('script[type="application/ld+json"]');
        if (!scriptTag) {
          scriptTag = document.createElement('script');
          scriptTag.setAttribute('type', 'application/ld+json');
          document.head.appendChild(scriptTag);
        }

        const structuredData = {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": config.companyName,
          "url": config.canonical || config.ogUrl,
          "logo": config.ogImage,
          "sameAs": Object.values(config.socialLinks).filter(Boolean)
        };

        scriptTag.textContent = JSON.stringify(structuredData);
      }
    };

    updateMetaTags();
  }, [config, pageTitle, pageDescription]);

  return null; // This component doesn't render anything
}
