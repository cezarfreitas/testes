import { useSEO } from "@/hooks/useSEO";
import SEOHead from "@/components/SEOHead";

export default function LandingPage() {
  const { seoConfig } = useSEO();

  // Always inject SEO, even if config is null (will use default values)
  const defaultConfig = {
    title: "",
    description: "",
    keywords: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    ogType: "website",
    ogUrl: "",
    twitterCard: "summary_large_image" as const,
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
    twitterSite: "",
    favicon: "",
    appleTouchIcon: "",
    canonical: "",
    robots: "index, follow",
    language: "pt-BR",
    companyName: "",
    socialLinks: {}
  };

  const config = seoConfig || defaultConfig;

  return (
    <div className="min-h-screen bg-background">
      {/* Always inject SEO meta tags */}
      <SEOHead config={config} />
    </div>
  );
}
