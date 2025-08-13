import { useSEO } from "@/hooks/useSEO";
import SEOHead from "@/components/SEOHead";

export default function LandingPage() {
  const { seoConfig, loading, error } = useSEO();

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
    socialLinks: {},
  };

  const config = seoConfig || defaultConfig;

  return (
    <div className="min-h-screen bg-background">
      {/* Always inject SEO meta tags */}
      <SEOHead config={config} />

      {/* Optional: Show loading/error states for debugging */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 text-xs text-muted-foreground bg-background/80 p-2 rounded">
          SEO: {loading ? 'Loading...' : error ? 'Error' : 'Loaded'}
        </div>
      )}
    </div>
  );
}
