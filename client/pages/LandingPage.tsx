import { useSEO } from "@/hooks/useSEO";
import SEOHead from "@/components/SEOHead";

export default function LandingPage() {
  const { seoConfig, loading, error } = useSEO();

  console.log('LandingPage: seoConfig=', seoConfig, 'loading=', loading, 'error=', error);

  return (
    <div className="min-h-screen bg-background">
      {/* Inject SEO meta tags */}
      {seoConfig && <SEOHead config={seoConfig} />}
      {loading && <div className="p-4">Carregando configurações SEO...</div>}
      {error && <div className="p-4 text-red-500">Erro: {error}</div>}
    </div>
  );
}
