export interface SEOConfig {
  // Basic SEO
  title: string;
  description: string;
  keywords: string;
  
  // Open Graph
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  ogUrl: string;
  
  // Twitter Cards
  twitterCard: 'summary' | 'summary_large_image';
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterSite: string;
  
  // Favicon and images
  favicon: string;
  appleTouchIcon: string;
  
  // Additional meta
  canonical: string;
  robots: string;
  language: string;
  
  // Social links
  companyName: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export interface SEOResponse {
  success: boolean;
  data?: SEOConfig;
  message?: string;
}

export interface UploadResponse {
  success: boolean;
  url?: string;
  message?: string;
}
