import { useState, useEffect } from "react";
import { SEOConfig, SEOResponse } from "@shared/seo";

export function useSEO() {
  const [seoConfig, setSeoConfig] = useState<SEOConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSEOConfig = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/seo");
        const data: SEOResponse = await response.json();
        
        if (data.success && data.data) {
          console.log('useSEO: Loaded config:', data.data);
          setSeoConfig(data.data);
        } else {
          console.error('useSEO: Failed to load config:', data);
          setError("Erro ao carregar configurações SEO");
        }
      } catch (err) {
        console.error("Error loading SEO config:", err);
        setError("Erro ao carregar configurações SEO");
      } finally {
        setLoading(false);
      }
    };

    loadSEOConfig();
  }, []);

  return { seoConfig, loading, error };
}
