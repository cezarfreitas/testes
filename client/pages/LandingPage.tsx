import { useSEO } from "@/hooks/useSEO";
import SEOHead from "@/components/SEOHead";

export default function LandingPage() {
  const { seoConfig } = useSEO();

  return (
    <div className="min-h-screen bg-background">
      {/* Inject SEO meta tags */}
      {seoConfig && <SEOHead config={seoConfig} />}
    </div>
  );
}
