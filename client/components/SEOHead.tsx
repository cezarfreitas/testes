import { useEffect } from "react";
import { SEOConfig } from "@shared/seo";

interface SEOHeadProps {
  config: SEOConfig;
  pageTitle?: string;
  pageDescription?: string;
}

export default function SEOHead({
  config,
  pageTitle,
  pageDescription,
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title immediately - force override
    const title = pageTitle || config.title || "AdminFlow";
    document.title = title;

    // Also update the lang attribute if needed
    if (config.language) {
      document.documentElement.lang = config.language;
    }

    // Update description meta tag
    const description = pageDescription || config.description || "";
    let metaDesc = document.querySelector(
      'meta[name="description"]',
    ) as HTMLMetaElement;
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);

    // Update keywords meta tag
    if (config.keywords) {
      let metaKeywords = document.querySelector(
        'meta[name="keywords"]',
      ) as HTMLMetaElement;
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.setAttribute("name", "keywords");
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", config.keywords);
    }

    // Update Open Graph tags
    const ogTitle = config.ogTitle || title;
    if (ogTitle) {
      let ogTitleTag = document.querySelector(
        'meta[property="og:title"]',
      ) as HTMLMetaElement;
      if (!ogTitleTag) {
        ogTitleTag = document.createElement("meta");
        ogTitleTag.setAttribute("property", "og:title");
        document.head.appendChild(ogTitleTag);
      }
      ogTitleTag.setAttribute("content", ogTitle);
    }

    const ogDescription = config.ogDescription || description;
    if (ogDescription) {
      let ogDescTag = document.querySelector(
        'meta[property="og:description"]',
      ) as HTMLMetaElement;
      if (!ogDescTag) {
        ogDescTag = document.createElement("meta");
        ogDescTag.setAttribute("property", "og:description");
        document.head.appendChild(ogDescTag);
      }
      ogDescTag.setAttribute("content", ogDescription);
    }

    // Update favicon if provided
    if (config.favicon) {
      let faviconLink = document.querySelector(
        'link[rel="icon"]',
      ) as HTMLLinkElement;
      if (!faviconLink) {
        faviconLink = document.createElement("link");
        faviconLink.setAttribute("rel", "icon");
        document.head.appendChild(faviconLink);
      }
      faviconLink.setAttribute("href", config.favicon);
    }
  }, [config, pageTitle, pageDescription]);

  return null;
}
